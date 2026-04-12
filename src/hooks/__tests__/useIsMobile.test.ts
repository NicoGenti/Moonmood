import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach, jest } from "@jest/globals";

import { useIsMobile } from "../useIsMobile";

// Helper to create a mock MediaQueryList
function makeMockMq(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];

  const mq = {
    matches,
    media: "(max-width: 768px)",
    onchange: null,
    addEventListener: jest.fn((_type: string, listener: (e: MediaQueryListEvent) => void) => {
      listeners.push(listener);
    }),
    removeEventListener: jest.fn((_type: string, listener: (e: MediaQueryListEvent) => void) => {
      const idx = listeners.indexOf(listener);
      if (idx !== -1) listeners.splice(idx, 1);
    }),
    dispatchEvent: jest.fn(),
    /** Simulate viewport resize across breakpoint */
    _fire: (newMatches: boolean) => {
      (mq as unknown as { matches: boolean }).matches = newMatches;
      listeners.forEach((l) =>
        l({ matches: newMatches } as MediaQueryListEvent)
      );
    },
  };

  return mq;
}

describe("useIsMobile", () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      value: originalMatchMedia,
      writable: true,
      configurable: true,
    });
  });

  it("returns false when matchMedia is not available (SSR)", () => {
    Object.defineProperty(window, "matchMedia", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true when viewport width is ≤ 768px", () => {
    const mq = makeMockMq(true);
    Object.defineProperty(window, "matchMedia", {
      value: jest.fn().mockReturnValue(mq),
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("returns false when viewport width is > 768px", () => {
    const mq = makeMockMq(false);
    Object.defineProperty(window, "matchMedia", {
      value: jest.fn().mockReturnValue(mq),
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("updates reactively when viewport crosses the breakpoint", async () => {
    const mq = makeMockMq(false);
    Object.defineProperty(window, "matchMedia", {
      value: jest.fn().mockReturnValue(mq),
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    await act(async () => {
      mq._fire(true);
    });
    expect(result.current).toBe(true);

    await act(async () => {
      mq._fire(false);
    });
    expect(result.current).toBe(false);
  });
});
