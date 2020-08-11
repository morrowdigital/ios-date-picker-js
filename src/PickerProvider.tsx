import * as React from "react";
import { PickerModal } from "./PickerModal";
import { Provider } from "./context";

interface Props {
  children: React.ReactNode;
}

export default class PickerModalProvider extends React.Component<Props> {
  PickerModalRef: React.RefObject<any> = React.createRef();

  getContext = () => {
    console.log("here");

    return {
      dogs: "woof",
      showPickerModal: (callback: (date: Date) => void) => {
        console.log("here");
        this.PickerModalRef.current !== null &&
          this.PickerModalRef.current.showPickerModal(callback);
      },
    };
  };

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
