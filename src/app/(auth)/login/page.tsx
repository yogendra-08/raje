'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TurbanIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Setup Required',
        description: 'Firebase is not configured. Please add your credentials to the .env file.',
      });
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-primary/20">
        <CardHeader className="text-center space-y-2">
          <TurbanIcon className="w-16 h-16 mx-auto text-primary" />
          <CardTitle className="text-4xl font-headline text-primary">राज्याभिषेक</CardTitle>
          <CardDescription className="font-body text-lg">
            Welcome, Royal! Login to your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="maharaj@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-body">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full font-body" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <p className="text-center text-sm text-muted-foreground font-body">
              Don't have an account? <Link href="/signup" className="underline text-primary">Sign Up</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
