import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Linking, Image } from 'react-native';
import { Play, Pause, ExternalLink, ArrowLeft, Headphones, Star, Users, Target } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface VoiceMessageProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function VoiceMessage({ onComplete, onBack }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0); // Start at screen 0 (new intro)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);

    if (!isPlaying) {
      setTimeout(() => {
        setIsPlaying(false);
        setCurrentScreen(2);
      }, 3000);
    }
  };

  const handleMentorshipLink = () => {
    Linking.openURL('https://pivotfordancers.com/services/mentorship/');
  };

  const goBack = () => {
    if (currentScreen === 2) {
      // Go back from mentorship to voice message
      setCurrentScreen(1);
    } else if (currentScreen === 1) {
      // Go back from voice message to intro
      setCurrentScreen(0);
    } else if (currentScreen === 0) {
      if (onBack) {
        onBack();
      }
    }
  };

  const handleContinueToVoiceMessage = () => {
    setCurrentScreen(1);
  };

  // NEW: Intro Screen
  if (currentScreen === 0) {
    return (
      <View style={styles.container}>
        {/* Sticky Header */}
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ArrowLeft size={28} color="#E2DED0" />
            </TouchableOpacity>
            <View style={styles.backButton} />
          </View>
        </View>

        <View style={styles.scrollContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.introIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={styles.heroImage}
                />
              </View>

              <Text style={styles.introTitle}>Finish Line</Text>

              <Text style={styles.introDescription}>
                You've come so far on this path of self-discovery. From identifying your dreamer type to flipping the script and uncovering your core values, you've been building the foundation for what comes next.
              </Text>

              <Text style={styles.introDescription}>
                Now, we're going to bring it all together with a guided visualization exercise. This will help you connect with your future self and solidify the vision you've been creating.
              </Text>

              <View style={styles.preparationSection}>
                <Text style={styles.preparationTitle}>Before We Begin:</Text>
                <View style={styles.preparationList}>
                  <View style={styles.preparationItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.preparationText}>
                      Find a comfortable, quiet place to sit
                    </Text>
                  </View>
                  <View style={styles.preparationItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.preparationText}>
                      Headphones are recommended for the best experience
                    </Text>
                  </View>
                  <View style={styles.preparationItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.preparationText}>
                      Allow yourself 5-10 minutes of uninterrupted time
                    </Text>
                  </View>
                  <View style={styles.preparationItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.preparationText}>
                      Get ready to relax and visualize your dream future
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.continueButton} onPress={handleContinueToVoiceMessage}>
                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.continueButtonText}>I'm Ready to Begin</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  // Voice Message Screen (now screen 1)
  if (currentScreen === 1) {
    return (
      <View style={styles.container}>
        {/* Sticky Header */}
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ArrowLeft size={28} color="#E2DED0" />
            </TouchableOpacity>
            <View style={styles.backButton} />
          </View>
        </View>

        <View style={styles.scrollContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.voiceIcon}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={handlePlayPause}
                  activeOpacity={0.8}
                >
                  <View
                    style={[styles.playButtonGradient, { backgroundColor: '#928490' }]}
                  >
                    {isPlaying ? (
                      <Pause size={40} color="#E2DED0" />
                    ) : (
                      <Play size={40} color="#E2DED0" />
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <Text style={styles.voiceTitle}>Visualize Your Dream</Text>

              <Text style={styles.voiceDescription}>
                {!isPlaying && "Tap to listen to a guided visualization"}
              </Text>

              {isPlaying && (
                <View style={styles.playingIndicator}>
                  <View style={styles.waveform}>
                    {[...Array(5)].map((_, i) => (
                      <View key={i} style={[styles.wave, { animationDelay: `${i * 0.1}s` }]} />
                    ))}
                  </View>
                  <Text style={styles.playingText}>Playing...</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  // Mentorship Promotion Screen (now screen 2)
  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <ArrowLeft size={28} color="#E2DED0" />
          </TouchableOpacity>
          <View style={styles.backButton} />
        </View>
      </View>

      <View style={styles.scrollContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.finalIconContainer}>
              <Image
                source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                style={styles.heroImage}
              />
            </View>

            <Text style={styles.mentorshipTitle}>Ready for Extra Support?</Text>

            <Text style={styles.mentorshipText}>
              You've taken incredible steps toward building your dream life beyond dance. Now, imagine having personalized guidance to help you navigate this transition with confidence.
            </Text>

            <Text style={styles.mentorshipText}>
              Our mentorship program provides one-on-one support to help you clarify your goals, overcome obstacles, and create a concrete action plan for your next chapter.
            </Text>

            <Text style={styles.mentorshipCallout}>
              You don't have to figure this out alone. Let's build your future together.
            </Text>

            {/* NEW: Mentorship CTA Card */}
            <TouchableOpacity style={styles.mentorshipCard} onPress={handleMentorshipLink}>
              <View style={styles.mentorshipCardContent}>
                <View style={styles.mentorshipCardHeader}>
                  <View style={styles.mentorshipIconContainer}>
                    <Users size={24} color="#647C90" />
                  </View>
                  <Text style={styles.mentorshipCardTitle}>1:1 Mentorship Program</Text>
                </View>

                <View style={styles.mentorshipFeatures}>
                  <View style={styles.featureItem}>
                    <Star size={16} color="#928490" />
                    <Text style={styles.featureText}>Personalized guidance</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Target size={16} color="#928490" />
                    <Text style={styles.featureText}>Custom action plan</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Users size={16} color="#928490" />
                    <Text style={styles.featureText}>Ongoing support</Text>
                  </View>
                </View>

                <View style={styles.mentorshipCardFooter}>
                  <Text style={styles.mentorshipCardButtonText}>Learn More</Text>
                  <ExternalLink size={16} color="#647C90" />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
              <View
                style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}
              >
                <Text style={styles.completeButtonText}>Mark As Complete</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DED0',
  },
  scrollContainer: {
    marginTop: 70,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
  card: {
    width: width * 0.85,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginVertical: 20,
  },
  // NEW: Intro Screen Styles
  introIconContainer: {
    marginBottom: 24,
  },
  headphonesIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#647C90',
  },
  introTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },
  introDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#928490',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  preparationSection: {
    width: '100%',
    marginBottom: 32,
    padding: 20,
    backgroundColor: 'rgba(146, 132, 144, 0.08)',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#928490',
  },
  preparationTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '700',
  },
  preparationList: {
    gap: 12,
  },
  preparationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#928490',
    marginTop: 8,
    marginRight: 12,
  },
  preparationText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#4E4F50',
    lineHeight: 20,
    flex: 1,
  },
  continueButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  continueButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2DED0',
  },
  continueButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#E2DED0',
    fontWeight: '600',
  },
  voiceIcon: {
    marginBottom: 30,
  },
  playButton: {
    borderRadius: 60,
    overflow: 'hidden',
  },
  playButtonGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 15,
  },
  voiceDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#746C70',
    textAlign: 'center',
    lineHeight: 24,
  },
  playingIndicator: {
    alignItems: 'center',
    marginTop: 30,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  wave: {
    width: 4,
    height: 20,
    backgroundColor: '#647C90',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  playingText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
  },
  mentorshipTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 25,
  },
  mentorshipText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  mentorshipCallout: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  // NEW: Mentorship Card Styles
  mentorshipCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(146, 132, 144, 0.2)',
  },
  mentorshipCardContent: {
    gap: 16,
  },
  mentorshipCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mentorshipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(100, 124, 144, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mentorshipCardTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    fontWeight: '700',
  },
  mentorshipFeatures: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#4E4F50',
    lineHeight: 20,
  },
  mentorshipCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(146, 132, 144, 0.1)',
  },
  mentorshipCardButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#647C90',
    fontWeight: '600',
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  completeButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
  },
  finalIconContainer: {
    marginBottom: 30,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#647C90',
    borderWidth: 2,
  },
});