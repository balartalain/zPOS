/* eslint-disable react/prop-types */
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import useTicketStore from '@/src/store/useTicketStore';
import Utils from '@/src/utils/utils';

const { width } = Dimensions.get('window');
const MARGIN = 2;

const KeyPadButton = ({
  text,
  style,
  disabled = false,
  textStyle = {},
  onPress,
}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.primaryContainer,
          ...style,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={{ fontSize: width * 0.05, fontWeight: 'bold', ...textStyle }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};
const KeypadPayment = () => {
  const theme = useTheme();
  const targetRef = React.useRef(null);
  const { ticket, addPayment } = useTicketStore();
  const [containerWidth, setContainerWidth] = React.useState(50);
  const [selectedTextAmount, setSelectedTextAmount] = React.useState(true);
  const [amount, setAmount] = React.useState();
  //React.useLayoutEffect(() => {
  //targetRef.current?.measure((x, y, width, height, pageX, pageY) => {
  //  console.log('width', width);
  // });
  //}, [ /* add dependencies here */]);
  const onLayoutHandler = (event) => {
    console.log('layout', event.nativeEvent.layout.width);
    setContainerWidth(event.nativeEvent.layout.width - MARGIN);
  };
  const pending = ticket.totalAmt - ticket.totalPaid;
  React.useEffect(() => {
    setAmount(pending);
    setSelectedTextAmount(true);
  }, [pending]);

  const handlePressBack = () => {
    if (selectedTextAmount) {
      setAmount('');
    } else {
      setAmount((amt) => amt.slice(0, -1));
    }
    setSelectedTextAmount(false);
  };
  const handlePressKey = (key) => {
    if (selectedTextAmount) {
      setAmount(key);
    } else {
      const newAmt = amount + key;
      if (Utils.isFloat(newAmt)) {
        setAmount(String(newAmt));
      }
    }
    setSelectedTextAmount(false);
  };
  const handlePressDone = () => {};
  const handlePressAddPayment = (paymentMethod) => {
    addPayment(paymentMethod, parseFloat(amount));
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
            opacity: pending > 0 ? 1 : 0.4,
          }}
          text={'Efectivo'}
          textStyle={{ fontSize: width * 0.048, fontWeight: 450 }}
          onPress={() => handlePressAddPayment('Efectivo')}
          disabled={pending === 0}
        />
        <KeyPadButton
          style={{
            //width: containerWidth * 0.25 * 2,
            height: containerWidth * 0.25 - MARGIN,
            opacity: pending > 0 ? 1 : 0.4,
          }}
          text={'Transfer'}
          textStyle={{ fontSize: width * 0.048, fontWeight: 450 }}
          onPress={() => handlePressAddPayment('Transfer')}
          disabled={pending === 0}
        />
      </View>
      <View
        ref={targetRef}
        onLayout={onLayoutHandler}
        style={styles.keyPadContainer}
      >
        <View style={{ marginBottom, flexDirection: 'row' }}>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'space-evenly',
              height: containerWidth * 0.25 - MARGIN,
              paddingRight: 10,
              borderBottomWidth: 1,
              backgroundColor: theme.colors.primaryContainer,
              opacity: pending > 0 ? 1 : 0.4,
            }}
          >
            <Text style={{ fontSize: width * 0.04 }}>Monto(Cup)</Text>
            <Text
              style={{
                fontSize: width * 0.05,
                ...(selectedTextAmount && { backgroundColor: '#C0C0C0' }),
              }}
            >
              {amount}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: containerWidth * 0.25 - MARGIN,
              height: containerWidth * 0.25 - MARGIN,
              marginLeft: marginBottom,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.colors.primaryContainer,
              opacity: pending > 0 ? 1 : 0.4,
            }}
            onPress={handlePressBack}
            disabled={pending === 0}
          >
            <Ionicons name="backspace-outline" size={32} color="black" />
          </TouchableOpacity>
        </View>
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
              disabled={key === ' ' || pending === 0}
              style={{
                width: containerWidth * 0.25 - MARGIN,
                aspectRatio: 1,
                opacity: pending > 0 ? 1 : 0.4,
              }}
              text={key}
              onPress={() => handlePressKey(key)}
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
              disabled={key === ' ' || pending === 0}
              style={{
                width: containerWidth * 0.25 - MARGIN,
                aspectRatio: 1,
                opacity: pending > 0 ? 1 : 0.4,
              }}
              text={key}
              onPress={() => handlePressKey(key)}
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
              disabled={key === ' ' || pending === 0}
              style={{
                width: containerWidth * 0.25 - MARGIN,
                aspectRatio: 1,
                opacity: pending > 0 ? 1 : 0.4,
              }}
              text={key}
              onPress={() => handlePressKey(key)}
            />
          ))}
        </View>
        <View style={styles.keyContainer}>
          {['0', '.'].map((key, index) => (
            <KeyPadButton
              key={'4' + index}
              disabled={pending === 0}
              style={{
                width: containerWidth * 0.25 - MARGIN,
                aspectRatio: 1,
                opacity: pending > 0 ? 1 : 0.4,
              }}
              text={key}
              onPress={() => handlePressKey(key)}
            />
          ))}
          <KeyPadButton
            style={{
              width: containerWidth * 0.25 * 2,
              height: containerWidth * 0.25 - MARGIN,
              backgroundColor: theme.colors.primary,
              //backgroundColor: '#d3d3d3',
              opacity: pending === 0 ? 1 : 0.4,
            }}
            text={'Done'}
            onPress={handlePressDone}
            disabled={pending > 0}
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
