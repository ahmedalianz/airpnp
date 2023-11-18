import Colors from '@/constants/Colors';
import {px} from '@/constants/Layouts';
import {FC, memo} from 'react';
import {StyleSheet, Text} from 'react-native';
import {View} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {AnimatedTouchableOpacity} from './AnimatedTouchableOpacity';
export type CardNumberType = 0 | 1 | 2;
interface CardProps {
  cardNumber: CardNumberType;
  collapsedTitle: string;
  cardTitle: string;
  collapsedSubTitle: string;
  innerView?: React.ReactNode;
  outerView?: React.ReactNode;
  openCard: CardNumberType;
  setOpenCard: (cardNumber: CardNumberType) => void;
}
export const Card: FC<CardProps> = memo(
  ({
    cardNumber,
    collapsedTitle,
    cardTitle,
    collapsedSubTitle,
    innerView,
    outerView,
    openCard,
    setOpenCard,
  }) => {
    return (
      <View style={styles.card}>
        {openCard !== cardNumber ? (
          <AnimatedTouchableOpacity
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            onPress={() => setOpenCard(cardNumber)}
            style={styles.cardPreview}>
            <Text style={styles.previewText}>{collapsedTitle}</Text>
            <Text style={styles.previewDate}>{collapsedSubTitle}</Text>
          </AnimatedTouchableOpacity>
        ) : (
          <>
            <Animated.Text entering={FadeIn} style={styles.cardHeader}>
              {cardTitle}
            </Animated.Text>
            {innerView ? (
              <Animated.View
                entering={FadeIn.delay(100)}
                style={styles.cardBody}>
                {innerView}
              </Animated.View>
            ) : (
              <></>
            )}
            {outerView ? (
              <Animated.View entering={FadeIn.delay(200)}>
                {outerView}
              </Animated.View>
            ) : (
              <></>
            )}
          </>
        )}
      </View>
    );
  },
);
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: px(14),
    margin: px(10),
    elevation: 4,
    shadowColor: Colors.dark,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: px(20),
  },
  cardHeader: {
    fontFamily: 'Bold',
    fontSize: px(24),
    padding: px(20),
    paddingBottom: 0,
  },
  cardBody: {
    paddingHorizontal: px(20),
  },
  cardPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: px(20),
  },

  previewText: {
    fontFamily: 'SemiBold',
    fontSize: px(14),
    color: Colors.grey,
  },
  previewDate: {
    fontFamily: 'SemiBold',
    fontSize: px(14),
    color: Colors.dark,
  },
});
