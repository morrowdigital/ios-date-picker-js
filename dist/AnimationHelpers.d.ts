import Animated from "react-native-reanimated";
import { State } from "react-native-gesture-handler";
interface WithDecayParams {
    value: Animated.Adaptable<number>;
    velocity: Animated.Adaptable<number>;
    state: Animated.Node<State>;
    offset?: Animated.Value<number>;
    snapPoints: number[];
    onChange: (index: number) => void;
    defaultValue: number;
}
export declare const withDecay: (params: WithDecayParams) => Animated.Node<number>;
export {};
