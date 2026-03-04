import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { id, advertiserName, targetUrl, imageUrl } = body

        if (!id || !advertiserName || !targetUrl || !imageUrl) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        // 入札が自分のものか確認
        const bid = await prisma.adBid.findUnique({
            where: { id }
        })

        if (!bid || bid.bidderId !== user.id) {
            return new NextResponse('Bid not found or unauthorized', { status: 404 })
        }

        const updatedBid = await prisma.adBid.update({
            where: { id },
            data: {
                advertiserName,
                targetUrl,
                imageUrl,
            }
        })

        return NextResponse.json({ success: true, bid: updatedBid })

    } catch (error: any) {
        console.error('Error updating AdBid:', error)
        return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 })
    }
}
