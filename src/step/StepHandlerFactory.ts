import { Recipe } from './dto'
import { SchedulerService } from '../common/task'
import { FilterFactory } from '../filter'
import { BrowseRecipesHandler, CloseCookiePopinHandler, FilterRecipesHandler, SearchRecipeHandler, UserSummaryHandler } from '.'
import { StepHandler } from '../common/scrap'

export default class StepHandlerFactory {
  
  private static readonly MaxConcurrentTasks: number = 2
  private static readonly RecipesPerPage: number = 14

  private readonly stepHandlers: Array<StepHandler<StepHandlerReturnType<Recipe[]>>> = []

  public constructor () {
    this.stepHandlers.push(new UserSummaryHandler())
    this.stepHandlers.push(new FilterRecipesHandler(new FilterFactory()))
    this.stepHandlers.push(new SearchRecipeHandler())
    this.stepHandlers.push(new CloseCookiePopinHandler())
    this.stepHandlers.push(
      new BrowseRecipesHandler(
        new SchedulerService(),
        StepHandlerFactory.MaxConcurrentTasks,
        StepHandlerFactory.RecipesPerPage
      )
    )
  }
  
  /**
   * Returns a list of available step handlers to extract the Marmiton recipes.
   */
  public build (): Array<StepHandler<StepHandlerReturnType<Recipe[]>>> {
    return this
      .stepHandlers
      .sort((step, nextStep) => step.getRank() - nextStep.getRank())
  }
}
