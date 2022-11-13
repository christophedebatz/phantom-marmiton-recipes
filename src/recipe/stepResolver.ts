import { Page } from 'puppeteer'
import { Recipe } from '../step/dto'

/**
 * Resolves and returns all the recipe steps summary.
 *
 * @param page the Puppeteer page objet
 */
export const resolveRecipeSteps = async (page: Page): Promise<Partial<Recipe>> => {
  const DOMSelector = 'RCP__sc-1wtzf9a-3'
  
  return ( await page.evaluate((DOMSelector: string): Partial<Recipe> => {
    const steps: string[] = []
    const collection: Element[] = Array.from(document.getElementsByClassName(DOMSelector))
    
    collection.forEach(node => {
      if (node.textContent !== null) {
        steps.push(node.textContent)
      }
    })
    
    return { steps }
  }, DOMSelector) )
}
