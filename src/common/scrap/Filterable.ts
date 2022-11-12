import { Page } from 'puppeteer'

/**
 * Represents a filter that can be used to target some types of recipes.
 */
export default interface Filterable<T> {
  
  /**
   * Returns whether the filter supports the filter designed by the given name.
   *
   * @param name the filter name
   *
   * @return whether the filter supports given filter name
   */
  supports (name: string): boolean
  
  /**
   * Applies the filtering process to the scrapped page according to the requested filters.
   *
   * @param page the Puppeteer page browser
   * @param filterItems the requested filters
   */
  filters (page: Page, filterItems: T): Promise<void>
}
