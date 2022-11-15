import { Page } from 'puppeteer'
import { PhantomRequest } from '../common/request'
import { AbstractStepHandler } from '.'
import { tryCloseCookiePopin } from '../common/scrap'

export default class CloseCookiePopinHandler extends AbstractStepHandler<null> {
  /**
   * @inheritDoc
   */
  public async handles (page: Page, request: PhantomRequest): Promise<StepHandlerReturnType<null>> {
    try {
      await tryCloseCookiePopin(page)
    } catch (ex) {
      // do nothing
    }
    return null
  }

  /**
   * @inheritDoc
   */
  public getRank (): number {
    return 1
  }
}
