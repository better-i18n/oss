import type { ImageLoaderProps } from 'next/image';

/**
 * Cloudflare Image Resizing loader
 * Uses cdn-cgi/image endpoint for on-the-fly image optimization
 *
 * @see https://developers.cloudflare.com/images/transform-images/transform-via-url/
 */
export default function cloudflareImageLoader({ src, width, quality }: ImageLoaderProps): string {
  // For development, return the source as-is
  if (process.env.NODE_ENV === 'development') {
    return src;
  }

  // Build Cloudflare image options
  const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto'];

  // If src is an absolute URL, use it directly
  // If src is a relative path, it will be relative to the domain
  const imageUrl = src.startsWith('/') ? src : `/${src}`;

  return `/cdn-cgi/image/${params.join(',')}${imageUrl}`;
}
