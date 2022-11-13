import { Page } from 'puppeteer'
import { PhantomRequest } from '../common/request'
import { AbstractStepHandler } from '.'

export default class SearchRecipe extends AbstractStepHandler<null> {
  /**
   * @inheritDoc
   */
  public supports (request: PhantomRequest): boolean {
    return typeof request.filters === 'undefined'
  }

  /**
   * @inheritDoc
   */
  public async handles (page: Page, request: PhantomRequest): Promise<StepHandlerReturnType<null>> {
    this.progress(0, 'Executing search query')

    await page.waitForSelector("input[type='search']", { visible: true })
    await page.type("input[type='search']", request.query)
    await page.keyboard.press('Enter')

    try {
      await page.waitForNavigation({ waitUntil: ['domcontentloaded'], timeout: 3500 })
    } catch (exception) {
      console.error('Unable to wait until page loaded after search has been sent.')
    }

    return null
  }

  /**
   * @inheritDoc
   */
  public getRank (): number {
    return 2
  }
}
