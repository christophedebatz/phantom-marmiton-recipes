import { Page } from 'puppeteer'
import { Recipe } from './dto/index'
import { PhantomRequest } from '../common/request/index'
import { AbstractStepHandler } from './index'

export default class CloseCookiePopin extends AbstractStepHandler {
  
  /**
   * @inheritDoc
   */
  public async handles (page: Page, request: PhantomRequest): Promise<StepHandlerReturnType<Recipe>> {
    const timeout = 3500
    console.log('--1--')
    try {
      const cookiePopin = await page.waitForSelector('#didomi-notice-agree-button', { timeout })
      await cookiePopin.click()
      this.message('Just closed the cookie policy popin...')
    } catch (exception) {
      this.message(`Unable to detect the cookie policy popin after ${timeout}`)
    }
  
    page
      .waitForSelector('.q_onboard_close', { timeout: 1000 * 60 })
      .then(async element => await element.click())
      .catch(() => void 0)
    
    //
    // await page.evaluate(`
    //   const target = document.querySelector('body');
    //   const observer = new MutationObserver( mutations => {
    //     for (const mutation of mutations) {
    //       if (mutation.type === 'childList') {
    //         const addedNode = mutation.addedNodes.item(0)
    //         console.log('added node detected:', addedNode)
    //         //qiota_onboard
    //       }
    //     }
    //   });
    //   observer.observe(target, { childList: true });
    // `);
    //
    // console.log('--2--')
  
    return null
  }
  
  /**
   * @inheritDoc
   */
  public getRank (): number {
    return 1
  }
}
