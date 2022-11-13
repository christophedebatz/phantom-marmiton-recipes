import { Filter, Filterable } from './src/common/scrap'

declare global {

  interface PhantomRequestFilters {
    dish?: string[]
    difficulty?: string[]
    cost?: string[]
    duration?: string[]
    seasonal?: boolean
  }

  type FilterSafeValueType =
    Exclude<PhantomRequestFilters[keyof PhantomRequestFilters], undefined>

  type FilterFactoryReturnType = Filterable<string[]> | Filterable<boolean>

  type StepHandlerReturnType<T> = T | null

  interface UrlFilterDescriptorType {
    type: Filter
    query: string
    items: UrlFilterItemDescriptorType[]
  }

  interface UrlFilterItemDescriptorType {
    label: string
    value: string
  }

  interface WorkerThreadPayloadType {
    url: string
    path: string
  }
}
