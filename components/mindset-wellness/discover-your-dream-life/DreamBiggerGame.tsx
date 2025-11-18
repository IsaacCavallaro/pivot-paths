import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Linking, TextInput, Alert } from 'react-native';
import { ChevronRight, Sparkles, ArrowLeft, PlusCircle, Smile, Frown, Meh, Laugh, Angry, Heart } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DreamChoice {
  id: number;
  option1: string;
  option2: string;
  storyKey: string;
}

interface DreamBiggerGameProps {
  onComplete: () => void;
  onBack?: () => void;
}

interface JournalEntry {
  id: string;
  pathTag: string;
  date: string;
  content: string;
  mood?: string;
}

const { width, height } = Dimensions.get('window');

const MOOD_OPTIONS = [
  { id: 'angry', label: 'Angry', icon: Angry, color: '#DC2626' },
  { id: 'sad', label: 'Sad', icon: Frown, color: '#2563EB' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: '#CA8A04' },
  { id: 'happy', label: 'Happy', icon: Smile, color: '#16A34A' },
  { id: 'excited', label: 'Excited', icon: Laugh, color: '#7C3AED' },
  { id: 'loved', label: 'Loved', icon: Heart, color: '#DB2777' },
];

const dreamChoices: DreamChoice[] = [
  {
    id: 1,
    option1: 'Beach house',
    option2: 'Mountain cabin',
    storyKey: 'home'
  },
  {
    id: 2,
    option1: 'Travel the world',
    option2: 'Buy your forever home',
    storyKey: 'lifestyle'
  },
  {
    id: 3,
    option1: 'Learn to surf',
    option2: 'Learn to build pottery',
    storyKey: 'hobby'
  },
  {
    id: 4,
    option1: 'Start a family',
    option2: 'Start a business',
    storyKey: 'purpose'
  },
  {
    id: 5,
    option1: '6-figure income',
    option2: 'Unlimited time off',
    storyKey: 'work'
  },
  {
    id: 6,
    option1: 'Personal chef',
    option2: 'High-quality wardrobe',
    storyKey: 'luxury'
  },
  {
    id: 7,
    option1: 'Work part time',
    option2: 'Retire early',
    storyKey: 'schedule'
  },
  {
    id: 8,
    option1: 'Season tickets to the theatre',
    option2: 'Create your own show',
    storyKey: 'entertainment'
  },
  {
    id: 9,
    option1: 'Run a marathon',
    option2: 'Annual yoga retreats',
    storyKey: 'wellness'
  },
  {
    id: 10,
    option1: 'Donate to charity',
    option2: 'Help your parents retire',
    storyKey: 'giving'
  }
];

// Mapping function to convert specific choices to their story representations
const getStoryMapping = (choice: string): string => {
  const mappings: { [key: string]: string } = {
    'Learn to surf': 'surfing lessons',
    'Learn to build pottery': 'pottery classes',
    'Run a marathon': 'marathon',
    'Annual yoga retreats': 'yoga retreat'
  };

  return mappings[choice] || choice;
};

export default function DreamBiggerGame({ onComplete, onBack }: DreamBiggerGameProps) {
  const [currentScreen, setCurrentScreen] = useState(-1); // -1 = new intro, 0 = original intro, 1-10 = choices, 11-17 = story, 18 = reflection, 19 = final
  const [choices, setChoices] = useState<{ [key: string]: string }>({});
  const [randomizedChoices, setRandomizedChoices] = useState<DreamChoice[]>([]);
  const [morningJournalEntry, setMorningJournalEntry] = useState('');
  const [endOfDayJournalEntry, setEndOfDayJournalEntry] = useState('');
  const [selectedMorningMood, setSelectedMorningMood] = useState<string | null>(null);
  const [selectedEndOfDayMood, setSelectedEndOfDayMood] = useState<string | null>(null);

  useEffect(() => {
    // Randomize the order of choices when component mounts
    const shuffled = [...dreamChoices].sort(() => Math.random() - 0.5);
    setRandomizedChoices(shuffled);
  }, []);

  const handleStartGame = () => {
    setCurrentScreen(0);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const goBack = () => {
    if (currentScreen === -1) {
      if (onBack) onBack();
    } else if (currentScreen === 0) {
      setCurrentScreen(-1);
    } else if (currentScreen === 1) {
      setCurrentScreen(0);
    } else if (currentScreen > 1 && currentScreen <= 19) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleChoice = (choiceKey: string, selectedOption: string) => {
    const newChoices = { ...choices, [choiceKey]: selectedOption };
    setChoices(newChoices);

    if (currentScreen < 10) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Skip to story screen 12 (Explore Your Dream Life)
      setCurrentScreen(12);
    }
  };

  const handleContinueStory = () => {
    if (currentScreen < 18) {
      setCurrentScreen(currentScreen + 1);
    } else if (currentScreen === 18) {
      setCurrentScreen(19); // Go to final screen
    } else {
      onComplete();
    }
  };

  const handleOpenEbook = () => {
    Linking.openURL('https://pivotfordancers.com/products/how-to-pivot/');
  };

  const handleOpenCourse = () => {
    Linking.openURL('https://pivotfordancers.com/products/happy-trails/');
  };

  // Function to open YouTube Short
  const openYouTubeShort = async () => {
    const youtubeUrl = `https://www.youtube.com/shorts/C7m4B08IPKk`;

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

  const getStoryText = (screenNumber: number) => {
    switch (screenNumber) {
      case 12:
        return "Explore Your Dream Life";
      case 13:
        return `You wake up in your ${choices.home?.toLowerCase()} to the ${choices.purpose === 'Start a family' ? 'sound of happy kids running around' : 'notification that more sales from your business came through overnight'}.`;
      case 14:
        return `${choices.schedule === 'Work part time' ? 'You work part-time' : 'You\'re on track to retire early'} and you relax at the thought of your ${choices.work?.toLowerCase()} knowing that your ${getStoryMapping(choices.hobby || '').toLowerCase()} are going to be the most challenging part of your day.`;
      case 15:
        return `You head ${choices.luxury === 'Personal chef' ? 'downstairs to eat your chef-prepared breakfast' : 'to your closet and pick out another custom piece from your wardrobe'} and start the day on your terms.`;
      case 16:
        return `Your to-do list involves organizing ${choices.lifestyle === 'Travel the world' ? 'next week\'s travel plans' : 'renovations for your forever home'}, training for that upcoming ${getStoryMapping(choices.wellness || '').toLowerCase()}, and deciding ${choices.giving === 'Donate to charity' ? 'which charity to donate to this month' : 'when you\'re meeting up with your parents now that you helped them retire too'}.`;
      case 17:
        return `And tonight, you're off ${choices.entertainment === 'Season tickets to the theatre' ? 'to the theater with season tickets' : 'to workshop a new show you\'re creating which opens next month'}. Life's good.`;
      default:
        return "";
    }
  };

  // NEW: Intro Screen with Morning Journal
  if (currentScreen === -1) {
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

              <Text style={styles.introTitle}>Welcome to Day 4</Text>

              <Text style={styles.introDescription}>
                This is where we're diving deeper into becoming the Expansive Dreamer we talked about on Day 1.
              </Text>

              <Text style={styles.introDescription}>
                You've already identified your dreamer type, challenged industry myths, and explored alternatives. Now, let's stretch your imagination even further.
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

              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartGame}
                activeOpacity={0.8}
              >
                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.startButtonText}>Continue</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Original Intro Screen (now screen 0)
  if (currentScreen === 0) {
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
            <View style={styles.introCard}>
              <View style={styles.introIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={styles.heroImage}
                />
              </View>

              <Text style={styles.introTitle}>Dream Bigger</Text>

              <Text style={styles.introDescription}>
                This is a game of instincts. Choose the answer that you resonate with the most to help you dream bigger about what life after dance can be. Don't think too much! There's no right or wrong. Let's see what you can dream up.
              </Text>

              <TouchableOpacity
                style={styles.startButton}
                onPress={() => setCurrentScreen(1)}
                activeOpacity={0.8}
              >
                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.startButtonText}>Start dreaming</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Choice Screens (1-10)
  if (currentScreen >= 1 && currentScreen <= 10) {
    const choiceIndex = currentScreen - 1;
    const currentChoice = randomizedChoices[choiceIndex];

    if (!currentChoice) return null;

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
            <View style={[styles.progressFill, { width: `${(currentScreen / 10) * 100}%` }]} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.centeredContent}>
            <View style={styles.choiceCard}>
              <View style={styles.choiceButtons}>
                <TouchableOpacity
                  style={styles.choiceButton}
                  onPress={() => handleChoice(currentChoice.storyKey, currentChoice.option1)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.choiceButtonText}>{currentChoice.option1}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.choiceButton}
                  onPress={() => handleChoice(currentChoice.storyKey, currentChoice.option2)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.choiceButtonText}>{currentChoice.option2}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Story Screens (11-17)
  if (currentScreen >= 11 && currentScreen <= 17) {
    const storyText = getStoryText(currentScreen);
    const isTitle = currentScreen === 12;
    const isFinal = currentScreen === 17;

    return (
      <View style={styles.container}>
        <View style={styles.storyBackground}>
          <View style={styles.storyBackgroundPattern} />
        </View>

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
            <View style={styles.storyCard}>
              {isTitle ? (
                <View style={styles.storyTitleContainer}>
                  <Text style={styles.storyTitle}>{storyText}</Text>
                  <View style={styles.titleUnderline} />
                </View>
              ) : (
                <View style={styles.storyTextContainer}>
                  <Text style={styles.storyText}>{storyText}</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinueStory}
                activeOpacity={0.8}
              >
                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.continueButtonText}>
                    {isFinal ? 'Own It' : 'Continue'}
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

  // Reflection Screen (now screen 18)
  if (currentScreen === 18) {
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
            <View style={styles.reflectionCard}>
              <View style={styles.reflectionIconContainer}>
                <Image
                  source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                  style={styles.heroImage}
                />
              </View>

              <Text style={styles.reflectionTitle}>Building Your Dreamer Muscle</Text>

              <Text style={styles.reflectionText}>
                Perhaps this doesn't sound possible? But the goal is to give yourself permission to turn up as the expansive dreamer.
              </Text>

              <Text style={styles.reflectionText}>
                This is just an exercise of building the muscle to dream about something other than booking your dream job.
              </Text>

              <Text style={styles.reflectionText}>
                Every time you allow yourself to imagine a different future, you're strengthening that expansive dreamer within you.
              </Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinueStory}
                activeOpacity={0.8}
              >
                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.continueButtonText}>
                    Continue
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

  // Final Screen (now screen 19) with End of Day Journal
  if (currentScreen === 19) {
    return (
      <View style={styles.container}>
        <View style={styles.storyBackground}>
          <View style={styles.storyBackgroundPattern} />
        </View>

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
            <View style={styles.storyCard}>
              <Image
                source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                style={styles.heroImage}
              />
              <View style={styles.storyTextContainer}>
                <Text style={styles.storyText}>
                  Take a moment to notice how you're feeling right now. Are you excited? Skeptical? Overwhelmed?
                </Text>

                <Text style={styles.storyText}>
                  If any part of you thought "this could never be me" - that sounds like an unhelpful story that keeps you stuck.
                </Text>

                <Text style={styles.storyText}>
                  These mindset shifts are exactly what we explore in our resources, helping you rewrite those limiting stories.
                </Text>
              </View>

              {/* Ebook Callout */}
              <View style={styles.ebookCard}>
                <Text style={styles.ebookTitle}>Explore Mindset Tools</Text>
                <Text style={styles.ebookDescription}>
                  If you'd like to dive deeper into shifting those limiting beliefs, our book "How to Pivot" offers practical strategies that might help.
                </Text>
                <TouchableOpacity style={styles.ebookButton} onPress={handleOpenEbook}>
                  <View style={[styles.ebookButtonContent, { backgroundColor: '#647C90' }]}>
                    <Text style={styles.ebookButtonText}>Learn More</Text>
                    <ChevronRight size={16} color="#E2DED0" />
                  </View>
                </TouchableOpacity>
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

              <Text style={styles.alternativeClosing}>
                See you for more tomorrow
              </Text>

              <TouchableOpacity
                style={styles.completeButton}
                onPress={onComplete}
                activeOpacity={0.8}
              >
                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                  <Text style={styles.completeButtonText}>Mark As Complete</Text>
                  <ChevronRight size={16} color="#E2DED0" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DED0',
  },
  storyBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  storyBackgroundPattern: {
    flex: 1,
    opacity: 0.03,
    backgroundColor: '#928490',
    transform: [{ rotate: '45deg' }, { scale: 1.5 }],
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
  content: {
    paddingBottom: 30,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height - 200, // Ensure content takes most of the screen height
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
    marginBottom: 20,
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
  choiceButtons: {
    gap: 20,
  },
  choiceButton: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 80,
    justifyContent: 'center',
  },
  choiceButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
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
  reflectionIconContainer: {
    marginBottom: 30,
  },
  reflectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '700',
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
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600',
  },
  // Ebook Styles
  ebookCard: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#928490',
    width: '100%',
  },
  ebookTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
  },
  ebookDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ebookButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  ebookButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#647C90',
  },
  ebookButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#E2DED0',
    marginRight: 8,
    fontWeight: '600',
  },
  storyTitleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  storyTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 32,
    color: '#647C90',
    textAlign: 'center',
    lineHeight: 38,
    fontWeight: '700',
  },
  titleUnderline: {
    height: 4,
    width: 60,
    backgroundColor: '#928490',
    borderRadius: 2,
    marginTop: 16,
    opacity: 0.6,
  },
  storyTextContainer: {
    width: '100%',
    marginBottom: 32,
  },
  storyText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 28,
    marginTop: 10,
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
    backgroundColor: '#928490',
    minWidth: width * 0.5,
  },
  completeButtonText: {
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
    marginTop: 0,
    fontWeight: '600',
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#647C90',
    borderWidth: 2,
  },
  // New Happy Trails Course Styles
  courseCard: {
    backgroundColor: 'rgba(100, 124, 144, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#647C90',
    width: '100%',
  },
  courseTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
  },
  courseDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  courseButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  courseButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#647C90',
  },
  courseButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#E2DED0',
    marginRight: 8,
    fontWeight: '600',
  },
  // YouTube Thumbnail Styles
  videoThumbnailContainer: {
    width: '100%',
    marginBottom: 25,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF0000', // YouTube red
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 4, // Slight offset to center the play icon
  },
  // Journal Section Styles
  journalSection: {
    width: '100%',
    marginBottom: 24,
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