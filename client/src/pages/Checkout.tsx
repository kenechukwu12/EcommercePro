import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { apiRequest } from "@/lib/queryClient";
import { Lock, CreditCard, CheckCircle } from "lucide-react";
import { User } from "@shared/schema";

// Mock user ID for demonstration as we don't have auth implemented
const mockUserId = 1;

const Checkout = () => {
  const [location, setLocation] = useLocation();
  const { cart, calculateTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: ""
  });
  
  // Shipping method
  const [shippingMethod, setShippingMethod] = useState("standard");
  const shippingCost = shippingMethod === "express" ? 12.99 : shippingMethod === "standard" ? 5.99 : 0;
  
  // Payment method
  const [paymentMethod, setPaymentMethod] = useState("credit");
  
  // Get user data for pre-filling the form
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: [`/api/users/${mockUserId}`],
  });
  
  // Redirect to home if cart is empty
  useEffect(() => {
    if (cart.length === 0 && step !== 3) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [cart, setLocation, step]);
  
  // Pre-fill form with user data when available
  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || ""
      }));
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleNext = () => {
    // Validate form data for step 1
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
        toast({
          title: "Incomplete Information",
          description: "Please fill out all shipping information fields.",
          variant: "destructive",
        });
        return;
      }
    }
    setStep(prevStep => prevStep + 1);
  };
  
  const handlePrevious = () => {
    setStep(prevStep => prevStep - 1);
  };
  
  const handleSubmitOrder = async () => {
    // Validate payment details if using credit card
    if (paymentMethod === "credit") {
      if (!formData.cardName || !formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
        toast({
          title: "Incomplete Information",
          description: "Please fill out all credit card details.",
          variant: "destructive",
        });
        return;
      }
      
      // Basic validation for credit card fields
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        toast({
          title: "Invalid Card Number",
          description: "Please enter a valid 16-digit card number.",
          variant: "destructive",
        });
        return;
      }
      
      if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        toast({
          title: "Invalid Expiry Date",
          description: "Please enter a valid expiry date (MM/YY).",
          variant: "destructive",
        });
        return;
      }
      
      if (!/^\d{3,4}$/.test(formData.cardCvc)) {
        toast({
          title: "Invalid CVC",
          description: "Please enter a valid 3 or 4 digit CVC code.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Create the order
      const subtotal = calculateTotal();
      const total = subtotal + shippingCost;
      
      const orderResponse = await apiRequest("POST", "/api/orders", {
        userId: mockUserId,
        total,
        status: "pending",
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        createdAt: new Date().toISOString()
      });
      
      const orderData = await orderResponse.json();
      
      // 2. Create order items
      const orderItemPromises = cart.map(item => 
        apiRequest("POST", `/api/orders/${orderData.id}/items`, {
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.discountedPrice || item.product.price
        })
      );
      
      await Promise.all(orderItemPromises);
      
      // 3. Clear the cart
      await apiRequest("DELETE", `/api/cart/user/${mockUserId}`, undefined);
      clearCart();
      
      // 4. Move to the confirmation step
      setStep(3);
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate totals
  const subtotal = calculateTotal();
  const tax = subtotal * 0.08; // Assuming 8% tax rate
  const total = subtotal + tax + shippingCost;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      
      {/* Checkout Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className={`ml-2 text-sm font-medium ${
              step >= 1 ? 'text-primary' : 'text-gray-500'
            }`}>Shipping</span>
          </div>
          <div className={`w-16 h-0.5 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className={`ml-2 text-sm font-medium ${
              step >= 2 ? 'text-primary' : 'text-gray-500'
            }`}>Payment</span>
          </div>
          <div className={`w-16 h-0.5 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <span className={`ml-2 text-sm font-medium ${
              step >= 3 ? 'text-primary' : 'text-gray-500'
            }`}>Confirmation</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingUser ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input 
                        id="address" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state" 
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input 
                          id="zipCode" 
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-4">
                      <Label htmlFor="shipping-method">Shipping Method</Label>
                      <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-2">
                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                          <RadioGroupItem value="free" id="shipping-free" />
                          <Label htmlFor="shipping-free" className="flex-1 cursor-pointer">
                            <div className="font-medium">Free Shipping</div>
                            <div className="text-sm text-gray-500">Orders over $50 (7-10 business days)</div>
                          </Label>
                          <div className="font-medium">$0.00</div>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                          <RadioGroupItem value="standard" id="shipping-standard" />
                          <Label htmlFor="shipping-standard" className="flex-1 cursor-pointer">
                            <div className="font-medium">Standard Shipping</div>
                            <div className="text-sm text-gray-500">3-5 business days</div>
                          </Label>
                          <div className="font-medium">$5.99</div>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                          <RadioGroupItem value="express" id="shipping-express" />
                          <Label htmlFor="shipping-express" className="flex-1 cursor-pointer">
                            <div className="font-medium">Express Shipping</div>
                            <div className="text-sm text-gray-500">1-2 business days</div>
                          </Label>
                          <div className="font-medium">$12.99</div>
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNext}>Continue to Payment</Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 2: Payment Information */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value="credit" id="payment-credit" />
                      <Label htmlFor="payment-credit" className="flex-1 cursor-pointer flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <div className="font-medium">Credit / Debit Card</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value="paypal" id="payment-paypal" />
                      <Label htmlFor="payment-paypal" className="flex-1 cursor-pointer flex items-center">
                        <i className="fab fa-paypal text-[#0070ba] mr-2"></i>
                        <div className="font-medium">PayPal</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {paymentMethod === "credit" && (
                  <div className="space-y-4 mt-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input 
                        id="cardName" 
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <Input 
                          id="cardNumber" 
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                        />
                        <div className="absolute right-3 top-2.5 text-gray-400 flex space-x-1">
                          <i className="fab fa-cc-visa"></i>
                          <i className="fab fa-cc-mastercard"></i>
                          <i className="fab fa-cc-amex"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input 
                          id="cardExpiry" 
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvc">CVC / CVV</Label>
                        <Input 
                          id="cardCvc" 
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === "paypal" && (
                  <div className="mt-4 pt-4 border-t text-center">
                    <p className="text-gray-600 mb-4">
                      You will be redirected to PayPal to complete your payment securely.
                    </p>
                    <div className="bg-[#ffc439] text-[#003087] py-2 px-4 rounded-md inline-flex items-center font-bold">
                      <i className="fab fa-paypal mr-2"></i> Pay with PayPal
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">
                    Your payment information is secured with SSL encryption
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  Back to Shipping
                </Button>
                <Button onClick={handleSubmitOrder} disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 3: Confirmation */}
          {step === 3 && (
            <Card>
              <CardContent className="pt-6 pb-4 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your purchase. Your order has been received and is being processed.
                </p>
                <div className="bg-gray-50 p-4 rounded-md text-left mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Order Number:</span> #ORD-{Math.floor(100000 + Math.random() * 900000)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Shipping Address:</span> {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Estimated Delivery:</span> {
                      shippingMethod === "express" 
                        ? "1-2 business days" 
                        : shippingMethod === "standard" 
                          ? "3-5 business days" 
                          : "7-10 business days"
                    }
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button onClick={() => setLocation("/")}>Continue Shopping</Button>
                  <Button variant="outline" onClick={() => setLocation("/profile")}>
                    View Order History
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.product.name}</h4>
                      <div className="flex justify-between mt-1">
                        <div className="text-sm text-gray-500">
                          Qty: {item.quantity}
                          {item.color && `, ${item.color}`}
                          {item.size && `, Size: ${item.size}`}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${((item.product.discountedPrice || item.product.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Promo Code Input */}
              {step < 3 && (
                <div className="pt-4">
                  <Label htmlFor="promo-code">Promo Code</Label>
                  <div className="flex mt-2">
                    <Input id="promo-code" placeholder="Enter code" className="rounded-r-none" />
                    <Button className="rounded-l-none" variant="secondary">Apply</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
