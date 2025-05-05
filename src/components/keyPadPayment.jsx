import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');
const MARGIN = 2;

const KeyPadButton = ({ text, style, disabled = false }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.primary,
          ...style,
        },
      ]}
    >
      <Text style={{ fontSize: width * 0.05, fontWeight: 'bold' }}>{text}</Text>
    </TouchableOpacity>
  );
};
const KeypadPayment = () => {
  const targetRef = React.useRef(null);
  const [containerWidth, setContainerWidth] = React.useState(50);
  //React.useLayoutEffect(() => {
  //targetRef.current?.measure((x, y, width, height, pageX, pageY) => {
  //  console.log('width', width);
  // });
  //}, [ /* add dependencies here */]);
  const onLayoutHandler = (event) => {
    console.log('layout', event.nativeEvent.layout.width);
    setContainerWidth(event.nativeEvent.layout.width - MARGIN);
  };
  const marginBottom =
    (containerWidth - (containerWidth * 0.25 - MARGIN) * 4) / 3;

  return (
    <View style={styles.container}>
      <View style={styles.pm}>
        <KeyPadButton
          style={{
            //width: containerWidth * 0.25 * 2,
            height: containerWidth * 0.25 - MARGIN,
            marginBottom,
          }}
          text={'Efectivo'}
        />
        <KeyPadButton
          style={{
            //width: containerWidth * 0.25 * 2,
            height: containerWidth * 0.25 - MARGIN,
          }}
          text={'Transfer'}
        />
      </View>
      <View
        ref={targetRef}
        onLayout={onLayoutHandler}
        style={styles.keyPadContainer}
      >
        <TextInput
          style={{ marginBottom, height: containerWidth * 0.25 - MARGIN }}
        />
        <View
          style={[
            styles.keyContainer,
            {
              marginBottom,
            },
          ]}
        >
          {['7', '8', '9', ' '].map((key, index) => (
            <KeyPadButton
              key={'1' + index}
              disabled={key === ' '}
              style={{
                width: containerWidth * 0.25 - MARGIN,
                aspectRatio: 1,
                opacity: key !== ' ' ? 1 : 0.5,
              }}
              text={key}
            />
          ))}
        </View>
        <View
          style={[
            styles.keyContainer,
            {
              marginBottom,
            },
          ]}
        >
          {['4', '5', '6', ' '].map((key, index) => (
            <KeyPadButton
              key={'2' + index}
              disabled={key === ' '}
              style={{
                width: containerWidth * 0.25 - MARGIN,
                aspectRatio: 1,
                opacity: key !== ' ' ? 1 : 0.5,
              }}
              text={key}
            />
          ))}
        </View>
        <View
          style={[
            styles.keyContainer,
            {
              marginBottom,
            },
          ]}
        >
          {['1', '2', '3', ' '].map((key, index) => (
            <KeyPadButton
              key={'3' + index}
              disabled={key === ' '}
              style={{
                width: containerWidth * 0.25 - MARGIN,
                aspectRatio: 1,
                opacity: key !== ' ' ? 1 : 0.5,
              }}
              text={key}
            />
          ))}
        </View>
        <View style={styles.keyContainer}>
          {['0', '.'].map((key, index) => (
            <KeyPadButton
              key={'4' + index}
              style={{
                width: containerWidth * 0.25 - MARGIN,
                aspectRatio: 1,
              }}
              text={key}
            />
          ))}
          <KeyPadButton
            style={{
              width: containerWidth * 0.25 * 2,
              height: containerWidth * 0.25 - MARGIN,
              backgroundColor: '#d3d3d3',
            }}
            text={'Done'}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    //flexWrap: 'wrap',
    //justifyContent: 'flex-start',
    //width: '100%',
    //backgroundColor: 'green',
  },
  pm: {
    //flex: 0.3,
    width: '30%',
    marginRight: 2,
    //justifyContent: 'space-around',
  },
  keyPadContainer: {
    flex: 1,
    //flexWrap: 'wrap',
    //justifyContent: 'flex-start',
    //width: '100%',
    //backgroundColor: 'green',
  },
  keyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //marginBottom: 4 / 3,
    //width: width * 0.25 - 4, // Hace que las teclas ocupen el espacio disponible
    //margin: 2, // Espaciado entre teclas
    //marginRight: 4,
  },
  key: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneKey: {
    //margin: 2,
    backgroundColor: '#d3d3d3',
    //height: width*0.24
  },
});

export default KeypadPayment;
