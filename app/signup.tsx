import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Page = () => {
  const [countryCode, setCountryCode] = React.useState('+1');
  const [phoneNumber, setPhoneNumber] = React.useState('');

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;

  const router = useRouter();
  const { signUp } = useSignUp();

  const onSignUp = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    try {
      await signUp?.create({
        phoneNumber: fullPhoneNumber,
      });
      await signUp?.preparePhoneNumberVerification({ strategy: 'phone_code' });

      router.push({
        pathname: '/verify/[phone]',
        params: { phone: fullPhoneNumber },
      });
    } catch (error) {
      console.error('Error signing up:', error);

      if (isClerkAPIResponseError(error)) {
        const errorCode = error.errors[0]?.code;
        const errorMessage = error.errors[0]?.message;

        // Handle specific error cases
        if (errorCode === 'form_identifier_exists') {
          Alert.alert(
            'Phone number already exists',
            'This phone number is already registered. Please sign in instead.'
          );
        } else if (
          errorMessage?.includes('requiredFields') ||
          errorCode === 'form_param_format_invalid'
        ) {
          Alert.alert(
            'Configuration Error',
            'Phone-only signup is not enabled in your Clerk dashboard. Please enable phone number authentication and make email optional in your Clerk dashboard settings.'
          );
        } else {
          Alert.alert(
            'Sign up failed',
            errorMessage ||
              'An error occurred during sign up. Please try again.'
          );
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get started!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number. We will send you a confirmation code there.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Country Code"
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
            value={countryCode}
            onChangeText={setCountryCode}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Mobile number"
            keyboardType="phone-pad"
            placeholderTextColor={Colors.gray}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        <Link href="/login" replace onPress={onSignUp}>
          <Text style={defaultStyles.textLink}>
            Already have an account? Log in
          </Text>
        </Link>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            !!phoneNumber ? styles.enabled : styles.disabled,
          ]}
          onPress={onSignUp}
        >
          <Text style={defaultStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Page;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: 'row',
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
    marginVertical: 20,
  },
  disabled: {
    backgroundColor: Colors.lightGray,
    marginVertical: 20,
  },
});
