import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button} from 'react-native';
import {useAuth, useUser} from '@clerk/clerk-expo';
import {Link} from 'expo-router';
import Colors from '@/constants/Colors';
import {px} from '@/constants/Layouts';
import {Ionicons} from '@expo/vector-icons';
import {defaultStyles} from '@/constants/Styles';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const {signOut, isSignedIn} = useAuth();
  const {user} = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.emailAddresses?.[0]?.emailAddress);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    if (!isSignedIn) return;
    setFirstName(user?.firstName);
    setLastName(user?.lastName);
    setEmail(user?.emailAddresses?.[0]?.emailAddress);
  }, []);
  const onSaveUser = async () => {
    try {
      firstName &&
        lastName &&
        (await user?.update({
          firstName,
          lastName,
        }));
    } catch (error) {
      console.log('Error saving user ==> ', error);
    } finally {
      setEdit(false);
    }
  };
  const onCaptureImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.75,
      base64: true,
      allowsEditing: true,
    });
    if (!result.canceled) {
      let image = `data:image/png;base64,${result.assets?.[0]?.base64}`;
      await user?.setProfileImage({
        file: image,
      });
    }
  };
  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.headerContainer}>
        <Text>Profile</Text>
        <Ionicons name="notifications-outline" size={px(26)} />
      </View>
      {user && (
        <View style={styles.card}>
          <TouchableOpacity onPress={onCaptureImage}>
            <Image source={{uri: user?.imageUrl}} style={styles.avatar} />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', gap: 6}}>
            {!edit && (
              <View style={styles.editRow}>
                <Text style={{fontFamily: 'Bold', fontSize: px(22)}}>
                  {firstName} {lastName}
                </Text>
                <TouchableOpacity onPress={() => setEdit(true)}>
                  <Ionicons
                    name="create-outline"
                    size={24}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            )}
            {edit && (
              <View style={styles.editRow}>
                <TextInput
                  placeholder="First Name"
                  value={firstName || ''}
                  onChangeText={setFirstName}
                  style={[defaultStyles.inputField, {width: px(100)}]}
                />
                <TextInput
                  placeholder="Last Name"
                  value={lastName || ''}
                  onChangeText={setLastName}
                  style={[defaultStyles.inputField, {width: px(100)}]}
                />
                <TouchableOpacity onPress={onSaveUser}>
                  <Ionicons
                    name="checkmark-outline"
                    size={24}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text>{email}</Text>
          <Text>Since {user?.createdAt!.toLocaleDateString()}</Text>
        </View>
      )}
      {isSignedIn && (
        <Button title="Log Out" onPress={() => signOut()} color={Colors.dark} />
      )}
      {!isSignedIn && (
        <Link href={'/(modals)/login'} asChild>
          <Button title="Log In" color={Colors.dark} />
        </Link>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: px(24),
  },
  header: {
    fontFamily: 'Bold',
    fontSize: px(24),
  },
  card: {
    backgroundColor: Colors.white,
    padding: px(24),
    borderRadius: px(16),
    marginHorizontal: px(24),
    marginTop: px(24),
    elevation: 2,
    shadowColor: Colors.dark,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    alignItems: 'center',
    gap: px(14),
    marginBottom: px(24),
  },
  avatar: {
    width: px(100),
    height: px(100),
    borderRadius: px(50),
    backgroundColor: Colors.grey,
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(8),
  },
});
export default Profile;
