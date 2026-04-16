declare module 'munkres-js' {
  /**
   * Solves the assignment problem using the Hungarian (Munkres) algorithm.
   *
   * @param costMatrix  A square (or rectangular) 2D array of costs.
   * @returns An array of [row, col] assignment pairs that minimise total cost.
   */
  function munkres(costMatrix: number[][]): [number, number][];
  export default munkres;
}
