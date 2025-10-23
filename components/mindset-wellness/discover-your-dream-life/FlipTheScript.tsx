import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, MessageCircle, ArrowLeft, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            {onBack ? (
              <TouchableOpacity style={styles.backIconWrapper} onPress={handleBack}>
                <ArrowLeft size={24} color="#E2DED0" />
              </TouchableOpacity>
            ) : (
              <View style={styles.backIconWrapper} />
            )}
            <View style={styles.backIconWrapper} />
          </View>
        </View>

        <View style={styles.scrollContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.introIcon}>
                <MessageCircle size={32} color="#928490" />
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
          </ScrollView>
        </View>
      </View>
    );
  }

  // Final Screen
  const currentScreen = screenHistory[screenHistory.length - 1];
  if (currentScreen.pairIndex === -1) {
    return (
      <View style={styles.container}>
        <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
          <View style={styles.headerRow}>
            <View style={styles.backIconWrapper} />
            <View style={styles.backIconWrapper} />
          </View>
        </View>

        <View style={styles.scrollContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.finalIcon}>
                <MessageCircle size={40} color="#928490" />
              </View>
              <Text style={styles.introTitle}>Own Your Story</Text>
              <Text style={styles.finalText}>
                Reframing the way you speak about your transition can do wonders for your mental health throughout the journey. Own your story!
              </Text>
              <Text style={styles.finalClosing}>
                You're almost at the final step in this path. See you there.
              </Text>

              <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.completeButtonText}>Mark As Complete</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  // Script Screens
  const currentPair = scriptPairs[currentPairIndex];
  const scriptProgress = ((currentPairIndex + 1) / scriptPairs.length) * 100;

  return (
    <View style={styles.container}>
      <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
            <ChevronLeft size={24} color="#E2DED0" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {currentPairIndex + 1} of {scriptPairs.length}
            </Text>
          </View>
          <View style={styles.backIconWrapper} />
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${scriptProgress}%` }]} />
        </View>
      </View>

      <View style={styles.scrollContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.scriptLabel}>
              {showNewScript ? 'What I could say instead:' : 'What I used to say:'}
            </Text>

            <View style={showNewScript ? styles.newScriptCard : styles.oldScriptCard}>
              <Text style={showNewScript ? styles.newScriptText : styles.oldScriptText}>
                "{showNewScript ? currentPair.newScript : currentPair.oldScript}"
              </Text>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <LinearGradient
                colors={showNewScript ? ['#647C90', '#647C90'] : ['#928490', '#746C70']}
                style={styles.continueButtonContent}
              >
                <Text style={styles.continueButtonText}>
                  {showNewScript ? currentPair.buttonText : 'See the alternative'}
                </Text>
                <ChevronRight size={16} color="#E2DED0" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DED0'
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIconWrapper: { width: 40, alignItems: 'center' },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#E2DED0',
  },

  card: {
    width: width * 0.85,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginVertical: 20,
  },
  introIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(146,132,144,0.1)',
    justifyContent: 'center', alignItems: 'center',
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

  startButton: { borderRadius: 12, overflow: 'hidden' },
  startButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#E2DED0',
    marginRight: 8,
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
  },
  newScriptText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },

  continueButton: { borderRadius: 12, overflow: 'hidden' },
  continueButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  continueButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    marginRight: 8,
  },

  finalIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(100,124,144,0.1)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 30,
  },
  finalText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  finalClosing: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 40,
  },
  completeButton: { borderRadius: 12, overflow: 'hidden' },
  completeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  completeButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    marginRight: 8,
  },

  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E2DED0',
    borderRadius: 3,
  },
});