import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Button,
  StyleSheet,
} from 'react-native';
// import {firebase} from '../../firebase/config';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import SensorsComponent from '../components/SensorsComponent';

export default function HomeScreen({navigation}) {
  // const myIcon = <Icon name="rocket" size={30} color="#900" />;

  // const [entityText, setEntityText] = useState('');
  // const [entities, setEntities] = useState([]);

  // const entityRef = firebase.firestore().collection('entities');
  // const userID = props.extraData.id;

  const screenWidth = Dimensions.get('window').width - 20;

  // useEffect(() => {
  //     entityRef
  //         .where("authorID", "==", userID)
  //         .orderBy('createdAt', 'desc')
  //         .onSnapshot(
  //             querySnapshot => {
  //                 const newEntities = []
  //                 querySnapshot.forEach(doc => {
  //                     const entity = doc.data()
  //                     entity.id = doc.id
  //                     newEntities.push(entity)
  //                 });
  //                 setEntities(newEntities)
  //             },
  //             error => {
  //                 console.log(error)
  //             }
  //         )
  // }, [])

  // const onAddButtonPress = () => {
  //     if (entityText && entityText.length > 0) {
  //         const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  //         const data = {
  //             text: entityText,
  //             authorID: userID,
  //             createdAt: timestamp,
  //         };
  //         entityRef
  //             .add(data)
  //             .then(_doc => {
  //                 setEntityText('')
  //                 Keyboard.dismiss()
  //             })
  //             .catch((error) => {
  //                 alert(error)
  //             });
  //     }
  // }

  // const renderEntity = ({item, index}) => {
  //     return (
  //         <View style={styles.entityContainer}>
  //             <Text style={styles.entityText}>
  //                 {index}. {item.text}
  //             </Text>
  //         </View>
  //     )
  // }

  const chartConfig = {
    fillShadowGradient: '#78D11A',
    fillShadowGradientOpacity: 1,
    backgroundGradientFrom: '#1A78D1',
    backgroundGradientTo: '#AF1AD2',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#fff',
    },
  };

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2, // optional
      },
    ],
    legend: ['Rainy Days'], // optional
  };

  const dataBar = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  const graphStyle = {
    marginVertical: 8,
    borderRadius: 16,
  };

  const dataPie = [
    {
      name: 'Seoul',
      population: 21500000,
      color: '#E02477',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Toronto',
      population: 2800000,
      color: '#E08F24',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Beijing',
      population: 527612,
      color: '#24E08F',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'New York',
      population: 8538000,
      color: '#2476E0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Moscow',
      population: 11920000,
      color: '#D3E024',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  const dataProgress = {
    labels: ['Swim', 'Bike', 'Run'], // optional
    data: [0.4, 0.6, 0.8],
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.graphs}>
            <Text>Bezier Line Chart</Text>
            <LineChart
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                ],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                    ],
                  },
                ],
              }}
              width={screenWidth} // from react-native
              height={220}
              yAxisLabel="$"
              yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />

            <Text> Line Chart</Text>
            <LineChart
              data={data}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              style={graphStyle}
            />

            <Text>Progress Chart</Text>
            <ProgressChart
              data={dataProgress}
              width={screenWidth}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={chartConfig}
              hideLegend={false}
              style={graphStyle}
            />
            {/* 
            <Text>Bar Chart</Text>
            <BarChart
              data={dataBar}
              width={screenWidth}
              height={220}
              yAxisLabel="$"
              verticalLabelRotation={30}
            /> */}

            <Text>Pie Chart</Text>
            <PieChart
              data={dataPie}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={graphStyle}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 30,
          }}>
          <Button
            title="Go to Settings"
            onPress={() => navigation.navigate('SettingScreen')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  graphs: {
    flex: 1,
    alignItems: 'center',
  },
  formContainer: {
    flexDirection: 'row',
    height: 80,
    marginTop: 40,
    marginBottom: 20,
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#788eec',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  listContainer: {
    marginTop: 20,
    padding: 20,
  },
  entityContainer: {
    marginTop: 16,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  entityText: {
    fontSize: 20,
    color: '#333333',
  },
});
