import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <View style={[styles.shield, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <Ionicons name="radio-button-on" size={size * 0.42} color="#ffffff" />
    </View>
  );
}

const styles = StyleSheet.create({
  shield: {
    backgroundColor: '#E11900',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '0deg' }],
  },
});
