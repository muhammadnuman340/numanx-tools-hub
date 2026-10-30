# NumanX Tools — Google Search Console (GSC) Master Playbook

Google Search Console is the most important dashboard for your business. It is the only direct line of communication you have with Google's search algorithms. 

This playbook details exactly how to force Google to index your 55+ tools rapidly, and how to troubleshoot the inevitable errors that arise when scaling a massive site.

---

## 1. The Verification & Setup Phase

Before Google will rank you, you must prove you own the domain.

### Step 1: DNS Verification (The "Domain" Property)
Do NOT use the "URL Prefix" method. You want the **Domain Level** property to ensure HTTP, HTTPS, `www`, and non-`www` traffic are all tracked together.

1. Go to [Search Console](https://search.google.com/search-console).
2. Click **Add Property**.
3. Select the **Domain** box (left side) and enter `toolshub.numanxstudio.com` (or URL prefix `https://toolshub.numanxstudio.com`).
4. Google will give you a TXT record.
5. Go to your Cloudflare Dashboard > DNS > Records.
6. Add a new `TXT` record with the name `@` and paste the Google value.
7. Wait 2 minutes and click "Verify" in GSC.

### Step 2: The Sitemap Injection
Astro generates your sitemap automatically at `https://toolshub.numanxstudio.com/sitemap.xml`.
1. In GSC, click **Sitemaps** on the left menu.
2. Enter `sitemap-index.xml` (or `sitemap.xml` depending on your Astro config) and click **Submit**.
3. *Checkpoint:* Ensure it says "Success" and reads the correct number of URLs (~90+ including tools, blogs, and legal pages).

---

## 2. The "Rapid Indexing" Protocol

Google is notoriously slow at indexing new websites. To speed this up, you must manually force the Googlebot to crawl your most important pages.

**The Strategy:**
1. Open your `indexing-pages.md` tracker document.
2. Go to GSC and click the search bar at the top (**URL Inspection Tool**).
3. Paste the URL of your highest-priority tool (e.g., `https://toolshub.numanxstudio.com/tools/image-compressor/`).
4. Hit Enter. Google will say "URL is not on Google."
5. Click the **Request Indexing** button. 
6. Wait 1-2 minutes for the live test to finish.
7. *Repeat this manual process for your top 10 most important tools and your homepage.* (Do not do more than 10 a day or Google will rate-limit you).

---

## 3. Monitoring "Rich Results" (The Visual Advantage)

Because your `<AppSEO />` component automatically injects `WebApplication` and `FAQ` JSON-LD schema, you are eligible for "Rich Results" on Google. This makes your search listing massive and highly clickable.

1. In GSC, scroll down to the **Enhancements** tab on the left.
2. You will see sections for **FAQ** and **Sitelinks searchbox** (and potentially "Software Apps" depending on Google's rollout).
3. Click into these reports weekly.
4. **Goal:** You want 0 "Invalid" items. If an item is "Invalid", it means your JSON-LD syntax broke (e.g., you forgot a comma in your FAQ array). Fix it in Astro, deploy, and click "Validate Fix" in GSC.

---

## 4. Diagnosing & Fixing GSC Errors (The Troubleshooting Matrix)

When scaling to 100+ tools, you *will* get errors in the **Pages > Page Indexing** report. Do not panic. Use this matrix:

### Error 1: "Crawled - currently not indexed"
- **What it means:** Googlebot saw the page, but decided the content was too "thin" or not valuable enough to put in the search results yet.
- **The Fix:** You need more content. Add a 300-word "How it works" section or an FAQ accordion to the tool. Ensure the tool isn't visually identical to another tool on your site. Then, hit "Request Indexing" again.

### Error 2: "Discovered - currently not indexed"
- **What it means:** Google knows the URL exists (probably from your sitemap), but their crawl budget was full, so they delayed visiting it.
- **The Fix:** Usually just waiting. If it's a high-priority tool, manually force it via the URL Inspection tool. Building internal links from your Homepage to the tool also signals importance.

### Error 3: "Duplicate without user-selected canonical"
- **What it means:** Google found `toolshub.numanxstudio.com/tools/word-counter` and `toolshub.numanxstudio.com/tools/word-counter/` (with a trailing slash) and doesn't know which one is the real one.
- **The Fix:** Ensure your `astro.config.mjs` has `trailingSlash: 'always'` configured. Ensure your `<link rel="canonical" href="..." />` tag perfectly matches the URL with the trailing slash.

### Error 4: "Soft 404"
- **What it means:** The page loads successfully (HTTP 200), but Google thinks it looks empty, broken, or like a 404 page.
- **The Fix:** If it's a dynamic tool page, ensure there is text loaded *before* the JavaScript hydrates. If the page is completely blank without JS, Googlebot might classify it as a Soft 404. (Astro solves this out of the box with SSG!).

---

## 5. The Monthly "Cannibalization" Audit

Once you have 50+ tools and 50+ blog posts, they might start fighting each other for the exact same keyword.

1. Go to **Search Results > Performance**.
2. Click **+ New > Query** and type "image compressor".
3. Look at the **Pages** tab. 
4. If you see BOTH `/tools/image-compressor/` AND `/blog/how-to-compress-images/` getting impressions for the exact same term, they are cannibalizing each other.
5. **The Fix:** Edit the blog post to explicitly link to the tool page using the anchor text "Image Compressor", signaling to Google that the tool page is the absolute authority for that specific keyword.
