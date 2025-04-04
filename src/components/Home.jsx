import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useCart } from "../contexts/CartContext";
import ItemCard from "./ItemCard";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

function Home({ setCurrentStep }) {
  const { t } = useTranslation();
  const { cart } = useCart();
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const { data, error } = await supabase.storage
      .from("jason-files")
      .download("scanned_data.json");

    if (error) {
      console.error("Error fetching JSON:", error.message);
    } else {
      const jsonData = await data.text();
      const parsedData = JSON.parse(jsonData);

      // Ensure scanned_products is an array
      setItems(parsedData.scanned_products || []);
    }
  };

  useEffect(() => {
    fetchItems(); // Load initial data

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("realtime:scanned_products")
      .on("postgres_changes", { event: "*", schema: "public", table: "scanned_products" }, (payload) => {
        console.log("Change detected:", payload);
        fetchItems(); // Fetch new data on change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Cleanup on unmount
    };
  }, []);

  // Combine all items into a single tile
  const combinedItem = {
    name: "Scanned Items",
    quantity: items.reduce((total, item) => total + (item.quantity || 1), 0),
    price: items.reduce((total, item) => total + (item.price || 0), 0),
    items: items // Include all items for display in the card
  };

  return (
    <div className="home">
      <h2 className="title">{t("items")}</h2>
      <motion.div
        className="items-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ 
          display: "flex", 
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh"
        }}
      >
        {items.length > 0 ? (
          <motion.div
            className="item-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ 
              padding: "20px", 
              border: "1px solid #ddd", 
              borderRadius: "12px", 
              textAlign: "center",
              width: "80%",
              maxWidth: "500px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#fff"
            }}
          >
            <ItemCard item={combinedItem} isCombinedView={true} />
          </motion.div>
        ) : (
          <p>No items scanned yet</p>
        )}
      </motion.div>
      <Sidebar />
      {items.length > 0 && (
        <button 
          className="checkout-btn" 
          onClick={() => setCurrentStep("checkout")}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {t("checkout")} ({combinedItem.quantity} items)
        </button>
      )}
    </div>
  );
}

export default Home;