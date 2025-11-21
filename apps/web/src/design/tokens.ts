// @ts-ignore - CommonJS module
const tokensBase = require("../../design/tokens");

type Palette = Record<string, string>;

export interface DesignTokens {
  colors: {
    primary: Palette;
    neutral: Palette;
    accent: Palette;
    semantic: {
      bg: string;
      surface: string;
      border: string;
      textPrimary: string;
      textMuted: string;
      success: string;
      warning: string;
      danger: string;
    };
  };
  spacing: Record<string, string>;
  radius: {
    sm: string;
    md: string;
    lg: string;
    round: string;
  };
  elevation: Record<"soft" | "medium" | "deep", string>;
}

const tokens = tokensBase as DesignTokens;

export const designTokens = tokens;
export const { colors, spacing, radius, elevation } = tokens;

export type SemanticColor = keyof typeof tokens.colors.semantic;

export default tokens;
