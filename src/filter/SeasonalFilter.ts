import { Page } from 'puppeteer'
import { Filter, Filterable } from '../common/scrap'

export default class SeasonalFilter implements Filterable<boolean> {
  
  /**
   * @inheritDoc
   */
  public supports (name: FilterType): boolean {
    return name === Filter.Seasonal
  }
  
  /**
   * @inheritDoc
   */
  public async filters (page: Page, filterItem: boolean): Promise<URLSearchParams> {
    const param = new URLSearchParams()
    param.append('type', 'season')
    return param
  }
}
