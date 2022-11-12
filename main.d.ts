import { Filter } from './src/common/scrap/index'

declare global {
  type PhantomRequestFilters = {
    dish?: string[]
    difficulty?: string[]
    cost?: string[]
    duration?: string[]
    seasonal?: boolean
  }
  
  type FilterSafeValueType =
    Exclude<PhantomRequestFilters[keyof PhantomRequestFilters], undefined>
  
  type StepHandlerReturnType<T> = T[] | null
  
  type FilterType = ( typeof Filter )[keyof typeof Filter];
  
  type FilterDescriptorType = {
    type: Filter,
    xpath: string,
    items: FilterDescriptorItemType[]
  }
  
  type FilterDescriptorItemType = { label: string, xpath: string }
}
