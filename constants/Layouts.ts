import {Dimensions, PixelRatio} from 'react-native';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
const designWidth = screenWidth > 600 ? 700 : 375;

export const px = (value: number) => {
  const ratio = screenWidth / designWidth;
  return PixelRatio.roundToNearestPixel(value * ratio);
};
export const IMG_HEIGHT = px(300);
