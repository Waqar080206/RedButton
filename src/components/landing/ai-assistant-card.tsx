import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export function AiAssistantCard() {
  return (
    <View style={styles.card}>
      <View style={styles.checkBadge}>
        <Ionicons name="checkmark" size={13} color="#ffffff" />
      </View>

      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="robot-happy-outline" size={18} color="#ffffff" />
        </View>
        <Text style={styles.title}>AI Assistant</Text>
      </View>

      <Text style={styles.body}>Possible hydraulic overheat detected.</Text>

      <View style={styles.citationRow}>
        <Ionicons name="document-text-outline" size={13} color="#2F6FE0" />
        <Text style={styles.citation}>
          Check Manual <Text style={styles.citationPage}>p. 84</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    gap: 8,
    shadowColor: '#0F1729',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  checkBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22A55E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B7CF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2F6FE0',
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    color: '#3A4356',
  },
  citationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  citation: {
    fontSize: 12,
    color: '#2F6FE0',
    fontWeight: '600',
  },
  citationPage: {
    color: '#2F6FE0',
    fontWeight: '700',
  },
});
