import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { LogoMark } from '@/components/landing/logo-mark';
import { MaxContentWidth } from '@/constants/theme';

const NAV_HEIGHT = 78;

type NavKey = "home" | "profile" | "settings";

type NavItem = {
  key: NavKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: 'home',
    label: 'Home',
    icon: 'home',
    route: '/worker-dashboard',
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: 'person-outline',
    route: '/profile',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'settings-outline',
    route: '/settings',
  },
];

export default function WorkerDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<NavKey>('home');

  const press = useRef(new Animated.Value(0)).current;
  const capTranslateY = press.interpolate({ inputRange: [0, 1], outputRange: [0, 7] });
  const capScale = press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.985] });
  const rimOpacity = press.interpolate({ inputRange: [0, 1], outputRange: [0.28, 0.06] });
  const highlightOpacity = press.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.15] });

  const pressIn = () =>
    Animated.timing(press, {
      toValue: 1,
      duration: 90,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

  const pressOut = () =>
    Animated.spring(press, {
      toValue: 0,
      friction: 4,
      tension: 140,
      useNativeDriver: true,
    }).start();

  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: NAV_HEIGHT + insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <LogoMark size={36} />
              <Text style={styles.brandText}>
                Red <Text style={styles.brandTextBold}>Button</Text>
              </Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SK</Text>
            </View>
          </View>

          {/* Headline */}
          <View style={styles.headlineBlock}>
            <Text style={styles.headline}>Press the</Text>
            <Text style={[styles.headline, styles.headlineRed]}>Red Button</Text>
            <Text style={styles.headline}>in an emergency</Text>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#E11900" />
            </View>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.subhead}>
            Get instant guidance and connect{'\n'}with the right help when it matters most.
          </Text>

          {/* Red Button */}
          <View style={styles.buttonZone}>
            <View style={styles.glow} pointerEvents="none" />

            <Pressable
              onPressIn={pressIn}
              onPressOut={pressOut}
              onPress={() => router.push('/chat')}
              accessibilityRole="button"
              accessibilityLabel="Press Red Button in an emergency">
              {/* Fixed white bezel — does not move */}
              <View style={styles.redButtonBase}>
                <Animated.View
                  style={[styles.capShadowRim, { opacity: rimOpacity }]}
                  pointerEvents="none"
                />

                {/* Only the red cap animates */}
                <Animated.View
                  style={{ transform: [{ translateY: capTranslateY }, { scale: capScale }] }}>
                  <LinearGradient
                    colors={['#FF5B47', '#E11900', '#7A0D00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.redButtonCap}>
                    <Animated.View
                      style={[styles.capHighlight, { opacity: highlightOpacity }]}
                      pointerEvents="none"
                    />
                    <View style={styles.targetRing}>
                      <View style={styles.targetDot} />
                    </View>
                    <Text style={styles.pressLabel}>PRESS</Text>
                    <Text style={styles.pressSubLabel}>RED BUTTON</Text>
                  </LinearGradient>
                </Animated.View>
              </View>
            </Pressable>
          </View>

          {/* Warning card */}
          <View style={styles.warningCard}>
            <View style={styles.warningIcon}>
              <MaterialCommunityIcons name="alert" size={20} color="#E11900" />
            </View>
            <View style={styles.warningTextWrap}>
              <Text style={styles.warningTitle}>Use tools only in genuine emergency.</Text>
              <Text style={styles.warningSubtitle}>
                Misuse can delay help for those who need it.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom nav */}
      <View style={[styles.navBarWrap, { bottom: insets.bottom + 16 }]} pointerEvents="box-none">
        <View style={styles.navBar}>
          {NAV_ITEMS.map((item) => {
            const selected = activeTab === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => {  setActiveTab(item.key);  router.navigate(item.route);}}
                style={[styles.navItem, selected && styles.navItemSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected }}>
                <Ionicons name={item.icon} size={22} color={selected ? '#E11900' : '#5B6472'} />
                <Text style={[styles.navLabel, selected && styles.navLabelSelected]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
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
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  /* Top bar */
  topBar: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 20,
  },
  brandRow: {
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(225,25,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#E11900',
  },

  /* Headline */
  headlineBlock: {
    alignItems: 'center',
    marginTop: 16,
  },
  headline: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: '#0F1729',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  headlineRed: {
    color: '#E11900',
  },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 340,
    marginTop: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E7E9F0',
  },
  dividerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(225,25,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subhead: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5B6472',
    textAlign: 'center',
    marginTop: 20,
    maxWidth: 320,
  },

  /* Red button */
  buttonZone: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 44,
    marginBottom: 12,
  },
  glow: {
    position: 'absolute',
    width: 440,
    height: 440,
    borderRadius: 220,
    backgroundColor: 'rgba(225,25,0,0.35)',
    ...Platform.select({
      web: { filter: 'blur(90px)' },
      default: { filter: [{ blur: 90 }] },
    }),
  },
  redButtonBase: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
    borderWidth: 3,
    borderTopColor: '#ffffff',
    borderLeftColor: '#F2F3F7',
    borderRightColor: '#F2F3F7',
    borderBottomColor: '#DCE0E7',
    shadowColor: '#E11900',
    shadowOpacity: 0.3,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
    elevation: 14,
  },
  capShadowRim: {
    position: 'absolute',
    bottom: 6,
    left: '50%',
    marginLeft: -95,
    width: 190,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5A0900',
    ...Platform.select({
      web: { filter: 'blur(14px)' },
      default: { filter: [{ blur: 14 }] },
    }),
  },
  redButtonCap: {
    width: 258,
    height: 258,
    borderRadius: 129,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(122,13,0,0.35)',
    shadowColor: '#7A0D00',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  capHighlight: {
    position: 'absolute',
    top: 16,
    left: '50%',
    marginLeft: -70,
    width: 140,
    height: 66,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    ...Platform.select({
      web: { filter: 'blur(18px)' },
      default: { filter: [{ blur: 18 }] },
    }),
  },
  targetRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 6,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  targetDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#ffffff',
  },
  pressLabel: {
    fontSize: 30,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  pressSubLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1.5,
  },

  /* Warning card */
  warningCard: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: 'rgba(225,25,0,0.07)',
    borderRadius: 18,
    padding: 18,
    marginTop: 36,
  },
  warningIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  warningTextWrap: {
    flex: 1,
    gap: 4,
  },
  warningTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#E11900',
    lineHeight: 20,
  },
  warningSubtitle: {
    fontSize: 13.5,
    color: '#5B6472',
    lineHeight: 19,
  },

  /* Bottom nav */
  navBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navBar: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: MaxContentWidth,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 8,
    gap: 8,
    shadowColor: '#0F1729',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    borderRadius: 16,
  },
  navItemSelected: {
    backgroundColor: 'rgba(225,25,0,0.08)',
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B6472',
  },
  navLabelSelected: {
    color: '#E11900',
    fontWeight: '700',
  },
});
