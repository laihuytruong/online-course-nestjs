export interface Pagination {
    page: number
    pageSize: number
    totalCounts: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}
