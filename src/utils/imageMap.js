/**
 * Dynamic image importer for menu items.
 *
 * Uses Vite's import.meta.glob to eagerly load all .webp assets,
 * then exposes a lookup utility by filename.
 */

const imageModules = import.meta.glob('../assets/*.webp', { eager: true });

const imageMap = {};
for (const path in imageModules) {
  const filename = path.split('/').pop();
  imageMap[filename] = imageModules[path].default;
}

/**
 * Get the resolved asset path for a given image filename.
 * @param {string} filename - e.g. "moonche_burger.webp"
 * @returns {string} Resolved image URL
 */
export function getImagePath(filename) {
  if (!filename) {
    return '';
  }

  if (!imageMap[filename]) {
    console.warn(`[imageMap] Image not found: ${filename}`);
    return '';
  }
  return imageMap[filename];
}
