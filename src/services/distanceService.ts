/**
 * ─── DISTANCE / LOCATION SERVICE ────────────────────────────────────────────
 *
 * Abstracts location comparison so the scoring engine doesn't need to know
 * whether locations are text strings, lat/lng coords, or future geocoded
 * values. Currently uses text-based word overlap; the interface is designed
 * so a lat/lng implementation can be swapped in later.
 */

/**
 * Computes a location match score between two text locations.
 *
 * Algorithm:
 * 1. Normalise both strings (lowercase, trim).
 * 2. Exact match → 1.0.
 * 3. Split into words, compute overlap ratio against the need's words.
 * 4. No artificial floor — pure ratio returned.
 *
 * @returns A value between 0 and 1.
 */
export function computeLocationScore(
  volunteerLocation: string = '',
  needLocation: string = ''
): number {
  const vLoc = (volunteerLocation ?? '').toLowerCase().trim();
  const nLoc = (needLocation ?? '').toLowerCase().trim();

  if (vLoc === nLoc && vLoc !== '') return 1;
  if (!vLoc || !nLoc) return 0;

  const vWords = vLoc.split(/\s+/).filter((w) => w.length > 0);
  const nWords = nLoc.split(/\s+/).filter((w) => w.length > 0);

  if (vWords.length === 0 || nWords.length === 0) return 0;

  const matchingWords = nWords.filter((w) => vWords.includes(w)).length;

  // Pure overlap ratio — no artificial minimum
  return matchingWords / nWords.length;
}
