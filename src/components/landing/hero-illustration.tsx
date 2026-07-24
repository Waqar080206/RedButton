import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { AiAssistantCard } from '@/components/landing/ai-assistant-card';

export function HeroIllustration() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.4] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['#EEF1F6', '#E4E9F2', '#DCE3EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.panel}>
        <View style={styles.hardHatBadge}>
          <MaterialCommunityIcons name="hard-hat" size={18} color="#0F1729" />
        </View>

        <View style={styles.machineIcon}>
          <MaterialIcons name="precision-manufacturing" size={84} color="#2B3245" />
        </View>

        <View style={styles.buttonRow}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pulseRing,
              { opacity: ringOpacity, transform: [{ scale: ringScale }] },
            ]}
          />
          <View style={styles.miniRedButton}>
            <Ionicons name="power" size={20} color="#ffffff" />
          </View>
        </View>
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
    height: 220,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hardHatBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  machineIcon: {
    opacity: 0.9,
  },
  buttonRow: {
    position: 'absolute',
    bottom: 18,
    right: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E11900',
  },
  miniRedButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E11900',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#E11900',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  floatingCard: {
    position: 'absolute',
    top: -24,
    right: 12,
  },
});
