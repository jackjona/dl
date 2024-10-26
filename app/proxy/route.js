import { NextResponse } from 'next/server'

const validDomains = ['pixeldrain.com', 'cdn.pixeldrain.com'];

export async function GET(request) {
    try {
        const url = new URL(request.url)
        const originUrl = url.searchParams.get('origin')

        if (!originUrl) {
            return NextResponse.json({ error: 'Missing origin parameter' }, { status: 400 })
        }

        const parsedOriginUrl = new URL(originUrl)

        if (parsedOriginUrl.protocol !== 'https:') {
            return NextResponse.json({ error: 'Only HTTPS protocol is allowed' }, { status: 403 })
        }

        if (!validDomains.includes(parsedOriginUrl.hostname)) {
            return NextResponse.json({ error: 'This domain is not in the whitelist' }, { status: 403 })
        }

        const response = await fetch(originUrl, {
            method: 'GET',
            headers: request.headers,
        })

        const newResponse = new NextResponse(response.body, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
                ...response.headers,
            },
        })

        return newResponse
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
