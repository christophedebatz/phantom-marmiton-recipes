import { Page } from 'puppeteer'
import { Recipe } from '../step/dto'

export const resolveRecipeFilteringInfo = async (page: Page): Promise<Partial<Recipe>> => {
  const DOMSelector = 'RCP__sc-1qnswg8-1'
  
  return (await page.evaluate((DOMSelector: string): Partial<Recipe> => {
    const collection: Element[] = Array.from(document.getElementsByClassName(DOMSelector))
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
  }, DOMSelector) as Promise<Partial<Recipe>>)
}
