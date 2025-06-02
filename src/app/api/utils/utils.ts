import { NextResponse } from 'next/server';

export interface IResponse {
  data: unknown;
  message: string;
  status: number;
  success: boolean;
}
export const formatResponse = (data: unknown, message: string, status: number) => NextResponse.json({ data, message, status }, { status });
