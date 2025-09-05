import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ArrowLeft, Clock, Calendar } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCategoryById } from '@/data/categories';
import { Image } from 'react-native';

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

  const renderHeader = () => (
    <LinearGradient
      colors={[category.color, `${category.color}CC`]}
      style={styles.header}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft size={28} color="#E2DED0" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
        </View>
        {/* Empty view to balance the flex row */}
        <View style={styles.backButton} />
      </View>
    </LinearGradient>
  );

  const renderPaths = () => (
    <View style={styles.pathsContainer}>
      {category.paths.map((path) => {
        const progressPercentage = getPathProgress(path.id);
        const isCompleted = progressPercentage >= 100;
        const hasProgress = progressPercentage > 0;

        return (
          <TouchableOpacity
            key={path.id}
            style={styles.pathCard}
            onPress={() => handlePathPress(path.id)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(146, 132, 144, 0.1)', 'rgba(116, 108, 112, 0.05)']}
              style={styles.pathGradient}
            >
              <View style={styles.pathContent}>
                <View style={styles.pathHeader}>
                  <View style={styles.pathInfo}>
                    <Text style={styles.pathTitle}>{path.title}</Text>
                    <Text style={styles.pathSubtitle}>{path.subtitle}</Text>
                    <Text style={styles.pathDescription}>{path.description}</Text>
                  </View>

                  <View style={styles.pathMeta}>
                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedBadgeText}>✓</Text>
                      </View>
                    )}
                    {!isCompleted && (
                      <ChevronRight size={20} color="#647C90" />
                    )}
                  </View>
                </View>

                <View style={styles.pathFooter}>
                  <View style={styles.pathStats}>
                    <View style={styles.statItem}>
                      <Clock size={16} color="#928490" />
                      <Text style={styles.statText}>{path.duration}</Text>
                    </View>
                  </View>

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
                      <Text style={styles.progressText}>{progressPercentage}% complete</Text>
                    </View>
                  )}
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}
    >
      {renderHeader()}
      {renderPaths()}
    </ScrollView>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#647C90',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  headerContent: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(226, 222, 208, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryEmoji: {
    fontSize: 30,
  },
  categoryTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 25,
    color: '#E2DED0',
    textAlign: 'center',
  },
  categoryDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: 'rgba(226, 222, 208, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  pathsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 22,
    color: '#4E4F50',
    marginBottom: 20,
  },
  pathCard: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pathGradient: {
    padding: 16,
  },
  pathContent: {
    // No specific styles needed
  },
  pathHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  pathInfo: {
    flex: 1,
  },
  pathTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#4E4F50',
    marginBottom: 4,
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
    color: '#746C70',
    lineHeight: 20,
  },
  pathMeta: {
    alignItems: 'center',
    marginLeft: 10,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#928490',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedBadgeText: {
    fontSize: 14,
    color: '#E2DED0',
  },
  pathFooter: {
    // No specific styles needed
  },
  pathStats: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#928490',
    marginLeft: 6,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(146, 132, 144, 0.2)',
    borderRadius: 2,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#746C70',
  },
  ctaContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaGradient: {
    padding: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#4E4F50',
    marginBottom: 10,
  },
  ctaText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#746C70',
    textAlign: 'center',
    lineHeight: 20,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
});