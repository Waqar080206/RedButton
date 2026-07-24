import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const ACTIVE_MACHINE = {
  id: 'MX-204',
  name: 'Hydraulic Press Line 4',
  zone: 'Bay C - North Floor',
  status: 'Machine scoped',
};

const OPEN_TASKS = [
  {
    icon: <Ionicons name="qr-code" size={19} color="#E11900" />,
    title: 'Scan machine tag',
    detail: 'Confirm QR scope before starting assisted guidance.',
  },
  {
    icon: <Ionicons name="document-text" size={19} color="#2F6FE0" />,
    title: 'Review cited SOP',
    detail: 'Last known lockout procedure is cached for this machine.',
  },
  {
    icon: <MaterialIcons name="support-agent" size={20} color="#F5A524" />,
    title: 'Safety officer online',
    detail: 'Escalations route to the current shift supervisor.',
  },
];

const RECENT_EVENTS = [
  '08:42 - QR scan verified for MX-204',
  '08:38 - Daily PPE checklist completed',
  '07:55 - Local SOP cache refreshed',
];

export default function WorkerDashboardScreen() {
  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Worker Dashboard</Text>
            <Text style={styles.title}>Ready for the floor</Text>
            <Text style={styles.subtitle}>
              Machine scope, emergency readiness, and shift safety signals in one place.
            </Text>
          </View>

          <View style={styles.machineCard}>
            <View style={styles.machineHeader}>
              <View style={styles.machineIcon}>
                <MaterialIcons name="precision-manufacturing" size={25} color="#E11900" />
              </View>
              <View style={styles.machineText}>
                <Text style={styles.machineName}>{ACTIVE_MACHINE.name}</Text>
                <Text style={styles.machineMeta}>
                  {ACTIVE_MACHINE.id} - {ACTIVE_MACHINE.zone}
                </Text>
              </View>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.statusPill}>
                <Ionicons name="shield-checkmark" size={15} color="#22A55E" />
                <Text style={styles.statusText}>{ACTIVE_MACHINE.status}</Text>
              </View>
              <Text style={styles.lastSynced}>Synced 4 min ago</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shift Readiness</Text>
            <View style={styles.metricGrid}>
              <Metric label="Guidance" value="3s" tone="#E11900" />
              <Metric label="PPE" value="100%" tone="#22A55E" />
              <Metric label="Open alerts" value="1" tone="#F5A524" />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Next Actions</Text>
            <View style={styles.taskList}>
              {OPEN_TASKS.map((task) => (
                <View key={task.title} style={styles.taskRow}>
                  <View style={styles.taskIcon}>{task.icon}</View>
                  <View style={styles.taskCopy}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskDetail}>{task.detail}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
              {RECENT_EVENTS.map((event) => (
                <Text key={event} style={styles.activityText}>
                  {event}
                </Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={[styles.metricValue, { color: tone }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
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
  machineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECEEF3',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  machineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  machineIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(225,25,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  machineText: {
    flex: 1,
    gap: Spacing.one,
  },
  machineName: {
    color: '#0F1729',
    fontSize: 18,
    fontWeight: '800',
  },
  machineMeta: {
    color: '#5B6472',
    fontSize: 13,
    lineHeight: 18,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'rgba(34,165,94,0.1)',
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  statusText: {
    color: '#167A42',
    fontSize: 12,
    fontWeight: '800',
  },
  lastSynced: {
    color: '#8A93A3',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    color: '#0F1729',
    fontSize: 18,
    fontWeight: '800',
  },
  metricGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  metricCard: {
    flex: 1,
    minHeight: 88,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECEEF3',
    padding: Spacing.three,
    justifyContent: 'space-between',
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  metricLabel: {
    color: '#5B6472',
    fontSize: 12,
    fontWeight: '700',
  },
  taskList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECEEF3',
  },
  taskRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  taskIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F6F7FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  taskTitle: {
    color: '#0F1729',
    fontSize: 14,
    fontWeight: '800',
  },
  taskDetail: {
    color: '#5B6472',
    fontSize: 13,
    lineHeight: 18,
  },
  activityCard: {
    backgroundColor: '#151923',
    borderRadius: 8,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  activityText: {
    color: '#E7EAF0',
    fontSize: 13,
    lineHeight: 19,
    fontVariant: ['tabular-nums'],
  },
});
