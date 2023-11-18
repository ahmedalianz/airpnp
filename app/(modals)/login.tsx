import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {defaultStyles} from '@/constants/Styles';
import Colors from '@/constants/Colors';
import {Ionicons} from '@expo/vector-icons';
import {useWarmUpBrowser} from '@/hooks/useWarmUpBrowser';
import {useOAuth} from '@clerk/clerk-expo';
import {useRouter} from 'expo-router';
import {px} from '@/constants/Layouts';
enum Strategy {
  Apple = 'oauth_apple',
  Google = 'oauth_google',
  Facebook = 'oauth_facebook',
}
const Login = () => {
  useWarmUpBrowser();
  const router = useRouter();
  const {startOAuthFlow: appleAuth} = useOAuth({strategy: 'oauth_apple'});
  const {startOAuthFlow: googleAuth} = useOAuth({strategy: 'oauth_google'});
  const {startOAuthFlow: facebookAuth} = useOAuth({strategy: 'oauth_facebook'});
  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Facebook]: facebookAuth,
      [Strategy.Apple]: appleAuth,
    }[strategy];
    try {
      const {createdSessionId, setActive} = await selectedAuth();
      if (createdSessionId) {
        setActive!({session: createdSessionId});
        router.back();
      }
    } catch (err) {
      console.log('Error in OAuth ==>', err);
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        style={[defaultStyles.inputField, {marginBottom: px(30)}]}
      />
      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>Continue</Text>
      </TouchableOpacity>
      <View style={styles.separatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}></View>
        <Text style={styles.separator}>or</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}></View>
      </View>
      <View style={{gap: px(20)}}>
        <TouchableOpacity style={styles.btnOutline}>
          <Ionicons
            name="call-outline"
            style={defaultStyles.btnIcon}
            size={px(24)}
          />
          <Text style={styles.btnOutlineText}>Continue With Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Apple)}>
          <Ionicons
            name="md-logo-apple"
            style={defaultStyles.btnIcon}
            size={px(24)}
          />
          <Text style={styles.btnOutlineText}>Continue With Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Google)}>
          <Ionicons
            name="md-logo-google"
            style={defaultStyles.btnIcon}
            size={px(24)}
          />
          <Text style={styles.btnOutlineText}>Continue With Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Facebook)}>
          <Ionicons
            name="md-logo-facebook"
            style={defaultStyles.btnIcon}
            size={px(24)}
          />
          <Text style={styles.btnOutlineText}>Continue With Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: px(26),
  },
  separatorView: {
    flexDirection: 'row',
    gap: px(10),
    alignItems: 'center',
    marginVertical: px(30),
  },
  separator: {
    color: Colors.grey,
    fontFamily: 'SemiBold',
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.grey,
    height: px(50),
    borderRadius: px(8),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: px(10),
  },
  btnOutlineText: {
    color: '#000',
    fontSize: px(16),
    fontFamily: 'SemiBold',
  },
});
