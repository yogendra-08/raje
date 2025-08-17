'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { ShieldIcon } from "@/components/icons";
import { Swords, Trash2, Plus, Minus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

function ProgressBar() {
    return (
        <div className="flex items-center w-full my-8">
            <div className="flex flex-col items-center text-primary">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                    <ShieldIcon className="w-6 h-6"/>
                </div>
                <p className="mt-2 text-sm font-headline">Cart</p>
            </div>
            <div className="flex-grow h-1 mx-2 rounded bg-border" />
            <div className="flex flex-col items-center text-muted-foreground">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-dashed">
                    <ShieldIcon className="w-6 h-6"/>
                </div>
                <p className="mt-2 text-sm font-headline">Checkout</p>
            </div>
            <div className="flex-grow h-1 mx-2 rounded bg-border" />
            <div className="flex flex-col items-center text-muted-foreground">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-dashed">
                    <Swords className="w-6 h-6"/>
                </div>
                <p className="mt-2 text-sm font-headline">Confirmation</p>
            </div>
        </div>
    )
}

export default function CartPage() {
  const { user } = useAuth();
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const shipping = 150;
  const total = totalPrice + shipping;

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed to checkout.",
        variant: "destructive"
      });
      router.push('/login');
    } else {
      toast({
        title: 'Proceeding to Checkout',
        description: 'You are being redirected to the checkout page.',
      })
      // Navigate to the checkout page.
      router.push('/checkout');
    }
  };
  
  if (items.length === 0) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-headline text-primary mb-4">Your Royal Cart is Empty</h1>
            <p className="text-muted-foreground font-body mb-8">It seems you have no artifacts in your cart. Time to explore the kingdom's treasures!</p>
            <Button asChild>
                <Link href="/">Explore Products</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-headline text-center mb-4 text-primary">Your Royal Cart</h1>
      <p className="text-center text-muted-foreground font-body mb-8">Review your chosen artifacts before proceeding.</p>

      <ProgressBar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Cart Items ({totalItems})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md border" data-ai-hint={item.aiHint} />
                      <div>
                        <h3 className="font-headline text-lg">{item.name}</h3>
                        <p className="font-body font-semibold text-primary">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)} className="w-16 h-8 text-center" />
                             <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between font-body">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-body">
                <span>Shipping</span>
                <span>₹{shipping.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-headline text-xl font-bold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
               <Separator />
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="donation" />
                <Label htmlFor="donation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-body">
                  Add ₹100 donation to Shivaji heritage preservation.
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCheckout}>Proceed to Checkout</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
