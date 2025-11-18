import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Linking, Animated, ScrollView } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface ScriptPair {
  id: number;
  oldScript: string;
  newScript: string;
  buttonText: string;
}

const scriptPairs: ScriptPair[] = [
  {
    id: 1,
    oldScript: "Oh, I'm just a washed-up dancer now.",
    newScript: "I had an amazing dance career, and now I'm exploring a whole new chapter I'm really excited about.",
    buttonText: "Doesn't that feel better?"
  },
  {
    id: 2,
    oldScript: "I don't really dance anymore… I guess I'm retired.",
    newScript: "I'm channeling my creativity into new projects these days, and it's been surprisingly fulfilling.",
    buttonText: "See how empowering that sounds?"
  },
  {
    id: 3,
    oldScript: "Yeah… I quit dance.",
    newScript: "I transitioned out of the industry recently. I'm learning a bunch of new things right now, just trying to find my next adventure.",
    buttonText: "That's owning your story!"
  },
  {
    id: 4,
    oldScript: "I'm not really doing anything interesting right now.",
    newScript: "I'm in the middle of discovering what's next, and it's been an adventure.",
    buttonText: "Ok, she's evolving!"
  },
  {
    id: 5,
    oldScript: "Oh, I just do boring stuff now.",
    newScript: "I've been exploring corporate work that's completely different from dance and I've learned so much.",
    buttonText: "Look at you!"
  },
  {
    id: 6,
    oldScript: "I guess I peaked when I was on stage.",
    newScript: "I loved performing, and now I'm building something that excites me in a whole new way.",
    buttonText: "You're in your growth era!"
  },
  {
    id: 7,
    oldScript: "Nothing compares to dance, so it's just… whatever.",
    newScript: "I'll always love dance, and I've found other passions that light me up too.",
    buttonText: "Ok, multi-hyphenate queen!"
  },
  {
    id: 8,
    oldScript: "I'm kind of lost without dance.",
    newScript: "I'm learning so much about myself outside of dance, and it's been eye-opening.",
    buttonText: "We love that positive honesty!"
  },
  {
    id: 9,
    oldScript: "I used to be a dancer, but now… not really.",
    newScript: "I danced professionally for years, and now I'm applying those skills in new ways.",
    buttonText: "You're still a dancer, girl!"
  },
  {
    id: 10,
    oldScript: "Yeah, I don't dance anymore. It's over.",
    newScript: "I'm dancing as a hobby now and recently found a new career that's actually been surprisingly meaningful.",
    buttonText: "That's the confidence we love!"
  }
];

interface FlipTheScriptProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function FlipTheScript({ onComplete, onBack }: FlipTheScriptProps) {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [showNewScript, setShowNewScript] = useState(false);
  const [screenHistory, setScreenHistory] = useState<Array<{ pairIndex: number, showNew: boolean }>>([]);

  const { scrollViewRef, scrollToTop } = useScrollToTop();
  const { addJournalEntry: addMorningJournalEntry } = useJournaling('discover-dream-life');
  const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('discover-dream-life');

  // Enhanced animation values with useRef for better performance
  const flipAnim = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  const handleStartGame = () => {
    setScreenHistory([{ pairIndex: 0, showNew: false }]);
    scrollToTop();
  };

  const flipCard = useCallback(() => {
    // Reset animations first
    flipAnim.setValue(0);
    cardScale.setValue(1);
    fadeAnim.setValue(1);

    // Scale down slightly before flip for more natural feel
    Animated.sequence([
      Animated.parallel([
        Animated.timing(cardScale, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        })
      ]),
      Animated.parallel([
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ])
    ]).start(() => {
      setShowNewScript(true);
      // FIX: Use functional update to get the current value
      setScreenHistory(prev => [...prev, { pairIndex: currentPairIndex, showNew: true }]);
    });
  }, [currentPairIndex, flipAnim, cardScale, fadeAnim]);

  const handleContinue = useCallback(() => {
    if (showNewScript) {
      if (currentPairIndex < scriptPairs.length - 1) {
        // Fade out current card
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          const newPairIndex = currentPairIndex + 1;

          // Reset all animations BEFORE updating state
          flipAnim.setValue(0);
          fadeAnim.setValue(0);
          cardScale.setValue(1);

          // Update state
          setCurrentPairIndex(newPairIndex);
          setShowNewScript(false);

          // Animate in the next card with a slight delay
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.spring(progressAnim, {
                toValue: (newPairIndex + 1) / scriptPairs.length,
                tension: 50,
                friction: 7,
                useNativeDriver: false,
              })
            ]).start();
          }, 50);

          setScreenHistory(prev => [...prev, { pairIndex: newPairIndex, showNew: false }]);
          scrollToTop();
        });
      } else {
        // Smooth transition to reflection screen
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setScreenHistory(prev => [...prev, { pairIndex: -2, showNew: false }]);
          fadeAnim.setValue(1);
          scrollToTop();
        });
      }
    } else {
      flipCard();
    }
  }, [showNewScript, currentPairIndex, flipCard, fadeAnim, flipAnim, cardScale, progressAnim, scrollToTop]);

  const handleComplete = () => {
    // Add a subtle scale animation on complete
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      onComplete();
    });
  };

  const goBack = () => {
    if (screenHistory.length <= 1) {
      setScreenHistory([]);
      setCurrentPairIndex(0);
      setShowNewScript(false);
      flipAnim.setValue(0);
      fadeAnim.setValue(1);
      cardScale.setValue(1);
      scrollToTop();
      return;
    }

    const newHistory = [...screenHistory];
    newHistory.pop();
    setScreenHistory(newHistory);

    const prevScreen = newHistory[newHistory.length - 1];
    if (prevScreen.pairIndex === -1 || prevScreen.pairIndex === -2) {
      return;
    }

    // Animate the transition back
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentPairIndex(prevScreen.pairIndex);
      setShowNewScript(prevScreen.showNew);
      // Reset flip animation based on whether we're going back to new or old script
      flipAnim.setValue(prevScreen.showNew ? 1 : 0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      scrollToTop();
    });
  };

  // Enhanced flip animation interpolations with perspective
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  // Add perspective for more realistic 3D effect
  const frontAnimatedStyle = {
    transform: [
      { perspective: 1000 },
      { rotateY: frontInterpolate },
      { scale: cardScale }
    ],
    opacity: fadeAnim
  };

  const backAnimatedStyle = {
    transform: [
      { perspective: 1000 },
      { rotateY: backInterpolate },
      { scale: cardScale }
    ],
    opacity: fadeAnim
  };

  // Progress animation interpolation
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Update progress when currentPairIndex changes
  React.useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: (currentPairIndex + 1) / scriptPairs.length,
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [currentPairIndex]);

  // NEW: Intro Screen with Morning Journal
  if (screenHistory.length === 0) {
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

              <Text style={commonStyles.introTitle}>Look at you!</Text>
              <Text style={commonStyles.introDescription}>
                You're almost at the end of this path and you've already dug through a lot. It's not easy and it's ok if this is all still really uncomfortable. You're taking action and you're turning up. The rest is a matter of time, trust me. Let's keep going, one small step at a time.
              </Text>

              <JournalEntrySection
                pathTag="discover-dream-life"
                journalInstruction="Before we begin, let's take a moment to check in with yourself. How are you feeling as you continue this journey?"
                moodLabel="How are you feeling right now?"
                saveButtonText="Save Morning Entry"
              />

              <PrimaryButton title="Let's go" onPress={handleStartGame} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // NEW: Reflection Screen
  const currentScreen = screenHistory[screenHistory.length - 1];
  if (currentScreen.pairIndex === -2) {
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
              <View style={commonStyles.reflectionHeader}>
                <Text style={commonStyles.reflectionTitle}>Navigating Imposter Syndrome</Text>
              </View>

              <View style={commonStyles.reflectionIntro}>
                <Text style={commonStyles.reflectionDescription}>
                  A big part of flipping the script with confidence is navigating imposter syndrome. To end today, let's watch this 5-minute clip to dive deeper into imposter syndrome in dancers and how to get through it.
                </Text>
              </View>

              <View style={commonStyles.videoSection}>
                <View style={commonStyles.videoContainer}>
                  <View style={commonStyles.youtubePlayer}>
                    <YoutubePlayer
                      height={140}
                      play={false}
                      videoId={'w9Tzx-sZhTg'}
                      webViewStyle={commonStyles.youtubeWebView}
                    />
                  </View>
                </View>
              </View>

              <PrimaryButton
                title="Continue"
                onPress={() => {
                  setScreenHistory(prev => [...prev, { pairIndex: -1, showNew: false }]);
                  scrollToTop();
                }}
              />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Final Screen (Updated with End of Day Journal)
  if (currentScreen.pairIndex === -1) {
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

              <View style={commonStyles.finalHeader}>
                <Text style={commonStyles.finalHeading}>Now it's your turn</Text>
              </View>

              <View style={commonStyles.finalTextContainer}>
                <Text style={commonStyles.finalText}>
                  Write your own script for how you'll talk about your transition. What feels authentic and empowering to you?
                </Text>
              </View>

              <JournalEntrySection
                pathTag="discover-dream-life"
                journalInstruction="Before we bring today's session to a close, let's take a moment to check in with yourself again. How are you feeling after today's journey?"
                moodLabel="How are you feeling now?"
                saveButtonText="Save End of Day Entry"
              />

              <View style={commonStyles.finalButtonContainer}>
                <PrimaryButton
                  title="Mark As Complete"
                  onPress={handleComplete}
                />
              </View>
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Script Screens
  const currentPair = scriptPairs[currentPairIndex];

  return (
    <View style={commonStyles.container}>
      <StickyHeader
        onBack={goBack}
        title={`${currentPairIndex + 1} of ${scriptPairs.length}`}
        progress={(currentPairIndex + 1) / scriptPairs.length}
      />

      <ScrollView
        ref={scrollViewRef}
        style={commonStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={() => scrollToTop()}
        onLayout={() => scrollToTop()}
      >
        <View style={commonStyles.centeredContent}>
          <View style={styles.flipContainer}>
            {/* Front of card (old script view) */}
            <Animated.View
              style={[
                styles.choiceCard,
                styles.cardFace,
                frontAnimatedStyle,
              ]}
            >
              <Text style={styles.scriptLabel}>
                What I used to say:
              </Text>

              <View style={styles.scriptCard}>
                <View style={styles.oldScriptCard}>
                  <Text style={styles.oldScriptText}>
                    "{currentPair.oldScript}"
                  </Text>
                </View>
              </View>

              <PrimaryButton
                title="Flip the script!"
                onPress={handleContinue}
              />
            </Animated.View>

            {/* Back of card (new script view) */}
            <Animated.View
              style={[
                styles.choiceCard,
                styles.cardFace,
                styles.cardBack,
                backAnimatedStyle,
              ]}
            >
              <Text style={styles.scriptLabel}>
                What I could say instead:
              </Text>

              <View style={styles.scriptCard}>
                <View style={styles.newScriptCard}>
                  <Text style={styles.newScriptText}>
                    "{currentPair.newScript}"
                  </Text>
                </View>
              </View>

              <PrimaryButton
                title={currentPair.buttonText}
                onPress={handleContinue}
              />
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // UPDATED: Flip container and card styles for entire card flip
  flipContainer: {
    width: width * 0.85,
    height: 400, // Fixed height to prevent layout shift during flip
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceCard: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    backfaceVisibility: 'hidden',
  },
  cardFace: {
    width: '100%',
    height: '100%',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scriptLabel: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 30,
  },
  scriptCard: {
    width: '100%',
    height: 180,
    marginBottom: 40,
  },
  oldScriptCard: {
    backgroundColor: 'rgba(146,132,144,0.15)',
    borderRadius: 16,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#928490',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  oldScriptText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#746C70',
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  newScriptCard: {
    backgroundColor: 'rgba(100,124,144,0.15)',
    borderRadius: 16,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#647C90',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newScriptText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },
});
