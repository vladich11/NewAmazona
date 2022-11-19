import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Rating from '../components/Rating';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from './Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      //keep the previous values and only update loading to true
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const params = useParams();
  const { slug } = params;

  // useReducer hook
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  // A hook to get data
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST', loading: true });
      try {
        //ajax req
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  // Get context
  const { state, dispatch: cxtDispatch } = useContext(Store);

  const { cart } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    //ajax req for current product
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    cxtDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={5}>
          <img
            className="img-large"
            src={product.image}
            alt={product.name}
          ></img>
        </Col>

        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>

            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>
                  <b>Brand:</b> <p>{product.brand}</p>
                </Col>
                <Col>
                  <b>Gender:</b> <p>{product.gender}</p>
                </Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <b>Description:</b> <p>{product.description}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <b>Condition:</b> <p>{product.condition}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>
                  <b>height:</b> <p>{product.height}</p>
                </Col>
                <Col>
                  <b>width:</b> <p>{product.width}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <b>Material: </b>
                  <p>{product.material}</p>
                </Col>
                <Col>
                  <b>Size:</b> <p>{product.size}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <b>Colour:</b> <p>{product.colour}</p>
                </Col>
                <Col>
                  <b>Total Weight:</b> <p>{product.totalweight}</p>
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
