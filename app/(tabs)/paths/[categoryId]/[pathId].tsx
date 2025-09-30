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
import TalkTheTalk from '@/components/career-transitions/skills-assessment/prep-your-pivot/TalkTheTalk';
import DanceSkillMatch from '@/components/career-transitions/skills-assessment/prep-your-pivot/DanceSkillMatch';
import LinkedinUpgrade from '@/components/career-transitions/skills-assessment/prep-your-pivot/LinkedinUpgrade';
import WhoWouldYouHire from '@/components/career-transitions/skills-assessment/prep-your-pivot/WhoWouldYouHire';
import MakeYourPlan from '@/components/career-transitions/skills-assessment/prep-your-pivot/MakeYourPlan';
import BeyondYourIdentity from '@/components/mindset-wellness/mindset-shifts/BeyondYourIdentity';
import LettingGoOfValidation from '@/components/mindset-wellness/mindset-shifts/LettingGoOfValidation';
import Grief from '@/components/mindset-wellness/mindset-shifts/Grief';
import DecisionMaking from '@/components/mindset-wellness/mindset-shifts/DecisionMaking';
import SunkCostFallacy from '@/components/mindset-wellness/mindset-shifts/SunkCostFallacy';
import MissingDance from '@/components/mindset-wellness/mindset-shifts/MissingDance';
import IgniteYourCuriosity from '@/components/mindset-wellness/mindset-shifts/IgniteYourCuriosity';
import EnergyAudit from '@/components/mindset-wellness/work-life-balance/EnergyAudit';
import HobbyHunting from '@/components/mindset-wellness/work-life-balance/HobbyHunting';
import MoreThanWork from '@/components/mindset-wellness/work-life-balance/MoreThanWork';
import BoundariesCheck from '@/components/mindset-wellness/work-life-balance/BoundariesCheck';
import TimeMapping from '@/components/mindset-wellness/work-life-balance/TimeMapping';
import ANewYou from '@/components/mindset-wellness/work-life-balance/ANewYou';
import ReflectAndAdjust from '@/components/mindset-wellness/work-life-balance/ReflectAndAdjust';
import StarvingArtist from '@/components/finance/money-mindsets/StarvingArtist';
import KnowYourValue from '@/components/finance/money-mindsets/KnowYourValue';
import Generosity from '@/components/finance/money-mindsets/Generosity';
import ShameAroundMoney from '@/components/finance/money-mindsets/ShameAroundMoney';
import ScarcityVsAbundance from '@/components/finance/money-mindsets/ScarcityVsAbundance';
import MoreMoneyMoreHeadroom from '@/components/finance/money-mindsets/MoreMoneyMoreHeadroom';
import YourStartingLine from '@/components/finance/money-mindsets/YourStartingLine';
import GoalSetting from '@/components/finance/budgeting-for-dancers/GoalSetting';
import SpendingTemperatureCheck from '@/components/finance/budgeting-for-dancers/SpendingTemperatureCheck';
import BudgetingMethodsDecoded from '@/components/finance/budgeting-for-dancers/BudgetingMethodsDecoded';
import Emergency from '@/components/finance/budgeting-for-dancers/Emergency';
import MeetYourMustHaves from '@/components/finance/budgeting-for-dancers/MeetYourMustHaves';
import FeastOrFamine from '@/components/finance/budgeting-for-dancers/FeastOrFamine';
import SavingsSprint from '@/components/finance/budgeting-for-dancers/SavingsSprint';
import TamingYourDebt from '@/components/finance/financial-futureproofing/TamingYourDebt';
import SideHustleScoreCard from '@/components/finance/financial-futureproofing/SideHustleScoreCard';
import AskForMore from '@/components/finance/financial-futureproofing/AskForMore';
import TheTotalPackage from '@/components/finance/financial-futureproofing/TheTotalPackage';
import InvestmentInvestigations from '@/components/finance/financial-futureproofing/InvestmentInvestigation';
import LifestyleCreepRiskMeter from '@/components/finance/financial-futureproofing/LifestyleCreepRiskMeter';
import CelebrateTheWins from '@/components/finance/financial-futureproofing/CelebrateTheWins';

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
  const [showTalkTheTalk, setShowTalkTheTalk] = useState(false);
  const [showDanceSkillMatch, setShowDanceSkillMatch] = useState(false);
  const [showLinkedinUpgrade, setShowLinkedinUpgrade] = useState(false);
  const [showWhoWouldYouHire, setShowWhoWouldYouHire] = useState(false);
  const [showMakeYourPlan, setShowMakeYourPlan] = useState(false);
  const [showBeyondYourIdentity, setShowBeyondYourIdentity] = useState(false);
  const [showLettingGoOfValidation, setShowLettingGoOfValidation] = useState(false);
  const [showGrief, setShowGrief] = useState(false);
  const [showDecisionMaking, setShowDecisionMaking] = useState(false);
  const [showSunkCostFallacy, setShowSunkCostFallacy] = useState(false);
  const [showMissingDance, setShowMissingDance] = useState(false);
  const [showIgniteYourCuriosity, setShowIgniteYourCuriosity] = useState(false);
  const [showEnergyAudit, setShowEnergyAudit] = useState(false);
  const [showHobbyHunting, setShowHobbyHunting] = useState(false);
  const [showMoreThanWork, setShowMoreThanWork] = useState(false);
  const [showBoundariesCheck, setShowBoundariesCheck] = useState(false);
  const [showTimeMapping, setShowTimeMapping] = useState(false);
  const [showANewYou, setShowANewYou] = useState(false);
  const [showReflectAndAdjust, setShowReflectAndAdjust] = useState(false);
  const [showStarvingArtist, setShowStarvingArtist] = useState(false);
  const [showKnowYourValue, setShowKnowYourValue] = useState(false);
  const [showGenerosity, setShowGenerosity] = useState(false);
  const [showShameAroundMoney, setShowShameAroundMoney] = useState(false);
  const [showScarcityVsAbundance, setShowScarcityVsAbundance] = useState(false);
  const [showMoreMoneyMoreHeadroom, setShowMoreMoneyMoreHeadroom] = useState(false);
  const [showYourStartingLine, setShowYourStartingLine] = useState(false);
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [showSpendingTemperatureCheck, setShowSpendingTemperatureCheck] = useState(false);
  const [showBudgetingMethodsDecoded, setShowBudgetingMethodsDecoded] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showMeetYourMustHaves, setShowMeetYourMustHaves] = useState(false);
  const [showFeastOrFamine, setShowFeastOrFamine] = useState(false);
  const [showSavingsSprint, setShowSavingsSprint] = useState(false);
  const [showTamingYourDebt, setShowTamingYourDebt] = useState(false);
  const [showSideHustleScoreCard, setShowSideHustleScoreCard] = useState(false);
  const [showAskForMore, setShowAskForMore] = useState(false);
  const [showTheTotalPackage, setShowTheTotalPackage] = useState(false);
  const [showInvestmentInvestigations, setShowInvestmentInvestigations] = useState(false);
  const [showLifestyleCreepRiskMeter, setShowLifestyleCreepRiskMeter] = useState(false);
  const [showCelebrateTheWins, setShowCelebrateTheWins] = useState(false);

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
  const [TalkTheTalkResult, setTalkTheTalkResult] = useState<any>(null);
  const [DanceSkillMatchResult, setDanceSkillMatchResult] = useState<any>(null);
  const [LinkedinUpgradeResult, setLinkedinUpgradeResult] = useState<any>(null);
  const [WhoWouldYouHireResult, setWhoWouldYouHireResult] = useState<any>(null);
  const [MakeYourPlanResult, setMakeYourPlanResult] = useState<any>(null);
  const [BeyondYourIdentityResult, setBeyondYourIdentityResult] = useState<any>(null);
  const [LettingGoOfValidationResult, setLettingGoOfValidationResult] = useState<any>(null);
  const [GriefResult, setGriefResult] = useState<any>(null);
  const [DecisionMakingResult, setDecisionMakingResult] = useState<any>(null);
  const [SunkCostFallacyResult, setSunkCostFallacyResult] = useState<any>(null);
  const [MissingDanceResult, setMissingDanceResult] = useState<any>(null);
  const [IgniteYourCuriosityResult, setIgniteYourCuriosityResult] = useState<any>(null);
  const [EnergyAuditResult, setEnergyAuditResult] = useState<any>(null);
  const [HobbyHuntingResult, setHobbyHuntingResult] = useState<any>(null);
  const [MoreThanWorkResult, setMoreThanWorkResult] = useState<any>(null);
  const [BoundariesCheckResult, setBoundariesCheckResult] = useState<any>(null);
  const [TimeMappingResult, setTimeMappingResult] = useState<any>(null);
  const [ANewYouResult, setANewYouResult] = useState<any>(null);
  const [ReflectAndAdjustResult, setReflectAndAdjustResult] = useState<any>(null);
  const [StarvingArtistResult, setStarvingArtistResult] = useState<any>(null);
  const [KnowYourValueResult, setKnowYourValueResult] = useState<any>(null);
  const [GenerosityResult, setGenerosityResult] = useState<any>(null);
  const [ShameAroundMoneyResult, setShameAroundMoneyResult] = useState<any>(null);
  const [ScarcityVsAbundanceResult, setScarcityVsAbundanceResult] = useState<any>(null);
  const [MoreMoneyMoreHeadroomResult, setMoreMoneyMoreHeadroomResult] = useState<any>(null);
  const [YourStartingLineResult, setYourStartingLineResult] = useState<any>(null);
  const [GoalSettingResult, setGoalSettingResult] = useState<any>(null);
  const [SpendingTemperatureCheckResult, setSpendingTemperatureCheckResult] = useState<any>(null);
  const [BudgetingMethodsDecodedResult, setBudgetingMethodsDecodedResult] = useState<any>(null);
  const [EmergencyResult, setEmergencyResult] = useState<any>(null);
  const [MeetYourMustHavesResult, setMeetYourMustHavesResult] = useState<any>(null);
  const [FeastOrFamineResult, setFeastOrFamineResult] = useState<any>(null);
  const [SavingsSprintResult, setSavingsSprintResult] = useState<any>(null);
  const [TamingYourDebtResult, setTamingYourDebtResult] = useState<any>(null);
  const [SideHustleScoreCardResult, setSideHustleScoreCardResult] = useState<any>(null);
  const [AskForMoreResult, setAskForMoreResult] = useState<any>(null);
  const [TheTotalPackageResult, setTheTotalPackageResult] = useState<any>(null);
  const [InvestmentInvestigationsResult, setInvestmentInvestigationsResult] = useState<any>(null);
  const [LifestyleCreepRiskMeterResult, setLifestyleCreepRiskMeterResult] = useState<any>(null);
  const [CelebrateTheWinsResult, setCelebrateTheWinsResult] = useState<any>(null);

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
      setShowTalkTheTalk(false);
      setShowDanceSkillMatch(false);
      setShowLinkedinUpgrade(false);
      setShowWhoWouldYouHire(false);
      setShowMakeYourPlan(false);
      setShowBeyondYourIdentity(false);
      setShowLettingGoOfValidation(false);
      setShowGrief(false);
      setShowDecisionMaking(false);
      setShowSunkCostFallacy(false);
      setShowMissingDance(false);
      setShowIgniteYourCuriosity(false);
      setShowEnergyAudit(false);
      setShowHobbyHunting(false);
      setShowMoreThanWork(false);
      setShowBoundariesCheck(false);
      setShowTimeMapping(false);
      setShowANewYou(false);
      setShowReflectAndAdjust(false);
      setShowStarvingArtist(false);
      setShowKnowYourValue(false);
      setShowGenerosity(false);
      setShowShameAroundMoney(false);
      setShowScarcityVsAbundance(false);
      setShowMoreMoneyMoreHeadroom(false);
      setShowYourStartingLine(false);
      setShowGoalSetting(false);
      setShowSpendingTemperatureCheck(false);
      setShowBudgetingMethodsDecoded(false);
      setShowEmergency(false);
      setShowMeetYourMustHaves(false);
      setShowFeastOrFamine(false);
      setShowSavingsSprint(false);
      setShowTamingYourDebt(false);
      setShowSideHustleScoreCard(false);
      setShowAskForMore(false);
      setShowTheTotalPackage(false);
      setShowInvestmentInvestigations(false);
      setShowLifestyleCreepRiskMeter(false);
      setShowCelebrateTheWins(false);
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
      } else if (dayData.hasTalkTheTalk) {
        setCurrentDay(dayNumber);
        setShowTalkTheTalk(true);
      } else if (dayData.hasDanceSkillMatch) {
        setCurrentDay(dayNumber);
        setShowDanceSkillMatch(true);
      } else if (dayData.hasLinkedinUpgrade) {
        setCurrentDay(dayNumber);
        setShowLinkedinUpgrade(true);
      } else if (dayData.hasWhoWouldYouHire) {
        setCurrentDay(dayNumber);
        setShowWhoWouldYouHire(true);
      } else if (dayData.hasMakeYourPlan) {
        setCurrentDay(dayNumber);
        setShowMakeYourPlan(true);
      } else if (dayData.hasBeyondYourIdentity) {
        setCurrentDay(dayNumber);
        setShowBeyondYourIdentity(true);
      } else if (dayData.hasLettingGoOfValidation) {
        setCurrentDay(dayNumber);
        setShowLettingGoOfValidation(true);
      } else if (dayData.hasGrief) {
        setCurrentDay(dayNumber);
        setShowGrief(true);
      } else if (dayData.hasDecisionMaking) {
        setCurrentDay(dayNumber);
        setShowDecisionMaking(true);
      } else if (dayData.hasSunkCostFallacy) {
        setCurrentDay(dayNumber);
        setShowSunkCostFallacy(true);
      } else if (dayData.hasMissingDance) {
        setCurrentDay(dayNumber);
        setShowMissingDance(true);
      } else if (dayData.hasIgniteYourCuriosity) {
        setCurrentDay(dayNumber);
        setShowIgniteYourCuriosity(true);
      } else if (dayData.hasEnergyAudit) {
        setCurrentDay(dayNumber);
        setShowEnergyAudit(true);
      } else if (dayData.hasHobbyHunting) {
        setCurrentDay(dayNumber);
        setShowHobbyHunting(true);
      } else if (dayData.hasMoreThanWork) {
        setCurrentDay(dayNumber);
        setShowMoreThanWork(true);
      } else if (dayData.hasBoundariesCheck) {
        setCurrentDay(dayNumber);
        setShowBoundariesCheck(true);
      } else if (dayData.hasANewYou) {
        setCurrentDay(dayNumber);
        setShowANewYou(true);
      } else if (dayData.hasTimeMapping) {
        setCurrentDay(dayNumber);
        setShowTimeMapping(true);
      } else if (dayData.hasReflectAndAdjust) {
        setCurrentDay(dayNumber);
        setShowReflectAndAdjust(true);
      } else if (dayData.hasStarvingArtist) {
        setCurrentDay(dayNumber);
        setShowStarvingArtist(true);
      } else if (dayData.hasKnowYourValue) {
        setCurrentDay(dayNumber);
        setShowKnowYourValue(true);
      } else if (dayData.hasGenerosity) {
        setCurrentDay(dayNumber);
        setShowGenerosity(true);
      } else if (dayData.hasShameAroundMoney) {
        setCurrentDay(dayNumber);
        setShowShameAroundMoney(true);
      } else if (dayData.hasScarcityVsAbundance) {
        setCurrentDay(dayNumber);
        setShowScarcityVsAbundance(true);
      } else if (dayData.hasMoreMoneyMoreHeadroom) {
        setCurrentDay(dayNumber);
        setShowMoreMoneyMoreHeadroom(true);
      } else if (dayData.hasYourStartingLine) {
        setCurrentDay(dayNumber);
        setShowYourStartingLine(true);
      } else if (dayData.hasGoalSetting) {
        setCurrentDay(dayNumber);
        setShowGoalSetting(true);
      } else if (dayData.hasSpendingTemperatureCheck) {
        setCurrentDay(dayNumber);
        setShowSpendingTemperatureCheck(true);
      } else if (dayData.hasBudgetingMethodsDecoded) {
        setCurrentDay(dayNumber);
        setShowBudgetingMethodsDecoded(true);
      } else if (dayData.hasEmergency) {
        setCurrentDay(dayNumber);
        setShowEmergency(true);
      } else if (dayData.hasMeetYourMustHaves) {
        setCurrentDay(dayNumber);
        setShowMeetYourMustHaves(true);
      } else if (dayData.hasFeastOrFamine) {
        setCurrentDay(dayNumber);
        setShowFeastOrFamine(true);
      } else if (dayData.hasSavingsSprint) {
        setCurrentDay(dayNumber);
        setShowSavingsSprint(true);
      } else if (dayData.hasTamingYourDebt) {
        setCurrentDay(dayNumber);
        setShowTamingYourDebt(true);
      } else if (dayData.hasSideHustleScoreCard) {
        setCurrentDay(dayNumber);
        setShowSideHustleScoreCard(true);
      } else if (dayData.hasAskForMore) {
        setCurrentDay(dayNumber);
        setShowAskForMore(true);
      } else if (dayData.hasTheTotalPackage) {
        setCurrentDay(dayNumber);
        setShowTheTotalPackage(true);
      } else if (dayData.hasInvestmentInvestigations) {
        setCurrentDay(dayNumber);
        setShowInvestmentInvestigations(true);
      } else if (dayData.hasLifestyleCreepRiskMeter) {
        setCurrentDay(dayNumber);
        setShowLifestyleCreepRiskMeter(true);
      } else if (dayData.hasCelebrateTheWins) {
        setCurrentDay(dayNumber);
        setShowCelebrateTheWins(true);
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

  const handleTalkTheTalkComplete = (result: any) => {
    setTalkTheTalkResult(result);
    setShowTalkTheTalk(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleDanceSkillMatchComplete = (result: any) => {
    setDanceSkillMatchResult(result);
    setShowDanceSkillMatch(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleLinkedinUpgradeComplete = (result: any) => {
    setLinkedinUpgradeResult(result);
    setShowLinkedinUpgrade(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleWhoWouldYouHireComplete = (result: any) => {
    setWhoWouldYouHireResult(result);
    setShowWhoWouldYouHire(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleMakeYourPlanComplete = (result: any) => {
    setMakeYourPlanResult(result);
    setShowMakeYourPlan(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleBeyondYourIdentityComplete = (result: any) => {
    setBeyondYourIdentityResult(result);
    setShowBeyondYourIdentity(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleLettingGoOfValidationComplete = (result: any) => {
    setLettingGoOfValidationResult(result);
    setShowLettingGoOfValidation(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleGriefComplete = (result: any) => {
    setGriefResult(result);
    setShowGrief(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleDecisionMakingComplete = (result: any) => {
    setDecisionMakingResult(result);
    setShowDecisionMaking(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleSunkCostFallacyComplete = (result: any) => {
    setSunkCostFallacyResult(result);
    setShowSunkCostFallacy(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleMissingDanceComplete = (result: any) => {
    setMissingDanceResult(result);
    setShowMissingDance(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleIgniteYourCuriosityComplete = (result: any) => {
    setIgniteYourCuriosityResult(result);
    setShowIgniteYourCuriosity(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleEnergyAuditComplete = (result: any) => {
    setEnergyAuditResult(result);
    setShowEnergyAudit(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleHobbyHuntingComplete = (result: any) => {
    setHobbyHuntingResult(result);
    setShowHobbyHunting(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleMoreThanWorkComplete = (result: any) => {
    setMoreThanWorkResult(result);
    setShowMoreThanWork(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleBoundariesCheckComplete = (result: any) => {
    setBoundariesCheckResult(result);
    setShowBoundariesCheck(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleTimeMappingComplete = (result: any) => {
    setTimeMappingResult(result);
    setShowTimeMapping(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleANewYouComplete = (result: any) => {
    setANewYouResult(result);
    setShowANewYou(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleReflectAndAdjustComplete = (result: any) => {
    setReflectAndAdjustResult(result);
    setShowReflectAndAdjust(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleStarvingArtistComplete = (result: any) => {
    setStarvingArtistResult(result);
    setShowStarvingArtist(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleKnowYourValueComplete = (result: any) => {
    setKnowYourValueResult(result);
    setShowKnowYourValue(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleGenerosityComplete = (result: any) => {
    setGenerosityResult(result);
    setShowGenerosity(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleShameAroundMoneyComplete = (result: any) => {
    setShameAroundMoneyResult(result);
    setShowShameAroundMoney(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleScarcityVsAbundanceComplete = (result: any) => {
    setScarcityVsAbundanceResult(result);
    setShowScarcityVsAbundance(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleMoreMoneyMoreHeadroomComplete = (result: any) => {
    setMoreMoneyMoreHeadroomResult(result);
    setShowMoreMoneyMoreHeadroom(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleYourStartingLineComplete = (result: any) => {
    setYourStartingLineResult(result);
    setShowYourStartingLine(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleGoalSettingComplete = (result: any) => {
    setGoalSettingResult(result);
    setShowGoalSetting(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleSpendingTemperatureCheckComplete = (result: any) => {
    setSpendingTemperatureCheckResult(result);
    setShowSpendingTemperatureCheck(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleBudgetingMethodsDecodedComplete = (result: any) => {
    setBudgetingMethodsDecodedResult(result);
    setShowBudgetingMethodsDecoded(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleEmergencyComplete = (result: any) => {
    setEmergencyResult(result);
    setShowEmergency(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleMeetYourMustHavesComplete = (result: any) => {
    setMeetYourMustHavesResult(result);
    setShowMeetYourMustHaves(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleFeastOrFamineComplete = (result: any) => {
    setFeastOrFamineResult(result);
    setShowFeastOrFamine(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleSavingsSprintComplete = (result: any) => {
    setSavingsSprintResult(result);
    setShowSavingsSprint(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleTamingYourDebtComplete = (result: any) => {
    setTamingYourDebtResult(result);
    setShowTamingYourDebt(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleSideHustleScoreCardComplete = (result: any) => {
    setSideHustleScoreCardResult(result);
    setShowSideHustleScoreCard(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleAskForMoreComplete = (result: any) => {
    setAskForMoreResult(result);
    setShowAskForMore(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleTheTotalPackageComplete = (result: any) => {
    setTheTotalPackageResult(result);
    setShowTheTotalPackage(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleInvestmentInvestigationsComplete = (result: any) => {
    setInvestmentInvestigationsResult(result);
    setShowInvestmentInvestigations(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleLifestyleCreepRiskMeterComplete = (result: any) => {
    setLifestyleCreepRiskMeterResult(result);
    setShowLifestyleCreepRiskMeter(false);
    const newProgress = Math.max(progress, currentDay);
    saveProgress(newProgress);
  };

  const handleCelebrateTheWinsComplete = (result: any) => {
    setCelebrateTheWinsResult(result);
    setShowCelebrateTheWins(false);
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

  if (showTalkTheTalk) {
    return <TalkTheTalk onComplete={handleTalkTheTalkComplete} />;
  }

  if (showDanceSkillMatch) {
    return <DanceSkillMatch onComplete={handleDanceSkillMatchComplete} />;
  }

  if (showLinkedinUpgrade) {
    return <LinkedinUpgrade onComplete={handleLinkedinUpgradeComplete} />;
  }

  if (showWhoWouldYouHire) {
    return <WhoWouldYouHire onComplete={handleWhoWouldYouHireComplete} />;
  }

  if (showMakeYourPlan) {
    return <MakeYourPlan onComplete={handleMakeYourPlanComplete} />;
  }

  if (showBeyondYourIdentity) {
    return <BeyondYourIdentity onComplete={handleBeyondYourIdentityComplete} />;
  }

  if (showLettingGoOfValidation) {
    return <LettingGoOfValidation onComplete={handleLettingGoOfValidationComplete} />;
  }

  if (showGrief) {
    return <Grief onComplete={handleGriefComplete} />;
  }

  if (showDecisionMaking) {
    return <DecisionMaking onComplete={handleDecisionMakingComplete} />;
  }

  if (showSunkCostFallacy) {
    return <SunkCostFallacy onComplete={handleSunkCostFallacyComplete} />;
  }

  if (showMissingDance) {
    return <MissingDance onComplete={handleMissingDanceComplete} />;
  }

  if (showIgniteYourCuriosity) {
    return <IgniteYourCuriosity onComplete={handleIgniteYourCuriosityComplete} />;
  }

  if (showEnergyAudit) {
    return <EnergyAudit onComplete={handleEnergyAuditComplete} />;
  }

  if (showHobbyHunting) {
    return <HobbyHunting onComplete={handleHobbyHuntingComplete} />;
  }

  if (showMoreThanWork) {
    return <MoreThanWork onComplete={handleMoreThanWorkComplete} />;
  }

  if (showBoundariesCheck) {
    return <BoundariesCheck onComplete={handleBoundariesCheckComplete} />;
  }

  if (showTimeMapping) {
    return <TimeMapping onComplete={handleTimeMappingComplete} />;
  }

  if (showANewYou) {
    return <ANewYou onComplete={handleANewYouComplete} />;
  }

  if (showReflectAndAdjust) {
    return <ReflectAndAdjust onComplete={handleReflectAndAdjustComplete} />;
  }

  if (showStarvingArtist) {
    return <StarvingArtist onComplete={handleStarvingArtistComplete} />;
  }

  if (showKnowYourValue) {
    return <KnowYourValue onComplete={handleKnowYourValueComplete} />;
  }

  if (showGenerosity) {
    return <Generosity onComplete={handleGenerosityComplete} />;
  }

  if (showShameAroundMoney) {
    return <ShameAroundMoney onComplete={handleShameAroundMoneyComplete} />;
  }

  if (showScarcityVsAbundance) {
    return <ScarcityVsAbundance onComplete={handleScarcityVsAbundanceComplete} />;
  }


  if (showMoreMoneyMoreHeadroom) {
    return <MoreMoneyMoreHeadroom onComplete={handleMoreMoneyMoreHeadroomComplete} />;
  }

  if (showYourStartingLine) {
    return <YourStartingLine onComplete={handleYourStartingLineComplete} />;
  }

  if (showGoalSetting) {
    return <GoalSetting onComplete={handleGoalSettingComplete} />;
  }

  if (showSpendingTemperatureCheck) {
    return <SpendingTemperatureCheck onComplete={handleSpendingTemperatureCheckComplete} />;
  }

  if (showBudgetingMethodsDecoded) {
    return <BudgetingMethodsDecoded onComplete={handleBudgetingMethodsDecodedComplete} />;
  }

  if (showEmergency) {
    return <Emergency onComplete={handleEmergencyComplete} />;
  }

  if (showMeetYourMustHaves) {
    return <MeetYourMustHaves onComplete={handleMeetYourMustHavesComplete} />;
  }

  if (showFeastOrFamine) {
    return <FeastOrFamine onComplete={handleFeastOrFamineComplete} />;
  }

  if (showSavingsSprint) {
    return <SavingsSprint onComplete={handleSavingsSprintComplete} />;
  }

  if (showTamingYourDebt) {
    return <TamingYourDebt onComplete={handleTamingYourDebtComplete} />;
  }

  if (showSideHustleScoreCard) {
    return <SideHustleScoreCard onComplete={handleSideHustleScoreCardComplete} />;
  }

  if (showAskForMore) {
    return <AskForMore onComplete={handleAskForMoreComplete} />;
  }

  if (showTheTotalPackage) {
    return <TheTotalPackage onComplete={handleTheTotalPackageComplete} />;
  }

  if (showInvestmentInvestigations) {
    return <InvestmentInvestigations onComplete={handleInvestmentInvestigationsComplete} />;
  }

  if (showLifestyleCreepRiskMeter) {
    return <LifestyleCreepRiskMeter onComplete={handleLifestyleCreepRiskMeterComplete} />;
  }

  if (showCelebrateTheWins) {
    return <CelebrateTheWins onComplete={handleCelebrateTheWinsComplete} />;
  }


  const progressPercentage = Math.round((progress / path.days.length) * 100);

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={28} color="#E2DED0" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.titleText}>{path.title}</Text>
          </View>
          {/* Empty view to balance the flex row */}
          <View style={styles.backButtonPlaceholder} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Content */}
        <View style={styles.content}>
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
  errorText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#746C70',
    textAlign: 'center',
    marginTop: 100,
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
  },
  content: {
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
  backButtonPlaceholder: {
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
  timelineContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 50,
  },
  timeline: {
    // No specific styles needed
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
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
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  dayNumber: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#647C90',
    marginBottom: 8,
  },
  completedDayNumber: {
    color: '#928490',
  },
  lockedDayNumber: {
    color: '#928490',
  },
  dayTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    marginBottom: 12,
    lineHeight: 24,
    fontWeight: '700',
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
    fontSize: 14,
    color: '#647C90',
    marginRight: 8,
    fontWeight: '500',
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