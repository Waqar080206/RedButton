import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
};

export function PrimaryButton({ label, icon, onPress, variant = 'primary' }: Props) {
  const scale = useMemo(() => new Animated.Value(1), []);

  const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();

  const content = (
    <>
      <Ionicons
        name={icon}
        size={18}
        color={variant === 'primary' ? '#ffffff' : '#0F1729'}
        style={styles.leftIcon}
      />
      <Text style={[styles.label, variant === 'secondary' && styles.labelSecondary]}>
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={variant === 'primary' ? '#ffffff' : '#0F1729'}
      />
    </>
  );

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        {variant === 'primary' ? (
          <LinearGradient
            colors={['#F0331B', '#C51200']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}>
            {content}
          </LinearGradient>
        ) : (
          <Animated.View style={[styles.button, styles.buttonSecondary]}>{content}</Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 17,
    paddingHorizontal: 22,
    borderRadius: 18,
    shadowColor: '#E11900',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E7E9F0',
    shadowColor: '#0F1729',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  leftIcon: {
    marginRight: -2,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  labelSecondary: {
    color: '#0F1729',
  },
});
