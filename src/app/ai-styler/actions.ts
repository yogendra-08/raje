'use server';

import { getProductStaging } from '@/ai/flows/product-styling-suggestions';
import { z } from 'zod';

const schema = z.object({
  productDescription: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
});

export async function getProductStagingAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = schema.safeParse({
    productDescription: formData.get('productDescription'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      stylingSuggestions: '',
      stagedImageUrl: null,
    };
  }

  try {
    const result = await getProductStaging({
      productDescription: validatedFields.data.productDescription,
    });
    return { 
      stylingSuggestions: result.stylingSuggestions,
      stagedImageUrl: result.stagedImageUrl,
      errors: null
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while generating suggestions. Please try again.';
    return { 
      stylingSuggestions: '',
      stagedImageUrl: null,
      errors: { _form: [errorMessage] }
    };
  }
}
