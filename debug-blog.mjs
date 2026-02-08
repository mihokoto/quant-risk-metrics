import fs from "fs";
import path from "path";
import process from "process";

const postsDirectory = path.join(process.cwd(), "src/content/blog");

console.log("CWD:", process.cwd());
console.log("Posts Directory:", postsDirectory);

if (!fs.existsSync(postsDirectory)) {
    console.error("ERROR: Directory not found!");
} else {
    const files = fs.readdirSync(postsDirectory);
    console.log("Files found:", files);

    const targetSlug = "optimizing-apex-drawdown";
    const fullPath = path.join(postsDirectory, `${targetSlug}.mdx`);

    console.log(`Checking specific file for slug '${targetSlug}'...`);
    console.log("Target Path:", fullPath);

    if (fs.existsSync(fullPath)) {
        console.log("SUCCESS: File exists.");
    } else {
        console.error("ERROR: File does not exist at target path.");
    }
}
