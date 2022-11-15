import { Page } from 'puppeteer'
import { Recipe } from '../step/dto'

export const resolveRecipeName = async (page: Page): Promise<Partial<Recipe>> => {
  const DOMSelector = 'h1'
  
  return (await page.evaluate((DOMSelector: string): Partial<Recipe> => {
    const collection: Element[] = Array.from(document.getElementsByTagName(DOMSelector))
    
    const name = collection.pop()
    if (typeof name !== 'undefined') {
      return name.textContent ? { name: name.textContent } : {}
    }
    
    return {}
  }, DOMSelector) as Promise<Partial<Recipe>>)
}
