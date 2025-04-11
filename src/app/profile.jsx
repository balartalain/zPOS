import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { OnMeasure } from '../components/onMeasure';
import { Button } from 'react-native-paper';

export default function ProfileScreen() {
  const [measurements, setMeasurements] = React.useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    pageX: 0,
    pageY: 0,
  });
  return (
    <>
      {/*<View style={{ height: 78 }}></View>*/}
      <OnMeasure style={{ marginTop: 0 }}>
        {({ width, height, x, y, pageX, pageY }) => (
          <View style={[styles.square]}>
            <Text>
              {pageX} {pageY}
            </Text>
          </View>
        )}
      </OnMeasure>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  square: {
    width: 50,
    height: 50,
    //position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
});
