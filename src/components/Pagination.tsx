"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const createPageUrl = (pageNum: number) => {
        const params = new URLSearchParams(searchParams.toString());
        // pageとlimit以外のパラメータは引き継ぎ、pageパラメータを上書き
        params.delete('page');
        if (pageNum > 1) {
            params.set('page', pageNum.toString());
        }

        const queryString = params.toString();
        return `${basePath}${queryString ? `?${queryString}` : ''}`;
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex justify-center items-center space-x-2 mt-12" style={{ fontFamily: "'Inter', sans-serif" }}>
            {currentPage > 1 && (
                <Link
                    href={createPageUrl(currentPage - 1)}
                    className="px-4 py-2 border border-brand-accent/20 text-brand-dark hover:bg-brand-accent/5 transition-colors text-xs tracking-widest uppercase"
                >
                    Prev
                </Link>
            )}

            {pages.map(page => (
                <Link
                    key={page}
                    href={createPageUrl(page)}
                    className={`w-10 h-10 flex items-center justify-center border transition-colors text-sm font-medium ${page === currentPage
                        ? 'bg-brand-dark border-brand-dark text-white font-bold'
                        : 'border-brand-accent/20 text-brand-dark hover:bg-brand-accent/5'
                        }`}
                >
                    {page}
                </Link>
            ))}

            {currentPage < totalPages && (
                <Link
                    href={createPageUrl(currentPage + 1)}
                    className="px-4 py-2 border border-brand-accent/20 text-brand-dark hover:bg-brand-accent/5 transition-colors text-xs tracking-widest uppercase"
                >
                    Next
                </Link>
            )}
        </div>
    );
}

