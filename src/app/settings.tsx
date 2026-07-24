import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const PREFERENCES = [
  {
    icon: 'volume-high' as const,
    title: 'Read guidance aloud',
    detail: 'Use TTS for emergency steps in noisy areas.',
    enabled: true,
  },
  {
    icon: 'notifications' as const,
    title: 'Escalation alerts',
    detail: 'Notify this device when a supervisor joins.',
    enabled: true,
  },
  {
    icon: 'cloud-offline' as const,
    title: 'Cache last SOPs',
    detail: 'Keep machine procedures available during weak connectivity.',
    enabled: true,
  },
];

export default function SettingsScreen() {
  const [preferences, setPreferences] = useState(PREFERENCES);

  const togglePreference = (title: string) => {
    setPreferences((current) =>
      current.map((item) => (item.title === title ? { ...item, enabled: !item.enabled } : item)),
    );
  };

  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Settings</Text>
            <Text style={styles.title}>Safety preferences</Text>
            <Text style={styles.subtitle}>
              Configure emergency guidance, escalation, and device readiness for the worker app.
            </Text>
          </View>

          <View style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <Ionicons name="warning" size={22} color="#F5A524" />
            </View>
            <View style={styles.alertCopy}>
              <Text style={styles.alertTitle}>Actuation requires confirmation</Text>
              <Text style={styles.alertText}>
                High-stakes actions stay behind hold-to-confirm and audit logging.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Worker Preferences</Text>
            <View style={styles.settingsCard}>
              {preferences.map((item) => (
                <View key={item.title} style={styles.settingRow}>
                  <View style={styles.settingIcon}>
                    <Ionicons name={item.icon} size={19} color="#E11900" />
                  </View>
                  <View style={styles.settingCopy}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingDetail}>{item.detail}</Text>
                  </View>
                  <Switch
                    value={item.enabled}
                    onValueChange={() => togglePreference(item.title)}
                    trackColor={{ false: '#D4D8E1', true: '#F4A49A' }}
                    thumbColor={item.enabled ? '#E11900' : '#FFFFFF'}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Device Readiness</Text>
            <View style={styles.readinessCard}>
              <ReadinessRow label="Camera permission" value="Ready" />
              <ReadinessRow label="Microphone permission" value="Ready" />
              <ReadinessRow label="Location access" value="While using" />
              <ReadinessRow label="SOP cache" value="Updated" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ReadinessRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.readinessRow}>
      <Text style={styles.readinessLabel}>{label}</Text>
      <View style={styles.readinessValueWrap}>
        <Text style={styles.readinessValue}>{value}</Text>
        <Ionicons name="checkmark-circle" size={18} color="#22A55E" />
      </View>
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
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: '#FFF7E8',
    borderRadius: 8,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: '#FFE3AE',
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  alertTitle: {
    color: '#0F1729',
    fontSize: 15,
    fontWeight: '900',
  },
  alertText: {
    color: '#6F5524',
    fontSize: 13,
    lineHeight: 18,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    color: '#0F1729',
    fontSize: 18,
    fontWeight: '800',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECEEF3',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(225,25,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  settingTitle: {
    color: '#0F1729',
    fontSize: 14,
    fontWeight: '900',
  },
  settingDetail: {
    color: '#5B6472',
    fontSize: 13,
    lineHeight: 18,
  },
  readinessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECEEF3',
  },
  readinessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    padding: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  readinessLabel: {
    color: '#0F1729',
    fontSize: 14,
    fontWeight: '800',
  },
  readinessValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  readinessValue: {
    color: '#5B6472',
    fontSize: 13,
    fontWeight: '800',
  },
});
