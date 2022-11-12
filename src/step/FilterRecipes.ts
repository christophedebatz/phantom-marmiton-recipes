import { Page } from 'puppeteer'
import { Recipe } from './dto/index'
import { PhantomRequest } from '../common/request/index'
import { AbstractStepHandler } from './index'
import { FilterFactory } from '../filter/index'

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
    this.progress(0, 'Filtering...')
  
    await page.waitForSelector('button[aria-label="Filtrer"]', { visible: true })
    await page.click('button[aria-label="Filtrer"]')
    
    // filters cannot be undefined at this point since support method checked it before
    const requestFilters = request.filters as { [key: string]: FilterSafeValueType }
  
    const filters = this.filterFactory.buildFilters()
    
    for (const filter of filters) {
      for (const filterName in requestFilters) {
        if (filter.supports(filterName)) {
          await filter.filters(page, requestFilters[filterName])
        }
      }
    }
    
    const saveButton = await page.waitForXPath('//button[text()="Enregistrer"]', { visible: true })
    await saveButton.click()
  
    return null
  }
  
  /**
   * @inheritDoc
   */
  public getRank (): number {
    return 2
  }
}
