import {utils} from '@react-native-firebase/app';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
  AppState,
  FlatList,
  Dimensions,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
// import ChartView from 'react-native-highcharts-wrapper';
// import FusionCharts from 'react-native-fusioncharts';
// import RealTimeGraph from './RealTimeGraph';
import moment from 'moment';
import {VictoryLine, VictoryChart, VictoryTheme} from 'victory-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 20;

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const chartConfig = {
  fillShadowGradient: '#78D11A',
  fillShadowGradientOpacity: 1,
  backgroundGradientFrom: '#1A78D1',
  backgroundGradientTo: '#AF1AD2',
  decimalPlaces: 5, // optional, defaults to 2dp
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

const db = firestore().collection('users');

export default class SensorsComponent extends Component {
  constructor() {
    super();

    this.state = {
      scanning: false,
      peripherals: new Map(),
      appState: '',
      notPressed: true,
      serviceImuUUID: '',
      servicePressureUUID: '',
      charAccelUUID: '',
      charGyroUUID: '',
      charFslpUUID: '',
      charFsrUUID: '',
      stopRead: false,
      ax: [0, 0, 0, 0, 0],
      ay: [0, 0, 0, 0, 0],
      az: [0, 0, 0, 0, 0],
      aa: [0, 0, 0, 0, 0],
      gx: [0, 0, 0, 0, 0],
      gy: [0, 0, 0, 0, 0],
      gz: [0, 0, 0, 0, 0],
      ag: [0, 0, 0, 0, 0],
      fslpPressure: [0, 0, 0, 0, 0],
      fslpPosition: [0, 0, 0, 0, 0],
      fsrPressure1: [0, 0, 0, 0, 0],
      fsrPressure2: [0, 0, 0, 0, 0],
      timer: [0, 0, 0, 0, 0],
    };
    this.quickRead = this.quickRead.bind(this);
    // this.HighChart = this.HighChart.bind(this);
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(
      this,
    );
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(
      this,
    );
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  intervals = [];

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    BleManager.start({showAlert: false});

    this.handlerDiscover = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      this.handleDiscoverPeripheral,
    );
    this.handlerStop = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      this.handleStopScan,
    );
    this.handlerDisconnect = bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      this.handleDisconnectedPeripheral,
    );
    this.handlerUpdate = bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      this.handleUpdateValueForCharacteristic,
    );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      )
        .then((result) => {
          if (result) {
            console.log('Permission is OK');
          } else {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ).then((result) => {
              if (result) {
                console.log('User accept');
              } else {
                console.log('User refuse');
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  handleAppStateChange(nextAppState) {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    this.setState({appState: nextAppState});
  }

  componentWillUnmount() {
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
    for (let i = 0; i < this.intervals.length; ++i) {
      clearInterval(this.intervals[i]);
    }
    this.setState = () => {
      return; //Return null when escaping component, it will no longer hold any data in memory
    };
  }

  handleDisconnectedPeripheral(data) {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({peripherals});
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  handleUpdateValueForCharacteristic(data) {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value,
    );
  }

  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({scanning: false});
  }

  startScan() {
    if (!this.state.scanning) {
      //this.setState({peripherals: new Map()});
      BleManager.scan([], 10, true).then((results) => {
        console.log('Scanning...');
        this.setState({scanning: true});
      });
    }
  }

  retrieveConnected() {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals');
      }
      console.log(results);
      var peripherals = this.state.peripherals;
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        this.setState({peripherals});
      }
    });
  }

  delay(t, v) {
    return new Promise(function (resolve) {
      setTimeout(resolve.bind(null, v), t);
    });
  }

  handleDiscoverPeripheral(peripheral) {
    var peripherals = this.state.peripherals;
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    this.setState({peripherals});
  }

  test(peripheral) {
    BleManager.connect(peripheral.id).then(() => {
      let peripherals = this.state.peripherals;
      let p = peripherals.get(peripheral.id);
      if (p) {
        p.connected = true;
        peripherals.set(peripheral.id, p);
        this.setState({peripherals});
      }
      console.log('Connected to ' + peripheral.id);

      BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
        // Success code
        console.log('Peripheral info:', peripheralInfo);
        console.log('Imu Service: ', peripheralInfo.services[2].uuid);
        console.log('Pressure Service: ', peripheralInfo.services[3].uuid);
        console.log('Characteristics: ', peripheralInfo.characteristics);
        console.log(
          'Characteristic Accel: ',
          peripheralInfo.characteristics[3].characteristic,
        );
        console.log(
          'Characteristic Gyro: ',
          peripheralInfo.characteristics[4].characteristic,
        );
        console.log(
          'Characteristic FSLP: ',
          peripheralInfo.characteristics[5].characteristic,
        );
        console.log(
          'Characteristic FSR: ',
          peripheralInfo.characteristics[6].characteristic,
        );

        this.setState((prevState) => {
          return {
            ...prevState,
            serviceImuUUID: peripheralInfo.services[2].uuid,
            servicePressureUUID: peripheralInfo.services[3].uuid,
            charAccelUUID: peripheralInfo.characteristics[3].characteristic,
            charGyroUUID: peripheralInfo.characteristics[4].characteristic,
            charFslpUUID: peripheralInfo.characteristics[5].characteristic,
            charFsrUUID: peripheralInfo.characteristics[6].characteristic,
          };
        });

        this.loop(peripheral);
      });
    });
  }

  async quickRead(peripheral) {
    let gyroData = '';
    let accelData = '';
    let fslpData = '';
    let fsrData = '';
    let qRax = this.state.ax;
    let qRay = this.state.ay;
    let qRaz = this.state.az;
    let qRaa = this.state.aa;
    let qRgx = this.state.gx;
    let qRgy = this.state.gy;
    let qRgz = this.state.gz;
    let qRag = this.state.ag;
    let qRfslpPressure = this.state.fslpPressure;
    let qRfslpPosition = this.state.fslpPosition;
    let qRfsrPressure1 = this.state.fsrPressure1;
    let qRfsrPressure2 = this.state.fsrPressure2;
    let timer = this.state.timer;

    timer.push(moment().format('h:mm:ss'));
    timer.shift();

    BleManager.read(
      peripheral.id,
      this.state.serviceImuUUID,
      this.state.charAccelUUID,
    )
      .then((readData) => {
        console.log('Read Accel: ', readData);
        accelData = readData;

        const accelBuffer = new ArrayBuffer(16);
        // Create a data view of it
        var accelView = new DataView(accelBuffer);

        // set bytes
        accelData.forEach(function (b, i) {
          accelView.setUint8(i, b);
        });

        qRax.push(new DataView(accelBuffer).getFloat32(0, true));
        qRax.shift();
        qRay.push(new DataView(accelBuffer).getFloat32(4, true));
        qRay.shift();
        qRaz.push(new DataView(accelBuffer).getFloat32(8, true));
        qRaz.shift();
        qRaa.push(new DataView(accelBuffer).getFloat32(12, true));
        qRaa.shift();
      })
      .then(() => {
        return this.delay(100).then(() => {
          return BleManager.read(
            peripheral.id,
            this.state.serviceImuUUID,
            this.state.charGyroUUID,
          ).then((readGyroData) => {
            console.log('Read Gyro: ', readGyroData);
            gyroData = readGyroData;

            const gyroBuffer = new ArrayBuffer(16);
            // Create a data view of it
            var gyroView = new DataView(gyroBuffer);

            // set bytes
            gyroData.forEach(function (b, i) {
              gyroView.setUint8(i, b);
            });

            qRgx.push(new DataView(gyroBuffer).getFloat32(0, true));
            qRgx.shift();
            qRgy.push(new DataView(gyroBuffer).getFloat32(4, true));
            qRgy.shift();
            qRgz.push(new DataView(gyroBuffer).getFloat32(8, true));
            qRgz.shift();
            qRag.push(new DataView(gyroBuffer).getFloat32(12, true));
            qRag.shift();
          });
        });
      })
      .then(() => {
        return this.delay(100)
          .then(() => {
            return (
              BleManager.read(
                peripheral.id,
                this.state.servicePressureUUID,
                this.state.charFslpUUID,
              )
                .then((readFslpData) => {
                  console.log('Read FSLP: ', readFslpData);
                  fslpData = readFslpData;

                  const fslpBuffer = new ArrayBuffer(8);
                  // Create a data view of it
                  var fslpView = new DataView(fslpBuffer);

                  // set bytes
                  fslpData.forEach(function (b, i) {
                    fslpView.setUint8(i, b);
                  });

                  qRfslpPressure.push(
                    new DataView(fslpBuffer).getInt32(0, true),
                  );
                  qRfslpPressure.shift();
                  qRfslpPosition.push(
                    new DataView(fslpBuffer).getInt32(4, true),
                  );
                  qRfslpPosition.shift();
                })
                // })
                .then(() => {
                  return this.delay(100)
                    .then(() => {
                      return BleManager.read(
                        peripheral.id,
                        this.state.servicePressureUUID,
                        this.state.charFsrUUID,
                      ).then((readFsrData) => {
                        console.log('Read FSR: ', readFsrData);
                        fsrData = readFsrData;

                        const fsrBuffer = new ArrayBuffer(8);
                        // Create a data view of it
                        var fsrView = new DataView(fsrBuffer);

                        // set bytes
                        fsrData.forEach(function (b, i) {
                          fsrView.setUint8(i, b);
                        });

                        qRfsrPressure1.push(
                          new DataView(fsrBuffer).getInt32(0, true),
                        );
                        qRfsrPressure1.shift();
                        qRfsrPressure2.push(
                          new DataView(fsrBuffer).getInt32(4, true),
                        );
                        qRfsrPressure2.shift();

                        this.setState((prevState) => {
                          return {
                            ...prevState,
                            ax: qRax,
                            ay: qRay,
                            az: qRaz,
                            aa: qRaa,
                            gx: qRgx,
                            gy: qRgy,
                            gz: qRgz,
                            ag: qRag,
                            fslpPressure: qRfslpPressure,
                            fslpPosition: qRfslpPosition,
                            fsrPressure1: qRfsrPressure1,
                            fsrPressure2: qRfsrPressure2,
                            timer,
                          };
                        });

                        console.log('ax: ', this.state.ax);
                        console.log('ay: ', this.state.ay);
                        console.log('az: ', this.state.az);
                        console.log('aa: ', this.state.aa);

                        console.log('gx: ', this.state.gx);
                        console.log('gy: ', this.state.gy);
                        console.log('gz: ', this.state.gz);
                        console.log('ag: ', this.state.ag);

                        console.log('fslpPressure: ', this.state.fslpPressure);
                        console.log('fslpPosition: ', this.state.fslpPosition);

                        console.log('fsrPressure1: ', this.state.fsrPressure1);
                        console.log('fsrPressure2: ', this.state.fsrPressure2);

                        // Store data into firestore db

                        let docData = {
                          ax: this.state.ax[4],
                          ay: this.state.ay[4],
                          az: this.state.az[4],
                          aa: this.state.aa[4],
                          gx: this.state.gx[4],
                          gy: this.state.gy[4],
                          gz: this.state.gz[4],
                          ag: this.state.ag[4],
                          fslpPressure: this.state.fslpPressure[4],
                          fslpPosition: this.state.fslpPosition[4],
                          fsrPressureToe: this.state.fsrPressure1[4],
                          fsrPressureHeel: this.state.fsrPressure2[4],
                        };

                        const currentUser = auth().currentUser;
                        if (currentUser != null) {
                          const uid = currentUser.uid;

                          db.doc(uid)
                            .collection('data')
                            .doc(moment().format('MMMM Do YYYY'))
                            .collection('Time')
                            .doc(this.state.timer[4])
                            .set(docData, {merge: true})
                            .then(() => {
                              console.log('Document successfully written!');
                            })
                            .catch((error) => {
                              console.log(error);
                            });
                        }
                      });
                    })
                    .catch((error) => {
                      console.log(error.message);
                      throw error;
                    });
                })
            );
          })
          .catch((error) => {
            console.log(error.message);
          });
      });
  }

  loop(peripheral) {
    let i = setInterval(async () => {
      await this.quickRead(peripheral);
      clearInterval();
    }, 1500);
    if (this.state.stopRead) {
      clearInterval();
    }

    this.intervals.push(i);
  }
  renderItem(item) {
    const color = item.connected ? 'green' : '#fff';
    if (!item.connected) {
      this.setState((prevState) => {
        return {
          ...prevState,
          notPressed: true,
        };
      });
    }
    return (
      <TouchableHighlight
        disabled={!this.state.notPressed}
        onPress={() => {
          this.setState((prevState) => {
            return {
              ...prevState,
              notPressed: false,
            };
          });
          this.test(item);
        }}>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: '#333333',
              padding: 10,
            }}>
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
            }}>
            RSSI: {item.rssi}
          </Text>
          <Text
            style={{
              fontSize: 8,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
              paddingBottom: 20,
            }}>
            {item.id}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  // HighChart() {
  //   const Highcharts = 'Highcharts';
  //   const conf = {
  //     chart: {
  //       type: 'spline',
  //       animation: Highcharts.svg,
  //       marginRight: 10,
  //       events: {
  //         load: function () {
  //           const series = this.series[0];
  //           setInterval(function () {
  //             const x = new Date().getTime(),
  //               y = this.state.ay;
  //             series.addPoint([x, y], true, true);
  //           }, 1500);
  //         },
  //       },
  //     },
  //     title: {
  //       text: 'Live Bitcoin Price',
  //     },
  //     xAxis: {type: 'datetime', tickPixelInterval: 150},
  //     yAxis: {
  //       title: {text: 'Price USD'},
  //       plotLines: [{value: 0, width: 1, color: '#CCC'}],
  //     },
  //     tooltip: {
  //       formatter: function () {
  //         return (
  //           '<b>' +
  //           this.series.name +
  //           '</b><br/>' +
  //           Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +
  //           '<br/>' +
  //           Highcharts.numberFormat(this.y, 2)
  //         );
  //       },
  //     },
  //     exporting: {enabled: false},
  //     series: [
  //       {
  //         name: 'BTC',
  //         data: (function () {
  //           // generate an array of random data
  //           const data = [];
  //           const time = new Date().getTime();
  //           for (let i = -19; i <= 0; i += 1) {
  //             data.push({
  //               x: time + i * 2000,
  //               y: 0,
  //             });
  //           }
  //           return data;
  //         })(),
  //       },
  //     ],
  //   };

  //   const options = {
  //     global: {useUTC: false},
  //     lang: {decimalPoint: ',', thousandsSep: '.'},
  //   };

  //   return <ChartView style={{height: 350}} config={conf} options={options} />;
  // }

  render() {
    // Real-time graph code
    // BLE code

    const list = Array.from(this.state.peripherals.values());
    const btnScanTitle =
      'Scan Bluetooth (' + (this.state.scanning ? 'on' : 'off') + ')';

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <ScrollView style={styles.scroll}>
            <View style={{margin: 10}}>
              <Button title={btnScanTitle} onPress={() => this.startScan()} />
            </View>

            <View style={{margin: 10}}>
              <Button
                title="Retrieve connected peripherals"
                onPress={() => this.retrieveConnected()}
              />
            </View>
            {list.length == 0 && (
              <View style={{flex: 1, margin: 20}}>
                <Text style={{textAlign: 'center'}}>No peripherals</Text>
              </View>
            )}
            <FlatList
              data={list}
              renderItem={({item}) => this.renderItem(item)}
              keyExtractor={(item) => item.id}
            />

            {/* {this.HighChart()} */}
            {/* <RealTimeGraph /> */}
            <Text style={{marginBottom: -35, marginTop: 15}}>
              Accelerometer Chart (Ax = Red, Ay = Blue, Az = Yellow)
            </Text>
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryLine
                style={{
                  data: {stroke: '#f25757'},
                  parent: {border: '1px solid #ccc'},
                }}
                data={[
                  {x: '12:02:01', y: 0.16},
                  {x: '12:02:02', y: 0.16},
                  {x: '12:02:03', y: 0.13},
                  {x: '12:02:04', y: 0.14},
                  {x: '12:02:05', y: 0.15},
                ]}
              />
              <VictoryLine
                style={{
                  data: {stroke: '#61e8e1'},
                  parent: {border: '2px solid #ccc'},
                }}
                data={[
                  {x: '12:02:01', y: 0.73},
                  {x: '12:02:02', y: 0.94},
                  {x: '12:02:03', y: 0.99},
                  {x: '12:02:04', y: 0.98},
                  {x: '12:02:05', y: 0.99},
                ]}
              />
              <VictoryLine
                style={{
                  data: {stroke: '#f2cd60'},
                  parent: {border: '1px solid #ccc'},
                }}
                data={[
                  {x: '12:02:01', y: 0.25},
                  {x: '12:02:02', y: 0.13},
                  {x: '12:02:03', y: 0.1},
                  {x: '12:02:04', y: 0.11},
                  {x: '12:02:05', y: 0.1},
                ]}
              />
            </VictoryChart>
            <Text style={{marginBottom: -35, marginTop: 15}}>
              Gyroscope Chart (Gx = Red, Gy = Blue, Gz = Yellow)
            </Text>
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryLine
                style={{
                  data: {stroke: '#f25757'},
                  parent: {border: '1px solid #ccc'},
                }}
                data={[
                  {x: '12:02:01', y: 41.99},
                  {x: '12:02:02', y: 5.37},
                  {x: '12:02:03', y: 1.34},
                  {x: '12:02:04', y: 0.37},
                  {x: '12:02:05', y: -1.46},
                ]}
              />
              <VictoryLine
                style={{
                  data: {stroke: '#61e8e1'},
                  parent: {border: '2px solid #ccc'},
                }}
                data={[
                  {x: '12:02:01', y: 2.38},
                  {x: '12:02:02', y: 3.3},
                  {x: '12:02:03', y: 0.73},
                  {x: '12:02:04', y: -0.12},
                  {x: '12:02:05', y: -0.37},
                ]}
              />
              <VictoryLine
                style={{
                  data: {stroke: '#f2cd60'},
                  parent: {border: '1px solid #ccc'},
                }}
                data={[
                  {x: '12:02:01', y: -11.35},
                  {x: '12:02:02', y: -11.41},
                  {x: '12:02:03', y: -7.51},
                  {x: '12:02:04', y: -8.79},
                  {x: '12:02:05', y: -8.36},
                ]}
              />
            </VictoryChart>
            <Text style={{marginBottom: -35, marginTop: 15}}>
              FSLP Chart (Pressure = Red, Position = Blue)
            </Text>
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryLine
                style={{
                  data: {stroke: '#f25757'},
                  parent: {border: '1px solid #ccc'},
                }}
                data={[
                  {x: '12:02:01', y: 50},
                  {x: '12:02:02', y: 95},
                  {x: '12:02:03', y: 164},
                  {x: '12:02:04', y: 215},
                  {x: '12:02:05', y: 268},
                ]}
              />
              <VictoryLine
                style={{
                  data: {stroke: '#61e8e1'},
                  parent: {border: '2px solid #ccc'},
                }}
                data={[
                  {x: '12:02:01', y: 511},
                  {x: '12:02:02', y: 542},
                  {x: '12:02:03', y: 556},
                  {x: '12:02:04', y: 576},
                  {x: '12:02:05', y: 593},
                ]}
              />
            </VictoryChart>
            <Text style={{marginBottom: -35, marginTop: 15}}>
              FSR Chart (FSR1 Pressure = Red, FSR2 Pressure = Blue)
            </Text>
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryLine
                style={{
                  data: {stroke: '#f25757'},
                  parent: {border: '1px solid #ccc'},
                }}
                data={[
                  {x: '12:02:01', y: 34},
                  {x: '12:02:02', y: 64},
                  {x: '12:02:03', y: 87},
                  {x: '12:02:04', y: 103},
                  {x: '12:02:05', y: 112},
                ]}
              />
              <VictoryLine
                style={{
                  data: {stroke: '#61e8e1'},
                  parent: {border: '2px solid #ccc'},
                }}
                data={[
                  {x: '12:02:01', y: 115},
                  {x: '12:02:02', y: 113},
                  {x: '12:02:03', y: 105},
                  {x: '12:02:04', y: 100},
                  {x: '12:02:05', y: 82},
                ]}
              />
            </VictoryChart>
            {/* <Text>Accelerometer Ax Line Chart</Text>
            <LineChart
              data={{
                labels: [
                  this.state.timer[0],
                  this.state.timer[1],
                  this.state.timer[2],
                  this.state.timer[3],
                  this.state.timer[4],
                  this.state.timer[5],
                ],
                datasets: [
                  {
                    data: [
                      this.state.ax[0],
                      this.state.ax[1],
                      this.state.ax[2],
                      this.state.ax[3],
                      this.state.ax[4],
                      this.state.ax[5],
                    ],
                  },
                ],
              }}
              width={screenWidth} // from react-native
              height={220}
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            /> */}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: window.width,
    height: window.height,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 5,
  },
  row: {
    margin: 10,
  },
});
