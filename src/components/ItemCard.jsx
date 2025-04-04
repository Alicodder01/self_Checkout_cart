import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const CartItems = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);

      // Fetch the JSON file from Supabase Storage
      const { data, error } = await supabase.storage
        .from("jason-files")
        .download("scanned_data.json");

      if (error) {
        console.error("Error fetching JSON:", error.message);
      } else {
        // Parse JSON data
        const jsonData = await data.text();
        setCartData(JSON.parse(jsonData));
      }

      setLoading(false);
    };

    fetchCartData();
  }, []);

  if (loading) return <p>Loading cart...</p>;
  if (!cartData || !cartData.scanned_products || cartData.scanned_products.length === 0) return <p>No items found in the cart.</p>;

  return (
    <div className="cart-container">
      {cartData.scanned_products.map((item, index) => (
        <div key={index} className="cart-card">
          <h3>{item.Product}</h3>
          <p>Price: ₹{item["Price"].toFixed(2)}</p>
          <p>Discount: {item["Discount"]}%</p>
          <p>Final Price: ₹{item["Discounted Price"].toFixed(2)}</p>
        </div>
      ))}
      <h3>Total Items: {cartData.total_items}</h3>
      <h3>Total Price: ₹{cartData.total_price.toFixed(2)}</h3>
    </div>
  );
};

export default CartItems;