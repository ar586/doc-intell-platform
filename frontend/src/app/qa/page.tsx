"use client";
import { useState } from 'react';

export default function QAInterface() {
    const [query, setQuery] = useState('');
    const [chat, setChat] = useState<{ role: string, text: string, sources?: any[] }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        if (!query) return;
        setChat(prev => [...prev, { role: 'user', text: query }]);
        setLoading(true);
        const q = query;
        setQuery('');

        try {
            const res = await fetch('http://localhost:8000/api/ask/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: q })
            });
            const data = await res.json();
            setChat(prev => [...prev, { role: 'ai', text: data.answer || "No text return", sources: data.sources }]);
        } catch (e) {
            setChat(prev => [...prev, { role: 'ai', text: "Error connecting to AI backend. Make sure the Django server is running." }]);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-[#FFF8DC] p-8 rounded-xl shadow-sm border border-amber-100 text-center">
                <h1 className="text-3xl font-extrabold text-amber-900 tracking-tight">Book Intelligence Q&A</h1>
                <p className="text-amber-700 mt-2 font-medium">Ask natural language questions across your entire scanned library.</p>
            </div>

            <div className="bg-[#FFF8DC] rounded-xl shadow-sm border border-amber-200 h-[650px] flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F5F5DC]">
                    {chat.length === 0 && (
                        <div className="text-amber-700 flex items-center justify-center h-full">
                            <p className="font-medium text-lg bg-amber-100/50 px-6 py-3 rounded-full border border-amber-200">Say hello to your DocIntell AI!</p>
                        </div>
                    )}
                    {chat.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm ${msg.role === 'user' ? 'bg-amber-800 text-[#F5F5DC] rounded-tr-sm' : 'bg-[#FFF8DC] text-amber-900 border border-amber-200 rounded-tl-sm'}`}>
                                {msg.text}
                            </div>
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-2 text-xs text-amber-800 max-w-[80%] bg-amber-100/60 px-4 py-2 rounded-md border border-amber-200">
                                    <span className="font-semibold text-amber-900">Retrieved context:</span> {msg.sources.map((s: any) => s.title).join(' • ')}
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-center space-x-2 text-amber-700 text-sm font-medium pl-2">
                            <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse delay-75"></div>
                            <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse delay-150"></div>
                            <span>Analyzing documents...</span>
                        </div>
                    )}
                </div>

                <div className="p-5 bg-[#FFF8DC] border-t border-amber-200 flex gap-3">
                    <input
                        type="text"
                        disabled={loading}
                        className="flex-1 bg-[#F5F5DC] border border-amber-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition shadow-sm text-amber-900 placeholder-amber-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={loading ? 'Waiting for response...' : 'e.g. Which books cover the theme of dystopian futures?'}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !loading && handleAsk()}
                    />
                    <button onClick={handleAsk} disabled={loading} className="bg-amber-800 hover:bg-amber-900 disabled:opacity-50 disabled:cursor-not-allowed text-[#F5F5DC] px-8 py-3 rounded-lg font-bold shadow-sm transition cursor-pointer border border-amber-900">
                        {loading ? 'Thinking...' : 'Ask'}
                    </button>
                </div>
            </div>
        </div>
    );
}
