/**
 * Represents some listener hook interface.
 */
export default interface Listenable {

  /**
   * Called when the listenable object has fired a new message event.
   *
   * @param message the message content
   */
  onMessage: (message: string) => void

  /**
   * Called when the listenable object has fired a new progression event.
   *
   * @param percent the percent ratio number (between 0 for 0% and 1 for 100%)
   * @param message the associated progression message
   */
  onProgress: (percent: number, message: string) => void

  /**
   * Called when the listenable object has fired a new failure event.
   *
   * @param message the failure message content
   */
  onFailure: (message: string) => void
}
