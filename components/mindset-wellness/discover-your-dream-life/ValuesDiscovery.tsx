import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Linking, TextInput, Alert } from 'react-native';
import { ChevronRight, ArrowLeft, PlusCircle, Check, Smile, Frown, Meh, Laugh, Angry, Heart } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

const MOOD_OPTIONS = [
  { id: 'angry', label: 'Angry', icon: Angry, color: '#DC2626' },
  { id: 'sad', label: 'Sad', icon: Frown, color: '#2563EB' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: '#CA8A04' },
  { id: 'happy', label: 'Happy', icon: Smile, color: '#16A34A' },
  { id: 'excited', label: 'Excited', icon: Laugh, color: '#7C3AED' },
  { id: 'loved', label: 'Loved', icon: Heart, color: '#DB2777' },
];

interface ValuesQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    value: 'freedom' | 'connection' | 'growth' | 'stability' | 'creativity';
  }[];
}

interface ValuesResult {
  primaryValue: string;
  title: string;
  description: string;
  color: string;
}

interface JournalEntry {
  id: string;
  pathTag: string;
  date: string;
  content: string;
  mood?: string;
}

const valuesQuestions: ValuesQuestion[] = [
  {
    id: 1,
    question: "When you imagine your ideal day in the life, what's happening?",
    options: [
      {
        id: 'a',
        text: "I'm doing something expressive or artistic",
        value: 'creativity'
      },
      {
        id: 'b',
        text: "I'm setting my own schedule",
        value: 'freedom'
      },
      {
        id: 'c',
        text: "I have a worthy goal to work towards",
        value: 'growth'
      }
    ]
  },
  {
    id: 2,
    question: "What part of dancing do you miss most when you're away from it?",
    options: [
      {
        id: 'a',
        text: "The ability to express my inner world and create something",
        value: 'creativity'
      },
      {
        id: 'b',
        text: "The structure and discipline of knowing what's expected",
        value: 'stability'
      },
      {
        id: 'c',
        text: "The connection to a group or shared goal",
        value: 'connection'
      }
    ]
  },
  {
    id: 3,
    question: "When dance feels unfulfilling, what's usually missing?",
    options: [
      {
        id: 'a',
        text: "A sense of personal growth or evolution",
        value: 'growth'
      },
      {
        id: 'b',
        text: "Flexibility in how I engage with it",
        value: 'freedom'
      },
      {
        id: 'c',
        text: "Feeling disconnected in the ultra-competitive environment",
        value: 'connection'
      }
    ]
  },
  {
    id: 4,
    question: "If you designed your ideal lifestyle, it would include...",
    options: [
      {
        id: 'a',
        text: "Time for learning new skills and evolving personally",
        value: 'growth'
      },
      {
        id: 'b',
        text: "A flexible daily schedule with no rigid structure",
        value: 'freedom'
      },
      {
        id: 'c',
        text: "A calm, consistent rhythm that brings peace of mind",
        value: 'stability'
      }
    ]
  },
  {
    id: 5,
    question: "When you think about leaving or shifting away from dance, you most want to...",
    options: [
      {
        id: 'a',
        text: "Keep using your creativity in a new way",
        value: 'creativity'
      },
      {
        id: 'b',
        text: "Feel free to explore your other interests without pressure or judgment",
        value: 'freedom'
      },
      {
        id: 'c',
        text: "Find a way of life that's less overwhelming",
        value: 'stability'
      }
    ]
  },
  {
    id: 6,
    question: "Which sentence feels most true right now?",
    options: [
      {
        id: 'a',
        text: "I want to be challenged and find that spark again",
        value: 'growth'
      },
      {
        id: 'b',
        text: "I want to finally live on my own terms",
        value: 'freedom'
      },
      {
        id: 'c',
        text: "I want to feel like I belong, even without dance",
        value: 'connection'
      }
    ]
  },
  {
    id: 7,
    question: "You feel most grounded when...",
    options: [
      {
        id: 'a',
        text: "You're tapping in to your most creative self",
        value: 'creativity'
      },
      {
        id: 'b',
        text: "You're in a community that understands your dancer experience",
        value: 'connection'
      },
      {
        id: 'c',
        text: "You know what's expected and what comes next",
        value: 'stability'
      }
    ]
  },
  {
    id: 8,
    question: "When you're overwhelmed, it's often because...",
    options: [
      {
        id: 'a',
        text: "You feel cut off from your identity",
        value: 'connection'
      },
      {
        id: 'b',
        text: "You don't have an outlet for self-expression",
        value: 'creativity'
      },
      {
        id: 'c',
        text: "You don't know what your next step should be",
        value: 'stability'
      }
    ]
  },
  {
    id: 9,
    question: "In this season of life, you most want...",
    options: [
      {
        id: 'a',
        text: "Space to discover the new version of yourself",
        value: 'growth'
      },
      {
        id: 'b',
        text: "Confidence to go after what you really want",
        value: 'freedom'
      },
      {
        id: 'c',
        text: "Encouragement to step into something meaningful",
        value: 'stability'
      }
    ]
  },
  {
    id: 10,
    question: "When you think back to your favorite performance, what made it unforgettable?",
    options: [
      {
        id: 'a',
        text: "The unique choreography and artistic choices",
        value: 'creativity'
      },
      {
        id: 'b',
        text: "The bond and energy shared with the cast and audience",
        value: 'connection'
      },
      {
        id: 'c',
        text: "How much I grew and challenged myself during the process",
        value: 'growth'
      }
    ]
  }
];

const valuesResults: { [key: string]: ValuesResult } = {
  'freedom': {
    primaryValue: 'Freedom & Flexibility',
    title: 'Freedom & Flexibility',
    description: 'You thrive when life feels open-ended and adaptable. The stage may have taught you discipline, but now your soul is craving space to explore, create, and choose your own rhythm. Your dream life leaves room for spontaneous opportunities and days that are uniquely your own. In your next chapter, prioritizing flexibility will allow you to stay creative, energized, and fully in charge of your path.',
    color: '#647C90'
  },
  'connection': {
    primaryValue: 'Connection & Community',
    title: 'Connection & Community',
    description: 'You draw energy from people who understand you and lift you higher. In the dance world, your community was your second family and that closeness still matters. Your dream life is built around shared experiences, meaningful relationships, and being part of something bigger than yourself. Whether it\'s mentoring, collaborating, or simply being part of a family unit, connection will be the heartbeat of your future.',
    color: '#928490'
  },
  'growth': {
    primaryValue: 'Growth & Mastery',
    title: 'Growth & Mastery',
    description: 'You feel most alive when you\'re learning, improving, and chasing new levels of excellence. Your years in the studio have hardwired you to work toward mastery and that drive won\'t disappear after dance. Your dream life includes challenges that excite you, skills to refine, and the thrill of knowing you\'re becoming your best self in new arenas.',
    color: '#5A7D7B'
  },
  'stability': {
    primaryValue: 'Stability & Security',
    title: 'Stability & Security',
    description: 'You value feeling grounded, supported, and confident about what\'s next. The unpredictability of a dance career may have been exciting at times, but now you want a strong foundation. Your dream life allows you to relax, breathe, and plan ahead without constant worry. That sense of security will free you to explore new passions with confidence and clarity.',
    color: '#746C70'
  },
  'creativity': {
    primaryValue: 'Creativity & Expression',
    title: 'Creativity & Expression',
    description: 'At your core, you are an artist and no career shift will ever take that away. Your dream life must allow for self-expression, whether through movement, art, design, storytelling, or innovation. You feel most fulfilled when you can share a piece of your inner world with others. Honoring this value will make your next chapter just as soulful and vibrant as your time on stage.',
    color: '#4E4F50'
  }
};

interface ValuesDiscoveryProps {
  onComplete: (result: ValuesResult) => void;
  onBack?: () => void;
}

export default function ValuesDiscovery({ onComplete, onBack }: ValuesDiscoveryProps) {
  const [currentScreen, setCurrentScreen] = useState(-1);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [result, setResult] = useState<ValuesResult | null>(null);
  const [randomizedQuestions, setRandomizedQuestions] = useState<ValuesQuestion[]>([]);
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [morningJournalEntry, setMorningJournalEntry] = useState('');
  const [endOfDayJournalEntry, setEndOfDayJournalEntry] = useState('');
  const [selectedMorningMood, setSelectedMorningMood] = useState<string | null>(null);
  const [selectedEndOfDayMood, setSelectedEndOfDayMood] = useState<string | null>(null);

  const { scrollViewRef, scrollToTop } = useScrollToTop();
  const { addJournalEntry: addMorningJournalEntry } = useJournaling('discover-dream-life');
  const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('discover-dream-life');

  useEffect(() => {
    const shuffled = [...valuesQuestions].sort(() => Math.random() - 0.5);
    setRandomizedQuestions(shuffled);
  }, []);

  const handleStartQuiz = () => {
    setCurrentScreen(0);
    scrollToTop();
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleAnswer = (optionId: string, value: string) => {
    setSelectedOption(optionId);

    const questionIndex = currentScreen - 1;
    const newAnswers = { ...answers, [questionIndex]: value };
    setAnswers(newAnswers);
  };

  const handleContinue = () => {
    if (selectedOption === null) return;

    const questionIndex = currentScreen - 1;
    const newAnswers = { ...answers, [questionIndex]: randomizedQuestions[currentScreen - 1].options.find(opt => opt.id === selectedOption)?.value || '' };
    setAnswers(newAnswers);

    if (currentScreen < 10) {
      setCurrentScreen(currentScreen + 1);
      setSelectedOption(null);
      scrollToTop();
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: { [key: number]: string }) => {
    const valueScores: { [key: string]: number } = {
      freedom: 0,
      connection: 0,
      growth: 0,
      stability: 0,
      creativity: 0
    };

    Object.values(finalAnswers).forEach(value => {
      valueScores[value]++;
    });

    const dominantValue = Object.entries(valueScores).reduce((a, b) =>
      valueScores[a[0]] > valueScores[b[0]] ? a : b
    )[0];

    const finalResult = valuesResults[dominantValue];
    setResult(finalResult);
    setCurrentScreen(11);
    scrollToTop();
  };

  const handleContinueToReflection = () => {
    setCurrentScreen(12);
    scrollToTop();
  };

  const handleContinueToFinal = () => {
    setCurrentScreen(13);
    scrollToTop();
  };

  const handleComplete = () => {
    if (result) {
      onComplete(result);
    }
  };

  const addJournalEntry = async () => {
    const trimmed = journalEntry.trim();
    if (!trimmed) {
      Alert.alert('Empty Entry', 'Please write something before adding.');
      return;
    }

    try {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        pathTag: 'discover-dream-life',
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        content: trimmed,
      };

      const raw = await AsyncStorage.getItem('journalEntries');
      const existingEntries = raw ? JSON.parse(raw) : [];

      const updatedEntries = [newEntry, ...existingEntries];

      await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

      setJournalEntry('');
      Alert.alert('Success', 'Journal entry added!');

    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry.');
    }
  };

  const goBack = () => {
    if (currentScreen === -1) {
      if (onBack) onBack();
    } else if (currentScreen === 0) {
      setCurrentScreen(-1);
      scrollToTop();
    } else if (currentScreen === 1) {
      setCurrentScreen(0);
      scrollToTop();
    } else if (currentScreen > 1 && currentScreen <= 10) {
      setCurrentScreen(currentScreen - 1);
      setSelectedOption(null);
      scrollToTop();
    } else if (currentScreen === 11) {
      setCurrentScreen(10);
      scrollToTop();
    } else if (currentScreen === 12) {
      setCurrentScreen(11);
      scrollToTop();
    } else if (currentScreen === 13) {
      setCurrentScreen(12);
      scrollToTop();
    }
  };

  const openYouTubeShort = async () => {
    const youtubeUrl = `https://www.youtube.com/shorts/7nK7fWKxzig`;

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

  const getReflectionQuestions = () => {
    if (!result) return [];

    switch (result.primaryValue) {
      case 'Freedom & Flexibility':
        return [
          'How does Demi\'s story show the power of following your curiosity?',
          'What small step could you take today to honor your need for freedom?',
          'How can you bring more flexibility into your daily routine?'
        ];
      case 'Connection & Community':
        return [
          'How did Demi build community through roller skating?',
          'What connections could you nurture that align with your values?',
          'How can you create meaningful interactions in your daily life?'
        ];
      case 'Growth & Mastery':
        return [
          'What does Demi\'s journey teach us about continuous learning?',
          'How can you challenge yourself to grow in a new area?',
          'What skill would you love to master outside of dance?'
        ];
      case 'Stability & Security':
        return [
          'How did Demi create stability through her passion project?',
          'What foundations can you build to feel more secure?',
          'How can you create a sense of predictability while still exploring?'
        ];
      case 'Creativity & Expression':
        return [
          'How did Demi express her creativity through roller skating?',
          'What new creative outlet could you explore?',
          'How can you bring more self-expression into your daily life?'
        ];
      default:
        return [];
    }
  };

  const getJournalPlaceholder = () => {
    if (!result) return 'Write your reflections here...';

    switch (result.primaryValue) {
      case 'Freedom & Flexibility':
        return 'Demi found freedom by following her curiosity when...';
      case 'Connection & Community':
        return 'Demi built community through roller skating by...';
      case 'Growth & Mastery':
        return 'Demi showed continuous growth when she...';
      case 'Stability & Security':
        return 'Demi created stability through her passion by...';
      case 'Creativity & Expression':
        return 'Demi expressed her creativity through...';
      default:
        return 'Write your reflections here...';
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

              <Text style={commonStyles.introTitle}>Welcome to Day 5</Text>

              <Text style={commonStyles.introDescription}>
                When we considered the alternative to living a life in dance on Day 3, we did it so that we can start to actively choose options that more closely align with who we are now. But do you really know what you actually align with? That's what we're doing today… getting in touch with what you actually value.
              </Text>

              <JournalEntrySection
                pathTag="discover-dream-life"
                journalInstruction="Before we begin, let's take a moment to check in with yourself. How are you feeling as you continue this journey?"
                moodLabel="How are you feeling right now?"
                saveButtonText="Save Morning Entry"
              />

              <PrimaryButton title="Continue" onPress={handleStartQuiz} />
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

              <Text style={commonStyles.introTitle}>What do you actually value?</Text>

              <Text style={commonStyles.introDescription}>
                We might all be dancers, but we all connected with dance for different reasons. Why we love something comes down to what we value and understanding our values helps us to build a dream life. Let's explore our hidden values to discover all the exciting ways we can build our dream life based on our values, not the other way around.
              </Text>

              <PrimaryButton title="Let's Explore" onPress={() => setCurrentScreen(1)} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // NEW: Reflection Screen (screen 12)
  if (currentScreen === 12 && result) {
    const reflectionQuestions = getReflectionQuestions();
    const journalPlaceholder = getJournalPlaceholder();

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
              <Text style={styles.reflectionTitle}>Watch & Reflect</Text>

              <Text style={commonStyles.reflectionDescription}>
                Now that you know your core value is <Text style={styles.highlightText}>{result.title}</Text>, let's see how others have turned their values into incredible opportunities.
              </Text>

              <Text style={commonStyles.reflectionDescription}>
                Watch how Demi's roller skating hobby turned into 500K followers on Instagram and reflect on how you can apply similar principles to your own journey.
              </Text>

              {/* Reflection Section */}
              <View style={styles.reflectionSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Your Reflection Journey</Text>
                  <View style={styles.sectionDivider} />
                </View>

                <Text style={styles.reflectionInstruction}>
                  Start by watching the video below and reflect on these questions:
                </Text>

                {/* Dynamic Reflection Questions */}
                <View style={styles.reflectionQuestionsContainer}>
                  {reflectionQuestions.map((question, index) => (
                    <View key={index} style={styles.reflectionQuestionCard}>
                      <View style={styles.questionNumber}>
                        <Text style={styles.questionNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.reflectionQuestion}>{question}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* YouTube Video Player */}
              <View style={styles.videoSection}>
                <View style={styles.videoHeader}>
                  <Text style={styles.videoTitle}>How Demi's roller skating hobby turned into 500K followers</Text>
                </View>
                <View style={styles.videoContainer}>
                  <View style={styles.youtubePlayer}>
                    <YoutubePlayer
                      height={140}
                      play={false}
                      videoId={'7EUfZS8mQtk'}
                      webViewStyle={styles.youtubeWebView}
                    />
                  </View>
                </View>
              </View>

              <JournalEntrySection
                pathTag="discover-dream-life"
                journalInstruction="As you're watching, write your reflections as a journal entry below."
                moodLabel="How are you feeling about this?"
                saveButtonText="Add to Journal"
                placeholder={journalPlaceholder}
              />

              <PrimaryButton title="Continue" onPress={handleContinueToFinal} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Final Screen (now screen 13) with End of Day Journal
  if (currentScreen === 13) {
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

              <Text style={styles.finalHeading}>What a Journey!</Text>

              <Text style={commonStyles.reflectionDescription}>
                There are so many ways to build a dream life beyond dance. When you start with your values and open your mind to unique ways to bring those values together, you'll realize that dance was just one piece of the puzzle.
              </Text>

              <JournalEntrySection
                pathTag="discover-dream-life"
                journalInstruction="Before we bring today's session to a close, let's take a moment to check in with yourself again. How are you feeling after today's journey?"
                moodLabel="How are you feeling now?"
                saveButtonText="Save End of Day Entry"
              />

              <Text style={styles.alternativeClosing}>
                See you again tomorrow.
              </Text>

              <PrimaryButton title="Mark As Complete" onPress={handleComplete} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Result Screen (now screen 11)
  if (currentScreen === 11 && result) {
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
              <Text style={commonStyles.introTitle}>{result.title}</Text>

              <Text style={styles.resultDescription}>{result.description}</Text>

              <PrimaryButton title="Continue" onPress={handleContinueToReflection} />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Question Screens
  if (randomizedQuestions.length === 0) {
    return <View style={commonStyles.container} />;
  }

  const question = randomizedQuestions[currentScreen - 1];
  const progress = (currentScreen / 10) * 100;

  return (
    <View style={commonStyles.container}>
      <StickyHeader
        onBack={goBack}
        title={`${currentScreen} of 10`}
        progress={progress / 100}
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
            <Text style={styles.questionText}>{question.question}</Text>

            <View style={styles.optionsContainer}>
              {question.options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    selectedOption === option.id && styles.optionButtonSelected
                  ]}
                  onPress={() => handleAnswer(option.id, option.value)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionContent}>
                    {selectedOption === option.id && (
                      <View style={styles.selectedIndicator}>
                        <Check size={16} color="#E2DED0" />
                      </View>
                    )}
                    <Text style={[
                      styles.optionText,
                      selectedOption === option.id && styles.optionTextSelected
                    ]}>
                      {option.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <PrimaryButton
              title={currentScreen < 10 ? 'Continue' : 'See Results'}
              onPress={handleContinue}
              disabled={selectedOption === null}
            />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Question Styles
  questionText: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#4E4F50',
    lineHeight: 28,
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(146, 132, 144, 0.3)',
    borderColor: '#928490',
    borderWidth: 2,
  },
  optionContent: {
    padding: 20,
    paddingRight: 50,
  },
  optionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 24,
    textAlign: 'center',
  },
  optionTextSelected: {
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
  // Result Styles
  resultDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  // Reflection Styles
  reflectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },
  highlightText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#928490',
    fontWeight: '600',
  },
  reflectionSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 22,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
  },
  sectionDivider: {
    width: 60,
    height: 3,
    backgroundColor: '#928490',
    borderRadius: 2,
  },
  reflectionInstruction: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 10,
  },
  reflectionQuestionsContainer: {
    marginBottom: 20,
  },
  reflectionQuestionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(146, 132, 144, 0.1)',
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#928490',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  questionNumberText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#E2DED0',
    fontWeight: '700',
  },
  reflectionQuestion: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: '#4E4F50',
    lineHeight: 22,
    flex: 1,
    paddingTop: 2,
  },
  videoSection: {
    marginBottom: 32,
  },
  videoHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  videoTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 24,
  },
  videoContainer: {
    width: '100%',
    marginBottom: 25,
  },
  youtubePlayer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  youtubeWebView: {
    borderRadius: 16,
  },
  // Final Screen Styles
  finalHeading: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },
  alternativeClosing: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600',
  },
});