import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FeatureCard } from '@/components/landing/feature-card';
import { HeroIllustration } from '@/components/landing/hero-illustration';
import { LogoMark } from '@/components/landing/logo-mark';
import { PrimaryButton } from '@/components/landing/primary-button';
import { SectionBadge } from '@/components/landing/section-badge';
import { StatItem } from '@/components/landing/stat-item';
import { LanguageSelector } from '@/components/language-selector';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const STAT_ITEMS = [
  {
    icon: <MaterialIcons name="precision-manufacturing" size={18} color="#5B5FE9" />,
    iconBg: 'rgba(91,95,233,0.12)',
    value: '2,458',
    key: 'machines',
  },
  {
    icon: <Ionicons name="book" size={18} color="#E11900" />,
    iconBg: 'rgba(225,25,0,0.1)',
    value: '12,736',
    key: 'manuals',
  },
  {
    icon: <Ionicons name="shield-checkmark" size={18} color="#22A55E" />,
    iconBg: 'rgba(34,165,94,0.12)',
    value: '3,982',
    key: 'incidents',
  },
  {
    icon: <Ionicons name="time" size={18} color="#F5A524" />,
    iconBg: 'rgba(245,165,36,0.14)',
    value: '2.4 min',
    key: 'avgResponse',
  },
];

const FEATURE_ITEMS = [
  {
    icon: <Ionicons name="chatbubbles" size={20} color="#E11900" />,
    iconBg: 'rgba(225,25,0,0.1)',
    accentColor: '#E11900',
    key: 'instant',
  },
  {
    icon: <Ionicons name="document-text" size={20} color="#2F6FE0" />,
    iconBg: 'rgba(47,111,224,0.1)',
    accentColor: '#2F6FE0',
    key: 'docs',
  },
  {
    icon: <Ionicons name="people" size={20} color="#22A55E" />,
    iconBg: 'rgba(34,165,94,0.1)',
    accentColor: '#22A55E',
    key: 'oversight',
  },
];

export default function HomeScreen() {
  const menuScale = useMemo(() => new Animated.Value(1), []);
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.page}>
      <LinearGradient
        colors={['#F6F7FB', '#FFFFFF']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <LogoMark size={36} />
              <Text style={styles.brandText}>
                Red <Text style={styles.brandTextBold}>Button</Text>
              </Text>
            </View>
            <View style={styles.topBarActions}>
              <LanguageSelector variant="iconButton" />

              <Animated.View style={{ transform: [{ scale: menuScale }] }}>
                <Pressable
                  onPressIn={() =>
                    Animated.spring(menuScale, { toValue: 0.9, useNativeDriver: true }).start()
                  }
                  onPressOut={() =>
                    Animated.spring(menuScale, {
                      toValue: 1,
                      friction: 5,
                      useNativeDriver: true,
                    }).start()
                  }
                  style={styles.menuButton}
                  accessibilityRole="button"
                  accessibilityLabel={t('landing.menuA11y')}>
                  <Ionicons name="menu" size={20} color="#0F1729" />
                </Pressable>
              </Animated.View>
            </View>
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <SectionBadge label={t('landing.badge')} />

            <View style={styles.headlineBlock}>
              <Text style={styles.headline}>{t('landing.hero.line1')}</Text>
              <Text style={[styles.headline, styles.headlineRed]}>{t('landing.hero.line2')}</Text>
            </View>

            <Text style={styles.subhead}>{t('landing.subhead')}</Text>

            <HeroIllustration />
          </View>

          {/* CTAs */}
          <View style={styles.ctaGroup}>
            <PrimaryButton
              label={t('landing.cta.signIn')}
              icon="shield-checkmark"
              variant="primary"
              onPress={() => router.push('/login')}
            />
            <PrimaryButton
              label={t('landing.cta.learnMore')}
              icon="book-outline"
              variant="secondary"
            />
          </View>

          {/* Feature cards */}
          <View style={styles.featureRow}>
            {FEATURE_ITEMS.map((f) => (
              <FeatureCard
                key={f.key}
                icon={f.icon}
                iconBg={f.iconBg}
                accentColor={f.accentColor}
                title={t(`landing.features.${f.key}.title`)}
                description={t(`landing.features.${f.key}.desc`)}
              />
            ))}
          </View>

          {/* Stats */}
          <View style={styles.statsCard}>
            {STAT_ITEMS.map((s) => (
              <StatItem
                key={s.key}
                icon={s.icon}
                iconBg={s.iconBg}
                value={s.value}
                label={t(`landing.stats.${s.key}`)}
              />
            ))}
          </View>

          {/* Trust footer */}
          <View style={styles.trustBar}>
            <View style={styles.trustIcon}>
              <Ionicons name="shield-checkmark" size={18} color="#E11900" />
            </View>
            <View style={styles.trustTextWrap}>
              <Text style={styles.trustTitle}>{t('landing.trust.title')}</Text>
              <Text style={styles.trustSubtitle}>{t('landing.trust.subtitle')}</Text>
            </View>
            <Ionicons name="shield-checkmark-outline" size={22} color="rgba(225,25,0,0.4)" />
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
  scrollContent: {
    alignItems: 'center',
    paddingBottom: BottomTabInset + Spacing.five,
  },
  topBar: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E11900',
  },
  brandTextBold: {
    color: '#0F1729',
    fontWeight: '800',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F1729',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  hero: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },
  headlineBlock: {
    gap: 0,
  },
  headline: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '800',
    color: '#0F1729',
    letterSpacing: -0.5,
  },
  headlineRed: {
    color: '#E11900',
    fontWeight: '800',
  },
  subhead: {
    fontSize: 15.5,
    lineHeight: 23,
    color: '#5B6472',
    maxWidth: 420,
  },
  ctaGroup: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  featureRow: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.five,
  },
  statsCard: {
    width: '100%',
    maxWidth: MaxContentWidth,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.four,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: '#F0F1F5',
    shadowColor: '#0F1729',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    alignSelf: 'center',
  },
  trustBar: {
    width: '100%',
    maxWidth: MaxContentWidth,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: 'rgba(225,25,0,0.06)',
    borderRadius: 18,
    padding: Spacing.three,
  },
  trustIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(225,25,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustTextWrap: {
    flex: 1,
    gap: 2,
  },
  trustTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F1729',
  },
  trustSubtitle: {
    fontSize: 12,
    color: '#5B6472',
  },
});
