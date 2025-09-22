import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Play, BookOpen, Instagram, Youtube, Facebook, Linkedin } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

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
            <Text style={styles.heroSubtitle}>By Pivot For Dancers</Text>
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
              <View style={[styles.featureGradient, { backgroundColor: 'rgba(146, 132, 144, 0.1)' }]}>
                <View style={styles.featureIcon}>
                  <View style={[styles.featureIconGradient, { backgroundColor: '#928490' }]}>
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
          ))}
        </View>
      </View>

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
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
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
    marginBottom: 15,
  },
  featureBadgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  featureBadge: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#647C90',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  featureBadgeText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    color: '#647C90',
    textTransform: 'capitalize',
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