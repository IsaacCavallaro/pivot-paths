import React, { useState, useRef } from 'react';
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
}

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

const quizQuestions: QuizQuestion[] = [
  // ... (quiz questions remain exactly the same)
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
  },
  'C': {
    type: 'C',
    title: 'The Limited Dreamer',
    description: 'You\'ve been dreaming small, maybe without even realizing it. Whether due to burnout, self-protection, or past letdowns, your imagination needs a little spark. This path is your invitation to let yourself want more.',
    subtitle: 'Playing small won\'t keep you safe, it just keeps you stuck. Let\'s expand your vision together.',
    color: '#928490',
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

  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  };

  const handleWelcomeContinue = () => {
    setCurrentScreen(1);
    scrollToTop();
  };

  const handleStartQuiz = () => {
    setCurrentScreen(2);
    scrollToTop();
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleAnswer = (optionType: string) => {
    const questionIndex = currentScreen - 2;
    const newAnswers = { ...answers, [questionIndex]: optionType };
    setAnswers(newAnswers);

    if (currentScreen < 11) {
      setCurrentScreen(currentScreen + 1);
      scrollToTop();
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
    setCurrentScreen(12);
    scrollToTop();
  };

  const handleContinueToExpansiveDreamer = () => {
    setCurrentScreen(13);
    scrollToTop();
  };

  const handleContinueToTakeAction = () => {
    setCurrentScreen(14);
    scrollToTop();
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
    if (currentScreen === 0) {
      if (onBack) onBack();
    } else if (currentScreen === 1) {
      setCurrentScreen(0);
      scrollToTop();
    } else if (currentScreen > 1 && currentScreen <= 11) {
      setCurrentScreen(currentScreen - 1);
      scrollToTop();
    } else if (currentScreen === 12) {
      // Go back from result screen to last question
      setCurrentScreen(11);
      scrollToTop();
    } else if (currentScreen === 13) {
      // Go back from expansive dreamer screen to result screen
      setCurrentScreen(12);
      scrollToTop();
    } else if (currentScreen === 14) {
      // Go back from takeaction screen to expansive dreamer screen
      setCurrentScreen(13);
      scrollToTop();
    } else if (currentScreen === 15) {
      // Go back from final screen to takeaction screen
      setCurrentScreen(14);
      scrollToTop();
    }
  };

  // Welcome Screen
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

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.welcomeCard}>
              <View style={styles.welcomeIconContainer}>
                <View style={[styles.welcomeIconGradient, { backgroundColor: '#928490' }]}>
                  <Image
                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                    style={styles.heroImage}
                  />
                </View>
              </View>

              <Text style={styles.welcomeTitle}>Welcome to Your Path</Text>

              <Text style={styles.welcomeDescription}>
                Taking this first step is something to be truly proud of. It takes courage to look inward and explore what might be holding you back from the future you deserve.
              </Text>

              <Text style={styles.welcomeDescription}>
                This is a safe space for vulnerability. Whatever comes up for you during this journey - uncertainty, fear, hope, excitement - it's all welcome here. Your feelings are valid, and your dreams matter.
              </Text>

              <Text style={styles.welcomeDescription}>
                By being here, you're already showing incredible strength. You're choosing to dream differently, and that's the bravest first step you can take.
              </Text>

              <View style={styles.welcomeHighlight}>
                <Text style={styles.welcomeHighlightText}>
                  Congratulations on giving yourself permission to indentify as something more than a dancer.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.welcomeButton}
                onPress={handleWelcomeContinue}
                activeOpacity={0.8}
              >
                <View style={[styles.welcomeButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.welcomeButtonText}>I'm Ready to Begin</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Intro Screen
  if (currentScreen === 1) {
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

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
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

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
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
                onPress={handleContinueToTakeAction}
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

  // takeaction Screen
  if (currentScreen === 14 && result) {
    // Get dynamic content based on dreamer type
    const getReflectionQuestions = () => {
      switch (result.type) {
        case 'A':
          return [
            'Is it serving me to be the Anxious Dreamer?',
            'How did Monica turn her anxiety about the future into real change?',
            'What did I learn from Monica\'s story?'
          ];
        case 'B':
          return [
            'Is it serving me to be the Practical Dreamer?',
            'How did Monica take practical steps on her journey that helped her dream bigger?',
            'What did I learn from Monica\'s story?'
          ];
        case 'C':
          return [
            'Is it serving me to be the Limited Dreamer?',
            'How did Monica challenge her limiting beliefs?',
            'What did I learn from Monica\'s story?'
          ];
        default:
          return [];
      }
    };

    const getJournalPlaceholder = () => {
      switch (result.type) {
        case 'A':
          return 'Monica channelled anxious feelings into change by...';
        case 'B':
          return 'Monica took practical steps by...';
        case 'C':
          return 'Monica challenged her limiting beliefs by...';
        default:
          return 'Write your reflections here...';
      }
    };

    const reflectionQuestions = getReflectionQuestions();
    const journalPlaceholder = getJournalPlaceholder();

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

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.takeactionCard}>
              {/* Header with Icon */}
              <View style={styles.takeactionHeader}>
                <Text style={styles.takeactionTitle}>Take Action</Text>
              </View>

              {/* Introduction Text */}
              <View style={styles.takeactionIntro}>
                <Text style={styles.takeactionDescription}>
                  Do you feel that the <Text style={styles.highlightText}>{result.title.toLowerCase()}</Text> describes you? Or are you bothered by the results? Whatever's coming up for you, go with it. We got you!
                </Text>

                <Text style={styles.takeactionDescription}>
                  Now, how can you unlock the <Text style={styles.highlightText}>expansive dreamer</Text> within?!
                </Text>

                <Text style={styles.takeactionDescription}>
                  Let's hear from a dancer who gave herself permission to be the expansive dreamer and learn from her.
                </Text>
              </View>

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

                <Text style={styles.reflectionInstruction}>
                  As you're watching, write your reflections as a journal entry below.
                </Text>
              </View>

              {/* YouTube Video Player */}
              <View style={styles.videoSection}>
                <View style={styles.videoHeader}>
                  <Text style={styles.videoTitle}>Watch & Learn</Text>
                </View>
                <View style={styles.videoContainer}>
                  <View style={styles.youtubePlayer}>
                    <YoutubePlayer
                      height={140}
                      play={false}
                      videoId={'ZsvNvXLtcC4'}
                      webViewStyle={styles.youtubeWebView}
                    />
                  </View>
                </View>
              </View>

              {/* Journal Entry Section */}
              <View style={styles.journalSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Journal Your Thoughts</Text>
                  <View style={styles.sectionDivider} />
                </View>

                <View style={styles.journalInputContainer}>
                  <TextInput
                    style={styles.journalTextInput}
                    placeholder={journalPlaceholder}
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
                  We'll keep these entries safe in your personal journal which you can view at the end of today's progress.
                </Text>
              </View>

              {/* Inspirational Quote */}
              <View style={styles.quoteContainer}>
                <Text style={styles.quoteSymbol}>"</Text>
                <Text style={styles.takeactionQuote}>
                  The only limits that exist are the ones you place on yourself.
                </Text>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => setCurrentScreen(15)}
                activeOpacity={0.8}
              >
                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.continueButtonText}>Continue Your Journey</Text>
                  <ChevronRight size={20} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Congratulations and Mark as Complete Screen
  if (currentScreen === 15 && result) {
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

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.congratulationsCard}>

              <Text style={styles.congratulationsTitle}>Congratulations!</Text>

              <Text style={styles.congratulationsDescription}>
                You've taken the first step toward becoming an Expansive Dreamer. By understanding your current dreaming style, you're already opening yourself up to new possibilities.
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
  if (currentScreen === 12 && result) {
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

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
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
  const question = quizQuestions[currentScreen - 2];
  const progress = ((currentScreen - 1) / 10) * 100;

  return (
    <View style={styles.container}>
      {/* Sticky Header with Progress */}
      <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <ArrowLeft size={28} color="#E2DED0" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.progressText}>{currentScreen - 1} of 10</Text>
          </View>
          <View style={styles.backButton} />
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
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
  // ... (all your existing styles remain exactly the same)
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
  // Welcome Screen Styles
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
  welcomeIconGradient: {
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
  welcomeTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },
  welcomeDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#928490',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  welcomeHighlight: {
    backgroundColor: 'rgba(146, 132, 144, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(100, 124, 144, 0.2)',
  },
  welcomeHighlightText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#647C90',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  welcomeButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  welcomeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2DED0',
  },
  welcomeButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#E2DED0',
    marginRight: 8,
    fontWeight: '600',
  },
  // Intro Screen Styles
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
  // takeaction Screen Styles
  takeactionCard: {
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
  takeactionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },
  takeactionDescription: {
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
  takeactionPrompt: {
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
  takeactionHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  takeactionIconContainer: {
    marginBottom: 16,
  },
  takeactionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#928490',
  },
  takeactionIconText: {
    fontSize: 32,
  },
  takeactionIntro: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: 'rgba(146, 132, 144, 0.05)',
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#928490',
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
    marginBottom: 20,
    fontWeight: '500',
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
    fontSize: 20,
    color: '#647C90',
    textAlign: 'center',
    fontWeight: '700',
  },
  quoteContainer: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 24,
    backgroundColor: 'rgba(146, 132, 144, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(146, 132, 144, 0.2)',
  },
  quoteSymbol: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 48,
    color: '#928490',
    marginBottom: -20,
  },
  takeactionQuote: {
    fontFamily: 'Merriweather-Italic',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },
});