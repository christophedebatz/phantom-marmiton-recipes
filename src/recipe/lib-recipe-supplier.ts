import puppeteer, { Page } from 'puppeteer'
import { Recipe } from '../step/dto/index'
const { parentPort, isMainThread, workerData } = require('worker_threads')

export default class LibRecipeSupplier {
  
  public async get(): Promise<Recipe> {
    return new Promise<Recipe>(async (resolve, reject) => {
      if (typeof workerData !== 'object' || !workerData.hasOwnProperty('payload')) {
        return reject(new Error('Worker data must have some "payload" property that contains the URL.'))
      }
  
      const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
      })
  
      const page = await browser.newPage()
      await page.goto(workerData.payload)
      console.log('url supplier=', workerData.payload)
      
      try {
        await page.waitForNavigation({ waitUntil: ['domcontentloaded'], timeout: 5000 })
      } catch (exception) {
        console.error(`Cannot proceed to parsing for URL ${workerData.payload} because of timeout overpassed!`)
        console.error('Yet ignore this result...')
      }
  
      // old fashioned-style is mandatory because of es2015 running context here
      const recipe = Object.assign(
        { url: workerData.payload },
        await this.resolveRecipeName(page),
        await this.resolveRecipeSteps(page),
        await this.resolveRecipePictures(page),
        await this.resolveRecipeFilteringInfo(page)
      )
      
      console.log('ok recipe')
      
      await page.close()
      await browser.close()
  
      resolve(recipe)
    })
  }
  
  private async resolveRecipeName(page: Page): Promise<Partial<Recipe>> {
    const DOMSelector = 'h1'
  
    return await page.evaluate(DOMSelector => {
      const collection = Array.from(document.getElementsByTagName(DOMSelector))
      
      const name = collection.pop()
      if (typeof name !== 'undefined') {
        return { name: name.textContent }
      }
      
      return {}
    }, DOMSelector)
  }
  
  private async resolveRecipeFilteringInfo(page: Page): Promise<Partial<Recipe>> {
    const DOMSelector = 'RCP__sc-1qnswg8-1'
    
    return await page.evaluate(DOMSelector => {
      const collection = Array.from(document.getElementsByClassName(DOMSelector))
      let partialRecipe: Partial<Recipe> = {}
      
      const cost = collection.pop()
      if (typeof cost !== 'undefined') {
        partialRecipe = {
          cost: cost.textContent === null ? undefined : cost.textContent
        }
      }
      
      const difficulty = collection.pop()
      if (typeof difficulty !== 'undefined') {
        partialRecipe = Object.assign(
          partialRecipe,
          { difficulty: difficulty.textContent === null ? undefined : difficulty.textContent }
        )
      }
  
      const duration = collection.pop()
      if (typeof duration !== 'undefined') {
        partialRecipe = Object.assign(
          partialRecipe,
          { duration: duration.textContent === null ? undefined : duration.textContent }
        )
      }
  
      return partialRecipe
    }, DOMSelector)
  }
  
  private async resolveRecipeSteps (page: Page): Promise<Partial<Recipe>> {
    const DOMSelector = 'RCP__sc-1wtzf9a-3'
  
    return await page.evaluate(DOMSelector => {
      const steps: string[] = []
      const collection = Array.from(document.getElementsByClassName(DOMSelector))
  
      collection.forEach(node => {
        if (node.textContent !== null) {
          steps.push(node.textContent)
        }
      })
      
      return { steps }
    }, DOMSelector)
  }
  
  private async resolveRecipePictures (page: Page): Promise<Partial<Recipe>> {
    const DOMSelector = 'div.SHRD__sc-1rqpopx-2 img'

    return await page.evaluate(DOMSelector => {
      const picturesUrls: string[] = []
      document.querySelectorAll(DOMSelector).forEach(node => {
        const pictureUrl = node.getAttribute('src')
        if (pictureUrl !== null) {
          picturesUrls.push(pictureUrl)
        }
      })
    
      return { picturesUrls }
    }, DOMSelector)
  }
}

if (!isMainThread) {
  const recipeSupplier = new LibRecipeSupplier()
  
  // promise used here because still inside es2015 context
  recipeSupplier.get()
    .then(recipe => {
        if (typeof parentPort !== 'undefined') {
          parentPort.postMessage(recipe)
        }
      })
}



