/**
 * @format
 * @flow
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import PlayerBar from './PlayerBar';

type Player = {
  name: string,
  cows: number,
  strikes: number,
  isHost: boolean,
  isCpu: boolean,
}

type GameData = {
  players: {
    [string]: Player
  },
  history: {},
  round: number,
}

type Props = {
  gameData: GameData
};

export default function Game({ gameData }: Props) {
  const players = Object.values(gameData.players);
  const maxCows = players.reduce((max, player) => Math.max(player.cows, max), 0);
  return (
    <View styles={styles.container}>
      <View styles={styles.barChart}>
        {players.map(p => <PlayerBar key={p.name} cowsCount={p.cows} maxCows={maxCows} />)}
      </View>
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
  barChart: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'red',
  },
});
