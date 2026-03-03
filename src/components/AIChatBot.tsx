"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
    role: "user" | "model";
    content: string;
}

// サイトごとにカスタマイズ可能なプロパティ
interface AIChatBotProps {
    siteName?: string;
    greeting?: string;
    accentColor?: string;
    basePath?: string;
}

// AIの応答テキスト内のURLをクリック可能なボタンに変換するコンポーネント
function RenderMessageContent({ content, accentColor }: { content: string; accentColor: string }) {
    // URL: で始まる行を検出してボタンに変換
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let textBuffer = "";
    let articleTitle = "";

    const flushText = () => {
        if (textBuffer.trim()) {
            elements.push(
                <span key={`text-${elements.length}`} className="whitespace-pre-wrap">
                    {textBuffer}
                </span>
            );
        }
        textBuffer = "";
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 記事タイトル行を記憶（**タイトル** 形式）
        const titleMatch = line.match(/\*\*(.+?)\*\*/);
        if (titleMatch) {
            articleTitle = titleMatch[1];
        }

        // URL行を検出
        const urlMatch = line.match(/URL:\s*(.+)/);
        if (urlMatch) {
            flushText();
            const url = urlMatch[1].trim();
            elements.push(
                <a
                    key={`link-${elements.length}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 mt-2 mb-1 px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90 hover:shadow-lg no-underline"
                    style={{ backgroundColor: accentColor }}
                >
                    📄 詳しく見る
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </a>
            );
            articleTitle = "";
            // URLの後の改行をスキップ
            continue;
        }

        textBuffer += (textBuffer ? "\n" : "") + line;
    }
    flushText();

    return <>{elements}</>;
}

export default function AIChatBot({
    siteName = "AIアシスタント",
    greeting = "こんにちは！お探しの情報や、サイトの改善点・誤情報の指摘などがあれば教えてください🙌",
    accentColor = "#2d6a4f",
    basePath = "",
}: AIChatBotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionEnded, setSessionEnded] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 自動スクロール
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 開いた時にinputにフォーカス
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading || sessionEnded) return;

        const userMessage: Message = { role: "user", content: text.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);
        setShowSuggestions(false);

        try {
            const res = await fetch(`${basePath}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text.trim(),
                    history: newMessages,
                    pageUrl: typeof window !== "undefined" ? window.location.pathname : "",
                }),
            });

            if (res.status === 429) {
                const data = await res.json();
                setMessages([
                    ...newMessages,
                    { role: "model", content: `⚠️ ${data.error || "リクエスト制限を超えました。しばらくしてからお試しください。"}` },
                ]);
                return;
            }

            const data = await res.json();

            if (data.error) {
                setMessages([...newMessages, { role: "model", content: `⚠️ ${data.error}` }]);
            } else {
                setMessages([...newMessages, { role: "model", content: data.reply }]);
                if (data.sessionEnded) setSessionEnded(true);
            }
        } catch {
            setMessages([
                ...newMessages,
                { role: "model", content: "⚠️ 通信エラーが発生しました。もう一度お試しください。" },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleSuggestion = (text: string) => {
        sendMessage(text);
    };

    const resetSession = () => {
        setMessages([]);
        setSessionEnded(false);
        setShowSuggestions(true);
    };

    const [showTooltip, setShowTooltip] = useState(true);

    // チャットを開いたら吹き出しを非表示に
    useEffect(() => {
        if (isOpen) setShowTooltip(false);
    }, [isOpen]);

    return (
        <>
            {/* 吹き出し + フローティングボタン */}
            <div className="fixed bottom-6 right-6 z-[9999] flex items-end gap-2">
                {/* 吹き出し */}
                {showTooltip && !isOpen && (
                    <div
                        className="relative bg-white rounded-2xl shadow-xl px-4 py-3 border border-gray-200 animate-bounce cursor-pointer"
                        style={{ animationDuration: "2s" }}
                        onClick={() => { setIsOpen(true); setShowTooltip(false); }}
                    >
                        <p className="text-sm font-bold text-gray-800 whitespace-nowrap">✨ AIに質問してみよう！</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">クリックで開きます</p>
                        {/* 吹き出しの三角 */}
                        <div className="absolute -right-2 bottom-3 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] border-l-white" />
                    </div>
                )}

                {/* フローティングボタン */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ backgroundColor: accentColor }}
                    className="w-14 h-14 rounded-full shadow-lg text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl flex-shrink-0"
                    aria-label="AIチャットを開く"
                >
                    {isOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* チャットウィンドウ */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl z-[9998] flex flex-col overflow-hidden border border-gray-200"
                    style={{ height: "min(520px, calc(100vh - 8rem))" }}
                >
                    {/* ヘッダー */}
                    <div
                        style={{ backgroundColor: accentColor }}
                        className="px-4 py-3 text-white flex items-center justify-between flex-shrink-0"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                                ✨
                            </div>
                            <div>
                                <p className="font-medium text-sm">{siteName}</p>
                                <p className="text-xs opacity-80">AI で何でもお答えします</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* メッセージエリア */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {/* 最初の挨拶 */}
                        <div className="flex gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                                style={{ backgroundColor: `${accentColor}20` }}>
                                ✨
                            </div>
                            <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%] shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-700 leading-relaxed">{greeting}</p>
                            </div>
                        </div>

                        {/* サジェストボタン */}
                        {showSuggestions && messages.length === 0 && (
                            <div className="flex flex-col gap-2 pl-9">
                                <button
                                    onClick={() => handleSuggestion("💡 サイトの改善・要望を送る")}
                                    className="text-left text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
                                >
                                    💡 サイトの改善・要望を送る
                                </button>
                                <button
                                    onClick={() => handleSuggestion("🚨 間違っている情報を報告する")}
                                    className="text-left text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
                                >
                                    🚨 間違っている情報を報告する
                                </button>
                            </div>
                        )}

                        {/* 会話メッセージ */}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                                {msg.role === "model" && (
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                                        style={{ backgroundColor: `${accentColor}20` }}>
                                        ✨
                                    </div>
                                )}
                                <div
                                    className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] shadow-sm ${msg.role === "user"
                                        ? "text-white rounded-tr-sm"
                                        : "bg-white rounded-tl-sm border border-gray-100"
                                        }`}
                                    style={msg.role === "user" ? { backgroundColor: accentColor } : {}}
                                >
                                    <div className={`text-sm leading-relaxed ${msg.role === "user" ? "text-white" : "text-gray-700"
                                        }`}>
                                        {msg.role === "model" ? (
                                            <RenderMessageContent content={msg.content} accentColor={accentColor} />
                                        ) : (
                                            <span className="whitespace-pre-wrap">{msg.content}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* ローディング表示 */}
                        {isLoading && (
                            <div className="flex gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                                    style={{ backgroundColor: `${accentColor}20` }}>
                                    ✨
                                </div>
                                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* 入力エリア */}
                    <div className="p-3 border-t border-gray-100 bg-white flex-shrink-0">
                        {sessionEnded ? (
                            <button
                                onClick={resetSession}
                                style={{ backgroundColor: accentColor }}
                                className="w-full py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                新しい会話を始める
                            </button>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="お困りのことを入力してください..."
                                    className="flex-1 px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50"
                                    style={{ ["--tw-ring-color" as any]: `${accentColor}40` }}
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    style={{ backgroundColor: accentColor }}
                                    className="px-3.5 py-2.5 rounded-xl text-white disabled:opacity-40 transition-opacity hover:opacity-90"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                    </svg>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
