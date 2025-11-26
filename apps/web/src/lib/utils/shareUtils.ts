/**
 * Calculate reading time for an article
 * @param content Article content (text)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
    if (!content) return 1;

    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);

    return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Format reading time for display
 * @param content Article content
 * @returns Formatted string like "3 min read"
 */
export function formatReadingTime(content: string): string {
    const minutes = calculateReadingTime(content);
    return `${minutes} min read`;
}

/**
 * Generate share URL for WhatsApp
 */
export function getWhatsAppShareUrl(title: string, url: string): string {
    const text = `${title}\n\n${url}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Generate share URL for Twitter
 */
export function getTwitterShareUrl(title: string, url: string): string {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
}

/**
 * Generate share URL for Telegram
 */
export function getTelegramShareUrl(title: string, url: string): string {
    const text = `${title}\n${url}`;
    return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
}
