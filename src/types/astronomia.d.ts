/**
 * Ambient type declaration for astronomia v4.x
 * This package ships no TypeScript declarations and no @types package exists.
 * Minimal types needed for moonPhase.ts — skipLibCheck:true handles internal types.
 */
declare module "astronomia" {
  export const moonphase: {
    /** Mean lunar month in days (~29.530588861) */
    readonly meanLunarMonth: number;
    /** Returns the JDE of the first quarter nearest the given decimal year */
    first(decimalYear: number): number;
    /** Returns the JDE of the full moon nearest the given decimal year */
    full(decimalYear: number): number;
    /** Returns the JDE of the last quarter nearest the given decimal year */
    last(decimalYear: number): number;
    meanNew(decimalYear: number): number;
    meanFirst(decimalYear: number): number;
    meanFull(decimalYear: number): number;
    meanLast(decimalYear: number): number;
    /** Returns the JDE of the new moon nearest the given decimal year (named 'new' in source) */
    newMoon(decimalYear: number): number;
  };

  export const julian: {
    /** Converts a JS Date to Julian Day Ephemeris (JDE) */
    DateToJDE(date: Date): number;
    /** Converts a JDE to a JS Date */
    JDToDate(jd: number): Date;
    DateToJD(date: Date): number;
    JDEToDate(jde: number): Date;
  };
}
