import React from "react";

import { Provider } from "./Context";
import { PickerModal, IModalDatePickerProps } from "./PickerModal";

interface Props {
  children: React.ReactNode;
}

export class PickerModalProvider extends React.Component<Props> {
  PickerModalRef: React.RefObject<any> = React.createRef();

  getContext = () => ({
    showPickerModal: (
      callback: (date: Date) => void,
      options?: IModalDatePickerProps
    ) => {
      this.PickerModalRef.current?.showPickerModal(callback, options);
    },
  });

  render() {
    return (
      <Provider value={this.getContext()}>
        <PickerModal ref={this.PickerModalRef}>
          {React.Children.only(this.props.children)}
        </PickerModal>
      </Provider>
    );
  }
}
