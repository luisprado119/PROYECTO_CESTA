import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { useShop } from '../context/useShop.js'
import { toProductModel } from '../data/productMapper.js'

const getProductById = async (id) => {
  const response = await fetch(`http://localhost:3000/api/products/${id}`)
  if (!response.ok) {
    throw new Error('No fue posible cargar el producto')
  }
  return response.json()
}

function ProductPage() {
  const { id } = useParams()
  const productId = Number(id)
  const { addToCart } = useShop()
  const [confirmacion, setConfirmacion] = useState('')
  const { register, handleSubmit } = useForm({
    defaultValues: { cantidad: 1 },
  })

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    enabled: Number.isInteger(productId) && productId > 0,
  })

  const product = data ? toProductModel(data) : null

  const onSubmit = (datos) => {
    const cantidad = Number(datos.cantidad || 0)
    addToCart(product, cantidad)

    if (cantidad > 0) {
      setConfirmacion(
        `Se agrego "${product.name}" con cantidad ${cantidad} a la cesta.`,
      )
    } else {
      setConfirmacion('La cantidad debe ser mayor que 0.')
    }
  }

  if (isLoading) {
    return (
      <section className="panel">
        <div className="section-heading">
          <h2>Detalle de producto</h2>
        </div>
        <p className="status-text">Cargando producto...</p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="panel">
        <div className="section-heading">
          <h2>Detalle de producto</h2>
        </div>
        <p className="status-text error">Error: {error.message}</p>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="panel">
        <div className="section-heading">
          <h2>Detalle de producto</h2>
        </div>
        <p className="status-text error">Producto no encontrado.</p>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Detalle de producto</h2>
      </div>

      <div className="detail-card">
        <div className="detail-meta">
          <p className="mb-2">
            <strong>Producto:</strong> {product.name}
          </p>
          <p className="detail-price">${product.price} USD</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="cantidad-input" className="form-label fw-semibold">
            Cantidad
          </label>
          <input
            id="cantidad-input"
            type="number"
            min="1"
            className="form-control quantity-input"
            {...register('cantidad', { min: 1, valueAsNumber: true })}
          />

          <div className="d-flex gap-2 mt-3 flex-wrap">
            <button type="submit" className="btn btn-primary">
              Anadir a cesta
            </button>
            <Link to="/productos" className="btn btn-outline-secondary">
              Volver a productos
            </Link>
            <Link to="/cesta" className="btn btn-success">
              Ir a cesta
            </Link>
          </div>
        </form>
      </div>

      {confirmacion && (
        <div className="alert alert-success mt-3 mb-0" role="alert">
          {confirmacion}
        </div>
      )}
    </section>
  )
}

export default ProductPage
