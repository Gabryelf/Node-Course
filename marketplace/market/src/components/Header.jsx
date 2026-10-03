import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext, useCart } from '../context/CartContext';
import { useTheme } from '../hooks/useTheme';

function Header() {
  const { state } = useCart();
  const { theme, toggleTheme } = useTheme();
  console.log(state)
  const uniqueItemsCount = state.items.length;

  return (
    <header className="header">
      <Link to="/" className="logo">Books Market</Link>
      <div className="header-controls">
        <Link to="/" className="nav-link">Каталог</Link>
        <Link to="/cart" className="nav-link">
          Корзина
          {uniqueItemsCount > 0 && <span className="cart-badge">{uniqueItemsCount}</span>}
        </Link>
        <Link to="/orders" className="nav-link">Заказы</Link>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}

export default Header