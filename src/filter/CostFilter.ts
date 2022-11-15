import { Page } from 'puppeteer'
import { Filter, Filterable } from '../common/scrap'
import { findFilterItemDescriptor } from './'

export default class CostFilter implements Filterable<string[]> {
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
      type: Filter.Cost,
      query: 'exp',
      items: [
        { label: 'Cheap', value: '1' },
        { label: 'Medium-priced', value: '2' },
        { label: 'Quiet expensive', value: '3' }
      ]
    }
  }
}
