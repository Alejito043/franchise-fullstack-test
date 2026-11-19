import { Link, Route, Routes } from 'react-router-dom'
import FranchisesPage from './pages/FranchisesPage.jsx'
import BranchesPage from './pages/BranchesPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'

export default function App() {
  return (
    <>
      <header className="app-header">
        <Link to="/">Franchise Manager</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<FranchisesPage />} />
          <Route path="/franchises/:franchiseId/branches" element={<BranchesPage />} />
          <Route path="/branches/:branchId/products" element={<ProductsPage />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  )
}
