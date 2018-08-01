import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  AppRegistry,
  Dimensions,
  Animated,
  BackAndroid,
  Alert
} from "react-native";

import Enemy from "./app/component/Enemy";
import Lane from "./app/component/Lane";
import SideR from "./app/component/SideR";
import SideL from "./app/component/SideL";


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //player car
      movePlayerVal: new Animated.Value(60),
      playerSide: "left",
      points: 0,

      //Enemy cars
      moveEnemyVal: new Animated.Value(0),
      enemyStartposX: 0,
      enemySide: "left",
      enemySpeed: 4200,

      gameOver: false,

      //Lane animation
      moveLaneVal: new Animated.Value(0),
      laneStartposX: Dimensions.get("window").width / 2,
      laneSpeed: 4200,

      //left side
      moveSlVal: new Animated.Value(0),
      slStartposX: 0,
      slSpeed: 4200,

      //right side
      moveSrVal: new Animated.Value(0),
      srStartposX: Dimensions.get("window").width - 20,
      srSpeed: 4200
    };
  }

  render() {
    return (
      <ImageBackground
        source={require("./app/img/street1.png")}
        style={styles.container}
      >
        <Lane
          laneImg={require("./app/img/lane1.png")}
          laneStartposX={this.state.laneStartposX}
          moveLaneVal={this.state.moveLaneVal}
        />

        <SideL
          SlImg={require("./app/img/side.png")}
          slStartposX={this.state.slStartposX}
          moveSlVal={this.state.moveSlVal}
        />

        <SideR
          SrImg={require("./app/img/side.png")}
          srStartposX={this.state.srStartposX}
          moveSrVal={this.state.moveSrVal}
        />

        <View style={{ flex: 1, alignItems: "center", marginTop: 540 }}>
          <View style={styles.points}>
            <Text style={{ fontWeight: "bold", fontSize: 40 }}>
              {this.state.points}
            </Text>
          </View>
        </View>

        <Animated.Image
          source={require("./app/img/car1.png")}
          style={{
            height: 120,
            width: 80,
            position: "absolute",
            zIndex: 1,
            bottom: 50,
            resizeMode: "stretch",
            transform: [{ translateX: this.state.movePlayerVal }]
          }}
        />

        <Enemy
          enemyImg={require("./app/img/car2.png")}
          enemyStartposX={this.state.enemyStartposX}
          moveEnemyVal={this.state.moveEnemyVal}
        />

        <View style={styles.controls}>
          <Text style={styles.left} onPress={() => this.movePlayer("left")}>
            {"<"}
          </Text>
          <Text style={styles.right} onPress={() => this.movePlayer("right")}>
            {">"}
          </Text>
        </View>
      </ImageBackground>
    );
  }

  movePlayer(direction) {
    if (direction == "right") {
      this.setState({ playerSide: "right" });
      Animated.spring(this.state.movePlayerVal, {
        toValue: Dimensions.get("window").width - 140,
        tension: 120
      }).start();
    } else if (direction == "left") {
      this.setState({ playerSide: "left" });
      Animated.spring(this.state.movePlayerVal, {
        toValue: 40,
        tension: 120
      }).start();
    }
  }

  componentDidMount() {
    this.animateEnemy();
    this.animateLane();
  }

  animateLane() {
    this.state.moveLaneVal.setValue(-100);

    refreshIntervalid = setInterval(() => {
      //check if there is a Collision
      if (this.state.gameOver) {
        clearInterval(refreshIntervalid);
        Animated.timing(this.state.moveLaneVal).stop();
      }
    }, 50);

    //increase the lane speed each 20 seconds
    setInterval(() => {
      this.setState({ laneSpeed: this.state.laneSpeed - 20 });
    }, 20000);

    //Lane animation
    Animated.timing(this.state.moveLaneVal, {
      toValue: Dimensions.get("window").height - 560,
      duration: this.state.laneSpeed / 3
    }).start(event => {
      // if no collision is detected, restart the lane animation
      if (this.state.gameOver == false) {
        this.animateLane();
      }
    });
  }

  animateEnemy() {
    this.state.moveEnemyVal.setValue(-100);
    var windowH = Dimensions.get("window").height;

    //Generate left distance for enenmy
    var r = Math.floor(Math.random() * 2) + 1;

    if (r == 2) {
      r = 40;
      this.setState({ enemySide: "left" });
    } else {
      r = Dimensions.get("window").width - 140;
      //enemy is on the right
      this.setState({ enemySide: "right" });
    }

    this.setState({ enemyStartposX: r });

    //Interval to check for collusion each 50 ms
    var refreshIntervalid;
    refreshIntervalid = setInterval(() => {
      //Collision logic

      //if enemy collides with player and they are on the same side
      // -- and the enemy has not passed the player safely
      if (
        this.state.moveEnemyVal._value > windowH - 295 && // enemy passed the car
        this.state.playerSide == this.state.enemySide //the same side
      ) {
        clearInterval(refreshIntervalid);
        this.setState({ gameOver: true });
        Animated.timing(this.state.moveEnemyVal).stop();
        this.gameOver();
      }
    }, 50);

    // increase enemy speed each 20th second --(Working)--
    setInterval(() => {
      this.setState({ enemySpeed: this.state.enemySpeed - 50 });
    }, 20000);

    //Animate the enemy --(Working)--
    Animated.timing(this.state.moveEnemyVal, {
      toValue: Dimensions.get("window").height,
      duration: this.state.enemySpeed
    }).start(event => {
      // if no collision is detected, restart the enemy animation
      if (event.finished && this.state.gameOver == false) {
        clearInterval(refreshIntervalid);
        this.setState({ points: ++this.state.points });
        this.animateEnemy();
      }
    });
  }

  gameOver() {
    Alert.alert(
      "Game Over",
      "Do you want to play again ?",
      [
        {
          text: "No",
          onPress: () => BackAndroid.exitApp(),
          style: "cancel"
        },
        { text: "Yes", onPress: () => Expo.Util.reload() }
      ],
      { cancelable: false }
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: "100%"
  },

  controls: {
    alignItems: "center",
    flexDirection: "row"
  },

  right: {
    flex: 1,
    color: "#fff",
    margin: 55,
    fontSize: 60,
    fontWeight: "bold",
    textAlign: "left"
  },

  left: {
    flex: 1,
    color: "#fff",
    margin: 60,
    fontSize: 60,
    fontWeight: "bold",
    textAlign: "right"
  },

  points: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center"
  }
});

AppRegistry.registerComponent("DaGame", () => DaGame);
