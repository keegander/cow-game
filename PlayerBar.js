/**
 * @format
 * @flow
 */
import React from 'react';
import {View} from 'react-native';

type Props = {
  cowsCount: number,
  maxCows: number,
}

export default function PlayerBar({ cowsCount, maxCows }) {
  return (
    <View style={{ height: `${cowsCount/maxCows}%`, width: '20%', backgroundColor: '#000'}} />
  );
}