import { Page } from 'puppeteer'

export default class ScrapHelper {
  
  public static async tryCloseCookiePopin (page: Page, fireAndForget: boolean = false, timeout: number = 2000): Promise<void> {
    const cookiePopin = await page.waitForSelector('#didomi-notice-agree-button', { timeout })
    await cookiePopin.click()
  
    if (fireAndForget) {
      page
        .waitForSelector('.q_onboard_close', { timeout: 1000 * 60 })
        .then(async element => await element.click())
        .catch(() => void 0)
    }
  }
  
  /**
   * Emulates function page.waitFor that actually throw a notImplementedException when called.
   * Just pause the main js thread for the given amount of milliseconds.
   *
   * @param delayMs the waiting time in ms
   */
  public static async waitFor(delayMs: number): Promise<void> {
    await (async () => new Promise<void>(resolve => setTimeout(resolve, 2000)))
  }
}
