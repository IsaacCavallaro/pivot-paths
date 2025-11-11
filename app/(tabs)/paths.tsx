import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, BookOpen, Users, Instagram, Youtube, Facebook, Linkedin, ArrowLeft, Heart, Star, Trophy } from 'lucide-react-native';
import { categories } from '@/data/categories';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function PathsScreen() {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/(tabs)/categories/${categoryId}`);
  };

  const handleExternalLink = () => {
    console.log('Opening pivotfordancers.com');
  };

  const handleTermsPress = () => {
    console.log('Opening terms & conditions');
  };

  const handleSocialPress = (platform: string) => {
    console.log(`Opening ${platform}`);
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
          <View style={[styles.ctaSection, { backgroundColor: '#647C90' }]}>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Join Our Community</Text>
              <Text style={styles.ctaSubtitle}>
                Join thousands of dancers who have successfully transitioned to fulfilling careers
              </Text>
              <TouchableOpacity style={styles.ctaButton} onPress={handleExternalLink}>
                <Text style={styles.ctaButtonText}>Join Us</Text>
                <ChevronRight size={16} color="#E2DED0" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={handleExternalLink}>
                <Text style={styles.footerLink}>pivotfordancers.com</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('Instagram')}>
                <Instagram size={24} color="#647C90" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('YouTube')}>
                <Youtube size={24} color="#647C90" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('Facebook')}>
                <Facebook size={24} color="#647C90" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('LinkedIn')}>
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
  ctaSection: {
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