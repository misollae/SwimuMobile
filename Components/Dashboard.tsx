import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const poolTimeData = [
  {time: '10:00', distance: 0},
  {time: '11:00', distance: 500},
  {time: '12:00', distance: 1000},
  {time: '13:00', distance: 1500},
  {time: '14:00', distance: 2000},
  {time: '15:00', distance: 2500},
  {time: '16:00', distance: 3000},
];

const DashboardComponent = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Pool Time Dashboard</Text>
          <View style={styles.chartContainer}>
            {poolTimeData.map((data, index) => (
              <View key={index} style={styles.barContainer}>
                <Text style={styles.barLabel}>{data.time}</Text>
                <View style={[styles.bar, {height: data.distance / 20}]} />
                <Text style={styles.barValue}>{data.distance}m</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 64,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  barLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bar: {
    width: 24,
    backgroundColor: '#2196f3',
    borderRadius: 4,
  },
  barValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default DashboardComponent;
