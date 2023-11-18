import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {FC, memo, useEffect, useRef} from 'react';
import {px} from '@/constants/Layouts';
import {defaultStyles} from '@/constants/Styles';
import MapView from 'react-native-map-clustering';
import {Ionicons} from '@expo/vector-icons';
import * as Location from 'expo-location';
import {useRouter} from 'expo-router';
import Colors from '@/constants/Colors';
import {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

interface ListingsMapProps {
  listings: Array<any>;
}
const INITIAL_REGION = {
  latitude: 52.52437,
  longitude: 13.41053,
  latitudeDelta: 9,
  longitudeDelta: 9,
};
const ListingsMapComp: FC<ListingsMapProps> = ({listings}) => {
  const mapRef = useRef<any>(null);
  const router = useRouter();
  // When the component mounts, locate the user
  useEffect(() => {
    onLocateMe();
  }, []);

  // When a marker is selected, navigate to the listing page
  const onMarkerSelected = (event: any) => {
    router.push(`/listing/${event.properties.id}`);
  };

  // Focus the map on the user's location
  const onLocateMe = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 7,
      longitudeDelta: 7,
    };

    mapRef.current?.animateToRegion(region);
  };

  // Overwrite the renderCluster function to customize the cluster markers
  const renderCluster = (cluster: any) => {
    const {id, geometry, onPress, properties} = cluster;

    const points = properties.point_count;
    return (
      <Marker
        key={`cluster-${id}`}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
        onPress={onPress}>
        <View style={styles.marker}>
          <Text
            style={{
              color: '#000',
              textAlign: 'center',
              fontFamily: 'SemiBold',
            }}>
            {points}
          </Text>
        </View>
      </Marker>
    );
  };
  return (
    <View style={defaultStyles.container}>
      <MapView
        ref={mapRef}
        animationEnabled={false}
        style={StyleSheet.absoluteFillObject}
        clusterColor="#fff"
        initialRegion={INITIAL_REGION}
        provider={PROVIDER_GOOGLE}
        clusterTextColor="#000"
        clusterFontFamily="SemiBold"
        renderCluster={renderCluster}>
        {/* Render all our marker as usual */}
        {listings.map((item: any) => (
          <Marker
            coordinate={{
              latitude: item.properties.latitude,
              longitude: item.properties.longitude,
            }}
            key={item.properties.id}
            onPress={() => onMarkerSelected(item)}>
            <View style={styles.marker}>
              <Text style={styles.markerText}>€ {item.properties.price}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity style={styles.locateBtn} onPress={onLocateMe}>
        <Ionicons name="navigate" size={24} color={Colors.dark} />
      </TouchableOpacity>
    </View>
  );
};
export const ListingsMap = memo(ListingsMapComp);
const styles = StyleSheet.create({
  marker: {
    padding: px(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    elevation: 5,
    borderRadius: px(12),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  markerText: {
    fontSize: px(14),
    fontFamily: 'SemiBold',
  },
  locateBtn: {
    position: 'absolute',
    top: px(70),
    right: px(20),
    backgroundColor: Colors.white,
    padding: px(10),
    borderRadius: px(10),
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
});
