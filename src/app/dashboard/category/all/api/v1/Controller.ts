/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { withDB } from '@/app/api/utils/db';

import Category from './Model';
import { IResponse } from './jwt-verify';
import { connectRedis, getRedisData } from './redis';

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number) => ({ data, message, status });

// CREATE Category
export async function createCategory(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const categoryData = await req.json();
      console.log('categoryData', categoryData);
      const newCategory = await Category.create({ ...categoryData });
      return formatResponse(newCategory, 'Category created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// GET single Category by ID
export async function getCategoryById(req: Request) {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Category ID is required', 400);

    const category = await Category.findById(id);
    if (!category) return formatResponse(null, 'Category not found', 404);

    return formatResponse(category, 'Category fetched successfully', 200);
  });
}

// GET all Category_s with pagination
export async function getCategory_s(req: Request) {
  await connectRedis();
  const getValue = await getRedisData('category_s');
  if (getValue) {
    const { category_s, totalCategory_s, page, limit } = JSON.parse(getValue);
    return formatResponse({ category_s: category_s || [], total: totalCategory_s, page, limit }, 'Category_s fetched successfully', 200);
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
          $or: [{ name: { $regex: searchQuery, $options: 'i' }, subCategory: { $regex: searchQuery, $options: 'i' } }],
        };
      }

      const category_s = await Category.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

      const totalCategory_s = await Category.countDocuments(searchFilter);

      return formatResponse({ category_s: category_s || [], total: totalCategory_s, page, limit }, 'Category_s fetched successfully', 200);
    });
  }
}

// UPDATE single Category by ID
export async function updateCategory(req: Request) {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedCategory) return formatResponse(null, 'Category not found', 404);
      return formatResponse(updatedCategory, 'Category updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// BULK UPDATE Category_s
export async function bulkUpdateCategory_s(req: Request) {
  return withDB(async () => {
    const updates = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }: { id: string; updateData: Record<string, unknown> }) =>
        Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),
      ),
    );

    const successfulUpdates = results.filter(r => r.status === 'fulfilled' && r.value).map(r => (r as PromiseFulfilledResult<typeof Category>).value);
    const failedUpdates = results.filter(r => r.status === 'rejected' || !r.value).map((_, i) => updates[i].id);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

// DELETE single Category by ID
export async function deleteCategory(req: Request) {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) return formatResponse(deletedCategory, 'Category not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Category deleted successfully', 200);
  });
}

// BULK DELETE Category_s
export async function bulkDeleteCategory_s(req: Request) {
  return withDB(async () => {
    const { ids } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const category = await Category.findById(id);
        if (category) {
          const deletedCategory = await Category.findByIdAndDelete(id);
          if (deletedCategory) deletedIds.push(id);
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
