import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Linking } from 'react-native';
import { useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useScrollToTop, useFocusEffect } from '@react-navigation/native';
import { ChevronRight, Play, BookOpen, Instagram, Youtube, Facebook, Linkedin } from 'lucide-react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
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

  const handleExternalLink = () => {
    Linking.openURL('https://pivotfordancers.com/services/mentorship/');
  };

  const handleSocialPress = (url: string) => {
    Linking.openURL(url);
  };

  const handleGuidedPathsPress = () => {
    router.push('/(tabs)/paths');
  };

  const handleVideoStoriesPress = () => {
    router.push('/(tabs)/learn');
  };

  const features = [
    {
      icon: <BookOpen size={24} color="#E2DED0" />,
      title: 'Guided Paths',
      description: '7 day journeys designed specifically for professional dancers',
      onPress: handleGuidedPathsPress,
      badges: ['mindset', 'career', 'finance'],
    },
    {
      icon: <Play size={24} color="#E2DED0" />,
      title: 'Video Stories',
      description: 'Real experiences from dancers who successfully pivoted careers',
      onPress: handleVideoStoriesPress,
      badges: ['interviews', 'guides', 'stories'],
    },
  ];

  const scaleValues = features.map(() => useSharedValue(1));

  const handlePressIn = (index: number) => {
    scaleValues[index].value = withTiming(0.95, { duration: 150, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = (index: number) => {
    scaleValues[index].value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });
  };

  return (
    <ScrollView
      ref={scrollRef}  // Add this ref
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroSection, { backgroundColor: '#647C90' }]}>
        <View style={styles.heroContent}>
          <Image
            source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
            style={styles.heroImage}
          />
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Pivot Paths</Text>
            <Text style={styles.heroSubtitle}>By Pivot For Dancers</Text>
          </View>
        </View>
      </View>

      <View style={styles.featuresSection}>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animated.View
              key={index}
              style={[
                styles.featureCard,
                useAnimatedStyle(() => ({
                  transform: [{ scale: scaleValues[index].value }],
                })),
              ]}
            >
              <TouchableOpacity
                onPress={feature.onPress}
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
                activeOpacity={0.8}
              >
                <View style={[styles.featureGradient, { backgroundColor: '#F5F5F5' }]}>
                  <View style={styles.featureIcon}>
                    <View style={[styles.featureIconGradient, { backgroundColor: '#647C90' }]}>
                      {feature.icon}
                    </View>
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                  <View style={styles.featureBadgesContainer}>
                    {feature.badges.map((badgeText, badgeIndex) => (
                      <View key={badgeIndex} style={styles.featureBadge}>
                        <Text style={styles.featureBadgeText}>{badgeText}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      <View style={[styles.ctaSection, { backgroundColor: '#647C90' }]}>
        <View style={styles.ctaContent}>
          <Text style={styles.ctaTitle}>Want Personalized Support?</Text>
          <Text style={styles.ctaSubtitle}>
            Our mentorship program provides personalized guidance from experienced former professional dancers who understand your unique journey.
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={handleExternalLink}>
            <Text style={styles.ctaButtonText}>Get Started</Text>
            <ChevronRight size={16} color="#E2DED0" />
          </TouchableOpacity>
        </View>
      </View>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DED0',
  },
  heroSection: {
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 24,
    borderWidth: 4,
    borderColor: 'rgba(226, 222, 208, 0.3)',
  },
  heroTextContainer: {
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 42,
    color: '#E2DED0',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
    color: 'rgba(226, 222, 208, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 15,
  },
  featuresGrid: {
    marginTop: 8,
  },
  featureCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  featureGradient: {
    padding: 32,
    alignItems: 'center',
  },
  featureIcon: {
    marginBottom: 20,
  },
  featureIconGradient: {
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
  featureTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '700',
  },
  featureDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#928490',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  featureBadgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  featureBadge: {
    borderRadius: 20,
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#647C90',
  },
  featureBadgeText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#647C90',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  ctaSection: {
    marginHorizontal: 24,
    marginBottom: 0,
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
  ctaButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
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