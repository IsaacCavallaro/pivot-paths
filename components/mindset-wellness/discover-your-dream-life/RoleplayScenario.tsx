import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Modal, Linking } from 'react-native';
import { ChevronRight, ArrowLeft, X } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

interface RoleplayScenarioProps {
  onComplete: () => void;
  onBack?: () => void;
}

const { width, height } = Dimensions.get('window');

export default function RoleplayScenario({ onComplete, onBack }: RoleplayScenarioProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleStartRoleplay = () => {
    setCurrentScreen(1);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const goBack = () => {
    if (currentScreen === 1) {
      setCurrentScreen(0);
    } else if (currentScreen > 1 && currentScreen <= 5) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleChoiceSelect = (choiceNumber: number) => {
    setSelectedChoice(choiceNumber);
    setCurrentScreen(3);
  };

  const handleContinue = () => {
    if (currentScreen === 3) {
      setCurrentScreen(4);
    } else if (currentScreen === 4) {
      setCurrentScreen(5);
    } else if (currentScreen === 5) {
      onComplete();
    } else {
      setCurrentScreen(currentScreen + 1);
    }
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

  if (currentScreen === 0) {
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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                onPress={handleStartRoleplay}
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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                <View style={styles.continueButtonContent}>
                  <Text style={styles.continueButtonText}>What will you do?</Text>
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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.choicesCard}>
              <Text style={styles.choicesTitle}>Your Options</Text>

              <View style={styles.choicesContainer}>
                <TouchableOpacity
                  style={styles.choiceButton}
                  onPress={() => handleChoiceSelect(1)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.choiceText}>
                    Respectfully decline the invitation. Your dance career comes first. It's a no-brainer.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.choiceButton}
                  onPress={() => handleChoiceSelect(2)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.choiceText}>
                    You can't <Text style={{ fontStyle: 'italic' }}>really</Text> afford it but you plan to go, of course. That's what swings are for! You'll think about the financial consequences later…
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.choiceButton}
                  onPress={() => handleChoiceSelect(3)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.choiceText}>
                    You have enough savings to cover the trip but you're nervous to ask your director for the time off so early into the contract.
                  </Text>
                </TouchableOpacity>
              </View>
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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.responseCard}>
              <Text style={styles.responseTitle}>Here's where you're at</Text>

              <Text style={styles.responseText}>{getResponseText()}</Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <View style={styles.continueButtonContent}>
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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.followUpCard}>
              <Text style={styles.followUpTitle}>Here's your situation</Text>

              <Text style={styles.followUpText}>{getFollowUpText()}</Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <View style={styles.continueButtonContent}>
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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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

              {/* Updated YouTube Short Button - Now shows thumbnail */}
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

              <Text style={styles.alternativeClosing}>
                See you for more tomorrow.
              </Text>

              <TouchableOpacity
                style={styles.completeButton}
                onPress={onComplete}
                activeOpacity={0.8}
              >
                <View style={styles.completeButtonContent}>
                  <Text style={styles.completeButtonText}>Mark As Complete</Text>
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
  continueButton: {
    borderRadius: 30,
    overflow: 'hidden',
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
  continueButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    marginRight: 8,
    fontWeight: '600',
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
  },
  choiceButton: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  choiceText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 24,
    textAlign: 'center',
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
  alternativeClosing: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600',
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