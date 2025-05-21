import { useRef, useEffect } from 'react';

export default function useWhyDidYouUpdate(name, props, state) {
  const previousProps = useRef(props);
  const previousState = useRef(state);

  useEffect(() => {
    if (previousProps.current || previousState.current) {
      const changesProps = {};
      const changesState = {};

      for (const key in props) {
        if (props[key] !== previousProps.current?.[key]) {
          changesProps[key] = {
            from: previousProps.current?.[key],
            to: props[key],
          };
        }
      }

      for (const key in state) {
        if (state[key] !== previousState.current?.[key]) {
          changesState[key] = {
            from: previousState.current?.[key],
            to: state[key],
          };
        }
      }

      if (
        Object.keys(changesProps).length > 0 ||
        Object.keys(changesState).length > 0
      ) {
        console.log(`[useWhyDidYouUpdate] ${name} re-rendered:`, {
          props: changesProps,
          state: changesState,
        });
      }
    }

    previousProps.current = props;
    previousState.current = state;
  });
}
