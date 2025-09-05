import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, Sparkles, ArrowLeft } from 'lucide-react-native';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
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
        text: (
          <Text>
            I could <Text style={{ fontStyle: 'italic' }}>never</Text> pull that off.
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
    color: '#928490'
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
    color: '#647C90'
  },
  'C': {
    type: 'C',
    title: 'The Limited Dreamer',
    description: 'You\'ve been dreaming small, maybe without even realizing it. Whether due to burnout, self-protection, or past letdowns, your imagination needs a little spark. This path is your invitation to let yourself want more.',
    subtitle: 'Playing small won\'t keep you safe, it just keeps you stuck. Let\'s expand your vision together.',
    color: '#746C70'
  }
};

interface DreamerTypeQuizProps {
  onComplete: (result: DreamerResult) => void;
  onBack?: () => void;
}

export default function DreamerTypeQuiz({ onComplete, onBack }: DreamerTypeQuizProps) {
  const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-10 = questions, 11 = result, 12 = final
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [result, setResult] = useState<DreamerResult | null>(null);

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

  const handleContinueToFinal = () => {
    setCurrentScreen(12);
  };

  const handleComplete = () => {
    if (result) {
      onComplete(result);
    }
  };

  const goBack = () => {
    if (currentScreen === 1) {
      setCurrentScreen(0);
    } else if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  // Intro Screen
  if (currentScreen === 0) {
    return (
      <View style={styles.container}>
        {onBack && (
          <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
            <ArrowLeft size={28} color="#647C90" />
          </TouchableOpacity>
        )}
        <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
          <View style={styles.introIcon}>
            <Sparkles size={32} color="#928490" />
          </View>

          <Text style={styles.introTitle}>What kind of dreamer are you?</Text>

          <Text style={styles.introDescription}>
            It's a skill to dream big. Sure, we had dance dreams and achieved them, but when we start dreaming on our own terms, it can start to fall apart. To help you dream bigger, let's start by figuring out your "Dreamer Type" to unlock what could be holding you back.
          </Text>

          <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
            <View
              style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
            >
              <Text style={styles.startButtonText}>Let's do it</Text>
              <ChevronRight size={16} color="#E2DED0" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Final Screen
  if (currentScreen === 12) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
          <View style={styles.finalIcon}>
            <Image
              source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
              style={styles.heroImage}
            />
          </View>

          <Text style={styles.finalTitle}>Here's What You Could Be:</Text>
          <Text style={styles.finalTitleBold}>The Expansive Dreamer</Text>

          <Text style={styles.finalDescription}>
            The Expansive Dreamer is someone who allows their imagination to stretch wide and bold without apology. You've given yourself full permission to want more: more freedom, more fulfillment, more possibility. But this time, your dreams don't just live in your head... they're grounded in your values, your strengths, and your next steps.
          </Text>

          <Text style={styles.finalClosing}>
            See you tomorrow!
          </Text>

          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <View
              style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
            >
              <Text style={styles.completeButtonText}>Mark as Complete</Text>
              <ChevronRight size={16} color="#E2DED0" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Result Screen
  if (currentScreen === 11 && result) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[result.color, `${result.color}CC`]}
          style={styles.resultHeader}
        >
          <Text style={styles.resultTitle}>{result.title}</Text>
        </LinearGradient>

        <ScrollView style={styles.resultContent} contentContainerStyle={styles.resultContentContainer}>
          <Text style={styles.resultDescription}>{result.description}</Text>

          <View style={styles.resultSubtitleContainer}>
            <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinueToFinal}>
            <LinearGradient
              colors={[result.color, `${result.color}DD`]}
              style={styles.continueButtonGradient}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <ChevronRight size={16} color="#E2DED0" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Question Screens
  const question = quizQuestions[currentScreen - 1];
  const progress = (currentScreen / 10) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentScreen} of 10
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionButton}
              onPress={() => handleAnswer(option.type)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <ChevronLeft size={24} color="#647C90" />
        <Text style={styles.backButtonText}>
          {currentScreen === 1 ? 'Back to Intro' : 'Previous'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DED0',
  },
  topBackButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  introContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  introIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  introTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 20,
  },
  introDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#746C70',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  startButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#E2DED0',
    marginRight: 8,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(100, 124, 144, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#928490',
    borderRadius: 3,
  },
  questionContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  questionText: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#4E4F50',
    lineHeight: 28,
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 22,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
    marginLeft: 8,
  },
  resultHeader: {
    paddingTop: 60,
    padding: 30,
    alignItems: 'center',
  },
  resultTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#E2DED0',
    textAlign: 'center',
  },
  resultContent: {
    flex: 1,
    backgroundColor: '#E2DED0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 10,
  },
  resultContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  resultDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  resultSubtitleContainer: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  resultSubtitle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#647C90',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  continueButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    marginRight: 8,
  },
  finalContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  finalIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(90, 125, 123, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  finalTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 10,
  },
  finalTitleBold: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#928490',
    textAlign: 'center',
    marginBottom: 25,
  },
  finalDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  finalClosing: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 40,
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  completeButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    marginRight: 8,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderColor: 'black', // Added border color
    borderWidth: 1, // Added border width to make the border visible
  },
});
