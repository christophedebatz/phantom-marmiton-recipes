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
  
    console.log('--4--')
  
    await (async () => new Promise(resolve => setTimeout(resolve, 3500)))
    
    // try {
    //   await page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 7500 })
    // } catch (exception) {
    //   console.error('Unable to wait until page loaded after search has been sent.')
    // }
  
    console.log('--4--')
    console.log(page.url())
  
    return null
  }
  
  /**
   * @inheritDoc
   */
  public getRank (): number {
    return 3
  }
}
