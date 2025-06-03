/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { handleRateLimit } from './rate-limit';
import { getClots, createClot, updateClot, deleteClot, getClotById, bulkUpdateClots, bulkDeleteClots } from './Controller';

// import { formatResponse, handleTokenVerify, IResponse } from './jwt-verify';
import { formatResponse, IResponse } from './jwt-verify';

// GET all Clots
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getClotById(req) : await getClots(req);
  return formatResponse(result.data, result.message, result.status);
}

// CREATE Clot
export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const result = await createClot(req);
  return formatResponse(result.data, result.message, result.status);
}

// UPDATE Clot
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateClots(req) : await updateClot(req);

  return formatResponse(result.data, result.message, result.status);
}

// DELETE Clot
export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteClots(req) : await deleteClot(req);

  return formatResponse(result.data, result.message, result.status);
}
