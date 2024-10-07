import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { Category, Pagination, Product, User } from '../interface'
import { userApi, productApi, categoryApi } from '../apis'
import { Button, Layout, Typography, Spin, Row, Col, Card, List } from 'antd'

const { Header, Content } = Layout
const { Title } = Typography

const Home = () => {
    const [user, setUser] = useState<User>({} as User)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const navigate = useNavigate()
    const [cookies, , removeCookie] = useCookies(['access_token'])
    const [paginationInfo, setPaginationInfo] = useState<Pagination>({
        page: 1,
        pageSize: 10,
        totalPages: 1,
        totalCounts: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    })

    const nav = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, productResponse, categoryResponse] =
                    await Promise.all([
                        userApi.profileByMe(cookies.access_token),
                        productApi.getProducts(
                            paginationInfo.page,
                            paginationInfo.pageSize
                        ),
                        categoryApi.getCategories(1, 10),
                    ])

                if (userResponse.data) {
                    setUser(userResponse.data)
                }
                if (productResponse.data) {
                    setProducts(productResponse.data.item)
                    setPaginationInfo(productResponse.data.meta)
                }
                if (categoryResponse.data) {
                    setCategories(categoryResponse.data.item)
                }
            } catch (error) {
                console.log('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [paginationInfo.page])

    const handleLogout = () => {
        removeCookie('access_token', { path: '/' })
        navigate('/login')
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" tip="Loading..." />
            </div>
        )
    }

    return (
        <>
            {/* Header */}
            <Header className="bg-blue-100 p-4 flex justify-between items-center">
                <Title level={3} className="text-white">
                    Welcome, {user.name || 'Guest'}
                </Title>
                <Button type="primary" onClick={handleLogout}>
                    Logout
                </Button>
            </Header>

            {/* Category Section */}
            <Content className="p-4 bg-gray-100">
                <div className="bg-white p-4 rounded-md shadow-sm mb-5">
                    <Title level={4} className="text-purple-600">
                        Categories
                    </Title>
                    <List
                        itemLayout="horizontal"
                        dataSource={categories}
                        renderItem={(category) => (
                            <List.Item>
                                <List.Item.Meta title={category.name} />
                            </List.Item>
                        )}
                    />
                </div>

                {/* Products Section */}
                <div className="bg-white p-4 rounded-md shadow-sm">
                    <Title level={4} className="text-purple-600">
                        List Products
                    </Title>
                    <Row gutter={[16, 16]}>
                        {products.map((product) => (
                            <Col
                                key={product.id}
                                xs={12}
                                sm={8}
                                lg={6}
                                onClick={() => nav(`/products/${product.id}`)}
                            >
                                <Card hoverable className="product-card">
                                    <div className="flex justify-center items-center h-[200px] bg-gray-100">
                                        <img
                                            src={
                                                product.thumbnail ||
                                                'https://via.placeholder.com/150'
                                            }
                                            alt={product.name}
                                            className="h-[150px] object-contain"
                                        />
                                    </div>
                                    <div className="text-center mt-3">
                                        <span className="block font-semibold">
                                            {product.name}
                                        </span>
                                        <div className="text-purple-600 mt-1 font-bold">
                                            VNĐ {product.price.toLocaleString()}
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Content>
        </>
    )
}

export default Home
