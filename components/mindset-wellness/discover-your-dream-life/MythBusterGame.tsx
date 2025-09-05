import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Zap, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface MythPair {
  id: number;
  myth: string;
  reality: string;
}

interface MythBusterGameProps {
  onComplete: () => void;
  onBack?: () => void;
}

const mythPairs: MythPair[] = [
  {
    id: 1,
    myth: "Dancers shouldn't have a plan B.",
    reality: "A backup plan is essential."
  },
  {
    id: 2,
    myth: "I can dance well into my 40s.",
    reality: "Most dance careers end in your early 30s."
  },
  {
    id: 3,
    myth: "Real dancers sacrifice everything.",
    reality: "Balance doesn't make you a worse dancer."
  },
  {
    id: 4,
    myth: "The dance industry is my family.",
    reality: "Dance work cultures are often toxic."
  },
  {
    id: 5,
    myth: "Do what you love.",
    reality: "Passion doesn't pay the bills."
  },
  {
    id: 6,
    myth: "The show must go on.",
    reality: "Everyone needs sick days."
  },
  {
    id: 7,
    myth: "Dance is the dream.",
    reality: "You can have more than one dream."
  },
  {
    id: 8,
    myth: "Leaving dance makes me a sellout.",
    reality: "Staying in dance can be seen as settling."
  },
  {
    id: 9,
    myth: "Never give up.",
    reality: "It's ok to let go."
  }
];

export default function MythBusterGame({ onComplete, onBack }: MythBusterGameProps) {
  const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1 = game, 2 = reflection
  const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'myth' | 'reality' }>>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [showMismatch, setShowMismatch] = useState(false);
  const [animatedValues] = useState(() => new Map());

  const handleBack = () => {
    onBack?.();
  };

  const handleComplete = () => {
    onComplete();
  };

  const goBack = () => {
    if (currentScreen === 1) {
      setCurrentScreen(0);
    } else if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  useEffect(() => {
    if (currentScreen === 1) {
      setupGame();
    }
  }, [currentScreen]);

  const setupGame = () => {
    // Start with first 3 pairs, scrambled
    const firstThreePairs = mythPairs.slice(0, 3);
    const myths: Array<{ id: string; text: string; pairId: number; type: 'myth' | 'reality' }> = [];
    const realities: Array<{ id: string; text: string; pairId: number; type: 'myth' | 'reality' }> = [];

    firstThreePairs.forEach(pair => {
      myths.push({
        id: `myth_${pair.id}`,
        text: pair.myth,
        pairId: pair.id,
        type: 'myth'
      });
      realities.push({
        id: `reality_${pair.id}`,
        text: pair.reality,
        pairId: pair.id,
        type: 'reality'
      });
    });

    // Scramble myths and realities separately to avoid same-row alignment
    const scrambledMyths = [...myths].sort(() => Math.random() - 0.5);
    const scrambledRealities = [...realities].sort(() => Math.random() - 0.5);

    // Combine into single array for game logic
    const allItems = [...scrambledMyths, ...scrambledRealities];
    setGameItems(allItems);
    setCurrentPairIndex(3); // Next pair to add
  };

  const handleItemPress = (itemId: string) => {
    if (selectedItems.includes(itemId) || showMismatch) return;

    const newSelected = [...selectedItems, itemId];
    setSelectedItems(newSelected);

    if (newSelected.length === 2) {
      checkMatch(newSelected);
    }
  };

  const checkMatch = (selected: string[]) => {
    const item1 = gameItems.find(item => item.id === selected[0]);
    const item2 = gameItems.find(item => item.id === selected[1]);

    if (item1 && item2 && item1.pairId === item2.pairId) {
      // Match found!
      const newMatchedPairs = [...matchedPairs, item1.pairId];
      setMatchedPairs(newMatchedPairs);

      // Remove matched items and add new pair if available
      setTimeout(() => {
        const remainingItems = gameItems.filter(item => !selected.includes(item.id));

        // Add next pair if available
        if (currentPairIndex < mythPairs.length) {
          const nextPair = mythPairs[currentPairIndex];

          // Separate existing items by type
          const existingMyths = remainingItems.filter(item => item.type === 'myth');
          const existingRealities = remainingItems.filter(item => item.type === 'reality');

          // Add new myth and reality
          const newMyth = {
            id: `myth_${nextPair.id}`,
            text: nextPair.myth,
            pairId: nextPair.id,
            type: 'myth' as const
          };
          const newReality = {
            id: `reality_${nextPair.id}`,
            text: nextPair.reality,
            pairId: nextPair.id,
            type: 'reality' as const
          };

          // Randomly insert new items to avoid predictable positioning
          const allMyths = [...existingMyths];
          const allRealities = [...existingRealities];

          // Insert new myth at random position
          const mythInsertIndex = Math.floor(Math.random() * (allMyths.length + 1));
          allMyths.splice(mythInsertIndex, 0, newMyth);

          // Insert new reality at random position
          const realityInsertIndex = Math.floor(Math.random() * (allRealities.length + 1));
          allRealities.splice(realityInsertIndex, 0, newReality);

          const newItems = [...allMyths, ...allRealities];

          setGameItems(newItems);
          setCurrentPairIndex(currentPairIndex + 1);
        } else {
          setGameItems(remainingItems);
        }

        setSelectedItems([]);

        // Check if game is complete
        if (newMatchedPairs.length === mythPairs.length) {
          setTimeout(() => {
            setCurrentScreen(2);
          }, 500);
        }
      }, 600);
    } else {
      // No match - show red briefly
      setShowMismatch(true);
      setTimeout(() => {
        setShowMismatch(false);
        setSelectedItems([]);
      }, 800);
    }
  };

  const getItemStyle = (itemId: string) => {
    const isSelected = selectedItems.includes(itemId);
    const isMatched = gameItems.find(item => item.id === itemId && matchedPairs.includes(item.pairId));

    if (isMatched) {
      return [styles.gameButton, styles.matchedButton];
    } else if (isSelected && showMismatch) {
      return [styles.gameButton, styles.mismatchButton];
    } else if (isSelected) {
      return [styles.gameButton, styles.selectedButton];
    } else {
      return [styles.gameButton];
    }
  };

  // Intro Screen
  if (currentScreen === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
          <ArrowLeft size={28} color="#647C90" />
        </TouchableOpacity>
        <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
          <View style={styles.introIcon}>
            <Zap size={32} color="#928490" />
          </View>

          <Text style={styles.introTitle}>Myth Buster</Text>

          <Text style={styles.introDescription}>
            Match the myth to the reality
          </Text>

          <TouchableOpacity style={styles.startButton} onPress={() => setCurrentScreen(1)}>
            <View
              style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
            >
              <Text style={styles.startButtonText}>Start the game</Text>
              <ChevronRight size={16} color="#E2DED0" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Reflection Screen
  if (currentScreen === 2) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={styles.reflectionContainer}>
          <View style={styles.reflectionIcon}>
            <Zap size={40} color="#5A7D7B" />
          </View>

          <Text style={styles.reflectionTitle}>Great Work!</Text>

          <Text style={styles.reflectionText}>
            Reflect on the myths you currently believe and whether or not they're serving you.
          </Text>

          <Text style={styles.reflectionText}>
            The dance industry feeds us a lot of noise that doesn't actually benefit dancers.
          </Text>

          <Text style={styles.reflectionText}>
            In fact, these myths usually keep us stuck in a cycle where we're more susceptible to manipulation and exploitation by believing these myths. Do you agree?
          </Text>

          <Text style={styles.reflectionClosing}>
            We'll check back in tomorrow.
          </Text>

          <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
            <View
              style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
            >
              <Text style={styles.completeButtonText}>Mark As Complete</Text>
              <ChevronRight size={16} color="#E2DED0" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Game Screen
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {matchedPairs.length}/{mythPairs.length} pairs matched
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(matchedPairs.length / mythPairs.length) * 100}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.gameTitle}>Myth Buster</Text>
        <Text style={styles.gameInstructions}>
          Tap to match myths with their realities
        </Text>

        <View style={styles.columnsContainer}>
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Myth</Text>
            {gameItems.filter(item => item.type === 'myth').map((item) => (
              <TouchableOpacity
                key={item.id}
                style={getItemStyle(item.id)}
                onPress={() => handleItemPress(item.id)}
                activeOpacity={0.8}
                disabled={matchedPairs.includes(item.pairId)}
              >
                <Text style={[
                  styles.gameButtonText,
                  selectedItems.includes(item.id) && styles.selectedButtonText,
                  matchedPairs.includes(item.pairId) && styles.matchedButtonText,
                  selectedItems.includes(item.id) && showMismatch && styles.mismatchButtonText
                ]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.column}>
            <Text style={styles.columnTitle}>Reality</Text>
            {gameItems.filter(item => item.type === 'reality').map((item) => (
              <TouchableOpacity
                key={item.id}
                style={getItemStyle(item.id)}
                onPress={() => handleItemPress(item.id)}
                activeOpacity={0.8}
                disabled={matchedPairs.includes(item.pairId)}
              >
                <Text style={[
                  styles.gameButtonText,
                  selectedItems.includes(item.id) && styles.selectedButtonText,
                  matchedPairs.includes(item.pairId) && styles.matchedButtonText,
                  selectedItems.includes(item.id) && showMismatch && styles.mismatchButtonText
                ]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
    fontSize: 32,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 15,
  },
  introDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#746C70',
    textAlign: 'center',
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
  gameTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 24,
  },
  gameInstructions: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#746C70',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 24,
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
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 16, // Added padding for space from screen edges
  },
  column: {
    flex: 1,
  },
  columnTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 15,
  },
  gameButton: {
    width: '100%',
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'rgba(100, 124, 144, 0.2)',
    borderColor: '#647C90',
  },
  matchedButton: {
    backgroundColor: 'rgba(90, 125, 123, 0.2)',
    borderColor: '#5A7D7B',
    opacity: 0,
  },
  mismatchButton: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    borderColor: '#dc3545',
  },
  gameButtonText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 18,
  },
  selectedButtonText: {
    color: '#647C90',
    fontFamily: 'Montserrat-SemiBold',
  },
  matchedButtonText: {
    color: '#5A7D7B',
  },
  mismatchButtonText: {
    color: '#dc3545',
  },
  reflectionContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  reflectionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(90, 125, 123, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  reflectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 30,
  },
  reflectionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  reflectionClosing: {
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
});