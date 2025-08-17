'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getProductStagingAction } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Wand2 } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full font-body text-lg">
      {pending ? 'Generating Your Royal Setup...' : <>
        <Wand2 className="mr-2 h-5 w-5" />
        Generate Staging
        </>
    }
    </Button>
  );
}

export default function AIStagerPage() {
  const initialState = { stylingSuggestions: '', stagedImageUrl: null, errors: null };
  const [state, formAction] = useActionState(getProductStagingAction, initialState);
  const { pending } = useFormStatus();


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-2 border-primary/10">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <Wand2 className="w-10 h-10" />
            </div>
            <CardTitle className="font-headline text-4xl text-primary">AI Product Staging</CardTitle>
            <CardDescription className="font-body text-lg text-muted-foreground">
              Describe your product, and our AI will generate majestic styling suggestions and a stunning staged photograph.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productDescription" className="font-body text-base">Product Description</Label>
                <Textarea
                  id="productDescription"
                  name="productDescription"
                  placeholder="e.g., A handcrafted wooden chair with intricate carvings."
                  rows={4}
                  required
                  className="text-base"
                />
                                 {state.errors && typeof state.errors === 'object' && 'productDescription' in state.errors && state.errors.productDescription && (
                  <p className="text-sm font-medium text-destructive">{state.errors.productDescription[0]}</p>
                )}
              </div>
              <SubmitButton />
               {state.errors && typeof state.errors === 'object' && '_form' in state.errors && state.errors._form && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.errors._form[0]}</AlertDescription>
                </Alert>
              )}
            </form>

            {(pending || state.stagedImageUrl) && (
              <div className="mt-8 border-t-2 border-dashed border-primary/20 pt-8">
                <h3 className="font-headline text-3xl mb-6 text-center text-primary">Your Royal Setup</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <h4 className="font-headline text-2xl mb-4">Staged Photograph</h4>
                        <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-primary/20 shadow-md">
                        {pending && !state.stagedImageUrl ? (
                            <Skeleton className="w-full h-full" />
                        ) : state.stagedImageUrl ? (
                            <Image src={state.stagedImageUrl} alt="AI generated product staging" layout="fill" objectFit="cover" />
                        ) : null}
                        </div>
                   </div>
                   <div>
                        <h4 className="font-headline text-2xl mb-4">Styling Suggestions</h4>
                        <Card className="bg-secondary/20 h-full">
                            <CardContent className="p-6">
                                {pending && !state.stylingSuggestions ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-5/6" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-4/6" />
                                        <Skeleton className="h-4 w-5/6" />
                                    </div>
                                ) : (
                                    <p className="font-body whitespace-pre-wrap">{state.stylingSuggestions}</p>
                                )}
                            </CardContent>
                        </Card>
                   </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
