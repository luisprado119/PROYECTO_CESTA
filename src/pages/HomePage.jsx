import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toProductModel } from '../data/productMapper.js'

const getProducts = async () => {
  const response = await fetch('http://localhost:3000/products')
  if (!response.ok) {
    throw new Error('No fue posible cargar productos')
  }
  return response.json()
}

function HomePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const products = Array.isArray(data) ? data.map(toProductModel) : []

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Catalogo de productos</h2>
        <p>Selecciona un producto para ver detalle y agregar cantidades a la cesta.</p>
      </div>

      {isLoading && <p className="status-text">Cargando productos...</p>}
      {isError && <p className="status-text error">Error: {error.message}</p>}

      <ul className="product-grid">
        {products.map((product) => (
          <li key={product.id} className="product-card">
            <div className="product-card-body">
              <span className="product-id">ID #{product.id}</span>
              <strong>{product.name}</strong>
              <p className="product-price">${product.price} USD</p>
            </div>
            <Link
              to={`/productos/${product.id}`}
              className="btn btn-outline-success btn-sm"
            >
              Ver producto
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default HomePage
