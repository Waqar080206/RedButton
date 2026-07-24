import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const NOTIFICATIONS = [
  {
    icon: 'document-text' as const,
    title: 'New SOP uploaded',
    detail: 'Lockout/tagout procedure v3 is ready for review.',
    time: '5m ago',
  },
  {
    icon: 'shield-checkmark' as const,
    title: 'Supervisor joined incident #204',
    detail: 'Akshat joined the active emergency session.',
    time: '22m ago',
  },
  {
    icon: 'warning' as const,
    title: 'Incident resolved',
    detail: 'Bay C forklift incident marked as resolved.',
    time: '1h ago',
  },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Notifications</Text>
            <Text style={styles.title}>Recent activity</Text>
            <Text style={styles.subtitle}>
              Updates on documents, incidents and system status.
            </Text>
          </View>

          <View style={styles.card}>
            {NOTIFICATIONS.map((item) => (
              <View key={item.title} style={styles.row}>
                <View style={styles.icon}>
                  <Ionicons name={item.icon} size={19} color="#E11900" />
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
    color: '#E11900',
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
    backgroundColor: 'rgba(225,25,0,0.1)',
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
