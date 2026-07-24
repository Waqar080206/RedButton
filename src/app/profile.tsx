import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const CERTIFICATIONS = ['Forklift safety', 'Lockout/tagout', 'First aid responder'];

export default function ProfileScreen() {
  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>WA</Text>
            </View>
            <View style={styles.identity}>
              <Text style={styles.name}>Waqar Akhtar</Text>
              <Text style={styles.role}>Floor Worker - Assembly Bay C</Text>
              <View style={styles.badge}>
                <Ionicons name="shield-checkmark" size={15} color="#22A55E" />
                <Text style={styles.badgeText}>Emergency trained</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <InfoTile icon="id-card" label="Worker ID" value="CAN-0427" />
            <InfoTile icon="time" label="Shift" value="Morning" />
            <InfoTile icon="location" label="Zone" value="Bay C" />
            <InfoTile icon="call" label="Supervisor" value="Akshat" />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.listCard}>
              {CERTIFICATIONS.map((certification) => (
                <View key={certification} style={styles.listRow}>
                  <View style={styles.listIcon}>
                    <MaterialIcons name="verified" size={18} color="#2F6FE0" />
                  </View>
                  <Text style={styles.listText}>{certification}</Text>
                  <Ionicons name="checkmark-circle" size={19} color="#22A55E" />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <View style={styles.contactCard}>
              <ContactRow title="Shift Supervisor" value="Akshat Talwar" />
              <ContactRow title="Safety Officer" value="Control Room 2" />
              <ContactRow title="Medical Station" value="Ext. 114" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function InfoTile({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoTile}>
      <Ionicons name={icon} size={19} color="#E11900" />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function ContactRow({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.contactRow}>
      <View>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#8A93A3" />
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: '#ECEEF3',
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E11900',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  identity: {
    flex: 1,
    gap: Spacing.one,
  },
  name: {
    color: '#0F1729',
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '900',
  },
  role: {
    color: '#5B6472',
    fontSize: 14,
    lineHeight: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'rgba(34,165,94,0.1)',
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  badgeText: {
    color: '#167A42',
    fontSize: 12,
    fontWeight: '800',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  infoTile: {
    width: '48%',
    minHeight: 116,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECEEF3',
    padding: Spacing.three,
    gap: Spacing.one,
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#5B6472',
    fontSize: 12,
    fontWeight: '700',
  },
  infoValue: {
    color: '#0F1729',
    fontSize: 16,
    fontWeight: '900',
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    color: '#0F1729',
    fontSize: 18,
    fontWeight: '800',
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECEEF3',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  listIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(47,111,224,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listText: {
    flex: 1,
    color: '#0F1729',
    fontSize: 14,
    fontWeight: '800',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECEEF3',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  contactTitle: {
    color: '#5B6472',
    fontSize: 12,
    fontWeight: '700',
  },
  contactValue: {
    color: '#0F1729',
    fontSize: 15,
    fontWeight: '900',
  },
});
