import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../apis'
import { toast } from 'react-toastify'
import { useCookies } from 'react-cookie'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [, setCookies] = useCookies(['access_token'])

    const nav = useNavigate()

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const response = await authApi.register(name, email, password)
            if (response.data) {
                toast.success(response.message)
                setCookies('access_token', response.data.token)
                nav('/')
            }
        } catch (err) {
            toast.error('Register failed, please try again.')
            console.log('Error logging in with register:', err)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Register Form
                </h1>
                <form className="space-y-4" onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                        Register
                    </button>
                </form>

                <p className="mt-4 text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
