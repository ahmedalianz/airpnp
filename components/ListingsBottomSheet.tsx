import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {FC, useMemo, useRef, useState} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {Listings} from './Listings';
import {Ionicons} from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import {defaultStyles} from '@/constants/Styles';
import {px} from '@/constants/Layouts';
interface ListingsBottomSheetProps {
  listings: Array<any>;
  category: string;
}
export const ListingsBottomSheet: FC<ListingsBottomSheetProps> = ({
  listings,
  category,
}) => {
  const snapPoints = useMemo(() => ['10%', '90%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [refresh, setRefresh] = useState<number>(0);

  const onShowMap = () => {
    bottomSheetRef.current?.collapse();
    setRefresh(refresh + 1);
  };
  return (
    <BottomSheet
      ref={bottomSheetRef}
      style={styles.sheetContainer}
      snapPoints={snapPoints}
      handleIndicatorStyle={{backgroundColor: Colors.grey}}>
      <View style={defaultStyles.container}>
        <Listings listings={listings} refresh={refresh} category={category} />
        <View style={styles.absoluteView}>
          <TouchableOpacity onPress={onShowMap} style={styles.btn}>
            <Text style={{fontFamily: 'SemiBold', color: Colors.white}}>
              Map
            </Text>
            <Ionicons
              name="map"
              size={20}
              style={{marginLeft: px(10)}}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  uteView: {
    position: 'absolute',
    bottom: px(30),
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: Colors.dark,
    padding: px(14),
    height: px(50),
    borderRadius: px(30),
    flexDirection: 'row',
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  absoluteView: {
    position: 'absolute',
    bottom: px(30),
    width: '100%',
    alignItems: 'center',
  },
  sheetContainer: {
    backgroundColor: Colors.white,
    elevation: 4,
    shadowColor: Colors.dark,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
});
