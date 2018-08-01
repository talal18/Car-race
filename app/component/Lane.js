import React from "react";
import { Animated } from "react-native";

export default class Lane extends React.Component {
  render() {
    return (
      <Animated.Image
        source={this.props.laneImg}
        style={{
          height: "100%",
          width: 10,
          position: "absolute",
          resizeMode: "stretch",
          left: this.props.laneStartposX,
          transform: [{ translateY: this.props.moveLaneVal }]
        }}
      />
    );
  }
}
