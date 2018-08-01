import React from "react";
import { Animated } from "react-native";

export default class SideR extends React.Component {
  render() {
    return (
      <Animated.Image
        source={this.props.SrImg}
        style={{
          height: "100%",
          width: 10,
          position: "absolute",
          resizeMode: "stretch",
          left: this.props.srStartposX,
          transform: [{ translateY: this.props.moveSrVal }]
        }}
      />
    );
  }
}
