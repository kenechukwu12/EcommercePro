import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CartSidebar = () => {
  const { cart, isCartOpen, toggleCart, updateCartItem, removeFromCart, calculateTotal } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Prevent hydration mismatch
    setMounted(true);
    
    // Add event listener to close cart when pressing Escape
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        toggleCart();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isCartOpen, toggleCart]);

  // Wait until component is mounted to avoid hydration issues
  if (!mounted) return null;

  const subtotal = calculateTotal();

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${isCartOpen ? "" : "hidden"}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gray-900 bg-opacity-50 transition-opacity" 
          onClick={toggleCart}
        />
        <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <Button 
                      variant="ghost"
                      size="icon"
                      onClick={toggleCart}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {cart.length === 0 ? (
                  <div className="mt-20 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                    <Button onClick={toggleCart} asChild>
                      <Link href="/products">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="mt-8">
                    <div className="flow-root">
                      <ul className="-my-6 divide-y divide-gray-200">
                        {cart.map((item) => (
                          <li key={item.id} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="w-full h-full object-center object-cover"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.product.name}</h3>
                                  <p className="ml-4">${(item.quantity * (item.product.discountedPrice || item.product.price)).toFixed(2)}</p>
                                </div>
                                {item.color && <p className="mt-1 text-sm text-gray-500">{item.color}</p>}
                                {item.size && <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>}
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-gray-500 hover:text-primary h-8 w-8"
                                    onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="mx-2 w-8 text-center">{item.quantity}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-gray-500 hover:text-primary h-8 w-8"
                                    onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>

                                <Button 
                                  variant="link" 
                                  className="font-medium text-primary" 
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <Button 
                      className="w-full" 
                      asChild
                      onClick={toggleCart}
                    >
                      <Link href="/checkout">
                        Checkout
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      or {" "}
                      <Button 
                        variant="link" 
                        className="font-medium text-primary p-0" 
                        onClick={toggleCart}
                      >
                        Continue Shopping
                      </Button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
