import { getAllPosts } from "@/lib/blog";
import { BlogIndex } from "@/components/blog/BlogIndex";

export const metadata = {
    title: 'QuantRisk Blog | Institutional Insights',
    description: 'Advanced risk management strategies and quantitative analysis for prop trading.',
};

export default function BlogPage() {
    const allPosts = getAllPosts();

    return <BlogIndex allPosts={allPosts} />;
}
