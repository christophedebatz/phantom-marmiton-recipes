import { Page } from 'puppeteer'
import { PhantomRequest } from '../common/request/'
import { StepHandler, Listenable } from '../common/scrap'

/**
 * Provides some common methods that all step handlers can use.
 */
export default abstract class AbstractStepHandler<T> implements StepHandler<StepHandlerReturnType<T>> {
  
  private listeners: Listenable[] = []
  
  /**
   * @inheritDoc
   */
  public abstract getRank (): number
  
  /**
   * @inheritDoc
   */
  public abstract handles (page: Page, request: PhantomRequest): Promise<StepHandlerReturnType<T>>
  
  /**
   * @inheritDoc
   */
  public supports (request: PhantomRequest): boolean {
    return true
  }
  
  /**
   * @inheritDoc
   */
  public attachListeners (listeners: Listenable[]): void {
    this.listeners = listeners
  }
  
  protected failure (message: string): void {
    this.listeners.forEach(listener => listener.onFailure(message))
  }
  
  protected message (message: string): void {
    this.listeners.forEach(listener => listener.onMessage(message))
  }
  
  protected progress (percent: number, message?: string): void {
    this.listeners.forEach(listener => listener.onProgress(percent, typeof message === 'undefined' ? '' : message))
  }
}
