import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
    slug: string;
    frontmatter: {
        title: string;
        date: string;
        excerpt: string;
        author?: string;
        category?: string;
        difficulty?: string;
        tags?: string[];
        [key: string]: any;
    };
    content: string;
    readingTime: number;
}

export function getPostSlugs() {
    if (!fs.existsSync(postsDirectory)) return [];
    return fs.readdirSync(postsDirectory).filter(file => file.endsWith(".mdx"));
}

export function getPostBySlug(slug: string): BlogPost | null {
    const realSlug = slug.replace(/\.mdx$/, "");
    const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);

    if (!fs.existsSync(fullPath)) return null;

    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const { data, content } = matter(fileContent);

    // Calculate reading time
    const wordsPerMinute = 225;
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);

    return {
        slug: realSlug,
        frontmatter: {
            title: data.title,
            date: data.date,
            excerpt: data.excerpt,
            author: data.author,
            category: data.category,
            difficulty: data.difficulty,
            tags: data.tags,
            // Include any other frontmatter fields dynamically
            ...Object.keys(data)
                .filter(key => !['title', 'date', 'excerpt', 'author', 'category', 'difficulty', 'tags'].includes(key))
                .reduce((obj, key) => ({ ...obj, [key]: data[key] }), {})
        },
        content,
        readingTime,
    };
}

export function getAllPosts(): BlogPost[] {
    const slugs = getPostSlugs();
    console.log(`[Blog Build] Found slugs: ${slugs.join(', ')}`);
    const posts = slugs
        .map((slug) => getPostBySlug(slug))
        .filter((post): post is BlogPost => post !== null)
        .sort((post1, post2) => (post1.frontmatter.date > post2.frontmatter.date ? -1 : 1));
    return posts;
}

export function extractHeadings(content: string) {
    const headingLines = content.split("\n").filter(line => line.startsWith("## ") || line.startsWith("### "));
    return headingLines.map(line => {
        const level = line.startsWith("### ") ? 3 : 2;
        const text = line.replace(/^#{2,3} /, "");
        const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        return { text, level, id };
    });
}
