/**
 * Formats a numeric price for display.
 * @param {number} price
 * @returns {string} Formatted price string, e.g. "100 TL"
 */
export function formatPrice(price) {
  return `${price} TL`;
}

/** Formats a menu item's single or variant price(s) for compact displays. */
export function formatItemPrice(item) {
  if (item.prices?.length) {
    return item.prices.map(({ label, amount }) => `${label}: ${formatPrice(amount)}`).join(' · ');
  }

  return formatPrice(item.price);
}
