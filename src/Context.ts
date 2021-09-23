import React from "react";

import { IModalDatePickerProps } from "./PickerModal";

export interface PickerModalProps {
  showPickerModal: (
    callback: (date: Date) => void,
    options?: IModalDatePickerProps
  ) => void;
}

const context = React.createContext<PickerModalProps>({
  showPickerModal: (
    _callback: (date: Date) => void,
    _options?: IModalDatePickerProps
  ) => {},
});

export function usePickerModal() {
  return React.useContext(context);
}

const { Provider, Consumer } = context;

export { Provider, Consumer };
