/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { withDB } from '@/app/api/utils/db';

import ProductModel, { IProduct } from './Model';
import { IResponse } from './jwt-verify';
import { connectRedis, getRedisData, setRedisData } from './redis';
import mongoose from 'mongoose';

const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
  success: status >= 200 && status < 300,
});

export async function createProduct(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const productData: Partial<IProduct> = await req.json();

      if (!productData.productUID) {
        return formatResponse(null, 'Missing required product fields', 400);
      }
      console.log('productData', productData);
      const newProduct = await ProductModel.create(productData);
      return formatResponse(newProduct.toObject(), 'Product created successfully', 201);
    } catch (error: unknown) {
      const e = error as { code?: number; message?: string; keyValue?: Record<string, unknown> };
      if (e.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(e.keyValue)} already exists.`, 409);
      }
      console.error('Error creating product:', error);
      return formatResponse(null, e.message || 'Failed to create product', 500);
    }
  });
}

export async function getProductById(req: Request) {
  return withDB(async () => {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const productUID = url.searchParams.get('productUID');

    if (!id && !productUID) {
      return formatResponse(null, 'Product ID or ProductUID is required', 400);
    }

    let product: IProduct | null = null;

    if (id) {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        if (!productUID) {
          product = await ProductModel.findOne({ productUID: id });
        } else {
          product = await ProductModel.findOne({ productUID: id });
        }
      } else {
        product = await ProductModel.findById(id);
      }
    }

    if (!product && productUID) {
      product = await ProductModel.findOne({ productUID });
    }

    if (!product) {
      return formatResponse(null, 'Product not found', 404);
    }

    return formatResponse(product, 'Product fetched successfully', 200);
  });
}

export async function getProducts(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const searchQuery = url.searchParams.get('q')?.trim();
  const category = url.searchParams.get('category')?.trim();
  const status = url.searchParams.get('status')?.trim();
  const sortBy = url.searchParams.get('sortBy') || 'updatedAt';
  const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 1 : -1;

  const cacheKey = `products:page${page}:limit${limit}:q${searchQuery || ''}:cat${category || ''}:status${status || ''}:sortBy${sortBy}:sortOrder${sortOrder}`;

  try {
    await connectRedis();
    const cachedData = await getRedisData(cacheKey);
    if (cachedData) {
      const { products, totalProducts } = JSON.parse(cachedData);
      return formatResponse({ products: products || [], total: totalProducts, page, limit, source: 'cache' }, 'Products fetched successfully from cache', 200);
    }
  } catch (redisError) {
    console.warn('Redis error in getProducts (cache lookup):', redisError);
  }

  return withDB(async () => {
    try {
      const skip = (page - 1) * limit;
      const searchFilter: mongoose.FilterQuery<IProduct> = {};

      if (searchQuery) {
        searchFilter.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { productUID: { $regex: searchQuery, $options: 'i' } },
        ];
      }
      if (category) {
        searchFilter.category = { $regex: `^${category}$`, $options: 'i' };
      }
      if (status) {
        searchFilter.productStatus = status as IProduct['productStatus'];
      }

      const sortOptions: { [key: string]: 1 | -1 } = {};
      if (['name', 'realPrice', 'discountPrice', 'totalSells', 'createdAt', 'updatedAt'].includes(sortBy)) {
        sortOptions[sortBy] = sortOrder;
      } else {
        sortOptions['updatedAt'] = -1;
      }
      if (sortBy !== '_id' && sortBy !== 'productUID') {
        sortOptions['_id'] = 1;
      }

      const products = await ProductModel.find(searchFilter).sort(sortOptions).skip(skip).limit(limit).lean();

      const totalProducts = await ProductModel.countDocuments(searchFilter);

      try {
        await setRedisData(cacheKey, JSON.stringify({ products, totalProducts }));
      } catch (redisError) {
        console.warn('Redis error in getProducts (cache set):', redisError);
      }

      return formatResponse({ products: products || [], total: totalProducts, page, limit, source: 'db' }, 'Products fetched successfully from DB', 200);
    } catch (error) {
      console.error('Error fetching products:', error);
      return formatResponse(null, (error as Error).message || 'Failed to fetch products', 500);
    }
  });
}

export async function updateProduct(req: Request) {
  return withDB(async () => {
    try {
      const payload = await req.json();
      const id = payload.id;
      const updateData: Partial<IProduct> = payload.updateData;

      if (!id) {
        return formatResponse(null, 'Product ID (_id) is required for update.', 400);
      }
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return formatResponse(null, 'Invalid Product ID (_id) format.', 400);
      }
      if (!updateData || Object.keys(updateData).length === 0) {
        return formatResponse(null, 'No update data provided.', 400);
      }
      if (updateData.productUID) {
        const existingProduct = await ProductModel.findOne({ productUID: updateData.productUID, _id: { $ne: id } });
        if (existingProduct) {
          return formatResponse(null, `ProductUID '${updateData.productUID}' is already in use by another product.`, 409);
        }
      }

      const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedProduct) {
        return formatResponse(null, 'Product not found or no changes made', 404);
      }
      return formatResponse(updatedProduct.toObject(), 'Product updated successfully', 200);
    } catch (error: unknown) {
      const e = error as { code?: number; message?: string; keyValue?: Record<string, unknown>; errors?: any };
      if (e.code === 11000) {
        return formatResponse(null, `Update failed: ${JSON.stringify(e.keyValue)} already exists.`, 409);
      }
      if (e.errors) {
        return formatResponse(e.errors, 'Validation failed during update', 400);
      }
      console.error('Error updating product:', error);
      return formatResponse(null, e.message || 'Failed to update product', 500);
    }
  });
}

export async function bulkUpdateProducts(req: Request) {
  return withDB(async () => {
    try {
      const updates: Array<{ id: string; updateData: Partial<IProduct> }> = await req.json();

      if (!Array.isArray(updates) || updates.length === 0) {
        return formatResponse(null, 'No update operations provided.', 400);
      }

      const bulkOps = updates
        .map(op => {
          if (!op.id || !op.id.match(/^[0-9a-fA-F]{24}$/)) {
            console.warn(`Invalid ID format for bulk update: ${op.id}`);
            return null;
          }
          if (op.updateData.productUID) {
            console.warn(`Attempt to update productUID in bulk for ID ${op.id} - this might be restricted.`);
          }
          return {
            updateOne: {
              filter: { _id: op.id },
              update: { $set: op.updateData },
            },
          };
        })
        .filter(op => op !== null);

      if (bulkOps.length === 0) {
        return formatResponse(null, 'No valid update operations to perform.', 400);
      }

      const result = await ProductModel.bulkWrite(bulkOps as any, { ordered: false });

      return formatResponse(
        {
          acknowledged: result.isOk(),
          modifiedCount: result.modifiedCount,
          upsertedCount: result.upsertedCount,
          matchedCount: result.matchedCount,
        },
        'Bulk update operation completed',
        200,
      );
    } catch (error) {
      console.error('Error in bulk updating products:', error);
      return formatResponse(null, (error as Error).message || 'Failed to bulk update products', 500);
    }
  });
}

export async function deleteProduct(req: Request) {
  return withDB(async () => {
    try {
      const { id } = await req.json();

      if (!id) {
        return formatResponse(null, 'Product ID (_id) is required for deletion.', 400);
      }
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return formatResponse(null, 'Invalid Product ID (_id) format.', 400);
      }

      const deletedProduct = await ProductModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        return formatResponse(null, 'Product not found', 404);
      }
      return formatResponse({ deletedId: deletedProduct._id, message: 'Product deleted successfully' }, 'Product deleted successfully', 200);
    } catch (error) {
      console.error('Error deleting product:', error);
      return formatResponse(null, (error as Error).message || 'Failed to delete product', 500);
    }
  });
}

export async function bulkDeleteProducts(req: Request) {
  return withDB(async () => {
    try {
      const { ids }: { ids: string[] } = await req.json();

      if (!Array.isArray(ids) || ids.length === 0) {
        return formatResponse(null, 'No product IDs provided for bulk deletion.', 400);
      }

      const validIds = ids.filter(id => id && id.match(/^[0-9a-fA-F]{24}$/));
      const invalidIds = ids.filter(id => !id || !id.match(/^[0-9a-fA-F]{24}$/));

      if (validIds.length === 0) {
        return formatResponse({ deletedCount: 0, invalidIds }, 'No valid product IDs provided for deletion.', 400);
      }

      const result = await ProductModel.deleteMany({ _id: { $in: validIds } });

      return formatResponse(
        {
          deletedCount: result.deletedCount,
          invalidIds: invalidIds,
        },
        'Bulk delete operation completed',
        200,
      );
    } catch (error) {
      console.error('Error in bulk deleting products:', error);
      return formatResponse(null, (error as Error).message || 'Failed to bulk delete products', 500);
    }
  });
}
