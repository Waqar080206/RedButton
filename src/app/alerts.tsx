import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const ALERTS = [
  {
    icon: 'alert-circle' as const,
    title: 'Worker pressed Red Button',
    detail: 'Assembly Bay C — awaiting supervisor response.',
    time: '2m ago',
    color: '#E11900',
  },
  {
    icon: 'warning' as const,
    title: 'Gas Leak Alert',
    detail: 'Warehouse A — sensors report elevated readings.',
    time: '11m ago',
    color: '#F59E0B',
  },
  {
    icon: 'checkmark-circle' as const,
    title: 'Machine Shutdown Complete',
    detail: 'Line 4 — safe to resume once cleared.',
    time: '22m ago',
    color: '#22A55E',
  },
];

export default function AlertsScreen() {
  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Alerts</Text>
            <Text style={styles.title}>Live incidents</Text>
            <Text style={styles.subtitle}>
              Emergencies and system events across the factory floor.
            </Text>
          </View>

          <View style={styles.card}>
            {ALERTS.map((item) => (
              <View key={item.title} style={styles.row}>
                <View style={[styles.icon, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon} size={19} color={item.color} />
                </View>
                <View style={styles.copy}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowDetail}>{item.detail}</Text>
                </View>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.five,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.two,
  },
  eyebrow: {
    color: '#2F6FE0',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#0F1729',
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
  },
  subtitle: {
    color: '#5B6472',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECEEF3',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    padding: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: Spacing.one,
  },
  rowTitle: {
    color: '#0F1729',
    fontSize: 14,
    fontWeight: '900',
  },
  rowDetail: {
    color: '#5B6472',
    fontSize: 13,
    lineHeight: 18,
  },
  time: {
    color: '#8A93A3',
    fontSize: 12,
    fontWeight: '600',
  },
});
