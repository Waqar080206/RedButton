import { StyleSheet, Text, View } from 'react-native';

type Props = {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
};

export function StatItem({ icon, iconBg, value, label }: Props) {
  return (
    <View style={styles.item}>
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexGrow: 1,
    flexBasis: 100,
    alignItems: 'center',
    gap: 4,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  value: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F1729',
  },
  label: {
    fontSize: 11.5,
    color: '#667085',
    textAlign: 'center',
    lineHeight: 15,
  },
});
