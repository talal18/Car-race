import React from "react";
import { Animated } from "react-native";

export default class Enemy extends React.Component {
  render() {
    return (
      <Animated.Image
        source={this.props.enemyImg}
        style={{
          height: 120,
          width: 80,
          position: "absolute",
          resizeMode: "stretch",
          left: this.props.enemyStartposX,
          transform: [{ translateY: this.props.moveEnemyVal }]
        }}
      />
    );
  }
}
