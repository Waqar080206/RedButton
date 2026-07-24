import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const RED = '#E11900';
const RED_DARK = '#B31400';

export default function HomeScreen() {
  const [armed, setArmed] = useState(false);
  const pulse = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  const onPressIn = () =>
    Animated.spring(press, { toValue: 0.92, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(press, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.brand}>
            🔴 Red Button
          </ThemedText>
          <ThemedText type="small" style={styles.tagline}>
            Emergency assistant for industrial safety
          </ThemedText>
        </View>

        <View style={styles.buttonZone}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ring,
              { opacity: ringOpacity, transform: [{ scale: ringScale }] },
            ]}
          />
          <Animated.View style={{ transform: [{ scale: press }] }}>
            <Pressable
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => setArmed((v) => !v)}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              accessibilityRole="button"
              accessibilityLabel="Emergency red button">
              <ThemedText style={styles.buttonLabel}>
                {armed ? 'ACTIVE' : 'HOLD IN\nEMERGENCY'}
              </ThemedText>
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <ThemedView type="backgroundElement" style={styles.statusCard}>
            <ThemedText type="small" style={styles.statusLabel}>
              Machine scope
            </ThemedText>
            <ThemedText type="defaultSemiBold">
              {armed ? 'Awaiting scan…' : 'No machine scanned'}
            </ThemedText>
          </ThemedView>
          <ThemedText type="small" style={styles.hint}>
            Scan a machine QR/NFC tag, then tap the button to get instant, cited,
            machine-specific guidance.
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingTop: Spacing.four,
  },
  brand: {
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: RED,
  },
  button: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: RED_DARK,
    shadowColor: RED,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  buttonPressed: {
    backgroundColor: RED_DARK,
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
  },
  footer: {
    alignSelf: 'stretch',
    gap: Spacing.three,
    paddingBottom: Spacing.three,
  },
  statusCard: {
    alignSelf: 'stretch',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  statusLabel: {
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  hint: {
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: Spacing.three,
  },
});
