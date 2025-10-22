// components/common/InputField.tsx
import React, { useState } from 'react';
import { 
  TextInput, 
  TextInputProps, 
  StyleSheet, 
  View, 
  Text,
  Dimensions,
  TouchableOpacity,
  TextStyle,
  ViewStyle
} from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';

const { width: screenWidth } = Dimensions.get('window');

// Variants type
type InputVariant = 'default' | 'outlined' | 'filled' | 'underlined' | 'rounded' | 'minimal' | 'hexagon';

interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  showError?: boolean;
  variant?: InputVariant;
  withEye?: boolean;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  placeholderTextColor,
  selectionColor,
  showError = true,
  variant = 'hexagon',
  withEye = false,
  isPassword = false,
  leftIcon,
  rightIcon,
  secureTextEntry: propSecureTextEntry, // Extract from props
  ...props
}) => {
  const colors = useThemeColors();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const styles = createStyles(colors);
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine secure text entry - priority: prop > isPassword logic
  const getSecureTextEntry = () => {
    if (propSecureTextEntry !== undefined) {
      return propSecureTextEntry;
    }
    return isPassword && !isPasswordVisible;
  };

  const secureTextEntry = getSecureTextEntry();

  // Get variant styles
  const getVariantStyles = () => {
    const baseInputStyle: ViewStyle = {
      height: screenWidth * 0.12, // Reduced height
    };

    switch (variant) {
      case 'outlined':
        return {
          container: [styles.outlinedContainer, error && styles.errorBorder],
          input: [styles.outlinedInput, baseInputStyle],
        };
      case 'filled':
        return {
          container: [styles.filledContainer, error && styles.errorBorder],
          input: [styles.filledInput, baseInputStyle],
        };
      case 'underlined':
        return {
          container: [styles.underlinedContainer, error && styles.underlineError],
          input: [styles.underlinedInput, baseInputStyle],
        };
      case 'rounded':
        return {
          container: [styles.roundedContainer, error && styles.errorBorder],
          input: [styles.roundedInput, baseInputStyle],
        };
      case 'minimal':
        return {
          container: [styles.minimalContainer],
          input: [styles.minimalInput, baseInputStyle],
        };
      case 'hexagon':
      default:
        return {
          container: styles.hexagonWrapper,
          input: [styles.hexagonInput, baseInputStyle],
        };
    }
  };

  const variantStyles = getVariantStyles();

  const renderHexagonInput = () => (
    <View style={styles.hexagonWrapper}>
      <View style={[styles.hexagon, (error || isFocused) && styles.hexagonError]}>
        <View style={styles.hexagonInner}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            style={[
              styles.input,
              styles.textLeft,
              variantStyles.input,
              inputStyle,
              leftIcon ? styles.inputWithLeftIcon : {},
              (withEye && isPassword) || rightIcon ? styles.inputWithRightIcon : {},
            ]}
            placeholderTextColor={placeholderTextColor || colors.textTertiary}
            selectionColor={selectionColor || colors.primary}
            secureTextEntry={secureTextEntry}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {(withEye && isPassword) && (
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={togglePasswordVisibility}
              activeOpacity={0.7}
            >
              <Text style={styles.eyeText}>
                {isPasswordVisible ? '👁️' : '🙈'}
              </Text>
            </TouchableOpacity>
          )}
          {rightIcon && !(withEye && isPassword) && (
            <View style={styles.rightIcon}>{rightIcon}</View>
          )}
        </View>
      </View>
      
      {/* Hexagon corners */}
      <View style={[styles.hexagonCorner, styles.hexagonCornerTopLeft, (error || isFocused) && styles.cornerError]} />
      <View style={[styles.hexagonCorner, styles.hexagonCornerTopRight, (error || isFocused) && styles.cornerError]} />
      <View style={[styles.hexagonCorner, styles.hexagonCornerBottomLeft, (error || isFocused) && styles.cornerError]} />
      <View style={[styles.hexagonCorner, styles.hexagonCornerBottomRight, (error || isFocused) && styles.cornerError]} />
    </View>
  );

  const renderStandardInput = () => (
    <View style={[variantStyles.container, isFocused && styles.focusedBorder]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <TextInput
        style={[
          styles.input,
          styles.textLeft,
          variantStyles.input,
          inputStyle,
          leftIcon ? styles.inputWithLeftIcon : {},
          (withEye && isPassword) || rightIcon ? styles.inputWithRightIcon : {},
        ]}
        placeholderTextColor={placeholderTextColor || colors.textTertiary}
        selectionColor={selectionColor || colors.primary}
        secureTextEntry={secureTextEntry}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {(withEye && isPassword) && (
        <TouchableOpacity 
          style={styles.eyeIcon} 
          onPress={togglePasswordVisibility}
          activeOpacity={0.7}
        >
          <Text style={styles.eyeText}>
            {isPasswordVisible ? '👁️' : '🙈'}
          </Text>
        </TouchableOpacity>
      )}
      {rightIcon && !(withEye && isPassword) && (
        <View style={styles.rightIcon}>{rightIcon}</View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      {variant === 'hexagon' ? renderHexagonInput() : renderStandardInput()}
      
      {showError && error && (
        <Text style={[styles.errorText, styles.errorTextLeft]}>{error}</Text>
      )}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: screenWidth * 0.06,
    width: '100%',
  },
  label: {
    fontSize: screenWidth * 0.04,
    fontWeight: '600',
    marginBottom: screenWidth * 0.03,
    color: colors.text,
    textAlign: 'left',
  },
  
  hexagonWrapper: {
    // width: screenWidth * 0.8,
    height: screenWidth * 0.12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexagon: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  hexagonInner: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.card,
    justifyContent: 'center',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  hexagonError: {
    borderColor: colors.error,
  },
  hexagonInput: {
    height: screenWidth * 0.12,
  },
  
  // Standard Input Base
  input: {
    color: colors.text,
    fontSize: screenWidth * 0.04,
    paddingHorizontal: screenWidth * 0.04,
    textAlign: 'left',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  textLeft: {
    textAlign: 'left',
  },
  
  // Variant Styles
  outlinedContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
    height: screenWidth * 0.12,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  outlinedInput: {
    flex: 1,
  },
  
  filledContainer: {
    backgroundColor: colors.background + '80',
    borderRadius: 8,
    height: screenWidth * 0.12,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  filledInput: {
    flex: 1,
  },
  
  underlinedContainer: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    height: screenWidth * 0.12,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  underlinedInput: {
    flex: 1,
  },
  
  roundedContainer: {
    backgroundColor: colors.card,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.border,
    height: screenWidth * 0.12,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  roundedInput: {
    flex: 1,
  },
  
  minimalContainer: {
    backgroundColor: 'transparent',
    height: screenWidth * 0.12,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  minimalInput: {
    flex: 1,
  },
  
  // Icon Styles
  leftIcon: {
    paddingLeft: screenWidth * 0.04,
    paddingRight: screenWidth * 0.02,
    zIndex: 1,
  },
  rightIcon: {
    paddingRight: screenWidth * 0.04,
    paddingLeft: screenWidth * 0.02,
    zIndex: 1,
  },
  inputWithLeftIcon: {
    paddingLeft: screenWidth * 0.02,
  },
  inputWithRightIcon: {
    paddingRight: screenWidth * 0.12, // Extra space for eye icon
  },
  
  // Eye Icon
  eyeIcon: {
    paddingHorizontal: screenWidth * 0.04,
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    zIndex: 2,
  },
  eyeText: {
    fontSize: screenWidth * 0.04,
  },
  
  // Hexagon Corners
  hexagonCorner: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
  },
  hexagonCornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: screenWidth * 0.015,
    borderTopWidth: screenWidth * 0.06,
    borderRightColor: 'transparent',
    borderTopColor: colors.border,
    transform: [{ rotate: '-30deg' }],
  },
  hexagonCornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: screenWidth * 0.015,
    borderTopWidth: screenWidth * 0.06,
    borderLeftColor: 'transparent',
    borderTopColor: colors.border,
    transform: [{ rotate: '30deg' }],
  },
  hexagonCornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: screenWidth * 0.015,
    borderBottomWidth: screenWidth * 0.06,
    borderRightColor: 'transparent',
    borderBottomColor: colors.border,
    transform: [{ rotate: '30deg' }],
  },
  hexagonCornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: screenWidth * 0.015,
    borderBottomWidth: screenWidth * 0.06,
    borderLeftColor: 'transparent',
    borderBottomColor: colors.border,
    transform: [{ rotate: '-30deg' }],
  },
  cornerError: {
    borderTopColor: colors.error,
    borderBottomColor: colors.error,
  },
  
  // Error & Focus States
  errorBorder: {
    borderColor: colors.error,
  },
  underlineError: {
    borderBottomColor: colors.error,
  },
  focusedBorder: {
    borderColor: colors.primary,
  },
  
  // Error Text
  errorText: {
    color: colors.error,
    fontSize: screenWidth * 0.035,
    marginTop: screenWidth * 0.02,
  },
  errorTextLeft: {
    textAlign: 'left',
  },
});

export default InputField;