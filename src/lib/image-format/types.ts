/**
 * NumanX Tools Hub — Shared Image Format Engine Types
 * Provides unified type definitions for image conversion across all format tools.
 */

export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'svg';
export type TargetFormat = 'jpeg' | 'png' | 'webp';

export interface ConversionOptions {
  /** Target output format */
  targetFormat: TargetFormat;
  /** Compression quality between 0.0 and 1.0 (applicable to JPEG and WebP) */
  quality?: number;
  /** Solid background color for formats without alpha channel (e.g., '#FFFFFF' for JPEG) */
  backgroundColor?: string;
  /** Target width (optional for raster images, required/fallback for SVG) */
  width?: number;
  /** Target height (optional for raster images, required/fallback for SVG) */
  height?: number;
}

export interface ConversionResult {
  /** The converted binary blob */
  blob: Blob;
  /** An Object URL representing the converted blob */
  objectUrl: string;
  /** Standard MIME type (e.g. 'image/png') */
  mimeType: string;
  /** Normalized extension with dot (e.g. '.png') */
  extension: string;
  /** Output width in pixels */
  width: number;
  /** Output height in pixels */
  height: number;
  /** Output byte size */
  size: number;
  /** Suggested output filename */
  name: string;
  /** Suggested output filename (alias for name) */
  filename: string;
  /** Savings percent compared to input if input had known size */
  savingsPercent?: number;
  /** Cleans up the object URL to prevent memory leaks */
  revoke: () => void;
}

export interface ValidationResult {
  /** Whether the file is valid and acceptable for conversion */
  valid: boolean;
  /** User-friendly error message if invalid */
  error?: string;
  /** Detected format if valid */
  format?: ImageFormat;
  /** Normalized MIME type */
  mimeType?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}
