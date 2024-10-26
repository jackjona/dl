import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://pixeldrain.com/api/misc/rate_limits'); // Pixeldrain API Rate Limit URL
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
