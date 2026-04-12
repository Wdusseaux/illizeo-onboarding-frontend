import { createContext, useContext } from "react";

// Shared context for the entire Onboarding application.
// Typed as `any` during decomposition — will be progressively typed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OnboardingContext = createContext<any>(null);

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
};

export const OnboardingProvider = OnboardingContext.Provider;

export default OnboardingContext;
