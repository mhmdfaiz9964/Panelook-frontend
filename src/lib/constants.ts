/**
 * Single source of truth for display screen sizes, banner recommendations,
 * and display panel taxonomies for Panelook.lk
 */

export const MASTER_SCREEN_SIZES = [
  '10.1 inch',
  '11.6 inch',
  '12.0 inch',
  '12.5 inch',
  '13.3 inch',
  '13.4 inch',
  '14.0 inch',
  '14.5 inch',
  '15.0 inch',
  '15.6 inch',
  '16.0 inch',
  '16.1 inch',
  '17.0 inch',
  '17.3 inch',
  '18.0 inch',
] as const;

export type MasterScreenSize = (typeof MASTER_SCREEN_SIZES)[number];

/**
 * Normalizes any screen size input (e.g., '15.6"', '15.6', '15.60', '15.6 inch')
 * into the standard master size string or float representation.
 */
export function normalizeScreenSize(input: string | number | undefined | null): string {
  if (!input) return '';
  const str = input.toString().trim();
  const match = str.match(/(\d+(?:\.\d+)?)/);
  if (!match) return str;

  const num = parseFloat(match[1]);
  // Format to standard one-decimal representation
  const formatted = num.toFixed(1);

  // Match against master sizes
  const found = MASTER_SCREEN_SIZES.find((s) => s.startsWith(formatted));
  return found ? found.replace(' inch', '') : formatted;
}

export const RECOMMENDED_DIMENSIONS = {
  mainProductImage: {
    label: 'Main Product Image',
    recommended: '1200 × 1200 px',
    width: 1200,
    height: 1200,
    aspect: '1:1',
    formats: 'WebP / JPG / PNG',
    help: 'Clean white or transparent background panel view with no cropping.',
  },
  galleryImage: {
    label: 'Gallery Images',
    recommended: '1200 × 1200 px',
    width: 1200,
    height: 1200,
    aspect: '1:1',
    formats: 'WebP / JPG / PNG',
    help: 'Close-ups of connectors (30-pin/40-pin), model label stickers, and panel brackets.',
  },
  desktopBanner: {
    label: 'Desktop Banner',
    recommended: '1920 × 600 px',
    width: 1920,
    height: 600,
    aspect: '3.2:1',
    formats: 'WebP / JPG / PNG',
    help: 'Wide promotional banner for desktop viewports (1200px - 1920px+).',
  },
  mobileBanner: {
    label: 'Mobile Banner',
    recommended: '1080 × 600 px',
    width: 1080,
    height: 600,
    aspect: '16:9 / 1.8:1',
    formats: 'WebP / JPG / PNG',
    help: 'Optimized banner for smartphones with large text, prominent logo, and clear CTA.',
  },
  categoryBanner: {
    label: 'Category Banner',
    recommended: '800 × 500 px',
    width: 800,
    height: 500,
    aspect: '16:10',
    formats: 'WebP / JPG / PNG',
    help: 'Category header banner.',
  },
} as const;
