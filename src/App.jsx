import { Navigate, Route, Routes } from 'react-router-dom'
import HomeLayout from './components/layout/HomeLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CartPage from './pages/CartPage.jsx'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Navigate to="/productos" replace />} />
        <Route path="productos" element={<HomePage />} />
        <Route path="productos/:id" element={<ProductPage />} />
        <Route path="cesta" element={<CartPage />} />
        <Route path="*" element={<Navigate to="/productos" replace />} />
      </Route>
    </Routes>
  )
}

export default App
