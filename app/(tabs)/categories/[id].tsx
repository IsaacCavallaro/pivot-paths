import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Clock, Calendar } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCategoryById } from '@/data/categories';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [progress, setProgress] = useState<{ [key: string]: number }>({});

  const category = getCategoryById(id!);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('pathProgress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        setProgress({});
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      setProgress({});
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const handlePathPress = (pathId: string) => {
    router.push(`/(tabs)/paths/${id}/${pathId}`);
  };

  const handleBackPress = () => {
    router.push('/(tabs)/paths');
  };

  // Animation setup for path cards
  const scaleValues = category?.paths.map(() => useSharedValue(1)) || [];

  const handlePressIn = (index: number) => {
    scaleValues[index].value = withTiming(0.95, { duration: 150, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = (index: number) => {
    scaleValues[index].value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });
  };

  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Category not found</Text>
      </View>
    );
  }

  const getPathProgress = (pathId: string) => {
    const progressKey = `${id}_${pathId}`;
    const pathProgress = progress[progressKey] || 0;
    const path = category.paths.find(p => p.id === pathId);
    const totalDays = path?.days?.length || 1;
    if (totalDays === 0) return 0;
    return Math.round((pathProgress / totalDays) * 100);
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={[styles.stickyHeader, { backgroundColor: category.color }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={28} color="#E2DED0" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.titleText}>{category.title}</Text>
          </View>
          {/* Empty view to balance the flex row */}
          <View style={styles.backButtonPlaceholder} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Content */}
        <View style={styles.content}>
          {/* Paths List */}
          <View style={styles.pathsContainer}>
            {category.paths.map((path, index) => {
              const progressPercentage = getPathProgress(path.id);
              const isCompleted = progressPercentage >= 100;
              const hasProgress = progressPercentage > 0;

              return (
                <Animated.View
                  key={path.id}
                  style={[
                    styles.pathCard,
                    useAnimatedStyle(() => ({
                      transform: [{ scale: scaleValues[index].value }],
                    })),
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handlePathPress(path.id)}
                    onPressIn={() => handlePressIn(index)}
                    onPressOut={() => handlePressOut(index)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.pathContentContainer, { backgroundColor: '#F5F5F5' }]}>
                      <View style={styles.pathHeader}>
                        <View style={styles.pathIconContainer}>
                          <View style={[styles.pathIconGradient, { backgroundColor: category.color }]}>
                            <Clock size={24} color="#E2DED0" />
                          </View>
                        </View>
                        <View style={styles.pathInfo}>
                          <Text style={styles.pathTitle}>{path.title}</Text>
                          <Text style={styles.pathSubtitle}>{path.subtitle}</Text>
                          <Text style={styles.pathDescription}>{path.description}</Text>
                          <View style={styles.pathMeta}>
                            <View style={styles.durationBadge}>
                              <Text style={styles.durationText}>{path.duration}</Text>
                            </View>
                            {hasProgress && (
                              <View style={styles.progressBadge}>
                                <Text style={styles.progressBadgeText}>{progressPercentage}% complete</Text>
                              </View>
                            )}
                          </View>
                        </View>
                        <View style={styles.chevronIcon}>
                          <ChevronRight size={20} color="#647C90" />
                        </View>
                      </View>

                      {/* Progress Bar */}
                      {hasProgress && (
                        <View style={styles.progressContainer}>
                          <View style={styles.progressBar}>
                            <View
                              style={[
                                styles.progressFill,
                                {
                                  width: `${progressPercentage}%`,
                                  backgroundColor: category.color
                                }
                              ]}
                            />
                          </View>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* CTA Section */}
          <View style={[styles.ctaContainer, { backgroundColor: category.color }]}>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Ready to Begin?</Text>
              <Text style={styles.ctaSubtitle}>
                Start your journey today and take the first step towards your new career path
              </Text>
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Start Learning</Text>
                <ChevronRight size={16} color="#E2DED0" />
              </TouchableOpacity>
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
  pathsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 50,
  },
  pathCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  pathContentContainer: {
    padding: 24,
  },
  pathHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  pathInfo: {
    flex: 1,
  },
  pathTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    marginBottom: 8,
    lineHeight: 24,
    fontWeight: '700',
  },
  pathSubtitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#647C90',
    marginBottom: 6,
  },
  pathDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#928490',
    lineHeight: 20,
    marginBottom: 16,
  },
  pathMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  durationBadge: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#647C90',
  },
  durationText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#647C90',
    fontWeight: '500',
  },
  progressBadge: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#647C90',
  },
  progressBadgeText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#647C90',
    fontWeight: '500',
  },
  completedBadge: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#647C90',
  },
  completedBadgeText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#647C90',
    fontWeight: '500',
  },
  chevronIcon: {
    marginLeft: 12,
    justifyContent: 'center',
    minHeight: 56,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(146, 132, 144, 0.2)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  ctaContainer: {
    marginHorizontal: 24,
    marginBottom: 48,
    borderRadius: 24,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#E2DED0',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '700',
  },
  ctaSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: 'rgba(226, 222, 208, 0.8)',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#647C90',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2DED0',
  },
  ctaButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#E2DED0',
    marginRight: 8,
    fontWeight: '600',
  },
}); 