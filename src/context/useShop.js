import { useContext } from 'react'
import { ShopContext } from './shopContext.js'

function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop debe usarse dentro de ShopProvider')
  }
  return context
}

export { useShop }
