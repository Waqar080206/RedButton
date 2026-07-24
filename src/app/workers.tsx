import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const WORKERS = [
  {
    name: 'Waqar Akhtar',
    role: 'Floor Worker - Assembly Bay C',
    status: 'On shift',
  },
  {
    name: 'Priya Nair',
    role: 'Floor Worker - Warehouse A',
    status: 'On shift',
  },
  {
    name: 'Diego Ramirez',
    role: 'Floor Worker - Line 4',
    status: 'On break',
  },
];

export default function WorkersScreen() {
  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Workers</Text>
            <Text style={styles.title}>Floor roster</Text>
            <Text style={styles.subtitle}>
              Everyone currently assigned to your zones.
            </Text>
          </View>

          <View style={styles.card}>
            {WORKERS.map((worker) => (
              <View key={worker.name} style={styles.row}>
                <View style={styles.icon}>
                  <Ionicons name="person" size={19} color="#2F6FE0" />
                </View>
                <View style={styles.copy}>
                  <Text style={styles.rowTitle}>{worker.name}</Text>
                  <Text style={styles.rowDetail}>{worker.role}</Text>
                </View>
                <Text style={styles.status}>{worker.status}</Text>
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
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(47,111,224,0.1)',
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
  status: {
    color: '#22A55E',
    fontSize: 12,
    fontWeight: '700',
  },
});
