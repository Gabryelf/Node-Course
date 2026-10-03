import { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((item) => item.id === action.payload.id);
      const stock = action.payload.stock;

      // Если товара уже нет в наличии — игнорируем
      if (stock <= 0) return state;

      if (existing) {
        // Не даём добавить больше, чем есть на складе
        if (existing.quantity >= stock) return state;
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };

    case 'INCREMENT': {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return state;
      // Не даём увеличить больше, чем stock
      if (item.quantity >= item.stock) return state;
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }

    case 'DECREMENT':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        ),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [savedCart, setSavedCart] = useLocalStorage('cart', { items: [] });
  const [state, dispatch] = useReducer(cartReducer, savedCart);

  useEffect(() => {
    setSavedCart(state);
  }, [state, setSavedCart]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}