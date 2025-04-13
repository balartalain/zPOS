import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, findNodeHandle } from 'react-native';

export default function AboutScreen() {
  const blueBoxRef = useRef(null);

  useEffect(() => {
    if (blueBoxRef.current) {
      const node = findNodeHandle(blueBoxRef.current);
      if (node) {
        blueBoxRef.current.measure((x, y, width, height, pageX, pageY) => {
          console.log('Posición global del cuadro azul:', {
            x,
            y,
            width,
            height,
            pageX,
            pageY,
          });
        });
      }
    }
  }, []);

  return <View ref={blueBoxRef} style={styles.square}></View>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
