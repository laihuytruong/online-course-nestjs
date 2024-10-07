import { Category } from './category'

export interface Product {
    id: string
    name: string
    description: string | null
    price: number
    categoryId: number
    subCategoryId: number
    thumbnail: string
    category: Category
    subCategory: Category
}
