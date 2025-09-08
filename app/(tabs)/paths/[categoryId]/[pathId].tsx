import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ChevronRight, CircleCheck as CheckCircle, Circle, Calendar, Clock } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPathById } from '@/data/categories';
import SkillsQuiz from '@/components/mindset-wellness/discover-your-dream-life/SkillsQuiz';
import LeadershipExperience from '@/components/career-transitions/skills-assessment/LeadershipExperience';
import MythBusterGame from '@/components/mindset-wellness/discover-your-dream-life/MythBusterGame';
import RoleplayScenario from '@/components/mindset-wellness/discover-your-dream-life/RoleplayScenario';
import DreamBiggerGame from '@/components/mindset-wellness/discover-your-dream-life/DreamBiggerGame';
import ValuesDiscovery from '@/components/mindset-wellness/discover-your-dream-life/ValuesDiscovery';
import FlipTheScript from '@/components/mindset-wellness/discover-your-dream-life/FlipTheScript';
import VoiceMessage from '@/components/mindset-wellness/discover-your-dream-life/VoiceMessage';
import ExpandYourHorizons from '@/components/career-transitions/skills-assessment/discover-your-direction/ExpandYourHorizons';
import WhatEnergizesYou from '@/components/career-transitions/skills-assessment/discover-your-direction/WhatEnergizesYou';
import SparkCuriosity from '@/components/career-transitions/skills-assessment/discover-your-direction/SparkCuriosity';
import TryItOn from '@/components/career-transitions/skills-assessment/discover-your-direction/TryItOn';
import BreakOutOfYourBubble from '@/components/career-transitions/skills-assessment/discover-your-direction/BreakOutOfYourBubble';
import YourFirstExperiment from '@/components/career-transitions/skills-assessment/discover-your-direction/YourFirstExperiment';
import DealBreakerGame from '@/components/career-transitions/skills-assessment/discover-your-direction/DealBreakerGame';
import StartWithYourStrengths from '@/components/career-transitions/skills-assessment/upskilling-pathfinder/StartWithYourStrengths';
import FindYourLearningStyle from '@/components/career-transitions/skills-assessment/upskilling-pathfinder/FindYourLearningStyle';
import WorkBackwards from '@/components/career-transitions/skills-assessment/upskilling-pathfinder/WorkBackwards';
import YourHiddenNetwork from '@/components/career-transitions/skills-assessment/upskilling-pathfinder/YourHiddenNetwork';
import OvercomeAnalysisParalysis from '@/components/career-transitions/skills-assessment/upskilling-pathfinder/OvercomeAnalysisParalysis';
import EmbraceTheBeginner from '@/components/career-transitions/skills-assessment/upskilling-pathfinder/EmbraceTheBeginner';
import JustStart from '@/components/career-transitions/skills-assessment/upskilling-pathfinder/JustStart';
import ConfidenceGap from '@/components/career-transitions/skills-assessment/prep-your-pivot/ConfidenceGap';
import CureImposterSyndrome from '@/components/career-transitions/skills-assessment/prep-your-pivot/CureImposterSyndrome';

export default function PathDetailScreen() {
  const router = useRouter();
  const { categoryId, pathId } = useLocalSearchParams<{ categoryId: string; pathId: string }>();
  const [progress, setProgress] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [reflectionText, setReflectionText] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showLeadershipExperience, setShowLeadershipExperience] = useState(false);
  const [showMythBuster, setShowMythBuster] = useState(false);
  const [showRoleplay, setShowRoleplay] = useState(false);
  const [showDreamBigger, setShowDreamBigger] = useState(false);
  const [showValuesDiscovery, setShowValuesDiscovery] = useState(false);
  const [showExpandYourHorizons, setShowExpandYourHorizons] = useState(false);
  const [showWhatEnergizesYou, setShowWhatEnergizesYou] = useState(false);
  const [showSparkCuriosity, setShowSparkCuriosity] = useState(false);
  const [showTryItOn, setShowTryItOn] = useState(false);
  const [showBreakOutOfYourBubble, setShowBreakOutOfYourBubble] = useState(false);
  const [showYourFirstExperiment, setShowYourFirstExperiment] = useState(false);
  const [showDealBreakerGame, setShowDealBreakerGame] = useState(false);
  const [showStartWithYourStrenghts, setShowStartWithYourStrengths] = useState(false);
  const [showVoiceMessage, setShowVoiceMessage] = useState(false);
  const [showFindYourLearningStyle, setShowFindYourLearningStyle] = useState(false);
  const [showWorkBackwards, setShowWorkBackwards] = useState(false);
  const [showYourHiddenNetwork, setShowYourHiddenNetwork] = useState(false);
  const [showOvercomeAnalysisParalysis, setShowOvercomeAnalysisParalysis] = useState(false);
  const [showEmbraceTheBeginner, setShowEmbraceTheBeginner] = useState(false);
  const [showJustStart, setShowJustStart] = useState(false);
  const [showConfidenceGap, setShowConfidenceGap] = useState(false);
  const [showCureImposterSyndrome, setShowCureImposterSyndrome] = useState(false);

  const [quizResult, setQuizResult] = useState<any>(null);
  const [leadershipResult, setLeadershipResult] = useState<any>(null);
  const [mythBusterResult, setMythBusterResult] = useState<boolean>(false);
  const [roleplayResult, setRoleplayResult] = useState<boolean>(false);
  const [dreamBiggerResult, setDreamBiggerResult] = useState<boolean>(false);
  const [valuesResult, setValuesResult] = useState<any>(null);
  const [WhatEnergizesYouResult, setWhatEnergizesYouResult] = useState<boolean>(false);
  const [ExpandYourHorizonsResult, setExpandYourHorizonsResult] = useState<boolean>(false);
  const [sparkCuriosityResult, setSparkCuriosityResult] = useState<any>(null);
  const [TryItOnResult, setTryItOnResult] = useState<any>(null);
  const [BreakOutOfYourBubbleResult, setBreakOutOfYourBubbleResult] = useState<any>(null);
  const [showFlipScript, setShowFlipScript] = useState(false);
  const [flipScriptResult, setFlipScriptResult] = useState<boolean>(false);
  const [voiceMessageResult, setVoiceMessageResult] = useState<boolean>(false);
  const [YourFirstExperimentResult, setYourFirstExperimentResult] = useState<any>(null);
  const [DealBreakerGameResult, setDealBreakerGameResult] = useState<any>(null);
  const [StartWithYourStrengthsResult, setStartWithYourStrengthsResult] = useState<any>(null);
  const [FindYourLearningStyleResult, setFindYourLearningStyleResult] = useState<any>(null);
  const [WorkBackwardsResult, setWorkBackwardsResult] = useState<any>(null);
  const [YourHiddenNetworkResult, setYourHiddenNetworkResult] = useState<any>(null);
  const [OvercomeAnalysisParalysisResult, setOvercomeAnalysisParalysisResult] = useState<any>(null);
  const [EmbraceTheBeginnerResult, setEmbraceTheBeginnerResult] = useState<any>(null);
  const [JustStartResult, setJustStartResult] = useState<any>(null);
  const [ConfidenceGapResult, setConfidenceGapResult] = useState<any>(null);
  const [CureImposterSyndromeResult, setCureImposterSyndromeResult] = useState<any>(null);



  const path = getPathById(categoryId!, pathId!);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
      // Always reset to timeline view when navigating to path
      setShowQuiz(false);
      setShowLeadershipExperience(false);
      setShowMythBuster(false);
      setShowRoleplay(false);
      setShowDreamBigger(false);
      setShowValuesDiscovery(false);
      setShowExpandYourHorizons(false);
      setShowWhatEnergizesYou(false);
      setShowSparkCuriosity(false);
      setShowTryItOn(false);
      setShowBreakOutOfYourBubble(false);
      setShowFlipScript(false);
      setShowVoiceMessage(false);
      setShowDealBreakerGame(false);
      setShowYourFirstExperiment(false);
      setShowStartWithYourStrengths(false);
      setShowFindYourLearningStyle(false);
      setShowWorkBackwards(false);
      setShowYourHiddenNetwork(false);
      setShowOvercomeAnalysisParalysis(false);
      setShowEmbraceTheBeginner(false);
      setShowJustStart(false);
      setShowConfidenceGap(false);
      setShowCureImposterSyndrome(false);
    }, [categoryId, pathId])
  );

  const loadProgress = async () => {
    try {
      const progressKey = `${categoryId}_${pathId}`;
      const savedProgress = await AsyncStorage.getItem('pathProgress');
      const savedCurrentDay = await AsyncStorage.getItem(`currentDay_${progressKey}`);

      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        const pathProgress = progressData[progressKey] || 0;
        setProgress(pathProgress);

        // Load saved current day or calculate from progress
        if (savedCurrentDay) {
          setCurrentDay(parseInt(savedCurrentDay));
        } else {
          setCurrentDay(Math.min(pathProgress + 1, path?.days?.length || 1));
        }
      } else {
        // No progress saved, reset to defaults
        setProgress(0);
        setCurrentDay(1);
      }

      // Load reflection for current day
      const currentDayToUse = savedCurrentDay ? parseInt(savedCurrentDay) : 1;
      const savedReflection = await AsyncStorage.getItem(`reflection_${progressKey}_${currentDayToUse}`);
      if (savedReflection) {
        setReflectionText(savedReflection);
      } else {
        setReflectionText('');
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      // Reset to defaults on error
      setProgress(0);
      setCurrentDay(1);
      setReflectionText('');
    }
  };

  const saveProgress = async (newProgress: number) => {
    try {
      const progressKey = `${categoryId}_${pathId}`;
      const savedProgress = await AsyncStorage.getItem('pathProgress');
      const progressData = savedProgress ? JSON.parse(savedProgress) : {};

      progressData[progressKey] = newProgress;
      await AsyncStorage.setItem('pathProgress', JSON.stringify(progressData));

      // Save current day
      const newCurrentDay = Math.min(newProgress + 1, path?.days?.length || 1);
      await AsyncStorage.setItem(`currentDay_${progressKey}`, newCurrentDay.toString());

      // Update streak
      await updateStreak();

      setProgress(newProgress);
      setCurrentDay(newCurrentDay);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const updateStreak = async () => {
    try {
      const today = new Date().toDateString();
      const lastActiveDate = await AsyncStorage.getItem('lastActiveDate');
      const currentStreak = await AsyncStorage.getItem('streakDays');

      if (lastActiveDate !== today) {
        let newStreak = 1;

        if (lastActiveDate) {
          const lastDate = new Date(lastActiveDate);
          const todayDate = new Date(today);
          const diffTime = todayDate.getTime() - lastDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak = parseInt(currentStreak || '0') + 1;
          }
        }

        await AsyncStorage.setItem('streakDays', newStreak.toString());
        await AsyncStorage.setItem('lastActiveDate', today);
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const saveReflection = async () => {
    try {
      const progressKey = `${categoryId}_${pathId}`;
      await AsyncStorage.setItem(`reflection_${progressKey}_${currentDay}`, reflectionText);
    } catch (error) {
      console.error('Error saving reflection:', error);
    }
  };

  const handleCompleteDay = async () => {
    await saveReflection();
    const newProgress = Math.max(progress, currentDay);
    await saveProgress(newProgress);

    if (currentDay < (path?.totalDays || 1)) {
      setCurrentDay(currentDay + 1);
      setReflectionText('');
    }
  };

  const handleDayPress = async (dayNumber: number) => {
    if (dayNumber <= progress + 1) {
      const dayData = path.days[dayNumber - 1];

      // Save current day when user selects it
      const progressKey = `${categoryId}_${pathId}`;
      await AsyncStorage.setItem(`currentDay_${progressKey}`, dayNumber.toString());
      setCurrentDay(dayNumber);

      // Navigate directly to interactive experience for any accessible day
      if (dayData.hasQuiz) {
        setShowQuiz(true);
      } else if (dayData.hasLeadershipExperience) {
        setShowLeadershipExperience(true);
      } else if (dayData.hasMythBuster) {
        setShowMythBuster(true);
      } else if (dayData.hasRoleplay) {
        setShowRoleplay(true);
      } else if (dayData.hasDreamBigger) {
        setShowDreamBigger(true);
      } else if (dayData.hasValuesDiscovery) {
        setShowValuesDiscovery(true);
      } else if (dayData.hasExpandYourHorizons) {
        setShowExpandYourHorizons(true);
      } else if (dayData.hasWhatEnergizesYou) {
        setShowWhatEnergizesYou(true);
      } else if (dayData.hasSparkCuriosity) {
        setShowSparkCuriosity(true);
      } else if (dayData.hasTryItOn) {
        setShowTryItOn(true);
      } else if (dayData.hasDealBreakerGame) {
        setShowDealBreakerGame(true);
      } else if (dayData.hasBreakOutOfYourBubble) {
        setShowBreakOutOfYourBubble(true);
      } else if (dayData.hasFlipScript) {
        setShowFlipScript(true);
      } else if (dayData.hasVoiceMessage) {
        setShowVoiceMessage(true);
      } else if (dayData.hasYourFirstExperiment) {
        setCurrentDay(dayNumber);
        setShowYourFirstExperiment(true);
      } else if (dayData.hasStartWithYourStrengths) {
        setCurrentDay(dayNumber);
        setShowStartWithYourStrengths(true);
      } else if (dayData.hasFindYourLearningStyle) {
        setCurrentDay(dayNumber);
        setShowFindYourLearningStyle(true);
      } else if (dayData.hasWorkBackwards) {
        setCurrentDay(dayNumber);
        setShowWorkBackwards(true);
      } else if (dayData.hasYourHiddenNetwork) {
        setCurrentDay(dayNumber);
        setShowYourHiddenNetwork(true);
      } else if (dayData.hasOvercomeAnalysis) {
        setCurrentDay(dayNumber);
        setShowOvercomeAnalysisParalysis(true);
      } else if (dayData.hasEmbraceTheBeginner) {
        setCurrentDay(dayNumber);
        setShowEmbraceTheBeginner(true);
      } else if (dayData.hasJustStart) {
        setCurrentDay(dayNumber);
        setShowJustStart(true);
      } else if (dayData.hasConfidenceGap) {
        setCurrentDay(dayNumber);
        setShowConfidenceGap(true);
      } else if (dayData.hasCureImposterSyndrome) {
        setCurrentDay(dayNumber);
        setShowCureImposterSyndrome(true);
      }
    }
  };

  const handleBackPress = () => {
    router.push(`/(tabs)/categories/${categoryId}`);
  };

  const handleQuizComplete = (result: any) => {
    setQuizResult(result);
    setShowQuiz(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleLeadershipComplete = (result: any) => {
    setLeadershipResult(result);
    setShowLeadershipExperience(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleMythBusterComplete = () => {
    setMythBusterResult(true);
    setShowMythBuster(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleRoleplayComplete = () => {
    setRoleplayResult(true);
    setShowRoleplay(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleDreamBiggerComplete = () => {
    setDreamBiggerResult(true);
    setShowDreamBigger(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleValuesComplete = (result: any) => {
    setValuesResult(result);
    setShowValuesDiscovery(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleExpandYourHorizonsComplete = () => {
    setExpandYourHorizonsResult(true);
    setShowExpandYourHorizons(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleWhatEnergizesYouComplete = () => {
    setWhatEnergizesYouResult(true);
    setShowWhatEnergizesYou(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleSparkCuriosityComplete = (result: any) => {
    setSparkCuriosityResult(result);
    setShowSparkCuriosity(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleTryItOnComplete = (result: any) => {
    setTryItOnResult(result);
    setShowTryItOn(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleBreakOutOfYourBubbleComplete = (result: any) => {
    setBreakOutOfYourBubbleResult(result);
    setShowBreakOutOfYourBubble(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleFlipScriptComplete = () => {
    setFlipScriptResult(true);
    setShowFlipScript(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleVoiceMessageComplete = () => {
    setVoiceMessageResult(true);
    setShowVoiceMessage(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleDealBreakerGameComplete = () => {
    setDealBreakerGameResult(true);
    setShowDealBreakerGame(false);
    // Mark day as completed
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleYourFirstExperimentComplete = (result: any) => {
    setYourFirstExperimentResult(result);
    setShowYourFirstExperiment(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleStartWithYourStrengthsComplete = (result: any) => {
    setStartWithYourStrengthsResult(result);
    setShowStartWithYourStrengths(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleFindYourLearningStyleComplete = (result: any) => {
    setFindYourLearningStyleResult(result);
    setShowFindYourLearningStyle(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleWorkBackwardsComplete = (result: any) => {
    setWorkBackwardsResult(result);
    setShowWorkBackwards(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleYourHiddenNetworkComplete = (result: any) => {
    setYourHiddenNetworkResult(result);
    setShowYourHiddenNetwork(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleOvercomeAnalysisParalysisComplete = (result: any) => {
    setOvercomeAnalysisParalysisResult(result);
    setShowOvercomeAnalysisParalysis(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleEmbraceTheBeginnerComplete = (result: any) => {
    setEmbraceTheBeginnerResult(result);
    setShowEmbraceTheBeginner(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleJustStartComplete = (result: any) => {
    setJustStartResult(result);
    setShowJustStart(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleConfidenceGapComplete = (result: any) => {
    setConfidenceGapResult(result);
    setShowConfidenceGap(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleCureImposterSyndromeComplete = (result: any) => {
    setCureImposterSyndromeResult(result);
    setShowCureImposterSyndrome(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  if (!path) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Path not found</Text>
      </View>
    );
  }

  if (showQuiz) {
    return <SkillsQuiz onComplete={handleQuizComplete} onBack={() => setShowQuiz(false)} />;
  }

  if (showLeadershipExperience) {
    return <LeadershipExperience onComplete={handleLeadershipComplete} />;
  }

  if (showDealBreakerGame) {
    return <DealBreakerGame onComplete={handleDealBreakerGameComplete} />;
  }

  if (showMythBuster) {
    return <MythBusterGame onComplete={handleMythBusterComplete} onBack={() => setShowMythBuster(false)} />;
  }

  if (showRoleplay) {
    return <RoleplayScenario onComplete={handleRoleplayComplete} onBack={() => setShowRoleplay(false)} />;
  }

  if (showDreamBigger) {
    return <DreamBiggerGame onComplete={handleDreamBiggerComplete} onBack={() => setShowDreamBigger(false)} />;
  }

  if (showValuesDiscovery) {
    return <ValuesDiscovery onComplete={handleValuesComplete} onBack={() => setShowValuesDiscovery(false)} />;
  }

  if (showExpandYourHorizons) {
    return <ExpandYourHorizons onComplete={handleExpandYourHorizonsComplete} onBack={() => setShowExpandYourHorizons(false)} />;
  }

  if (showWhatEnergizesYou) {
    return <WhatEnergizesYou onComplete={handleWhatEnergizesYouComplete} onBack={() => setShowWhatEnergizesYou(false)} />;
  }

  if (showSparkCuriosity) {
    return <SparkCuriosity onComplete={handleSparkCuriosityComplete} onBack={() => setShowSparkCuriosity(false)} />;
  }

  if (showTryItOn) {
    return <TryItOn onComplete={handleTryItOnComplete} onBack={() => setShowTryItOn(false)} />;
  }

  if (showBreakOutOfYourBubble) {
    return <BreakOutOfYourBubble onComplete={handleBreakOutOfYourBubbleComplete} onBack={() => setShowBreakOutOfYourBubble(false)} />;
  }

  if (showFlipScript) {
    return <FlipTheScript onComplete={handleFlipScriptComplete} onBack={() => setShowFlipScript(false)} />;
  }

  if (showVoiceMessage) {
    return <VoiceMessage onComplete={handleVoiceMessageComplete} />;
  }

  if (showYourFirstExperiment) {
    return <YourFirstExperiment onComplete={handleYourFirstExperimentComplete} />;
  }

  if (showStartWithYourStrenghts) {
    return <StartWithYourStrengths onComplete={handleStartWithYourStrengthsComplete} />;
  }

  if (showFindYourLearningStyle) {
    return <FindYourLearningStyle onComplete={handleFindYourLearningStyleComplete} />;
  }

  if (showWorkBackwards) {
    return <WorkBackwards onComplete={handleWorkBackwardsComplete} />;
  }

  if (showYourHiddenNetwork) {
    return <YourHiddenNetwork onComplete={handleYourHiddenNetworkComplete} />;
  }

  if (showOvercomeAnalysisParalysis) {
    return <OvercomeAnalysisParalysis onComplete={handleOvercomeAnalysisParalysisComplete} />;
  }

  if (showEmbraceTheBeginner) {
    return <EmbraceTheBeginner onComplete={handleEmbraceTheBeginnerComplete} />;
  }

  if (showJustStart) {
    return <JustStart onComplete={handleJustStartComplete} />;
  }

  if (showConfidenceGap) {
    return <ConfidenceGap onComplete={handleConfidenceGapComplete} />;
  }

  if (showCureImposterSyndrome) {
    return <CureImposterSyndrome onComplete={handleCureImposterSyndromeComplete} />;
  }

  const progressPercentage = Math.round((progress / path.days.length) * 100);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]} // This makes the first child (header) sticky
    >
      {/* Header - This will now stick to the top when scrolling */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={28} color="#E2DED0" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.pathTitle}>{path.title}</Text>
          </View>
          {/* Empty view to balance the flex row */}
          <View style={styles.backButton} />
        </View>
      </View>

      {/* Vertical Timeline */}
      <View style={styles.timelineContainer}>
        <View style={styles.timeline}>
          {path.days.map((day, index) => {
            const dayNumber = index + 1;
            const isCompleted = dayNumber <= progress;
            const isAccessible = dayNumber <= progress + 1;

            return (
              <View key={dayNumber} style={styles.timelineItem}>
                <View style={styles.timelineConnector}>
                  <View style={[
                    styles.timelineNode,
                    isCompleted && styles.completedNode,
                    !isAccessible && styles.lockedNode,
                  ]}>
                    {isCompleted ? (
                      <CheckCircle size={20} color="#E2DED0" />
                    ) : (
                      <Circle size={20} color={isAccessible ? "#647C90" : "#928490"} />
                    )}
                  </View>
                  {index < path.days.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      isCompleted && styles.completedLine,
                    ]} />
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.timelineContent,
                    !isAccessible && styles.lockedContent,
                  ]}
                  onPress={() => handleDayPress(dayNumber)}
                  disabled={!isAccessible}
                  activeOpacity={0.8}
                >
                  <View style={styles.dayCard}>
                    <Text style={[
                      styles.dayNumber,
                      isCompleted && styles.completedDayNumber,
                      !isAccessible && styles.lockedDayNumber,
                    ]}>
                      Day {dayNumber}
                    </Text>
                    <Text style={[
                      styles.dayTitle,
                      isCompleted && styles.completedDayTitle,
                      !isAccessible && styles.lockedDayTitle,
                    ]}>
                      {day.title}
                    </Text>
                    {isAccessible && (
                      <View style={styles.dayAction}>
                        <Text style={[
                          styles.dayActionText,
                          isCompleted && styles.completedActionText,
                        ]}>
                          {isCompleted ? 'Completed' : 'Start'}
                        </Text>
                        {!isCompleted && <ChevronRight size={16} color="#647C90" />}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DED0',
  },
  errorText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#746C70',
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#647C90',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  headerContent: {
    alignItems: 'center',
  },
  pathTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#E2DED0',
    textAlign: 'center',
    marginBottom: 6,
  },
  pathSubtitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: 'rgba(226, 222, 208, 0.8)',
    textAlign: 'center',
    marginBottom: 10,
  },
  pathDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: 'rgba(226, 222, 208, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(226, 222, 208, 0.3)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E2DED0',
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: 'rgba(226, 222, 208, 0.8)',
  },
  timelineContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  timelineTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 22,
    color: '#4E4F50',
    marginBottom: 25,
    textAlign: 'center',
  },
  timeline: {
    // No specific styles needed
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineConnector: {
    alignItems: 'center',
    marginRight: 20,
  },
  timelineNode: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(146, 132, 144, 0.2)',
  },
  completedNode: {
    backgroundColor: '#928490',
    borderColor: '#928490',
  },
  lockedNode: {
    backgroundColor: 'rgba(146, 132, 144, 0.05)',
    borderColor: 'rgba(146, 132, 144, 0.1)',
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: 'rgba(146, 132, 144, 0.2)',
    marginTop: 8,
  },
  completedLine: {
    backgroundColor: '#928490',
  },
  timelineContent: {
    flex: 1,
  },
  lockedContent: {
    opacity: 0.5,
  },
  dayCard: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(146, 132, 144, 0.2)',
  },
  dayNumber: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#647C90',
    marginBottom: 4,
  },
  completedDayNumber: {
    color: '#928490',
  },
  lockedDayNumber: {
    color: '#928490',
  },
  dayTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 16,
    color: '#4E4F50',
    marginBottom: 8,
    lineHeight: 22,
  },
  completedDayTitle: {
    color: '#4E4F50',
  },
  lockedDayTitle: {
    color: '#928490',
  },
  dayAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  dayActionText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#647C90',
    marginRight: 4,
  },
  completedActionText: {
    color: '#928490',
  },
  dayNavigation: {
    paddingVertical: 20,
    paddingLeft: 20,
    backgroundColor: '#E2DED0',
  },
  dayNavTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#4E4F50',
    marginBottom: 15,
  },
  dayScrollView: {
    flexDirection: 'row',
  },
  dayButton: {
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  completedDayButton: {
    backgroundColor: '#928490',
  },
  currentDayButton: {
    backgroundColor: '#647C90',
    borderColor: '#4E4F50',
  },
  lockedDayButton: {
    backgroundColor: 'rgba(146, 132, 144, 0.05)',
    opacity: 0.5,
  },
  dayButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#746C70',
    marginLeft: 6,
  },
  completedDayText: {
    color: '#E2DED0',
  },
  currentDayText: {
    color: '#E2DED0',
  },
  lockedDayText: {
    color: '#928490',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dayInfo: {
    flex: 1,
  },
  daySubtitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#647C90',
  },
  dayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayMetaText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#928490',
    marginLeft: 4,
  },
  contentCard: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  contentText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 24,
    marginBottom: 15,
  },
  calloutCard: {
    backgroundColor: 'rgba(100, 124, 144, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  calloutText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
    lineHeight: 20,
  },
  interactiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#647C90',
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
  },
  interactiveButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#E2DED0',
    marginRight: 8,
  },
  resultCard: {
    backgroundColor: 'rgba(90, 125, 123, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginTop: 15,
  },
  resultTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#4E4F50',
    marginBottom: 8,
  },
  resultDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#746C70',
    lineHeight: 20,
  },
  reflectionCard: {
    backgroundColor: 'rgba(116, 108, 112, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  reflectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#4E4F50',
    marginBottom: 10,
  },
  reflectionPrompt: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
    lineHeight: 20,
    marginBottom: 15,
  },
  reflectionInput: {
    backgroundColor: '#E2DED0',
    borderRadius: 8,
    padding: 15,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(146, 132, 144, 0.2)',
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  completeButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    marginLeft: 8,
  },
  nextDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100, 124, 144, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#647C90',
  },
  nextDayButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#647C90',
    marginRight: 8,
  },
});