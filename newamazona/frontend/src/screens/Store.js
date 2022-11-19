// React context to save cart items in a global state in use it in components

import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  cart: {
    cartItems: [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      //add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      // If item exist in cart we use map func on the cart items to upddate the current item with the ne item we get from action.payload
      // other wise we keep the previous item in the cart
      // if exist Item is null it means it is a new item so we need to add to the cart Items array
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      return { ...state, cart: { ...state.cart, cartItems } };
    default:
      return state;
  }
}

// wraper for react application and pass glball props to children

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  // return store from react context
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
