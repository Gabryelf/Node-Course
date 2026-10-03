import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/api';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        const sorted = data.sort((a, b) => b.createdAt - a.createdAt);
        setOrders(sorted);
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <div className="loading">Загрузка заказов...</div>;

  return (
    <div className="orders">
      <h2>Заказы</h2>
      {orders.length === 0 ? (
        <p style={{ fontSize: '1.5rem' }}>Заказов пока нет</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <p>
                <strong>Дата:</strong> {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Сумма:</strong> {order.total} ₽
              </p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.title} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <Link to="/" className="back-link">
        ← Назад в каталог
      </Link>
    </div>
  );
}

export default Orders