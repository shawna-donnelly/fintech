import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
} from '@clerk/clerk-expo';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { Fragment, useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;

const Page = () => {
  const { phone, signin } = useLocalSearchParams<{
    phone: string;
    signin: string;
  }>();
  const [code, setCode] = React.useState('');
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    console.log('signin', signin);
    if (code.length === 6) {
      if (signin === 'true') {
        verifySignIn();
      } else {
        verifyCode();
      }
    }
  }, [code, signin]);

  const verifyCode = async () => {
    try {
      console.log('verifyCode', code);
      const signUpAttempt = await signUp?.attemptPhoneNumberVerification({
        code,
      });

      if (signUpAttempt?.status === 'complete') {
        await setActive?.({ session: signUpAttempt.createdSessionId });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (error) {
      console.log('errorrrrrr', JSON.stringify(error, null, 2));
      if (isClerkAPIResponseError(error)) {
        console.log('error.errors', error.errors);
        if (error.errors[0].code === 'invalid_code') {
          Alert.alert('Invalid code', 'The code you entered is incorrect');
        }
      }
    }
  };

  const verifySignIn = async () => {
    console.log('verifySignIn', code);
    try {
      await signIn?.attemptFirstFactor({
        strategy: 'phone_code',
        code,
      });
      await setActive?.({
        session: signIn?.createdSessionId,
      });
    } catch (error) {
      console.log('error', JSON.stringify(error, null, 2));
      if (isClerkAPIResponseError(error)) {
        if (error.errors[0].code === 'invalid_code') {
          Alert.alert('Invalid code', 'The code you entered is incorrect');
        }
      }
    }
  };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>6-digit code</Text>
      <Text style={defaultStyles.descriptionText}>
        Code sent to {phone} unless you already have an account
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        textContentType="oneTimeCode"
        keyboardType="number-pad"
        renderCell={({ index, symbol, isFocused }) => (
          <Fragment key={index}>
            <View
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
            >
              <Text style={styles.cellText}>
                {symbol || (index === 0 ? <Cursor /> : null)}
              </Text>
            </View>
            {index === 2 && (
              <View key={`separator-${index}`} style={styles.separator} />
            )}
          </Fragment>
        )}
      />
      <Link href="/login" asChild>
        <TouchableOpacity style={styles.link}>
          <Text style={defaultStyles.textLink}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity style={styles.button}>
        <Text style={defaultStyles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 12,
  },
  cell: {
    width: 45,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
  },
  focusCell: {
    borderColor: '#000',
    paddingBottom: 8,
  },
  link: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
  },
  cellText: {
    fontSize: 36,
    textAlign: 'center',
    color: 'black',
  },
  separator: {
    height: 2,
    width: 10,
    backgroundColor: Colors.gray,
    alignSelf: 'center',
  },
});
