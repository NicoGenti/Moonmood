/** Returns true when matchMedia is available and functional (client-side only). */
export function isMatchMediaAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function";
}
