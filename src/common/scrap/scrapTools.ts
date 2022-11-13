import { Page } from 'puppeteer'

/**
 * Tries to close the cookie overlay if the popin appears on the DOM on a time lesser than the given timeout.
 *
 * @param page the Pupeteer page
 * @param timeout the timeout
 */
export const tryCloseCookiePopin = async (page: Page, timeout = 2000): Promise<void> => {
  const cookiePopin = await page.waitForSelector('#didomi-notice-agree-button', { timeout })
  await cookiePopin.click()
}

/**
 * Emulates function page.waitFor that actually throw a notImplementedException when called.
 * Just pause the main js thread for the given amount of milliseconds.
 *
 * @param delayMs the waiting time in ms
 */
export const waitFor = async (delayMs: number): Promise<void> => {
  await (async () => await new Promise<void>(resolve => setTimeout(resolve, 2000)))
}
