// types/navigation.ts
import { StackNavigationProp } from '@react-navigation/stack';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Otp: { email: string; type?: string };
};

export type MainStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// Navigation props types
export type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;
export type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;
export type OtpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Otp'>;