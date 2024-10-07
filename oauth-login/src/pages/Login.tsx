import { FormEvent, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '../apis'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [, setCookies] = useCookies(['access_token'])

    const nav = useNavigate()

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await authApi.login(email, password)
            if (response.data) {
                toast.success(response.message)
                setCookies('access_token', response.data.token)
                nav('/')
            }
        } catch (err) {
            toast.error('Login failed, please try again.')
            console.log('Error logging in with Google:', err)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Login Form
                </h1>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-center text-sm">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-blue-500 hover:underline"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
