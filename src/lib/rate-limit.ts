// レート制限ユーティリティ
// インメモリ Map ベースの IP レート制限

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// 古いエントリを定期的にクリーンアップ
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
        if (now > entry.resetAt) {
            rateLimitMap.delete(key);
        }
    }
}, 60 * 1000);

/**
 * IPベースのレート制限チェック
 * @param ip クライアントIP
 * @param maxRequests ウィンドウ内の最大リクエスト数（デフォルト: 15）
 * @param windowMs ウィンドウ時間（ミリ秒、デフォルト: 15分）
 */
export function checkRateLimit(
    ip: string,
    maxRequests: number = 15,
    windowMs: number = 15 * 60 * 1000
): { success: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: maxRequests - 1, resetIn: windowMs };
    }

    if (entry.count >= maxRequests) {
        return { success: false, remaining: 0, resetIn: entry.resetAt - now };
    }

    entry.count++;
    return { success: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now };
}
