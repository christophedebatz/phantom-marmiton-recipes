import { AbstractStepHandler } from '.'
import { Scrapper } from '../common/scrap'
import { PhantomRequest } from '../common/request/'
import { Page } from 'puppeteer'

export default class UserSummary extends AbstractStepHandler<null> {
  /**
   * @inheritDoc
   */
  public async handles (page: Page, request: PhantomRequest): Promise<StepHandlerReturnType<null>> {
    this.progress(0, 'Initializing...')
    this.message(`Started scrapping data from ${Scrapper.WebsiteBaseUrl}...`)
    this.message(`- Search query: "${request.query}"`)

    if (typeof request.pagesCount === 'undefined') {
      this.message('- Results limitation: no limitation set')
    } else {
      this.message(`- Results limitation: first ${request.pagesCount} results pages`)
    }

    return null
  }

  /**
   * @inheritDoc
   */
  public getRank (): number {
    return 0
  }
}
