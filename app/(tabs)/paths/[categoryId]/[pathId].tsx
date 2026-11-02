import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ArrowLeft, ChevronRight, CircleCheck as CheckCircle, Circle, Lock } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPathById, type PathDay } from '@/data/categories';
import { STORAGE_KEYS } from '@/utils/storageKeys';
import {
  pathExperienceRegistry,
  resolveDayExperience,
  type ExperienceKey,
} from '@/utils/pathExperienceRegistry';

export default function PathDetailScreen() {
  const router = useRouter();
  const { categoryId, pathId } = useLocalSearchParams<{ categoryId: string; pathId: string }>();
  const [progress, setProgress] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [activeExperience, setActiveExperience] = useState<ExperienceKey | null>(null);

  const path = getPathById(categoryId!, pathId!);
  const isPathLocked = path?.subtitle === 'Coming Soon';

  useFocusEffect(
    useCallback(() => {
      loadProgress();
      setActiveExperience(null);
    }, [categoryId, pathId])
  );

  const loadProgress = async () => {
    try {
      const progressKey = `${categoryId}_${pathId}`;
      const savedProgress = await AsyncStorage.getItem('pathProgress');
      const savedCurrentDay = await AsyncStorage.getItem(`currentDay_${progressKey}`);

      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        const pathProgress = progressData[progressKey] || 0;
        setProgress(pathProgress);

        // Load saved current day or calculate from progress
        if (savedCurrentDay) {
          setCurrentDay(parseInt(savedCurrentDay));
        } else {
          setCurrentDay(Math.min(pathProgress + 1, path?.days?.length || 1));
        }
      } else {
        // No progress saved, reset to defaults
        setProgress(0);
        setCurrentDay(1);
      }

    } catch (error) {
      console.error('Error loading progress:', error);
      // Reset to defaults on error
      setProgress(0);
      setCurrentDay(1);
    }
  };

  const saveProgress = async (newProgress: number) => {
    try {
      const progressKey = `${categoryId}_${pathId}`;
      const savedProgress = await AsyncStorage.getItem('pathProgress');
      const progressData = savedProgress ? JSON.parse(savedProgress) : {};
      const savedCompletionDates = await AsyncStorage.getItem(STORAGE_KEYS.PATH_COMPLETION_DATES);
      const completionDates = savedCompletionDates ? JSON.parse(savedCompletionDates) : {};
      const totalDays = path?.days?.length || 1;

      progressData[progressKey] = newProgress;
      await AsyncStorage.setItem('pathProgress', JSON.stringify(progressData));

      // Save current day
      const newCurrentDay = Math.min(newProgress + 1, totalDays);
      await AsyncStorage.setItem(`currentDay_${progressKey}`, newCurrentDay.toString());

      if (newProgress >= totalDays) {
        completionDates[progressKey] ??= Date.now();
        await AsyncStorage.setItem(
          STORAGE_KEYS.PATH_COMPLETION_DATES,
          JSON.stringify(completionDates)
        );
      }

      // Update streak
      await updateStreak();

      setProgress(newProgress);
      setCurrentDay(newCurrentDay);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const updateStreak = async () => {
    try {
      const today = new Date().toDateString();
      const lastActiveDate = await AsyncStorage.getItem('lastActiveDate');
      const currentStreak = await AsyncStorage.getItem('streakDays');

      if (lastActiveDate !== today) {
        let newStreak = 1;

        if (lastActiveDate) {
          const lastDate = new Date(lastActiveDate);
          const todayDate = new Date(today);
          const diffTime = todayDate.getTime() - lastDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak = parseInt(currentStreak || '0') + 1;
          }
        }

        await AsyncStorage.setItem('streakDays', newStreak.toString());
        await AsyncStorage.setItem('lastActiveDate', today);
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const handleDayPress = async (dayNumber: number) => {
    if (dayNumber <= progress + 1) {
      const dayData = path?.days[dayNumber - 1] as PathDay | undefined;
      if (!dayData) {
        return;
      }

      // Save current day when user selects it
      const progressKey = `${categoryId}_${pathId}`;
      await AsyncStorage.setItem(`currentDay_${progressKey}`, dayNumber.toString());
      setCurrentDay(dayNumber);

      const experience = resolveDayExperience(dayData);
      if (experience) {
        setActiveExperience(experience);
      }
    }
  };

  const handleBackPress = () => {
    router.push(`/(tabs)/categories/${categoryId}`);
  };

  const handleExperienceBack = () => {
    setActiveExperience(null);
  };

  const handleExperienceComplete = async (_result?: unknown) => {
    setActiveExperience(null);
    const newProgress = Math.max(progress, currentDay);
    await saveProgress(newProgress);
    router.push(`/profile`);
  };

  if (!path) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Path not found</Text>
      </View>
    );
  }

  if (activeExperience) {
    return pathExperienceRegistry[activeExperience].render({
      onComplete: handleExperienceComplete,
      onBack: handleExperienceBack,
    });
  }

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={28} color="#E2DED0" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.titleText}>{path.title}</Text>
          </View>
          {/* Empty view to balance the flex row */}
          <View style={styles.backButtonPlaceholder} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Content */}
        <View style={styles.content}>
          {/* Vertical Timeline */}
          <View style={styles.timelineContainer}>
            <View style={styles.timeline}>
              {path.days.map((day, index) => {
                const dayNumber = index + 1;
                const isCompleted = dayNumber <= progress;
                const isAccessible = !isPathLocked && dayNumber <= progress + 1;

                return (
                  <View key={dayNumber} style={styles.timelineItem}>
                    <View style={styles.timelineConnector}>
                      <View style={[
                        styles.timelineNode,
                        isCompleted && styles.completedNode,
                        !isAccessible && styles.lockedNode,
                      ]}>
                        {isCompleted ? (
                          <CheckCircle size={20} color="#E2DED0" />
                        ) : isAccessible ? (
                          <Circle size={20} color="#647C90" />
                        ) : (
                          <Lock size={20} color="#928490" />
                        )}
                      </View>
                      {index < path.days.length - 1 && (
                        <View style={[
                          styles.timelineLine,
                          isCompleted && styles.completedLine,
                        ]} />
                      )}
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.timelineContent,
                        !isAccessible && styles.lockedContent,
                      ]}
                      onPress={() => handleDayPress(dayNumber)}
                      disabled={!isAccessible || isPathLocked}
                      activeOpacity={0.8}
                    >
                      <View style={[
                        styles.dayCard,
                        !isAccessible && styles.lockedDayCard,
                      ]}>
                        <Text style={[
                          styles.dayNumber,
                          isCompleted && styles.completedDayNumber,
                          !isAccessible && styles.lockedDayNumber,
                        ]}>
                          Day {dayNumber}
                        </Text>
                        <Text style={[
                          styles.dayTitle,
                          isCompleted && styles.completedDayTitle,
                          !isAccessible && styles.lockedDayTitle,
                        ]}>
                          {day.title}
                        </Text>
                        {isAccessible && (
                          <View style={styles.dayAction}>
                            <Text style={[
                              styles.dayActionText,
                              isCompleted && styles.completedActionText,
                            ]}>
                              {isPathLocked ? 'Coming Soon' : (isCompleted ? 'Completed' : 'Start')}
                            </Text>
                            {!isCompleted && !isPathLocked && <ChevronRight size={16} color="#647C90" />}
                          </View>
                        )}
                        {!isAccessible && isPathLocked && (
                          <View style={styles.dayAction}>
                            <View style={styles.comingSoonBadge}>
                              <Text style={styles.comingSoonText}>
                                Coming Soon
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DED0',
  },
  errorText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#746C70',
    textAlign: 'center',
    marginTop: 100,
  },
  stickyHeader: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  scrollView: {
    flex: 1,
    marginTop: 100,
  },
  content: {
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 28,
  },
  backButtonPlaceholder: {
    width: 28,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 25,
    color: '#E2DED0',
    textAlign: 'center',
  },
  timelineContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 50,
  },
  timeline: {
    // No specific styles needed
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineConnector: {
    alignItems: 'center',
    marginRight: 20,
  },
  timelineNode: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(146, 132, 144, 0.2)',
  },
  completedNode: {
    backgroundColor: '#928490',
    borderColor: '#928490',
  },
  lockedNode: {
    backgroundColor: 'rgba(146, 132, 144, 0.05)',
    borderColor: 'rgba(146, 132, 144, 0.1)',
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: 'rgba(146, 132, 144, 0.2)',
    marginTop: 8,
  },
  completedLine: {
    backgroundColor: '#928490',
  },
  timelineContent: {
    flex: 1,
  },
  lockedContent: {
    opacity: 0.5,
  },
  dayCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  lockedDayCard: {
    backgroundColor: 'rgba(245, 245, 245, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(146, 132, 144, 0.2)',
    borderStyle: 'dashed',
  },
  dayNumber: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#647C90',
    marginBottom: 8,
  },
  completedDayNumber: {
    color: '#928490',
  },
  lockedDayNumber: {
    color: '#928490',
  },
  dayTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    marginBottom: 12,
    lineHeight: 24,
    fontWeight: '700',
  },
  completedDayTitle: {
    color: '#4E4F50',
  },
  lockedDayTitle: {
    color: '#928490',
  },
  dayAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  dayActionText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
    marginRight: 8,
    fontWeight: '500',
  },
  completedActionText: {
    color: '#928490',
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(146, 132, 144, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#928490',
    borderStyle: 'dashed',
  },
  comingSoonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#928490',
    fontWeight: '600',
  },
  dayNavigation: {
    paddingVertical: 20,
    paddingLeft: 20,
    backgroundColor: '#E2DED0',
  },
  dayNavTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#4E4F50',
    marginBottom: 15,
  },
  dayScrollView: {
    flexDirection: 'row',
  },
  dayButton: {
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  completedDayButton: {
    backgroundColor: '#928490',
  },
  currentDayButton: {
    backgroundColor: '#647C90',
    borderColor: '#4E4F50',
  },
  lockedDayButton: {
    backgroundColor: 'rgba(146, 132, 144, 0.05)',
    opacity: 0.5,
  },
  dayButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#746C70',
    marginLeft: 6,
  },
  completedDayText: {
    color: '#E2DED0',
  },
  currentDayText: {
    color: '#E2DED0',
  },
  lockedDayText: {
    color: '#928490',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dayInfo: {
    flex: 1,
  },
  daySubtitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#647C90',
  },
  dayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayMetaText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#928490',
    marginLeft: 4,
  },
  contentCard: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  contentText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 24,
    marginBottom: 15,
  },
  calloutCard: {
    backgroundColor: 'rgba(100, 124, 144, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  calloutText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
    lineHeight: 20,
  },
  interactiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#647C90',
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
  },
  interactiveButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#E2DED0',
    marginRight: 8,
  },
  resultCard: {
    backgroundColor: 'rgba(90, 125, 123, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginTop: 15,
  },
  resultTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#4E4F50',
    marginBottom: 8,
  },
  resultDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#746C70',
    lineHeight: 20,
  },
  reflectionCard: {
    backgroundColor: 'rgba(116, 108, 112, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  reflectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#4E4F50',
    marginBottom: 10,
  },
  reflectionPrompt: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
    lineHeight: 20,
    marginBottom: 15,
  },
  reflectionInput: {
    backgroundColor: '#E2DED0',
    borderRadius: 8,
    padding: 15,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(146, 132, 144, 0.2)',
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  completeButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    marginLeft: 8,
  },
  nextDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100, 124, 144, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#647C90',
  },
  nextDayButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#647C90',
    marginRight: 8,
  },
});
