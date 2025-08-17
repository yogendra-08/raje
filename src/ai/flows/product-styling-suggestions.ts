// product-styling-suggestions.ts
'use server';

/**
 * @fileOverview Provides AI-powered product staging, including styling suggestions and image generation.
 *
 * - getProductStaging - A function that takes a product description and returns styling suggestions and a staged image.
 * - ProductStagingInput - The input type for the getProductStaging function.
 * - ProductStagingOutput - The return type for the getProductStaging function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductStagingInputSchema = z.object({
  productDescription: z
    .string()
    .describe('The description of the product to be staged.'),
});
export type ProductStagingInput = z.infer<typeof ProductStagingInputSchema>;

const ProductStagingOutputSchema = z.object({
  stylingSuggestions: z
    .string()
    .describe(
      'AI-powered styling suggestions with Maratha empire references for the product setup.'
    ),
  stagedImageUrl: z.string().describe('A data URI of the generated product image in a staged setting.'),
});
export type ProductStagingOutput = z.infer<typeof ProductStagingOutputSchema>;

export async function getProductStaging(
  input: ProductStagingInput
): Promise<ProductStagingOutput> {
  return productStagingFlow(input);
}

const stylingPrompt = ai.definePrompt({
  name: 'productStylingPrompt',
  input: {schema: ProductStagingInputSchema},
  output: {schema: z.object({
    stylingSuggestions: ProductStagingOutputSchema.shape.stylingSuggestions,
  })},
  prompt: `You are an AI assistant specializing in providing styling suggestions for product setups, drawing inspiration from the Maratha Empire. Based on the product description provided, suggest stylings that incorporate Maratha heritage, making the product visually appealing and culturally relevant.

Product Description: {{{productDescription}}}

Styling Suggestions:`,
});


const productStagingFlow = ai.defineFlow(
  {
    name: 'productStagingFlow',
    inputSchema: ProductStagingInputSchema,
    outputSchema: ProductStagingOutputSchema,
  },
  async (input) => {
    const { output: stylingOutput } = await stylingPrompt(input);
    if (!stylingOutput) {
        throw new Error('Failed to generate styling suggestions.');
    }

    const imagePrompt = `A professional, high-resolution product photograph of: "${input.productDescription}". The product should be staged in a majestic setting with the following style inspired by the Maratha Empire: "${stylingOutput.stylingSuggestions}". The image should be clean, well-lit, and visually stunning.`;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: imagePrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
        throw new Error('Failed to generate staged product image.');
    }

    return {
        stylingSuggestions: stylingOutput.stylingSuggestions,
        stagedImageUrl: media.url
    };
  }
);
