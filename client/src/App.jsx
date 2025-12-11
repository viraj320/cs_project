
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./components/navigationbar/NavBar";
import Footer from "./components/footer/Footer";
import ShoppingCartDrawer from "./components/spareparts/shoppingcart/ShoppingCartDrawer";
import { currentProducts } from "./components/spareparts/ProductGridBakers";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const handleSidebarToggle = () => setIsSidebarVisible(!isSidebarVisible);

  const product = currentProducts[0];
  const quantity = 1;
  const location = useLocation();

  // Hide site chrome (NavBar/Footer/Cart) on admin, garage dashboard, and garage portal pages so those UIs are independent
  const hideShell =
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/garage-dashboard") ||
    location.pathname.startsWith("/garage-portal");

  return (
    <div className="flex flex-col min-h-screen">
      {!hideShell && <NavBar handleSidebarToggle={handleSidebarToggle} />}
      <main className="flex-grow">
        <AppRoutes /> 
      </main>
      {!hideShell && <Footer />}
      {!hideShell && (
        <ShoppingCartDrawer
          isSidebarVisible={isSidebarVisible}
          handleCloseSidebar={handleSidebarToggle}
          product={product}
          quantity={quantity}
        />
      )}
    </div>
  );
}

export default App;
