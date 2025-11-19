import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
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

  enum SignInType {
    Phone = 'Phone',
    Email = 'Email',
    Google = 'Google',
    Apple = 'Apple',
  }

  const onSignIn = async ({ type }: { type: SignInType }) => {
    if (type === SignInType.Phone) {
      // Handle phone sign-in
    } else if (type === SignInType.Email) {
      // Handle email sign-in
    } else if (type === SignInType.Google) {
      // Handle Google sign-in
    } else if (type === SignInType.Apple) {
      // Handle Apple sign-in
    }
  };

  const CommunicationButton = ({
    type,
    icon,
  }: {
    type: SignInType;
    icon: keyof typeof Ionicons;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => onSignIn({ type })}
        style={[
          defaultStyles.pillButton,
          {
            flexDirection: 'row',
            gap: 16,
            marginTop: 20,
            backgroundColor: 'white',
          },
        ]}
      >
        <Ionicons name={icon} size={24} color="#black" style={{}} />
        <Text style={[defaultStyles.buttonText, { color: 'black' }]}>
          Continue with {type}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome back</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter the phone number associated with your account
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
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            !!phoneNumber ? styles.enabled : styles.disabled,
          ]}
          onPress={() => onSignIn({ type: SignInType.Phone })}
        >
          <Text style={defaultStyles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.socialLoginContainer}>
          <View style={styles.spacerLine} />
          <Text style={styles.socialText}>or</Text>
          <View style={styles.spacerLine} />
        </View>

        <CommunicationButton type={SignInType.Email} icon="mail" />
        <CommunicationButton type={SignInType.Google} icon="logo-google" />
        <CommunicationButton type={SignInType.Apple} icon="logo-apple" />
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
  socialLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  spacerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray,
  },
  socialText: {
    color: Colors.gray,
    fontSize: 20,
  },
});
