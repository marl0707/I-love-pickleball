import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 各種動的データの取得
    const facilities = await prisma.facility.findMany({ select: { id: true, updatedAt: true } });
    const articles = await prisma.article.findMany({ where: { status: 'published' }, select: { slug: true, updatedAt: true } });
    const gears = await prisma.gearPaddle.findMany({ select: { id: true, updatedAt: true } });
    const players = await prisma.proPlayer.findMany({ select: { id: true, updatedAt: true } });
    const categories = await prisma.communityCategory.findMany({ select: { slug: true } });
    const posts = await prisma.communityPost.findMany({ select: { id: true, updatedAt: true }, take: 200, orderBy: { createdAt: 'desc' } });

    const sitemapEntries: MetadataRoute.Sitemap = [
        { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/facilities`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/gear`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/players`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    ];

    facilities.forEach((f) => {
        sitemapEntries.push({
            url: `${baseUrl}/facilities/${f.id}`,
            lastModified: f.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.6,
        });
    });

    articles.forEach((a) => {
        sitemapEntries.push({
            url: `${baseUrl}/articles/${a.slug}`,
            lastModified: a.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.7,
        });
    });

    gears.forEach((g) => {
        sitemapEntries.push({
            url: `${baseUrl}/gear/${g.id}`,
            lastModified: g.updatedAt,
            changeFrequency: 'monthly',
            priority: 0.6,
        });
    });

    players.forEach((p) => {
        sitemapEntries.push({
            url: `${baseUrl}/players/${p.id}`,
            lastModified: p.updatedAt,
            changeFrequency: 'monthly',
            priority: 0.5,
        });
    });

    categories.forEach((c) => {
        sitemapEntries.push({
            url: `${baseUrl}/community/category/${c.slug}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        });
    });

    posts.forEach((p) => {
        sitemapEntries.push({
            url: `${baseUrl}/community/post/${p.id}`,
            lastModified: p.updatedAt,
            changeFrequency: 'daily',
            priority: 0.6,
        });
    });

    return sitemapEntries;
}
