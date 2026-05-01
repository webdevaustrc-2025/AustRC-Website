import { useTheme } from '@/context/ThemeContext';
import { tokens, type Tokens } from './theme';

export function useTokens(): Tokens {
  const { theme } = useTheme();
  return tokens[theme];
}

export type { Tokens };
