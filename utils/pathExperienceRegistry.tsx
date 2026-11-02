import type { ComponentType, ReactElement } from 'react';
import type { PathDay } from '@/data/categories';

import SkillsQuiz from '@/components/mindset-wellness/discover-your-dream-life/SkillsQuiz';
import MythBusterGame from '@/components/mindset-wellness/discover-your-dream-life/MythBusterGame';
import RoleplayScenario from '@/components/mindset-wellness/discover-your-dream-life/RoleplayScenario';
import DreamBiggerGame from '@/components/mindset-wellness/discover-your-dream-life/DreamBiggerGame';
import ValuesDiscovery from '@/components/mindset-wellness/discover-your-dream-life/ValuesDiscovery';
import FlipTheScript from '@/components/mindset-wellness/discover-your-dream-life/FlipTheScript';
import VoiceMessage from '@/components/mindset-wellness/discover-your-dream-life/VoiceMessage';
import ExpandYourHorizons from '@/components/career-transitions/discover-your-direction/ExpandYourHorizons';
import WhatEnergizesYou from '@/components/career-transitions/discover-your-direction/WhatEnergizesYou';
import SparkCuriosity from '@/components/career-transitions/discover-your-direction/SparkCuriosity';
import TryItOn from '@/components/career-transitions/discover-your-direction/TryItOn';
import BreakOutOfYourBubble from '@/components/career-transitions/discover-your-direction/BreakOutOfYourBubble';
import YourFirstExperiment from '@/components/career-transitions/discover-your-direction/YourFirstExperiment';
import DealBreakerGame from '@/components/career-transitions/discover-your-direction/DealBreakerGame';
import StartWithYourStrengths from '@/components/career-transitions/upskilling-pathfinder/StartWithYourStrengths';
import FindYourLearningStyle from '@/components/career-transitions/upskilling-pathfinder/FindYourLearningStyle';
import WorkBackwards from '@/components/career-transitions/upskilling-pathfinder/WorkBackwards';
import YourHiddenNetwork from '@/components/career-transitions/upskilling-pathfinder/YourHiddenNetwork';
import OvercomeAnalysisParalysis from '@/components/career-transitions/upskilling-pathfinder/OvercomeAnalysisParalysis';
import EmbraceTheBeginner from '@/components/career-transitions/upskilling-pathfinder/EmbraceTheBeginner';
import JustStart from '@/components/career-transitions/upskilling-pathfinder/JustStart';
import ConfidenceGap from '@/components/career-transitions/prep-your-pivot/ConfidenceGap';
import CureImposterSyndrome from '@/components/career-transitions/prep-your-pivot/CureImposterSyndrome';
import TalkTheTalk from '@/components/career-transitions/prep-your-pivot/TalkTheTalk';
import DanceSkillMatch from '@/components/career-transitions/prep-your-pivot/DanceSkillMatch';
import LinkedinUpgrade from '@/components/career-transitions/prep-your-pivot/LinkedinUpgrade';
import WhoWouldYouHire from '@/components/career-transitions/prep-your-pivot/WhoWouldYouHire';
import MakeYourPlan from '@/components/career-transitions/prep-your-pivot/MakeYourPlan';
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

export type ExperienceKey =
  | 'quiz'
  | 'mythBuster'
  | 'roleplay'
  | 'dreamBigger'
  | 'valuesDiscovery'
  | 'expandYourHorizons'
  | 'whatEnergizesYou'
  | 'sparkCuriosity'
  | 'tryItOn'
  | 'dealBreakerGame'
  | 'breakOutOfYourBubble'
  | 'flipScript'
  | 'voiceMessage'
  | 'yourFirstExperiment'
  | 'startWithYourStrengths'
  | 'findYourLearningStyle'
  | 'workBackwards'
  | 'yourHiddenNetwork'
  | 'overcomeAnalysis'
  | 'embraceTheBeginner'
  | 'justStart'
  | 'confidenceGap'
  | 'cureImposterSyndrome'
  | 'talkTheTalk'
  | 'danceSkillMatch'
  | 'linkedinUpgrade'
  | 'whoWouldYouHire'
  | 'makeYourPlan'
  | 'beyondYourIdentity'
  | 'lettingGoOfValidation'
  | 'grief'
  | 'decisionMaking'
  | 'sunkCostFallacy'
  | 'missingDance'
  | 'igniteYourCuriosity'
  | 'energyAudit'
  | 'hobbyHunting'
  | 'moreThanWork'
  | 'boundariesCheck'
  | 'aNewYou'
  | 'timeMapping'
  | 'reflectAndAdjust'
  | 'starvingArtist'
  | 'knowYourValue'
  | 'generosity'
  | 'shameAroundMoney'
  | 'scarcityVsAbundance'
  | 'moreMoneyMoreHeadroom'
  | 'yourStartingLine'
  | 'goalSetting'
  | 'spendingTemperatureCheck'
  | 'budgetingMethodsDecoded'
  | 'emergency'
  | 'meetYourMustHaves'
  | 'feastOrFamine'
  | 'savingsSprint'
  | 'tamingYourDebt'
  | 'sideHustleScoreCard'
  | 'askForMore'
  | 'theTotalPackage'
  | 'investmentInvestigations'
  | 'lifestyleCreepRiskMeter'
  | 'celebrateTheWins';

type ExperienceRendererProps = {
  onComplete: (result?: unknown) => void;
  onBack: () => void;
};

type ExperienceEntry = {
  render: (props: ExperienceRendererProps) => ReactElement;
};

const withBack = (Component: ComponentType<any>): ExperienceEntry => ({
  render: ({ onComplete, onBack }) => <Component onComplete={onComplete} onBack={onBack} />,
});

const withoutBack = (Component: ComponentType<any>): ExperienceEntry => ({
  render: ({ onComplete }) => <Component onComplete={onComplete} />,
});

export const pathDayFlagOrder: Array<{ flag: keyof PathDay; experience: ExperienceKey }> = [
  { flag: 'hasQuiz', experience: 'quiz' },
  { flag: 'hasMythBuster', experience: 'mythBuster' },
  { flag: 'hasRoleplay', experience: 'roleplay' },
  { flag: 'hasDreamBigger', experience: 'dreamBigger' },
  { flag: 'hasValuesDiscovery', experience: 'valuesDiscovery' },
  { flag: 'hasExpandYourHorizons', experience: 'expandYourHorizons' },
  { flag: 'hasWhatEnergizesYou', experience: 'whatEnergizesYou' },
  { flag: 'hasSparkCuriosity', experience: 'sparkCuriosity' },
  { flag: 'hasTryItOn', experience: 'tryItOn' },
  { flag: 'hasDealBreakerGame', experience: 'dealBreakerGame' },
  { flag: 'hasBreakOutOfYourBubble', experience: 'breakOutOfYourBubble' },
  { flag: 'hasFlipScript', experience: 'flipScript' },
  { flag: 'hasVoiceMessage', experience: 'voiceMessage' },
  { flag: 'hasYourFirstExperiment', experience: 'yourFirstExperiment' },
  { flag: 'hasStartWithYourStrengths', experience: 'startWithYourStrengths' },
  { flag: 'hasFindYourLearningStyle', experience: 'findYourLearningStyle' },
  { flag: 'hasWorkBackwards', experience: 'workBackwards' },
  { flag: 'hasYourHiddenNetwork', experience: 'yourHiddenNetwork' },
  { flag: 'hasOvercomeAnalysis', experience: 'overcomeAnalysis' },
  { flag: 'hasEmbraceTheBeginner', experience: 'embraceTheBeginner' },
  { flag: 'hasJustStart', experience: 'justStart' },
  { flag: 'hasConfidenceGap', experience: 'confidenceGap' },
  { flag: 'hasCureImposterSyndrome', experience: 'cureImposterSyndrome' },
  { flag: 'hasTalkTheTalk', experience: 'talkTheTalk' },
  { flag: 'hasDanceSkillMatch', experience: 'danceSkillMatch' },
  { flag: 'hasLinkedinUpgrade', experience: 'linkedinUpgrade' },
  { flag: 'hasWhoWouldYouHire', experience: 'whoWouldYouHire' },
  { flag: 'hasMakeYourPlan', experience: 'makeYourPlan' },
  { flag: 'hasBeyondYourIdentity', experience: 'beyondYourIdentity' },
  { flag: 'hasLettingGoOfValidation', experience: 'lettingGoOfValidation' },
  { flag: 'hasGrief', experience: 'grief' },
  { flag: 'hasDecisionMaking', experience: 'decisionMaking' },
  { flag: 'hasSunkCostFallacy', experience: 'sunkCostFallacy' },
  { flag: 'hasMissingDance', experience: 'missingDance' },
  { flag: 'hasIgniteYourCuriosity', experience: 'igniteYourCuriosity' },
  { flag: 'hasEnergyAudit', experience: 'energyAudit' },
  { flag: 'hasHobbyHunting', experience: 'hobbyHunting' },
  { flag: 'hasMoreThanWork', experience: 'moreThanWork' },
  { flag: 'hasBoundariesCheck', experience: 'boundariesCheck' },
  { flag: 'hasANewYou', experience: 'aNewYou' },
  { flag: 'hasTimeMapping', experience: 'timeMapping' },
  { flag: 'hasReflectAndAdjust', experience: 'reflectAndAdjust' },
  { flag: 'hasStarvingArtist', experience: 'starvingArtist' },
  { flag: 'hasKnowYourValue', experience: 'knowYourValue' },
  { flag: 'hasGenerosity', experience: 'generosity' },
  { flag: 'hasShameAroundMoney', experience: 'shameAroundMoney' },
  { flag: 'hasScarcityVsAbundance', experience: 'scarcityVsAbundance' },
  { flag: 'hasMoreMoneyMoreHeadroom', experience: 'moreMoneyMoreHeadroom' },
  { flag: 'hasYourStartingLine', experience: 'yourStartingLine' },
  { flag: 'hasGoalSetting', experience: 'goalSetting' },
  { flag: 'hasSpendingTemperatureCheck', experience: 'spendingTemperatureCheck' },
  { flag: 'hasBudgetingMethodsDecoded', experience: 'budgetingMethodsDecoded' },
  { flag: 'hasEmergency', experience: 'emergency' },
  { flag: 'hasMeetYourMustHaves', experience: 'meetYourMustHaves' },
  { flag: 'hasFeastOrFamine', experience: 'feastOrFamine' },
  { flag: 'hasSavingsSprint', experience: 'savingsSprint' },
  { flag: 'hasTamingYourDebt', experience: 'tamingYourDebt' },
  { flag: 'hasSideHustleScoreCard', experience: 'sideHustleScoreCard' },
  { flag: 'hasAskForMore', experience: 'askForMore' },
  { flag: 'hasTheTotalPackage', experience: 'theTotalPackage' },
  { flag: 'hasInvestmentInvestigations', experience: 'investmentInvestigations' },
  { flag: 'hasLifestyleCreepRiskMeter', experience: 'lifestyleCreepRiskMeter' },
  { flag: 'hasCelebrateTheWins', experience: 'celebrateTheWins' },
];

export const resolveDayExperience = (day: PathDay): ExperienceKey | null => {
  return pathDayFlagOrder.find(({ flag }) => Boolean(day[flag]))?.experience ?? null;
};

export const pathExperienceRegistry: Record<ExperienceKey, ExperienceEntry> = {
  quiz: withBack(SkillsQuiz),
  mythBuster: withBack(MythBusterGame),
  roleplay: withBack(RoleplayScenario),
  dreamBigger: withBack(DreamBiggerGame),
  valuesDiscovery: withBack(ValuesDiscovery),
  expandYourHorizons: withBack(ExpandYourHorizons),
  whatEnergizesYou: withBack(WhatEnergizesYou),
  sparkCuriosity: withBack(SparkCuriosity),
  tryItOn: withBack(TryItOn),
  dealBreakerGame: withBack(DealBreakerGame),
  breakOutOfYourBubble: withBack(BreakOutOfYourBubble),
  flipScript: withBack(FlipTheScript),
  voiceMessage: withBack(VoiceMessage),
  yourFirstExperiment: withBack(YourFirstExperiment),
  startWithYourStrengths: withBack(StartWithYourStrengths),
  findYourLearningStyle: withBack(FindYourLearningStyle),
  workBackwards: withBack(WorkBackwards),
  yourHiddenNetwork: withBack(YourHiddenNetwork),
  overcomeAnalysis: withBack(OvercomeAnalysisParalysis),
  embraceTheBeginner: withBack(EmbraceTheBeginner),
  justStart: withBack(JustStart),
  confidenceGap: withBack(ConfidenceGap),
  cureImposterSyndrome: withBack(CureImposterSyndrome),
  talkTheTalk: withBack(TalkTheTalk),
  danceSkillMatch: withBack(DanceSkillMatch),
  linkedinUpgrade: withoutBack(LinkedinUpgrade),
  whoWouldYouHire: withoutBack(WhoWouldYouHire),
  makeYourPlan: withoutBack(MakeYourPlan),
  beyondYourIdentity: withoutBack(BeyondYourIdentity),
  lettingGoOfValidation: withoutBack(LettingGoOfValidation),
  grief: withoutBack(Grief),
  decisionMaking: withoutBack(DecisionMaking),
  sunkCostFallacy: withoutBack(SunkCostFallacy),
  missingDance: withoutBack(MissingDance),
  igniteYourCuriosity: withoutBack(IgniteYourCuriosity),
  energyAudit: withoutBack(EnergyAudit),
  hobbyHunting: withoutBack(HobbyHunting),
  moreThanWork: withoutBack(MoreThanWork),
  boundariesCheck: withoutBack(BoundariesCheck),
  aNewYou: withoutBack(ANewYou),
  timeMapping: withoutBack(TimeMapping),
  reflectAndAdjust: withoutBack(ReflectAndAdjust),
  starvingArtist: withBack(StarvingArtist),
  knowYourValue: withBack(KnowYourValue),
  generosity: withBack(Generosity),
  shameAroundMoney: withBack(ShameAroundMoney),
  scarcityVsAbundance: withBack(ScarcityVsAbundance),
  moreMoneyMoreHeadroom: withBack(MoreMoneyMoreHeadroom),
  yourStartingLine: withBack(YourStartingLine),
  goalSetting: withoutBack(GoalSetting),
  spendingTemperatureCheck: withoutBack(SpendingTemperatureCheck),
  budgetingMethodsDecoded: withoutBack(BudgetingMethodsDecoded),
  emergency: withoutBack(Emergency),
  meetYourMustHaves: withoutBack(MeetYourMustHaves),
  feastOrFamine: withoutBack(FeastOrFamine),
  savingsSprint: withoutBack(SavingsSprint),
  tamingYourDebt: withoutBack(TamingYourDebt),
  sideHustleScoreCard: withoutBack(SideHustleScoreCard),
  askForMore: withoutBack(AskForMore),
  theTotalPackage: withoutBack(TheTotalPackage),
  investmentInvestigations: withoutBack(InvestmentInvestigations),
  lifestyleCreepRiskMeter: withoutBack(LifestyleCreepRiskMeter),
  celebrateTheWins: withoutBack(CelebrateTheWins),
};
