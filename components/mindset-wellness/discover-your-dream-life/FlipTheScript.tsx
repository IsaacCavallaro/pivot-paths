import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, MessageCircle, ArrowLeft, ChevronLeft } from 'lucide-react-native';

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
      // Move to next pair
      if (currentPairIndex < scriptPairs.length - 1) {
        const newPairIndex = currentPairIndex + 1;
        setCurrentPairIndex(newPairIndex);
        setShowNewScript(false);
        setScreenHistory([...screenHistory, { pairIndex: newPairIndex, showNew: false }]);
      } else {
        // All pairs completed, go to final screen
        setScreenHistory([...screenHistory, { pairIndex: -1, showNew: false }]); // -1 represents final screen
      }
    } else {
      // Show new script for current pair
      setShowNewScript(true);
      setScreenHistory([...screenHistory, { pairIndex: currentPairIndex, showNew: true }]);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const goBack = () => {
    if (screenHistory.length <= 1) {
      // If we're at the first screen, go back to intro
      setScreenHistory([]);
      setCurrentPairIndex(0);
      setShowNewScript(false);
      return;
    }

    // Remove current screen from history
    const newHistory = [...screenHistory];
    newHistory.pop();
    setScreenHistory(newHistory);

    // Get previous screen state
    const prevScreen = newHistory[newHistory.length - 1];

    if (prevScreen.pairIndex === -1) {
      // Shouldn't happen as we handle final screen separately
      return;
    }

    setCurrentPairIndex(prevScreen.pairIndex);
    setShowNewScript(prevScreen.showNew);
  };

  // Intro Screen
  if (screenHistory.length === 0) {
    return (
      <View style={styles.container}>
        {onBack && (
          <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
            <ArrowLeft size={28} color="#647C90" />
          </TouchableOpacity>
        )}
        <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
          <View style={styles.introIcon}>
            <MessageCircle size={32} color="#928490" />
          </View>

          <Text style={styles.introTitle}>Flip the Script</Text>

          <Text style={styles.introDescription}>
            One of the scariest parts of leaving your dance career is answering the dreaded small-talk question, "So, what have you been up to?". When you're in the middle of a huge shift, it's easy to make a joke or shirk the question entirely. But what if we flip the script and talked about our pivot with confidence?
          </Text>

          <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
            <View
              style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
            >
              <Text style={styles.startButtonText}>Let's go</Text>
              <ChevronRight size={16} color="#E2DED0" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Final Screen (handled by pairIndex = -1 in history)
  const currentScreen = screenHistory[screenHistory.length - 1];
  if (currentScreen.pairIndex === -1) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
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
            <View
              style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
            >
              <Text style={styles.completeButtonText}>Mark As Complete</Text>
              <ChevronRight size={16} color="#E2DED0" />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={20} color="#647C90" />
          <Text style={styles.backButtonText}>Previous</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Script Screens
  const currentPair = scriptPairs[currentPairIndex];

  // Calculate progress for script screens
  const scriptProgress = ((currentPairIndex + 1) / scriptPairs.length) * 100;

  if (!showNewScript) {
    // Show old script
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentPairIndex + 1} of {scriptPairs.length} pairs
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${scriptProgress}%` }]} />
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scriptContainer}>
          <Text style={styles.scriptLabel}>What I used to say:</Text>

          <View style={styles.oldScriptCard}>
            <Text style={styles.oldScriptText}>"{currentPair.oldScript}"</Text>
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <LinearGradient
              colors={['#928490', '#746C70']}
              style={styles.continueButtonGradient}
            >
              <Text style={styles.continueButtonText}>See the alternative</Text>
              <ChevronRight size={16} color="#E2DED0" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color="#647C90" />
          <Text style={styles.backButtonText}>
            {screenHistory.length <= 1 ? 'Back to Intro' : 'Previous'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    // Show new script
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentPairIndex + 1} of {scriptPairs.length} pairs
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${scriptProgress}%` }]} />
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scriptContainer}>
          <Text style={styles.scriptLabel}>What I could say instead:</Text>

          <View style={styles.newScriptCard}>
            <Text style={styles.newScriptText}>"{currentPair.newScript}"</Text>
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <LinearGradient
              colors={['#5A7D7B', '#647C90']}
              style={styles.continueButtonGradient}
            >
              <Text style={styles.continueButtonText}>{currentPair.buttonText}</Text>
              <ChevronRight size={16} color="#E2DED0" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={20} color="#647C90" />
          <Text style={styles.backButtonText}>Previous</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DED0',
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
    fontSize: 32,
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
  scriptContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  scriptLabel: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 30,
  },
  oldScriptCard: {
    backgroundColor: 'rgba(146, 132, 144, 0.15)',
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
    backgroundColor: 'rgba(90, 125, 123, 0.15)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: '#928490',
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
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
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
  topBackButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
    padding: 8,
  },
});