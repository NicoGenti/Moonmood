import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/services/db", () => ({
  clearAllLocalData: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
}));

// Mock next/navigation (required by next/link)
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => "/settings",
  useSearchParams: () => new URLSearchParams(),
}));

import SettingsPage from "./page";

describe("SettingsPage", () => {
  it("links to privacy page", () => {
    render(<SettingsPage />);
    const link = screen.getByRole("link", { name: /privacy/i });
    expect(link.getAttribute("href")).toBe("/privacy");
  });

  it("asks confirmation before deleting", async () => {
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);
    const user = userEvent.setup();

    render(<SettingsPage />);

    const button = screen.getByRole("button", { name: /cancella tutti i dati/i });
    await user.click(button);

    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});
