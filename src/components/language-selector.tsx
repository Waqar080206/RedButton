import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { LANGUAGES, type LanguageCode } from '@/i18n/languages';
import { useLanguage } from '@/i18n/LanguageProvider';

type Props = {
  variant: 'iconButton' | 'settingsRow';
};

export function LanguageSelector({ variant }: Props) {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const activeLabel = LANGUAGES.find((lang) => lang.code === language)?.nativeLabel ?? 'English';

  const handleSelect = async (code: LanguageCode) => {
    await setLanguage(code);
    setModalVisible(false);
  };

  return (
    <>
      {variant === 'iconButton' ? (
        <Pressable
          style={styles.iconButton}
          onPress={() => setModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Change language">
          <Text style={styles.iconButtonLabel}>{language.toUpperCase()}</Text>
        </Pressable>
      ) : (
        <Pressable
          style={styles.settingsRow}
          onPress={() => setModalVisible(true)}
          accessibilityRole="button">
          <View style={styles.settingsIcon}>
            <Ionicons name="language-outline" size={19} color="#E11900" />
          </View>
          <View style={styles.settingsCopy}>
            <Text style={styles.settingsTitle}>{t('settings.language.title')}</Text>
            <Text style={styles.settingsDetail}>{t('settings.language.detail')}</Text>
          </View>
          <View style={styles.settingsValueWrap}>
            <Text style={styles.settingsValue}>{activeLabel}</Text>
            <Ionicons name="chevron-forward" size={18} color="#98A2B3" />
          </View>
        </Pressable>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            {LANGUAGES.map((lang) => {
              const selected = lang.code === language;
              return (
                <Pressable
                  key={lang.code}
                  style={styles.sheetRow}
                  onPress={() => handleSelect(lang.code)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}>
                  <Text style={styles.sheetRowLabel}>{lang.nativeLabel}</Text>
                  {selected && <Ionicons name="checkmark" size={18} color="#E11900" />}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
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
  iconButtonLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F1729',
  },

  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  settingsIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(225,25,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsCopy: {
    flex: 1,
    gap: 4,
  },
  settingsTitle: {
    color: '#0F1729',
    fontSize: 14,
    fontWeight: '900',
  },
  settingsDetail: {
    color: '#5B6472',
    fontSize: 13,
    lineHeight: 18,
  },
  settingsValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  settingsValue: {
    color: '#5B6472',
    fontSize: 13,
    fontWeight: '700',
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,41,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 8,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sheetRowLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1729',
  },
});
