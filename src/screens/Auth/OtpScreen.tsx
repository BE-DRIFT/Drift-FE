// screens/auth/OtpScreen.tsx
import React, { useState, useRef } from 'react';
import { 
  Text, 
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
import { verifyOTP, resendOTP } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import OTPInput from '../../components/common/OTPInput';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = StackScreenProps<AuthStackParamList, 'Otp'>;

const OtpScreen: React.FC<Props> = ({ navigation, route }) => {
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const dispatch = useDispatch<AppDispatch>();
  const colors = useThemeColors();

  const { email, type = 'signup' } = route.params;

  const handleOtpChange = (code: string) => {
    setOtp(code);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      ToastAndroid.show('Please enter a valid 6-digit OTP', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);

    try {
      await dispatch(verifyOTP({ email, otp, type })).unwrap();
      ToastAndroid.show('OTP verified successfully!', ToastAndroid.SHORT);
      // Navigation will be handled by Redux state change in AppNavigator
    } catch (error: any) {
      ToastAndroid.show(error || 'OTP verification failed', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    
    try {
      await dispatch(resendOTP({ email, type })).unwrap();
      ToastAndroid.show('OTP sent successfully to your email', ToastAndroid.SHORT);
      setCountdown(60);
      startCountdown();
    } catch (error: any) {
      ToastAndroid.show(error || 'Failed to resend OTP', ToastAndroid.LONG);
    } finally {
      setResendLoading(false);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  React.useEffect(() => {
    startCountdown();
  }, []);

  const styles = createStyles(colors);

  return (
    <Container safeArea paddingHorizontal={6}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to
          </Text>
          <Text style={styles.email}>{email}</Text>

          <OTPInput
            code={otp}
            onCodeChange={handleOtpChange}
            length={6}
            style={styles.otpContainer}
          />

          <Button
            title="Verify OTP"
            onPress={handleVerifyOtp}
            variant="primary"
            size="medium"
            loading={loading}
            disabled={loading || otp.length !== 6}
            style={styles.button}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the code? 
            </Text>
            <Button
              title={resendLoading ? 'Sending...' : 
                     countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              onPress={handleResendOtp}
              variant="text"
              size="small"
              disabled={resendLoading || countdown > 0}
              style={styles.resendButton}
            />
          </View>

          <Button
            title="Back to Sign Up"
            onPress={() => navigation.goBack()}
            variant="text"
            size="small"
            style={styles.backButton}
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
    fontSize: screenWidth * 0.04,
    textAlign: 'center',
    marginBottom: screenHeight * 0.01,
    color: colors.textSecondary,
    lineHeight: screenHeight * 0.03,
  },
  email: {
    fontSize: screenWidth * 0.045,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: screenHeight * 0.04,
    color: colors.primary,
  },
  otpContainer: {
    marginBottom: screenHeight * 0.04,
  },
  button: {
    marginTop: screenHeight * 0.02,
    marginBottom: screenHeight * 0.03,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenHeight * 0.03,
    flexWrap: 'wrap',
  },
  resendText: {
    fontSize: screenWidth * 0.035,
    color: colors.textSecondary,
    marginRight: 5,
  },
  resendButton: {
    margin: 0,
    padding: 0,
  },
  backButton: {
    marginTop: screenHeight * 0.01,
  },
});

export default OtpScreen;