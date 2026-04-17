import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

function HomeLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default HomeLayout
