import instance from '../apiService'
import { User } from '../interface'

interface ResponseData<T> {
    data?: {
        token?: string
        user?: T
    }
    message: string
}

const AuthApi = {
    async login(email: string, password: string): Promise<ResponseData<User>> {
        const url = '/auth/login'
        const data = {
            email,
            password,
        }
        return instance.post(url, data)
    },

    async register(
        name: string,
        email: string,
        password: string
    ): Promise<ResponseData<User>> {
        const url = '/auth/register'
        const data = {
            name,
            email,
            password,
        }
        return instance.post(url, data)
    },
}

export default AuthApi
