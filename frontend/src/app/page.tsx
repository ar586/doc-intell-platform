"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [scrapeMsg, setScrapeMsg] = useState('');

  const fetchBooks = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/books/')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleScrape = async () => {
    setScraping(true);
    setScrapeMsg('');
    try {
      const res = await fetch('http://localhost:8000/api/scrape/', { method: 'POST' });
      const data = await res.json();
      if (data.error) {
        setScrapeMsg(`Error: ${data.error}`);
      } else {
        setScrapeMsg(`Done! Added ${data.added} new book(s), skipped ${data.skipped} duplicate(s).`);
        fetchBooks();
      }
    } catch (e) {
      setScrapeMsg('Failed to connect to backend scraper.');
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-[#FFF8DC] p-6 rounded-xl shadow-sm border border-amber-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amber-900">Books Dashboard</h1>
          <p className="text-amber-700 mt-1">Browse your intelligently scraped collection of books.</p>
          {scrapeMsg && (
            <p className={`mt-2 text-sm font-medium ${scrapeMsg.startsWith('Error') || scrapeMsg.startsWith('Failed') ? 'text-red-600' : 'text-green-700'}`}>
              {scrapeMsg}
            </p>
          )}
        </div>
        <button
          onClick={handleScrape}
          disabled={scraping}
          className="bg-amber-800 hover:bg-amber-900 disabled:opacity-60 disabled:cursor-not-allowed text-[#F5F5DC] px-5 py-2.5 rounded-lg font-medium shadow-sm transition cursor-pointer"
        >
          {scraping ? 'Scraping...' : 'Trigger Scraper'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-amber-700 font-medium">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 bg-[#FFF8DC] rounded-xl shadow-sm border border-dashed border-amber-300 text-amber-700">
          No books found. Trigger the scraper to populate the database!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book: any) => (
            <div key={book.id} className="bg-[#FFF8DC] rounded-xl shadow-sm hover:shadow-md transition border border-amber-100 p-5 flex flex-col space-y-4">
              {book.cover_image_url && (
                <img src={book.cover_image_url} alt={book.title} className="h-56 object-contain rounded-md" />
              )}
              <h3 className="font-semibold text-lg text-amber-900 line-clamp-2">{book.title}</h3>
              <p className="text-sm border-b border-amber-100 pb-3 text-amber-800"><span className="font-medium">Author:</span> {book.author}</p>
              <p className="text-sm text-amber-700 line-clamp-3 leading-relaxed">{book.description}</p>
              <div className="pt-3 border-t border-amber-100 flex justify-between mt-auto items-center">
                <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-2 py-1 rounded border border-amber-200">{book.rating}</span>
                <Link href={`/book/${book.id}`} className="text-sm text-amber-800 font-bold cursor-pointer hover:underline">
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
