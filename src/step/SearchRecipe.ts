import { Page } from 'puppeteer'
import { PhantomRequest } from '../common/request'
import { AbstractStepHandler } from '.'
import { Recipe } from './dto'

export default class SearchRecipe extends AbstractStepHandler {
  
  /**
   * @inheritDoc
   */
  public async handles (page: Page, request: PhantomRequest): Promise<StepHandlerReturnType<Recipe>> {
    this.progress(0, 'Executing search query')
  
    console.log('--3--')
  
    await page.waitForSelector("input[type='search']", { visible: true })
    await page.type("input[type='search']", request.query)
    await page.keyboard.press('Enter')
  
    try {
      await page.waitForNavigation({ waitUntil: ['domcontentloaded'], timeout: 10000 })
    } catch (exception) {
      console.error('Unable to wait until page loaded after search has been sent.')
    }
  
    console.log('url=', page.url())
  
    return null
  }
  
  /**
   * @inheritDoc
   */
  public getRank (): number {
    return 3
  }
}
