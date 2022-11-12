import { Page } from 'puppeteer'
import PhantomRequest from '../request/PhantomRequest'
import Listenable from './Listenable'

/**
 * Represents the handlers that do each a part of the scrapping job.
 */
export default interface StepHandler<T> {
  
  /**
   * Returns whether the handler can carry on the given request payload.
   *
   * @param request whether the handler supports the request payload
   */
  supports(request: PhantomRequest): boolean
  
  /**
   * Returns the result of the step handling process.
   * The returned type depends on the step.
   *
   * @param page the Puppeteer page browser
   * @param request the request payload
   */
  handles(page: Page, request: PhantomRequest): Promise<T>

  /**
   * Attaches some listener to follow the handler's progression.
   *
   * @param listeners the listeners to attach
   */
  attachListeners(listeners: Listenable[]): void
  
  /**
   * Returns the handler's rank.
   * Just keep in mind that the smaller rank will always have the priority than higher rank values
   *
   * @return the handler's rank
   */
  getRank(): number
}
