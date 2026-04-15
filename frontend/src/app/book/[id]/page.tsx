"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState<any>(null);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:8000/api/books/${id}/`)
                .then(res => res.json())
                .then(data => setBook(data));

            fetch(`http://localhost:8000/api/books/${id}/recommend/`)
                .then(res => res.json())
                .then(data => setRecommendations(data.recommendations || []));
        }
    }, [id]);

    if (!book) return <div className="p-20 text-center text-amber-700 font-medium">Loading detail view...</div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <Link href="/" className="inline-flex items-center text-amber-800 hover:text-amber-900 font-bold transition">&larr; Back to Dashboard</Link>

            <div className="bg-[#FFF8DC] p-10 rounded-2xl shadow-sm border border-amber-100 flex flex-col md:flex-row gap-10">
                {book.cover_image_url && (
                    <img src={book.cover_image_url} alt={book.title} className="w-full md:w-1/3 max-h-96 rounded-xl object-contain shadow-sm border border-amber-50 bg-[#F5F5DC] p-4" />
                )}
                <div className="flex-1 space-y-4">
                    <h1 className="text-4xl font-extrabold text-amber-900 tracking-tight">{book.title}</h1>
                    <p className="text-xl text-amber-800 font-medium">By {book.author}</p>
                    <div className="inline-block bg-amber-100 text-amber-900 px-4 py-1.5 rounded font-bold text-sm border border-amber-200">Rating: {book.rating}</div>

                    <div className="mt-8 border-t border-amber-200 pt-6">
                        <h3 className="text-2xl font-bold text-amber-900 mb-4">Synopsis</h3>
                        <p className="text-amber-800 leading-relaxed whitespace-pre-wrap">{book.description}</p>
                    </div>

                    {book.url && (
                        <div className="pt-6">
                            <a href={book.url} target="_blank" className="inline-block text-[#F5F5DC] bg-amber-800 px-6 py-3 rounded-lg hover:bg-amber-900 transition shadow-sm font-semibold">
                                Read Original Source
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {recommendations.length > 0 && (
                <div className="space-y-6 mt-12 bg-[#FFF8DC] p-8 rounded-2xl shadow-sm border border-amber-100">
                    <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-200 pb-4">You May Also Like</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {recommendations.map((rec: any) => (
                            <Link href={`/book/${rec.book_id}`} key={rec.book_id} className="bg-[#F5F5DC] p-5 rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-md transition flex flex-col">
                                <h4 className="font-bold text-amber-900 line-clamp-2 mb-2">{rec.title}</h4>
                                <p className="text-sm text-amber-700 font-medium truncate mt-auto">{rec.author}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
