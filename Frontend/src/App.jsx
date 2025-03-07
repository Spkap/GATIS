import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import './index.css'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  )
}