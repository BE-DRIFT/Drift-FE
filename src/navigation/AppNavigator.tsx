// navigation/AppNavigator.tsx
import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { getCurrentUser } from '../store/slices/authSlice';
import { RootStackParamList } from '../types/navigation';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTheme } from '../theme/ThemeContext';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, token, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { isDark } = useTheme();
  const colors = useThemeColors();

  useEffect(() => {
    // Check if user is already authenticated (e.g., token exists in storage)
    if (token) {
      dispatch(getCurrentUser(token));
    }
  }, [dispatch, token]);

  // Custom theme based on our colors
  const CustomTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };

  // Show loading screen while checking authentication
  // if (isLoading) {
  //   return (
  //     <NavigationContainer theme={CustomTheme}>
  //       {/* You can add a loading screen component here */}
  //     </NavigationContainer>
  //   );
  // }

  return (
    <NavigationContainer theme={CustomTheme}>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: colors.background }
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;