import React, { useState } from 'react';
import { View } from 'react-native';

const OnLayout = ({ children }) => {
  const [layout, setLayout] = useState({ width: 0, height: 0, x: 0, y: 0 });

  const handleLayout = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setLayout({ x, y, width, height });
  };

  return (
    <View onLayout={handleLayout} style={{ flex: 1 }}>
      {children(layout)}
    </View>
  );
};

export default OnLayout;
