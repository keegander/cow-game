/**
 * @format
 * @flow
 */
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";

export default function MainMenu() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cow Game</Text>
      <Link to="/ai-game">
        <Text>Single Player</Text>
      </Link>
      <Link to="/ai-game">
        <Text>Multi Player</Text>
      </Link>
      <Link to="/how-to-play">
        <Text>How To Play</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
