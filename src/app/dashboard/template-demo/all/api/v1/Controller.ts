/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { withDB } from '@/app/api/utils/db';

import Clot from './Model';
import { IResponse } from './jwt-verify';
import { connectRedis, getRedisData } from './redis';

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number) => ({ data, message, status, success: true });

// CREATE Clot
export async function createClot(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const clotData = await req.json();
      const newClot = await Clot.create({ ...clotData });
      return formatResponse(newClot, 'Clot created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// GET single Clot by ID
export async function getClotById(req: Request) {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Clot ID is required', 400);

    const clot = await Clot.findById(id);
    if (!clot) return formatResponse(null, 'Clot not found', 404);

    return formatResponse(clot, 'Clot fetched successfully', 200);
  });
}

// GET all Clots with pagination
export async function getClots(req: Request) {
  await connectRedis();
  const getValue = await getRedisData('clots');
  if (getValue) {
    const { clots, totalClots, page, limit } = JSON.parse(getValue);
    return formatResponse({ clots: clots || [], total: totalClots, page, limit }, 'Clots fetched successfully', 200);
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

      const clots = await Clot.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

      const totalClots = await Clot.countDocuments(searchFilter);

      return formatResponse({ clots: clots || [], total: totalClots, page, limit }, 'Clots fetched successfully', 200);
    });
  }
}

// UPDATE single Clot by ID
export async function updateClot(req: Request) {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedClot = await Clot.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedClot) return formatResponse(null, 'Clot not found', 404);
      return formatResponse(updatedClot, 'Clot updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// BULK UPDATE Clots
export async function bulkUpdateClots(req: Request) {
  return withDB(async () => {
    const updates = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }: { id: string; updateData: Record<string, unknown> }) =>
        Clot.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),
      ),
    );

    const successfulUpdates = results.filter(r => r.status === 'fulfilled' && r.value).map(r => (r as PromiseFulfilledResult<typeof Clot>).value);
    const failedUpdates = results.filter(r => r.status === 'rejected' || !r.value).map((_, i) => updates[i].id);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

// DELETE single Clot by ID
export async function deleteClot(req: Request) {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedClot = await Clot.findByIdAndDelete(id);
    if (!deletedClot) return formatResponse(deletedClot, 'Clot not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Clot deleted successfully', 200);
  });
}

// BULK DELETE Clots
export async function bulkDeleteClots(req: Request) {
  return withDB(async () => {
    const { ids } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const clot = await Clot.findById(id);
        if (clot) {
          const deletedClot = await Clot.findByIdAndDelete(id);
          if (deletedClot) deletedIds.push(id);
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
