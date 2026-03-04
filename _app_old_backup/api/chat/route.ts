import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, embed } from 'ai';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const prisma = new PrismaClient();
const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const latestMessage = messages[messages.length - 1];

        // 1. ユーザーの質問をベクトル化 (Embedding)
        const { embedding } = await embed({
            model: google.textEmbeddingModel('text-embedding-004'),
            value: latestMessage.content,
        });

        // 2. ベクトル類似度検索 (pgvector)
        const vectorString = `[${embedding.join(',')}]`;
        const searchResults = await prisma.$queryRawUnsafe<Array<{ id: string, title: string, content: string, similarity: number }>>(`
      SELECT 
        id, 
        title, 
        content, 
        1 - (embedding <=> $1::vector) as similarity
      FROM search_documents
      WHERE 1 - (embedding <=> $1::vector) > 0.5
      ORDER BY similarity DESC
      LIMIT 5
    `, vectorString);

        // 3. コンテキストテキストの構築
        const contextText = searchResults.map((doc, idx) => `[参考情報 ${idx + 1}: ${doc.title}]\n${doc.content}`).join('\n\n');

        // 4. Gemini(LLM)にプロンプトとして渡す
        const systemPrompt = `
あなたはピックルボール総合プラットフォーム「I LOVE PICKLEBALL」の公式AIアシスタントです。
ユーザーからの質問に対して、以下の【データベースから抽出された事前コンテキスト】を最優先に参考にして、親切かつ正確に日本語で答えてください。
回答は箇条書きやマークダウンを活用して見やすくし、もし事前コンテキストに答えがない事項は「手元のデータには情報がありません」と誠実に答えてください。

【データベースから抽出された事前コンテキスト】
${contextText || '（関連データが見つかりませんでした）'}
`;

        // 5. ストリーミング応答
        const result = streamText({
            model: google('gemini-1.5-pro'),
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
        });

        return result.toDataStreamResponse();
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
}
