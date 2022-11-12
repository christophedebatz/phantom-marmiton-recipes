import { Page } from 'puppeteer'
import { FilterHelper } from '.'
import { Filter, Filterable } from '../common/scrap'

export default class DishFilter implements Filterable<string[]> {
  
  private readonly filterDescriptor: FilterDescriptorType
  
  public constructor () {
    this.filterDescriptor = this.describesFilter()
  }
  
  /**
   * @inheritDoc
   */
  public supports (name: FilterType): boolean {
    return name === this.filterDescriptor.type
  }
  
  /**
   * @inheritDoc
   */
  public async filters (page: Page, filterItems: string[]): Promise<void> {
    const menuItem = await page.waitForXPath(this.filterDescriptor.xpath, { visible: true })
    await menuItem.click()
  
    console.log('--6 dish--')
  
    const filterItemSelectors: string[] = []
    for (const filterItem of filterItems) {
      const itemConfig = FilterHelper.findFilterItemDescriptor(filterItem, this.filterDescriptor)
      
      // apply filter only if filter item config has been found
      if (itemConfig) {
        filterItemSelectors.push(itemConfig.xpath)
      }
    }
    
    for (const itemSelector of filterItemSelectors) {
      const menuFilterItem = await page.waitForXPath(itemSelector, { visible: true })
      await FilterHelper.waitForAccordionTransition(page)
      await menuFilterItem.click()
      await FilterHelper.waitFor(500)
    }
  }
  
  private describesFilter (): FilterDescriptorType {
    return {
      type: Filter.Dish,
      xpath: '//p[text()="Type de plat"]/../../..',
      items: [
        { label: 'Starters', xpath: '//button[text()="Entrée"]' },
        { label: 'Main courses', xpath: '//button[text()="Plat principal"]' },
        { label: 'Desserts', xpath: '//button[text()="Dessert"]' },
        { label: 'Appetizers', xpath: '//button[text()="Amuse-gueule"]' },
        { label: 'Garnitures', xpath: '//button[text()="Accompagnement"]' },
        { label: 'Sauces', xpath: '//button[text()="Sauce"]' },
        { label: 'Drinks', xpath: '//button[text()="Boisson"]' },
        { label: 'Candies', xpath: '//button[text()="Confiserie"]' }
      ]
    }
  }
}
