import { DishFilter } from '.'
import DifficultyFilter from './DifficultyFilter'
import CostFilter from './CostFilter'
import DurationFilter from './DurationFilter'
import SeasonalFilter from './SeasonalFilter'

export default class FilterFactory {
  /**
   * Builds and returns some useful filters.
   * Includes only filters you want to be available for Phantom user.
   *
   * @return a collection of available filters
   */
  public buildFilters (): FilterFactoryReturnType[] {
    return [
      new DishFilter(),
      new DifficultyFilter(),
      new CostFilter(),
      new DurationFilter(),
      new SeasonalFilter()
    ]
  }
}
