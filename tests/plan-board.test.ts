import { afterAll, describe, expect, it } from "@jest/globals";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Regression contract for plan/tools/plan-board.py (see plan/README.md section Tooling).
 * Each test builds a throwaway board under os.tmpdir(), so tests are order-independent
 * and never read or write the real plan/ board.
 */

const boardTool = path.join(__dirname, "..", "plan", "tools", "plan-board.py");

const COLUMNS = ["draft", "in-progress", "qa", "complete"] as const;

const SECTIONS = [
  "## Goal",
  "## Success Criteria",
  "## Scope",
  "## Safety",
  "## Inputs Available",
  "## Outputs Required",
  "## Test Plan",
  "## Verification",
  "## Notes / Edge Cases",
];

const BODY = SECTIONS.map((section) => `${section}\n\n- fixture value`).join("\n\n");

const tmpRoots: string[] = [];

function pythonBin(): string {
  for (const candidate of ["python3", "python"]) {
    const probe = spawnSync(candidate, ["--version"], { encoding: "utf8" });
    if (probe.status === 0) return candidate;
  }
  throw new Error(
    "No Python interpreter found: neither python3 nor python is executable on PATH (plan-board regression suite requires Python 3.12)",
  );
}

type RunResult = { status: number | null; stdout: string; stderr: string };

function runBoard(args: string[]): RunResult {
  const result = spawnSync(pythonBin(), [boardTool, ...args], { encoding: "utf8" });
  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function jsonOf(result: RunResult): any {
  try {
    return JSON.parse(result.stdout);
  } catch {
    return undefined;
  }
}

function makeBoard(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "plan-board-"));
  for (const column of COLUMNS) {
    fs.mkdirSync(path.join(root, column), { recursive: true });
  }
  tmpRoots.push(root);
  return root;
}

/**
 * Writes a schema-valid plan: the frontmatter id is the filename stem (leading segment
 * rule) and the body carries all nine required sections.
 */
function writeFixturePlan(root: string, name: string, status: string, comprehension?: string): string {
  const stem = name.endsWith(".md") ? name.slice(0, -3) : name;
  const filePath = path.join(root, status, name);
  const lines = [
    "---",
    `id: ${stem}`,
    `title: Fixture ${stem}`,
    `status: ${status}`,
    "created: 2026-01-01",
    "updated: 2026-01-01",
    "owner: plan-writer",
    "executor: developer-fixer",
  ];
  if (comprehension) lines.push(`comprehension: ${comprehension}`);
  lines.push("---", "", BODY, "");
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
  return filePath;
}

afterAll(() => {
  for (const root of tmpRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe("plan-board.py contract", () => {
  it("move accepts --comprehension and records the outcome in the moved file", () => {
    const root = makeBoard();
    writeFixturePlan(root, "42-cycle-fixture.md", "draft");

    const result = runBoard([
      "move",
      "--id",
      "42-cycle-fixture",
      "--to",
      "qa",
      "--comprehension",
      "skipped",
      "--root",
      root,
      "--json",
    ]);

    expect(result.status).toBe(0);
    const payload = jsonOf(result);
    expect(payload?.ok).toBe(true);
    expect(payload?.verified).toBe(true);

    const moved = path.join(root, "qa", "42-cycle-fixture.md");
    expect(fs.existsSync(moved)).toBe(true);
    expect(fs.existsSync(path.join(root, "draft", "42-cycle-fixture.md"))).toBe(false);

    const content = fs.readFileSync(moved, "utf8");
    expect(content).toContain("status: qa");
    expect(content).toContain("comprehension: skipped");
  });

  it("check reports missing-comprehension for a qa plan without the key and not for one with it", () => {
    const root = makeBoard();
    writeFixturePlan(root, "43-missing-comprehension.md", "draft");

    const moved = runBoard([
      "move",
      "--id",
      "43-missing-comprehension",
      "--to",
      "qa",
      "--root",
      root,
      "--json",
    ]);
    expect(moved.status).toBe(0);

    writeFixturePlan(root, "44-with-comprehension.md", "qa", "skipped");

    const result = runBoard(["check", "--root", root, "--json"]);

    expect(result.status).toBe(0);
    const payload = jsonOf(result);
    const warnings: any[] = payload?.warnings ?? [];
    const flaggedFiles = warnings
      .filter((warning) => warning.code === "missing-comprehension")
      .map((warning) => warning.file);

    expect(flaggedFiles).toHaveLength(1);
    expect(flaggedFiles[0]).toContain(path.join("qa", "43-missing-comprehension.md"));
  });

  it("rejects a --comprehension value outside the documented choices", () => {
    const root = makeBoard();
    writeFixturePlan(root, "45-invalid-comprehension.md", "draft");

    const result = runBoard([
      "move",
      "--id",
      "45-invalid-comprehension",
      "--to",
      "qa",
      "--comprehension",
      "si",
      "--root",
      root,
      "--json",
    ]);

    expect(result.status).not.toBe(0);
  });
});
