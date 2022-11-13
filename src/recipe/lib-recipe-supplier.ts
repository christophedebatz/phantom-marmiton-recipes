import puppeteer, { Page } from 'puppeteer'
import { Recipe } from '../step/dto'

import { parentPort, isMainThread, workerData } from 'worker_threads'
import { resolveRecipeFilteringInfo } from './filteringInfoResolver'
import { resolveRecipeSteps } from './stepResolver'
import { resolveRecipePictures } from './pictureResolver'
import { resolveRecipeName } from './nameResolver'
import { tryCloseCookiePopin, waitFor } from '../common/scrap'

class LibRecipeSupplier {
  
  /**
   * Returns some recipe data directly from the Marmiton website pages.
   */
  public async get (): Promise<Recipe> {
    return new Promise<Recipe>(async (resolve: (recipe: Recipe) => void) => {
      const { payload: { url }} = workerData as { payload: WorkerThreadPayloadType }
      
      await this.executeOnRecipePageContext(url, async (page: Page) =>
        resolve(Object.assign(
          { url },
          await resolveRecipeName(page),
          await resolveRecipeSteps(page),
          await resolveRecipePictures(page, url),
          await resolveRecipeFilteringInfo(page)
        ) as Recipe)
      )
    })
  }
  
  private async executeOnRecipePageContext(url: string, callback: (page: Page) => Promise<void>): Promise<void> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    })
    
    const page: Page = await browser.newPage()
    await page.goto(url)
    
    let timeout = 2000
    do {
      try {
        await waitFor(timeout)
        await page.waitForNavigation({ waitUntil: ['domcontentloaded'], timeout: 0 })
        break
      } catch (navException) {
        try {
          await tryCloseCookiePopin(page)
        } catch (closeException) {
          // do nothing here
        }
        timeout *= 2
      }
    } while (timeout < 5000)
  
    try {
      return await callback(page)
    } catch (exception) {
      if (exception instanceof Error) {
        console.error(`Could not execute on recipe page context, given error is "${exception.message}".`)
      }
    } finally {
      await page.close()
      await browser.close()
    }
  }
}

(async () => {
  if (!isMainThread) {
    const recipeSupplier = new LibRecipeSupplier()
    const recipe = await recipeSupplier.get()
    if (parentPort !== null) {
      parentPort.postMessage(recipe)
    }
  }
})()
