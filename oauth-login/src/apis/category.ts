import instance from '../apiService'
import { Category, Pagination } from '../interface'

interface CategoriesData {
    data: {
        item: Category[]
        meta: Pagination
    }
}

interface ResponseData<T> {
    statusCode?: number
    message: string
    data?: T
}

const CategoryApi = {
    async getCategories(
        page?: number,
        pageSize?: number
    ): Promise<CategoriesData> {
        const url = 'categories'
        const query = `?page=${page ? page : 1}&pageSize=${pageSize}`
        return instance.get(url + query)
    },
}

export default CategoryApi
