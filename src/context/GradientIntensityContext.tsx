"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface GradientIntensityContextValue {
  intensity: number;
  setIntensity: (value: number) => void;
}

const GradientIntensityContext = createContext<GradientIntensityContextValue>({
  intensity: 1,
  setIntensity: () => undefined,
});

export function GradientIntensityProvider({ children }: { children: ReactNode }) {
  const [intensity, setIntensity] = useState(1);
  return (
    <GradientIntensityContext.Provider value={{ intensity, setIntensity }}>
      {children}
    </GradientIntensityContext.Provider>
  );
}

export function useGradientIntensity() {
  return useContext(GradientIntensityContext);
}
