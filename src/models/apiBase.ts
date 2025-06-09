export type ResponseSuccess = {
  message: string
}

export type ErrorField = {
  domain: string
  message: string
}

export type Pagination = {
  total: number
  page: number
  limit: number
}

export type SearchState = {
  phrase: string | undefined
}

export type Response<T> = {
  data: T
}

export enum SortDirectionEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export type SortField = {
  field: string
  direction: SortDirectionEnum
}

export type SortState = {
  sorts: Array<SortField>
}

export type WithFilter<T> = Pagination & {
  nodes: T
}

export type RequestQuery<Filter extends Object = {}> = Partial<Pagination & SearchState & SortState> & Filter

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initialQueryState: RequestQuery<any> = {
  page: 1,
  limit: 10,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initialFilterResponse: WithFilter<Array<any>> = {
  nodes: [],
  total: 0,
  ...initialQueryState,
}
