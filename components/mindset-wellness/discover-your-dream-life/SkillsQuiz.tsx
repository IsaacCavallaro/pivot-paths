import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, TextInput, Alert } from 'react-native';
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
  description: string;
  subtitle: string;
  color: string;
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
        text: 'I could never pull that off.',
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
    description: "You're thoughtful, grounded, and great at making realistic decisions. But sometimes you forget how expansive your future could be. You might downplay your dreams to protect yourself from disappointment. This path will help you reconnect with possibility while still honoring your practical nature.",
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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [morningJournalEntry, setMorningJournalEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const { scrollViewRef, scrollToTop } = useScrollToTop();
  const { addJournalEntry: addMorningJournalEntry } = useJournaling('discover-dream-life');
  const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('discover-dream-life');

  const handleScreenChange = async (newScreen: number) => {
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    setCurrentScreen(newScreen);
    scrollToTop();
    setIsTransitioning(false);
  };

  const handleWelcomeContinue = () => {
    handleScreenChange(1);
  };

  const handleStartQuiz = () => {
    handleScreenChange(2);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleAnswer = (optionId: string, optionType: string) => {
    setSelectedOption(optionId);

    const questionIndex = currentScreen - 2;
    const newAnswers = { ...answers, [questionIndex]: optionType };
    setAnswers(newAnswers);
  };

  const handleContinue = async () => {
    if (selectedOption === null || isTransitioning) return;

    setIsTransitioning(true);

    await new Promise(resolve => setTimeout(resolve, 150));

    if (currentScreen < 11) {
      setCurrentScreen(currentScreen + 1);
      setSelectedOption(null);
      scrollToTop();
    } else {
      calculateResult(answers);
    }

    setIsTransitioning(false);
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
    handleScreenChange(13);
  };

  const handleContinueToTakeAction = () => {
    handleScreenChange(14);
  };

  const goBack = () => {
    if (currentScreen === 0) {
      if (onBack) onBack();
    } else if (currentScreen === 1) {
      handleScreenChange(0);
    } else if (currentScreen > 1 && currentScreen <= 11) {
      setCurrentScreen(currentScreen - 1);
      setSelectedOption(null);
      scrollToTop();
    } else if (currentScreen === 12) {
      handleScreenChange(11);
    } else if (currentScreen === 13) {
      handleScreenChange(12);
    } else if (currentScreen === 14) {
      handleScreenChange(13);
    } else if (currentScreen === 15) {
      handleScreenChange(14);
    }
  };

  const handleComplete = async () => {
    if (result) {
      try {
        await AsyncStorage.setItem('day1SkillsQuizResult', JSON.stringify(result));
        onComplete(result);
      } catch (error) {
        console.error('Error saving quiz result to AsyncStorage:', error);
        onComplete(result);
      }
    }
  };

  // Welcome Screen with Journal Prompt
  if (currentScreen === 0) {
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
                Welcome to Your Path
              </Text>

              <Text style={commonStyles.introDescription}>
                Taking this first step is something to be truly proud of. It takes courage to look inward and explore what might be holding you back from the future you deserve.
              </Text>

              <JournalEntrySection
                pathTag="discover-dream-life"
                journalInstruction="Before we being, let's take a moment to check in with yourself. How are you feeling as you begin this journey?"
                moodLabel="How are you feeling right now?"
                saveButtonText="Save Morning Entry"
              />

              <View style={styles.welcomeHighlight}>
                <Text style={styles.welcomeHighlightText}>
                  Congratulations on giving yourself permission to identify as something more than a dancer.
                </Text>
              </View>

              <PrimaryButton
                title="I'm Ready to Begin"
                onPress={handleWelcomeContinue}
                disabled={isTransitioning}
              />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Intro Screen
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
              <View style={commonStyles.introIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={commonStyles.heroImage}
                />
              </View>

              <Text style={commonStyles.introTitle}>
                What kind of dreamer are you?
              </Text>

              <Text style={commonStyles.introDescription}>
                It's a skill to dream big. Sure, we had dance dreams and achieved them, but when we start dreaming on our own terms, it can start to fall apart. To help you dream bigger, let's start by figuring out your "Dreamer Type" to unlock what could be holding you back.
              </Text>

              <PrimaryButton
                title="Let's do it"
                onPress={handleStartQuiz}
                disabled={isTransitioning}
              />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // The Expansive Dreamer Screen
  if (currentScreen === 13 && result) {
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

              <Text style={styles.expansiveTitle}>
                Here's What You Could Be:
              </Text>

              <Text style={styles.expansiveTitleBold}>
                The Expansive Dreamer
              </Text>

              <Text style={commonStyles.reflectionDescription}>
                The Expansive Dreamer is someone who allows their imagination to be bold <Text style={{ fontStyle: 'italic' }}>without apology</Text>.
              </Text>

              <Text style={commonStyles.reflectionDescription}>
                This dreamer understands that their past experiences in dance have given them unique strengths: discipline, creativity, resilience, and the ability to envision something before it exists. They use these strengths to build a future that excites them on their own terms.
              </Text>

              <Text style={commonStyles.reflectionDescription}>
                The Expansive Dreamer doesn't let fear of the unknown stop them. Instead, they see possibility where others see obstacles, and they trust that each step forward reveals the next.
              </Text>

              <PrimaryButton
                title="Continue"
                onPress={handleContinueToTakeAction}
                disabled={isTransitioning}
              />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // takeaction Screen
  if (currentScreen === 14 && result) {
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
              <Text style={styles.takeactionTitle}>Take Action</Text>

              <Text style={commonStyles.reflectionDescription}>
                Do you feel that the <Text style={styles.highlightText}>{result.title.toLowerCase()}</Text> describes you? Or are you bothered by the results? Whatever's coming up for you, go with it. We got you!
              </Text>

              <Text style={commonStyles.reflectionDescription}>
                Now, how can you unlock the <Text style={styles.highlightText}>expansive dreamer</Text> within?!
              </Text>

              <Text style={commonStyles.reflectionDescription}>
                Let's hear from a dancer who gave herself permission to be the expansive dreamer and learn from her.
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

              <JournalEntrySection
                pathTag="discover-dream-life"
                journalInstruction="As you're watching, write your reflections as a journal entry below."
                moodLabel="How are you feeling about this?"
                saveButtonText="Add to Journal"
                placeholder={journalPlaceholder}
              />

              {/* Inspirational Quote */}
              <View style={styles.quoteContainer}>
                <Text style={styles.quoteSymbol}>"</Text>
                <Text style={styles.takeactionQuote}>
                  The only limits that exist are the ones you place on yourself.
                </Text>
              </View>

              <PrimaryButton
                title="Continue Your Journey"
                onPress={() => handleScreenChange(15)}
                disabled={isTransitioning}
              />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Congratulations and Mark as Complete Screen
  if (currentScreen === 15 && result) {
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
              <Text style={styles.congratulationsTitle}>Congratulations!</Text>

              <Text style={commonStyles.reflectionDescription}>
                You've taken the first step toward becoming an Expansive Dreamer. By understanding your current dreaming style, you're already opening yourself up to new possibilities.
              </Text>

              <JournalEntrySection
                pathTag="discover-dream-life"
                journalInstruction="Before we bring today's session to a close, let's take a moment to check in with yourself againn. How are you feeling after taking these first steps towards a new chapter?"
                moodLabel="How are you feeling now?"
                saveButtonText="Save Entry"
              />

              <Text style={styles.congratulationsClosing}>
                Your expansive future awaits!
              </Text>

              <PrimaryButton
                title="Mark as Complete"
                onPress={handleComplete}
                disabled={isTransitioning}
              />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Result Screen
  if (currentScreen === 12 && result) {
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
              <Text style={commonStyles.introTitle}>{result.title}</Text>
              <Text style={styles.resultDescription}>{result.description}</Text>

              <View style={styles.resultSubtitleContainer}>
                <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
              </View>

              <PrimaryButton
                title="Continue"
                onPress={handleContinueToExpansiveDreamer}
                disabled={isTransitioning}
              />
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Question Screens with smooth transitions
  const question = quizQuestions[currentScreen - 2];
  const progress = ((currentScreen - 1) / 10) * 100;

  return (
    <View style={commonStyles.container}>
      <StickyHeader
        onBack={goBack}
        title={`${currentScreen - 1} of 10`}
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
          <Card style={styles.baseCardSkills}>
            <Text style={styles.questionText}>
              {question.question}
            </Text>

            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <View key={option.id}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedOption === option.id && styles.optionButtonSelected
                    ]}
                    onPress={() => handleAnswer(option.id, option.type)}
                    activeOpacity={0.8}
                    disabled={isTransitioning}
                  >
                    <View style={styles.optionContent}>
                      {selectedOption === option.id && (
                        <View style={styles.selectedIndicator}>
                          <Check size={16} color="#E2DED0" />
                        </View>
                      )}
                      <View style={styles.optionTextContainer}>
                        {typeof option.text === 'string' ? (
                          <Text style={[
                            styles.optionText,
                            selectedOption === option.id && styles.optionTextSelected
                          ]}>
                            {option.text}
                          </Text>
                        ) : (
                          <View style={styles.jsxOptionWrapper}>
                            {option.text}
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <PrimaryButton
              title={currentScreen < 11 ? 'Continue' : 'See Results'}
              onPress={handleContinue}
              disabled={selectedOption === null || isTransitioning}
            />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Welcome Screen Styles
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
  // Question Styles
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
  optionButtonSelected: {
    backgroundColor: 'rgba(146, 132, 144, 0.3)',
    borderColor: '#928490',
    borderWidth: 2,
  },
  optionContent: {
    padding: 20,
    paddingRight: 50,
  },
  optionTextContainer: {
    flex: 1,
  },
  jsxOptionWrapper: {
    // You can add specific styling for JSX options if needed
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
  // The Expansive Dreamer Screen Styles
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
  // takeaction Screen Styles
  takeactionTitle: {
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
  reflectionInstruction: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 15,
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
  videoContainer: {
    width: '100%',
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
  // Congratulations Screen Styles
  congratulationsTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 32,
    color: '#928490',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '700',
  },
  congratulationsClosing: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600',
  },
  // Journal Section Styles
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
  baseCardSkills: {
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
    marginTop: 50,
  },
});