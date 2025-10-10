import {
  ClipPinIcon,
  MailIcon,
  FacebookIcon,
  InstagramIcon,
  XIcon,
  LinkedinIcon,
} from '@/assets';
import { contentService } from '@/services/strapi-api/content.service';
import CustomImageAtom from '@/shared/ui/atoms/custom-image';
import MarkDownOrganism from '@/shared/ui/organisms/markdown-organism';
import { useQuery } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import { Link, useLoaderData, useParams } from 'react-router-dom';
import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import BlogCard from '@/shared/ui/molecules/blog-card';
import { QueryKeys } from '@/core/lib/query-keys';
import { SEOHead } from '@/shared/components/seo/SEOHead';
import { seoContent } from '@/core/constants/seo.constants';
import { useBlogData } from '@/core/hooks/use-blog-data';
import BlogSkeleton from '@/shared/components/blog-skeleton';
import { footerData } from '@/shared/components/footer/footer.constant';
import { toast } from 'sonner';

const ResourcePage: React.FC = () => {
  const { blogData } = useBlogData({
    title: 'Resources',
    type: [],
    category: [],
    limit: 4,
  });

  const { slug } = useParams<{ slug: string }>();
  const initialData = useLoaderData();

  const handleCopyUrl = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      toast.success('Link copied!', {
        description: 'URL has been copied to clipboard',
      });
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy link', {
        description: 'Please try again',
      });
    }
  };

  const handleEmailShare = () => {
    if (!content) return;

    const subject = encodeURIComponent(content.label);
    const body = encodeURIComponent(
      `I thought you might find this interesting:\n\n${content.label}\n\n${content.description}\n\nRead more: ${window.location.href}`
    );
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
  };

  const {
    data: content,
    isLoading,
    error,
  } = useQuery({
    queryKey: QueryKeys.contentKeys.slug(slug!),
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
          {
            property: 'article:published_time',
            content: content.publishedDate,
          },
          { property: 'article:modified_time', content: content.updatedAt },
        ]}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: content.label,
          description: content.description,
          datePublished: content.publishedDate,
          dateModified: content.updatedAt,
          image: content.img?.url,
        }}
      />
      <section className="common-component text-black flex-col items-center">
        <div className="common-container px-4 py-8 md:px-24 md:py-24 flex-col !max-w-[1336px]">
          <div className="grid md:grid-cols-[75%_25%] gap-6">
            <div className="flex flex-col gap-6">
              <h2 className="md:text-[2.85rem] font-medium leading-[1.25]">
                {content?.label}
              </h2>
              <CustomImageAtom
                src={content?.img.url}
                aspectRatio="auto"
                objectFit="cover"
                loading="lazy"
                rounded="none"
                className="w-full h-full"
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 flex-wrap border-t-1 border-custom-grey-1 pt-2 py-3">
                {content?.tags.split(',').map((tag: string, index: number) => (
                  <div
                    key={index}
                    className="rounded-3xl bg-custom-grey-1 px-3 py-1 w-fit"
                  >
                    {tag}
                  </div>
                ))}
              </div>
              <div className="flex flex-col border-t-1 border-custom-grey-1 pt-2 py-3">
                <p className="font-medium">
                  {new Date(content.publishedDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className=" ">{content.type}</p>
              </div>
              <div className="flex gap-2 border-t-1 border-custom-grey-1 pt-2 py-3">
                <button
                  onClick={handleCopyUrl}
                  className="bg-secondary w-10 h-10 p-2 hover:bg-primary transition-colors duration-200 cursor-pointer"
                  title="Copy link to clipboard"
                  aria-label="Copy link to clipboard"
                >
                  <ClipPinIcon className="w-full h-full" />
                </button>
                <button
                  onClick={handleEmailShare}
                  className="bg-secondary w-10 h-10 p-2 hover:bg-primary transition-colors duration-200 cursor-pointer"
                  title="Share via email"
                  aria-label="Share via email"
                >
                  <MailIcon className="w-full h-full" />
                </button>
                <Link
                  to={
                    'https://www.facebook.com/people/Thought-Metrics/61581686835321'
                  }
                  className="bg-secondary w-10 h-10 p-2 hover:bg-primary transition-colors duration-200"
                >
                  <FacebookIcon className="w-full h-full" />
                </Link>
                <Link
                  to={'https://www.instagram.com/thethoughtmetricscompany'}
                  className="bg-secondary w-10 h-10 p-2 hover:bg-primary transition-colors duration-200"
                >
                  <InstagramIcon className="w-full h-full" />
                </Link>
                <Link
                  to={footerData.socialLinks[1].path}
                  className="bg-secondary w-10 h-10 p-2 hover:bg-primary transition-colors duration-200"
                >
                  <XIcon className="w-full h-full" />
                </Link>
                <Link
                  to={footerData.socialLinks[0].path}
                  className="bg-secondary w-10 h-10 p-2 hover:bg-primary transition-colors duration-200"
                >
                  <LinkedinIcon className="w-full h-full" />
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[73%_25%] mt-12 gap-12">
            <MarkDownOrganism content={content.content} showTOC={true} />
            <div className="">
              <div className="flex flex-col gap-4 sticky top-4">
                {blogData.items.slice(2).map((blog: any, index: number) => (
                  <BlogCard key={index + blog.id} blog={blog} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Suspense fallback={<BlogSkeleton />}>
          <BlogOrganism data={blogData} bgColor="bg-white" />
        </Suspense>
      </section>
    </>
  );
};

export default ResourcePage;
