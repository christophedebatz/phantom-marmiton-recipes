import { Page } from 'puppeteer'
import { FilterHelper } from '.'
import { Filter, Filterable } from '../common/scrap'

export default class DishFilter implements Filterable<string[]> {
  
  private readonly filterDescriptor: UrlFilterDescriptorType
  
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
  public async filters (page: Page, filterItems: string[]): Promise<URLSearchParams> {
    const params = new URLSearchParams()
    
    for (const filterItem of filterItems) {
      const itemConfig = FilterHelper.findFilterItemDescriptor(filterItem, this.filterDescriptor)
      
      // apply filter only if filter item config has been found
      if (itemConfig) {
        params.append(this.filterDescriptor.query, itemConfig.value)
      }
    }

    return params
  }
  
  
  private describesFilter (): UrlFilterDescriptorType {
    return {
      type: Filter.Dish,
      query: 'dt',
      items: [
        { label: 'Starters', value: 'entree' },
        { label: 'Main courses', value: 'platprincipal'},
        { label: 'Desserts', value: 'dessert' },
        { label: 'Appetizers', value: 'amusegueule' },
        { label: 'Garnitures', value: 'accompagnement' },
        { label: 'Sauces', value: 'sauce' },
        { label: 'Drinks', value: 'boisson' },
        { label: 'Candies', value: 'confiserie' },
        { label: 'Advice', value: 'conseil' }
      ]
    }
  }
}
