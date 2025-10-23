import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { ChevronRight, MessageCircle, ArrowLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface ScriptPair {
  id: number;
  oldScript: string;
  newScript: string;
  buttonText: string;
}

const scriptPairs: ScriptPair[] = [
  {
    id: 1,
    oldScript: "Oh, I'm just a washed-up dancer now.",
    newScript: "I had an amazing dance career, and now I'm exploring a whole new chapter I'm really excited about.",
    buttonText: "Doesn't that feel better?"
  },
  {
    id: 2,
    oldScript: "I don't really dance anymore… I guess I'm retired.",
    newScript: "I'm channeling my creativity into new projects these days, and it's been surprisingly fulfilling.",
    buttonText: "See how empowering that sounds?"
  },
  {
    id: 3,
    oldScript: "Yeah… I quit dance.",
    newScript: "I transitioned out of the industry recently. I'm learning a bunch of new things right now, just trying to find my next adventure.",
    buttonText: "That's owning your story!"
  },
  {
    id: 4,
    oldScript: "I'm not really doing anything interesting right now.",
    newScript: "I'm in the middle of discovering what's next, and it's been an adventure.",
    buttonText: "Ok, she's evolving!"
  },
  {
    id: 5,
    oldScript: "Oh, I just do boring stuff now.",
    newScript: "I've been exploring corporate work that's completely different from dance and I've learned so much.",
    buttonText: "Look at you!"
  },
  {
    id: 6,
    oldScript: "I guess I peaked when I was on stage.",
    newScript: "I loved performing, and now I'm building something that excites me in a whole new way.",
    buttonText: "You're in your growth era!"
  },
  {
    id: 7,
    oldScript: "Nothing compares to dance, so it's just… whatever.",
    newScript: "I'll always love dance, and I've found other passions that light me up too.",
    buttonText: "Ok, multi-hyphenate queen!"
  },
  {
    id: 8,
    oldScript: "I'm kind of lost without dance.",
    newScript: "I'm learning so much about myself outside of dance, and it's been eye-opening.",
    buttonText: "We love that positive honesty!"
  },
  {
    id: 9,
    oldScript: "I used to be a dancer, but now… not really.",
    newScript: "I danced professionally for years, and now I'm applying those skills in new ways.",
    buttonText: "You're still a dancer, girl!"
  },
  {
    id: 10,
    oldScript: "Yeah, I don't dance anymore. It's over.",
    newScript: "I'm dancing as a hobby now and recently found a new career that's actually been surprisingly meaningful.",
    buttonText: "That's the confidence we love!"
  }
];

interface FlipTheScriptProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function FlipTheScript({ onComplete, onBack }: FlipTheScriptProps) {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [showNewScript, setShowNewScript] = useState(false);
  const [screenHistory, setScreenHistory] = useState<Array<{ pairIndex: number, showNew: boolean }>>([]);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  const handleStartGame = () => {
    setScreenHistory([{ pairIndex: 0, showNew: false }]);
  };

  const handleContinue = () => {
    if (showNewScript) {
      if (currentPairIndex < scriptPairs.length - 1) {
        const newPairIndex = currentPairIndex + 1;
        setCurrentPairIndex(newPairIndex);
        setShowNewScript(false);
        setScreenHistory([...screenHistory, { pairIndex: newPairIndex, showNew: false }]);
      } else {
        setScreenHistory([...screenHistory, { pairIndex: -1, showNew: false }]);
      }
    } else {
      setShowNewScript(true);
      setScreenHistory([...screenHistory, { pairIndex: currentPairIndex, showNew: true }]);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const goBack = () => {
    if (screenHistory.length <= 1) {
      setScreenHistory([]);
      setCurrentPairIndex(0);
      setShowNewScript(false);
      return;
    }

    const newHistory = [...screenHistory];
    newHistory.pop();
    setScreenHistory(newHistory);

    const prevScreen = newHistory[newHistory.length - 1];
    if (prevScreen.pairIndex === -1) {
      return;
    }

    setCurrentPairIndex(prevScreen.pairIndex);
    setShowNewScript(prevScreen.showNew);
  };

  // Intro Screen
  if (screenHistory.length === 0) {
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
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={styles.heroImage}
                />
              </View>

              <Text style={styles.introTitle}>Flip the Script</Text>
              <Text style={styles.introDescription}>
                One of the scariest parts of leaving your dance career is answering the dreaded small-talk question, "So, what have you been up to?" … But what if we flipped the script and talked about our pivot with confidence?
              </Text>

              <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.startButtonText}>Let's go</Text>
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
  const currentScreen = screenHistory[screenHistory.length - 1];
  if (currentScreen.pairIndex === -1) {
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
          <View style={styles.centeredContent}>
            <View style={styles.finalCard}>
              <View style={styles.finalIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={styles.heroImage}
                />
              </View>

              <View style={styles.finalHeader}>
                <Text style={styles.finalHeading}>Own Your Story</Text>
              </View>

              <View style={styles.finalTextContainer}>
                <Text style={styles.finalText}>
                  Reframing the way you speak about your transition can do wonders for your mental health throughout the journey. Own your story!
                </Text>
              </View>

              <Text style={styles.alternativeClosing}>
                You're almost at the final step in this path. See you there.
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

  // Script Screens
  const currentPair = scriptPairs[currentPairIndex];
  const progress = ((currentPairIndex + 1) / scriptPairs.length) * 100;

  return (
    <View style={styles.container}>
      {/* Sticky Header with Progress */}
      <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <ArrowLeft size={28} color="#E2DED0" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.progressText}>{currentPairIndex + 1} of {scriptPairs.length}</Text>
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
            <Text style={styles.scriptLabel}>
              {showNewScript ? 'What I could say instead:' : 'What I used to say:'}
            </Text>

            <View style={showNewScript ? styles.newScriptCard : styles.oldScriptCard}>
              <Text style={showNewScript ? styles.newScriptText : styles.oldScriptText}>
                "{showNewScript ? currentPair.newScript : currentPair.oldScript}"
              </Text>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                <Text style={styles.continueButtonText}>
                  {showNewScript ? currentPair.buttonText : 'See the alternative'}
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginVertical: 20,
  },
  scriptLabel: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 30,
  },
  oldScriptCard: {
    backgroundColor: 'rgba(146,132,144,0.15)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: '#928490',
    width: '100%',
  },
  oldScriptText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#746C70',
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  newScriptCard: {
    backgroundColor: 'rgba(100,124,144,0.15)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: '#647C90',
    width: '100%',
  },
  newScriptText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
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
  finalCard: {
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
  finalTextContainer: {
    width: '100%',
    marginBottom: 32,
  },
  finalText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
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
  finalButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#647C90',
    borderWidth: 2,
  },
});