import { Page } from 'puppeteer'
import { Filter, Filterable } from '../common/scrap'
import { findFilterItemDescriptor } from './filterTools'

export default class DifficultyFilter implements Filterable<string[]> {
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
      type: Filter.Difficulty,
      query: 'dif',
      items: [
        { label: 'Very easy', value: '1' },
        { label: 'Easy', value: '2' },
        { label: 'Medium', value: '3' },
        { label: 'Hard', value: '4' }
      ]
    }
  }
}
