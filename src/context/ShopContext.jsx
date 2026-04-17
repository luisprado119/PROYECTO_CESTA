import { useMemo, useState } from 'react'
import { ShopContext } from './shopContext.js'

function ShopProvider({ children }) {
  const [estado, setEstado] = useState({ cesta: [] })

  const addToCart = (producto, cantidad) => {
    const quantity = Number(cantidad || 0)
    if (!producto || quantity <= 0) return

    setEstado((prevState) => ({
      ...prevState,
      cesta: [
        ...prevState.cesta.filter((item) => item.producto.id !== producto.id),
        {
          producto,
          cantidad: quantity,
          total: quantity * producto.price,
        },
      ],
    }))
  }

  const totalCesta = useMemo(
    () => estado.cesta.reduce((acumulado, item) => acumulado + item.total, 0),
    [estado.cesta],
  )

  const value = useMemo(
    () => ({ estado, setEstado, addToCart, totalCesta }),
    [estado, totalCesta],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export { ShopProvider }
