import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Platform,
  RefreshControl,
  Switch,
} from 'react-native';
import {SettingsScreen} from 'react-native-settings-screen';
// import {firebase} from '../../firebase/config';
// import 'firebase/firestore';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SettingsNavigator from '../navigation/SettingsNavigator';

const fontFamily = Platform.OS === 'ios' ? 'Avenir' : 'sans-serif';

export default function SettingScreen({navigation}) {
  const db = firestore();
  const uid = auth().currentUser.uid;
  const [refreshing, setRefreshing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // db.doc(`/users/${uid}`)
    //   .get()
    //   .then((doc) => {
    //     if (doc.exists) {
    //       setDisplayName(`${doc.data().fullName}`);
    //       setUserEmail(`${doc.data().email}`);
    //     }
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });

    // db.doc(`${uid}`)
    //   .get()
    //   .then((doc) => {
    //     if (doc.exists) {
    //       console.log(`${doc.data().id}`);
    //     }
    //   });

    // db.where('id', '==', uid)
    //   .orderBy('createdAt', 'desc')
    //   .onSnapshot(
    //     (querySnapshot) => {
    //       querySnapshot.forEach((doc) => {
    //         setDisplayName(`${doc.data().testVal}`);
    //         // setUserEmail(`${doc.data().email}`);
    //       });
    //     },
    //     (error) => {
    //       console.log(error);
    //     },
    //   );
    // }, [uid, refreshing]);

    db.collection('users')
      .doc(`${uid}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setDisplayName(`${doc.data().fullName}`);
          setUserEmail(`${doc.data().email}`);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [uid, refreshing]);

  const renderHero = () => (
    <View style={styles.heroContainer}>
      <Image
        source={require('../../assets/default-profile-picture.png')}
        style={styles.heroImage}
      />
      <View style={{flex: 1}}>
        <Text style={styles.heroTitle}>{displayName}</Text>
        <Text style={styles.heroSubtitle}>{userEmail}</Text>
      </View>
    </View>
  );

  const settingsData = [
    {type: 'CUSTOM_VIEW', key: 'hero', render: renderHero},
    {
      type: 'SECTION',
      header: 'Account'.toUpperCase(),
      rows: [
        {
          title: 'Change Name',
          showDisclosureIndicator: true,
          onPress: () => navigation.navigate('Name'),
        },
        {
          title: 'Change Password',
          showDisclosureIndicator: true,
          onPress: () => navigation.navigate('Password'),
        },
        {
          title: 'Change Email',
          showDisclosureIndicator: true,
          onPress: () => navigation.navigate('Email'),
        },
      ],
    },
    {
      type: 'SECTION',
      rows: [
        {
          title: 'Log Out',
          showDisclosureIndicator: true,
          titleStyle: {
            color: 'red',
          },
          onPress: () => {
            // firebase.auth().signOut();
            auth()
              .signOut()
              .then(() => console.log('User signed out!'))
              .then(navigation.navigate('Login'));
          },
        },
      ],
    },
    {
      type: 'CUSTOM_VIEW',
      render: () => (
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 18,
            color: '#999',
            marginBottom: 40,
            marginTop: -30,
            fontFamily,
          }}>
          v1.2.3
        </Text>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SettingsScreen
        data={settingsData}
        globalTextStyle={{fontFamily}}
        scrollViewProps={{
          refreshControl: (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                setTimeout(() => setRefreshing(false), 3000);
              }}
            />
          ),
        }}
      />
    </View>
  );
}

const statusBarHeight = Platform.OS === 'ios' ? 35 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    backgroundColor: '#8c231c',
    height: 44 + statusBarHeight,
    alignSelf: 'stretch',
    paddingTop: statusBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarTitle: {
    color: 'white',
    fontFamily,
    fontSize: 17,
  },
  heroContainer: {
    marginTop: 40,
    marginBottom: 50,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    flexDirection: 'row',
  },
  heroImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'black',
    marginHorizontal: 20,
  },
  heroTitle: {
    fontFamily,
    color: 'black',
    fontSize: 24,
  },
  heroSubtitle: {
    fontFamily,
    color: '#999',
    fontSize: 14,
  },
});
