// components/common/OTPInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TextStyle,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';

const { width: screenWidth } = Dimensions.get('window');

interface OTPInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  length?: number;
  style?: ViewStyle;
}

const OTPInput: React.FC<OTPInputProps> = ({
  code,
  onCodeChange,
  length = 6,
  style,
}) => {
  const colors = useThemeColors();
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<Array<TextInput>>([]);

  const styles = createStyles(colors);

  useEffect(() => {
    // Focus first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleTextChange = (text: string, index: number) => {
    const newCode = code.split('');
    
    if (text.length > 1) {
      // Handle paste
      const pastedText = text.slice(0, length);
      onCodeChange(pastedText);
      
      // Focus last input
      const lastIndex = Math.min(pastedText.length - 1, length - 1);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    newCode[index] = text;
    const newCodeString = newCode.join('').slice(0, length);
    onCodeChange(newCodeString);

    // Auto focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Move focus to previous input on backspace
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.inputContainer,
            focusedIndex === index && styles.inputContainerFocused,
            code[index] && styles.inputContainerFilled,
          ]}
        >
          <TextInput
            ref={ref => {
              if (ref) {
                inputRefs.current[index] = ref;
              }
            }}
            style={styles.input}
            value={code[index] || ''}
            onChangeText={text => handleTextChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            keyboardType="number-pad"
            maxLength={index === 0 ? length : 1}
            selectTextOnFocus
            textContentType="oneTimeCode"
          />
        </View>
      ))}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.14,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  inputContainerFilled: {
    borderColor: colors.primary,
  },
  input: {
    fontSize: screenWidth * 0.06,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
});

export default OTPInput;