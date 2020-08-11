import React from "react";
import { PickerModal, IModalDatePickerProps } from "./PickerModal";
import { Provider } from "./Context";

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
      this.PickerModalRef.current !== null &&
        this.PickerModalRef.current.showPickerModal(callback, options);
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
