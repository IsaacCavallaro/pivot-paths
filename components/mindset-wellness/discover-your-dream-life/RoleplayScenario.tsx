import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Modal, Linking } from 'react-native';
import { ChevronRight, ArrowLeft, X, Check } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

interface RoleplayScenarioProps {
  onComplete: () => void;
  onBack?: () => void;
}

const { width, height } = Dimensions.get('window');

export default function RoleplayScenario({ onComplete, onBack }: RoleplayScenarioProps) {
  const [currentScreen, setCurrentScreen] = useState(-1); // -1 = new welcome screen, 0 = intro, 1 = scenario, etc.
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  };

  const handleStartRoleplay = () => {
    setCurrentScreen(0);
    scrollToTop();
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const goBack = () => {
    if (currentScreen === -1) {
      if (onBack) onBack();
    } else if (currentScreen === 0) {
      setCurrentScreen(-1);
    } else if (currentScreen === 1) {
      setCurrentScreen(0);
    } else if (currentScreen > 1 && currentScreen <= 6) {
      setCurrentScreen(currentScreen - 1);
    }
    scrollToTop();
  };

  const handleChoiceSelect = (choiceNumber: number) => {
    setSelectedChoice(choiceNumber);
    // REMOVED: setCurrentScreen(3); - Don't navigate automatically
    scrollToTop();
  };

  const handleContinue = () => {
    if (currentScreen === 2 && selectedChoice !== null) {
      // Only navigate from choices screen if a choice is selected
      setCurrentScreen(3);
    } else if (currentScreen === 3) {
      setCurrentScreen(4);
    } else if (currentScreen === 4) {
      setCurrentScreen(5);
    } else if (currentScreen === 5) {
      setCurrentScreen(6); // Go to new reflection screen instead of completing
    } else if (currentScreen === 6) {
      onComplete();
    } else {
      setCurrentScreen(currentScreen + 1);
    }
    scrollToTop();
  };

  const openVideoModal = () => {
    setShowVideoModal(true);
    setIsPlaying(true);
  };

  const closeVideoModal = () => {
    setIsPlaying(false);
    setShowVideoModal(false);
  };

  // New function to open YouTube Short in browser
  const openYouTubeShort = async () => {
    const youtubeUrl = `https://www.youtube.com/shorts/s-hpQ9XBGP4`;

    try {
      const supported = await Linking.canOpenURL(youtubeUrl);

      if (supported) {
        await Linking.openURL(youtubeUrl);
      } else {
        // Fallback to modal if YouTube app/browser isn't available
        console.log("YouTube app not available, opening in modal");
        openVideoModal();
      }
    } catch (error) {
      console.log("Error opening YouTube:", error);
      // Fallback to modal on error
      openVideoModal();
    }
  };

  const getResponseText = () => {
    switch (selectedChoice) {
      case 1:
        return "The best part of this is that you have clarity! Dance comes first and that's ok. But let's see where that could lead.";
      case 2:
        return "You seem to be prioritizing your friends and family which is nice to see! But your dance career is making it difficult to show up in all the ways you'd like to.";
      case 3:
        return "Your finances are in order and you know you want to be there for your friend's big day. But guilt and pressure are piling on. So no matter what you do, you're conflicted.";
      default:
        return "";
    }
  };

  const getFollowUpText = () => {
    switch (selectedChoice) {
      case 1:
        return "There's a possibility that you could look back and realize that you missed out on the important stuff. Family, friends, relationships… that's really what life is all about and it's what matters in the end. It's easy to feel like dance will never let you down like people might, but the truth is, dance isn't a person who can love you back either. Only the people you pour your time and effort into can do that.";
      case 2:
        return "We all know that dance careers are hardly financially lucrative. We're not in it for the money and that's ok. But when it comes to big life events like your best friend's wedding, you feel strapped for cash and restricted to the bare minimum. While you don't need to be rolling in the dough, what if there was another way?";
      case 3:
        return "Your dance career has put you between a rock and a hard place. The lifestyle and expectations that come with being a professional dancer are making it harder and harder to do the things that truly matter to you. You don't want to let go of dance, but you want don't want to feel pressure to choose between having a normal life and being successful in your career.";
      default:
        return "";
    }
  };

  // NEW: Day 3 Welcome Screen
  if (currentScreen === -1) {
    return (
      <View style={styles.container}>
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={28} color="#E2DED0" />
            </TouchableOpacity>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.welcomeCard}>
              <View style={styles.welcomeIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={styles.heroImage}
                />
              </View>

              <Text style={styles.welcomeTitle}>Welcome to Day 3!</Text>

              <Text style={styles.welcomeDescription}>
                You're doing something truly remarkable. Making time for your growth and future is one of the most powerful commitments you can make to yourself.
              </Text>

              <Text style={styles.welcomeDescription}>
                By showing up today, you're proving that you're serious about creating the life you deserve - one that honors both your passion for dance and your dreams beyond it.
              </Text>

              <View style={styles.celebrationBox}>
                <Text style={styles.celebrationTitle}>Celebrating Your Progress</Text>
                <Text style={styles.celebrationItem}>• You've identified your dreamer type</Text>
                <Text style={styles.celebrationItem}>• You've challenged industry myths</Text>
                <Text style={styles.celebrationItem}>• You're building self-awareness</Text>
                <Text style={styles.celebrationItem}>• You're prioritizing your future</Text>
              </View>

              <Text style={styles.welcomeFooter}>
                Today, we'll explore what life could look like if you continued down the path of professional dance versus choosing a different route. Get ready to imagine new possibilities!
              </Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleStartRoleplay}
                activeOpacity={0.8}
              >
                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.continueButtonText}>Let's Begin Day 3</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ArrowLeft size={28} color="#E2DED0" />
            </TouchableOpacity>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.introCard}>
              <View style={styles.introIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={styles.heroImage}
                />
              </View>

              <Text style={styles.introTitle}>What's the alternative?</Text>

              <Text style={styles.introDescription}>
                Let's walk through a common scenario you may find yourself in if you continue down the path of professional dance. Choose what you'd be most likely to do in this scenario and we'll shed light on an alternative. You have more options than you might think.
              </Text>

              <TouchableOpacity
                style={styles.startButton}
                onPress={() => {
                  setCurrentScreen(1);
                  scrollToTop();
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.startButtonText}>Begin</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 1) {
    return (
      <View style={styles.container}>
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ArrowLeft size={28} color="#E2DED0" />
            </TouchableOpacity>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioTitle}>Imagine This</Text>

              <Text style={styles.scenarioText}>
                It's a year in the future and you just booked your next dance contract. You open the mail to discover one of your best childhood friends is getting married in the Bahamas in a few months and you're invited.
              </Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 2) {
    return (
      <View style={styles.container}>
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ArrowLeft size={28} color="#E2DED0" />
            </TouchableOpacity>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.choicesCard}>
              <Text style={styles.choicesTitle}>Your Options</Text>

              <View style={styles.choicesContainer}>
                <TouchableOpacity
                  style={[
                    styles.choiceButton,
                    selectedChoice === 1 && styles.choiceButtonSelected
                  ]}
                  onPress={() => handleChoiceSelect(1)}
                  activeOpacity={0.8}
                >
                  <View style={styles.choiceContent}>
                    {selectedChoice === 1 && (
                      <View style={styles.selectedIndicator}>
                        <Check size={16} color="#E2DED0" />
                      </View>
                    )}
                    <Text style={[
                      styles.choiceText,
                      selectedChoice === 1 && styles.choiceTextSelected
                    ]}>
                      Respectfully decline the invitation. Your dance career comes first. It's a no-brainer.
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.choiceButton,
                    selectedChoice === 2 && styles.choiceButtonSelected
                  ]}
                  onPress={() => handleChoiceSelect(2)}
                  activeOpacity={0.8}
                >
                  <View style={styles.choiceContent}>
                    {selectedChoice === 2 && (
                      <View style={styles.selectedIndicator}>
                        <Check size={16} color="#E2DED0" />
                      </View>
                    )}
                    <Text style={[
                      styles.choiceText,
                      selectedChoice === 2 && styles.choiceTextSelected
                    ]}>
                      You can't <Text style={{ fontStyle: 'italic' }}>really</Text> afford it but you plan to go, of course. That's what swings are for! You'll think about the financial consequences later…
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.choiceButton,
                    selectedChoice === 3 && styles.choiceButtonSelected
                  ]}
                  onPress={() => handleChoiceSelect(3)}
                  activeOpacity={0.8}
                >
                  <View style={styles.choiceContent}>
                    {selectedChoice === 3 && (
                      <View style={styles.selectedIndicator}>
                        <Check size={16} color="#E2DED0" />
                      </View>
                    )}
                    <Text style={[
                      styles.choiceText,
                      selectedChoice === 3 && styles.choiceTextSelected
                    ]}>
                      You have enough savings to cover the trip but you're nervous to ask your director for the time off so early into the contract.
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={[
                  styles.continueQuestionButton,
                  selectedChoice === null && styles.continueButtonDisabled
                ]}
                onPress={handleContinue}
                disabled={selectedChoice === null}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.continueQuestionButtonContent,
                  { backgroundColor: '#928490' },
                  selectedChoice === null && styles.continueButtonContentDisabled
                ]}>
                  <Text style={styles.continueQuestionButtonText}>
                    Continue
                  </Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 3) {
    return (
      <View style={styles.container}>
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ArrowLeft size={28} color="#E2DED0" />
            </TouchableOpacity>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.responseCard}>
              <Text style={styles.responseTitle}>Here's where you're at</Text>

              <Text style={styles.responseText}>{getResponseText()}</Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 4) {
    return (
      <View style={styles.container}>
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ArrowLeft size={28} color="#E2DED0" />
            </TouchableOpacity>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.followUpCard}>
              <Text style={styles.followUpTitle}>Here's your situation</Text>

              <Text style={styles.followUpText}>{getFollowUpText()}</Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.continueButtonText}>See the Alternative</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 5) {
    return (
      <View style={styles.container}>
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ArrowLeft size={28} color="#E2DED0" />
            </TouchableOpacity>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.alternativeCard}>
              <View style={styles.alternativeIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={styles.heroImage}
                />
              </View>

              <Text style={styles.alternativeTitle}>So, what's the alternative?</Text>
              <Text style={styles.alternativeText}>
                You finish off your dance contract on your terms, retiring with grace and dignity. You've started in a new career making more money than ever with three weeks of paid time off. You take dance class every Thursday and spend your weekends trying different hobbies.
              </Text>

              <Text style={styles.alternativeText}>
                You get invited to your childhood friend's wedding in the Bahamas and you immediately RSVP. You pay for everything in full (no credit cards needed!) and use your PTO with no hassle from your boss. (In fact, you're slightly freaking out in the inside about getting PAID to go on vacation!)
              </Text>

              <Text style={styles.alternativeText}>
                You have the best time seeing old friends and celebrating this once in a lifetime event with the memories to prove it. You're still living the dream. How does that sound?
              </Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.continueButtonText}>Continue to Reflection</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // NEW: Reflection Screen after Alternative
  if (currentScreen === 6) {
    return (
      <View style={styles.container}>
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ArrowLeft size={28} color="#E2DED0" />
            </TouchableOpacity>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.reflectionCard}>
              <View style={styles.reflectionIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={styles.heroImage}
                />
              </View>

              <Text style={styles.reflectionTitle}>Expanding Your Vision</Text>

              <Text style={styles.reflectionText}>
                This was just one specific example of an alternative path. As you continue to work on becoming an expansive dreamer and bust those myths, who knows what else you can apply the alternative to?
              </Text>

              <Text style={styles.reflectionText}>
                Every choice you make opens up new possibilities. The wedding scenario shows how financial stability and work-life balance can transform your ability to show up for the people and experiences that matter most.
              </Text>

              <Text style={styles.reflectionText}>
                Take a detour to see how our founder has done it, but don't forget to come back and mark this day as complete!
              </Text>

              {/* YouTube Short Thumbnail */}
              <TouchableOpacity
                style={styles.videoThumbnailContainer}
                onPress={openYouTubeShort}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: 'https://img.youtube.com/vi/s-hpQ9XBGP4/maxresdefault.jpg' }}
                  style={styles.videoThumbnail}
                  resizeMode="cover"
                />
                <View style={styles.playButtonOverlay}>
                  <View style={styles.playButton}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Journal Callout */}
              <View style={styles.journalCallout}>
                <Text style={styles.journalCalloutTitle}>Your Personal Space</Text>
                <Text style={styles.journalCalloutText}>
                  There's no journal prompt today but feel free to use the journal tab at any time to jot down your thoughts.{"\n\n"}
                  This app is for you! Use it how you'd like to!
                </Text>
              </View>

              <TouchableOpacity
                style={styles.completeButton}
                onPress={onComplete}
                activeOpacity={0.8}
              >
                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.completeButtonText}>Mark Day 3 As Complete</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Keep the modal as fallback */}
        <Modal
          visible={showVideoModal}
          transparent={true}
          animationType="fade"
          onRequestClose={closeVideoModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeVideoModal}
                activeOpacity={0.8}
              >
                <X size={28} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.videoPlayerContainer}>
                <YoutubePlayer
                  height={height * 0.75}
                  play={isPlaying}
                  videoId={'ShIxdYpquqA'}
                  webViewProps={{
                    allowsFullscreenVideo: true,
                  }}
                  onChangeState={(state) => {
                    console.log('Video state:', state);
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return null;
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
  // NEW: Welcome Screen Styles
  welcomeCard: {
    marginHorizontal: 24,
    marginTop: 50,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  welcomeIconContainer: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 32,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },
  welcomeDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  celebrationBox: {
    width: '100%',
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(146, 132, 144, 0.2)',
  },
  celebrationTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#647C90',
    marginBottom: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  celebrationItem: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: '#4E4F50',
    lineHeight: 24,
    marginBottom: 8,
  },
  welcomeFooter: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: '#928490',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
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
    marginRight: 8,
    fontWeight: '600',
  },
  // NEW: Reflection Screen Styles
  reflectionCard: {
    marginHorizontal: 24,
    marginTop: 50,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  reflectionIconContainer: {
    marginBottom: 30,
  },
  reflectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '700',
  },
  reflectionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  journalCallout: {
    width: '100%',
    backgroundColor: 'rgba(100, 124, 144, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(100, 124, 144, 0.2)',
  },
  journalCalloutTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  journalCalloutText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 22,
  },
  // Existing styles remain the same...
  introCard: {
    marginHorizontal: 24,
    marginTop: 50,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  introIconContainer: {
    marginBottom: 24,
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
    marginBottom: 32,
  },
  startButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  startButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2DED0',
  },
  startButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#E2DED0',
    marginRight: 8,
    fontWeight: '600',
  },
  scenarioCard: {
    marginHorizontal: 24,
    marginTop: 50,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  scenarioTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '700',
  },
  scenarioText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  continueButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2DED0',
    backgroundColor: '#928490',
  },
  choicesCard: {
    marginHorizontal: 24,
    marginTop: 50,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  choicesTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '700',
  },
  choicesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  // UPDATED: Choice button styles with visual feedback
  choiceButton: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  choiceButtonSelected: {
    backgroundColor: 'rgba(146, 132, 144, 0.3)',
    borderColor: '#928490',
    borderWidth: 2,
  },
  choiceContent: {
    padding: 20,
    paddingRight: 50, // Extra padding for the checkmark
  },
  choiceText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 24,
    textAlign: 'center',
  },
  choiceTextSelected: {
    color: '#4E4F50',
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#928490',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // NEW: Continue button styles for choices screen
  continueQuestionButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  continueQuestionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2DED0',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonContentDisabled: {
    backgroundColor: '#B8B8B8',
  },
  continueQuestionButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#E2DED0',
    marginRight: 8,
    fontWeight: '600',
  },
  responseCard: {
    marginHorizontal: 24,
    marginTop: 50,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  responseTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '700',
  },
  responseText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  followUpCard: {
    marginHorizontal: 24,
    marginTop: 50,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  followUpTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '700',
  },
  followUpText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  alternativeCard: {
    marginHorizontal: 24,
    marginTop: 50,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  alternativeIconContainer: {
    marginBottom: 24,
  },
  alternativeTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '700',
  },
  alternativeText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  completeButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  completeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2DED0',
    backgroundColor: '#928490',
  },
  completeButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#E2DED0',
    marginRight: 8,
    fontWeight: '600',
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#647C90',
    borderWidth: 2,
    marginBottom: 10,
  },
  // YouTube Thumbnail Styles
  videoThumbnailContainer: {
    width: '100%',
    marginBottom: 25,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF0000', // YouTube red
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 4, // Slight offset to center the play icon
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxWidth: 500,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: -50,
    right: 0,
    zIndex: 10,
    padding: 10,
  },
  videoPlayerContainer: {
    width: '100%',
    aspectRatio: 9 / 16, // YouTube Shorts aspect ratio (vertical)
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
  },
});