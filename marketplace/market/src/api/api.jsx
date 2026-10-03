const API_URL = 'http://localhost:3001';

export async function getBooks() {
  try {
    const response = await fetch(`${API_URL}/books`);
    if (!response.ok) throw new Error('Ошибка загрузки книг');
    return await response.json();
  } catch (error) {
    console.error('API Error (getBooks):', error);
    throw error;
  }
}

export async function getOrders() {
  try {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error('Ошибка загрузки заказов');
    return await response.json();
  } catch (error) {
    console.error('API Error (getOrders):', error);
    throw error;
  }
}

export async function createOrder(orderData) {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Ошибка создания заказа');
    return await response.json();
  } catch (error) {
    console.error('API Error (createOrder):', error);
    throw error;
  }
}

export async function getBookById(id) {
  try {
    const response = await fetch(`${API_URL}/books/${id}`);
    if (!response.ok) throw new Error(`Ошибка загрузки книги с id ${id}`);
    return await response.json();
  } catch (error) {
    console.error(`API Error (getBookById ${id}):`, error);
    throw error;
  }
}

export async function updateBookStock(id, stock) {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock }),
    });
    if (!response.ok) throw new Error(`Ошибка обновления stock для книги с id ${id}`);
    return await response.json();
  } catch (error) {
    console.error(`API Error (updateBookStock ${id}):`, error);
    throw error;
  }
}