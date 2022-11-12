import { Page } from 'puppeteer'
import { PhantomRequest } from '../common/request/index'
import { AbstractStepHandler } from './index'
import { ScrapHelper } from '../common/scrap/index'

export default class CloseCookiePopin extends AbstractStepHandler<null> {
  
  /**
   * @inheritDoc
   */
  public async handles (page: Page, request: PhantomRequest): Promise<StepHandlerReturnType<null>> {
    await ScrapHelper.tryCloseCookiePopin(page, true)
    return null
  }
  
  /**
   * @inheritDoc
   */
  public getRank (): number {
    return 1
  }
}
