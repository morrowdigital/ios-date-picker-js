import Animated from "react-native-reanimated";
interface GestureHandlerProps {
    value: Animated.Value<number>;
    max: number;
    defaultValue: number;
    onChange: (index: number) => void;
}
declare const GestureHandler: ({ value, max, onChange, defaultValue, }: GestureHandlerProps) => JSX.Element;
export default GestureHandler;
