import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanguageSelector } from '@/components/language-selector';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const PREFERENCE_ITEMS = [
  { key: 'readAloud', icon: 'volume-high' as const },
  { key: 'escalation', icon: 'notifications' as const },
  { key: 'cacheSOPs', icon: 'cloud-offline' as const },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({
    readAloud: true,
    escalation: true,
    cacheSOPs: true,
  });

  const togglePreference = (key: string) => {
    setEnabledMap((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>{t('settings.eyebrow')}</Text>
            <Text style={styles.title}>{t('settings.title')}</Text>
            <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>
          </View>

          <View style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <Ionicons name="warning" size={22} color="#F5A524" />
            </View>
            <View style={styles.alertCopy}>
              <Text style={styles.alertTitle}>{t('settings.alert.title')}</Text>
              <Text style={styles.alertText}>{t('settings.alert.text')}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.settingsCard}>
              <LanguageSelector variant="settingsRow" />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.sectionPreferences')}</Text>
            <View style={styles.settingsCard}>
              {PREFERENCE_ITEMS.map((item) => (
                <View key={item.key} style={styles.settingRow}>
                  <View style={styles.settingIcon}>
                    <Ionicons name={item.icon} size={19} color="#E11900" />
                  </View>
                  <View style={styles.settingCopy}>
                    <Text style={styles.settingTitle}>{t(`settings.prefs.${item.key}.title`)}</Text>
                    <Text style={styles.settingDetail}>
                      {t(`settings.prefs.${item.key}.detail`)}
                    </Text>
                  </View>
                  <Switch
                    value={enabledMap[item.key]}
                    onValueChange={() => togglePreference(item.key)}
                    trackColor={{ false: '#D4D8E1', true: '#F4A49A' }}
                    thumbColor={enabledMap[item.key] ? '#E11900' : '#FFFFFF'}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.sectionReadiness')}</Text>
            <View style={styles.readinessCard}>
              <ReadinessRow label={t('settings.readiness.camera')} value={t('settings.readiness.ready')} />
              <ReadinessRow
                label={t('settings.readiness.microphone')}
                value={t('settings.readiness.ready')}
              />
              <ReadinessRow
                label={t('settings.readiness.location')}
                value={t('settings.readiness.whileUsing')}
              />
              <ReadinessRow
                label={t('settings.readiness.sopCache')}
                value={t('settings.readiness.updated')}
              />
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
