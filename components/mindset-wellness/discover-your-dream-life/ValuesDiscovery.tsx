import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Compass, ArrowLeft, ChevronLeft } from 'lucide-react-native';

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

const { width, height } = Dimensions.get('window');

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
  const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-10 = questions, 11 = result, 12 = final
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [result, setResult] = useState<ValuesResult | null>(null);
  const [randomizedQuestions, setRandomizedQuestions] = useState<ValuesQuestion[]>([]);

  useEffect(() => {
    // Randomize the order of questions when component mounts
    const shuffled = [...valuesQuestions].sort(() => Math.random() - 0.5);
    setRandomizedQuestions(shuffled);
  }, []);

  const handleStartQuiz = () => {
    setCurrentScreen(1);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleAnswer = (value: string) => {
    const questionIndex = currentScreen - 1;
    const newAnswers = { ...answers, [questionIndex]: value };
    setAnswers(newAnswers);

    if (currentScreen < 10) {
      setCurrentScreen(currentScreen + 1);
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
    } else if (currentScreen > 1 && currentScreen <= 10) {
      setCurrentScreen(currentScreen - 1);
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
            <View style={styles.headerTitleContainer}>
              <Text style={styles.titleText}>Values Discovery</Text>
            </View>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.centeredContent}>
            <View style={styles.introCard}>
              <View style={styles.introIconContainer}>
                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                  <Compass size={32} color="#E2DED0" />
                </View>
              </View>

              <Text style={styles.introTitle}>What do you actually value?</Text>

              <Text style={styles.introDescription}>
                We might all be dancers, but we all connected with dance for different reasons. Why we love something comes down to what we value and understanding our values helps us to build a dream life. Let's explore our hidden values to discover all the exciting ways we can build our dream life based on our values, not the other way around.
              </Text>

              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartQuiz}
                activeOpacity={0.8}
              >
                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.startButtonText}>Let's Explore</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Final Screen
  if (currentScreen === 12) {
    return (
      <View style={styles.container}>
        {/* Sticky Header */}
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <View style={styles.backButton} />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.titleText}>Your Values</Text>
            </View>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.centeredContent}>
            <View style={styles.finalCard}>
              <View style={styles.finalIconContainer}>
                <View style={[styles.finalIconGradient, { backgroundColor: '#928490' }]}>
                  <Compass size={40} color="#E2DED0" />
                </View>
              </View>

              <View style={styles.finalHeader}>
                <Compass size={24} color="#928490" />
                <Text style={styles.finalHeading}>How does this make you feel?</Text>
                <Compass size={24} color="#928490" />
              </View>

              <View style={styles.finalTextContainer}>
                <Text style={styles.finalText}>
                  There are so many ways to build a dream life beyond dance. When you start with your values and open your mind to unique ways to bring those values together, you'll realize that dance was just one piece of the puzzle.
                </Text>
              </View>

              <Text style={styles.alternativeClosing}>
                See you again tomorrow.
              </Text>

              <View style={styles.finalButtonContainer}>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleComplete}
                  activeOpacity={0.8}
                >
                  <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                    <Text style={styles.continueButtonText}>Mark As Complete</Text>
                    <ChevronRight size={16} color="#E2DED0" />
                  </View>
                </TouchableOpacity>
              </View>
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
            <View style={styles.backButton} />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.titleText}>Your Values</Text>
            </View>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.centeredContent}>
            <View style={styles.resultCard}>
              <View style={styles.resultIconContainer}>
                <View style={[styles.resultIconGradient, { backgroundColor: result.color }]}>
                  <Compass size={40} color="#E2DED0" />
                </View>
              </View>

              <Text style={styles.resultTitle}>{result.title}</Text>

              <View style={styles.resultTextContainer}>
                <Text style={styles.resultText}>{result.description}</Text>
              </View>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinueToFinal}
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
  if (randomizedQuestions.length === 0) {
    return <View style={styles.container} />;
  }

  const question = randomizedQuestions[currentScreen - 1];
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
            <Text style={styles.progressText}>Question {currentScreen} of 10</Text>
          </View>
          <View style={styles.backButton} />
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.centeredContent}>
          <View style={styles.choiceCard}>
            <Text style={styles.questionText}>{question.question}</Text>

            <View style={styles.choiceButtons}>
              {question.options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.choiceButton}
                  onPress={() => handleAnswer(option.value)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.choiceButtonText}>{option.text}</Text>
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
    zIndex: 1,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height - 200,
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
    fontStyle: 'italic',
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
  questionText: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#4E4F50',
    lineHeight: 28,
    marginBottom: 30,
    textAlign: 'center',
  },
  choiceButtons: {
    gap: 15,
  },
  choiceButton: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  choiceButtonText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 22,
    textAlign: 'center',
  },
  resultHeader: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  resultIconContainer: {
    marginBottom: 24,
  },
  resultIconGradient: {
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
  resultTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },
  resultCard: {
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
  resultTextContainer: {
    width: '100%',
    marginBottom: 32,
  },
  resultText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
  },

  storyTextContainer: {
    width: '100%',
    marginBottom: 32,
  },
  storyText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
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
  finalContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  finalIconContainer: {
    marginBottom: 30,
  },
  finalIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  finalTextContainer: {
    width: '100%',
    marginBottom: 40,
  },
  finalText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 28,
  },
  finalButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  finalScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  finalCard: {
    width: width * 0.85,   // ✅ match introCard/storyCard
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
});