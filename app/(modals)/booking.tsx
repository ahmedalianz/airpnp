import {places} from '@/assets/data/places';
import {Card, CardNumberType} from '@/components';
import Colors from '@/constants/Colors';
import {px} from '@/constants/Layouts';
import {defaultStyles} from '@/constants/Styles';
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import {BlurView} from 'expo-blur';
import {useRouter} from 'expo-router';
import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Animated, {SlideInDown} from 'react-native-reanimated';
//@ts-ignore
import DatePicker from 'react-native-modern-datepicker';
const guestsGroups = [
  {
    name: 'Adults',
    text: 'Ages 13 or above',
    count: 0,
    icon: <Ionicons name="man" size={px(20)} />,
  },
  {
    name: 'Children',
    text: 'Ages 2-12',
    count: 0,
    icon: <FontAwesome name="child" size={px(20)} />,
  },
  {
    name: 'Infants',
    text: 'Under 2',
    count: 0,
    icon: <FontAwesome5 name="baby-carriage" size={px(20)} />,
  },
  {
    name: 'Pets',
    text: 'Pets allowed',
    count: 0,
    icon: <MaterialIcons name="pets" size={px(20)} />,
  },
];

const Booking = () => {
  const router = useRouter();
  const [openCard, setOpenCard] = useState<CardNumberType>(0);
  const [selectedPlace, setSelectedPlace] = useState(0);
  const onClear = () => {
    setOpenCard(0);
    setSelectedPlace(0);
    setGroups(guestsGroups);
  };
  const onSearch = () => {
    router.back();
    onClear();
  };
  const today = new Date().toISOString().substring(0, 10);
  const [groups, setGroups] = useState(guestsGroups);

  return (
    <BlurView style={styles.container} intensity={70} tint="light">
      {/* Where */}
      <Card
        cardNumber={0}
        collapsedTitle="Where"
        collapsedSubTitle="Any Place"
        cardTitle="Where To ?"
        {...{openCard, setOpenCard}}
        innerView={
          <View style={styles.searchSection}>
            <Ionicons
              name="ios-search"
              size={px(20)}
              style={styles.searchIcon}
            />
            <TextInput
              placeholderTextColor={Colors.grey}
              style={styles.inputField}
              placeholder={'Search Destination'}
            />
          </View>
        }
        outerView={
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: px(25),
              paddingHorizontal: px(20),
              paddingVertical: px(10),
            }}>
            {places.map((place, index) => (
              <TouchableOpacity
                key={place.title}
                style={styles.placesContainer}
                onPress={() => setSelectedPlace(0)}>
                <Image
                  source={place.img}
                  style={
                    selectedPlace === index
                      ? styles.placeSelected
                      : styles.place
                  }
                />
                <Text
                  style={{
                    fontFamily:
                      selectedPlace === index ? 'SemiBold' : 'Regular',
                    paddingTop: px(6),
                  }}>
                  {place.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        }
      />
      {/* When */}
      <Card
        cardNumber={1}
        collapsedTitle="When"
        collapsedSubTitle="Any week"
        {...{openCard, setOpenCard}}
        cardTitle="When's Your Trip"
        innerView={
          <DatePicker
            options={{
              defaultFont: 'Regular',
              headerFont: 'SemiBold',
              mainColor: Colors.primary,
              borderColor: 'transparent',
            }}
            current={today}
            selected={today}
            mode={'calendar'}
          />
        }
      />
      {/* Who */}
      <Card
        cardNumber={2}
        collapsedTitle="Who"
        collapsedSubTitle="Add guests"
        cardTitle="Who's Coming?"
        {...{openCard, setOpenCard}}
        innerView={
          <>
            {groups.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.guestItem,
                  index + 1 < guestsGroups.length ? styles.itemBorder : null,
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: px(10),
                  }}>
                  {item.icon}
                  <View>
                    <Text style={{fontFamily: 'SemiBold', fontSize: px(14)}}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Regular',
                        fontSize: px(14),
                        color: Colors.grey,
                      }}>
                      {item.text}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    gap: px(10),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      const newGroups = [...groups];
                      newGroups[index].count =
                        newGroups[index].count > 0
                          ? newGroups[index].count - 1
                          : 0;

                      setGroups(newGroups);
                    }}>
                    <Ionicons
                      name="remove-circle-outline"
                      size={px(26)}
                      color={groups[index].count > 0 ? Colors.grey : '#cdcdcd'}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: 'Regular',
                      fontSize: px(16),
                      minWidth: px(18),
                      textAlign: 'center',
                    }}>
                    {item.count}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const newGroups = [...groups];
                      newGroups[index].count++;
                      setGroups(newGroups);
                    }}>
                    <Ionicons
                      name="add-circle-outline"
                      size={px(26)}
                      color={Colors.grey}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        }
      />
      {/* Footer */}
      <Animated.View
        entering={SlideInDown.delay(200)}
        style={defaultStyles.footer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={onClear}>
            <Text
              style={{
                fontSize: px(18),
                fontFamily: 'SemiBold',
                textDecorationLine: 'underline',
              }}>
              Clear All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSearch}
            style={[
              defaultStyles.btn,
              {flexDirection: 'row', paddingLeft: px(50), paddingRight: px(20)},
            ]}>
            <Ionicons
              name="search-outline"
              size={px(24)}
              color={Colors.white}
              style={defaultStyles.btnIcon}
            />
            <Text style={defaultStyles.btnText}>Search</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: px(100),
  },

  searchSection: {
    height: px(50),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#ABABAB',
    borderRadius: px(8),
  },
  searchIcon: {
    padding: px(10),
  },
  inputField: {
    flex: 1,
    padding: px(10),
    backgroundColor: Colors.white,
  },
  placesContainer: {
    alignItems: 'center',
  },
  place: {
    width: px(100),
    height: px(100),
    borderRadius: px(10),
  },
  placeSelected: {
    borderColor: Colors.grey,
    borderWidth: px(2),
    borderRadius: px(10),
    width: px(100),
    height: px(100),
  },

  guestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: px(16),
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.grey,
  },
});
export default Booking;
