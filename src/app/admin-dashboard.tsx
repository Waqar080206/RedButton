import { LogoMark } from "@/components/landing/logo-mark";
import { MaxContentWidth } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const NAV_HEIGHT = 78;

type NavKey = "overview" | "users" | "analytics" | "settings";

type NavItem = {
  key: NavKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "overview",
    label: "Overview",
    icon: "grid-outline",
    route: "/admin-dashboard",
  },
  {
    key: "users",
    label: "Users",
    icon: "people-outline",
    route: "/users",
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: "bar-chart-outline",
    route: "/analytics",
  },
  {
    key: "settings",
    label: "Settings",
    icon: "settings-outline",
    route: "/settings",
  },
];

const STATS = [
  {
    title: "Workers",
    value: "248",
    icon: "people",
    color: "#2F6FE0",
  },
  {
    title: "Supervisors",
    value: "18",
    icon: "shield-checkmark",
    color: "#7A4DF5",
  },
  {
    title: "Incidents",
    value: "04",
    icon: "warning",
    color: "#E11900",
  },
  {
    title: "System Uptime",
    value: "99.98%",
    icon: "pulse",
    color: "#22A55E",
  },
];

const SYSTEM_HEALTH = [
  {
    title: "AI Assistant",
    status: "Healthy",
  },
  {
    title: "Notification Service",
    status: "Operational",
  },
  {
    title: "Factory Database",
    status: "Connected",
  },
  {
    title: "Camera Network",
    status: "Online",
  },
  {
    title: "Edge Devices",
    status: "Synced",
  },
];

const ACTIONS = [
  {
    title: "User Management",
    icon: "people-outline",
  },
  {
    title: "Factory Settings",
    icon: "settings-outline",
  },
  {
    title: "Reports",
    icon: "document-text-outline",
  },
  {
    title: "AI Control",
    icon: "hardware-chip-outline",
  },
];

export default function AdminDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: NAV_HEIGHT + insets.bottom + 30,
            },
          ]}
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
              <Text style={styles.avatarText}>AD</Text>
            </View>
          </View>

          {/* Hero */}

          <View style={styles.header}>
            <Text style={styles.eyebrow}>Administration</Text>

            <Text style={styles.title}>
              Factory Command{"\n"}Center
            </Text>

            <Text style={styles.subtitle}>
              Monitor system health, manage users, configure AI services and
              oversee factory-wide safety operations.
            </Text>
          </View>

          {/* AI Status */}

          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <MaterialCommunityIcons
                name="robot-happy-outline"
                size={28}
                color="#7A4DF5"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>AI Emergency Assistant</Text>

              <Text style={styles.statusSubtitle}>
                All services are healthy and responding normally.
              </Text>
            </View>

            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>ONLINE</Text>
            </View>
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

          {/* System Health */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Health</Text>

            <View style={styles.card}>
              {SYSTEM_HEALTH.map((item) => (
                <View key={item.title} style={styles.healthRow}>
                  <View style={styles.healthLeft}>
                    <View style={styles.greenDot} />

                    <Text style={styles.healthTitle}>{item.title}</Text>
                  </View>

                  <View style={styles.healthRight}>
                    <Text style={styles.healthStatus}>{item.status}</Text>

                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#22A55E"
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Administration</Text>

            <View style={styles.actionsGrid}>
              {ACTIONS.map((item) => (
                <Pressable key={item.title} style={styles.actionCard}>
                  <View style={styles.actionIcon}>
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color="#7A4DF5"
                    />
                  </View>

                  <Text style={styles.actionTitle}>
                    {item.title}
                  </Text>
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
                item.key === "overview" && styles.navItemSelected,
              ]}
              onPress={() => router.navigate(item.route)}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={
                  item.key === "overview"
                    ? "#7A4DF5"
                    : "#6B7280"
                }
              />

              <Text
                style={[
                  styles.navLabel,
                  item.key === "overview" &&
                    styles.navLabelSelected,
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
    color: "#7A4DF5",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(122,77,245,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#7A4DF5",
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
    color: "#7A4DF5",
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  title: {
    marginTop: 8,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "800",
    color: "#101828",
  },

  subtitle: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 24,
    color: "#667085",
  },

  /* ---------- AI Status ---------- */

  statusCard: {
    width: "100%",
    maxWidth: MaxContentWidth,
    marginTop: 30,
    padding: 22,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 5,
  },

  statusIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(122,77,245,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  statusTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  statusSubtitle: {
    marginTop: 4,
    color: "#667085",
    fontSize: 13,
  },

  liveBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#DCFCE7",
  },

  liveText: {
    color: "#15803D",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  /* ---------- Stats ---------- */

  statsGrid: {
    width: "100%",
    maxWidth: MaxContentWidth,
    marginTop: 28,

    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,

    shadowColor: "#111827",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 4,
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
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },

  statLabel: {
    marginTop: 6,
    fontSize: 14,
    color: "#667085",
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
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 4,
  },

  /* ---------- Health ---------- */

  healthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingVertical: 18,

    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F5",
  },

  healthLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22A55E",
  },

  healthTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  healthRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  healthStatus: {
    color: "#22A55E",
    fontWeight: "700",
    fontSize: 13,
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
    borderRadius: 22,
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
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(122,77,245,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  actionTitle: {
    marginTop: 14,
    textAlign: "center",
    fontWeight: "700",
    color: "#111827",
    fontSize: 15,
  },

  /* ---------- Bottom Navigation ---------- */

  navBarWrap: {
    position: "absolute",
    left: 18,
    right: 18,
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",

    backgroundColor: "#FFFFFF",

    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 10,

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
    gap: 4,

    paddingVertical: 10,
    borderRadius: 16,
  },

  navItemSelected: {
    backgroundColor: "rgba(122,77,245,0.10)",
  },

  navLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },

  navLabelSelected: {
    color: "#7A4DF5",
    fontWeight: "800",
  },
});