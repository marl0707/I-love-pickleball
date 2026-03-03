/**
 * もしもアフィリエイト リンク生成ユーティリティ
 *
 * 商品名からAmazon・楽天・Yahoo!ショッピングの
 * アフィリエイトリンクを自動生成します。
 *
 * もしもアフィリエイト アカウントID: 1180874
 */

// もしもアフィリエイト経由の各ECサイトパラメータ
const MOSHIMO_CONFIG = {
    amazon: {
        a_id: '1180874',
        p_id: '170',
        pc_id: '185',
        pl_id: '4062',
        searchUrl: 'https://www.amazon.co.jp/s',
        searchParam: 'k',
    },
    rakuten: {
        a_id: '1180874',
        p_id: '54',
        pc_id: '54',
        pl_id: '616',
        searchUrl: 'https://search.rakuten.co.jp/search/mall',
        searchParam: null, // パス内に含める
    },
    yahoo: {
        a_id: '1180874',
        p_id: '1225',
        pc_id: '1853',
        pl_id: '18819',
        searchUrl: 'https://shopping.yahoo.co.jp/search',
        searchParam: 'p',
    },
};

/**
 * もしもアフィリエイトのリンクを生成
 */
function buildMoshimoLink(
    ec: 'amazon' | 'rakuten' | 'yahoo',
    productName: string
): string {
    const config = MOSHIMO_CONFIG[ec];
    const encoded = encodeURIComponent(productName);

    let targetUrl: string;

    if (ec === 'rakuten') {
        // 楽天は検索キーワードをパスに含める
        targetUrl = `${config.searchUrl}/${encoded}/`;
    } else {
        // Amazon・Yahoo!はクエリパラメータ
        targetUrl = `${config.searchUrl}?${config.searchParam}=${encoded}`;
    }

    const encodedTargetUrl = encodeURIComponent(targetUrl);

    return `https://af.moshimo.com/af/c/click?a_id=${config.a_id}&p_id=${config.p_id}&pc_id=${config.pc_id}&pl_id=${config.pl_id}&url=${encodedTargetUrl}`;
}

export interface AffiliateLinks {
    amazon: string;
    rakuten: string;
    yahoo: string;
}

/**
 * 商品名（+ブランド名）からアフィリエイトリンクを一括生成
 */
export function generateAffiliateLinks(
    productName: string,
    brandName?: string | null
): AffiliateLinks {
    // ブランド名 + 商品名で検索精度を高める
    const searchQuery = brandName
        ? `${brandName} ${productName}`
        : productName;

    return {
        amazon: buildMoshimoLink('amazon', searchQuery),
        rakuten: buildMoshimoLink('rakuten', searchQuery),
        yahoo: buildMoshimoLink('yahoo', searchQuery),
    };
}
