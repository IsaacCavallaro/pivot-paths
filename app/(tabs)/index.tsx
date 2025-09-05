import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, ExternalLink, Play, BookOpen, Users, Star, Instagram, Youtube, Facebook, Linkedin, Award, Shield, Zap, Heart } from 'lucide-react-native';
import { categories } from '@/data/categories';
const { width } = Dimensions.get('window');
export default function HomeScreen() {
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
      description: '7 day journeys designed specifically for dancers in transition',
      onPress: handleGuidedPathsPress
    },
    {
      icon: <Play size={24} color="#E2DED0" />,
      title: 'Video Stories',
      description: 'Real experiences from dancers who successfully pivoted careers',
      onPress: handleVideoStoriesPress
    },
  ];

  const badges = [
    {
      icon: <Award size={16} color="#E2DED0" />,
      text: 'Self Paced'
    },
    {
      icon: <Shield size={16} color="#E2DED0" />,
      text: 'Trusted Platform'
    },
    {
      icon: <Zap size={16} color="#E2DED0" />,
      text: 'Proven Results'
    },
    {
      icon: <Heart size={16} color="#E2DED0" />,
      text: 'Dancer-First'
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <View style={[styles.heroSection, { backgroundColor: '#928490' }]}>
        <View style={styles.heroContent}>
          <Image
            source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
            style={styles.heroImage}
          />
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Pivot Paths</Text>
            <Text style={styles.heroSubtitle}>
              By Pivot For Dancers
            </Text>

            {/* Professional Badges
            <View style={styles.badgesContainer}>
              {badges.map((badge, index) => (
                <View key={index} style={styles.badge}>
                  {badge.icon}
                  <Text style={styles.badgeText}>{badge.text}</Text>
                </View>
              ))}
            </View> */}
          </View>
        </View>
      </View>
      <View style={styles.featuresSection}>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureCard}
              onPress={feature.onPress}
              activeOpacity={0.8}
            >
              <View
                style={[styles.featureGradient, { backgroundColor: 'rgba(146, 132, 144, 0.1)' }]}
              >
                <View style={styles.featureIcon}>
                  <View
                    style={[styles.featureIconGradient, { backgroundColor: '#928490' }]}
                  >
                    {feature.icon}
                  </View>
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
          <Text style={styles.footerSeparator}>|</Text>
          <TouchableOpacity onPress={handleTermsPress}>
            <Text style={styles.footerLink}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialIcons}>
          <TouchableOpacity
            style={styles.socialIcon}
            onPress={() => handleSocialPress('Instagram')}
          >
            <Instagram size={24} color="#647C90" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialIcon}
            onPress={() => handleSocialPress('YouTube')}
          >
            <Youtube size={24} color="#647C90" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialIcon}
            onPress={() => handleSocialPress('Facebook')}
          >
            <Facebook size={24} color="#647C90" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialIcon}
            onPress={() => handleSocialPress('LinkedIn')}
          >
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
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  heroTextContainer: {
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 36,
    color: '#E2DED0',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: 'rgba(226, 222, 208, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  badge: {
    width: (width - 80) / 2, // two per row
    height: 36, // slightly taller for balance
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Changed from 'center' to 'flex-start'
    backgroundColor: '#928490', // purple-gray background
    borderWidth: 1,
    borderColor: '#E2DED0', // beige border for contrast
    borderRadius: 16,
    paddingLeft: 8, // Add left padding for icon
  },
  badgeText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    color: '#E2DED0', // beige text to pop
    marginLeft: 6,
    flex: 1, // Take remaining space
    textAlign: 'center', // Center the text within its space
    paddingRight: 8, // Balance the left padding
  },
  heroDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: 'rgba(226, 222, 208, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2DED0',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
  },
  heroButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#4E4F50',
    marginRight: 8,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 15,
  },
  featuresGrid: {
    marginTop: 20,
  },
  featureCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featureGradient: {
    padding: 24,
    alignItems: 'center',
  },
  featureIcon: {
    marginBottom: 16,
  },
  featureIconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#4E4F50',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#746C70',
    textAlign: 'center',
    lineHeight: 20,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#746C70',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
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
});
