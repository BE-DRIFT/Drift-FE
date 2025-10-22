import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Dimensions,
  View,
} from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';

const { width: screenWidth } = Dimensions.get('window');

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  underline?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  underline = variant === 'text', // Default to true for text variant
}) => {
  const colors = useThemeColors();

  const styles = createStyles(colors);

  const getButtonStyle = () => {
    return [
      styles.button,
      styles[`button_${variant}`],
      styles[`button_${size}`],
      (disabled || loading) && styles.button_disabled,
      style,
    ];
  };

  const getTextStyle = () => {
    return [
      styles.text,
      styles[`text_${variant}`],
      styles[`text_${size}`],
      underline && styles.textUnderline,
      textStyle,
    ];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getLoaderColor(variant, colors)} 
        />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

const getLoaderColor = (variant: string, colors: any) => {
  switch (variant) {
    case 'outline':
      return colors.primary;
    case 'text':
      return colors.primary;
    default:
      return colors.white;
  }
};

const createStyles = (colors: any) => StyleSheet.create({
  button: {
    borderRadius: screenWidth * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: colors.shadow || '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: '100%',
  },
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.secondary || colors.primaryLight,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  button_text: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: screenWidth * 0.01,
    paddingHorizontal: screenWidth * 0.02,
  },
  button_small: {
    paddingVertical: screenWidth * 0.025,
    paddingHorizontal: screenWidth * 0.04,
  },
  button_medium: {
    paddingVertical: screenWidth * 0.035,
    paddingHorizontal: screenWidth * 0.06,
  },
  button_large: {
    paddingVertical: screenWidth * 0.045,
    paddingHorizontal: screenWidth * 0.08,
  },
  button_disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  text_primary: {
    color: colors.white,
  },
  text_secondary: {
    color: colors.white,
  },
  text_outline: {
    color: colors.primary,
  },
  text_text: {
    color: colors.primary,
    backgroundColor: 'transparent',
  },
  text_small: {
    fontSize: screenWidth * 0.035,
  },
  text_medium: {
    fontSize: screenWidth * 0.04,
  },
  text_large: {
    fontSize: screenWidth * 0.045,
  },
  textUnderline: {
    textDecorationLine: 'underline',
    textDecorationColor: colors.primary,
    textDecorationStyle: 'solid',
  },
  iconLeft: {
    marginRight: screenWidth * 0.02,
  },
  iconRight: {
    marginLeft: screenWidth * 0.02,
  },
});

export default Button;