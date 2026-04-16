/**
 * ─── DISTANCE / LOCATION SERVICE ────────────────────────────────────────────
 *
 * Abstracts location comparison so the scoring engine doesn't need to know
 * whether locations are text strings, lat/lng coords, or future geocoded
 * values.
 *
 * Scoring strategy (hybrid):
 *   1. If both parties have lat/lng → use Haversine distance.
 *   2. Otherwise → fall back to text-based word overlap.
 */

import { MAX_DISTANCE_KM, EARTH_RADIUS_KM } from '../config/matchingConfig';

// ─── Haversine Distance ─────────────────────────────────────────────────────

/**
 * Calculates the great-circle distance in kilometres between two lat/lng
 * points using the Haversine formula.
 */
export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number): number => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

// ─── Coordinate-Based Score ─────────────────────────────────────────────────

/**
 * Converts distance in km to a 0–1 score.
 * 0 km → 1.0, MAX_DISTANCE_KM+ → 0.0, linear interpolation in between.
 */
export function coordinateScore(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const distance = haversineDistanceKm(lat1, lng1, lat2, lng2);
  if (distance <= 0) return 1.0;
  if (distance >= MAX_DISTANCE_KM) return 0.0;
  return 1.0 - distance / MAX_DISTANCE_KM;
}

// ─── Text-Based Score ───────────────────────────────────────────────────────

/**
 * Computes a text-based location match score using word overlap.
 *
 * Algorithm:
 * 1. Normalise both strings (lowercase, trim).
 * 2. Exact match → 1.0.
 * 3. Split into words, compute overlap ratio against the need's words.
 * 4. No artificial floor — pure ratio returned.
 *
 * @returns A value between 0 and 1.
 */
export function textLocationScore(
  volunteerLocation: string,
  needLocation: string
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

// ─── Hybrid Score (public API) ──────────────────────────────────────────────

/**
 * Public API — combines coordinate-based and text-based scoring.
 *
 * Uses lat/lng if both parties provide them, otherwise falls back to text.
 */
export function computeLocationScore(
  volunteerLocation: string = '',
  needLocation: string = '',
  volunteerLat?: number,
  volunteerLng?: number,
  needLat?: number,
  needLng?: number
): number {
  // Prefer coordinate-based scoring when both sides have valid coords
  const hasVolunteerCoords =
    typeof volunteerLat === 'number' &&
    typeof volunteerLng === 'number' &&
    isFinite(volunteerLat) &&
    isFinite(volunteerLng);
  const hasNeedCoords =
    typeof needLat === 'number' &&
    typeof needLng === 'number' &&
    isFinite(needLat) &&
    isFinite(needLng);

  if (hasVolunteerCoords && hasNeedCoords) {
    return coordinateScore(
      volunteerLat as number,
      volunteerLng as number,
      needLat as number,
      needLng as number
    );
  }

  // Fallback to text-based matching
  return textLocationScore(volunteerLocation, needLocation);
}
