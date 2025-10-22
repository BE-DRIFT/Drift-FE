// screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import { 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  View,
  ToastAndroid 
} from 'react-native';
import { useDispatch } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';
import { loginUser } from '../../store/slices/authSlice';
import { useThemeColors } from '../../hooks/useThemeColors';
import { AppDispatch } from '../../store';
import Container from '../../components/common/Container';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const colors = useThemeColors();

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
    };

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, number and special character';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await dispatch(loginUser(formData)).unwrap();
      ToastAndroid.show('Login successful!', ToastAndroid.SHORT);
      // Navigation will be handled by Redux state change in AppNavigator
    } catch (error: any) {
      ToastAndroid.show(error || 'Login failed. Please try again.', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <Container safeArea paddingHorizontal={6} center={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <InputField
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            autoComplete="password"
            error={errors.password}
            isPassword={true}
            withEye={true}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            variant="primary"
            size="medium"
            loading={loading}
            disabled={loading}
            style={styles.button}
          />

          <Button
            title="Create New Account"
            onPress={() => navigation.navigate('Signup')}
            variant='text'
            size="small"
            style={styles.secondaryButton}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: screenWidth * 0.06,
    paddingVertical: screenHeight * 0.02,
  },
  title: {
    fontSize: screenWidth * 0.08,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: screenHeight * 0.01,
    color: colors.text,
  },
  subtitle: {
    fontSize: screenWidth * 0.045,
    textAlign: 'center',
    marginBottom: screenHeight * 0.06,
    color: colors.textSecondary,
  },
  button: {
    marginTop: screenHeight * 0.02,
    marginBottom: screenHeight * 0.02,
  },
  secondaryButton: {
    marginTop: screenHeight * 0.01,
    alignSelf: "flex-end"
  },
});

export default LoginScreen;