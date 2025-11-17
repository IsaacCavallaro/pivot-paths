import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useScrollToTop, useFocusEffect } from '@react-navigation/native';
import { ChevronRight, BookOpen, Users, Instagram, Youtube, Facebook, Linkedin, ArrowLeft, Heart, Star, Trophy } from 'lucide-react-native';
import { categories } from '@/data/categories';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function PathsScreen() {
  const router = useRouter();

  // Add this scroll ref for tab navigation
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  // Add this to scroll to top when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Scroll to top when screen is focused
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: false });
      }
    }, [])
  );

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/(tabs)/categories/${categoryId}`);
  };

  const handleExternalLink = () => {
    console.log('Opening pivotfordancers.com');
  };

  const handleSocialPress = (url: string) => {
    Linking.openURL(url);
  };

  const handleBackPress = () => {
    router.push('/(tabs)/');
  };

  const scaleValues = categories.map(() => useSharedValue(1));

  const handlePressIn = (index: number) => {
    scaleValues[index].value = withTiming(0.95, { duration: 150, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = (index: number) => {
    scaleValues[index].value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });
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
            <Text style={styles.titleText}>Guided Paths</Text>
          </View>
          {/* Empty view to balance the flex row */}
          <View style={styles.backButton} />
        </View>
      </View>

      <ScrollView
        ref={scrollRef}  // Add this ref
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Content */}
        <View style={styles.content}>

          {/* Categories Section */}
          <View style={styles.categoriesSection}>
            {categories.map((category, index) => {
              return (
                <Animated.View
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    useAnimatedStyle(() => ({
                      transform: [{ scale: scaleValues[index].value }],
                    })),
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleCategoryPress(category.id)}
                    onPressIn={() => handlePressIn(index)}
                    onPressOut={() => handlePressOut(index)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.categoryGradient, { backgroundColor: '#F5F5F5' }]}>
                      <View style={styles.categoryIconContainer}>
                        <View style={[styles.categoryIconGradient, { backgroundColor: '#647C90' }]}>
                          <Text style={styles.categoryEmoji}>{category.icon}</Text>
                        </View>
                      </View>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <Text style={styles.categoryDescription}>{category.description}</Text>
                      <View style={styles.pathCountContainer}>
                        <Text style={styles.pathCountText}>
                          {category.paths.length} path{category.paths.length !== 1 ? 's' : ''} available
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
          {/* CTA Section */}
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Take Your Next Step with Confidence</Text>
            <Text style={styles.ctaDescription}>
              Happy Trails is a self-paced, 4-part mini course named after the famous Broadway send-off to help you make a plan for before, during, and after your pivot.
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => Linking.openURL('https://pivotfordancers.com/products/happy-trails/')}
            >
              <View style={[styles.ctaButtonContent, { backgroundColor: '#647C90' }]}>
                <Text style={styles.ctaButtonText}>Learn More</Text>
                <ChevronRight size={16} color="#E2DED0" />
              </View>
            </TouchableOpacity>
          </View>

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
  categoriesSection: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 50,
  },
  categoryCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  categoryGradient: {
    padding: 32,
    alignItems: 'center',
  },
  categoryIconContainer: {
    marginBottom: 20,
  },
  categoryIconGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '700',
  },
  categoryDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#928490',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  pathCountContainer: {
    borderRadius: 20,
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#647C90',
  },
  pathCountText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
    fontWeight: '500',
  },
  ctaCard: {
    backgroundColor: 'rgba(100, 124, 144, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#647C90',
    marginHorizontal: 24,
  },
  ctaTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
  },
  ctaDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  ctaButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#647C90',
  },
  ctaButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#E2DED0',
    marginRight: 8,
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
});