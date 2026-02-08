import { MDXRemote } from 'next-mdx-remote/rsc';
import { RiskSimulatorEmbed } from '@/components/blog/RiskSimulatorEmbed';
import { Callout, QuantBadge, Quote } from '@/components/blog/EditorialComponents';
import { FirmCTA } from '@/components/blog/FirmCTA';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { NewsletterSignup } from '@/components/blog/NewsletterSignup';
import { getPostBySlug, getAllPosts, extractHeadings } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, BarChart3, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

// Register Global Components
const components = {
    RiskSimulatorEmbed,
    Callout,
    QuantBadge,
    Quote,
    FirmCTA,
    h2: (props: any) => {
        const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") || "";
        return <h2 id={id} className="scroll-mt-32" {...props} />;
    },
    h3: (props: any) => {
        const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") || "";
        return <h3 id={id} className="scroll-mt-32" {...props} />;
    },
};

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return {};

    return {
        title: `${post.frontmatter.title} | QuantRisk Blog`,
        description: post.frontmatter.excerpt,
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            title: post.frontmatter.title,
            description: post.frontmatter.excerpt,
            type: 'article',
            publishedTime: post.frontmatter.date,
            authors: [post.frontmatter.author || 'QuantRisk']
        }
    };
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const headings = extractHeadings(post.content);

    return (
        <div className="min-h-screen bg-slate-950">
            <ReadingProgress />

            {/* Sticky Editorial Header */}
            <div className="sticky top-14 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 py-4">
                <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
                    <Link href="/blog" className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Editorial
                    </Link>
                    <div className="flex items-center gap-6 text-xs font-mono text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {post.readingTime} MIN READ
                        </div>
                        <div className="hidden sm:block text-slate-700">|</div>
                        <div className="hidden sm:flex items-center gap-2 text-indigo-400">
                            <BarChart3 className="w-3 h-3" /> LEVEL: {post.frontmatter.difficulty?.toUpperCase() || 'QUANTITATIVE'}
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_720px_1fr] gap-12 relative">

                    {/* Left: TOC */}
                    <aside className="relative">
                        <TableOfContents headings={headings} />
                    </aside>

                    {/* Center: Article */}
                    <div className="animate-in-fade duration-700">
                        <header className="mb-16">
                            <div className="text-xs font-mono text-indigo-500 font-bold uppercase tracking-[0.3em] mb-6">
                                {post.frontmatter.category || 'Quant Intelligence'} • {post.frontmatter.date}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-[1.15] tracking-tight font-outfit">
                                {post.frontmatter.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-400 font-serif leading-relaxed italic border-l-2 border-indigo-500/30 pl-8">
                                {post.frontmatter.excerpt}
                            </p>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs">
                                    QR
                                </div>
                                <div className="text-sm">
                                    <div className="text-white font-bold tracking-wide">{post.frontmatter.author || 'QuantRisk Intelligence'}</div>
                                    <div className="text-slate-500 text-xs mt-0.5 font-mono uppercase">Mathematical Strategist</div>
                                </div>
                            </div>
                        </header>

                        <article className="prose prose-invert prose-lg max-w-none 
                            prose-p:font-serif prose-p:leading-[1.8] prose-p:text-slate-300 prose-p:text-lg
                            prose-headings:font-outfit prose-headings:font-bold prose-headings:tracking-tight
                            prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8
                            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                            prose-strong:text-white prose-strong:font-bold
                            prose-li:font-serif prose-li:leading-[1.8] prose-li:text-slate-300
                            prose-code:text-indigo-400 prose-code:font-mono prose-code:bg-slate-900/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                            prose-blockquote:border-l-indigo-600 prose-blockquote:bg-slate-900/40 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-xl
                            selection:bg-indigo-500/30 selection:text-white
                        ">
                            <MDXRemote source={post.content} components={components} />
                        </article>
                    </div>

                    {/* Right: Stats & CTA Card */}
                    <aside className="relative">
                        <div className="sticky top-32 space-y-6 hidden lg:block animate-in-slide-right">
                            <div className="p-8 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-sm group hover:border-indigo-500/30 transition-all duration-300">
                                <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-6">Quick Audit Stats</h4>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-mono text-slate-500 uppercase">Analysis Level</div>
                                            <div className="text-sm font-bold text-white tracking-wide uppercase">{post.frontmatter.difficulty || 'Institutional'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-mono text-slate-500 uppercase">Reading Time</div>
                                            <div className="text-sm font-bold text-white tracking-wide uppercase">{post.readingTime} MIN</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-white/5">
                                    <h4 className="text-sm font-bold text-white mb-4 font-outfit">Start Your Simulation</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed mb-6 font-serif">
                                        Test your own strategy against these quantitative constraints.
                                    </p>
                                    <Link
                                        href="/"
                                        className="w-full inline-flex items-center justify-center h-12 rounded-xl bg-indigo-600 font-bold text-xs uppercase tracking-widest text-white hover:bg-indigo-500 hover:shadow-glow-indigo transition-all duration-300"
                                    >
                                        Run Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                <NewsletterSignup />
            </main>
        </div>
    );
}
