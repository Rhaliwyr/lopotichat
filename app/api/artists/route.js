// /app/api/artists/route.js

import { NextResponse } from 'next/server';
import artistsData from '@/data/artists.json';

export async function GET() {
  return NextResponse.json(artistsData);
}
