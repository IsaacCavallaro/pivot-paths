import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { ChevronRight, Sparkles, ArrowLeft } from 'lucide-react-native';

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

const { width, height } = Dimensions.get('window');
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
  const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-10 = choices, 11-18 = story
  const [choices, setChoices] = useState<{ [key: string]: string }>({});
  const [randomizedChoices, setRandomizedChoices] = useState<DreamChoice[]>([]);

  useEffect(() => {
    // Randomize the order of choices when component mounts
    const shuffled = [...dreamChoices].sort(() => Math.random() - 0.5);
    setRandomizedChoices(shuffled);
  }, []);

  const handleStartGame = () => {
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
    } else if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleChoice = (choiceKey: string, selectedOption: string) => {
    const newChoices = { ...choices, [choiceKey]: selectedOption };
    setChoices(newChoices);

    if (currentScreen < 10) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Skip to story screen 12 (Explore Your Dream Life)
      setCurrentScreen(12);
    }
  };

  const handleContinueStory = () => {
    if (currentScreen < 18) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
    }
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
      case 18:
        return "Use this dream life experiment to get even more specific about your vision for the future. If these ideas seem far-fetched, that's the point! This is just the beginning of what life after dance can be. It won't happen overnight, but it can happen if you go for it.";
      default:
        return "";
    }
  };

  // Intro Screen
  if (currentScreen === 0) {
    return (
      <View style={styles.container}>
        {/* Sticky Header */}
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={28} color="#E2DED0" />
            </TouchableOpacity>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.centeredContent}>
            <View style={styles.introCard}>
              <View style={styles.introIconContainer}>
                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                  <Sparkles size={32} color="#E2DED0" />
                </View>
              </View>

              <Text style={styles.introTitle}>Dream Bigger</Text>

              <Text style={styles.introDescription}>
                This is a game of instincts. Choose the answer that you resonate with the most to help you dream bigger about what life after dance can be. Don't think too much! There's no right or wrong. Let's see what you can dream up.
              </Text>

              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartGame}
                activeOpacity={0.8}
              >
                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.startButtonText}>Start dreaming</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
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
      <View style={styles.container}>
        {/* Sticky Header with Progress */}
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ArrowLeft size={28} color="#E2DED0" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.progressText}>{currentScreen} of 10</Text>
            </View>
            <View style={styles.backButton} />
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentScreen / 10) * 100}%` }]} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.centeredContent}>
            <View style={styles.choiceCard}>
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
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Story Screens (11-18)
  if (currentScreen >= 11 && currentScreen <= 18) {
    const storyText = getStoryText(currentScreen);
    const isTitle = currentScreen === 12;
    const isFinal = currentScreen === 18;

    return (
      <View style={styles.container}>
        <View style={styles.storyBackground}>
          <View style={styles.storyBackgroundPattern} />
        </View>

        {/* Sticky Header */}
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.centeredContent}>
            <View style={styles.storyCard}>
              {isFinal && (
                <View style={styles.finalHeader}>
                  <Sparkles size={24} color="#928490" />
                  <Text style={styles.finalHeading}>How does this make you feel?</Text>
                  <Sparkles size={24} color="#928490" />
                </View>
              )}

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

              {isFinal && (
                <Text style={styles.alternativeClosing}>
                  See you for more tomorrow
                </Text>
              )}

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinueStory}
                activeOpacity={0.8}
              >
                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.continueButtonText}>
                    {isFinal ? 'Mark as complete' : 'Continue'}
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

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DED0',
  },
  storyBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  storyBackgroundPattern: {
    flex: 1,
    opacity: 0.03,
    backgroundColor: '#928490',
    transform: [{ rotate: '45deg' }, { scale: 1.5 }],
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
    zIndex: 1,
  },
  content: {
    paddingBottom: 30,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height - 200, // Ensure content takes most of the screen height
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
  progressText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#E2DED0',
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(226, 222, 208, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E2DED0',
    borderRadius: 3,
  },
  introCard: {
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
  introIconContainer: {
    marginBottom: 24,
  },
  introIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  introTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 32,
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
  choiceCard: {
    width: width * 0.85,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginVertical: 20,
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
  choiceButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
  },
  storyCard: {
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
    minWidth: width * 0.5,
  },
  continueButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    marginRight: 8,
    fontWeight: '600',
  },
  alternativeClosing: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 20,
    fontWeight: '600',
  },
  finalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 12,
  },
  finalHeading: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    textAlign: 'center',
    fontWeight: '700',
  },
});