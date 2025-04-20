import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Profile from "@/pages/Profile";
import Checkout from "@/pages/Checkout";
import CartSidebar from "@/components/CartSidebar";
import NotificationToast from "@/components/NotificationToast";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/about" component={About} />
      <Route path="/profile" component={Profile} />
      <Route path="/checkout" component={Checkout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Navbar />
        <main className="min-h-screen">
          <Router />
        </main>
        <Footer />
        <CartSidebar />
        <NotificationToast />
      </TooltipProvider>
    </CartProvider>
  );
}

export default App;
