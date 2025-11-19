
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions, Linking } from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useScrollToTop, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trophy, Star, ArrowLeft, Instagram, Youtube, Facebook, Linkedin, Map, ChevronRight, Target } from 'lucide-react-native';
import { categories } from '@/data/categories';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [showResetModal, setShowResetModal] = useState(false);

  // Add this scroll ref for tab navigation
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  useFocusEffect(
    useCallback(() => {
      loadProgress();

      // Scroll to top when screen is focused
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: false });
      }
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

  const handleExternalLink = () => {
    Linking.openURL('https://pivotfordancers.com/');
  };

  const handleOpenMentorship = () => {
    Linking.openURL('https://pivotfordancers.com/services/mentorship/');
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

      // Clear all the specific storage keys
      await AsyncStorage.multiRemove([
        'dreamBiggerChoices',
        'mythBusterMatchedPairs',
        'day1SkillsQuizResult',
        'journalEntries',
        'pathProgress',
        'roleplayScenarioChoice',
        'valuesDiscoveryResult',
        'starvingArtistrMatchedPairs'
      ]);

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

  const handleSocialPress = (url: string) => {
    Linking.openURL(url);
  };

  // Add this function to handle path navigation
  const handlePathPress = (categoryId: string, pathId: string) => {
    router.push(`/paths/${categoryId}/${pathId}`);
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={28} color="#E2DED0" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.titleText}>Progress</Text>
          </View>
          <View style={styles.backButtonPlaceholder} />
        </View>
      </View>

      <ScrollView
        ref={scrollRef}  // Add this ref
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Paths in Progress */}
          {getInProgressPaths().length > 0 && (
            <View style={styles.pathsProgressContainer}>
              <Text style={styles.sectionTitle}>Paths in Progress</Text>
              {getInProgressPaths().map((pathData) => (
                <TouchableOpacity
                  key={`${pathData.categoryId}_${pathData.pathId}`}
                  onPress={() => handlePathPress(pathData.categoryId, pathData.pathId)}
                  activeOpacity={0.8}
                >
                  <View style={styles.pathProgressCard}>
                    <View style={[styles.pathProgressContent, { backgroundColor: '#F5F5F5' }]}>
                      <View style={styles.pathProgressHeader}>
                        <View style={styles.pathIconContainer}>
                          <View style={[styles.pathIconGradient, { backgroundColor: pathData.categoryColor }]}>
                            <Text style={styles.pathProgressIconText}>
                              {categories.find(c => c.id === pathData.categoryId)?.icon}
                            </Text>
                          </View>
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
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Completed Paths */}
          {getCompletedPaths().length > 0 && (
            <View style={styles.completedPathsContainer}>
              <Text style={styles.sectionTitle}>Completed Paths</Text>
              {getCompletedPaths().map((pathData) => (
                <View key={`completed_${pathData.categoryId}_${pathData.pathId}`} style={styles.completedPathCard}>
                  <View style={[styles.completedPathContent, { backgroundColor: '#F5F5F5' }]}>
                    <View style={styles.completedPathHeader}>
                      <View style={styles.pathIconContainer}>
                        <View style={[styles.pathIconGradient, { backgroundColor: pathData.categoryColor }]}>
                          <Text style={styles.pathProgressIconText}>
                            {categories.find(c => c.id === pathData.categoryId)?.icon}
                          </Text>
                        </View>
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
                </View>
              ))}
            </View>
          )}

          {/* Empty State */}
          {getAllPathsWithProgress().length === 0 && (
            <View style={styles.emptyStateContainer}>
              <View style={[styles.emptyStateCard, { backgroundColor: '#F5F5F5' }]}>
                <View style={styles.emptyStateIcon}>
                  <Map size={48} color="#647C90" />
                </View>
                <Text style={styles.emptyStateTitle}>Your Journey Awaits</Text>
                <Text style={styles.emptyStateText}>
                  You haven't started any paths yet. Begin your transformation journey today.
                </Text>
                <TouchableOpacity
                  style={styles.startJourneyButton}
                  onPress={() => router.push('/(tabs)/paths')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.startJourneyButtonContent, { backgroundColor: '#647C90' }]}>
                    <Text style={styles.startJourneyButtonText}>Start Your Journey</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Achievements */}
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsList}>
              {getTotalDaysCompleted() >= 1 ? (
                <>
                  {getTotalDaysCompleted() >= 1 && (
                    <View style={[styles.achievementCard, { backgroundColor: '#F5F5F5' }]}>
                      <View style={[styles.achievementIcon, { backgroundColor: '#647C90' }]}>
                        <Trophy size={20} color="#E2DED0" />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>First Step</Text>
                        <Text style={styles.achievementDescription}>Completed your first day</Text>
                      </View>
                    </View>
                  )}
                  {getTotalDaysCompleted() >= 7 && (
                    <View style={[styles.achievementCard, { backgroundColor: '#F5F5F5' }]}>
                      <View style={[styles.achievementIcon, { backgroundColor: '#647C90' }]}>
                        <Target size={20} color="#E2DED0" />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Week Warrior</Text>
                        <Text style={styles.achievementDescription}>Completed 7 days</Text>
                      </View>
                    </View>
                  )}
                  {getTotalDaysCompleted() >= 14 && (
                    <View style={[styles.achievementCard, { backgroundColor: '#F5F5F5' }]}>
                      <View style={[styles.achievementIcon, { backgroundColor: '#647C90' }]}>
                        <Star size={20} color="#E2DED0" />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Path Completer</Text>
                        <Text style={styles.achievementDescription}>Finished a complete path</Text>
                      </View>
                    </View>
                  )}
                  {getTotalDaysCompleted() >= 30 && (
                    <View style={[styles.achievementCard, { backgroundColor: '#F5F5F5' }]}>
                      <View style={[styles.achievementIcon, { backgroundColor: '#647C90' }]}>
                        <Trophy size={20} color="#E2DED0" />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Transformation Master</Text>
                        <Text style={styles.achievementDescription}>Completed 30+ days of growth</Text>
                      </View>
                    </View>
                  )}
                  {getCompletedPaths().length >= 1 && (
                    <View style={[styles.achievementCard, { backgroundColor: '#F5F5F5' }]}>
                      <View style={[styles.achievementIcon, { backgroundColor: '#647C90' }]}>
                        <Trophy size={20} color="#E2DED0" />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>Path Pioneer</Text>
                        <Text style={styles.achievementDescription}>Completed your first path</Text>
                      </View>
                    </View>
                  )}
                  {getCompletedPaths().length >= 3 && (
                    <View style={[styles.achievementCard, { backgroundColor: '#F5F5F5' }]}>
                      <View style={[styles.achievementIcon, { backgroundColor: '#647C90' }]}>
                        <Star size={20} color="#E2DED0" />
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
                  <View style={[styles.emptyAchievementsCard, { backgroundColor: '#F5F5F5' }]}>
                    <View style={styles.emptyAchievementsIcon}>
                      <Trophy size={48} color="#647C90" />
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
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Mentorship CTA */}
          <View style={styles.mentorshipCard}>
            <Text style={styles.mentorshipTitle}>Want more Support?</Text>
            <Text style={styles.mentorshipDescription}>
              Our mentorship program provides personalized guidance from experienced former professional dancers who understand your unique journey.
            </Text>
            <TouchableOpacity style={styles.mentorshipButton} onPress={handleOpenMentorship}>
              <View style={[styles.mentorshipButtonContent, { backgroundColor: '#647C90' }]}>
                <Text style={styles.mentorshipButtonText}>Learn More</Text>
                <ChevronRight size={16} color="#E2DED0" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Reset Progress Button */}
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: '#F5F5F5' }]}
            onPress={resetProgress}
            activeOpacity={0.8}
          >
            <Text style={styles.resetButtonText}>Reset Progress</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={handleExternalLink}>
                <Text style={styles.footerLink}>pivotfordancers.com</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('https://www.instagram.com/pivotfordancers')}>
                <Instagram size={24} color="#647C90" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('https://www.youtube.com/@pivotfordancers')}>
                <Youtube size={24} color="#647C90" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('https://www.facebook.com/pivotfordancers/')}>
                <Facebook size={24} color="#647C90" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('https://www.linkedin.com/company/pivotfordancers/')}>
                <Linkedin size={24} color="#647C90" />
              </TouchableOpacity>
            </View>
          </View>
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
          <View style={[styles.modalContainer, { backgroundColor: '#F5F5F5' }]}>
            <Text style={styles.modalTitle}>Reset All Progress</Text>
            <Text style={styles.modalMessage}>
              This will reset your progress on all paths to 0. You will lose all completed days, reflections, and achievements. This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.cancelButton, { backgroundColor: 'rgba(146, 132, 144, 0.2)' }]} onPress={cancelReset}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmButton, { backgroundColor: '#647C90' }]} onPress={confirmReset}>
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
  heroSection: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: 'rgba(226, 222, 208, 0.3)',
  },
  heroTextContainer: {
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 32,
    color: '#E2DED0',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700',
  },
  heroSubtitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: 'rgba(226, 222, 208, 0.9)',
    textAlign: 'center',
  },
  pathsProgressContainer: {
    paddingHorizontal: 24,
    marginBottom: 30,
    paddingTop: 50,
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    marginBottom: 20,
    fontWeight: '700',
    textAlign: 'center', // Add this line to center the titles
  },
  pathProgressCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  pathProgressContent: {
    padding: 24,
  },
  pathProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pathIconContainer: {
    marginRight: 16,
  },
  pathIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  pathProgressIconText: {
    fontSize: 24,
  },
  pathProgressInfo: {
    flex: 1,
  },
  pathProgressTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    marginBottom: 4,
    fontWeight: '700',
  },
  pathProgressSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#928490',
    marginBottom: 4,
  },
  pathProgressCategory: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#647C90',
    fontWeight: '500',
  },
  pathProgressStats: {
    alignItems: 'flex-end',
  },
  pathProgressPercentage: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: '#647C90',
    fontWeight: '700',
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
    marginRight: 12,
  },
  pathProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  pathProgressDays: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#647C90',
    fontWeight: '500',
  },
  completedPathsContainer: {
    paddingHorizontal: 24,
    marginTop: 30,
    marginBottom: 30,
  },
  completedPathCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  completedPathContent: {
    padding: 24,
  },
  completedPathHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#647C90',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadgeText: {
    fontSize: 12,
    color: '#E2DED0',
    fontWeight: 'bold',
  },
  completedPathText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyStateContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 50,
  },
  emptyStateCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(100, 124, 144, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '700',
  },
  emptyStateText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#928490',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  startJourneyButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  startJourneyButtonContent: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  startJourneyButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    fontWeight: '600',
  },
  achievementsContainer: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  achievementsList: {
    // No specific styles needed
  },
  achievementCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#647C90',
    marginBottom: 4,
    fontWeight: '600',
  },
  achievementDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#928490',
  },
  emptyAchievementsContainer: {
    marginTop: 10,
  },
  emptyAchievementsCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  emptyAchievementsIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(100, 124, 144, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyAchievementsTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#647C90',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '700',
  },
  emptyAchievementsText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#928490',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  achievementProgress: {
    width: '100%',
    alignItems: 'center',
  },
  progressPill: {
    backgroundColor: 'rgba(100, 124, 144, 0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  progressPillText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
    fontWeight: '500',
  },
  resetButton: {
    marginHorizontal: 24,
    marginBottom: 0,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resetButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#647C90',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  modalTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '700',
  },
  modalMessage: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#928490',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#647C90',
    textAlign: 'center',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#E2DED0',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerSeparator: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#928490',
    marginHorizontal: 16,
  },
  footerLink: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#647C90',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialIcon: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
  },
  // New styles for the mentorship card
  mentorshipCard: {
    backgroundColor: 'rgba(100, 124, 144, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#647C90',
    marginRight: 24,
    marginLeft: 24,
  },
  mentorshipTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
  },
  mentorshipDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  mentorshipButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  mentorshipButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#647C90',
  },
  mentorshipButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#E2DED0',
    marginRight: 8,
    fontWeight: '600',
  },
});