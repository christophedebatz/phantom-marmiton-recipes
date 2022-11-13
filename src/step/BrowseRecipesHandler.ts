import { AbstractStepHandler } from '.'
import { Page } from 'puppeteer'
import { PhantomRequest } from '../common/request'
import { AsyncTaskException, SchedulerService } from '../common/task'
import { Recipe } from './dto'
import { Scrapper } from '../common/scrap'

export default class BrowseRecipesHandler extends AbstractStepHandler<Recipe[]> {
  
  public constructor (
    private readonly scheduler: SchedulerService,
    private readonly maxConcurrentTasks: number,
    private readonly recipesPerPage: number
  ) {
    super()
    this.scheduler = scheduler
    this.maxConcurrentTasks = maxConcurrentTasks
    this.recipesPerPage = recipesPerPage
  }

  /**
   * @inheritDoc
   */
  public async handles (page: Page, request: PhantomRequest): Promise<StepHandlerReturnType<Recipe[]>> {
    const searchQueryResultsCount = await this.resolveSearchQueryResultsCount(page)
    const totalPagesCount = Math.ceil(searchQueryResultsCount / this.recipesPerPage)
    const totalPagesToGrab = typeof request.pagesCount === 'undefined' ? totalPagesCount : request.pagesCount

    this.message(`${searchQueryResultsCount} search results, ${totalPagesCount} pages count (${totalPagesToGrab} pages to scrap)`)

    const recipes: Recipe[] = []
    let currentPage = 1

    do {
      this.progress(
        currentPage / totalPagesToGrab,
        `Fetching recipes on page ${currentPage} / ${totalPagesToGrab}`
      )

      const recipesUrls = await this.resolveRecipesUrlsForCurrentPage(page)
      const pageRecipes = await this.getRecipesForCurrentPage(recipesUrls)

      const hasNextPage = currentPage < totalPagesToGrab
      pageRecipes.forEach(recipe => recipes.push(recipe))

      if (!hasNextPage) {
        break
      }

      await this.navigateToPage(page, currentPage + 1)
      this.message(`Now navigates to page #${currentPage + 1}`)
      currentPage++
    } while (true)

    return recipes
  }

  /**
   * @inheritDoc
   */
  public getRank (): number {
    return 3
  }

  private async navigateToPage (page: Page, pageIndex: number): Promise<void> {
    const url = new URL(page.url())
    const params = new URLSearchParams(url.search)

    params.has('page')
      ? params.set('page', pageIndex.toString())
      : params.append('page', pageIndex.toString())

    const nextUrl = `${url.protocol}//${url.host}${url.pathname}?${params.toString()}`
    await page.goto(nextUrl, { waitUntil: 'domcontentloaded' })
  }

  private async getRecipesForCurrentPage (recipesUrls: string[]): Promise<Recipe[]> {
    const recipes: Recipe[] = []
    let recipesCount = 0

    do {
      const batchedRecipesUrls: string[] = []
      const batchedRecipes: Array<Promise<Recipe>> = []

      for (let i = 0; i < this.maxConcurrentTasks; i++) {
        const poppedUrl = recipesUrls.pop()
        if (typeof poppedUrl !== 'undefined') {
          batchedRecipesUrls.push(poppedUrl)
        }
      }
  
      this.message(`Just managed ${batchedRecipesUrls.length} new URLs`)
  
      if (batchedRecipesUrls.length === 0) {
        break
      }

      batchedRecipesUrls.forEach(recipeUrl => {
        try {
          const recipe = this.scheduler.schedule<WorkerThreadPayloadType, Recipe>(
            'lib-recipe-supplier.js', { url: recipeUrl })
          batchedRecipes.push(recipe)
          recipesCount++
        } catch (ex) {
          if (ex instanceof AsyncTaskException) {
            this.failure(`Unable to push some async job, given error is "${ex.message}"`)
          }
        }
      })

      const recipesResults = await Promise.all(batchedRecipes)
      recipesResults.forEach(recipe => recipes.push(recipe))

      // uncompleted last batch
      if (batchedRecipesUrls.length < this.maxConcurrentTasks) {
        break
      }
    } while (recipesCount <= this.recipesPerPage)

    return recipes
  }

  private async resolveRecipesUrlsForCurrentPage (page: Page): Promise<Array<string>> {
    return (await page.evaluate((baseUri: string): string[] => {
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
  
      const recipesUrls: string[] = []
      const recipeLinks = document.querySelectorAll('a.MRTN__sc-1gofnyi-2')
  
      recipeLinks.forEach(recipeLink => {
        const relativeUrl = recipeLink.getAttribute('href')
        const isSponsored = isSponsoredRecipe(recipeLink)
    
        if (relativeUrl !== null && !isSponsored) {
          recipesUrls.push(`${baseUri}${relativeUrl}`)
        }
      })
  
      return recipesUrls
    }, Scrapper.WebsiteBaseUrl) as Array<string>)
  }

  private async resolveSearchQueryResultsCount (page: Page): Promise<number> {
    return (await page.evaluate((): number => {
      const nodes = document.querySelectorAll('p.MuiTypography-root span')
      if (nodes.length > 0) {
        const resultsCountString = nodes.item(0).textContent
        if (resultsCountString !== null) {
          return parseInt(resultsCountString, 10)
        }
      }
      return 0
    }) as number)
  }
}
