import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Modal, Linking } from 'react-native';
import { X, Check } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface RoleplayScenarioProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function RoleplayScenario({ onComplete, onBack }: RoleplayScenarioProps) {
  const [currentScreen, setCurrentScreen] = useState(-1);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const { scrollViewRef, scrollToTop } = useScrollToTop();

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
    scrollToTop();
  };

  const handleContinue = () => {
    if (currentScreen === 2 && selectedChoice !== null) {
      setCurrentScreen(3);
    } else if (currentScreen === 3) {
      setCurrentScreen(4);
    } else if (currentScreen === 4) {
      setCurrentScreen(5);
    } else if (currentScreen === 5) {
      setCurrentScreen(6);
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

  const openYouTubeShort = async () => {
    const youtubeUrl = `https://www.youtube.com/shorts/s-hpQ9XBGP4`;

    try {
      const supported = await Linking.canOpenURL(youtubeUrl);

      if (supported) {
        await Linking.openURL(youtubeUrl);
      } else {
        console.log("YouTube app not available, opening in modal");
        openVideoModal();
      }
    } catch (error) {
      console.log("Error opening YouTube:", error);
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
      <View style={commonStyles.container}>
        <StickyHeader onBack={handleBack} />

        <ScrollView
          ref={scrollViewRef}
          style={commonStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => scrollToTop()}
          onLayout={() => scrollToTop()}
        >
          <View style={commonStyles.centeredContent}>
            <Card style={commonStyles.baseCard}>
              <View style={commonStyles.introIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={commonStyles.heroImage}
                />
              </View>

              <Text style={commonStyles.introTitle}>We’re so glad you’re back!</Text>

              <Text style={commonStyles.introDescription}>
                By showing up again and again, you’re proving that you’re serious about creating a meaningful life beyond dance.
              </Text>

              <Text style={commonStyles.introDescription}>
                It’s possible to honor both your passion for dance and your dreams beyond it. And we’re so glad to be here with you.
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

              <PrimaryButton title="Let's Begin" onPress={handleStartRoleplay} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 0) {
    return (
      <View style={commonStyles.container}>
        <StickyHeader onBack={goBack} />

        <ScrollView
          ref={scrollViewRef}
          style={commonStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => scrollToTop()}
          onLayout={() => scrollToTop()}
        >
          <View style={commonStyles.centeredContent}>
            <Card style={commonStyles.baseCard}>
              <View style={commonStyles.introIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={commonStyles.heroImage}
                />
              </View>

              <Text style={commonStyles.introTitle}>What's the alternative?</Text>

              <Text style={commonStyles.introDescription}>
                Let's walk through a common scenario you may find yourself in if you continue down the path of professional dance. Choose what you'd be most likely to do in this scenario and we'll shed light on an alternative. You have more options than you might think.
              </Text>

              <PrimaryButton title="Begin" onPress={() => {
                setCurrentScreen(1);
                scrollToTop();
              }} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 1) {
    return (
      <View style={commonStyles.container}>
        <StickyHeader onBack={goBack} />

        <ScrollView
          ref={scrollViewRef}
          style={commonStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => scrollToTop()}
          onLayout={() => scrollToTop()}
        >
          <View style={commonStyles.centeredContent}>
            <Card style={commonStyles.baseCard}>
              <Text style={styles.scenarioTitle}>Imagine This</Text>

              <Text style={styles.scenarioText}>
                It's a year in the future and you just booked your next dance contract. You open the mail to discover one of your best childhood friends is getting married in the Bahamas in a few months and you're invited.
              </Text>

              <PrimaryButton title="Continue" onPress={handleContinue} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 2) {
    return (
      <View style={commonStyles.container}>
        <StickyHeader onBack={goBack} />

        <ScrollView
          ref={scrollViewRef}
          style={commonStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => scrollToTop()}
          onLayout={() => scrollToTop()}
        >
          <View style={commonStyles.centeredContent}>
            <Card style={commonStyles.baseCard}>
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

              <PrimaryButton
                title="Continue"
                onPress={handleContinue}
                disabled={selectedChoice === null}
              />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 3) {
    return (
      <View style={commonStyles.container}>
        <StickyHeader onBack={goBack} />

        <ScrollView
          ref={scrollViewRef}
          style={commonStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => scrollToTop()}
          onLayout={() => scrollToTop()}
        >
          <View style={commonStyles.centeredContent}>
            <Card style={commonStyles.baseCard}>
              <Text style={styles.responseTitle}>Here's where you're at</Text>

              <Text style={styles.responseText}>{getResponseText()}</Text>

              <PrimaryButton title="Continue" onPress={handleContinue} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 4) {
    return (
      <View style={commonStyles.container}>
        <StickyHeader onBack={goBack} />

        <ScrollView
          ref={scrollViewRef}
          style={commonStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => scrollToTop()}
          onLayout={() => scrollToTop()}
        >
          <View style={commonStyles.centeredContent}>
            <Card style={commonStyles.baseCard}>
              <Text style={styles.followUpTitle}>Here's your situation</Text>

              <Text style={styles.followUpText}>{getFollowUpText()}</Text>

              <PrimaryButton title="See the Alternative" onPress={handleContinue} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 5) {
    return (
      <View style={commonStyles.container}>
        <StickyHeader onBack={goBack} />

        <ScrollView
          ref={scrollViewRef}
          style={commonStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => scrollToTop()}
          onLayout={() => scrollToTop()}
        >
          <View style={commonStyles.centeredContent}>
            <Card style={commonStyles.baseCard}>
              <View style={commonStyles.introIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={commonStyles.heroImage}
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

              <PrimaryButton title="Continue to Reflection" onPress={handleContinue} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // NEW: Reflection Screen after Alternative
  if (currentScreen === 6) {
    return (
      <View style={commonStyles.container}>
        <StickyHeader onBack={goBack} />

        <ScrollView
          ref={scrollViewRef}
          style={commonStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => scrollToTop()}
          onLayout={() => scrollToTop()}
        >
          <View style={commonStyles.centeredContent}>
            <Card style={commonStyles.baseCard}>
              <View style={commonStyles.introIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={commonStyles.heroImage}
                />
              </View>

              <Text style={commonStyles.reflectionTitle}>Expanding Your Vision</Text>

              <Text style={commonStyles.reflectionDescription}>
                This was just one specific example of an alternative path. As you continue to work on becoming an expansive dreamer and bust those myths, who knows what else you can apply the alternative to?
              </Text>

              <Text style={commonStyles.reflectionDescription}>
                Every choice you make opens up new possibilities. The wedding scenario shows how financial stability and work-life balance can transform your ability to show up for the people and experiences that matter most.
              </Text>

              <Text style={commonStyles.reflectionDescription}>
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
                  Remember, feel free to use the journal tab at any time to jot down your thoughts. This app is for you! Use it how you’d like to!
                </Text>
              </View>

              <PrimaryButton title="Mark As Complete" onPress={onComplete} />
            </Card>
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
  // Welcome Screen Styles
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
  // Scenario Styles
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
  // Choices Styles
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
    paddingRight: 50,
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
  // Response Styles
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
  // Follow-up Styles
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
  // Alternative Styles
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
  // Journal Callout
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
    backgroundColor: '#FF0000',
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
    marginLeft: 4,
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
    aspectRatio: 9 / 16,
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
  },
});