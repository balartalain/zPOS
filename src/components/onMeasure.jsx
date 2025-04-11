import React, { useEffect, useRef, useState } from 'react';
import { View, findNodeHandle } from 'react-native';

const OnMeasure = (props) => {
  const { children } = props;
  const boxRef = useRef(null);
  const [measure, setMeasure] = useState({ width: 0, height: 0, x: 0, y: 0 });
  useEffect(() => {
    if (boxRef.current) {
      //const node = findNodeHandle(boxRef.current);
      if (boxRef.current) {
        boxRef.current.measure((x, y, width, height, pageX, pageY) => {
          console.log('Posición global del cuadro azul:', {
            width,
            height,
            pageX,
            pageY,
          });
          setMeasure({ x, y, width, height, pageX, pageY });
        });
      }
    }
  }, []);

  return (
    <View ref={boxRef} {...props}>
      {children(measure)}
    </View>
  );
};
const useMeasure = () => {
  const [measure, setMeasure] = React.useState({
    width,
    height,
    x,
    y,
    pageX,
    pageY,
  });
  const ref = useRef(null); // Crear una referencia al componente
  useEffect(() => {
    if (ref.current) {
      ref.current.measure((x, y, width, height, pageX, pageY) => {
        setMeasure({ width, height, x, y, pageX, pageY });
      });
    }
  }, []);
  return measure;
};
export { useMeasure, OnMeasure };
