// AIチャットボット API Route — I Love Pickleball
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pool } from "pg";
import { checkRateLimit } from "@/lib/rate-limit";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const SYSTEM_PROMPT = `あなたは「I LOVE PICKLEBALL」のAIアシスタントです。
ピックルボールに興味のある方のために、サイト内の記事や施設・ギア情報をもとにお答えします。

## ルール
- サイト内の記事データをもとに回答してください。
- わからないことは正直に「わかりません」と答えてください。
- 関連する記事が見つからなかった場合は、「現在その情報に関する記事はまだありませんが、貴重なご要望として記録させていただきました。今後の記事作成の参考にいたします！」と答えてください。
- ユーザーが「間違っている情報を報告する」「改善要望を送る」と言った場合は、フィードバック収集モードに入り、具体的にどのページのどの部分が気になるかを聞き出してください。
- ピックルボールと全く関係ない質問には、「ピックルボールに関する情報をお探しでしたら、お気軽にお聞きください🏓」と丁寧にお断りしてください。
- 回答は簡潔に、日本語で行ってください。
- 関連する記事がある場合は、記事タイトルとURLを案内してください。`;

interface ChatMessage {
    role: "user" | "model";
    content: string;
}

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip") ||
            "unknown";
        const rateLimit = checkRateLimit(ip);
        if (!rateLimit.success) {
            return NextResponse.json(
                { error: "リクエスト数の制限を超えました。しばらくしてからお試しください。", resetIn: rateLimit.resetIn },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { message, history = [], pageUrl } = body as {
            message: string;
            history: ChatMessage[];
            pageUrl?: string;
        };

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "メッセージが必要です。" }, { status: 400 });
        }

        if (history.length >= 20) {
            return NextResponse.json({
                reply: "会話が長くなりましたので、新しいセッションを開始してください。ありがとうございました！🙌",
                sessionEnded: true,
            });
        }

        // --- RAG: 関連記事を検索 ---
        let relevantArticles = "";
        let noRelevantData = false;
        try {
            const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
            const embeddingResult = await embeddingModel.embedContent({
                content: { role: "user", parts: [{ text: message }] },
            });
            const queryEmbedding = embeddingResult.embedding.values;

            const searchResult = await pool.query(
                `SELECT title, slug, content, category
         FROM articles 
         WHERE embedding IS NOT NULL AND status = 'PUBLISHED'
         ORDER BY embedding <=> $1::vector
         LIMIT 3`,
                [`[${queryEmbedding.join(",")}]`]
            );

            if (searchResult.rows.length > 0) {
                relevantArticles = "\n\n## 参考記事:\n" + searchResult.rows.map((row: any) => {
                    const content = (row.content || "").substring(0, 500);
                    return `### ${row.title}\nURL: /pickleball/articles/${row.slug}\nカテゴリ: ${row.category || "不明"}\n内容: ${content}...`;
                }).join("\n\n");
            } else {
                noRelevantData = true;
                relevantArticles = "\n\n## 注意: 関連する記事が見つかりませんでした。ユーザーの質問内容は要望として自動記録されています。";
            }
        } catch (embError) {
            console.error("Embedding検索エラー:", embError);
        }

        // --- データ不在時に質問を要望として自動保存 ---
        if (noRelevantData && history.length === 0) {
            try {
                await pool.query(
                    `INSERT INTO chat_feedbacks (page_url, feedback_type, content, ai_summary)
                     VALUES ($1, $2, $3, $4)`,
                    [pageUrl || null, "content_request", message, "データ不在: ユーザーが探していた情報がサイトに存在しない"]
                );
            } catch (dbError) {
                console.error("コンテンツリクエスト保存エラー:", dbError);
            }
        }

        // --- フィードバック検出 & DB保存 ---
        const feedbackKeywords = ["間違", "誤り", "修正", "改善", "要望", "報告", "違う", "おかしい"];
        const isFeedback = feedbackKeywords.some(kw => message.includes(kw));

        if (isFeedback && history.length >= 4) {
            try {
                const feedbackType = message.includes("間違") || message.includes("誤り") || message.includes("違う")
                    ? "error_report" : "improvement";
                await pool.query(
                    `INSERT INTO chat_feedbacks (page_url, feedback_type, content, ai_summary)
           VALUES ($1, $2, $3, $4)`,
                    [pageUrl || null, feedbackType, message, `会話履歴: ${history.length}ターン`]
                );
            } catch (dbError) {
                console.error("フィードバック保存エラー:", dbError);
            }
        }

        // --- Gemini で回答生成 ---
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chatHistory = history.map((msg: ChatMessage) => ({
            role: msg.role === "user" ? "user" as const : "model" as const,
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history: chatHistory,
            systemInstruction: {
                role: "user",
                parts: [{ text: SYSTEM_PROMPT + relevantArticles }],
            },
        });

        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        return NextResponse.json({ reply, sessionEnded: false });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "申し訳ありません。エラーが発生しました。" },
            { status: 500 }
        );
    }
}
