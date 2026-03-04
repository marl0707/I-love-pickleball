'use client';

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // オートスクロール
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <>
            {/* チャットウィンドウ */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 sm:right-6 w-[350px] sm:w-[400px] max-h-[600px] h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Bot className="w-6 h-6" />
                            <h3 className="font-semibold text-lg tracking-tight">AI アシスタント</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white transition-colors"
                            aria-label="閉じる"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 text-sm">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10">
                                <Bot className="w-12 h-12 mx-auto mb-3 text-indigo-300 opacity-50" />
                                <p>こんにちは！「I LOVE PICKLEBALL」のAIアシスタントです。</p>
                                <p className="mt-2 text-xs">施設やイベント、ルールについて何でも聞いてください。</p>
                            </div>
                        ) : (
                            messages.map(m => (
                                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                                    {m.role !== 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                                            <Bot className="w-5 h-5" />
                                        </div>
                                    )}
                                    <div
                                        className={`px-4 py-2.5 rounded-2xl max-w-[80%] whitespace-pre-wrap ${m.role === 'user'
                                                ? 'bg-blue-600 text-white rounded-tr-sm'
                                                : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm'
                                            }`}
                                    >
                                        {m.content}
                                    </div>
                                    {m.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                                            <User className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}

                        {isLoading && (
                            <div className="flex justify-start gap-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="px-4 py-3 rounded-2xl bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                    <span className="text-gray-400 text-xs">検索中...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t">
                        <div className="relative flex items-center">
                            <input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="何か質問はありますか？..."
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-full transition-all outline-none"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                aria-label="送信"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 開閉ボタン */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center z-50"
                aria-label="AIチャットを開く"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </>
    );
}
