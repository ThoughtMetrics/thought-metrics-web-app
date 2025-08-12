import React from 'react';
import { blogPageData } from './blogs.constant';
import BlogOrganism from '@/shared/ui/organisms/blog-organism';

const Blogs: React.FC = () => {
  return <BlogOrganism data={blogPageData} bgColor="bg-primary-lighter" />;
};

export default Blogs;
