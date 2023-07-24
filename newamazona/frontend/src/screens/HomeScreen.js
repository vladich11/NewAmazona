import { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

// This is a reducer function that updates the state based on the dispatched action. It takes the current state and the action as inputs and returns a new state.
// The function has 4 cases:
// FETCH_REQUEST: when fetching data, the state is updated with loading: true.
// FETCH_SUCCESS: when data is successfully fetched, the state is updated with products: action.payload and loading: false.
// FETCH_FAIL: when fetching data fails, the state is updated with loading: false and error: action.payload.
// default: when no case is met, the original state is returned.

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  // initializes the state object with loading set to true,
  // error set to an empty string, and products set to an empty array using useReducer hook.
  // useReducer hook takes in the reducer function as the first argument and an initial state object as
  // the second argument. The hook returns an array with the current state as the first element and a
  // dispatch function used to dispatch actions to the reducer as the second element. The state is passed through
  // the logger higher-order function before being passed to the useReducer hook.

  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  //  initializes the state object with loading set to true, error set to an empty string, and products set to an empty array using useReducer hook.
  //  useReducer hook takes in the reducer function as the first argument and an initial state object as the second argument.
  //  The hook returns an array with the current state as the first element and a dispatch function used to dispatch actions to the reducer as the second element.
  //  The state is passed through the logger higher-order function before being passed to the useReducer hook.

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST', loading: true });
      try {
        const result = await axios.get('api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lr={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
