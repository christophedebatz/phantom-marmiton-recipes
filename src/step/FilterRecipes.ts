import { Page } from 'puppeteer'
import { PhantomRequest } from '../common/request'
import { AbstractStepHandler } from '.'
import { FilterFactory } from '../filter'
import { Scrapper, waitFor } from '../common/scrap'

export default class FilterRecipes extends AbstractStepHandler<null> {
  
  public constructor (private readonly filterFactory: FilterFactory) {
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
  public async handles (page: Page, request: PhantomRequest): Promise<StepHandlerReturnType<null>> {
    this.progress(0, 'Creating filtering URL...')

    // filters cannot be undefined at this point since supports method checked it before
    const requestedFilters = request.filters as { [key: string]: FilterSafeValueType }
    const filters = this.filterFactory.buildFilters()
    const queryParts: string[] = []

    for (const filter of filters) {
      for (const filterName in requestedFilters) {
        if (filter.supports(filterName)) {
          const filterItem = requestedFilters[filterName] as Array<string> & boolean
          const partSearch = await filter.filters(page, filterItem)
          queryParts.push(`&${partSearch.toString()}`)
        }
      }
    }

    const urlParts = [`${Scrapper.WebsiteBaseUrl}/recettes/recherche.aspx`]
    urlParts.push(`?aqt=${encodeURIComponent(request.query)}`)
    urlParts.push(queryParts.join(''))

    this.message(`Not-paginated URL is ${urlParts.join('')}`)

    await page.goto(urlParts.join(''))
    await waitFor(1000)

    return null
  }

  /** s
   * @inheritDoc
   */
  public getRank (): number {
    return 2
  }
}
