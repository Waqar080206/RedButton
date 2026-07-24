import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { AiAssistantCard } from '@/components/landing/ai-assistant-card';

export function HeroIllustration() {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['#EEF1F6', '#E4E9F2', '#DCE3EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.panel}>
        <Image
          source={require('@/assets/images/homepagebg.png')}
          style={styles.heroImage}
          contentFit="contain"
          contentPosition="bottom"
        />
      </LinearGradient>

      <View style={styles.floatingCard}>
        <AiAssistantCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginTop: 28,
  },
  panel: {
    height: 260,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  pulseRing: {
    position: 'absolute',
    bottom: 46,
    right: 76,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E11900',
  },
  floatingCard: {
    position: 'absolute',
    top: -24,
    right: 12,
  },
});
