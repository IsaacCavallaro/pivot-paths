import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, TextInput, Alert } from 'react-native';
import { ChevronRight, ArrowLeft, PlusCircle, Smile, Frown, Meh, Laugh, Angry, Heart } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

interface DreamerResult {
  type: string;
  title: string;
  description: string | React.ReactElement;
  subtitle: string;
  color: string;
}

interface MythPair {
  id: number;
  myth: string;
  reality: string;
}


interface MythBusterGameProps {
  onComplete: () => void;
  onBack?: () => void;
}


const mythPairs: MythPair[] = [
  {
    id: 1,
    myth: "Dancers shouldn't have a plan B.",
    reality: "A backup plan is essential."
  },
  {
    id: 2,
    myth: "I can dance well into my 40s.",
    reality: "Most dance careers end in your early 30s."
  },
  {
    id: 3,
    myth: "Real dancers sacrifice everything.",
    reality: "Balance doesn't make you a worse dancer."
  },
  {
    id: 4,
    myth: "The dance industry is my family.",
    reality: "Dance work cultures are often toxic."
  },
  {
    id: 5,
    myth: "Do what you love.",
    reality: "Passion doesn't pay the bills."
  },
  {
    id: 6,
    myth: "The show must go on.",
    reality: "Everyone needs sick days."
  },
  {
    id: 7,
    myth: "Dance is the dream.",
    reality: "You can have more than one dream."
  },
  {
    id: 8,
    myth: "Leaving dance makes me a sellout.",
    reality: "Staying in dance can be seen as settling."
  },
  {
    id: 9,
    myth: "Never give up.",
    reality: "It's ok to let go."
  }
];

export default function MythBusterGame({ onComplete, onBack }: MythBusterGameProps) {
  const [currentScreen, setCurrentScreen] = useState(-1);
  const [day1SkillsQuizResult, setDay1SkillsQuizResult] = useState<DreamerResult | null>(null);
  const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'myth' | 'reality' }>>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [showMismatch, setShowMismatch] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const [morningJournalEntry, setMorningJournalEntry] = useState('');
  const [endOfDayJournalEntry, setEndOfDayJournalEntry] = useState('');
  const [selectedMorningMood, setSelectedMorningMood] = useState<string | null>(null);
  const [selectedEndOfDayMood, setSelectedEndOfDayMood] = useState<string | null>(null);
  const [selectedReflectionMood, setSelectedReflectionMood] = useState<string | null>(null);
  const [animatedValues] = useState(() => new Map());

  const { scrollViewRef, scrollToTop } = useScrollToTop();
  const { addJournalEntry: addMorningJournalEntry } = useJournaling('discover-dream-life');
  const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('discover-dream-life');

  useEffect(() => {
    const loadQuizResult = async () => {
      try {
        const storedResult = await AsyncStorage.getItem('day1SkillsQuizResult');
        if (storedResult) {
          setDay1SkillsQuizResult(JSON.parse(storedResult));
        }
      } catch (error) {
        console.error('Error loading quiz result from AsyncStorage:', error);
      }
    };
    loadQuizResult();
  }, []);

  // Scroll to top whenever screen changes
  useEffect(() => {
    scrollToTop();
  }, [currentScreen]);

  const handleBack = () => {
    onBack?.();
  };

  const handleComplete = () => {
    onComplete();
  };

  const goBack = () => {
    if (currentScreen === 0) {
      setCurrentScreen(-1);
    } else if (currentScreen === 1) {
      setCurrentScreen(0);
    } else if (currentScreen === 2) {
      setMatchedPairs([]);
      setSelectedItems([]);
      setCurrentPairIndex(0);
      setShowMismatch(false);
      setCurrentScreen(1);
    } else if (currentScreen === 3) {
      setCurrentScreen(2);
    } else if (currentScreen > 3) {
      setCurrentScreen(currentScreen - 1);
    }
    scrollToTop();
  };

  useEffect(() => {
    if (currentScreen === 1) {
      setupGame();
    }
  }, [currentScreen]);

  const setupGame = () => {
    const firstThreePairs = mythPairs.slice(0, 3);
    const myths: Array<{ id: string; text: string; pairId: number; type: 'myth' | 'reality' }> = [];
    const realities: Array<{ id: string; text: string; pairId: number; type: 'myth' | 'reality' }> = [];

    firstThreePairs.forEach(pair => {
      myths.push({
        id: `myth_${pair.id}`,
        text: pair.myth,
        pairId: pair.id,
        type: 'myth'
      });
      realities.push({
        id: `reality_${pair.id}`,
        text: pair.reality,
        pairId: pair.id,
        type: 'reality'
      });
    });

    const scrambledMyths = [...myths].sort(() => Math.random() - 0.5);
    const scrambledRealities = [...realities].sort(() => Math.random() - 0.5);

    const allItems = [...scrambledMyths, ...scrambledRealities];
    setGameItems(allItems);
    setCurrentPairIndex(3);
  };

  const handleItemPress = (itemId: string) => {
    if (selectedItems.includes(itemId) || showMismatch) return;

    const newSelected = [...selectedItems, itemId];
    setSelectedItems(newSelected);

    if (newSelected.length === 2) {
      checkMatch(newSelected);
    }
  };

  const checkMatch = (selected: string[]) => {
    const item1 = gameItems.find(item => item.id === selected[0]);
    const item2 = gameItems.find(item => item.id === selected[1]);

    if (item1 && item2 && item1.pairId === item2.pairId) {
      const newMatchedPairs = [...matchedPairs, item1.pairId];
      setMatchedPairs(newMatchedPairs);

      setTimeout(() => {
        const remainingItems = gameItems.filter(item => !selected.includes(item.id));

        if (currentPairIndex < mythPairs.length) {
          const nextPair = mythPairs[currentPairIndex];

          const existingMyths = remainingItems.filter(item => item.type === 'myth');
          const existingRealities = remainingItems.filter(item => item.type === 'reality');

          const newMyth = {
            id: `myth_${nextPair.id}`,
            text: nextPair.myth,
            pairId: nextPair.id,
            type: 'myth' as const
          };
          const newReality = {
            id: `reality_${nextPair.id}`,
            text: nextPair.reality,
            pairId: nextPair.id,
            type: 'reality' as const
          };

          const allMyths = [...existingMyths];
          const allRealities = [...existingRealities];

          const mythInsertIndex = Math.floor(Math.random() * (allMyths.length + 1));
          allMyths.splice(mythInsertIndex, 0, newMyth);

          const realityInsertIndex = Math.floor(Math.random() * (allRealities.length + 1));
          allRealities.splice(realityInsertIndex, 0, newReality);

          const newItems = [...allMyths, ...allRealities];

          setGameItems(newItems);
          setCurrentPairIndex(currentPairIndex + 1);
        } else {
          setGameItems(remainingItems);
        }

        setSelectedItems([]);

        if (newMatchedPairs.length === mythPairs.length) {
          setTimeout(() => {
            setCurrentScreen(2);
          }, 500);
        }
      }, 600);
    } else {
      setShowMismatch(true);
      setTimeout(() => {
        setShowMismatch(false);
        setSelectedItems([]);
      }, 800);
    }
  };

  const getItemStyle = (itemId: string) => {
    const isSelected = selectedItems.includes(itemId);
    const isMatched = gameItems.find(item => item.id === itemId && matchedPairs.includes(item.pairId));

    if (isMatched) {
      return [styles.gameButton, styles.matchedButton];
    } else if (isSelected && showMismatch) {
      return [styles.gameButton, styles.mismatchButton];
    } else if (isSelected) {
      return [styles.gameButton, styles.selectedButton];
    } else {
      return [styles.gameButton];
    }
  };

  const openYouTubeShort = async () => {
    const youtubeUrl = `https://www.youtube.com/shorts/8DwWYZHsUHw`;

    try {
      const supported = await Linking.canOpenURL(youtubeUrl);

      if (supported) {
        await Linking.openURL(youtubeUrl);
      } else {
        console.log("YouTube app not available");
      }
    } catch (error) {
      console.log("Error opening YouTube:", error);
    }
  };

  // Welcome Screen with Morning Journal Section
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

              {day1SkillsQuizResult ? (
                <>
                  <Text style={commonStyles.introTitle}>Welcome Back!</Text>
                  <Text style={commonStyles.introDescription}>
                    Yesterday, you discovered your "Dreamer Type":
                  </Text>
                  <View style={[styles.learningBox, { borderColor: day1SkillsQuizResult.color + '20' }]}>
                    <Text style={[styles.learningBoxTitle, { color: day1SkillsQuizResult.color }]}>
                      {day1SkillsQuizResult.title}
                    </Text>
                  </View>
                  <Text style={commonStyles.introDescription}>
                    Today, we're diving into the myths that shape our thinking in the dance industry.
                  </Text>
                  <Text style={commonStyles.introDescription}>
                    Many dancers carry beliefs that may actually be holding them back from building sustainable, fulfilling careers.
                  </Text>
                </>
              ) : (
                <>
                  <Text style={commonStyles.introTitle}>Welcome Back!</Text>
                  <Text style={commonStyles.introDescription}>
                    Today we're diving into the myths that shape our thinking in the dance industry.
                  </Text>
                  <Text style={commonStyles.introDescription}>
                    Many dancers carry beliefs that may actually be holding them back from building sustainable, fulfilling careers.
                  </Text>
                </>
              )}

              <View style={styles.learningBox}>
                <Text style={styles.learningBoxTitle}>What You'll Learn:</Text>
                <Text style={styles.learningBoxItem}>• Common myths that dancers believe</Text>
                <Text style={styles.learningBoxItem}>• The reality behind these industry narratives</Text>
                <Text style={styles.learningBoxItem}>• Whether you still believe in these common myths</Text>
              </View>

              <Text style={styles.welcomeFooter}>
                You’ll be playing a match game to help you identify and challenge the myths you might be holding onto.
              </Text>

              <JournalEntrySection
                pathTag="discover-dream-life"
                journalInstruction="Before we begin, let’s take a moment to check in with yourself. How are you feeling after yesterday’s quiz? Is there anything you’re hoping to gain today?"
                moodLabel=""
                saveButtonText="Save Morning Entry"
              />

              <PrimaryButton title="Continue" onPress={() => setCurrentScreen(0)} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Intro Screen
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

              <Text style={commonStyles.introTitle}>Myth Buster</Text>

              <Text style={commonStyles.introDescription}>
                Let's see if we can expose the myths of the dance industry by matching the myth to the reality
              </Text>

              <PrimaryButton title="Start the Game" onPress={() => setCurrentScreen(1)} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Reflection Screen after Game Completion
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
              <View style={commonStyles.introIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={commonStyles.heroImage}
                />
              </View>

              <Text style={commonStyles.reflectionTitle}>Time for Reflection</Text>

              <Text style={commonStyles.reflectionDescription}>
                Which myth are you not convinced is actually a myth?{"\n"}
                {/* <Text style={styles.reflectionEmphasis}>(No judgement - this is why we do this)</Text> */}
              </Text>

              <Text style={commonStyles.reflectionDescription}>
                Take a moment to reflect on the myths you encountered.
              </Text>


              <Text style={commonStyles.reflectionDescription}>
                <Text style={styles.reflectionEmphasis}>(If you're having trouble recalling, feel free to go back and play the match game again)</Text>
              </Text>


              <JournalEntrySection
                pathTag="discover-dream-life"
                journalInstruction="Which myth are you still holding onto? Why does it feel true to you?"
                moodLabel=""
                saveButtonText="Add to Journal"
              />

              <PrimaryButton title="Continue" onPress={() => setCurrentScreen(3)} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Congratulations Screen with End of Day Journal Section
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
              <View style={commonStyles.introIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={commonStyles.heroImage}
                />
              </View>

              <Text style={commonStyles.reflectionTitle}>Great Work!</Text>

              <Text style={commonStyles.reflectionDescription}>
                When pivoting away from dance, it’s so important to really think about the myths you currently believe and whether or not they’re serving you.
              </Text>

              <Text style={commonStyles.reflectionDescription}>
                The dance industry feeds us a lot of noise that doesn't actually benefit dancers.
              </Text>

              <Text style={commonStyles.reflectionDescription}>
                Take a detour and check out the myths our founder had to unlearn. But don’t forget to come back and mark this day as complete!
              </Text>

              <TouchableOpacity
                style={styles.videoThumbnailContainer}
                onPress={openYouTubeShort}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: 'https://img.youtube.com/vi/8DwWYZHsUHw/maxresdefault.jpg' }}
                  style={styles.videoThumbnail}
                  resizeMode="cover"
                />
                <View style={styles.playButtonOverlay}>
                  <View style={styles.playButton}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <Text style={styles.reflectionClosing}>
                See you tomorrow.
              </Text>

              <PrimaryButton title="Mark As Complete" onPress={handleComplete} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Game Screen
  return (
    <View style={commonStyles.container}>
      <StickyHeader
        onBack={goBack}
        title={`${matchedPairs.length}/${mythPairs.length} pairs matched`}
        progress={matchedPairs.length / mythPairs.length}
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
          <Card style={commonStyles.baseCard}>
            <Text style={styles.gameTitle}>Myth Buster</Text>
            <Text style={styles.gameInstructions}>
              Tap to match myths with their realities
            </Text>

            <View style={styles.columnsContainer}>
              <View style={styles.column}>
                <Text style={styles.columnTitle}>Myth</Text>
                {gameItems.filter(item => item.type === 'myth').map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={getItemStyle(item.id)}
                    onPress={() => handleItemPress(item.id)}
                    activeOpacity={0.8}
                    disabled={matchedPairs.includes(item.pairId)}
                  >
                    <Text style={[
                      styles.gameButtonText,
                      selectedItems.includes(item.id) && styles.selectedButtonText,
                      matchedPairs.includes(item.pairId) && styles.matchedButtonText,
                      selectedItems.includes(item.id) && showMismatch && styles.mismatchButtonText
                    ]}>
                      {item.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.column}>
                <Text style={styles.columnTitle}>Reality</Text>
                {gameItems.filter(item => item.type === 'reality').map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={getItemStyle(item.id)}
                    onPress={() => handleItemPress(item.id)}
                    activeOpacity={0.8}
                    disabled={matchedPairs.includes(item.pairId)}
                  >
                    <Text style={[
                      styles.gameButtonText,
                      selectedItems.includes(item.id) && styles.selectedButtonText,
                      matchedPairs.includes(item.pairId) && styles.matchedButtonText,
                      selectedItems.includes(item.id) && showMismatch && styles.mismatchButtonText
                    ]}>
                      {item.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Welcome Screen Styles
  learningBox: {
    width: '100%',
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(146, 132, 144, 0.2)',
  },
  learningBoxTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#647C90',
    marginBottom: 12,
    fontWeight: '600',
  },
  learningBoxItem: {
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
  // Game Styles
  gameTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '700',
  },
  gameInstructions: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#928490',
    textAlign: 'center',
    marginBottom: 30,
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  column: {
    flex: 1,
  },
  columnTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '700',
  },
  gameButton: {
    width: '100%',
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'rgba(100, 124, 144, 0.2)',
    borderColor: '#647C90',
  },
  matchedButton: {
    backgroundColor: 'rgba(90, 125, 123, 0.2)',
    borderColor: '#5A7D7B',
    opacity: 0,
  },
  mismatchButton: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    borderColor: '#dc3545',
  },
  gameButtonText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 18,
  },
  selectedButtonText: {
    color: '#647C90',
    fontFamily: 'Montserrat-SemiBold',
  },
  matchedButtonText: {
    color: '#5A7D7B',
  },
  mismatchButtonText: {
    color: '#dc3545',
  },
  reflectionEmphasis: {
    fontStyle: 'italic',
    color: '#928490',
  },
  reflectionClosing: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '600',
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
});