import instance from '../apiService'
import { Pagination, User } from '../interface'

interface UsersData {
    item: User[]
    meta: Pagination
}

interface ResponseData<T> {
    statusCode?: number
    message: string
    data?: T
}

const UserApi = {
    async profileByMe(token: string): Promise<ResponseData<User>> {
        const url = '/users/me'
        const headers = {
            Authorization: `Bearer ${token}`,
        }
        return instance.get(url, { headers })
    },
}

export default UserApi
