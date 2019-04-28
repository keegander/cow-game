/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";
import MainMenu from './MainMenu';
import HowToPlay from './HowToPlay';
import AIGame from './AIGame';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <NativeRouter>
        <Route exact path="/" component={MainMenu} />
        <Route exact path="/ai-game" component={AIGame} />
        <Route exact path="/how-to-play" component={HowToPlay} />
      </NativeRouter>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
