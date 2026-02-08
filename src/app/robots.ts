import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/go', // Cleaned up trailing slash
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
