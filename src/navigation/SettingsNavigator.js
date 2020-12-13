import {createStackNavigator} from 'react-navigation-stack';
// import RegistrationScreen from '../screens/RegistrationScreen';
import ChangeEmail from '../screens/ChangeEmail';
import ChangePassword from '../screens/ChangePassword';
import ChangeName from '../screens/ChangeName';
import SettingScreen from '../screens/SettingScreen';

const SettingsNavigator = createStackNavigator(
  {
    Setting: {screen: SettingScreen},
    Email: {screen: ChangeEmail},
    Name: {screen: ChangeName},
    Password: {screen: ChangePassword},
  },
  {
    initialRouteName: 'Setting',
  },
);
export default SettingsNavigator;
