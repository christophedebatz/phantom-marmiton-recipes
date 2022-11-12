import { Page } from 'puppeteer'
import { Recipe } from './dto/index'
import { PhantomRequest } from '../common/request/index'
import { AbstractStepHandler } from './index'
import { FilterFactory } from '../filter/index'
import { Scrapper } from '../common/scrap/index'

export default class FilterRecipes extends AbstractStepHandler {
  
  public constructor (private filterFactory: FilterFactory) {
    super()
  }
  
  /**
   * @inheritDoc
   */
  public supports (request: PhantomRequest): boolean {
    return typeof request.filters !== 'undefined'
  }
  
  /**
   * @inheritDoc
   */
  public async handles (page: Page, request: PhantomRequest): Promise<StepHandlerReturnType<Recipe>> {
    this.progress(0, 'Creating filtering URL...')
  
    // filters cannot be undefined at this point since supports method checked it before
    const requestedFilters = request.filters as { [key: string]: FilterSafeValueType }
  
    const filters = this.filterFactory.buildFilters()
    const queryParts: string[] = []
    
    for (const filter of filters) {
      for (const filterName in requestedFilters) {
        if (filter.supports(filterName)) {
          const partSearch = await filter.filters(page, requestedFilters[filterName])
          queryParts.push(`&${partSearch.toString()}`)
        }
      }
    }
  
    const urlParts = [`${Scrapper.WebsiteBaseUrl}/recettes/recherche.aspx`]
    urlParts.push(`?aqt=${encodeURIComponent(request.query)}`)
    urlParts.push(queryParts.join(''))
    
    const res = await page.goto(urlParts.join(''))
    await page.waitForNavigation()
    
    console.log('on est sur la page')
    
    return null
  }
  
  /**
   * @inheritDoc
   */
  public getRank (): number {
    return 2
  }
}
