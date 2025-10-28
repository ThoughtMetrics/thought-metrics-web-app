import {
  ClipPinIcon,
  MailIcon,
  FacebookIcon,
  InstagramIcon,
  XIcon,
  LinkedinIcon,
} from '@/assets';
import CustomImageAtom from '@/shared/ui/atoms/custom-image';
import MarkDownOrganism from '@/shared/ui/organisms/markdown-organism';
import React from 'react';
import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import BlogCard from '@/shared/ui/molecules/blog-card';
import BlogSkeleton from '@/shared/components/blog-skeleton';
import { footerData } from '@/shared/components/footer/footer.constant';
import { toast } from 'sonner';

interface BlogData {
  title: string;
  items: {
    id: number;
    type: string;
    category: string;
    label: string;
    description: string;
    link: string;
    src: string;
  }[];
}

interface ResourcePageProps {
  content?: any;
  blogData?: BlogData | null;
}

const ResourcePage: React.FC<ResourcePageProps> = ({ content, blogData }) => {

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

  // If no content, show error
  if (!content) {
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

  // If no blog data, show skeleton
  const blogSection = blogData ? (
    <BlogOrganism data={blogData} bgColor="bg-white" />
  ) : (
    <BlogSkeleton />
  );

  return (
    <>
      <section className="common-component text-black flex-col items-center">
        <div className="common-container px-4 py-8 md:px-24 md:py-24 flex-col max-w-[1336px]!">
          <div className="grid md:grid-cols-[75%_25%] gap-6">
            <div className="flex flex-col gap-6">
              <h2 className="md:text-[2.85rem] font-medium leading-tight">
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
              <div className="flex gap-4 flex-wrap border-t border-custom-grey-1 pt-2 py-3">
                {content?.tags.split(',').map((tag: string, index: number) => (
                  <div
                    key={index}
                    className="rounded-3xl bg-custom-grey-1 px-3 py-1 w-fit"
                  >
                    {tag}
                  </div>
                ))}
              </div>
              <div className="flex flex-col border-t border-custom-grey-1 pt-2 py-3">
                <p className="font-medium">
                  {new Date(content.publishedDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className=" ">{content.type}</p>
              </div>
              <div className="flex gap-2 border-t border-custom-grey-1 pt-2 py-3">
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
                <a
                  href={
                    'https://www.facebook.com/people/Thought-Metrics/61581686835321'
                  }
                  className="bg-secondary w-10 h-10 p-2 hover:bg-primary transition-colors duration-200"
                >
                  <FacebookIcon className="w-full h-full" />
                </a>
                <a
                  href={'https://www.instagram.com/thethoughtmetricscompany'}
                  className="bg-secondary w-10 h-10 p-2 hover:bg-primary transition-colors duration-200"
                >
                  <InstagramIcon className="w-full h-full" />
                </a>
                <a
                  href={footerData.socialLinks[1].path}
                  className="bg-secondary w-10 h-10 p-2 hover:bg-primary transition-colors duration-200"
                >
                  <XIcon className="w-full h-full" />
                </a>
                <a
                  href={footerData.socialLinks[0].path}
                  className="bg-secondary w-10 h-10 p-2 hover:bg-primary transition-colors duration-200"
                >
                  <LinkedinIcon className="w-full h-full" />
                </a>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[73%_25%] mt-12 gap-12">
            <MarkDownOrganism content={content.content} showTOC={true} />
            <div className="">
              <div className="flex flex-col gap-4 sticky top-4">
                {blogData && blogData.items.slice(2).map((blog: any, index: number) => (
                  <BlogCard key={index + blog.id} blog={blog} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {blogSection}
      </section>
    </>
  );
};

export default ResourcePage;
