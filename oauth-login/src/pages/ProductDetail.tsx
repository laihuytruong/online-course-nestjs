import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productApi } from '../apis' // Đảm bảo API này đã có sẵn
import { Product } from '../interface'
import { Spin, Typography, Row, Col, Image, Card, Button } from 'antd'

const { Title, Text } = Typography

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>()
    const [product, setProduct] = useState<Product | undefined>({} as Product)
    const [loading, setLoading] = useState(true)

    const nav = useNavigate()

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                if (id !== undefined) {
                    const response = await productApi.getProductById(+id)
                    setProduct(response.data)
                }
            } catch (error) {
                console.log('Error fetching product detail:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProductDetail()
    }, [id])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" tip="Loading..." />
            </div>
        )
    }

    if (!product) {
        return <div>Product not found</div>
    }

    return (
        <div className="p-6 bg-white">
            <Button
                onClick={() => nav(-1)} 
                style={{ marginBottom: '16px' }} 
            >
                Back
            </Button>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Image
                        src={
                            product.thumbnail ||
                            'https://via.placeholder.com/400'
                        }
                        alt={product.name}
                        className="w-full object-cover"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Card className="p-4">
                        <Title level={2}>{product.name}</Title>
                        <Text className="block text-gray-600 text-lg">
                            Price:{' '}
                            <strong>
                                VNĐ {product.price.toLocaleString()}
                            </strong>
                        </Text>
                        <Text className="block text-gray-600 text-lg mt-2">
                            Category: {product.subCategory?.name || 'N/A'}
                        </Text>
                        <div className="my-4">
                            <Text>{product.description}</Text>
                        </div>

                        <Button type="primary" size="large">
                            Add to Cart
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ProductDetail
