import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-5">
            <Loader2 className="w-10 h-10 text-brand-accent animate-spin" />
            <div className="text-center">
                <p className="text-sm font-bold text-gray-400 tracking-[0.2em] mb-1 uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                    I LOVE PICKLEBALL
                </p>
                <p className="text-xs text-gray-300 animate-pulse tracking-widest">
                    Loading Data...
                </p>
            </div>
        </div>
    );
}
