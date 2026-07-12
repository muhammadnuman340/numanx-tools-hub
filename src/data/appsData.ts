export interface AppMetadata {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1Headline: string;
  tagline: string;
  applicationCategory: string;
  features: string[];
}

export const appsMatrix: AppMetadata[] = [
  {
    slug: 'pdf-merger',
    metaTitle: 'Free Online PDF Merger - Combine PDFs Easily | NumanX Tools Hub',
    metaDescription: 'Merge multiple PDF files into a single document quickly and securely. No installation required. Fast, free, and easy to use.',
    h1Headline: 'Merge PDF Files Online',
    tagline: 'Combine multiple PDFs into one unified document in seconds.',
    applicationCategory: 'UtilitiesApplication',
    features: [
      'Drag and drop interface',
      'Secure local processing',
      'Preserves document formatting',
      'Unlimited merges'
    ]
  },
  {
    slug: 'qr-generator',
    metaTitle: 'Free QR Code Generator - Create Custom QR Codes | NumanX Tools Hub',
    metaDescription: 'Generate custom QR codes for URLs, text, email, and more. Download in high resolution for print or digital use.',
    h1Headline: 'Custom QR Code Generator',
    tagline: 'Create instantly scannable QR codes for any purpose.',
    applicationCategory: 'UtilitiesApplication',
    features: [
      'Supports URLs, Text, WiFi, etc.',
      'Customizable colors',
      'High-resolution SVG/PNG export',
      'Instant generation'
    ]
  },
  {
    slug: 'image-compressor',
    metaTitle: 'Free Image Compressor - Reduce Photo File Size | NumanX Tools Hub',
    metaDescription: 'Compress JPEG, PNG, and WebP images without losing quality. Optimize images for faster web loading.',
    h1Headline: 'Smart Image Compressor',
    tagline: 'Reduce image file sizes significantly without visible quality loss.',
    applicationCategory: 'UtilitiesApplication',
    features: [
      'Lossless and lossy compression',
      'Bulk compression support',
      'Preview before saving',
      'Browser-based privacy'
    ]
  },
  {
    slug: 'word-counter',
    metaTitle: 'Free Word and Character Counter Tool | NumanX Tools Hub',
    metaDescription: 'Count words, characters, sentences, and paragraphs in real-time. Improve your writing with instant text statistics.',
    h1Headline: 'Advanced Word Counter',
    tagline: 'Real-time text statistics for writers, students, and professionals.',
    applicationCategory: 'UtilitiesApplication',
    features: [
      'Real-time word & character count',
      'Reading time estimation',
      'Keyword density analysis',
      'Copy/paste support'
    ]
  },
  {
    slug: 'cricket-stat-tracker',
    metaTitle: 'Cricket Stat Tracker - Monitor Player & Team Stats | NumanX Tools Hub',
    metaDescription: 'Track cricket statistics easily. Keep scores, analyze player performance, and manage team data in one place.',
    h1Headline: 'Cricket Stat Tracker',
    tagline: 'Comprehensive performance tracking for cricket enthusiasts and local teams.',
    applicationCategory: 'SportsApplication',
    features: [
      'Match scoring',
      'Player performance history',
      'Batting & bowling averages',
      'Exportable reports'
    ]
  }
];
