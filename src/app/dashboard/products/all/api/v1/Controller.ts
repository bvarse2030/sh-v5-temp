/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { withDB } from '@/app/api/utils/db';

import Product from './Model';
import { IResponse } from './jwt-verify';
import { connectRedis, getRedisData } from './redis';

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number) => ({ data, message, status });

// CREATE Product
export async function createProduct(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const productData = await req.json();
      const newProduct = await Product.create({ ...productData });
      return formatResponse(newProduct, 'Product created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// GET single Product by ID
export async function getProductById(req: Request) {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Product ID is required', 400);

    const product = await Product.findById(id);
    if (!product) return formatResponse(null, 'Product not found', 404);

    return formatResponse(product, 'Product fetched successfully', 200);
  });
}

// GET all Products with pagination
export async function getProducts(req: Request) {
  await connectRedis();
  const getValue = await getRedisData('products');
  if (getValue) {
    const { products, totalProducts, page, limit } = JSON.parse(getValue);
    return formatResponse({ products: products || [], total: totalProducts, page, limit }, 'Products fetched successfully', 200);
  } else {
    return withDB(async () => {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const limit = parseInt(url.searchParams.get('limit') || '10', 10);
      const skip = (page - 1) * limit;

      const searchQuery = url.searchParams.get('q');

      let searchFilter = {};

      // Apply search filter only if search query is provided
      if (searchQuery) {
        searchFilter = {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } },
            { alias: { $regex: searchQuery, $options: 'i' } },
          ],
        };
      }

      const products = await Product.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

      const totalProducts = await Product.countDocuments(searchFilter);

      return formatResponse({ products: products || [], total: totalProducts, page, limit }, 'Products fetched successfully', 200);
    });
  }
}

// UPDATE single Product by ID
export async function updateProduct(req: Request) {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedProduct) return formatResponse(null, 'Product not found', 404);
      return formatResponse(updatedProduct, 'Product updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// BULK UPDATE Products
export async function bulkUpdateProducts(req: Request) {
  return withDB(async () => {
    const updates = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }: { id: string; updateData: Record<string, unknown> }) =>
        Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),
      ),
    );

    const successfulUpdates = results.filter(r => r.status === 'fulfilled' && r.value).map(r => (r as PromiseFulfilledResult<typeof Product>).value);
    const failedUpdates = results.filter(r => r.status === 'rejected' || !r.value).map((_, i) => updates[i].id);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

// DELETE single Product by ID
export async function deleteProduct(req: Request) {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return formatResponse(deletedProduct, 'Product not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Product deleted successfully', 200);
  });
}

// BULK DELETE Products
export async function bulkDeleteProducts(req: Request) {
  return withDB(async () => {
    const { ids } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const product = await Product.findById(id);
        if (product) {
          const deletedProduct = await Product.findByIdAndDelete(id);
          if (deletedProduct) deletedIds.push(id);
        } else {
          invalidIds.push(id);
        }
      } catch {
        invalidIds.push(id);
      }
    }

    return formatResponse({ deleted: deletedIds.length, deletedIds, invalidIds }, 'Bulk delete operation completed', 200);
  });
}
