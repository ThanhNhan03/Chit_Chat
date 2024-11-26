import { useTheme } from '../contexts/ThemeContext';

export const useThemedStyles = () => {
  const { theme, isDarkMode } = useTheme();

  const getTextStyle = (baseStyle: any) => ({
    ...baseStyle,
    color: theme.textColor,
  });

  const getCardStyle = (baseStyle: any) => ({
    ...baseStyle,
    backgroundColor: theme.cardBackground,
    borderColor: theme.borderColor,
  });

  return {
    getTextStyle,
    getCardStyle,
  };
}; 