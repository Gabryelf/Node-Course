import { useContext, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { createOrder, getBookById, updateBookStock } from '../api/api';

function Cart() {
  const { state, dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const total = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [state.items]);

  const handleCheckout = useCallback(async () => {
    const orderData = {
      items: state.items,
      total,
      createdAt: Date.now(),
    };

    try {
      await createOrder(orderData);

      for (const item of state.items) {
        const book = await getBookById(item.id);
        const newStock = Math.max(0, book.stock - item.quantity);
        await updateBookStock(item.id, newStock);
      }

      dispatch({ type: 'CLEAR_CART' });
      navigate('/orders');
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      alert('Не удалось оформить заказ.');
    }
  }, [state.items, total, dispatch, navigate]);

  if (state.items.length === 0) {
    return <div className="cart-empty">Корзина пуста</div>;
  }

  return (
    <div className="cart">
      <h2>Корзина</h2>
      {state.items.map((item) => (
        <div key={item.id} className="cart-item">
          <span className="item-title">{item.title}</span>
          <span className="item-price">{item.price} ₽</span>
          <div className="quantity-controls">
            <button onClick={() => dispatch({ type: 'DECREMENT', payload: item.id })}>-1</button>
            <span>{item.quantity}</span>
            <button
              onClick={() => dispatch({ type: 'INCREMENT', payload: item.id })}
              disabled={item.quantity >= item.stock}
              style={item.quantity >= item.stock ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
            >
              +1
            </button>
          </div>
          <button
            className="remove-btn"
            onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
          >
            Удалить
          </button>
        </div>
      ))}
      <div className="cart-total">
        <h3>Итого: {total} ₽</h3>
        <button className="checkout-btn" onClick={handleCheckout}>
          Оформить заказ
        </button>
      </div>
    </div>
  );
}
export default Cart