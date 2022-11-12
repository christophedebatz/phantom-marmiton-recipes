import { Recipe } from './dto/index'
import { AsyncTaskService } from '../common/task/index'
import { FilterFactory } from '../filter/index'
import { BrowseRecipes, FilterRecipes, SearchRecipe, UserSummary } from './index'
import { StepHandler } from '../common/scrap/index'

export default class StepHandlerFactory {

  private static readonly MaxConcurrentTasks: number = 2
  private static readonly RecipesPerPage: number = 14
  
  private readonly stepHandlers: StepHandler<StepHandlerReturnType<Recipe>>[] = []
  
  public constructor () {
    this.stepHandlers.push(new UserSummary())
    this.stepHandlers.push(new FilterRecipes(new FilterFactory()))
    this.stepHandlers.push(new SearchRecipe())
    this.stepHandlers.push(
      new BrowseRecipes(
        new AsyncTaskService(),
        StepHandlerFactory.MaxConcurrentTasks,
        StepHandlerFactory.RecipesPerPage
      )
    )
  }
  
  public build(): StepHandler<StepHandlerReturnType<Recipe>>[] {
    return this
      .stepHandlers
      .sort((step, nextStep) => step.getRank() - nextStep.getRank()
    )
  }
}
