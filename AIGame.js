/**
 * @format
 * @flow
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Game from './Game';

export default function AIGame() {
  const gameData = {
    players: {
      'Player 1': { name: 'Player 1', cows: 60, strikes: 0, isHost: true },
      'Player 2': { name: 'Player 2', cows: 60, strikes: 0, isCpu: true },
      'Player 3': { name: 'Player 3', cows: 60, strikes: 0, isCpu: true },
      'Player 4': { name: 'Player 4', cows: 60, strikes: 0, isCpu: true },
    },
    history: {},
    round: 1
  };
  return <Game gameData={gameData} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
