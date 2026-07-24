import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AiAssistantCard } from '@/components/landing/ai-assistant-card';

export function HeroIllustration() {
  return (
    <View style={styles.wrap}>
      <Image
        source={require('@/assets/images/homepagebg.png')}
        style={styles.heroImage}
        contentFit="contain"
      />

      <View style={styles.floatingCard}>
        <AiAssistantCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginTop: 8,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 1024 / 997,
    transform: [{ translateX: -24 }],
  },
  floatingCard: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});
