import Animated, {
  Clock,
  Value,
  add,
  block,
  cond,
  eq,
  set,
  startClock,
  and,
  not,
  timing,
  Easing,
  call,
} from "react-native-reanimated";
import { State } from "react-native-gesture-handler";
import { snapPoint } from "react-native-redash";

import { ITEM_HEIGHT } from "./Constants";

interface WithDecayParams {
  value: Animated.Adaptable<number>;
  velocity: Animated.Adaptable<number>;
  state: Animated.Node<State>;
  offset?: Animated.Value<number>;
  snapPoints: number[];
  onChange: (index: number) => void;
  defaultValue: number;
}

export const withDecay = (params: WithDecayParams) => {
  const {
    value,
    velocity,
    state: gestureState,
    offset,
    snapPoints,
    onChange,
    defaultValue,
  } = {
    offset: new Value(0),
    ...params,
  };
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(defaultValue),
    time: new Value(0),
    frameTime: new Value(0),
  };
  const config = {
    toValue: new Value(0),
    duration: new Value(1000),
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  };
  return block([
    startClock(clock),
    cond(eq(gestureState, State.BEGAN), set(offset, state.position)),
    cond(eq(gestureState, State.ACTIVE), [
      set(state.position, add(offset, value)),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(state.finished, 0),
      set(config.toValue, snapPoint(state.position, velocity, snapPoints)),
    ]),
    cond(and(not(state.finished), eq(gestureState, State.END)), [
      timing(clock, state, config),
      cond(
        state.finished,
        call([state.position], ([finalOffset]) =>
          onChange(Math.abs(finalOffset) / ITEM_HEIGHT)
        )
      ),
    ]),
    state.position,
  ]);
};
