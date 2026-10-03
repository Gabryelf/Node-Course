import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { CartContext } from '../context/CartContext';
import { getBooks } from '../api/api';

function Catalog() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const { state, dispatch } = useContext(CartContext);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await getBooks();
        setBooks(data);
        const uniqueAuthors = [...new Set(data.map((book) => book.author))];
        setAuthors(uniqueAuthors);
      } catch (error) {
        console.error('Ошибка при загрузке каталога:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesAuthor = selectedAuthor ? book.author === selectedAuthor : true;
      return matchesSearch && matchesAuthor;
    });
  }, [books, debouncedSearch, selectedAuthor]);

  // Вычисляем, сколько уже добавлено в корзину для каждой книги
  const cartQuantities = useMemo(() => {
    const map = {};
    state.items.forEach((item) => {
      map[item.id] = item.quantity;
    });
    return map;
  }, [state.items]);

  const handleAddToCart = useCallback(
    (book) => {
      dispatch({ type: 'ADD_ITEM', payload: book });
    },
    [dispatch]
  );

  if (loading) return <div className="loading">Загрузка каталога...</div>;

  return (
    <div className="catalog">
      <div className="filters">
        <input
          type="text"
          placeholder="Поиск"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)}>
          <option value="">Фильтр</option>
          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
      </div>

      <div className="book-list">
        {filteredBooks.map((book) => {
          const inCart = cartQuantities[book.id] || 0;
          const available = book.stock - inCart; // сколько ещё можно добавить
          const isSoldOut = available <= 0;

          return (
            <div key={book.id} className="book-card">
              <img
                src={book.coverImage || 'https://via.placeholder.com/150x200'}
                alt={book.title}
                className="book-cover"
              />
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.author}</p>
              <p className={`book-stock ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                в наличии: {book.stock} <br />
                {inCart > 0 && <span> (осталось: {available})</span>}
              </p>
              <p className="book-price">{book.price} ₽</p>
              <button
                className="add-btn"
                onClick={() => handleAddToCart(book)}
                disabled={isSoldOut}
              >
                {book.stock === 0
                  ? 'нет в наличии'
                  : isSoldOut
                  ? 'товар закончился'
                  : `в корзину`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Catalog