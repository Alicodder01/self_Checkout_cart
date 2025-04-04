import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../services/supabaseClient";

const CartItems = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCartData = async () => {
    setLoading(true);

    // Fetch JSON file from Supabase Storage
    const { data, error } = await supabase.storage
      .from("jason-files")
      .download("scanned_data.json");

    if (error) {
      console.error("Error fetching JSON:", error.message);
    } else {
      // Parse JSON data
      const jsonData = await data.text();
      const parsedData = JSON.parse(jsonData);

      // Ensure scanned_products is always an array
      if (!Array.isArray(parsedData.scanned_products)) {
        parsedData.scanned_products = [parsedData.scanned_products];
      }

      setCartData(parsedData);
    }

    setLoading(false);
  };

  useEffect(() => {
    // Fetch data initially
    fetchCartData();

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchCartData, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading cart...</p>;
  if (!cartData || !cartData.scanned_products || cartData.scanned_products.length === 0)
    return <p>No items found in the cart.</p>;

  return (
    <div className="cart-container">
      <motion.div
        className="cart-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {cartData.scanned_products.map((item, index) => (
            <motion.div
              key={index}
              className="cart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p>{item.Product}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="cart-summary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>Total Items: {cartData.total_items}</p>
        <p>Total Price: ₹{cartData.total_price.toFixed(2)}</p>
      </motion.div>
    </div>
  );
};

export default CartItems;
