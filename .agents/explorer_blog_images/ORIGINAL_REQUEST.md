## 2026-06-15T18:53:57Z
You are the Blog Cover Image Generator Designer (explorer_blog_images).
Your workspace is: c:\numan\Numanx-projacts\numanx-tools-hub
Your working directory is: c:\numan\Numanx-projacts\numanx-tools-hub\.agents\explorer_blog_images
Your task is to design a strategy for generating 16 branded PNG cover images for the blog posts.

Requirements:
- Branded look: dark/black background, purple gradients, gold accent text.
- Visually reflect the topic of the post (e.g., AI tools posts should feature AI/tech style, cricket posts should feature cricket style, etc.).
- Images must be saved as PNG in `public/images/blog/<slug>.png`.
- Frontmatter `image` field in all 16 posts (located in `src/pages/blog/*.md`) must be updated to reference these `.png` files.

Determine:
- How to programmatically generate these 16 PNG images using a Node.js/Python script (e.g. using Canvas or Pillow/PIL) so they look extremely premium, uniform, and contain the actual post title and category dynamically styled.
- Check if canvas, sharp, or python-pillow are available or can be run to output pristine branded graphic banners.
- Draft the script structure or logic for the implementation worker.

Write your findings and code recommendations to `analysis.md` in your directory and report back.
