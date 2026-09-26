import * as cheerio from 'cheerio';

export class PriceNotFoundError extends Error {
    constructor(url: string) {
        super(`Could not find a price on ${url}`);
        this.name = 'PriceNotFoundError';
    }
}

const USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function parsePrice(raw: string): number | null {
    const match = raw.replace(/,/g, '').match(/\d+(\.\d{1,2})?/);
    if (!match) return null;
    const value = Number(match[0]);
    return Number.isFinite(value) ? value : null;
}

function fromJsonLd($: cheerio.CheerioAPI): number | null {
    const blocks = $('script[type="application/ld+json"]');

    for (const el of blocks.toArray()) {
        let data: unknown;
        try {
            data = JSON.parse($(el).contents().text());
        } catch {
            continue;
        }

        const candidates = Array.isArray(data) ? data : [data];
        for (const item of candidates) {
            if (typeof item !== 'object' || item === null) continue;
            const product = item as { '@type'?: string; offers?: unknown };
            if (product['@type'] !== 'Product' || !product.offers) continue;

            const offers = Array.isArray(product.offers) ? product.offers[0] : product.offers;
            const offer = offers as { price?: unknown; lowPrice?: unknown } | undefined;
            const price = offer?.price ?? offer?.lowPrice;
            if (price !== undefined) {
                const parsed = parsePrice(String(price));
                if (parsed !== null) return parsed;
            }
        }
    }

    return null;
}

function fromMetaTags($: cheerio.CheerioAPI): number | null {
    const content =
        $('meta[property="og:price:amount"]').attr('content') ??
        $('meta[itemprop="price"]').attr('content');

    return content ? parsePrice(content) : null;
}

function fromPriceLikeElements($: cheerio.CheerioAPI): number | null {
    const priceElements = $('[class*="price"], [id*="price"]').toArray();

    for (const el of priceElements) {
        const parsed = parsePrice($(el).text());
        if (parsed !== null) return parsed;
    }

    return parsePrice($('body').text());
}

export async function scrapePrice(url: string): Promise<number> {
    const response = await fetch(url, {
        headers: {
            'User-Agent': USER_AGENT,
            'Accept-Language': 'en-US,en;q=0.9',
        },
    });

    if (!response.ok) {
        throw new PriceNotFoundError(url);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const price = fromJsonLd($) ?? fromMetaTags($) ?? fromPriceLikeElements($);

    if (price === null) {
        throw new PriceNotFoundError(url);
    }

    return price;
}
