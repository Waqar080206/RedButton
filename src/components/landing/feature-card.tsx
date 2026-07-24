import { StyleSheet, Text, View } from 'react-native';

type Props = {
  icon: React.ReactNode;
  iconBg: string;
  accentColor: string;
  title: string;
  description: string;
};

export function FeatureCard({ icon, iconBg, accentColor, title, description }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: 160,
    minWidth: 150,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#F0F1F5',
    shadowColor: '#0F1729',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    color: '#0F1729',
  },
  description: {
    fontSize: 12.5,
    lineHeight: 17,
    color: '#667085',
  },
  accentBar: {
    width: 28,
    height: 3,
    borderRadius: 2,
    marginTop: 4,
  },
});
