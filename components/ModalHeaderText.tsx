import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {px} from '../constants/Layouts';
import Colors from '@/constants/Colors';
import {TouchableOpacity} from 'react-native';

export const ModalHeaderText = () => {
  const [active, setActive] = useState<1 | 0>(0);

  return (
    <View style={{flexDirection: 'row', justifyContent: 'center', gap: px(10)}}>
      <TouchableOpacity onPress={() => setActive(0)}>
        <Text style={styles(active, 0).text}>Stays</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActive(1)}>
        <Text style={styles(active, 1).text}>Experiences</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = (active: 0 | 1, index: number) =>
  StyleSheet.create({
    text: {
      fontFamily: 'SemiBold',
      fontSize: px(18),
      color: active == index ? Colors.dark : Colors.grey,
      textDecorationLine: active == index ? 'underline' : 'none',
    },
  });
