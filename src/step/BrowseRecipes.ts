import { AbstractStepHandler } from '.'
import { Page } from 'puppeteer'
import { PhantomRequest } from '../common/request'
import { AsyncTaskService } from '../common/task'
import { Recipe } from './dto'
import { Scrapper } from '../common/scrap'

export default class BrowseRecipes extends AbstractStepHandler {

  public constructor (
    private readonly scheduler: AsyncTaskService,
    private readonly maxConcurrentTasks: number,
    private readonly recipesPerPage: number
  ) {
    super()
    this.scheduler = scheduler
    this.maxConcurrentTasks =  maxConcurrentTasks
    this.recipesPerPage = recipesPerPage
  }
  
  /**
   * @inheritDoc
   */
  public async handles (page: Page, request: PhantomRequest): Promise<StepHandlerReturnType<Recipe>> {
    const searchQueryResultsCount = await this.resolveSearchQueryResultsCount(page)
    const totalPagesCount = Math.ceil(searchQueryResultsCount / this.recipesPerPage)
    const totalPagesToGrab = typeof request.pagesCount === 'undefined' ? totalPagesCount : request.pagesCount
    
    let recipes: Recipe[] = []
    let currentPage = 1
    
    do {
      this.progress(
        currentPage / totalPagesToGrab,
        `Fetching recipes on page ${currentPage} / ${totalPagesToGrab}`
      )
      
      const recipesUrls = await this.resolveRecipesUrlsForCurrentPage(page)
      this.message(`Found ${recipesUrls.length} not-sponsored recipes on current page.`)
      const pageRecipes = await this.getRecipesForCurrentPage(recipesUrls)
  
      let hasNextPage = currentPage < totalPagesToGrab
      recipes = recipes.concat(pageRecipes)
      
      console.log('hasNextPage=', hasNextPage)
      
      if (!hasNextPage) {
        break
      }
  
      await this.navigateToPage(page, ++currentPage + 1)
      this.message(`Yet navigates to page #${currentPage +1}`)
      currentPage++
    } while (true)
    
    return recipes
  }
  
  /**
   * @inheritDoc
   */
  public getRank (): number {
    return 4
  }

  private async navigateToPage(page: Page, pageIndex: number): Promise<void> {
    const url = new URL(page.url())
    const params = new URLSearchParams(url.search)
    
    if (params.has('page')) {
      params.set('page', pageIndex.toString())
    } else {
      params.append('page', pageIndex.toString())
    }
   
    await page.goto(`${url.protocol}//${url.host}${url.pathname}?${params.toString()}`)
  }
  
  private async getRecipesForCurrentPage(recipesUrls: string[]): Promise<Recipe[]> {
    let recipesCount = 0
    let recipes: Recipe[] = []
  
    do {
      const batchedRecipesUrls: string[] = []
      const batchedRecipes: Promise<Recipe>[] = []
  
      for (let i = 0; i < this.maxConcurrentTasks; i++) {
        const poppedUrl = recipesUrls.pop()
        if (typeof poppedUrl !== 'undefined') {
          batchedRecipesUrls.push(poppedUrl)
        }
      }
    
      batchedRecipesUrls.forEach(recipeUrl => {
        const recipe = this.scheduler.schedule<string, Recipe>('lib-recipe-supplier.js', recipeUrl)
        batchedRecipes.push(recipe)
        recipesCount++
      })
    
      recipes = recipes.concat(await Promise.all(batchedRecipes))
    } while (recipesCount < this.recipesPerPage)
  
    return recipes
  }
  
  private async resolveRecipesUrlsForCurrentPage (page: Page): Promise<string[]> {
    return await page.evaluate((baseUri: string) => {
  
      // small function to recognize the sponsored recipes
      // that should not be taken into account
      const isSponsoredRecipe = (node: Node): boolean => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent !== null && node.textContent.includes('Sponsorisé')) {
          return true
        }
  
        if (node.hasChildNodes()) {
          return Array.from(node.childNodes)
            .filter(childNode => isSponsoredRecipe(childNode))
            .length > 0
        }
  
        return false
      }
      
      const urls: string[] = []
      const links = document.querySelectorAll('a.MRTN__sc-1gofnyi-2')
      links.forEach(link => {
        const relativeUrl = link.getAttribute('href')
        const isSponsored = isSponsoredRecipe(link)
        
        if (relativeUrl !== null && !isSponsored) {
          urls.push(`${baseUri}${relativeUrl}`)
        }
      })
      
      return urls
    }, Scrapper.WebsiteBaseUrl)
  }
  
  private async resolveSearchQueryResultsCount (page: Page) {
    return await page.evaluate(() => {
      const nodes = document.querySelectorAll('p.MuiTypography-root span')
      if (nodes.length > 0) {
        const resultsCountString = nodes.item(0).textContent
        if (resultsCountString !== null) {
          return parseInt(resultsCountString, 10)
        }
        return 0
      }
    })
  }
}
