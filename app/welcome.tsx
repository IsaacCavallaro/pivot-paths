import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { BookOpen, CircleCheck, Compass, PlayCircle } from 'lucide-react-native';
import { storageService } from '@/utils/storageService';
import { STORAGE_KEYS } from '@/utils/storageKeys';
import { categories } from '@/data/categories';

const onboardingHighlights = [
  {
    icon: Compass,
    title: 'Choose a direction',
    description: 'Start with guided paths for career, mindset, and financial clarity built for dancers.',
  },
  {
    icon: BookOpen,
    title: 'Track your progress',
    description: 'Your reflections, quiz results, and path progress stay on your device so you can pick up where you left off.',
  },
  {
    icon: PlayCircle,
    title: 'Learn from real stories',
    description: 'Watch lessons and lived experiences from dancers who have already made the transition.',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [confirmedFirstName, setConfirmedFirstName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id ?? 'mindset');
  const trimmedFirstName = firstName.trim();
  const isNameConfirmed = confirmedFirstName === trimmedFirstName && trimmedFirstName.length > 0;

  const completeOnboarding = async (targetRoute: '/' | '/(tabs)/categories/[id]') => {
    if (isSubmitting || !isNameConfirmed) {
      return;
    }

    try {
      setIsSubmitting(true);
      await Promise.all([
        storageService.save(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, true),
        storageService.save(STORAGE_KEYS.PREFERRED_CATEGORY_ID, selectedCategoryId),
        storageService.save(STORAGE_KEYS.FIRST_NAME, trimmedFirstName),
      ]);

      if (targetRoute === '/') {
        router.replace('/');
        return;
      }

      router.replace({
        pathname: '/(tabs)/categories/[id]',
        params: { id: selectedCategoryId },
      });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Pivot Paths</Text>
          <Text style={styles.title}>A calmer first step for dancers figuring out what comes next.</Text>
          <Text style={styles.subtitle}>
            This app is designed to help you explore options, build confidence, and keep momentum without losing your place.
          </Text>
        </View>

        <View style={styles.nameSection}>
          <Text style={styles.nameTitle}>What should we call you?</Text>
          <Text style={styles.nameSubtitle}>
            We’ll use your first name in the app so the experience feels more personal.
          </Text>
          <TextInput
            value={firstName}
            onChangeText={(value) => {
              setFirstName(value);
              if (value.trim() !== confirmedFirstName) {
                setConfirmedFirstName('');
              }
            }}
            placeholder="First name"
            placeholderTextColor="#928490"
            autoCapitalize="words"
            autoCorrect={false}
            style={styles.nameInput}
          />

          {trimmedFirstName ? (
            <View style={[styles.nameFeedback, isNameConfirmed && styles.nameFeedbackConfirmed]}>
              <View style={styles.nameFeedbackCopy}>
                <CircleCheck size={18} color="#166534" />
                <Text style={styles.nameFeedbackText}>
                  {`We’ll greet you as ${trimmedFirstName}.`}
                </Text>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                style={[styles.confirmNameButton, isNameConfirmed && styles.confirmNameButtonConfirmed]}
                onPress={() => setConfirmedFirstName(trimmedFirstName)}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmNameButtonText}>
                  {isNameConfirmed ? 'Confirmed' : 'Confirm'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View style={styles.cardList}>
          {onboardingHighlights.map(({ icon: Icon, title, description }) => (
            <View key={title} style={styles.card}>
              <View style={styles.iconWrap}>
                <Icon size={22} color="#E2DED0" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.focusSection}>
          <Text style={styles.focusTitle}>What do you want help with first?</Text>
          <Text style={styles.focusSubtitle}>
            Pick a starting point. You can explore everything later, but this gives the app a better first recommendation.
          </Text>

          <View style={styles.focusOptions}>
            {categories.map((category) => {
              const isSelected = category.id === selectedCategoryId;

              return (
                <TouchableOpacity
                  key={category.id}
                  accessibilityRole="button"
                  style={[
                    styles.focusOption,
                    isSelected && styles.focusOptionSelected,
                  ]}
                  onPress={() => setSelectedCategoryId(category.id)}
                  activeOpacity={0.85}
                >
                  <View style={[
                    styles.focusIconWrap,
                    { backgroundColor: category.color },
                  ]}>
                    {category.icon}
                  </View>
                  <View style={styles.focusOptionText}>
                    <Text style={styles.focusOptionTitle}>{category.title}</Text>
                    <Text style={styles.focusOptionDescription}>{category.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            accessibilityRole="button"
            style={[styles.primaryButton, (isSubmitting || !isNameConfirmed) && styles.buttonDisabled]}
            onPress={() => completeOnboarding('/(tabs)/categories/[id]')}
            disabled={isSubmitting || !isNameConfirmed}
          >
            <Text style={styles.primaryButtonText}>Start With This Focus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            style={[styles.secondaryButton, (isSubmitting || !isNameConfirmed) && styles.buttonDisabled]}
            onPress={() => completeOnboarding('/')}
            disabled={isSubmitting || !isNameConfirmed}
          >
            <Text style={styles.secondaryButtonText}>Browse The App First</Text>
          </TouchableOpacity>

          <Text style={styles.footnote}>
            Your progress is stored on this device. Some sections link out to videos, social channels, and the Pivot For Dancers website.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E2DED0',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: '#647C90',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  eyebrow: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(226, 222, 208, 0.85)',
    marginBottom: 14,
  },
  title: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 32,
    lineHeight: 42,
    color: '#E2DED0',
    marginBottom: 14,
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(226, 222, 208, 0.92)',
  },
  cardList: {
    marginTop: 24,
    gap: 16,
  },
  nameSection: {
    marginTop: 24,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
  },
  nameTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    marginBottom: 8,
  },
  nameSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: '#6F6874',
    marginBottom: 14,
  },
  nameInput: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 124, 144, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  nameFeedback: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.22)',
  },
  nameFeedbackConfirmed: {
    backgroundColor: 'rgba(22, 101, 52, 0.12)',
    borderColor: 'rgba(22, 101, 52, 0.24)',
  },
  nameFeedbackCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  nameFeedbackText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    lineHeight: 18,
    color: '#166534',
  },
  confirmNameButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#166534',
  },
  confirmNameButtonConfirmed: {
    backgroundColor: '#647C90',
  },
  confirmNameButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    color: '#E2DED0',
  },
  card: {
    flexDirection: 'row',
    gap: 16,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#647C90',
    marginTop: 2,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 17,
    color: '#4E4F50',
    marginBottom: 6,
  },
  cardDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: '#6F6874',
  },
  actions: {
    marginTop: 28,
  },
  focusSection: {
    marginTop: 28,
  },
  focusTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    marginBottom: 8,
  },
  focusSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: '#6F6874',
    marginBottom: 16,
  },
  focusOptions: {
    gap: 12,
  },
  focusOption: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  focusOptionSelected: {
    borderColor: '#647C90',
    backgroundColor: 'rgba(100, 124, 144, 0.08)',
  },
  focusIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  focusOptionText: {
    flex: 1,
  },
  focusOptionTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#4E4F50',
    marginBottom: 4,
  },
  focusOptionDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#6F6874',
  },
  primaryButton: {
    backgroundColor: '#647C90',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
  },
  secondaryButton: {
    marginTop: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#647C90',
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#647C90',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  footnote: {
    marginTop: 16,
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    lineHeight: 20,
    color: '#6F6874',
    textAlign: 'center',
  },
});
