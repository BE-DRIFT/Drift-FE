// components/common/Container.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ViewProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useThemeColors } from '../../hooks/useThemeColors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  safeArea?: boolean;
  center?: boolean;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  style?: any;
}

const Container: React.FC<ContainerProps> = ({
  children,
  safeArea = false,
  center = false,
  padding = 0,
  paddingHorizontal = 0,
  paddingVertical = 0,
  style,
  ...props
}) => {
  const colors = useThemeColors();

  const styles = createStyles();

  const getPaddingStyles = () => {
    const styles: any = {};
    
    if (padding) {
      styles.padding = screenWidth * (padding / 100);
    }
    
    if (paddingHorizontal) {
      styles.paddingHorizontal = screenWidth * (paddingHorizontal / 100);
    }
    
    if (paddingVertical) {
      styles.paddingVertical = screenHeight * (paddingVertical / 100);
    }
    
    return styles;
  };

  const containerStyle = [
    styles.container,
    center && styles.center,
    getPaddingStyles(),
    style,
  ];

  const gradientColors = colors.backgroundGradient || [colors.background, colors.background];

  const Content = (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={containerStyle} {...props}>
        {children}
      </View>
    </LinearGradient>
  );

  if (safeArea) {
    return <SafeAreaView style={styles.flex}>{Content}</SafeAreaView>;
  }

  return Content;
};

const createStyles = () => StyleSheet.create({
  flex: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Container;