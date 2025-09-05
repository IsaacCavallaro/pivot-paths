import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trophy, Heart, Star, ArrowLeft, Instagram, Youtube, Facebook, Linkedin, Target } from 'lucide-react-native';
import { Image } from 'react-native';
import { categories } from '@/data/categories';

export default function ProfileScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [showResetModal, setShowResetModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('pathProgress');

      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        setProgress(progressData);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const resetProgress = async () => {
    setShowResetModal(true);
  };

  const confirmReset = async () => {
    try {
      // Clear all progress-related data
      await AsyncStorage.removeItem('pathProgress');
      await AsyncStorage.removeItem('currentDay');
      await AsyncStorage.removeItem('lastActiveDate');
      await AsyncStorage.removeItem('streakDays');

      // Clear all reflection data
      const keys = await AsyncStorage.getAllKeys();
      const reflectionKeys = keys.filter(key => key.startsWith('reflection_'));
      const currentDayKeys = keys.filter(key => key.startsWith('currentDay_'));
      if (reflectionKeys.length > 0) {
        await AsyncStorage.multiRemove(reflectionKeys);
      }
      if (currentDayKeys.length > 0) {
        await AsyncStorage.multiRemove(currentDayKeys);
      }

      // Reset local state
      setProgress({});
      setShowResetModal(false);
    } catch (error) {
      console.error('Error resetting progress:', error);
      setShowResetModal(false);
    }
  };

  const cancelReset = () => {
    setShowResetModal(false);
  };

  const getAllPathsWithProgress = () => {
    const paths: Array<{
      categoryId: string;
      categoryTitle: string;
      categoryColor: string;
      pathId: string;
      pathTitle: string;
      pathSubtitle: string;
      completed: number;
      total: number;
      percentage: number;
      isCompleted: boolean;
    }> = [];

    categories.forEach(category => {
      category.paths.forEach(path => {
        const progressKey = `${category.id}_${path.id}`;
        const pathProgress = progress[progressKey] || 0;
        const totalDays = path.days?.length || 1;
        const percentage = totalDays > 0 ? Math.round((pathProgress / totalDays) * 100) : 0;
        const isCompleted = percentage >= 100;

        // Only include paths that have some progress
        if (pathProgress > 0) {
          paths.push({
            categoryId: category.id,
            categoryTitle: category.title,
            categoryColor: category.color,
            pathId: path.id,
            pathTitle: path.title,
            pathSubtitle: path.subtitle,
            completed: pathProgress,
            total: totalDays,
            percentage,
            isCompleted,
          });
        }
      });
    });

    return paths;
  };

  const getCompletedPaths = () => {
    return getAllPathsWithProgress().filter(path => path.isCompleted);
  };

  const getInProgressPaths = () => {
    return getAllPathsWithProgress().filter(path => !path.isCompleted);
  };

  const getTotalDaysCompleted = () => {
    return Object.values(progress).reduce((sum: number, days: any) => sum + days, 0);
  };

  const handleBackPress = () => {
    router.push('/(tabs)/');
  };

  const handleSocialPress = (platform: string) => {
    console.log(`Opening ${platform}`);
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBackPress}>
            <ArrowLeft size={28} color="#E2DED0" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Progress</Text>
          <View style={{ width: 28 }} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Paths in Progress */}
          {getInProgressPaths().length > 0 && (
            <View style={styles.pathsProgressContainer}>
              <Text style={styles.sectionTitle}>Paths in Progress</Text>
              {getInProgressPaths().map((pathData) => (
                <View key={`${pathData.categoryId}_${pathData.pathId}`} style={styles.pathProgressCard}>
                  <View style={styles.pathProgressHeader}>
                    <View style={[styles.pathProgressIcon, { backgroundColor: pathData.categoryColor }]}>
                      <Text style={styles.pathProgressIconText}>
                        {categories.find(c => c.id === pathData.categoryId)?.icon}
                      </Text>
                    </View>
                    <View style={styles.pathProgressInfo}>
                      <Text style={styles.pathProgressTitle}>{pathData.pathTitle}</Text>
                      <Text style={styles.pathProgressSubtitle}>{pathData.pathSubtitle}</Text>
                      <Text style={styles.pathProgressCategory}>{pathData.categoryTitle}</Text>
                    </View>
                    <View style={styles.pathProgressStats}>
                      <Text style={styles.pathProgressPercentage}>{pathData.percentage}%</Text>
                    </View>
                  </View>
                  <View style={styles.pathProgressBarContainer}>
                    <View style={styles.pathProgressBar}>
                      <View
                        style={[
                          styles.pathProgressFill,
                          { width: `${pathData.percentage}%`, backgroundColor: pathData.categoryColor }
                        ]}
                      />
                    </View>
                    <Text style={styles.pathProgressDays}>
                      {pathData.completed}/{pathData.total} days
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Completed Paths */}
          {getCompletedPaths().length > 0 && (
            <View style={styles.completedPathsContainer}>
              <Text style={styles.sectionTitle}>Completed Paths</Text>
              {getCompletedPaths().map((pathData) => (
                <View key={`completed_${pathData.categoryId}_${pathData.pathId}`} style={styles.completedPathCard}>
                  <View style={styles.completedPathHeader}>
                    <View style={[styles.pathProgressIcon, { backgroundColor: pathData.categoryColor }]}>
                      <Text style={styles.pathProgressIconText}>
                        {categories.find(c => c.id === pathData.categoryId)?.icon}
                      </Text>
                    </View>
                    <View style={styles.pathProgressInfo}>
                      <Text style={styles.pathProgressTitle}>{pathData.pathTitle}</Text>
                      <Text style={styles.pathProgressSubtitle}>{pathData.pathSubtitle}</Text>
                      <Text style={styles.pathProgressCategory}>{pathData.categoryTitle}</Text>
                    </View>
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>✓</Text>
                    </View>
                  </View>
                  <Text style={styles.completedPathText}>
                    Completed all {pathData.total} days
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Empty State */}
          {getAllPathsWithProgress().length === 0 && (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                You haven't started any paths.
              </Text>
              <TouchableOpacity style={styles.startJourneyButton} onPress={() => router.push('/(tabs)/paths')}>
                <View
                  style={[styles.startJourneyButtonGradient, { backgroundColor: '#928490' }]}
                >
                  <Text style={styles.startJourneyButtonText}>Start Your Journey</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Achievements */}
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsList}>
              {getTotalDaysCompleted() >= 1 ? (
                <>
                  {getTotalDaysCompleted() >= 1 && (
                    <View style={styles.achievementCard}>
                      <View style={styles.achievementIcon}>
                        <Trophy size={16} color="#E2DED0" />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>First Step</Text>
                        <Text style={styles.achievementDescription}>Completed your first day</Text>
                      </View>
                    </View>
                  )}
                  {getTotalDaysCompleted() >= 7 && (
                    <View style={styles.achievementCard}>
                      <View style={styles.achievementIcon}>
                        <Target size={16} color="#E2DED0" />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Week Warrior</Text>
                        <Text style={styles.achievementDescription}>Completed 7 days</Text>
                      </View>
                    </View>
                  )}
                  {getTotalDaysCompleted() >= 14 && (
                    <View style={styles.achievementCard}>
                      <View style={styles.achievementIcon}>
                        <Star size={16} color="#E2DED0" />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Path Completer</Text>
                        <Text style={styles.achievementDescription}>Finished a complete path</Text>
                      </View>
                    </View>
                  )}
                  {getTotalDaysCompleted() >= 30 && (
                    <View style={styles.achievementCard}>
                      <View style={styles.achievementIcon}>
                        <Trophy size={16} color="#E2DED0" />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Transformation Master</Text>
                        <Text style={styles.achievementDescription}>Completed 30+ days of growth</Text>
                      </View>
                    </View>
                  )}
                  {getCompletedPaths().length >= 1 && (
                    <View style={styles.achievementCard}>
                      <View style={styles.achievementIcon}>
                        <Trophy size={16} color="#E2DED0" />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Path Pioneer</Text>
                        <Text style={styles.achievementDescription}>Completed your first path</Text>
                      </View>
                    </View>
                  )}
                  {getCompletedPaths().length >= 3 && (
                    <View style={styles.achievementCard}>
                      <View style={styles.achievementIcon}>
                        <Star size={16} color="#E2DED0" />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Journey Master</Text>
                        <Text style={styles.achievementDescription}>Completed 3 paths</Text>
                      </View>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.emptyAchievementsContainer}>
                  <LinearGradient
                    colors={['rgba(100, 124, 144, 0.1)', 'rgba(146, 132, 144, 0.1)']}
                    style={styles.emptyAchievementsCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.emptyAchievementsIcon}>
                      <Trophy size={32} color="#647C90" />
                    </View>
                    <Text style={styles.emptyAchievementsTitle}>Your Achievements Await</Text>
                    <Text style={styles.emptyAchievementsText}>
                      Complete your first day to unlock achievements and track your progress milestones.
                    </Text>
                    <View style={styles.achievementProgress}>
                      <View style={styles.progressPill}>
                        <Text style={styles.progressPillText}>0/1 day completed</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              )}
            </View>
          </View>

          {/* Reset Progress Button */}
          <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
            <Text style={styles.resetButtonText}>Reset Progress</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Reset Confirmation Modal */}
      <Modal
        visible={showResetModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelReset}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reset All Progress</Text>
            <Text style={styles.modalMessage}>
              This will reset your progress on all paths to 0. You will lose all completed days, reflections, and achievements. This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelReset}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmReset}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DED0',
  },
  stickyHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#647C90',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
    marginTop: 80, // Height of the sticky header
  },
  content: {
    paddingTop: 80,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  titleBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(226, 222, 208, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  titleText: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 25,
    color: '#E2DED0',
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#E2DED0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  decorativeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  decorativeBadge: {
    backgroundColor: 'rgba(226, 222, 208, 0.1)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(226, 222, 208, 0.2)',
  },
  pathsProgressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#4E4F50',
    marginBottom: 15,
  },
  pathProgressCard: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  pathProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pathProgressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pathProgressIconText: {
    fontSize: 20,
  },
  pathProgressInfo: {
    flex: 1,
  },
  pathProgressTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#4E4F50',
    marginBottom: 2,
  },
  pathProgressSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#746C70',
    marginBottom: 2,
  },
  pathProgressCategory: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#928490',
  },
  pathProgressStats: {
    alignItems: 'flex-end',
  },
  pathProgressPercentage: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#4E4F50',
  },
  completedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#928490',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  completedBadgeText: {
    fontSize: 12,
    color: '#E2DED0',
  },
  pathProgressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(146, 132, 144, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 10,
  },
  pathProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  pathProgressDays: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#746C70',
  },
  completedPathsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  completedPathCard: {
    backgroundColor: 'rgba(90, 125, 123, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(90, 125, 123, 0.2)',
  },
  completedPathHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedPathText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#928490',
    textAlign: 'center',
  },
  emptyStateContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#746C70',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  startJourneyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  startJourneyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  startJourneyButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
  },
  achievementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  achievementsList: {
    // No specific styles needed
  },
  achievementCard: {
    backgroundColor: 'rgba(100, 124, 144, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#647C90',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#4E4F50',
    marginBottom: 2,
  },
  achievementDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#746C70',
  },
  emptyAchievementsContainer: {
    marginTop: 10,
  },
  emptyAchievementsCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyAchievementsIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(100, 124, 144, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyAchievementsTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#4E4F50',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyAchievementsText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#746C70',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  achievementProgress: {
    width: '100%',
    alignItems: 'center',
  },
  progressPill: {
    backgroundColor: 'rgba(100, 124, 144, 0.2)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  progressPillText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#647C90',
  },
  resetButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: 'rgba(146, 132, 144, 0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#746C70',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#E2DED0',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalMessage: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#746C70',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(146, 132, 144, 0.2)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#746C70',
    textAlign: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#928490',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialIcon: {
    padding: 8,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
});