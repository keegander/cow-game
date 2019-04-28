/**
 * @format
 * @flow
 */
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";

export default function HowToPlay() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to Play</Text>
      <Text>
        This is a game were you have a farm. You have to stay above 50 cows.
        You can go below 50 cows but if you stay below 50 cows for 3 turns your family starves that means game over.
        You can give cows too. This game is cooperative multiplayer.
      </Text>
      <Link to="/">
        <Text>Back</Text>
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
