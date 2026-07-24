import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export function SectionBadge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Ionicons name="sparkles" size={13} color="#E11900" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(225,25,0,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  label: {
    color: '#E11900',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
