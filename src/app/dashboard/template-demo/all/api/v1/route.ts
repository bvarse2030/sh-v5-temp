/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { handleRateLimit } from './rate-limit';
import { getCategory_s, createCategory, updateCategory, deleteCategory, getCategoryById, bulkUpdateCategory_s, bulkDeleteCategory_s } from './Controller';

// import { formatResponse, handleTokenVerify, IResponse } from './jwt-verify';
import { formatResponse, IResponse } from './jwt-verify';

// GET all Category_s
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getCategoryById(req) : await getCategory_s(req);
  return formatResponse(result.data, result.message, result.status);
}

// CREATE Category
export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const result = await createCategory(req);
  return formatResponse(result.data, result.message, result.status);
}

// UPDATE Category
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateCategory_s(req) : await updateCategory(req);

  return formatResponse(result.data, result.message, result.status);
}

// DELETE Category
export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteCategory_s(req) : await deleteCategory(req);

  return formatResponse(result.data, result.message, result.status);
}
