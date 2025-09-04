import { seoContent } from '@/core/constants/seo.constants';
import { contentKeys } from '@/core/lib/query-keys';
import { contentService } from '@/services/api/content.service';
import { SEOHead } from '@/shared/components/seo/SEOHead';
import CustomImageAtom from '@/shared/ui/atoms/custom-image';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

interface LoaderData {
  content: any;
}

const ResourcePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const initialData = useLoaderData() as LoaderData | null;

  const {
    data: content,
    isLoading,
    error,
  } = useQuery({
    queryKey: contentKeys.slug(slug!),
    queryFn: () => contentService.getContentBySlug(slug!),
    initialData: initialData?.content,
    enabled: !!slug,
  });
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
        <p className="text-gray-600">
          The resource you're looking for doesn't exist.
        </p>
        <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Go back home
        </a>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${content.label} - ${seoContent.title}`}
        description={content.description}
        ogImage={content.img?.url}
        ogType="article"
        canonicalUrl={`${seoContent.canonicalUrl}/resources/${slug}`}
        meta={[
          { property: 'article:published_time', content: content.publishedAt },
          { property: 'article:modified_time', content: content.updatedAt },
        ]}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: content.label,
          description: content.description,
          datePublished: content.publishedAt,
          dateModified: content.updatedAt,
          image: content.img?.url,
        }}
      />
      <section className="common-component  text-black">
        <div className="common-container px-4 py-8 md:px-24 md:py-24 flex-col !max-w-[1336px]">
          <div className="gird md:grid-cols-2 xl:grid-cols-[70%_30%]">
            <div className="">
              <h2 className="md:text-5xl font-semibold leading-[1.25]">
                {content?.label}
              </h2>
              <CustomImageAtom
                src={content?.img.url}
                size="full"
                aspectRatio="auto"
                objectFit="cover"
                loading="lazy"
                rounded="none"
                className="hidden md:block"
              />
            </div>
          </div>
        </div>
      </section>
      ;
    </>
  );
};

export default ResourcePage;
