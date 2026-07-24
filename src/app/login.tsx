import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LogoMark } from '@/components/landing/logo-mark';
import { MaxContentWidth } from '@/constants/theme';

type Role = 'worker' | 'supervisor' | 'admin';

const ROLES: {
  key: Role;
  label: string;
  color: string;
  tint: string;
  icon: React.ReactNode;
}[] = [
  {
    key: 'worker',
    label: 'Worker',
    color: '#E11900',
    tint: 'rgba(225,25,0,0.06)',
    icon: <MaterialCommunityIcons name="account-hard-hat" size={20} color="#E11900" />,
  },
  {
    key: 'supervisor',
    label: 'Supervisor',
    color: '#2F6FE0',
    tint: 'rgba(47,111,224,0.06)',
    icon: <Ionicons name="person" size={19} color="#2F6FE0" />,
  },
  {
    key: 'admin',
    label: 'Admin',
    color: '#7A4DF5',
    tint: 'rgba(122,77,245,0.06)',
    icon: <MaterialCommunityIcons name="shield-account" size={20} color="#7A4DF5" />,
  },
];

const TRUST = [
  {
    icon: <Ionicons name="shield-checkmark" size={22} color="#E11900" />,
    iconBg: 'rgba(225,25,0,0.1)',
    title: 'Secure',
    desc: 'Your data is encrypted and always protected',
  },
  {
    icon: <Ionicons name="document-text" size={22} color="#2F6FE0" />,
    iconBg: 'rgba(47,111,224,0.1)',
    title: 'Reliable',
    desc: 'Grounded in real manuals and SOPs',
  },
  {
    icon: <Ionicons name="people" size={22} color="#22A55E" />,
    iconBg: 'rgba(34,165,94,0.12)',
    title: 'Trusted',
    desc: 'Built for factories, by safety experts',
  },
];

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('worker');
  const [remember, setRemember] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;

  return (
    <View style={styles.page}>
      {/* Soft color blooms behind everything */}
      <View style={styles.bloomBase} pointerEvents="none" />
      <View style={[styles.bloom, styles.bloomRed]} pointerEvents="none" />
      <View style={[styles.bloom, styles.bloomBlue]} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Brand header */}
          <View style={styles.header}>
            <LogoMark size={92} />

            <Text style={styles.wordmark}>
              <Text style={styles.wordmarkRed}>Red</Text>
              <Text style={styles.wordmarkDark}> Button</Text>
            </Text>

            <Text style={styles.tagline}>AI Emergency Response Platform</Text>

            <View style={styles.pill}>
              <Ionicons name="shield-checkmark" size={15} color="#E11900" />
              <Text style={styles.pillText}>Smart guidance. Human oversight. Real safety.</Text>
            </View>
          </View>

          {/* Login card */}
          <View style={styles.card}>
            <Text style={styles.welcome}>Welcome Back!</Text>
            <Text style={styles.welcomeSub}>Sign in to continue to your account</Text>

            {/* Email */}
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={20} color="#8A93A6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#98A2B3"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <View style={styles.inputRow}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#8A93A6"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#98A2B3"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#3A4356"
                />
              </Pressable>
            </View>

            {/* Login as */}
            <Text style={styles.loginAs}>Login as</Text>
            <View style={styles.roleRow}>
              {ROLES.map((r) => {
                const selected = role === r.key;
                return (
                  <Pressable
                    key={r.key}
                    onPress={() => setRole(r.key)}
                    style={[
                      styles.roleButton,
                      selected && { borderColor: r.color, backgroundColor: r.tint },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}>
                    {r.icon}
                    <Text style={[styles.roleLabel, { color: r.color }]}>{r.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Remember / forgot */}
            <View style={styles.metaRow}>
              <Pressable
                style={styles.rememberRow}
                onPress={() => setRemember((v) => !v)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: remember }}>
                <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                  {remember && <Ionicons name="checkmark" size={13} color="#ffffff" />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>
              <Pressable hitSlop={8}>
                <Text style={styles.forgot}>Forgot password?</Text>
              </Pressable>
            </View>

            {/* Sign In */}
            <Animated.View style={{ transform: [{ scale }] }}>
              <Pressable
                onPressIn={() =>
                  Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start()
                }
                onPressOut={() =>
                  Animated.spring(scale, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: true,
                  }).start()
                }>
                <LinearGradient
                  colors={['#F0331B', '#C51200']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.signIn}>
                  <Text style={styles.signInText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </LinearGradient>
              </Pressable>
            </Animated.View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Ionicons name="lock-closed" size={15} color="#98A2B3" />
              <View style={styles.dividerLine} />
            </View>
            <Text style={styles.authorized}>Authorized Factory Personnel Only</Text>

            <Pressable
              style={[styles.skipButton, role !== 'worker' && styles.skipButtonDisabled]}
              disabled={role !== 'worker'}
              onPress={() => router.push('/worker-dashboard')}
              accessibilityRole="button"
              accessibilityLabel="Skip login and go to worker dashboard">
              <Ionicons
                name="play-skip-forward-outline"
                size={13}
                color={role === 'worker' ? '#E11900' : '#B7BDC9'}
              />
              <Text
                style={[
                  styles.skipButtonText,
                  role !== 'worker' && styles.skipButtonTextDisabled,
                ]}>
                Skip Login — Worker Dashboard
              </Text>
            </Pressable>
          </View>

          {/* Trust columns */}
          <View style={styles.trustRow}>
            {TRUST.map((t) => (
              <View key={t.title} style={styles.trustCol}>
                <View style={[styles.trustIcon, { backgroundColor: t.iconBg }]}>{t.icon}</View>
                <Text style={styles.trustTitle}>{t.title}</Text>
                <Text style={styles.trustDesc}>{t.desc}</Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerVersion}>Red Button v1.0.0</Text>
            <View style={styles.footerRow}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#98A2B3" />
              <Text style={styles.footerText}>Built for safety. Designed for people.</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  bloomBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F5F6FA',
  },
  bloom: {
    position: 'absolute',
    width: 460,
    height: 460,
    borderRadius: 230,
    ...Platform.select({
      web: { filter: 'blur(90px)' },
      default: { filter: [{ blur: 90 }] },
    }),
  },
  bloomRed: {
    top: 200,
    left: -190,
    backgroundColor: 'rgba(240,51,27,0.45)',
  },
  bloomBlue: {
    top: 90,
    right: -200,
    backgroundColor: 'rgba(47,111,224,0.42)',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },

  /* Header */
  header: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignItems: 'center',
    gap: 12,
  },
  wordmark: {
    marginTop: 4,
  },
  wordmarkRed: {
    fontSize: 42,
    fontWeight: '800',
    color: '#E11900',
    letterSpacing: -1,
  },
  wordmarkDark: {
    fontSize: 42,
    fontWeight: '800',
    color: '#0F1729',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 17,
    color: '#5B6472',
    fontWeight: '500',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(225,25,0,0.06)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginTop: 4,
  },
  pillText: {
    fontSize: 13.5,
    color: '#3A4356',
    fontWeight: '600',
  },

  /* Card */
  card: {
    width: '100%',
    maxWidth: MaxContentWidth,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    marginTop: 28,
    shadowColor: '#0F1729',
    shadowOpacity: 0.08,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
    elevation: 6,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F1729',
    textAlign: 'center',
  },
  welcomeSub: {
    fontSize: 14.5,
    color: '#8A93A6',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderWidth: 1.5,
    borderColor: '#E7E9F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15.5,
    color: '#0F1729',
    height: '100%',
  },
  loginAs: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1729',
    marginTop: 8,
    marginBottom: 12,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E7E9F0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
  },
  roleLabel: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 20,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD2E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#E11900',
    borderColor: '#E11900',
  },
  rememberText: {
    fontSize: 14,
    color: '#3A4356',
    fontWeight: '500',
  },
  forgot: {
    fontSize: 14,
    color: '#2F6FE0',
    fontWeight: '700',
  },
  signIn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 58,
    borderRadius: 16,
    shadowColor: '#E11900',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  signInText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E7E9F0',
  },
  authorized: {
    fontSize: 13,
    color: '#8A93A6',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(225,25,0,0.06)',
  },
  skipButtonDisabled: {
    backgroundColor: '#F0F1F5',
  },
  skipButtonText: {
    fontSize: 12.5,
    color: '#E11900',
    fontWeight: '700',
  },
  skipButtonTextDisabled: {
    color: '#B7BDC9',
  },

  /* Trust */
  trustRow: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
    paddingHorizontal: 4,
  },
  trustCol: {
    flex: 1,
    gap: 8,
  },
  trustIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F1729',
    marginTop: 2,
  },
  trustDesc: {
    fontSize: 12.5,
    lineHeight: 17,
    color: '#667085',
  },

  /* Footer */
  footer: {
    alignItems: 'center',
    gap: 6,
    marginTop: 32,
  },
  footerVersion: {
    fontSize: 13,
    color: '#8A93A6',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: '#8A93A6',
  },
});
