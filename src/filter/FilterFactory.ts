import { DishFilter } from '.'
import { Filterable } from '../common/scrap'

export default class FilterFactory {
  
  /**
   * Builds and returns some useful filters.
   * Includes only filters you want to be available for Phantom user.
   *
   * @return a collection of available filters
   */
  public buildFilters(): Filterable<FilterSafeValueType>[] {
      return [
        new DishFilter()
      ]
  }
}
