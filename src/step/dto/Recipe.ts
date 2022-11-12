export default interface Recipe {
  
  /**
   * The recipe name
   */
  name?: string
  
  /**
   * The recipe cooking steps
   */
  steps?: string[]
  
  /**
   * The recipe pictures urls
   */
  picturesUrls?: string[]
  
  /**
   * The recipe url
   */
  url?: string
  
  /**
   * The recipe duration
   */
  duration?: string
  
  /**
   * The recipe difficulty rate (between 0 for easiest recipes and 5 for hardest recipes)
   */
  difficulty?: string
  
  /**
   * The average cost to cook the recipe (in EUR)
   */
  cost?: string
}
