import { Page } from 'puppeteer'

export default class FilterHelper {
  
  /**
   * Finds and returns the filter descriptor from given filter item's name.
   *
   * @param name the filter item's name
   * @param descriptor the descriptor as a dictionary
   */
  public static findFilterItemDescriptor(name: string, descriptor: UrlFilterDescriptorType): UrlFilterItemDescriptorType | null {
    const foundItem = descriptor.items.filter(item => item.label === name).at(0)
    return typeof foundItem === 'undefined' ? null : foundItem
  }
  
  /**
   * Waits until filter item accordion is completed.
   *
   * @param page the Puppeteer page browser
   * @param timeout the timeout to never overpass
   */
  public static async waitForAccordionTransition(page: Page, timeout: number = 2000): Promise<void> {
    await page.waitForFunction(
      'document.evaluate(' +
      '     \'//div[@aria-expanded="true"]\', ' +
      '     document.body, ' +
      '     null, ' +
      '     XPathResult.FIRST_ORDERED_NODE_TYPE, ' +
      '     null' +
      ').singleNodeValue !== null',
      { timeout }
    )
  }
}
