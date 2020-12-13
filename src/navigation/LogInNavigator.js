import {createStackNavigator} from 'react-navigation-stack';
import RegistrationScreen from '../screens/RegistrationScreen';
import LoginScreen from '../screens/LoginScreen';

const LogInNavigator = createStackNavigator(
  {
    Login: {screen: LoginScreen},
    Register: {screen: RegistrationScreen},
  },
  {
    initialRouteName: 'Login',
  },
);
export default LogInNavigator;
