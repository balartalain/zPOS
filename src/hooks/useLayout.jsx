import React from 'react';

export default useLayout = () => {
  const [layout, setLayout] = React.useState(null);

  const onLayout = React.useCallback((event) => {
    const layout = event.nativeEvent.layout;
    console.log(layout);
    setLayout(layout);
  }, []);

  return [layout, onLayout];
};
