import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './contexts/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import CartProvider from './contexts/CartContext.jsx'
import WishListProvider from './contexts/WishListContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WishListProvider>

        

          
          <App />

        
        </WishListProvider>
      </CartProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
