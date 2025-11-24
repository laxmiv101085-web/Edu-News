import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    article?: boolean;
    keywords?: string;
    author?: string;
    publishedAt?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    image,
    article,
    keywords,
    author,
    publishedAt,
}) => {
    const router = useRouter();
    const siteName = 'EduNews';
    const defaultDescription = 'Real-time updates for scholarships, exams, admissions, results, and government education notifications.';
    const defaultImage = 'https://edu-news-35vza0wnv-vickyrrrrrrs-projects.vercel.app/og-image.png'; // We should create this
    const twitterHandle = '@edunews'; // Placeholder
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://edu-news-35vza0wnv-vickyrrrrrrs-projects.vercel.app';

    const currentUrl = `${baseUrl}${router.asPath}`;
    const metaTitle = title ? `${title} | ${siteName}` : `${siteName} - Real-time Education News`;
    const metaDescription = description || defaultDescription;
    const metaImage = image || defaultImage;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={keywords || 'education news, scholarships, exams, results, admissions, cbse, neet, jee, india education'} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content={article ? 'article' : 'website'} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={twitterHandle} />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Article Specific Tags */}
            {article && (
                <>
                    <meta property="article:published_time" content={publishedAt} />
                    {author && <meta property="article:author" content={author} />}
                    <meta property="article:section" content="Education" />
                </>
            )}

            {/* JSON-LD Schema for Articles */}
            {article && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'NewsArticle',
                            headline: title,
                            image: [metaImage],
                            datePublished: publishedAt,
                            author: {
                                '@type': 'Person',
                                name: author || siteName,
                            },
                            publisher: {
                                '@type': 'Organization',
                                name: siteName,
                                logo: {
                                    '@type': 'ImageObject',
                                    url: `${baseUrl}/logo.png`,
                                },
                            },
                            description: metaDescription,
                        }),
                    }}
                />
            )}
        </Head>
    );
};

export default SEO;
