import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useStorage } from '@/hooks/useStorage';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { personalizeGreeting, useFirstName } from '@/utils/hooks/useFirstName';

const { height } = Dimensions.get('window');

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
  const [randomizedChoices, setRandomizedChoices] = useState<DreamChoice[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { scrollViewRef, scrollToTop } = useScrollToTop();
  const firstName = useFirstName();
  const [dreamBiggerChoices, setDreamBiggerChoices] = useStorage<{ [key: string]: string }>('DREAM_BIGGER_CHOICES', {});

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
    } else if (currentScreen > 0 && currentScreen <= 12) {
      setCurrentScreen(currentScreen - 1);
    }
    scrollToTop();
  };

  const handleContinue = async () => {
    if (selectedOption === null || isTransitioning) return;

    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 150));

    const choiceIndex = currentScreen - 1;
    const currentChoice = randomizedChoices[choiceIndex];

    if (currentChoice) {
      const newChoices = { ...dreamBiggerChoices, [currentChoice.storyKey]: selectedOption };
      await setDreamBiggerChoices(newChoices);
    }

    if (currentScreen < 10) {
      setCurrentScreen(currentScreen + 1);
      setSelectedOption(null);
    } else {
      setCurrentScreen(11);
      setSelectedOption(null);
    }
    scrollToTop();
    setIsTransitioning(false);
  };

  const handleContinueStory = () => {
    if (currentScreen === 11) {
      setCurrentScreen(12);
    } else {
      onComplete();
    }
    scrollToTop();
  };

  const handleOpenEbook = () => {
    Linking.openURL('https://pivotfordancers.com/products/how-to-pivot/');
  };

  const getDreamSummary = () => {
    const highlights = [
      dreamBiggerChoices.home,
      dreamBiggerChoices.lifestyle,
      dreamBiggerChoices.hobby ? getStoryMapping(dreamBiggerChoices.hobby) : null,
      dreamBiggerChoices.purpose,
    ].filter(Boolean);

    if (highlights.length === 0) {
      return 'You made space to imagine a version of life that feels more expansive, personal, and fully yours.';
    }

    return `Your choices pointed toward a life that includes ${highlights.join(', ')}. That picture matters because it gives you something real to move toward.`;
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

              <Text style={commonStyles.introTitle}>
                {personalizeGreeting('Welcome Back', firstName)}
              </Text>

              <Text style={commonStyles.introDescription}>
                Today we’re stretching your imagination by practicing simple either-or choices that reveal what you want more of in life beyond dance.
              </Text>

              <View style={styles.learningBox}>
                <Text style={styles.learningTitle}>What we'll learn today</Text>
                <Text style={styles.learningItem}>• What your instincts pull you toward</Text>
                <Text style={styles.learningItem}>• Which parts of your future feel most energizing</Text>
                <Text style={styles.learningItem}>• One small way to act on that vision</Text>
              </View>

              <JournalEntrySection
                pathTag="discover-dream-life"
                day="4"
                category="Mindset and Wellness"
                pathTitle="Discover Your Dream Life"
                dayTitle="Dream Bigger"
                journalInstruction="Journal Prompt: Before you begin, what part of your future feels easiest to imagine right now, and what still feels blurry?"
                moodLabel=""
                saveButtonText="Save Entry"
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

              <Text style={commonStyles.introTitle}>What is this day about?</Text>

              <Text style={commonStyles.introDescription}>
                This is a this-or-that exercise. You’ll make quick choices without overthinking them, then use those patterns to reflect on the kind of life you want to build.
              </Text>

              <PrimaryButton title="Start dreaming" onPress={() => setCurrentScreen(1)} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Choice Screens (1-10) - UPDATED WITH HIGHLIGHT AND CONTINUE BUTTON
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
                  style={[
                    styles.choiceButton,
                    selectedOption === currentChoice.option1 && styles.choiceButtonSelected
                  ]}
                  onPress={() => setSelectedOption(currentChoice.option1)}
                  activeOpacity={0.8}
                  disabled={isTransitioning}
                >
                  <View style={styles.optionContent}>
                    {selectedOption === currentChoice.option1 && (
                      <View style={styles.selectedIndicator}>
                        <Check size={16} color="#E2DED0" />
                      </View>
                    )}
                    <Text style={[
                      styles.choiceButtonText,
                      selectedOption === currentChoice.option1 && styles.choiceButtonTextSelected
                    ]}>
                      {currentChoice.option1}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.choiceButton,
                    selectedOption === currentChoice.option2 && styles.choiceButtonSelected
                  ]}
                  onPress={() => setSelectedOption(currentChoice.option2)}
                  activeOpacity={0.8}
                  disabled={isTransitioning}
                >
                  <View style={styles.optionContent}>
                    {selectedOption === currentChoice.option2 && (
                      <View style={styles.selectedIndicator}>
                        <Check size={16} color="#E2DED0" />
                      </View>
                    )}
                    <Text style={[
                      styles.choiceButtonText,
                      selectedOption === currentChoice.option2 && styles.choiceButtonTextSelected
                    ]}>
                      {currentChoice.option2}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <PrimaryButton
                title="Continue"
                onPress={handleContinue}
                disabled={selectedOption === null || isTransitioning}
              />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 11) {
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

              <Text style={commonStyles.reflectionTitle}>Reflect on Today</Text>

              <Text style={commonStyles.reflectionDescription}>
                {getDreamSummary()}
              </Text>

              <Text style={commonStyles.reflectionDescription}>
                Now turn that into action. What is one part of this vision you could explore, research, or test in real life this week?
              </Text>

              <JournalEntrySection
                pathTag="discover-dream-life"
                journalInstruction="Journal Prompt: Which choice felt most meaningful today, and what is one small action you could take to move a little closer to that version of your future?"
                moodLabel=""
                saveButtonText="Save Entry"
              />

              <PrimaryButton title="Continue" onPress={handleContinueStory} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 12) {
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

              <Text style={styles.congratulationsTitle}>Congrats!</Text>
              <Text style={styles.congratulationsText}>
                You made your choices, reflected on what they revealed, and gave yourself permission to imagine more.
              </Text>
              <Text style={styles.congratulationsText}>
                Keep building on that clarity as you move into the next day.
              </Text>

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
  learningBox: {
    width: '100%',
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(146, 132, 144, 0.2)',
  },
  learningTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#647C90',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  learningItem: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: '#4E4F50',
    lineHeight: 24,
    marginBottom: 8,
  },
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
  choiceButtonSelected: {
    backgroundColor: 'rgba(146, 132, 144, 0.3)',
    borderColor: '#928490',
    borderWidth: 2,
  },
  choiceButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
  },
  choiceButtonTextSelected: {
    color: '#4E4F50',
    fontWeight: '600',
  },
  optionContent: {
    paddingRight: 40,
  },
  selectedIndicator: {
    position: 'absolute',
    top: '50%',
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#928490',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -12 }],
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
  congratulationsTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '700',
  },
  congratulationsText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
});
