import puppeteer from 'puppeteer'
import { StepHandler } from './index'
import PhantomRequest from '../request/PhantomRequest'
import Listenable from './Listenable'
import { Recipe } from '../../step/dto/index'

export default class Scrapper {
  
  public static WebsiteBaseUrl: string = 'https://www.marmiton.org'

  private readonly listeners: Listenable[] = []
  
  public constructor(private readonly handlers: StepHandler<StepHandlerReturnType<Recipe>>[]) {
    this.handlers = handlers;
  }
  
  public async scrap(request: PhantomRequest): Promise<Recipe[]> {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"]
    })
    
    const page = await browser.newPage()
    let recipes: Recipe[] = []
    
    for (const handler of this.handlers) {
      if (!handler.supports(request)) {
        continue
      }
      if (this.listeners.length > 0) {
        handler.attachListeners(this.listeners)
      }
      const recipe = await handler.handles(page, request)
      if (recipe !== null) {
        recipes = recipes.concat(recipe)
      }
    }
  
    await page.close()
    await browser.close()
    
    return recipes
  }
  
  public attachListener(listener: Listenable): void {
    this.listeners.push(listener)
  }
}
