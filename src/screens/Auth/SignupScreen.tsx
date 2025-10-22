// screens/auth/SignupScreen.tsx
import React, { useState } from 'react';
import { 
  Text, 
  Alert, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  View,
  ToastAndroid 
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { AuthStackParamList } from '../../types/navigation';
import { useThemeColors } from '../../hooks/useThemeColors';
import { signupUser } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';
import Container from '../../components/common/Container';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = StackScreenProps<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const colors = useThemeColors();

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

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

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await dispatch(signupUser(formData)).unwrap();
      
      ToastAndroid.show('Account created successfully! OTP sent to your email.', ToastAndroid.LONG);
      
      navigation.navigate('Otp', { 
        email: formData.email,
        type: 'signup'
      });
    } catch (error: any) {
      ToastAndroid.show(error || 'Signup failed. Please try again.', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <Container safeArea padding={6}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
        
        <InputField
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
          autoComplete="name"
          error={errors.name}
        />
        
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
          placeholder="Create a password"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
          autoComplete="password-new"
          error={errors.password}
        />
        
        <InputField
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
          secureTextEntry
          autoComplete="password-new"
          error={errors.confirmPassword}
        />
        
        <Button
          title="Create Account"
          onPress={handleSignup}
          variant="primary"
          size="medium"
          loading={loading}
          disabled={loading}
          style={styles.button}
        />

        
        <Button
          title="Already have an account? Sign In"
          onPress={() => navigation.navigate('Login')}
          variant="text"
          size="small"
          style={styles.secondaryButton}
        />
      </ScrollView>
    </Container>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: screenWidth * 0.06,
    paddingVertical: screenHeight * 0.03,
  },
  title: {
    fontSize: screenWidth * 0.08,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: screenHeight * 0.01,
    marginTop: screenHeight * 0.02,
    color: colors.text,
  },
  subtitle: {
    fontSize: screenWidth * 0.045,
    textAlign: 'center',
    marginBottom: screenHeight * 0.04,
    color: colors.textSecondary,
  },
  button: {
    marginTop: screenHeight * 0.02,
    marginBottom: screenHeight * 0.02,
  },
  secondaryButton: {
    marginTop: screenHeight * 0.01,
    marginBottom: screenHeight * 0.03,
  },
});

export default SignupScreen;