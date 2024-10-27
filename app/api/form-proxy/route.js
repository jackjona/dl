import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { url } = await req.json();
    const validDomains = ['pixeldrain.com', 'cdn.pixeldrain.com']; // Also validated in the front-end code
    const domain = new URL(url).hostname;

    if (!validDomains.includes(domain)) {
      return NextResponse.json({ message: 'Invalid domain' }, { status: 400 });
    }

    const fileId = url.match(/\/u\/([^\/]+)/)[1];
    
    const response = await fetch(`https://pixeldrain.com/api/file/${fileId}?download`, {
            headers: {
              'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'accept-encoding': 'gzip, deflate, br, zstd',
              'accept-language': 'en-US,en;q=0.9',
              'priority': 'u=0, i',
              'referer': `https://pixeldrain.com/u/${fileId}`,
              // 'sec-ch-ua': '"Chromium";v="130", "Microsoft Edge";v="130", "Not?A_Brand";v="99"',
              'sec-ch-ua-mobile': '?0',
              // 'sec-ch-ua-platform': '"macOS"',
              'sec-fetch-dest': 'iframe',
              'sec-fetch-mode': 'navigate',
              'sec-fetch-site': 'same-origin',
              'sec-fetch-user': '?1',
              'upgrade-insecure-requests': '1',
             // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
             },
      });
  
      if (!response.ok) {
        return NextResponse.json({ message: `Error fetching data: ${response.statusText}`, originUrl: url }, { status: response.status });
      }

    return new Response(response.body, {
      status: response.status,
      headers: {
        ...response.headers,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
