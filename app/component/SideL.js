import React from "react";
import { Animated } from "react-native";

export default class SideL extends React.Component {
  render() {
    return (
      <Animated.Image
        source={this.props.SlImg}
        style={{
          height: "100%",
          width: 10,
          position: "absolute",
          resizeMode: "stretch",
          left: this.props.slStartposX,
          transform: [{ translateY: this.props.moveSlVal }]
        }}
      />
    );
  }
}
