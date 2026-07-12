import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const workspaceRoot = 'C:\\numan\\Numanx-projacts\\numanx-tools-hub';
const publicDir = path.join(workspaceRoot, 'public');
const imagesDir = path.join(publicDir, 'images');
const blogDir = path.join(imagesDir, 'blog');

// Ensure directories exist
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(blogDir, { recursive: true });

// --- Helper to convert SVG to PNG or WebP ---
async function svgToImage(svgContent, outputPath, width, height, format = 'png') {
  try {
    const buffer = Buffer.from(svgContent);
    const transformer = sharp(buffer).resize(width, height);
    if (format === 'webp') {
      await transformer.webp({ quality: 90 }).toFile(outputPath);
    } else {
      await transformer.png().toFile(outputPath);
    }
    console.log(`✓ Generated: ${path.relative(workspaceRoot, outputPath)}`);
  } catch (error) {
    console.error(`✗ Error generating ${outputPath}:`, error);
  }
}

// --- Helper for background decoration SVGs ---
const gridPattern = `
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 85, 247, 0.04)" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" />
`;

const gradientDefs = `
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0b" />
      <stop offset="100%" stop-color="#111113" />
    </linearGradient>
    <radialGradient id="purple-glow" cx="20%" cy="30%" r="50%">
      <stop offset="0%" stop-color="rgba(168, 85, 247, 0.15)" />
      <stop offset="100%" stop-color="rgba(0, 0, 0, 0)" />
    </radialGradient>
    <radialGradient id="blue-glow" cx="80%" cy="70%" r="50%">
      <stop offset="0%" stop-color="rgba(59, 130, 246, 0.12)" />
      <stop offset="100%" stop-color="rgba(0, 0, 0, 0)" />
    </radialGradient>
    <linearGradient id="purple-text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c084fc" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
    <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>
`;

// --- 1. Author Avatar ---
async function generateAuthorAvatar() {
  const avatarPngPath = path.join(imagesDir, 'author-numan.png');
  const avatarWebpPath = path.join(imagesDir, 'author-numan.webp');

  if (fs.existsSync(avatarPngPath)) {
    console.log('Converting existing author-numan.png to author-numan.webp...');
    try {
      await sharp(avatarPngPath).resize(96, 96).webp({ quality: 90 }).toFile(avatarWebpPath);
      console.log('✓ Converted author-numan.png to 96x96 WebP.');
    } catch (err) {
      console.error('Failed to convert existing avatar. Falling back to SVG-generated avatar...', err);
      await generateFallbackAvatar(avatarWebpPath);
    }
  } else {
    console.log('author-numan.png not found. Generating fallback professional vector avatar...');
    await generateFallbackAvatar(avatarWebpPath);
  }
}

async function generateFallbackAvatar(outputPath) {
  const svg = `
    <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      ${gradientDefs}
      <rect width="96" height="96" rx="48" fill="url(#bg-grad)" />
      <circle cx="48" cy="48" r="46" fill="none" stroke="url(#accent-grad)" stroke-width="2" />
      <!-- Stylized portrait / avatar logo -->
      <g transform="translate(24, 20)">
        <circle cx="24" cy="18" r="12" fill="url(#accent-grad)" />
        <path d="M 6,48 C 6,34 14,30 24,30 C 34,30 42,34 42,48 Z" fill="url(#accent-grad)" opacity="0.85" />
      </g>
      <!-- Small clean monogram overlay -->
      <rect x="62" y="62" width="22" height="22" rx="6" fill="#1e1e24" stroke="#a855f7" stroke-width="1.5" />
      <text x="73" y="77" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" fill="#a855f7" text-anchor="middle">N</text>
    </svg>
  `;
  await svgToImage(svg, outputPath, 96, 96, 'webp');
}

// --- 2. OG Default Image (1200x630) ---
async function generateOGDefault() {
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      ${gradientDefs}
      <rect width="1200" height="630" fill="url(#bg-grad)" />
      <rect width="1200" height="630" fill="url(#purple-glow)" />
      <rect width="1200" height="630" fill="url(#blue-glow)" />
      ${gridPattern}
      
      <!-- Ambient details -->
      <circle cx="150" cy="150" r="100" fill="#a855f7" opacity="0.05" filter="blur(40px)" />
      <circle cx="1050" cy="480" r="120" fill="#3b82f6" opacity="0.05" filter="blur(50px)" />
      
      <!-- Decorative tech grids & borders -->
      <rect x="40" y="40" width="1120" height="550" rx="20" fill="none" stroke="rgba(168, 85, 247, 0.08)" stroke-width="1.5" />
      <rect x="50" y="50" width="1100" height="530" rx="16" fill="none" stroke="rgba(59, 130, 246, 0.05)" stroke-width="1" />
      
      <!-- Minimalist abstract layout in center -->
      <g transform="translate(600, 315)" text-anchor="middle">
        <!-- Logo Icon -->
        <g transform="translate(0, -100)">
          <rect x="-45" y="-45" width="90" height="90" rx="24" fill="#0b0b0c" stroke="url(#accent-grad)" stroke-width="3.5" />
          <text x="0" y="16" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="900" fill="#ffffff" text-anchor="middle">N</text>
        </g>
        
        <!-- Brand Name -->
        <text y="40" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="900" fill="#ffffff" letter-spacing="-1.5">
          NumanX <tspan fill="url(#purple-text-grad)">Tools</tspan>
        </text>
        
        <!-- Subtitle -->
        <text y="105" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="500" fill="#94a3b8" letter-spacing="6">
          BUILD. CREATE. ANALYZE.
        </text>
        
        <!-- URL Footer -->
        <text y="170" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="rgba(168, 85, 247, 0.6)" letter-spacing="2">
          NUMANX-TOOLS.PAGES.DEV
        </text>
      </g>
    </svg>
  `;
  await svgToImage(svg, path.join(publicDir, 'og-default-1200.png'), 1200, 630, 'png');
}

// --- 3. Favicon PNG (32x32) ---
async function generateFavicon() {
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#0b0b0c" />
      <text x="16" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="900" fill="#a855f7" text-anchor="middle">N</text>
    </svg>
  `;
  await svgToImage(svg, path.join(publicDir, 'favicon.png'), 32, 32, 'png');
}

// --- 4. Apple Touch Icon (180x180) ---
async function generateAppleTouchIcon() {
  const svg = `
    <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="180" height="180" rx="40" fill="#0b0b0c" stroke="#a855f7" stroke-width="4" />
      <text x="90" y="125" font-family="system-ui, -apple-system, sans-serif" font-size="100" font-weight="900" fill="#a855f7" text-anchor="middle">N</text>
    </svg>
  `;
  await svgToImage(svg, path.join(publicDir, 'apple-touch-icon.png'), 180, 180, 'png');
}

// --- 5. PWA Icons (192x192 & 512x512) ---
async function generatePWAIcons() {
  const createPWASvg = (size, safeZoneTextSize, yPos) => `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#0b0b0c" />
      <text x="${size / 2}" y="${yPos}" font-family="system-ui, -apple-system, sans-serif" font-size="${safeZoneTextSize}" font-weight="900" fill="#a855f7" text-anchor="middle">N</text>
    </svg>
  `;

  await svgToImage(createPWASvg(192, 110, 134), path.join(publicDir, 'icon-192.png'), 192, 192, 'png');
  await svgToImage(createPWASvg(512, 300, 360), path.join(publicDir, 'icon-512.png'), 512, 512, 'png');
}

// --- 6. Blog Cover Images (1200x630 each) ---
const blogPosts = [
  {
    slug: 'age-calculator-fun-facts-birthday',
    title: 'Age Calculator: Fun Facts About Your Birthday',
    category: 'Productivity',
    icon: `
      <!-- Birthday theme: Birthday cake & calendars -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <!-- Floating numbers -->
        <text x="-120" y="-80" font-family="system-ui" font-size="36" font-weight="bold" fill="#c084fc" opacity="0.5" transform="rotate(-15)">28</text>
        <text x="120" y="-40" font-family="system-ui" font-size="42" font-weight="bold" fill="#6366f1" opacity="0.4" transform="rotate(10)">365</text>
        <text x="-100" y="100" font-family="system-ui" font-size="32" font-weight="bold" fill="#3b82f6" opacity="0.6" transform="rotate(25)">10K</text>
        <!-- Calendar / Cake Icon -->
        <g transform="translate(-60, -70)">
          <rect x="0" y="0" width="120" height="120" rx="16" fill="#1e1e24" stroke="url(#accent-grad)" stroke-width="4" />
          <rect x="0" y="0" width="120" height="30" fill="url(#accent-grad)" rx="16" />
          <rect x="0" y="15" width="120" height="15" fill="url(#accent-grad)" />
          <circle cx="30" cy="15" r="5" fill="#000" opacity="0.3" />
          <circle cx="90" cy="15" r="5" fill="#000" opacity="0.3" />
          <!-- Calendar Text -->
          <text x="60" y="85" font-family="system-ui" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle">🎂</text>
        </g>
      </g>
    `,
  },
  {
    slug: 'best-ai-tools-for-students',
    title: 'Best AI Tools for Students in 2026',
    category: 'AI Tools',
    icon: `
      <!-- Student study desk + robotic neon brain -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <g transform="translate(-70, -70)">
          <!-- Graduation Cap with Neon Brain lines -->
          <rect x="20" y="20" width="100" height="100" rx="20" fill="#1e1e24" stroke="url(#accent-grad)" stroke-width="4" />
          <path d="M 15,45 L 70,20 L 125,45 L 70,70 Z" fill="url(#accent-grad)" />
          <rect x="45" y="65" width="50" height="25" fill="#3b82f6" rx="4" />
          <path d="M 105,45 L 105,80 C 105,85 100,90 95,90" fill="none" stroke="#a855f7" stroke-width="3" />
          <circle cx="95" cy="90" r="6" fill="#a855f7" />
          <!-- Neural nodes -->
          <circle cx="45" cy="45" r="4" fill="#6366f1" />
          <circle cx="95" cy="45" r="4" fill="#6366f1" />
          <line x1="45" y1="45" x2="95" y2="45" stroke="#6366f1" stroke-width="1.5" />
          <line x1="70" y1="20" x2="70" y2="70" stroke="#6366f1" stroke-width="1" stroke-dasharray="2,2" />
          <!-- Robot Face emoji / vector -->
          <text x="70" y="100" font-family="system-ui" font-size="28" text-anchor="middle">🤖</text>
        </g>
      </g>
    `,
  },
  {
    slug: 'best-free-image-tools-2026',
    title: 'Best Free Image Tools in 2026',
    category: 'Image Tools',
    icon: `
      <!-- Color palettes and monitors -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <g transform="translate(-70, -70)">
          <rect x="10" y="20" width="120" height="85" rx="12" fill="#1e1e24" stroke="url(#accent-grad)" stroke-width="4" />
          <!-- Stand -->
          <path d="M 50,105 L 90,105 L 80,125 L 60,125 Z" fill="#1e1e24" stroke="url(#accent-grad)" stroke-width="3" />
          <!-- Screen drawing - paint palette -->
          <path d="M 40,50 C 40,35 90,35 100,55 C 105,65 95,85 70,85 C 50,85 40,70 40,50 Z" fill="#a855f7" opacity="0.4" />
          <circle cx="55" cy="50" r="6" fill="#ef4444" />
          <circle cx="70" cy="45" r="6" fill="#3b82f6" />
          <circle cx="85" cy="55" r="6" fill="#10b981" />
          <circle cx="75" cy="70" r="6" fill="#eab308" />
          <path d="M 50,75 L 30,95" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
          <!-- Camera/Brush overlay -->
          <text x="110" y="110" font-family="system-ui" font-size="32">🎨</text>
        </g>
      </g>
    `,
  },
  {
    slug: 'best-youtube-tools-for-creators',
    title: 'Best YouTube Tools for Creators',
    category: 'Creator Tools',
    icon: `
      <!-- Camera, microphone, play button -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <g transform="translate(-75, -75)">
          <rect x="15" y="15" width="120" height="120" rx="24" fill="#1e1e24" stroke="url(#accent-grad)" stroke-width="4" />
          <!-- Play icon in center -->
          <path d="M 52,45 L 92,75 L 52,105 Z" fill="#ef4444" stroke="#ef4444" stroke-width="4" stroke-linejoin="round" />
          <!-- Audio wave -->
          <path d="M 25,120 Q 40,100 55,120 T 85,120 T 115,120" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round" />
          <text x="115" y="45" font-family="system-ui" font-size="32">🎥</text>
        </g>
      </g>
    `,
  },
  {
    slug: 'complete-guide-password-security',
    title: 'Complete Guide to Password Security',
    category: 'Security',
    icon: `
      <!-- Secure lock + shield -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <g transform="translate(-70, -80)">
          <!-- Lock body -->
          <rect x="20" y="55" width="100" height="75" rx="12" fill="#1e1e24" stroke="url(#accent-grad)" stroke-width="4" />
          <!-- Shackle -->
          <path d="M 38,55 L 38,35 C 38,15 102,15 102,35 L 102,55" fill="none" stroke="url(#accent-grad)" stroke-width="4" stroke-linecap="round" />
          <!-- Keyhole -->
          <circle cx="70" cy="85" r="8" fill="#a855f7" />
          <path d="M 70,90 L 70,105" stroke="#a855f7" stroke-width="5" stroke-linecap="round" />
          <!-- Glowing Shield Overlay -->
          <path d="M 90,75 C 90,75 115,85 115,105 C 115,125 90,135 90,135 C 90,135 65,125 65,105 C 65,85 90,75 90,75 Z" fill="#10b981" opacity="0.85" stroke="#ffffff" stroke-width="2" />
          <text x="90" y="113" font-family="system-ui" font-size="18" fill="#ffffff" font-weight="bold" text-anchor="middle">✓</text>
        </g>
      </g>
    `,
  },
  {
    slug: 'cricket-run-rate-beginners-guide',
    title: "Cricket Run Rate: Beginner's Guide",
    category: 'Cricket',
    icon: `
      <!-- Cricket pitch, bats, scoreboard -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <g transform="translate(-80, -80)">
          <!-- Ground / Oval outline -->
          <ellipse cx="80" cy="80" rx="75" ry="55" fill="#1e1e24" stroke="url(#accent-grad)" stroke-width="3" />
          <!-- Stumps -->
          <g transform="translate(60, 50)" stroke="#eab308" stroke-width="3" stroke-linecap="round">
            <line x1="0" y1="0" x2="0" y2="45" />
            <line x1="10" y1="0" x2="10" y2="45" />
            <line x1="20" y1="0" x2="20" y2="45" />
            <!-- Bails -->
            <line x1="-3" y1="0" x2="23" y2="0" stroke-width="4" />
          </g>
          <!-- Cricket Ball -->
          <circle cx="105" cy="85" r="12" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
          <path d="M 98,77 Q 105,85 105,95" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="2,1" />
          <!-- Crossing Bats -->
          <g transform="translate(30, 80) rotate(-45)">
            <rect x="0" y="-35" width="8" height="45" fill="#d97706" rx="2" />
            <rect x="2" y="-55" width="4" height="20" fill="#ffffff" rx="1" />
          </g>
        </g>
      </g>
    `,
  },
  {
    slug: 'hashtag-strategy-viral-growth',
    title: 'Hashtag Strategy for Viral Growth',
    category: 'Marketing',
    icon: `
      <!-- Floating hashtag symbols with growth charts -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <g transform="translate(-75, -75)">
          <rect x="15" y="15" width="120" height="120" rx="20" fill="#1e1e24" stroke="url(#accent-grad)" stroke-width="4" />
          <!-- Trending grid lines -->
          <path d="M 30,110 L 60,80 L 80,95 L 115,50" fill="none" stroke="#10b981" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M 100,50 L 115,50 L 115,65" fill="none" stroke="#10b981" stroke-width="5" stroke-linecap="round" />
          <!-- Large glowing hashtag -->
          <text x="65" y="70" font-family="system-ui, sans-serif" font-size="56" font-weight="900" fill="url(#accent-grad)" opacity="0.8">#</text>
          <text x="95" y="105" font-family="system-ui" font-size="28">📈</text>
        </g>
      </g>
    `,
  },
  {
    slug: 'how-to-compress-images',
    title: 'How to Compress Images',
    category: 'Image Tools',
    icon: `
      <!-- Compression arrows and file size metrics -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <g transform="translate(-70, -70)">
          <!-- Outer box -->
          <rect x="15" y="15" width="110" height="110" rx="16" fill="none" stroke="url(#accent-grad)" stroke-width="3" stroke-dasharray="4,4" />
          <!-- Inner box (smaller) -->
          <rect x="35" y="35" width="70" height="70" rx="10" fill="#1e1e24" stroke="#3b82f6" stroke-width="4" />
          <!-- Arrow pointing in -->
          <g stroke="#a855f7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none">
            <path d="M 15,15 L 42,42" />
            <path d="M 28,42 L 42,42 L 42,28" />
            
            <path d="M 125,125 L 98,98" />
            <path d="M 112,98 L 98,98 L 98,112" />
          </g>
          <text x="70" y="78" font-family="system-ui" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">5MB</text>
          <text x="70" y="130" font-family="system-ui" font-size="16" font-weight="bold" fill="#10b981" text-anchor="middle">→ 250KB</text>
        </g>
      </g>
    `,
  },
  {
    slug: 'how-to-optimize-images-for-web',
    title: 'How to Optimize Images for Web',
    category: 'Image Tools',
    icon: `
      <!-- Browser window with speed gauge -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <g transform="translate(-75, -70)">
          <!-- Browser Frame -->
          <rect x="10" y="15" width="130" height="100" rx="14" fill="#1e1e24" stroke="url(#accent-grad)" stroke-width="3.5" />
          <!-- Dots -->
          <circle cx="25" cy="30" r="4" fill="#ef4444" />
          <circle cx="37" cy="30" r="4" fill="#eab308" />
          <circle cx="49" cy="30" r="4" fill="#10b981" />
          <!-- Speed Gauge -->
          <path d="M 35,90 A 40,40 0 0,1 115,90" fill="none" stroke="#3b82f6" stroke-width="8" stroke-linecap="round" opacity="0.3" />
          <path d="M 35,90 A 40,40 0 0,1 95,50" fill="none" stroke="#10b981" stroke-width="8" stroke-linecap="round" />
          <!-- Gauge needle -->
          <line x1="75" y1="90" x2="90" y2="55" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" />
          <circle cx="75" cy="90" r="6" fill="#ffffff" />
          <!-- Lightning overlay -->
          <text x="115" y="120" font-family="system-ui" font-size="36">⚡</text>
        </g>
      </g>
    `,
  },
  {
    slug: 'how-to-resize-images-social-media',
    title: 'How to Resize Images for Social Media',
    category: 'Social Media',
    icon: `
      <!-- Instagram, Facebook, Twitter crop grids -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <g transform="translate(-70, -70)">
          <!-- Multiple overlapping crop templates -->
          <rect x="10" y="10" width="80" height="80" rx="8" fill="none" stroke="#a855f7" stroke-width="3" opacity="0.6" />
          <rect x="35" y="35" width="90" height="90" rx="12" fill="#1e1e24" stroke="url(#accent-grad)" stroke-width="4" />
          <!-- Crop marks inside -->
          <g stroke="#ffffff" stroke-width="2" opacity="0.7">
            <line x1="65" y1="35" x2="65" y2="125" stroke-dasharray="3,3" />
            <line x1="95" y1="35" x2="95" y2="125" stroke-dasharray="3,3" />
            <line x1="35" y1="65" x2="125" y2="65" stroke-dasharray="3,3" />
            <line x1="35" y1="95" x2="125" y2="95" stroke-dasharray="3,3" />
          </g>
          <!-- Social icons miniature floating -->
          <text x="25" y="115" font-family="system-ui" font-size="28">📸</text>
          <text x="110" y="25" font-family="system-ui" font-size="24">🐦</text>
        </g>
      </g>
    `,
  },
  {
    slug: 'image-compression-without-losing-quality',
    title: 'Image Compression: No Quality Loss',
    category: 'Image Tools',
    icon: `
      <!-- Magnifying glass or scale balancing quality & size -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <g transform="translate(-75, -75)">
          <rect x="15" y="15" width="120" height="120" rx="20" fill="#1e1e24" stroke="url(#accent-grad)" stroke-width="4" />
          <!-- Balance Scales -->
          <line x1="30" y1="100" x2="120" y2="100" stroke="url(#accent-grad)" stroke-width="4" />
          <line x1="75" y1="100" x2="75" y2="40" stroke="url(#accent-grad)" stroke-width="4" />
          <!-- Balance beam (perfectly balanced/straight) -->
          <line x1="45" y1="55" x2="105" y2="55" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
          <!-- Left scale: Quality -->
          <line x1="45" y1="55" x2="45" y2="80" stroke="#ffffff" stroke-width="1.5" />
          <circle cx="45" cy="80" r="10" fill="#10b981" opacity="0.8" />
          <text x="45" y="84" font-family="system-ui" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">HD</text>
          <!-- Right scale: Size -->
          <line x1="105" y1="55" x2="105" y2="80" stroke="#ffffff" stroke-width="1.5" />
          <circle cx="105" cy="80" r="10" fill="#3b82f6" opacity="0.8" />
          <text x="105" y="84" font-family="system-ui" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">KB</text>
        </g>
      </g>
    `,
  },
  {
    slug: 'qr-codes-marketing-best-practices',
    title: 'QR Codes in Marketing: Best Practices',
    category: 'Marketing',
    icon: `
      <!-- QR code scan targeting smartphone -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <g transform="translate(-70, -70)">
          <!-- QR Code vector outline -->
          <rect x="10" y="10" width="120" height="120" rx="14" fill="#1e1e24" stroke="url(#accent-grad)" stroke-width="4" />
          <!-- QR Corners -->
          <rect x="25" y="25" width="30" height="30" fill="none" stroke="#ffffff" stroke-width="4" />
          <rect x="33" y="33" width="14" height="14" fill="#ffffff" />
          
          <rect x="85" y="25" width="30" height="30" fill="none" stroke="#ffffff" stroke-width="4" />
          <rect x="93" y="33" width="14" height="14" fill="#ffffff" />
          
          <rect x="25" y="85" width="30" height="30" fill="none" stroke="#ffffff" stroke-width="4" />
          <rect x="33" y="93" width="14" height="14" fill="#ffffff" />
          <!-- Center design -->
          <rect x="65" y="65" width="15" height="15" fill="#a855f7" />
          <rect x="85" y="85" width="15" height="15" fill="#a855f7" />
          <!-- Scanning target phone -->
          <text x="110" y="120" font-family="system-ui" font-size="36">📱</text>
        </g>
      </g>
    `,
  },
  {
    slug: 'top-10-ai-tools-content-creators-2026',
    title: 'Top 10 AI Tools for Content Creators',
    category: 'AI Tools',
    icon: `
      <!-- Hologram dashboard + multi-floating creator items -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <g transform="translate(-75, -75)">
          <rect x="15" y="15" width="120" height="120" rx="24" fill="#1e1e24" stroke="url(#accent-grad)" stroke-width="4" />
          <!-- Glowing neural network -->
          <line x1="35" y1="45" x2="75" y2="35" stroke="#a855f7" stroke-width="2" />
          <line x1="75" y1="35" x2="115" y2="45" stroke="#a855f7" stroke-width="2" />
          <line x1="115" y1="45" x2="100" y2="105" stroke="#a855f7" stroke-width="2" />
          <line x1="100" y1="105" x2="50" y2="105" stroke="#a855f7" stroke-width="2" />
          <line x1="50" y1="105" x2="35" y2="45" stroke="#a855f7" stroke-width="2" />
          <line x1="75" y1="35" x2="75" y2="85" stroke="#a855f7" stroke-width="1.5" />
          <!-- Floating items -->
          <circle cx="35" cy="45" r="15" fill="#1e1e24" stroke="#a855f7" stroke-width="2" />
          <text x="35" y="52" font-family="system-ui" font-size="16" text-anchor="middle">📝</text>
          
          <circle cx="75" cy="35" r="15" fill="#1e1e24" stroke="#a855f7" stroke-width="2" />
          <text x="75" y="42" font-family="system-ui" font-size="16" text-anchor="middle">🎨</text>
          
          <circle cx="115" cy="45" r="15" fill="#1e1e24" stroke="#a855f7" stroke-width="2" />
          <text x="115" y="52" font-family="system-ui" font-size="16" text-anchor="middle">🎙️</text>
          
          <!-- Center Brain -->
          <circle cx="75" cy="85" r="22" fill="url(#accent-grad)" />
          <text x="75" y="93" font-family="system-ui" font-size="22" text-anchor="middle">🧠</text>
        </g>
      </g>
    `,
  },
  {
    slug: 'webp-vs-png-vs-jpg-which-format-wins',
    title: 'WebP vs PNG vs JPG Comparison',
    category: 'Image Tools',
    icon: `
      <!-- Dynamic grid comparing WebP, PNG, JPG logs & sizes -->
      <g transform="translate(850, 315)">
        <circle cx="0" cy="0" r="140" fill="url(#accent-grad)" opacity="0.1" />
        <g transform="translate(-80, -75)">
          <!-- WebP bar (lowest, champion) -->
          <rect x="10" y="85" width="40" height="40" rx="6" fill="#10b981" />
          <text x="30" y="110" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">WEBP</text>
          <text x="30" y="140" font-family="system-ui" font-size="11" font-weight="bold" fill="#10b981" text-anchor="middle">12KB</text>
          
          <!-- PNG bar (medium-high, transparent) -->
          <rect x="60" y="55" width="40" height="70" rx="6" fill="#3b82f6" />
          <text x="80" y="80" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">PNG</text>
          <text x="80" y="140" font-family="system-ui" font-size="11" font-weight="bold" fill="#3b82f6" text-anchor="middle">85KB</text>
          
          <!-- JPG bar (high, traditional) -->
          <rect x="110" y="30" width="40" height="95" rx="6" fill="#f59e0b" />
          <text x="130" y="55" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">JPG</text>
          <text x="130" y="140" font-family="system-ui" font-size="11" font-weight="bold" fill="#f59e0b" text-anchor="middle">45KB</text>
        </g>
      </g>
    `,
  },
];

async function generateBlogCovers() {
  for (const post of blogPosts) {
    const titleLines = [];
    const words = post.title.split(' ');
    let currentLine = '';

    // Split title into 2-3 readable lines
    for (const word of words) {
      if ((currentLine + ' ' + word).length > 22) {
        titleLines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine += ' ' + word;
      }
    }
    if (currentLine) {
      titleLines.push(currentLine.trim());
    }

    // Prepare SVG text elements for lines
    const textElements = titleLines
      .map((line, idx) => {
        const yOffset = 250 + idx * 65 - (titleLines.length - 1) * 30;
        return `<text x="80" y="${yOffset}" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-1.5">${line}</text>`;
      })
      .join('\n');

    const svg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        ${gradientDefs}
        <rect width="1200" height="630" fill="url(#bg-grad)" />
        <rect width="1200" height="630" fill="url(#purple-glow)" />
        <rect width="1200" height="630" fill="url(#blue-glow)" />
        ${gridPattern}
        
        <!-- Frame decoration -->
        <rect x="30" y="30" width="1140" height="570" rx="24" fill="none" stroke="rgba(168, 85, 247, 0.12)" stroke-width="2" />
        <rect x="42" y="42" width="1116" height="546" rx="18" fill="none" stroke="rgba(59, 130, 246, 0.05)" stroke-width="1.5" />
        
        <!-- Category Badge -->
        <g transform="translate(80, 100)">
          <rect width="140" height="36" rx="18" fill="#a855f7" opacity="0.15" />
          <rect width="140" height="36" rx="18" fill="none" stroke="#a855f7" stroke-width="1.5" />
          <text x="70" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="900" fill="#c084fc" letter-spacing="1.5" text-anchor="middle">${post.category.toUpperCase()}</text>
        </g>
        
        <!-- Blog Title Lines -->
        ${textElements}
        
        <!-- Footer Info -->
        <g transform="translate(80, 510)">
          <!-- Brand Icon -->
          <rect width="36" height="36" rx="10" fill="#0b0b0c" stroke="url(#accent-grad)" stroke-width="1.5" />
          <text x="18" y="25" font-family="system-ui" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">N</text>
          <!-- Brand text -->
          <text x="50" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#94a3b8">NumanX Tools <tspan fill="rgba(168, 85, 247, 0.6)">· Blog</tspan></text>
        </g>
        
        <!-- Interactive Theme Illustration Icon on the Right -->
        ${post.icon}
      </svg>
    `;

    const outputPath = path.join(blogDir, `${post.slug}.webp`);
    await svgToImage(svg, outputPath, 1200, 630, 'webp');
  }
}

// --- Main Execution ---
async function run() {
  console.log('🚀 Starting programmatic generation of professional vector assets...');
  await generateAuthorAvatar();
  await generateOGDefault();
  await generateFavicon();
  await generateAppleTouchIcon();
  await generatePWAIcons();
  await generateBlogCovers();
  console.log('🎉 All assets generated successfully!');
}

run();
