/**
 * ─── HUNGARIAN ALGORITHM SERVICE ────────────────────────────────────────────
 *
 * Replaces greedy auto-assignment with an optimal global assignment using
 * the Hungarian (Munkres) algorithm.
 *
 * The algorithm minimises total cost, so we convert match scores (higher
 * is better) to costs (lower is better) via: cost = 100 - score.
 *
 * Guarantees:
 *   - No volunteer is double-assigned
 *   - No need is double-assigned
 *   - Overall total match score is globally maximised
 */

import munkres from 'munkres-js';
import type { Match } from '../types';
import { AUTO_ASSIGN_MIN_SCORE } from '../config/matchingConfig';

/** Result of Hungarian optimisation */
export interface OptimalAssignment {
  volunteerIndex: number;
  needIndex: number;
  match: Match;
}

/**
 * Builds a score matrix from match data.
 *
 * Rows = unique volunteers, Columns = unique needs.
 * Cell values = match scores (0–100). If no match exists for a pair, the
 * score is 0 (which becomes cost = 100, making it undesirable).
 */
export function buildScoreMatrix(
  matches: Match[],
  volunteerIds: string[],
  needIds: string[]
): number[][] {
  const vIndex = new Map<string, number>();
  const nIndex = new Map<string, number>();

  volunteerIds.forEach((id, i) => vIndex.set(id, i));
  needIds.forEach((id, i) => nIndex.set(id, i));

  // Initialise with zeros (no match = worst score)
  const matrix: number[][] = Array.from({ length: volunteerIds.length }, () =>
    new Array(needIds.length).fill(0)
  );

  for (const match of matches) {
    const vi = vIndex.get(match.volunteer.id);
    const ni = nIndex.get(match.need.id);
    if (vi !== undefined && ni !== undefined) {
      matrix[vi][ni] = match.score;
    }
  }

  return matrix;
}

/**
 * Converts a score matrix to a cost matrix.
 * cost = MAX_SCORE - score (higher scores become lower costs).
 */
function toCostMatrix(scoreMatrix: number[][]): number[][] {
  const MAX_SCORE = 100;
  return scoreMatrix.map((row) => row.map((score) => MAX_SCORE - score));
}

/**
 * Pads a non-square matrix to make it square (required by Munkres).
 * Padding cells get maximum cost (100) so they're never preferred.
 */
function padToSquare(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const size = Math.max(rows, cols);

  const padded: number[][] = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => {
      if (i < rows && j < cols) return matrix[i][j];
      return 100; // Maximum cost for padding cells
    })
  );

  return padded;
}

/**
 * Applies the Hungarian algorithm to find globally optimal assignments.
 *
 * @param matches  All scored match candidates (pre-filtered through
 *                 shouldConsider and scored above 0).
 * @param threshold  Minimum score for a pair to be included (default:
 *                   AUTO_ASSIGN_MIN_SCORE from config).
 * @returns Optimally assigned matches — no duplicates on either side.
 */
export function hungarianAssign(
  matches: Match[],
  threshold: number = AUTO_ASSIGN_MIN_SCORE
): Match[] {
  if (matches.length === 0) return [];

  // Filter out already-assigned needs and below-threshold matches
  const eligibleMatches = matches.filter(
    (m) => !m.need.isAssigned && m.score >= threshold
  );

  if (eligibleMatches.length === 0) return [];

  // Extract unique volunteer and need IDs
  const volunteerIds = [...new Set(eligibleMatches.map((m) => m.volunteer.id))];
  const needIds = [...new Set(eligibleMatches.map((m) => m.need.id))];

  // Build lookup for fast match retrieval
  const matchLookup = new Map<string, Match>();
  for (const m of eligibleMatches) {
    const key = `${m.volunteer.id}::${m.need.id}`;
    // Keep the highest-scoring match for any duplicate pair
    const existing = matchLookup.get(key);
    if (!existing || m.score > existing.score) {
      matchLookup.set(key, m);
    }
  }

  // Build & pad the matrices
  const scoreMatrix = buildScoreMatrix(eligibleMatches, volunteerIds, needIds);
  const costMatrix = toCostMatrix(scoreMatrix);
  const squareCost = padToSquare(costMatrix);

  // Run Hungarian algorithm
  const assignments: [number, number][] = munkres(squareCost);

  // Extract valid results (skip padding assignments and below-threshold)
  const results: Match[] = [];

  for (const [row, col] of assignments) {
    // Skip padding indices
    if (row >= volunteerIds.length || col >= needIds.length) continue;

    const vId = volunteerIds[row];
    const nId = needIds[col];
    const key = `${vId}::${nId}`;
    const match = matchLookup.get(key);

    // Only include if a real match exists and meets threshold
    if (match && match.score >= threshold) {
      results.push(match);
    }
  }

  // Sort results by score descending for consistent UI presentation
  results.sort((a, b) => b.score - a.score);

  return results;
}
