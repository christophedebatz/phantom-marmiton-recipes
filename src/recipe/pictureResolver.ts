import { Page } from 'puppeteer'
import { Recipe } from '../step/dto'

export const resolvePicturesOnVideoPage = async (page: Page): Promise<Array<string>> => {
  try {
    const button = await page.waitForSelector('div.SHRD__sc-1rqpopx-2', { timeout: 2000 })
    await button.click()
  } catch (exception) {
    return Promise.resolve([])
  }

  const DOMSelector = 'div.SHRD__sc-1u48ztc-1 img'
  const picturesUrlsPromise = await page.evaluate((DOMSelector: string): Array<string> => {
    const picturesUrls: string[] = []
    document.querySelectorAll(DOMSelector).forEach((node: Element) => {
      const pictureUrl = node.getAttribute('src')
      if (pictureUrl !== null) {
        picturesUrls.push(pictureUrl)
      }
    })
    
    return picturesUrls
  }, DOMSelector)
  
  const closeButton = await page.waitForXPath('//button[@aria-label="Fermer"]')
  await closeButton.click()
  
  return picturesUrlsPromise
}

export const resolvePicturesOnPage = async (page: Page): Promise<Array<string>> => {
  try {
    const button = await page.waitForSelector('div.RCP__sc-40fnuy-1 img', { timeout: 2000 })
    await button.click()
  } catch (exception) {
    return Promise.resolve([])
  }
  
  const DOMSelector = 'div.SHRD__sc-112yd0x-1 img'
  
  const picturesUrls = await page.evaluate((DOMSelector: string) => {
    const picturesUrls: string[] = []
    document.querySelectorAll(DOMSelector).forEach(node => {
      const pictureUrl = node.getAttribute('data-src')
      if (pictureUrl !== null) {
        picturesUrls.push(pictureUrl)
      }
    })
    return picturesUrls
  }, DOMSelector)
  
  const closeButton = await page.waitForXPath('//button[@aria-label="Fermer"]')
  await closeButton.click()
  
  return picturesUrls
}

export const resolveRecipePictures = async (page: Page, url: string): Promise<Partial<Recipe>> => {
  const isVideoPage: boolean = await page.evaluate((): boolean =>
    document.getElementsByClassName('dailymotion-player-wrapper').length >= 1
  )
  
  if (isVideoPage) {
    const picturesUrls = await resolvePicturesOnVideoPage(page)
    return { picturesUrls }
  }
  
  const picturesUrls = await resolvePicturesOnPage(page)
  return { picturesUrls }
}
