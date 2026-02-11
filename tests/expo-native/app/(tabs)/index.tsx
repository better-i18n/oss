import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { createI18nCore } from '@better-i18n/expo';
import type { LanguageOption } from '@better-i18n/expo';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const PROJECT = 'aliosman-co/personal';

const core = createI18nCore({
  project: PROJECT,
  defaultLocale: 'en',
});

function useLanguages() {
  const [languages, setLanguages] = useState<LanguageOption[]>([]);

  useEffect(() => {
    core.getLanguages().then(setLanguages).catch(console.error);
  }, []);

  return languages;
}

export default function HomeScreen() {
  const { t, i18n, ready } = useTranslation('common');
  const languages = useLanguages();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>

      {/* Profile Card */}
      <ThemedView style={styles.section}>
        <ThemedText type="title">{t('header.name')}</ThemedText>
        <ThemedText style={styles.subtitle}>{t('header.title')}</ThemedText>
      </ThemedView>

      {/* Language Switcher (from manifest) */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">{t('sections.products') || 'Language'}</ThemedText>
        <View style={styles.buttonRow}>
          {languages.map((lang) => (
            <Pressable
              key={lang.code}
              style={[
                styles.langButton,
                i18n.language === lang.code && styles.langButtonActive,
              ]}
              onPress={() => i18n.changeLanguage(lang.code)}>
              {lang.flagUrl ? (
                <Image source={{ uri: lang.flagUrl }} style={styles.flag} />
              ) : null}
              <ThemedText
                style={i18n.language === lang.code ? styles.langTextActive : undefined}>
                {lang.nativeName || lang.name || lang.code}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </ThemedView>

      {/* Sections */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">{t('sections.work')}</ThemedText>
        <ThemedText>{t('work.present')}</ThemedText>
      </ThemedView>

      {/* Contact */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">{t('contact.getInTouch')}</ThemedText>
        <ThemedText style={styles.dimText}>{t('contact.description')}</ThemedText>
        <View style={styles.buttonRow}>
          <Pressable style={styles.actionButton}>
            <ThemedText style={styles.actionButtonText}>{t('contact.emailMe')}</ThemedText>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <ThemedText style={styles.actionButtonText}>{t('contact.scheduleMeet')}</ThemedText>
          </Pressable>
        </View>
      </ThemedView>

      {/* Theme */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Theme</ThemedText>
        <View style={styles.buttonRow}>
          {['light', 'dark', 'system'].map((theme) => (
            <Pressable key={theme} style={styles.themeChip}>
              <ThemedText>{t(`theme.${theme}`)}</ThemedText>
            </Pressable>
          ))}
        </View>
      </ThemedView>

      {/* Projects */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">{t('sections.products')}</ThemedText>
        {['project1', 'project2', 'project3'].map((p, i) => (
          <ThemedView key={p} style={styles.projectCard}>
            <ThemedText style={styles.projectTitle}>
              {t('projects.goToProject', { number: i + 1 })}
            </ThemedText>
            <ThemedText style={styles.dimText}>
              {t(`projects.${p}.description`)}
            </ThemedText>
            <Pressable style={styles.visitButton}>
              <ThemedText style={styles.visitButtonText}>
                {t('projects.visit')}
              </ThemedText>
            </Pressable>
          </ThemedView>
        ))}
      </ThemedView>

      {/* Raw keys debug */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Debug: Key Resolution</ThemedText>
        <ThemedText style={styles.dimText}>
          Language: {i18n.language} | Ready: {String(ready)}
        </ThemedText>
        {[
          'header.name',
          'header.title',
          'sections.products',
          'sections.work',
          'sections.blog',
          'contact.getInTouch',
          'contact.emailMe',
          'theme.light',
          'theme.dark',
          'footer.copyright',
        ].map((key) => (
          <View key={key} style={styles.row}>
            <ThemedText style={styles.key}>{key}</ThemedText>
            <ThemedText style={styles.value}>{t(key)}</ThemedText>
          </View>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  langButtonActive: {
    backgroundColor: '#007AFF',
  },
  langTextActive: {
    color: '#fff',
  },
  flag: {
    width: 20,
    height: 14,
    borderRadius: 2,
  },
  dimText: {
    opacity: 0.6,
    fontSize: 14,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  themeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e8e8e8',
  },
  projectCard: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    gap: 6,
  },
  projectTitle: {
    fontWeight: '600',
    fontSize: 15,
  },
  visitButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  visitButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  key: {
    fontSize: 11,
    opacity: 0.5,
    fontFamily: 'monospace',
    flex: 1,
  },
  value: {
    fontSize: 13,
    flex: 1.5,
    textAlign: 'right',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
