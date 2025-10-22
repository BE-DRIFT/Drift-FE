import { useTheme } from '../theme/ThemeContext';
import { lightColors, darkColors, Colors } from '../theme/colors';

export const useThemeColors = (): Colors => {
  const { isDark } = useTheme();
  return isDark ? darkColors : lightColors;
};

export { useTheme };
