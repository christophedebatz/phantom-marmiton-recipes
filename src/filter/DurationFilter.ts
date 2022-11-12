import { Page } from 'puppeteer'
import { FilterHelper } from '.'
import { Filter, Filterable } from '../common/scrap'

export default class DurationFilter implements Filterable<string[]> {
  
  private readonly filterDescriptor: UrlFilterDescriptorType = this.describesFilter()
  
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
      type: Filter.Duration,
      query: 'ttlt',
      items: [
        { label: 'Less than 15mns', value: '15'},
        { label: 'Less than 30mns', value: '30'},
        { label: 'Less than 45mns', value: '45'}
      ]
    }
  }
}
