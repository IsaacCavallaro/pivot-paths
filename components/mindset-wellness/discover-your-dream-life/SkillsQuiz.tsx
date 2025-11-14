import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, TextInput, Alert } from 'react-native';
import { ChevronRight, ArrowLeft, PlusCircle } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string | React.ReactElement;
    type: 'A' | 'B' | 'C';
  }[];
}

interface DreamerResult {
  type: string;
  title: string;
  description: string | React.ReactElement;
  subtitle: string;
  color: string;
  videoContent: string | React.ReactElement;
}

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "When someone asks what you want to do after dance, you usually…",
    options: [
      {
        id: 'a',
        text: 'Say, "I don\'t know yet," but worry about it later.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'Say something you think is realistic and achievable.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'Give a vague answer or make a joke to avoid it.',
        type: 'C'
      }
    ]
  },
  {
    id: 2,
    question: "Which statement feels most true right now?",
    options: [
      {
        id: 'a',
        text: 'I need help quieting the self-doubt.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'I want more clarity about what\'s possible.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'I\'ve already limited myself before I begin.',
        type: 'C'
      }
    ]
  },
  {
    id: 3,
    question: "Your vision for the future is…",
    options: [
      {
        id: 'a',
        text: 'Blurry, chaotic, or overwhelming.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'Structured with clear, safe steps.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'Boring. It doesn\'t feel exciting.',
        type: 'C'
      }
    ]
  },
  {
    id: 4,
    question: "You're scrolling Instagram and see a former dancer thriving in a new career. Your first thought is...",
    options: [
      {
        id: 'a',
        text: (
          <Text>
            I could never pull that off.
          </Text>
        ),
        type: 'A'
      },
      {
        id: 'b',
        text: 'How do I get there?',
        type: 'B'
      },
      {
        id: 'c',
        text: 'That\'s cool but not for me.',
        type: 'C'
      }
    ]
  },
  {
    id: 5,
    question: "What's your relationship to risk?",
    options: [
      {
        id: 'a',
        text: 'It stresses me out, so I avoid it.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'I calculate every detail before deciding.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'I like the idea of risk, but rarely go for it.',
        type: 'C'
      }
    ]
  },
  {
    id: 6,
    question: "When you imagine your \"dream life\", what do you see?",
    options: [
      {
        id: 'a',
        text: 'A quiet life that doesn\'t overwhelm me.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'A solid plan with job security and peace.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'I can barely picture anything specific.',
        type: 'C'
      }
    ]
  },
  {
    id: 7,
    question: "Which of these feels most frustrating right now?",
    options: [
      {
        id: 'a',
        text: 'I don\'t know what I really want.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'I know what I want, but I don\'t believe I can have it.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'I\'ve stopped letting myself want big things.',
        type: 'C'
      }
    ]
  },
  {
    id: 8,
    question: "When you talk about your goals out loud, you…",
    options: [
      {
        id: 'a',
        text: 'Get nervous and downplay them.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'Say only what sounds "reasonable".',
        type: 'B'
      },
      {
        id: 'c',
        text: 'Don\'t talk about them at all.',
        type: 'C'
      }
    ]
  },
  {
    id: 9,
    question: "What do you need most right now?",
    options: [
      {
        id: 'a',
        text: 'Confidence and permission to want more.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'A starting point and actionable steps.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'Help dreaming bigger or differently.',
        type: 'C'
      }
    ]
  },
  {
    id: 10,
    question: "Which phrase resonates with you most?",
    options: [
      {
        id: 'a',
        text: 'I\'m afraid of failing.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'I don\'t want to be unrealistic.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'I don\'t know what\'s next.',
        type: 'C'
      }
    ]
  }
];

const dreamerResults: { [key: string]: DreamerResult } = {
  'A': {
    type: 'A',
    title: 'The Anxious Dreamer',
    description: 'You\'re full of potential, but fear or uncertainty has been holding you back. Whether it\'s perfectionism, imposter syndrome, or fear of judgment, it\'s hard to dream clearly when anxiety gets loud. This path will help you replace "what ifs" with grounded confidence.',
    subtitle: 'Your dream life doesn\'t need to be perfect. It just needs to be yours.',
    color: '#928490',
    videoContent: 'Watch how Monica transformed her anxiety about leaving dance into growth. Like you, she faced uncertainty but learned to embrace new possibilities. Her journey from musical theater to interior design shows how anxiety can be channeled into creative expansion.'
  },
  'B': {
    type: 'B',
    title: 'The Practical Dreamer',
    description: (
      <Text>
        You're thoughtful, grounded, and great at making realistic decisions. But sometimes you forget how expansive your future <Text style={{ fontStyle: 'italic' }}>could</Text> be. You might downplay your dreams to protect yourself from disappointment. This path will help you reconnect with possibility while still honoring your practical nature.
      </Text>
    ),
    subtitle: 'You don\'t need to let go of logic to follow your dreams. You just need a little more permission to dream bigger.',
    color: '#928490',
    videoContent: 'Monica\'s story demonstrates how practical steps can lead to expansive dreams. Notice how she "fell into" interior design through calculated risks - showing that practicality and big dreams aren\'t mutually exclusive. Her transition proves that careful planning can support rather than limit your aspirations.'
  },
  'C': {
    type: 'C',
    title: 'The Limited Dreamer',
    description: 'You\'ve been dreaming small, maybe without even realizing it. Whether due to burnout, self-protection, or past letdowns, your imagination needs a little spark. This path is your invitation to let yourself want more.',
    subtitle: 'Playing small won\'t keep you safe, it just keeps you stuck. Let\'s expand your vision together.',
    color: '#928490',
    videoContent: 'See how Monica broke free from limited thinking. She moved from the structured world of musical theater to discovering new passions in interior design, then from NYC to North Carolina. Her story shows how expanding your vision can lead to unexpected fulfillment beyond your current imagination.'
  }
};

interface DreamerTypeQuizProps {
  onComplete: (result: DreamerResult) => void;
  onBack?: () => void;
}

export default function DreamerTypeQuiz({ onComplete, onBack }: DreamerTypeQuizProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [result, setResult] = useState<DreamerResult | null>(null);
  const [journalEntry, setJournalEntry] = useState('');

  const handleStartQuiz = () => {
    setCurrentScreen(1);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleAnswer = (optionType: string) => {
    const questionIndex = currentScreen - 1;
    const newAnswers = { ...answers, [questionIndex]: optionType };
    setAnswers(newAnswers);

    if (currentScreen < 10) {
      setCurrentScreen(currentScreen + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: { [key: number]: string }) => {
    const typeCounts = { A: 0, B: 0, C: 0 };

    Object.values(finalAnswers).forEach(answer => {
      typeCounts[answer as 'A' | 'B' | 'C']++;
    });

    const dominantType = Object.entries(typeCounts).reduce((a, b) =>
      typeCounts[a[0] as 'A' | 'B' | 'C'] > typeCounts[b[0] as 'A' | 'B' | 'C'] ? a : b
    )[0];

    const finalResult = dreamerResults[dominantType];
    setResult(finalResult);
    setCurrentScreen(11);
  };

  const handleContinueToExpansiveDreamer = () => {
    setCurrentScreen(12);
  };

  const handleContinueToInspiration = () => {
    setCurrentScreen(13);
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
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        content: trimmed,
      };

      // Load existing entries
      const raw = await AsyncStorage.getItem('journalEntries');
      const existingEntries = raw ? JSON.parse(raw) : [];

      // Add new entry to the beginning
      const updatedEntries = [newEntry, ...existingEntries];

      // Save back to storage
      await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

      // Clear input and show success
      setJournalEntry('');
      Alert.alert('Success', 'Journal entry added!');

    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry.');
    }
  };

  const handleComplete = () => {
    if (result) {
      onComplete(result);
    }
  };

  const goBack = () => {
    if (currentScreen === 1) {
      setCurrentScreen(0);
    } else if (currentScreen > 1 && currentScreen <= 10) {
      setCurrentScreen(currentScreen - 1);
    } else if (currentScreen === 11) {
      // Go back from result screen to last question
      setCurrentScreen(10);
    } else if (currentScreen === 12) {
      // Go back from expansive dreamer screen to result screen
      setCurrentScreen(11);
    } else if (currentScreen === 13) {
      // Go back from inspiration screen to expansive dreamer screen
      setCurrentScreen(12);
    } else if (currentScreen === 14) {
      // Go back from final screen to inspiration screen
      setCurrentScreen(13);
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
          <View style={styles.content}>
            <View style={styles.introCard}>
              <View style={styles.introIconContainer}>
                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                  <Image
                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                    style={styles.heroImage}
                  />
                </View>
              </View>

              <Text style={styles.introTitle}>What kind of dreamer are you?</Text>

              <Text style={styles.introDescription}>
                It's a skill to dream big. Sure, we had dance dreams and achieved them, but when we start dreaming on our own terms, it can start to fall apart. To help you dream bigger, let's start by figuring out your "Dreamer Type" to unlock what could be holding you back.
              </Text>

              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartQuiz}
                activeOpacity={0.8}
              >
                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.startButtonText}>Let's do it</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // The Expansive Dreamer Screen
  if (currentScreen === 12 && result) {
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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.expansiveDreamerCard}>
              <View style={styles.expansiveIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={styles.heroImage}
                />
              </View>

              <Text style={styles.expansiveTitle}>Here's What You Could Be:</Text>
              <Text style={styles.expansiveTitleBold}>The Expansive Dreamer</Text>

              <Text style={styles.expansiveDescription}>
                The Expansive Dreamer is someone who allows their imagination to be bold <Text style={{ fontStyle: 'italic' }}>without apology</Text>.
              </Text>

              <Text style={styles.expansiveDescription}>
                This dreamer understands that their past experiences in dance have given them unique strengths: discipline, creativity, resilience, and the ability to envision something before it exists. They use these strengths to build a future that excites them on their own terms.
              </Text>

              <Text style={styles.expansiveDescription}>
                The Expansive Dreamer doesn't let fear of the unknown stop them. Instead, they see possibility where others see obstacles, and they trust that each step forward reveals the next.
              </Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinueToInspiration}
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

  // Inspiration Screen
  if (currentScreen === 13 && result) {
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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.inspirationCard}>
              <Text style={styles.inspirationTitle}>Inspiration</Text>

              <Text style={styles.inspirationDescription}>
                {result.videoContent}
              </Text>

              {/* YouTube Video Player */}
              <View style={styles.videoContainer}>
                <View style={styles.youtubePlayer}>
                  <YoutubePlayer
                    height={200}
                    play={false}
                    videoId={'ZsvNvXLtcC4'}
                    webViewStyle={styles.youtubeWebView}
                  />
                </View>
              </View>

              <Text style={styles.inspirationPrompt}>
                Watch the video above and reflect: What resonates with you about Monica's journey? What possibilities does it open up for your own path?
              </Text>

              {/* Journal Entry Section */}
              <View style={styles.journalSection}>
                <Text style={styles.journalTitle}>Journal Your Thoughts</Text>

                <View style={styles.journalInputContainer}>
                  <TextInput
                    style={styles.journalTextInput}
                    placeholder="Write your reflections here..."
                    placeholderTextColor="#928490"
                    multiline
                    value={journalEntry}
                    onChangeText={setJournalEntry}
                  />
                  <TouchableOpacity
                    style={[styles.journalAddButton, { backgroundColor: '#647C90' }]}
                    onPress={addJournalEntry}
                  >
                    <PlusCircle size={24} color="#E2DED0" />
                    <Text style={styles.journalAddButtonText}>Add to Journal</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.journalNote}>
                  This entry will be saved to your journal tab where you can view and manage all your entries.
                </Text>
              </View>

              <Text style={styles.inspirationQuote}>
                "The only limits that exist are the ones you place on yourself."
              </Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => setCurrentScreen(14)}
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

  // Congratulations and Mark as Complete Screen
  if (currentScreen === 14 && result) {
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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.congratulationsCard}>
              <View style={styles.congratulationsIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={styles.heroImage}
                />
              </View>

              <Text style={styles.congratulationsTitle}>Congratulations!</Text>

              <Text style={styles.congratulationsDescription}>
                You've taken the first step toward becoming an Expansive Dreamer. By understanding your current dreaming style, you're already opening yourself up to new possibilities.
              </Text>

              <Text style={styles.congratulationsDescription}>
                Remember: Your dance background has given you everything you need to create a fulfilling next chapter. The discipline, creativity, and resilience you developed are your superpowers.
              </Text>

              <Text style={styles.congratulationsClosing}>
                Your expansive future awaits!
              </Text>

              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleComplete}
                activeOpacity={0.8}
              >
                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.completeButtonText}>Mark as Complete</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Result Screen
  if (currentScreen === 11 && result) {
    return (
      <View style={styles.container}>
        {/* Sticky Header */}
        <View style={[styles.stickyHeader, { backgroundColor: result.color }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ArrowLeft size={28} color="#E2DED0" />
            </TouchableOpacity>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.resultCard}>
              <Text style={styles.titleText}>{result.title}</Text>
              <Text style={styles.resultDescription}>{result.description}</Text>

              <View style={styles.resultSubtitleContainer}>
                <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
              </View>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinueToExpansiveDreamer}
                activeOpacity={0.8}
              >
                <View style={[styles.continueButtonContent, { backgroundColor: result.color }]}>
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

  // Question Screens
  const question = quizQuestions[currentScreen - 1];
  const progress = (currentScreen / 10) * 100;

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
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{question.question}</Text>

            <View style={styles.optionsContainer}>
              {question.options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(option.type)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionText}>{option.text}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
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
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 25,
    color: '#647C90',
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
  questionCard: {
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
  questionText: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 22,
    color: '#647C90',
    lineHeight: 32,
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '700',
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
  optionContent: {
    padding: 20,
  },
  optionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 24,
    textAlign: 'center',
  },
  resultCard: {
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
  resultDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  resultSubtitleContainer: {
    backgroundColor: 'rgba(146, 132, 144, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(100, 124, 144, 0.2)',
  },
  resultSubtitle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#647C90',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
    fontWeight: '500',
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
  // The Expansive Dreamer Screen Styles
  expansiveDreamerCard: {
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
  expansiveIconContainer: {
    marginBottom: 32,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#647C90',
    borderWidth: 2,
    marginBottom: 10,
  },
  expansiveTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
  },
  expansiveTitleBold: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#928490',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '700',
  },
  expansiveDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  // Inspiration Screen Styles
  inspirationCard: {
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
  inspirationTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },
  inspirationDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  videoContainer: {
    width: '100%',
    marginBottom: 25,
  },
  youtubePlayer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  youtubeWebView: {
    borderRadius: 16,
  },
  inspirationPrompt: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontStyle: 'italic',
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    padding: 20,
    borderRadius: 16,
  },
  inspirationQuote: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 16,
    color: '#928490',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontStyle: 'italic',
  },
  // Journal Section Styles
  journalSection: {
    width: '100%',
    marginBottom: 32,
  },
  journalTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '700',
  },
  journalInputContainer: {
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  journalTextInput: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 8,
  },
  journalAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  journalAddButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    marginLeft: 8,
    fontWeight: '600',
  },
  journalNote: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#928490',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  // Congratulations Screen Styles
  congratulationsCard: {
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
  congratulationsIconContainer: {
    marginBottom: 32,
  },
  congratulationsTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 32,
    color: '#928490',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '700',
  },
  congratulationsDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  congratulationsClosing: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
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
  },
  completeButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#E2DED0',
    marginRight: 8,
    fontWeight: '600',
  },
});