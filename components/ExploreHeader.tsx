import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useRef, useState} from 'react';
import Colors from '@/constants/Colors';
import {Ionicons} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {Link} from 'expo-router';
import {px} from '@/constants/Layouts';
export interface Category {
  name: string;
  icon:
    | 'home'
    | 'house-siding'
    | 'local-fire-department'
    | 'videogame-asset'
    | 'apartment'
    | 'beach-access'
    | 'nature-people';
}
const categories: Array<Category> = [
  {
    name: 'Tiny homes',
    icon: 'home',
  },
  {
    name: 'Cabins',
    icon: 'house-siding',
  },
  {
    name: 'Trending',
    icon: 'local-fire-department',
  },
  {
    name: 'Play',
    icon: 'videogame-asset',
  },
  {
    name: 'City',
    icon: 'apartment',
  },
  {
    name: 'Beachfront',
    icon: 'beach-access',
  },
  {
    name: 'Countryside',
    icon: 'nature-people',
  },
];

interface Props {
  onCategoryChanged: (category: Category['name']) => void;
}

export const ExploreHeader = ({onCategoryChanged}: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure(x => {
      scrollRef.current?.scrollTo({x: x - px(16), y: 0, animated: true});
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        paddingTop: Platform.OS === 'android' ? px(40) : 0,
      }}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <Link href={'/(modals)/booking'} asChild>
            <TouchableOpacity>
              <View style={styles.searchBtn}>
                <Ionicons name="search" size={24} />
                <View>
                  <Text style={{fontFamily: 'SemiBold'}}>Where to?</Text>
                  <Text style={{color: Colors.grey, fontFamily: 'Regular'}}>
                    Anywhere · Any week
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            gap: 20,
            paddingHorizontal: 16,
          }}>
          {categories.map((item, index) => (
            <TouchableOpacity
              ref={el => (itemsRef.current[index] = el)}
              key={index}
              style={
                activeIndex === index
                  ? styles.categoriesBtnActive
                  : styles.categoriesBtn
              }
              onPress={() => selectCategory(index)}>
              <MaterialIcons
                name={item.icon}
                size={24}
                color={activeIndex === index ? '#000' : Colors.grey}
              />
              <Text
                style={
                  activeIndex === index
                    ? styles.categoryTextActive
                    : styles.categoryText
                }>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: px(135),
    elevation: 2,
    shadowColor: Colors.dark,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: px(24),
    paddingBottom: px(16),
  },

  searchBtn: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    gap: px(10),
    padding: px(14),
    alignItems: 'center',
    width: px(280),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: px(30),
    elevation: 2,
    shadowColor: Colors.dark,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  filterBtn: {
    padding: px(10),
    borderWidth: 1,
    borderColor: '#A2A0A2',
    borderRadius: px(24),
  },
  categoryText: {
    fontSize: px(14),
    fontFamily: 'SemiBold',
    color: Colors.grey,
  },
  categoryTextActive: {
    fontSize: px(14),
    fontFamily: 'SemiBold',
    color: Colors.dark,
  },
  categoriesBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: px(8),
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: Colors.dark,
    borderBottomWidth: px(2),
    paddingBottom: px(8),
  },
});
