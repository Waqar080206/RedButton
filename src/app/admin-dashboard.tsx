import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { LogoMark } from '@/components/landing/logo-mark';
import { MaxContentWidth } from '@/constants/theme';
import { deleteDocument, DocumentRecord, listDocuments, uploadDocument } from '@/services/documents';

const NAV_HEIGHT = 78;

type NavKey = 'home' | 'notifications' | 'profile' | 'settings';

type NavItem = {
  key: NavKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  badge?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: 'home',
    label: 'Home',
    icon: 'home',
    route: '/admin-dashboard',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: 'notifications-outline',
    route: '/notifications',
    badge: true,
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

const FORMATS = [
  {
    key: 'pdf',
    label: 'PDF',
    icon: 'file-pdf-box',
    color: '#E11900',
  },
  {
    key: 'docx',
    label: 'DOCX',
    icon: 'file-word-box',
    color: '#2F6FE0',
  },
  {
    key: 'txt',
    label: 'TXT',
    icon: 'card-text-outline',
    color: '#22A55E',
  },
] as const;

const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

function iconForFilename(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return { icon: 'file-pdf-box' as const, color: '#E11900' };
  if (ext === 'docx' || ext === 'doc') return { icon: 'file-word-box' as const, color: '#2F6FE0' };
  return { icon: 'card-text-outline' as const, color: '#22A55E' };
}

export default function AdminDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<NavKey>('home');

  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refreshDocuments = useCallback(async () => {
    setLoadingDocuments(true);
    try {
      const docs = await listDocuments();
      setDocuments(docs);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoadingDocuments(false);
    }
  }, []);

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  const handleUpload = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ACCEPTED_MIME_TYPES,
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.length) return;

    setUploading(true);
    try {
      await uploadDocument(result.assets[0], { uploadedBy: 'SK', role: 'admin' });
      await refreshDocuments();
    } catch (err) {
      Alert.alert('Upload failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setUploading(false);
    }
  }, [refreshDocuments]);

  const handleDelete = useCallback(
    (doc: DocumentRecord) => {
      Alert.alert('Remove document', `Delete "${doc.filename}"? This cannot be undone.`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDocument(doc.id);
              await refreshDocuments();
            } catch (err) {
              Alert.alert('Delete failed', err instanceof Error ? err.message : 'Please try again.');
            }
          },
        },
      ]);
    },
    [refreshDocuments],
  );

  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: NAV_HEIGHT + insets.bottom + 30 },
          ]}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <LogoMark size={36} />
              <Text style={styles.brandText}>
                Red <Text style={styles.brandTextBold}>Button</Text>
              </Text>
            </View>

            <View style={styles.topBarActions}>
              <Pressable style={styles.searchButton}>
                <Ionicons name="search" size={20} color="#0F1729" />
              </Pressable>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>SK</Text>
              </View>
            </View>
          </View>

          {/* Upload card */}
          <View style={styles.uploadCard}>
            <View style={styles.uploadIconWrap}>
              <View style={styles.uploadIconGlow} pointerEvents="none" />
              <View style={styles.uploadIconCircle}>
                <Ionicons name="cloud-upload-outline" size={40} color="#E11900" />
              </View>
            </View>

            <Text style={styles.uploadTitle}>Upload Documents</Text>
            <Text style={styles.uploadSubtitle}>
              Upload manuals, instructions and{'\n'}reference files.
            </Text>

            <Pressable
              style={[styles.dropzone, uploading && styles.dropzoneDisabled]}
              onPress={handleUpload}
              disabled={uploading}>
              {uploading ? (
                <>
                  <ActivityIndicator color="#E11900" size="small" style={{ marginBottom: 16 }} />
                  <Text style={styles.dropzoneText}>Uploading…</Text>
                </>
              ) : (
                <>
                  <View style={styles.dropzoneIcon}>
                    <Ionicons name="document-text-outline" size={26} color="#E11900" />
                  </View>
                  <Text style={styles.dropzoneText}>
                    Tap to <Text style={styles.dropzoneTextRed}>upload</Text> or drag and drop
                  </Text>
                  <Text style={styles.dropzoneHint}>PDF, DOCX, TXT  •  Max 50 MB</Text>
                </>
              )}
            </Pressable>

            <Text style={styles.supportedLabel}>Supported Formats</Text>

            <View style={styles.formatsRow}>
              {FORMATS.map((format) => (
                <View key={format.key} style={styles.formatChip}>
                  <MaterialCommunityIcons
                    name={format.icon as any}
                    size={20}
                    color={format.color}
                  />
                  <Text style={styles.formatLabel}>{format.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Uploaded documents */}
          <View style={styles.docsSection}>
            <Text style={styles.docsTitle}>Uploaded Documents</Text>

            {loadingDocuments ? (
              <View style={styles.docsEmpty}>
                <ActivityIndicator color="#E11900" size="small" />
              </View>
            ) : loadError ? (
              <View style={styles.docsEmpty}>
                <Text style={styles.docsEmptyText}>{loadError}</Text>
              </View>
            ) : documents.length === 0 ? (
              <View style={styles.docsEmpty}>
                <Text style={styles.docsEmptyText}>No documents uploaded yet.</Text>
              </View>
            ) : (
              <View style={styles.docsList}>
                {documents.map((doc) => {
                  const meta = iconForFilename(doc.filename);
                  return (
                    <View key={doc.id} style={styles.docRow}>
                      <View style={[styles.docIcon, { backgroundColor: `${meta.color}15` }]}>
                        <MaterialCommunityIcons name={meta.icon} size={22} color={meta.color} />
                      </View>
                      <View style={styles.docInfo}>
                        <Text style={styles.docName} numberOfLines={1}>
                          {doc.filename}
                        </Text>
                        <Text style={styles.docMeta}>
                          {doc.chunk_count} chunks • {doc.status}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => handleDelete(doc)}
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${doc.filename}`}>
                        <Ionicons name="trash-outline" size={20} color="#B7BDC9" />
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            )}
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
                onPress={() => {
                  setActiveTab(item.key);
                  router.navigate(item.route);
                }}
                style={[styles.navItem, selected && styles.navItemSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected }}>
                <View>
                  <Ionicons name={item.icon} size={22} color={selected ? '#E11900' : '#5B6472'} />
                  {item.badge && <View style={styles.navBadgeDot} />}
                </View>
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

  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  /* ---------- Top bar ---------- */

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

  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F1729',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
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

  /* ---------- Upload card ---------- */

  uploadCard: {
    width: '100%',
    maxWidth: MaxContentWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',

    shadowColor: '#0F1729',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },

  uploadIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  uploadIconGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(225,25,0,0.12)',
  },

  uploadIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E11900',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  uploadTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F1729',
  },

  uploadSubtitle: {
    marginTop: 10,
    fontSize: 14.5,
    lineHeight: 21,
    color: '#5B6472',
    textAlign: 'center',
  },

  dropzone: {
    width: '100%',
    marginTop: 28,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(225,25,0,0.35)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(225,25,0,0.03)',
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },

  dropzoneDisabled: {
    opacity: 0.6,
  },

  dropzoneIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(225,25,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  dropzoneText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F1729',
  },

  dropzoneTextRed: {
    color: '#E11900',
    fontWeight: '800',
  },

  dropzoneHint: {
    marginTop: 8,
    fontSize: 13,
    color: '#8A93A3',
  },

  supportedLabel: {
    marginTop: 26,
    fontSize: 13.5,
    color: '#8A93A3',
  },

  formatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    width: '100%',
    justifyContent: 'space-between',
  },

  formatChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F6F7FB',
  },

  formatLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1729',
  },

  /* ---------- Uploaded documents ---------- */

  docsSection: {
    width: '100%',
    maxWidth: MaxContentWidth,
    marginTop: 24,
  },

  docsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1729',
    marginBottom: 12,
  },

  docsEmpty: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 28,
    alignItems: 'center',
  },

  docsEmptyText: {
    fontSize: 13.5,
    color: '#8A93A3',
  },

  docsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
  },

  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },

  docIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  docInfo: {
    flex: 1,
    gap: 2,
  },

  docName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F1729',
  },

  docMeta: {
    fontSize: 12.5,
    color: '#8A93A3',
  },

  /* ---------- Bottom nav ---------- */

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

  navBadgeDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E11900',
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
