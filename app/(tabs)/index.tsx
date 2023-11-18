import {
  Category,
  ExploreHeader,
  ListingsBottomSheet,
  ListingsMap,
} from '@/components';
import {Stack} from 'expo-router';
import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import listingsData from '@/assets/data/airbnb-listings.json';
import listingsDataGeo from '@/assets/data/airbnb-listings.geo.json';
const Explore = () => {
  const [category, setCategory] = useState<string>('Tiny homes');
  const items = useMemo(() => listingsData as any, []);
  const geoItems: any = useMemo(() => listingsDataGeo, []);
  const onCategoryChanged = (category: Category['name']) => {
    setCategory(category);
  };
  return (
    <View style={{flex: 1}}>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onCategoryChanged} />,
        }}
      />
      <ListingsMap listings={geoItems?.features} />
      <ListingsBottomSheet listings={items} category={category} />
    </View>
  );
};

export default Explore;
