import listingsData from '@/assets/data/airbnb-listings.json';
import Colors from '@/constants/Colors';
import {IMG_HEIGHT, px, screenWidth} from '@/constants/Layouts';
import {defaultStyles} from '@/constants/Styles';
import {Ionicons} from '@expo/vector-icons';
import {useLocalSearchParams, useNavigation} from 'expo-router';
import React, {useLayoutEffect} from 'react';
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInLeft,
  FadeInRight,
  interpolate,
  SlideInDown,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import MarqueeText from 'react-native-marquee';

const ListItem = () => {
  const {id} = useLocalSearchParams<{id: string}>();
  const item = (listingsData as any[]).find(item => item.id === id);
  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-IMG_HEIGHT, 0, IMG_HEIGHT],
          [IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75],
        ),
      },
      {
        scale: interpolate(
          scrollOffset.value,
          [-IMG_HEIGHT, 0, IMG_HEIGHT],
          [2, 1, 1],
        ),
      },
    ],
  }));
  const shareListing = async () => {
    try {
      await Share.share({
        title: item.name,
        url: item.listing_url,
      });
    } catch (err) {
      console.log(err);
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,

      headerBackground: () => (
        <Animated.View
          style={[headerAnimatedStyle, styles.header]}></Animated.View>
      ),
      headerRight: () => (
        <Animated.View style={styles.bar} entering={FadeInRight.delay(300)}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons name="share-outline" size={22} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart-outline" size={22} color={'#000'} />
          </TouchableOpacity>
        </Animated.View>
      ),
      headerLeft: () => (
        <Animated.View entering={FadeInLeft.delay(300)}>
          <TouchableOpacity
            style={styles.roundButton}
            onPress={navigation.goBack}>
            <Ionicons name="chevron-back" size={24} color={'#000'} />
          </TouchableOpacity>
        </Animated.View>
      ),
    });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, []);
  return (
    <View style={defaultStyles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingBottom: px(100)}}>
        <Animated.Image
          source={{uri: item.xl_picture_url}}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>
            {item.room_type} in {item.smart_location}
          </Text>
          <Text style={styles.rooms}>
            {item.guests_included} guests · {item.bedrooms} bedrooms ·{' '}
            {item.beds} bed · {item.bathrooms} bathrooms
          </Text>
          <View style={{flexDirection: 'row', gap: px(4)}}>
            <Ionicons name="star" size={px(16)} />
            <Text style={styles.ratings}>
              {item.review_scores_rating / 20} · {item.number_of_reviews}{' '}
              reviews
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Image source={{uri: item.host_picture_url}} style={styles.host} />

            <View>
              <Text style={{fontWeight: '500', fontSize: px(16)}}>
                Hosted by {item.host_name}
              </Text>
              <Text>Host since {item.host_since}</Text>
              <Text style={{color: '#a3ee'}}>
                Replies {item.host_response_time}
              </Text>
            </View>
          </View>
          <View style={[styles.divider]} />
          <MarqueeText
            style={{fontSize: px(14)}}
            speed={0.1}
            marqueeOnStart={true}
            loop={true}
            consecutive
            delay={1000}>
            {item.amenities.reduce(
              (curr: string, acc: string) => curr + ' - ' + acc,
            )}
          </MarqueeText>

          <View style={[styles.divider]} />

          <Text style={styles.description}>{item.description}</Text>
        </View>
      </Animated.ScrollView>
      <Animated.View
        style={defaultStyles.footer}
        entering={SlideInDown.delay(200)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>€{item.price}</Text>
            <Text>night</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[defaultStyles.btn, {paddingHorizontal: px(20)}]}>
            <Text style={defaultStyles.btnText}>Reserve</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default ListItem;
const styles = StyleSheet.create({
  image: {height: IMG_HEIGHT, width: screenWidth},
  infoContainer: {
    padding: px(24),
    backgroundColor: '#fff',
  },
  name: {
    fontSize: px(26),
    fontWeight: 'bold',
    fontFamily: 'SemiBold',
  },
  location: {
    fontSize: px(18),
    marginTop: px(10),
    fontFamily: 'SemiBold',
  },
  rooms: {
    fontSize: px(16),
    color: Colors.grey,
    marginVertical: px(4),
    fontFamily: 'Regular',
  },
  ratings: {
    fontSize: px(16),
    fontFamily: 'SemiBold',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: px(16),
  },
  host: {
    width: px(50),
    height: px(50),
    borderRadius: px(50),
    backgroundColor: Colors.grey,
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(12),
  },
  footerText: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(4),
  },
  footerPrice: {
    fontSize: px(18),
    fontFamily: 'SemiBold',
  },
  roundButton: {
    width: px(40),
    height: px(40),
    borderRadius: px(50),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(10),
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },

  description: {
    fontSize: px(16),
    marginTop: px(10),
    fontFamily: 'Regular',
  },
});
