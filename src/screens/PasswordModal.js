import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Modal,
} from 'react-native';
import firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

export default function PasswordModal() {
  const [modalError, handleModalError] = useState('');
  const [forgetPassword, setForgetPassword] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const goToForgotPassword = () => {
    setForgetPassword(true);
  };

  const leaveForgotPassword = () => {
    setForgetPassword(false);
  };

  const styles = StyleSheet.create({
    form: {
      width: '86%',
      marginTop: 15,
    },
    logo: {
      marginTop: 20,
    },
    input: {
      fontSize: 20,
      borderColor: '#707070',
      borderBottomWidth: 1,
      paddingBottom: 1.5,
      marginTop: 25.5,
    },
    button: {
      backgroundColor: '#3A559F',
      // backgroundColor: '#1877f2', brighter blue color
      height: 44,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 22,
    },
  });

  // function handleClose() {
  //   handleModalError("");
  // }

  return (
    <Animated.View>
      <Modal
        // onDismiss={handleClose}
        animationType="slide"
        transparent={true}
        visible={forgetPassword}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <TouchableWithoutFeedback
            onPress={leaveForgotPassword}
            accessible={false}>
            <KeyboardAvoidingView
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 22,
              }}
              behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
              <View
                style={{
                  margin: 20,
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 35,
                  alignItems: 'center',
                  shadowColor: '#00000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  width: '86%',
                }}>
                <Text
                  style={{
                    marginBottom: 5,
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  Forget Password?
                </Text>
                <Text
                  style={{
                    marginBottom: 15,
                    textAlign: 'center',
                    fontSize: 15,
                  }}>
                  Enter your email address below
                </Text>
                <View style={styles.form}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#B1B1B1"
                    returnKeyType="next"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={(email) => setEmail(email)}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: 'center',
                    color: 'red',
                    width: '80%',
                    marginTop: 10,
                  }}>
                  {modalError}
                </Text>
                <TouchableOpacity
                  style={{width: '86%', marginTop: 10}}
                  onPress={() => {
                    firebase
                      .auth()
                      .sendPasswordResetEmail(email)
                      .then(function () {
                        Alert.alert('We sent you an email');
                        console.log('Reset email sent');
                        handleModalError('');
                      })
                      .catch((error) => {
                        setError(error.message);
                        handleModalError(error.message);
                      });
                  }}>
                  <LinearGradient
                    colors={['#FF170B', '#D50B00']}
                    style={styles.button}
                    start={{x: 0, y: 0.5}}
                    end={{x: 1, y: 0.5}}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                      }}>
                      Reset Password
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </TouchableWithoutFeedback>
      </Modal>
      <Text
        style={{
          fontWeight: '300',
          fontSize: 18,
          textAlign: 'center',
          marginTop: 5,
          textDecorationLine: 'underline',
          color: '#BA0900',
        }}
        onPress={goToForgotPassword}>
        Forgot your password?
      </Text>
    </Animated.View>
  );
}
