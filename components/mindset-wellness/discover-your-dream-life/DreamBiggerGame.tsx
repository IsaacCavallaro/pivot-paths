import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight, Sparkles, ArrowLeft } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface DreamChoice {
  id: number;
  option1: string;
  option2: string;
  storyKey: string;
}

interface DreamBiggerGameProps {
  onComplete: () => void;
  onBack?: () => void;
}

const dreamChoices: DreamChoice[] = [
  {
    id: 1,
    option1: 'Beach house',
    option2: 'Mountain cabin',
    storyKey: 'home'
  },
  {
    id: 2,
    option1: 'Travel the world',
    option2: 'Buy your forever home',
    storyKey: 'lifestyle'
  },
  {
    id: 3,
    option1: 'Learn to surf',
    option2: 'Learn to build pottery',
    storyKey: 'hobby'
  },
  {
    id: 4,
    option1: 'Start a family',
    option2: 'Start a business',
    storyKey: 'purpose'
  },
  {
    id: 5,
    option1: '6-figure income',
    option2: 'Unlimited time off',
    storyKey: 'work'
  },
  {
    id: 6,
    option1: 'Personal chef',
    option2: 'High-quality wardrobe',
    storyKey: 'luxury'
  },
  {
    id: 7,
    option1: 'Work part time',
    option2: 'Retire early',
    storyKey: 'schedule'
  },
  {
    id: 8,
    option1: 'Season tickets to the theatre',
    option2: 'Create your own show',
    storyKey: 'entertainment'
  },
  {
    id: 9,
    option1: 'Run a marathon',
    option2: 'Annual yoga retreats',
    storyKey: 'wellness'
  },
  {
    id: 10,
    option1: 'Donate to charity',
    option2: 'Help your parents retire',
    storyKey: 'giving'
  }
];

// Mapping function to convert specific choices to their story representations
const getStoryMapping = (choice: string): string => {
  const mappings: { [key: string]: string } = {
    'Learn to surf': 'surfing lessons',
    'Learn to build pottery': 'pottery classes',
    'Run a marathon': 'marathon',
    'Annual yoga retreats': 'yoga retreat'
  };

  return mappings[choice] || choice;
};

export default function DreamBiggerGame({ onComplete, onBack }: DreamBiggerGameProps) {
  const [currentScreen, setCurrentScreen] = useState(-1);
  const [choices, setChoices] = useState<{ [key: string]: string }>({});
  const [randomizedChoices, setRandomizedChoices] = useState<DreamChoice[]>([]);

  const { scrollViewRef, scrollToTop } = useScrollToTop();
  const { addJournalEntry: addMorningJournalEntry } = useJournaling('discover-dream-life');
  const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('discover-dream-life');

  useEffect(() => {
    const shuffled = [...dreamChoices].sort(() => Math.random() - 0.5);
    setRandomizedChoices(shuffled);
  }, []);

  const handleStartGame = () => {
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
    } else if (currentScreen > 1 && currentScreen <= 19) {
      setCurrentScreen(currentScreen - 1);
    }
    scrollToTop();
  };

  const handleChoice = (choiceKey: string, selectedOption: string) => {
    const newChoices = { ...choices, [choiceKey]: selectedOption };
    setChoices(newChoices);

    if (currentScreen < 10) {
      setCurrentScreen(currentScreen + 1);
    } else {
      setCurrentScreen(12);
    }
    scrollToTop();
  };

  const handleContinueStory = () => {
    if (currentScreen < 18) {
      setCurrentScreen(currentScreen + 1);
    } else if (currentScreen === 18) {
      setCurrentScreen(19);
    } else {
      onComplete();
    }
    scrollToTop();
  };

  const handleOpenEbook = () => {
    Linking.openURL('https://pivotfordancers.com/products/how-to-pivot/');
  };

  const getStoryText = (screenNumber: number) => {
    switch (screenNumber) {
      case 12:
        return "Explore Your Dream Life";
      case 13:
        return `You wake up in your ${choices.home?.toLowerCase()} to the ${choices.purpose === 'Start a family' ? 'sound of happy kids running around' : 'notification that more sales from your business came through overnight'}.`;
      case 14:
        return `${choices.schedule === 'Work part time' ? 'You work part-time' : 'You\'re on track to retire early'} and you relax at the thought of your ${choices.work?.toLowerCase()} knowing that your ${getStoryMapping(choices.hobby || '').toLowerCase()} are going to be the most challenging part of your day.`;
      case 15:
        return `You head ${choices.luxury === 'Personal chef' ? 'downstairs to eat your chef-prepared breakfast' : 'to your closet and pick out another custom piece from your wardrobe'} and start the day on your terms.`;
      case 16:
        return `Your to-do list involves organizing ${choices.lifestyle === 'Travel the world' ? 'next week\'s travel plans' : 'renovations for your forever home'}, training for that upcoming ${getStoryMapping(choices.wellness || '').toLowerCase()}, and deciding ${choices.giving === 'Donate to charity' ? 'which charity to donate to this month' : 'when you\'re meeting up with your parents now that you helped them retire too'}.`;
      case 17:
        return `And tonight, you're off ${choices.entertainment === 'Season tickets to the theatre' ? 'to the theater with season tickets' : 'to workshop a new show you\'re creating which opens next month'}. Life's good.`;
      default:
        return "";
    }
  };

  // NEW: Intro Screen with Morning Journal
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

              <Text style={commonStyles.introTitle}>Welcome to Day 4</Text>

              <Text style={commonStyles.introDescription}>
                This is where we're diving deeper into becoming the Expansive Dreamer we talked about on Day 1.
              </Text>

              <Text style={commonStyles.introDescription}>
                You've already identified your dreamer type, challenged industry myths, and explored alternatives. Now, let's stretch your imagination even further.
              </Text>

              <JournalEntrySection
                pathTag="discover-dream-life"
                journalInstruction="Before we begin, let's take a moment to check in with yourself. How are you feeling as you continue this journey?"
                moodLabel="How are you feeling right now?"
                saveButtonText="Save Morning Entry"
              />

              <PrimaryButton title="Continue" onPress={handleStartGame} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Original Intro Screen (now screen 0)
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

              <Text style={commonStyles.introTitle}>Dream Bigger</Text>

              <Text style={commonStyles.introDescription}>
                This is a game of instincts. Choose the answer that you resonate with the most to help you dream bigger about what life after dance can be. Don't think too much! There's no right or wrong. Let's see what you can dream up.
              </Text>

              <PrimaryButton title="Start dreaming" onPress={() => setCurrentScreen(1)} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Choice Screens (1-10)
  if (currentScreen >= 1 && currentScreen <= 10) {
    const choiceIndex = currentScreen - 1;
    const currentChoice = randomizedChoices[choiceIndex];

    if (!currentChoice) return null;

    return (
      <View style={commonStyles.container}>
        <StickyHeader
          onBack={goBack}
          title={`${currentScreen} of 10`}
          progress={currentScreen / 10}
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
              <View style={styles.choiceButtons}>
                <TouchableOpacity
                  style={styles.choiceButton}
                  onPress={() => handleChoice(currentChoice.storyKey, currentChoice.option1)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.choiceButtonText}>{currentChoice.option1}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.choiceButton}
                  onPress={() => handleChoice(currentChoice.storyKey, currentChoice.option2)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.choiceButtonText}>{currentChoice.option2}</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Story Screens (11-17)
  if (currentScreen >= 11 && currentScreen <= 17) {
    const storyText = getStoryText(currentScreen);
    const isTitle = currentScreen === 12;
    const isFinal = currentScreen === 17;

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
              {isTitle ? (
                <View style={styles.storyTitleContainer}>
                  <Text style={styles.storyTitle}>{storyText}</Text>
                  <View style={styles.titleUnderline} />
                </View>
              ) : (
                <View style={styles.storyTextContainer}>
                  <Text style={styles.storyText}>{storyText}</Text>
                </View>
              )}

              <PrimaryButton
                title={isFinal ? 'Own It' : 'Continue'}
                onPress={handleContinueStory}
              />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Reflection Screen (now screen 18)
  if (currentScreen === 18) {
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

              <Text style={commonStyles.reflectionTitle}>Building Your Dreamer Muscle</Text>

              <Text style={commonStyles.reflectionDescription}>
                Perhaps this doesn't sound possible? But the goal is to give yourself permission to turn up as the expansive dreamer.
              </Text>

              <Text style={commonStyles.reflectionDescription}>
                This is just an exercise of building the muscle to dream about something other than booking your dream job.
              </Text>

              <Text style={commonStyles.reflectionDescription}>
                Every time you allow yourself to imagine a different future, you're strengthening that expansive dreamer within you.
              </Text>

              <PrimaryButton title="Continue" onPress={handleContinueStory} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Final Screen (now screen 19) with End of Day Journal
  if (currentScreen === 19) {
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

              <View style={styles.storyTextContainer}>
                <Text style={styles.storyText}>
                  Take a moment to notice how you're feeling right now. Are you excited? Skeptical? Overwhelmed?
                </Text>

                <Text style={styles.storyText}>
                  If any part of you thought "this could never be me" - that sounds like an unhelpful story that keeps you stuck.
                </Text>

                <Text style={styles.storyText}>
                  These mindset shifts are exactly what we explore in our resources, helping you rewrite those limiting stories.
                </Text>
              </View>

              {/* Ebook Callout */}
              <View style={styles.ebookCard}>
                <Text style={styles.ebookTitle}>Explore Mindset Tools</Text>
                <Text style={styles.ebookDescription}>
                  If you'd like to dive deeper into shifting those limiting beliefs, our book "How to Pivot" offers practical strategies that might help.
                </Text>
                <PrimaryButton
                  title="Learn More"
                  onPress={handleOpenEbook}
                  style={styles.ebookButton}
                />
              </View>

              <JournalEntrySection
                pathTag="discover-dream-life"
                journalInstruction="Before we bring today's session to a close, let's take a moment to check in with yourself again. How are you feeling after today's journey?"
                moodLabel="How are you feeling now?"
                saveButtonText="Save End of Day Entry"
              />

              <Text style={styles.alternativeClosing}>
                See you for more tomorrow
              </Text>

              <PrimaryButton
                title="Mark As Complete"
                onPress={onComplete}
              />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  choiceButtons: {
    gap: 20,
  },
  choiceButton: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 80,
    justifyContent: 'center',
  },
  choiceButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
  },
  storyTitleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  storyTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 32,
    color: '#647C90',
    textAlign: 'center',
    lineHeight: 38,
    fontWeight: '700',
  },
  titleUnderline: {
    height: 4,
    width: 60,
    backgroundColor: '#928490',
    borderRadius: 2,
    marginTop: 16,
    opacity: 0.6,
  },
  storyTextContainer: {
    width: '100%',
    marginBottom: 32,
  },
  storyText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 28,
    marginTop: 10,
  },
  ebookCard: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#928490',
    width: '100%',
  },
  ebookTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
  },
  ebookDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ebookButton: {
    alignSelf: 'center',
  },
  alternativeClosing: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 0,
    fontWeight: '600',
  },
});