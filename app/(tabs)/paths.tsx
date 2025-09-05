import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, BookOpen, Users, Instagram, Youtube, Facebook, Linkedin, ArrowLeft, Heart, Star, Trophy } from 'lucide-react-native';
import { categories } from '@/data/categories';

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

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
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
            {categories.map((category) => {
              return (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress(category.id)}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['rgba(100, 124, 144, 0.1)', 'rgba(146, 132, 144, 0.1)']}
                    style={styles.categoryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.categoryContent}>
                      <View style={styles.categoryIcon}>
                        <Text style={styles.categoryEmoji}>{category.icon}</Text>
                      </View>
                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryTitle}>{category.title}</Text>
                        <Text style={styles.categoryDescription}>{category.description}</Text>
                        <View style={styles.pathCountContainer}>
                          <Text style={styles.pathCountText}>
                            {category.paths.length} path{category.paths.length !== 1 ? 's' : ''} available
                          </Text>
                        </View>
                      </View>
                      <ChevronRight size={24} color="#E2DED0" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
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
    width: 28, // Fixed width to match icon size
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
  subtitleText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#E2DED0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  categoryCard: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryGradient: {
    padding: 20,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#928490',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#4E4F50',
    marginBottom: 4,
  },
  categoryDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#4E4F50',
    lineHeight: 16,
    marginBottom: 12,
  },
  pathCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathCountText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#647C90',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#647C90',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  testimonialSection: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
  },
  testimonialGradient: {
    padding: 24,
  },
  testimonialContent: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  testimonialText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#647C90',
  },
  ctaSection: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    padding: 30,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#E2DED0',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: 'rgba(226, 222, 208, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
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
    fontSize: 16,
    color: '#E2DED0',
    marginRight: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerSeparator: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#928490',
    marginHorizontal: 12,
  },
  footerLink: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#647C90',
    textDecorationLine: 'underline',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialIcon: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
});