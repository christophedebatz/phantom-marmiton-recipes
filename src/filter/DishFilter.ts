import { Page } from 'puppeteer'
import { Filter, Filterable } from '../common/scrap'
import { findFilterItemDescriptor } from './filterTools'

export default class DishFilter implements Filterable<string[]> {
  private readonly filterDescriptor: UrlFilterDescriptorType = this.describesFilter()

  /**
   * @inheritDoc
   */
  public supports (name: string): boolean {
    return name === this.filterDescriptor.type
  }

  /**
   * @inheritDoc
   */
  public async filters (page: Page, filterItems: string[]): Promise<URLSearchParams> {
    const params = new URLSearchParams()

    for (const filterItem of filterItems) {
      const itemConfig = findFilterItemDescriptor(filterItem, this.filterDescriptor)

      // apply filter only if filter item config has been found
      if (itemConfig != null) {
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
        { label: 'Main courses', value: 'platprincipal' },
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
