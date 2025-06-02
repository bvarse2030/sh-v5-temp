/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { handleRateLimit } from './rate-limit';
import { getProducts, createProduct, updateProduct, deleteProduct, getProductById, bulkUpdateProducts, bulkDeleteProducts } from './Controller';

// import { formatResponse, handleTokenVerify, IResponse } from './jwt-verify';
import { formatResponse, IResponse } from './jwt-verify';

// GET all Products
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getProductById(req) : await getProducts(req);
  return formatResponse(result.data, result.message, result.status);
}

// CREATE Product
export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const result = await createProduct(req);
  return formatResponse(result.data, result.message, result.status);
}

// UPDATE Product
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateProducts(req) : await updateProduct(req);

  return formatResponse(result.data, result.message, result.status);
}

// DELETE Product
export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteProducts(req) : await deleteProduct(req);

  return formatResponse(result.data, result.message, result.status);
}
