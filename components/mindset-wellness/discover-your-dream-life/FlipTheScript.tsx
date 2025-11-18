import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Linking, TextInput, Alert, Animated } from 'react-native';
import { ChevronRight, MessageCircle, ArrowLeft, PlusCircle, Smile, Frown, Meh, Laugh, Angry, Heart } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface ScriptPair {
  id: number;
  oldScript: string;
  newScript: string;
  buttonText: string;
}

interface JournalEntry {
  id: string;
  pathTag: string;
  date: string;
  content: string;
  mood?: string;
}

const MOOD_OPTIONS = [
  { id: 'angry', label: 'Angry', icon: Angry, color: '#DC2626' },
  { id: 'sad', label: 'Sad', icon: Frown, color: '#2563EB' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: '#CA8A04' },
  { id: 'happy', label: 'Happy', icon: Smile, color: '#16A34A' },
  { id: 'excited', label: 'Excited', icon: Laugh, color: '#7C3AED' },
  { id: 'loved', label: 'Loved', icon: Heart, color: '#DB2777' },
];

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
  const [journalEntry, setJournalEntry] = useState('');
  const [morningJournalEntry, setMorningJournalEntry] = useState('');
  const [endOfDayJournalEntry, setEndOfDayJournalEntry] = useState('');
  const [selectedMorningMood, setSelectedMorningMood] = useState<string | null>(null);
  const [selectedEndOfDayMood, setSelectedEndOfDayMood] = useState<string | null>(null);

  // Enhanced animation values with useRef for better performance
  const flipAnim = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ADD THIS: Ref for ScrollView to control scroll position
  const scrollViewRef = useRef<ScrollView>(null);

  // ADD THIS: Function to scroll to top
  const scrollToTop = useCallback(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, []);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  const handleStartGame = () => {
    setScreenHistory([{ pairIndex: 0, showNew: false }]);
    scrollToTop(); // ADD THIS
  };

  const flipCard = useCallback(() => {
    // Reset animations first
    flipAnim.setValue(0);
    cardScale.setValue(1);
    fadeAnim.setValue(1);

    // Scale down slightly before flip for more natural feel
    Animated.sequence([
      Animated.parallel([
        Animated.timing(cardScale, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        })
      ]),
      Animated.parallel([
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ])
    ]).start(() => {
      setShowNewScript(true);
      // FIX: Use functional update to get the current value
      setScreenHistory(prev => [...prev, { pairIndex: currentPairIndex, showNew: true }]);
    });
  }, [currentPairIndex, flipAnim, cardScale, fadeAnim]);

  const handleContinue = useCallback(() => {
    if (showNewScript) {
      if (currentPairIndex < scriptPairs.length - 1) {
        // Fade out current card
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          const newPairIndex = currentPairIndex + 1;

          // Reset all animations BEFORE updating state
          flipAnim.setValue(0);
          fadeAnim.setValue(0);
          cardScale.setValue(1);

          // Update state
          setCurrentPairIndex(newPairIndex);
          setShowNewScript(false);

          // Animate in the next card with a slight delay
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.spring(progressAnim, {
                toValue: (newPairIndex + 1) / scriptPairs.length,
                tension: 50,
                friction: 7,
                useNativeDriver: false,
              })
            ]).start();
          }, 50);

          setScreenHistory(prev => [...prev, { pairIndex: newPairIndex, showNew: false }]);
          scrollToTop(); // ADD THIS
        });
      } else {
        // Smooth transition to reflection screen
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setScreenHistory(prev => [...prev, { pairIndex: -2, showNew: false }]);
          fadeAnim.setValue(1);
          scrollToTop(); // ADD THIS
        });
      }
    } else {
      flipCard();
    }
  }, [showNewScript, currentPairIndex, flipCard, fadeAnim, flipAnim, cardScale, progressAnim, scrollToTop]);

  const handleComplete = () => {
    // Add a subtle scale animation on complete
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      onComplete();
    });
  };

  const goBack = () => {
    if (screenHistory.length <= 1) {
      setScreenHistory([]);
      setCurrentPairIndex(0);
      setShowNewScript(false);
      flipAnim.setValue(0);
      fadeAnim.setValue(1);
      cardScale.setValue(1);
      scrollToTop(); // ADD THIS
      return;
    }

    const newHistory = [...screenHistory];
    newHistory.pop();
    setScreenHistory(newHistory);

    const prevScreen = newHistory[newHistory.length - 1];
    if (prevScreen.pairIndex === -1 || prevScreen.pairIndex === -2) {
      return;
    }

    // Animate the transition back
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentPairIndex(prevScreen.pairIndex);
      setShowNewScript(prevScreen.showNew);
      // Reset flip animation based on whether we're going back to new or old script
      flipAnim.setValue(prevScreen.showNew ? 1 : 0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      scrollToTop(); // ADD THIS
    });
  };

  // Function to open YouTube Short
  const openYouTubeShort = async () => {
    const youtubeUrl = `https://www.youtube.com/shorts/txScPvwXEcQ`;

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

  // Add Morning Journal Entry Function
  const addMorningJournalEntry = async () => {
    const trimmed = morningJournalEntry.trim();
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
        mood: selectedMorningMood,
      };

      // Load existing entries
      const raw = await AsyncStorage.getItem('journalEntries');
      const existingEntries = raw ? JSON.parse(raw) : [];

      // Add new entry to the beginning
      const updatedEntries = [newEntry, ...existingEntries];

      // Save back to storage
      await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

      // Clear input and show success
      setMorningJournalEntry('');
      setSelectedMorningMood(null);
      Alert.alert('Success', 'Morning journal entry added!');

    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry.');
    }
  };

  // Add End of Day Journal Entry Function
  const addEndOfDayJournalEntry = async () => {
    const trimmed = endOfDayJournalEntry.trim();
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
        mood: selectedEndOfDayMood,
      };

      // Load existing entries
      const raw = await AsyncStorage.getItem('journalEntries');
      const existingEntries = raw ? JSON.parse(raw) : [];

      // Add new entry to the beginning
      const updatedEntries = [newEntry, ...existingEntries];

      // Save back to storage
      await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

      // Clear input and show success
      setEndOfDayJournalEntry('');
      setSelectedEndOfDayMood(null);
      Alert.alert('Success', 'End of day journal entry added!');

    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry.');
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

  // Enhanced flip animation interpolations with perspective
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  // Add perspective for more realistic 3D effect
  const frontAnimatedStyle = {
    transform: [
      { perspective: 1000 },
      { rotateY: frontInterpolate },
      { scale: cardScale }
    ],
    opacity: fadeAnim
  };

  const backAnimatedStyle = {
    transform: [
      { perspective: 1000 },
      { rotateY: backInterpolate },
      { scale: cardScale }
    ],
    opacity: fadeAnim
  };

  // Progress animation interpolation
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Update progress when currentPairIndex changes
  React.useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: (currentPairIndex + 1) / scriptPairs.length,
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [currentPairIndex]);

  // NEW: Intro Screen with Morning Journal
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

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => scrollToTop()}
          onLayout={() => scrollToTop()}
        >
          <View style={styles.centeredContent}>
            <View style={styles.introCard}>
              <View style={styles.introIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={styles.heroImage}
                />
              </View>

              <Text style={styles.introTitle}>Look at you!</Text>
              <Text style={styles.introDescription}>
                You're almost at the end of this path and you've already dug through a lot. It's not easy and it's ok if this is all still really uncomfortable. You're taking action and you're turning up. The rest is a matter of time, trust me. Let's keep going, one small step at a time.
              </Text>

              {/* Morning Journal Section */}
              <View style={styles.journalSection}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionDivider} />
                </View>

                <Text style={styles.journalInstruction}>
                  Before we begin, let's take a moment to check in with yourself. How are you feeling as you continue this journey?
                </Text>

                {/* Mood Selection */}
                <View style={styles.moodSection}>
                  <Text style={styles.moodLabel}>How are you feeling right now?</Text>
                  <View style={styles.moodContainer}>
                    {MOOD_OPTIONS.map((mood) => {
                      const IconComponent = mood.icon;
                      return (
                        <TouchableOpacity
                          key={mood.id}
                          style={[
                            styles.moodButton,
                            selectedMorningMood === mood.id && {
                              backgroundColor: mood.color,
                            }
                          ]}
                          onPress={() => setSelectedMorningMood(
                            selectedMorningMood === mood.id ? null : mood.id
                          )}
                        >
                          <IconComponent
                            size={20}
                            color={selectedMorningMood === mood.id ? '#E2DED0' : mood.color}
                          />
                          <Text style={[
                            styles.moodLabelText,
                            selectedMorningMood === mood.id && { color: '#E2DED0' }
                          ]}>
                            {mood.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Journal Input */}
                <View style={styles.journalInputContainer}>
                  <TextInput
                    style={styles.journalTextInput}
                    placeholder="Add your entry here"
                    placeholderTextColor="#928490"
                    multiline
                    value={morningJournalEntry}
                    onChangeText={setMorningJournalEntry}
                  />
                  <TouchableOpacity
                    style={[styles.journalAddButton, { backgroundColor: '#647C90' }]}
                    onPress={addMorningJournalEntry}
                  >
                    <PlusCircle size={20} color="#E2DED0" />
                    <Text style={styles.journalAddButtonText}>Save Morning Entry</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.journalNote}>
                  We'll keep these entries safe in your personal journal for you to review later.
                </Text>
              </View>

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

  // NEW: Reflection Screen
  const currentScreen = screenHistory[screenHistory.length - 1];
  if (currentScreen.pairIndex === -2) {
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
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => scrollToTop()}
          onLayout={() => scrollToTop()}
        >
          <View style={styles.centeredContent}>
            <View style={styles.reflectionCard}>
              {/* Header */}
              <View style={styles.reflectionHeader}>
                <Text style={styles.reflectionTitle}>Navigating Imposter Syndrome</Text>
              </View>

              {/* Introduction Text */}
              <View style={styles.reflectionIntro}>
                <Text style={styles.reflectionDescription}>
                  A big part of flipping the script with confidence is navigating imposter syndrome. To end today, let's watch this 5-minute clip to dive deeper into imposter syndrome in dancers and how to get through it.
                </Text>
              </View>

              {/* YouTube Video Player */}
              <View style={styles.videoSection}>
                <View style={styles.videoContainer}>
                  <View style={styles.youtubePlayer}>
                    <YoutubePlayer
                      height={140}
                      play={false}
                      videoId={'w9Tzx-sZhTg'}
                      webViewStyle={styles.youtubeWebView}
                    />
                  </View>
                </View>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  setScreenHistory(prev => [...prev, { pairIndex: -1, showNew: false }]);
                  scrollToTop();
                }}
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

  // Final Screen (Updated with End of Day Journal)
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

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => scrollToTop()}
          onLayout={() => scrollToTop()}
        >
          <View style={styles.centeredContent}>
            <View style={styles.finalCard}>
              <View style={styles.finalIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={styles.heroImage}
                />
              </View>

              <View style={styles.finalHeader}>
                <Text style={styles.finalHeading}>Now it's your turn</Text>
              </View>

              <View style={styles.finalTextContainer}>
                <Text style={styles.finalText}>
                  Write your own script for how you'll talk about your transition. What feels authentic and empowering to you?
                </Text>
              </View>

              {/* End of Day Journal Section */}
              <View style={styles.journalSection}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionDivider} />
                </View>

                <Text style={styles.journalInstruction}>
                  Before we bring today's session to a close, let's take a moment to check in with yourself again. How are you feeling after today's journey?
                </Text>

                {/* Mood Selection */}
                <View style={styles.moodSection}>
                  <Text style={styles.moodLabel}>How are you feeling now?</Text>
                  <View style={styles.moodContainer}>
                    {MOOD_OPTIONS.map((mood) => {
                      const IconComponent = mood.icon;
                      return (
                        <TouchableOpacity
                          key={mood.id}
                          style={[
                            styles.moodButton,
                            selectedEndOfDayMood === mood.id && {
                              backgroundColor: mood.color,
                            }
                          ]}
                          onPress={() => setSelectedEndOfDayMood(
                            selectedEndOfDayMood === mood.id ? null : mood.id
                          )}
                        >
                          <IconComponent
                            size={20}
                            color={selectedEndOfDayMood === mood.id ? '#E2DED0' : mood.color}
                          />
                          <Text style={[
                            styles.moodLabelText,
                            selectedEndOfDayMood === mood.id && { color: '#E2DED0' }
                          ]}>
                            {mood.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Journal Input */}
                <View style={styles.journalInputContainer}>
                  <TextInput
                    style={styles.journalTextInput}
                    placeholder="Add entry here"
                    placeholderTextColor="#928490"
                    multiline
                    value={endOfDayJournalEntry}
                    onChangeText={setEndOfDayJournalEntry}
                  />
                  <TouchableOpacity
                    style={[styles.journalAddButton, { backgroundColor: '#647C90' }]}
                    onPress={addEndOfDayJournalEntry}
                  >
                    <PlusCircle size={20} color="#E2DED0" />
                    <Text style={styles.journalAddButtonText}>Save End of Day Entry</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.journalNote}>
                  We'll keep these entries safe in your personal journal for you to review later.
                </Text>
              </View>

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
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={() => scrollToTop()}
        onLayout={() => scrollToTop()}
      >
        <View style={styles.centeredContent}>
          <View style={styles.flipContainer}>
            {/* Front of card (old script view) */}
            <Animated.View
              style={[
                styles.choiceCard,
                styles.cardFace,
                frontAnimatedStyle,
              ]}
            >
              <Text style={styles.scriptLabel}>
                What I used to say:
              </Text>

              <View style={styles.scriptCard}>
                <View style={styles.oldScriptCard}>
                  <Text style={styles.oldScriptText}>
                    "{currentPair.oldScript}"
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.continueButtonText}>
                    Flip the script!
                  </Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Back of card (new script view) */}
            <Animated.View
              style={[
                styles.choiceCard,
                styles.cardFace,
                styles.cardBack,
                backAnimatedStyle,
              ]}
            >
              <Text style={styles.scriptLabel}>
                What I could say instead:
              </Text>

              <View style={styles.scriptCard}>
                <View style={styles.newScriptCard}>
                  <Text style={styles.newScriptText}>
                    "{currentPair.newScript}"
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.continueButtonText}>
                    {currentPair.buttonText}
                  </Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </Animated.View>
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
  // UPDATED: Flip container and card styles for entire card flip
  flipContainer: {
    width: width * 0.85,
    height: 400, // Fixed height to prevent layout shift during flip
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceCard: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    backfaceVisibility: 'hidden',
  },
  cardFace: {
    width: '100%',
    height: '100%',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scriptLabel: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 30,
  },
  scriptCard: {
    width: '100%',
    height: 180,
    marginBottom: 40,
  },
  oldScriptCard: {
    backgroundColor: 'rgba(146,132,144,0.15)',
    borderRadius: 16,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#928490',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderLeftWidth: 4,
    borderLeftColor: '#647C90',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newScriptText: {
    fontFamily: 'Montserrat-Regular',
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
  // NEW: Reflection Screen Styles
  reflectionCard: {
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
  reflectionHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  reflectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },
  reflectionIntro: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: 'rgba(146, 132, 144, 0.05)',
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#928490',
  },
  reflectionDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  videoSection: {
    marginBottom: 32,
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
  // Journal Section Styles
  journalSection: {
    width: '100%',
    marginBottom: 32,
    padding: 20,
    backgroundColor: 'rgba(146, 132, 144, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(146, 132, 144, 0.2)',
  },
  journalInstruction: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#647C90',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '500',
  },
  moodSection: {
    marginBottom: 16,
  },
  moodLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  moodButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 70,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodLabelText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#4E4F50',
    marginTop: 4,
    fontWeight: '500',
  },
  journalInputContainer: {
    marginBottom: 12,
  },
  journalTextInput: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(146, 132, 144, 0.3)',
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
    fontSize: 14,
    color: '#E2DED0',
    marginLeft: 8,
    fontWeight: '600',
  },
  journalNote: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#928490',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionDivider: {
    width: 60,
    height: 3,
    backgroundColor: '#928490',
    borderRadius: 2,
  },
});