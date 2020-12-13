import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
  Alert,
  Modal,
  SafeAreaConsumer,
  Button,
} from 'react-native';
// import {LinearGradient} from 'expo-linear-gradient';
// import PasswordModal from '../PasswordModal.js';
// import firebase from 'firebase';
// import 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ChangeEmail({navigation}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSuccess = () => {
    setCurrentPassword('');
    setNewEmail('');
    setError('');
    setLoading(false);

    console.log('Change Email: Success');
    navigation.goBack();
  };

  const onFailure = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const renderLoading = () => {
    if (loading) {
      return (
        <View
          style={{
            marginTop: 10,
            backgroundColor: 'white',
          }}>
          <ActivityIndicator size={'small'} />
        </View>
      );
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 20,
        }}
        behavior="padding">
        <StatusBar barStyle="dark-content" />
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="New Email"
            placeholderTextColor="#B1B1B1"
            returnKeyType="done"
            textContentType="emailAddress"
            value={newEmail}
            onChangeText={(newEmail) => setNewEmail(newEmail)}
          />
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            placeholderTextColor="#B1B1B1"
            returnKeyType="done"
            textContentType="password"
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={(currentPassword) =>
              setCurrentPassword(currentPassword)
            }
          />
        </View>
        {renderLoading()}
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: 'red',
            width: '80%',
          }}>
          {error}
        </Text>
        <Button
          title="Save"
          style={{width: '86%', marginTop: 10}}
          onPress={() => {
            setError('');
            setLoading(true);
            const user = auth().currentUser;
            console.log(user);
            const credential = auth.EmailAuthProvider.credential(
              user.email,
              currentPassword,
            );
            user
              .reauthenticateWithCredential(credential)
              .then(() => {
                user
                  .updateEmail(newEmail.trim())
                  .then(() => {
                    firestore()
                      .collection('users')
                      .doc(user.uid)
                      .set({email: newEmail}, {merge: true});
                    onSuccess();
                    return Alert.alert('Your Email has Successfully Changed!');
                  })
                  .catch((error) => {
                    let errorMessage = error.message;
                    onFailure.bind(this)(errorMessage);
                  });
              })
              .catch((error) => {
                let errorMessage = error.message;
                onFailure.bind(this)(errorMessage);
              });
          }}>
          {/* <LinearGradient
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
              Save
            </Text>
          </LinearGradient> */}
          {/* <Text>Save</Text> */}
        </Button>
        {/* <PasswordModal /> */}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

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
    borderRadius: 15,
  },
});
