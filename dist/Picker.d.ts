interface PickerProps {
    defaultValue: number;
    values: {
        value: number;
        label: string;
    }[];
    flex: number;
    onChange: (value: number) => void;
}
declare const Picker: ({ values, defaultValue, flex, onChange }: PickerProps) => JSX.Element;
export default Picker;
