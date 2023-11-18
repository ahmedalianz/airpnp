import Colors from '@/constants/Colors';
import {IMG_HEIGHT, px} from '@/constants/Layouts';
import {defaultStyles} from '@/constants/Styles';
import {Ionicons} from '@expo/vector-icons';
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from '@gorhom/bottom-sheet';
import {Link} from 'expo-router';
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import Animated, {FadeInRight, FadeOutLeft} from 'react-native-reanimated';
interface ListingsProps {
  listings: Array<any>;
  category: string;
  refresh: number;
}
export const Listings: FC<ListingsProps> = ({listings, category, refresh}) => {
  const listRef = useRef<BottomSheetFlatListMethods>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (refresh) {
      listRef.current?.scrollToOffset({offset: 0, animated: true});
    }
  }, [refresh]);
  useEffect(() => {
    setLoading(true);
    let timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [category]);
  const renderRow: ListRenderItem<any> = ({item}) => (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity>
        <Animated.View
          style={styles.listing}
          entering={FadeInRight}
          exiting={FadeOutLeft}>
          <Animated.Image
            source={{uri: item.medium_url}}
            style={styles.image}
          />
          <TouchableOpacity
            style={{position: 'absolute', top: px(30), right: px(30)}}>
            <Ionicons name="heart-outline" size={px(24)} color={Colors.dark} />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: px(16), fontFamily: 'SemiBold'}}>
              {item.name}
            </Text>
            <View style={{flexDirection: 'row', gap: px(4)}}>
              <Ionicons name="star" size={px(16)} />
              <Text style={{fontFamily: 'SemiBold'}}>
                {item.review_scores_rating / 20}
              </Text>
            </View>
          </View>
          <Text style={{fontFamily: 'Regular'}}>{item.room_type}</Text>
          <View style={{flexDirection: 'row', gap: px(4)}}>
            <Text style={{fontFamily: 'SemiBold'}}>€ {item.price}</Text>
            <Text style={{fontFamily: 'Regular'}}>night</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
  return (
    <View style={defaultStyles.container}>
      <BottomSheetFlatList
        renderItem={renderRow}
        showsVerticalScrollIndicator={false}
        data={loading ? [] : listings}
        ref={listRef}
        initialNumToRender={10}
        ListHeaderComponent={
          <Text style={styles.info}>{listings.length} homes</Text>
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  listing: {
    padding: px(16),
    gap: px(10),
    marginVertical: px(16),
  },
  image: {
    width: '100%',
    height: IMG_HEIGHT,
    borderRadius: px(10),
  },
  info: {
    textAlign: 'center',
    fontFamily: 'SemiBold',
    fontSize: px(16),
    marginTop: px(4),
  },
});
