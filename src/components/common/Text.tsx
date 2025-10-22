import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';

interface CustomTextProps {
  children: React.ReactNode;
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'button';
  style?: TextStyle;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

const Text: React.FC<CustomTextProps> = ({
  children,
  variant = 'body',
  style,
  color,
  align = 'left',
}) => {
  const colors = useThemeColors();

  const getTextStyle = () => {
    const baseStyle = {
      color: color || colors.text,
    };

    const variantStyles = {
      heading: {
        fontSize: 32,
        fontWeight: 'bold' as const,
      },
      subheading: {
        fontSize: 24,
        fontWeight: '600' as const,
      },
      body: {
        fontSize: 16,
        fontWeight: 'normal' as const,
      },
      caption: {
        fontSize: 14,
        fontWeight: 'normal' as const,
        color: colors.textSecondary,
      },
      button: {
        fontSize: 16,
        fontWeight: 'bold' as const,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  return (
    <RNText style={[getTextStyle(), { textAlign: align }, style]}>
      {children}
    </RNText>
  );
};

export default Text;