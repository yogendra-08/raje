'use client';

import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Shield, 
  Truck,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.displayName || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');

  const shippingCost = totalPrice > 5000 ? 0 : 200;
  const tax = totalPrice * 0.18; // 18% GST
  const finalTotal = totalPrice + shippingCost + tax;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with Stripe
    setStep('confirmation');
    clearCart();
  };

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>Your Cart is Empty</CardTitle>
            <CardDescription>Add some royal artifacts to your cart first.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="mx-auto bg-green-100 text-green-600 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <CardTitle className="text-2xl text-green-600">Order Confirmed!</CardTitle>
            <CardDescription>
              Thank you for your purchase. Your order has been successfully placed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-medium">Order ID: ORD-{Date.now().toString().slice(-6)}</p>
              <p className="text-sm text-muted-foreground">
                You will receive an email confirmation shortly.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="outline">View Orders</Button>
              </Link>
              <Link href="/">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/cart" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-4xl font-headline text-primary mb-2">Royal Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase with dignity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {step === 'shipping' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
                <CardDescription>
                  Enter your delivery address for your royal artifacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="card"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="text-primary"
                      />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="upi"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="text-primary"
                      />
                      <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="h-4 w-4" />
                        UPI Payment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="netbanking"
                        name="payment"
                        value="netbanking"
                        checked={paymentMethod === 'netbanking'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="text-primary"
                      />
                      <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer">
                        <Truck className="h-4 w-4" />
                        Net Banking
                      </Label>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input id="cardName" placeholder="John Doe" required />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('shipping')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1">
                      Pay ₹{finalTotal.toLocaleString()}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                                 <div className="flex justify-between">
                   <span>Subtotal</span>
                   <span>₹{totalPrice.toLocaleString()}</span>
                 </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {shippingCost > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                                   <p className="text-sm text-blue-700">
                   Add ₹{(5000 - totalPrice).toLocaleString()} more for free shipping!
                 </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{shippingAddress.fullName}</p>
                <p className="text-muted-foreground">{shippingAddress.address}</p>
                <p className="text-muted-foreground">
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
                </p>
                <p className="text-muted-foreground">{shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 