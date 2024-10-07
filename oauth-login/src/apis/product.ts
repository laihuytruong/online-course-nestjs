import instance from '../apiService'
import { Pagination, Product } from '../interface'

interface ProductsData {
    data: {
        item: Product[]
        meta: Pagination
    }
}

interface ResponseData<T> {
    statusCode?: number
    message: string
    data?: T
}

enum ORDER {
    ASC = 'ASC',
    DESC = 'DESC',
}

const ProductApi = {
    async getProducts(
        page?: number,
        pageSize?: number,
        order?: ORDER,
        search?: string
    ): Promise<ProductsData> {
        const url = 'products'
        const query = `?page=${page}&pageSize=${pageSize}${
            order ? `&order=${order}` : ''
        }${search ? `&search=${search}` : ''}`
        return instance.get(url + query)
    },

    async getProductById(id: number): Promise<ResponseData<Product>> {
        const url = `products/${id}`
        return instance.get(url)
    },
}

export default ProductApi
