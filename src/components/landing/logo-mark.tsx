import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

const ASPECT_RATIO = 112 / 126;

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <Image
      source={require('@/assets/images/app-logo.png')}
      style={[styles.logo, { height: size, width: size * ASPECT_RATIO }]}
      contentFit="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    aspectRatio: ASPECT_RATIO,
  },
});
