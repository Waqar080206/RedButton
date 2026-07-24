import { LogoMark } from "@/components/landing/logo-mark";
import { MaxContentWidth } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
const NAV_HEIGHT = 78;

type NavKey = "home" | "workers" | "alerts" | "profile";

type NavItem = {
  key: NavKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "home",
    label: "Home",
    icon: "home",
    route: "/supervisor-dashboard",
  },
  {
    key: "workers",
    label: "Workers",
    icon: "people-outline",
    route: "/workers",
  },
  {
    key: "alerts",
    label: "Alerts",
    icon: "notifications-outline",
    route: "/alerts",
  },
  {
    key: "profile",
    label: "Profile",
    icon: "person-outline",
    route: "/profile",
  },
];

const STATS = [
  {
    title: "Workers",
    value: "24",
    icon: "people",
    color: "#2F6FE0",
  },
  {
    title: "Emergencies",
    value: "02",
    icon: "warning",
    color: "#E11900",
  },
  {
    title: "Active Zones",
    value: "06",
    icon: "location",
    color: "#22A55E",
  },
  {
    title: "Pending SOPs",
    value: "03",
    icon: "document-text",
    color: "#F59E0B",
  },
];

const INCIDENTS = [
  {
    title: "Worker pressed Red Button",
    location: "Assembly Bay C",
    time: "2 min ago",
    color: "#E11900",
  },
  {
    title: "Gas Leak Alert",
    location: "Warehouse A",
    time: "11 min ago",
    color: "#F59E0B",
  },
  {
    title: "Machine Shutdown Complete",
    location: "Line 4",
    time: "22 min ago",
    color: "#22A55E",
  },
];

const ACTIONS = [
  {
    title: "Workers",
    icon: "people-outline",
  },
  {
    title: "Incident Map",
    icon: "map-outline",
  },
  {
    title: "Broadcast",
    icon: "megaphone-outline",
  },
  {
    title: "Reports",
    icon: "bar-chart-outline",
  },
];

export default function SupervisorDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: NAV_HEIGHT + insets.bottom + 28,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}

          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <LogoMark size={36} />
              <Text style={styles.brand}>
                Red <Text style={styles.brandBold}>Button</Text>
              </Text>
            </View>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AT</Text>
            </View>
          </View>

          {/* Greeting */}

          <View style={styles.header}>
            <Text style={styles.eyebrow}>Supervisor Dashboard</Text>

            <Text style={styles.title}>
              Good Morning,
              {"\n"}
              Akshat 👋
            </Text>

            <Text style={styles.subtitle}>
              Monitor workers, respond to emergencies, and coordinate safety
              operations across the factory floor.
            </Text>
          </View>

          {/* Stats */}

          <View style={styles.statsGrid}>
            {STATS.map((item) => (
              <View key={item.title} style={styles.statCard}>
                <View
                  style={[
                    styles.statIcon,
                    {
                      backgroundColor: `${item.color}15`,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={item.color}
                  />
                </View>

                <Text style={styles.statValue}>{item.value}</Text>

                <Text style={styles.statLabel}>{item.title}</Text>
              </View>
            ))}
          </View>

          {/* Incidents */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Live Incidents</Text>

            <View style={styles.card}>
              {INCIDENTS.map((item) => (
                <View key={item.title} style={styles.incidentRow}>
                  <View
                    style={[
                      styles.incidentDot,
                      {
                        backgroundColor: item.color,
                      },
                    ]}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.incidentTitle}>{item.title}</Text>

                    <Text style={styles.incidentSubtitle}>
                      {item.location} • {item.time}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#9AA3B2"
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.actionsGrid}>
              {ACTIONS.map((item) => (
                <Pressable key={item.title} style={styles.actionCard}>
                  <View style={styles.actionIcon}>
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color="#2F6FE0"
                    />
                  </View>

                  <Text style={styles.actionTitle}>{item.title}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Navigation */}

      <View
        style={[
          styles.navBarWrap,
          {
            bottom: insets.bottom + 16,
          },
        ]}
      >
        <View style={styles.navBar}>
          {NAV_ITEMS.map((item) => (
            <Pressable
              key={item.key}
              style={[
                styles.navItem,
                item.key === "home" && styles.navItemSelected,
              ]}
              onPress={() => router.navigate(item.route)}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={item.key === "home" ? "#2F6FE0" : "#6B7280"}
              />

              <Text
                style={[
                  styles.navLabel,
                  item.key === "home" && styles.navLabelSelected,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  safeArea: {
    flex: 1,
  },

  content: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  /* ---------- Header ---------- */

  topBar: {
    width: "100%",
    maxWidth: MaxContentWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  brand: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  brandBold: {
    color: "#2F6FE0",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2F6FE015",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#2F6FE0",
    fontSize: 16,
    fontWeight: "800",
  },

  header: {
    width: "100%",
    maxWidth: MaxContentWidth,
    marginTop: 28,
  },

  eyebrow: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2F6FE0",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#101828",
    marginTop: 8,
    lineHeight: 42,
  },

  subtitle: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 24,
    color: "#667085",
  },

  /* ---------- Stats ---------- */

  statsGrid: {
    width: "100%",
    maxWidth: MaxContentWidth,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 30,
    rowGap: 16,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 5,
  },

  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  statValue: {
    marginTop: 18,
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
  },

  statLabel: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },

  /* ---------- Sections ---------- */

  section: {
    width: "100%",
    maxWidth: MaxContentWidth,
    marginTop: 34,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#111827",
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 5,
  },

  /* ---------- Incidents ---------- */

  incidentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F5",
  },

  incidentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },

  incidentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  incidentSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  /* ---------- Quick Actions ---------- */

  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },

  actionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 22,
    shadowColor: "#111827",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },

  actionIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#2F6FE012",
    alignItems: "center",
    justifyContent: "center",
  },

  actionTitle: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  /* ---------- Bottom Navigation ---------- */

  navBarWrap: {
    position: "absolute",
    left: 18,
    right: 18,
  },

  navBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: "space-between",
    shadowColor: "#111827",
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 10,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 16,
    gap: 4,
  },

  navItemSelected: {
    backgroundColor: "#2F6FE012",
  },

  navLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },

  navLabelSelected: {
    color: "#2F6FE0",
    fontWeight: "800",
  },
});