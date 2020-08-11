import * as React from "react";

export interface PickerModalProps {
  showPickerModal: (callback: (date: Date) => void) => void;
}

const context = React.createContext<PickerModalProps>({
  showPickerModal: (_callback: (date: Date) => void) => {},
});

export function usePickerModal() {
  return React.useContext(context);
}

const { Provider, Consumer } = context;

export { Provider, Consumer };
