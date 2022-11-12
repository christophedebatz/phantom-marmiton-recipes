export default interface PhantomRequest {
  query: string
  pagesCount?: number
  filters?: PhantomRequestFilters
}
