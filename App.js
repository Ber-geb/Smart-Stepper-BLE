import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
// import {createStackNavigator} from '@react-navigation/stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import LogInNavigator from './src/navigation/LogInNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import {Setting} from './src/navigation/AppNavigator';
// import {
//   LoginScreen,
//   HomeScreen,
//   RegistrationScreen,
//   SettingScreen,
//   ChangeEmail,
//   ChangeName,
//   ChangePassword,
// } from './src/screens';
// import AppContainer from './src/navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {firebase} from './src/firebase/config';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {decode, encode} from 'base-64';
import {SafeAreaProvider} from 'react-native-safe-area-context';
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

//Exporting Navigator
const Navigator = createAppContainer(
  createSwitchNavigator(
    {
      loginNav: LogInNavigator,
      mainNav: AppNavigator,
    },
    {
      initialRouteName: 'loginNav',
    },
  ),
);

export default function App() {
  // const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  // // Handle user state changes
  // function onAuthStateChanged(user) {
  //   const db = firestore().collection('users');
  //   if (user) {
  //     setLoggedIn(true);
  //     console.log(loggedIn);
  //     db.doc(user.uid)
  //       .get()
  //       .then((document) => {
  //         // const userData = document.data();
  //         // setLoading(false);
  //         // setUser(userData);
  //         // setUser(user);
  //       })
  //       .catch((error) => {
  //         // setLoading(false);
  //       });
  //   } else {
  //     setLoggedIn(false);
  //     // setLoading(false);
  //   }
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // }

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber; // unsubscribe on unmount
  // }, []);

  // if (initializing) return null;

  // if (!user) {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     {loggedIn ? (
    //       <>
    //         <Stack.Screen
    //           name="SensorsComponent"
    //           component={SensorsComponent}
    //         />
    //         <Stack.Screen name="Home" component={HomeScreen} />
    //       </>
    //     ) : (
    //       <>
    //         <Stack.Screen name="Login" component={LoginScreen} />
    //         <Stack.Screen name="Registration" component={RegistrationScreen} />
    //       </>
    //     )}
    //   </Stack.Navigator>
    // </NavigationContainer>
    <SafeAreaProvider>
      <Navigator />
    </SafeAreaProvider>
  );
  // }

  // return (
  //   <View>
  //     <Text>Welcome {user.email}</Text>
  //   </View>
  // );

  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator>
  //       {loggedIn ? (
  //         <>
  //           <Stack.Screen name="Home" component={HomeScreen} />
  //           {/* {(props) => <HomeScreen {...props} extraData={user} />}
  //           </Stack.Screen> */}
  //           <Stack.Screen name="Settings" component={SettingScreen} />
  //           {/* {(props) => <SettingScreen {...props} extraData={user} />}
  //           </Stack.Screen> */}
  //           <Stack.Screen name="Change Email" component={ChangeEmail} />
  //           <Stack.Screen name="Change Name" component={ChangeName} />
  //           <Stack.Screen name="Change Password" component={ChangePassword} />
  //         </>
  //       ) : (
  //         <>
  //           <Stack.Screen name="Login" component={LoginScreen} />
  //           <Stack.Screen name="Registration" component={RegistrationScreen} />
  //         </>
  //       )}
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
}

// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
// } from 'react-native';

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// const App: () => React$Node = () => {
//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.scrollView}>
//           <Header />
//           {global.HermesInternal == null ? null : (
//             <View style={styles.engine}>
//               <Text style={styles.footer}>Engine: Hermes</Text>
//             </View>
//           )}
//           <View style={styles.body}>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Step One</Text>
//               <Text style={styles.sectionDescription}>
//                 Edit <Text style={styles.highlight}>App.js</Text> to change this
//                 screen and then come back to see your edits.
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>See Your Changes</Text>
//               <Text style={styles.sectionDescription}>
//                 <ReloadInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Debug</Text>
//               <Text style={styles.sectionDescription}>
//                 <DebugInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Learn More</Text>
//               <Text style={styles.sectionDescription}>
//                 Read the docs to discover what to do next:
//               </Text>
//             </View>
//             <LearnMoreLinks />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

// export default App;
