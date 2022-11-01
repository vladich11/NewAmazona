import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function HomeScreen() {
  const [products, setProducts] = useState([]);

  // A hook to get data
  useEffect(() => {
    const fetchData = async () => {
      //ajax req
      const result = await axios.get('api/products');
      setProducts(result.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Featured Products</h1>
      <div className="products">
        {products.map((product) => (
          <div className="product" key={product.slug}>
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name} />
            </Link>
            <div className="product-info">
              <Link to={`/product/${product.slug}`}>
                <p>{product.name}</p>
              </Link>
              <p>
                <strong>€</strong>
                {product.price}
              </p>
              <button>Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeScreen;
