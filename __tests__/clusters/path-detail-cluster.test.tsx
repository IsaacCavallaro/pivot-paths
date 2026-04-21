import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { TouchableOpacity } from 'react-native';

const mockPush = jest.fn();
const routeParams = {
  categoryId: 'mindset',
  pathId: 'discover-dream-life',
};

const featureModulePaths = [
  '@/components/mindset-wellness/discover-your-dream-life/SkillsQuiz',
  '@/components/mindset-wellness/discover-your-dream-life/MythBusterGame',
  '@/components/mindset-wellness/discover-your-dream-life/RoleplayScenario',
  '@/components/mindset-wellness/discover-your-dream-life/DreamBiggerGame',
  '@/components/mindset-wellness/discover-your-dream-life/ValuesDiscovery',
  '@/components/mindset-wellness/discover-your-dream-life/FlipTheScript',
  '@/components/mindset-wellness/discover-your-dream-life/VoiceMessage',
  '@/components/career-transitions/discover-your-direction/ExpandYourHorizons',
  '@/components/career-transitions/discover-your-direction/WhatEnergizesYou',
  '@/components/career-transitions/discover-your-direction/SparkCuriosity',
  '@/components/career-transitions/discover-your-direction/TryItOn',
  '@/components/career-transitions/discover-your-direction/BreakOutOfYourBubble',
  '@/components/career-transitions/discover-your-direction/YourFirstExperiment',
  '@/components/career-transitions/discover-your-direction/DealBreakerGame',
  '@/components/career-transitions/upskilling-pathfinder/StartWithYourStrengths',
  '@/components/career-transitions/upskilling-pathfinder/FindYourLearningStyle',
  '@/components/career-transitions/upskilling-pathfinder/WorkBackwards',
  '@/components/career-transitions/upskilling-pathfinder/YourHiddenNetwork',
  '@/components/career-transitions/upskilling-pathfinder/OvercomeAnalysisParalysis',
  '@/components/career-transitions/upskilling-pathfinder/EmbraceTheBeginner',
  '@/components/career-transitions/upskilling-pathfinder/JustStart',
  '@/components/career-transitions/prep-your-pivot/ConfidenceGap',
  '@/components/career-transitions/prep-your-pivot/CureImposterSyndrome',
  '@/components/career-transitions/prep-your-pivot/TalkTheTalk',
  '@/components/career-transitions/prep-your-pivot/DanceSkillMatch',
  '@/components/career-transitions/prep-your-pivot/LinkedinUpgrade',
  '@/components/career-transitions/prep-your-pivot/WhoWouldYouHire',
  '@/components/career-transitions/prep-your-pivot/MakeYourPlan',
  '@/components/mindset-wellness/mindset-shifts/BeyondYourIdentity',
  '@/components/mindset-wellness/mindset-shifts/LettingGoOfValidation',
  '@/components/mindset-wellness/mindset-shifts/Grief',
  '@/components/mindset-wellness/mindset-shifts/DecisionMaking',
  '@/components/mindset-wellness/mindset-shifts/SunkCostFallacy',
  '@/components/mindset-wellness/mindset-shifts/MissingDance',
  '@/components/mindset-wellness/mindset-shifts/IgniteYourCuriosity',
  '@/components/mindset-wellness/work-life-balance/EnergyAudit',
  '@/components/mindset-wellness/work-life-balance/HobbyHunting',
  '@/components/mindset-wellness/work-life-balance/MoreThanWork',
  '@/components/mindset-wellness/work-life-balance/BoundariesCheck',
  '@/components/mindset-wellness/work-life-balance/TimeMapping',
  '@/components/mindset-wellness/work-life-balance/ANewYou',
  '@/components/mindset-wellness/work-life-balance/ReflectAndAdjust',
  '@/components/finance/money-mindsets/StarvingArtist',
  '@/components/finance/money-mindsets/KnowYourValue',
  '@/components/finance/money-mindsets/Generosity',
  '@/components/finance/money-mindsets/ShameAroundMoney',
  '@/components/finance/money-mindsets/ScarcityVsAbundance',
  '@/components/finance/money-mindsets/MoreMoneyMoreHeadroom',
  '@/components/finance/money-mindsets/YourStartingLine',
  '@/components/finance/budgeting-for-dancers/GoalSetting',
  '@/components/finance/budgeting-for-dancers/SpendingTemperatureCheck',
  '@/components/finance/budgeting-for-dancers/BudgetingMethodsDecoded',
  '@/components/finance/budgeting-for-dancers/Emergency',
  '@/components/finance/budgeting-for-dancers/MeetYourMustHaves',
  '@/components/finance/budgeting-for-dancers/FeastOrFamine',
  '@/components/finance/budgeting-for-dancers/SavingsSprint',
  '@/components/finance/financial-futureproofing/TamingYourDebt',
  '@/components/finance/financial-futureproofing/SideHustleScoreCard',
  '@/components/finance/financial-futureproofing/AskForMore',
  '@/components/finance/financial-futureproofing/TheTotalPackage',
  '@/components/finance/financial-futureproofing/InvestmentInvestigation',
  '@/components/finance/financial-futureproofing/LifestyleCreepRiskMeter',
  '@/components/finance/financial-futureproofing/CelebrateTheWins',
];

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useLocalSearchParams: () => routeParams,
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      return callback();
    }, [callback]);
  },
}));

featureModulePaths.forEach((modulePath) => {
  const mockLabel = modulePath.split('/').pop();

  jest.doMock(modulePath, () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');

    return {
      __esModule: true,
      default: ({
        onComplete,
        onBack,
      }: {
        onComplete?: (result: unknown) => void;
        onBack?: () => void;
      }) =>
        React.createElement(
          View,
          null,
          React.createElement(Text, null, `${mockLabel} Mock`),
          onComplete
            ? React.createElement(
                TouchableOpacity,
                { onPress: () => onComplete({ completed: true }) },
                React.createElement(Text, null, `Complete ${mockLabel}`)
              )
            : null,
          onBack
            ? React.createElement(
                TouchableOpacity,
                { onPress: onBack },
                React.createElement(Text, null, `Back ${mockLabel}`)
              )
            : null
        ),
    };
  });
});

const PathDetailScreen = require('@/app/(tabs)/paths/[categoryId]/[pathId]').default;

describe('path detail cluster', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    routeParams.categoryId = 'mindset';
    routeParams.pathId = 'discover-dream-life';
  });

  it('shows a not-found state for invalid routes', () => {
    routeParams.categoryId = 'missing';
    routeParams.pathId = 'missing';

    const { getByText } = render(<PathDetailScreen />);

    expect(getByText('Path not found')).toBeTruthy();
  });

  it('loads saved progress and reflects completed and current day state', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation(async (key: string) => {
      if (key === 'pathProgress') {
        return JSON.stringify({ 'mindset_discover-dream-life': 2 });
      }

      if (key === 'currentDay_mindset_discover-dream-life') {
        return '3';
      }

      return null;
    });

    const { getAllByText, getByText } = render(<PathDetailScreen />);

    await waitFor(() => {
      expect(getByText('Day 3')).toBeTruthy();
      expect(getAllByText('Completed')).toHaveLength(2);
      expect(getByText('Start')).toBeTruthy();
    });
  });

  it('opens a day activity and persists completion for the quiz path', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText } = render(<PathDetailScreen />);

    await waitFor(() => {
      expect(getByText('What kind of dreamer are you?')).toBeTruthy();
    });

    fireEvent.press(getByText('What kind of dreamer are you?'));

    await waitFor(() => {
      expect(getByText('Complete SkillsQuiz')).toBeTruthy();
    });

    fireEvent.press(getByText('Complete SkillsQuiz'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'pathProgress',
        JSON.stringify({ 'mindset_discover-dream-life': 1 })
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'currentDay_mindset_discover-dream-life',
        '2'
      );
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('does not open inaccessible days before they are unlocked', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText, queryByText } = render(<PathDetailScreen />);

    await waitFor(() => {
      expect(getByText('Myth Buster')).toBeTruthy();
    });

    fireEvent.press(getByText('Myth Buster'));

    expect(queryByText('Complete MythBusterGame')).toBeNull();
    expect(AsyncStorage.setItem).not.toHaveBeenCalledWith(
      'currentDay_mindset_discover-dream-life',
      '2'
    );
  });

  it('opens the next accessible activity and advances progress when it completes', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation(async (key: string) => {
      if (key === 'pathProgress') {
        return JSON.stringify({ 'mindset_discover-dream-life': 1 });
      }

      if (key === 'currentDay_mindset_discover-dream-life') {
        return '2';
      }

      return null;
    });

    const { getByText } = render(<PathDetailScreen />);

    await waitFor(() => {
      expect(getByText('Myth Buster')).toBeTruthy();
    });

    fireEvent.press(getByText('Myth Buster'));

    await waitFor(() => {
      expect(getByText('Complete MythBusterGame')).toBeTruthy();
    });

    fireEvent.press(getByText('Complete MythBusterGame'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'pathProgress',
        JSON.stringify({ 'mindset_discover-dream-life': 2 })
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'currentDay_mindset_discover-dream-life',
        '3'
      );
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('routes back to the category overview from the header', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { UNSAFE_getAllByType } = render(<PathDetailScreen />);

    fireEvent.press(UNSAFE_getAllByType(TouchableOpacity)[0]);

    expect(mockPush).toHaveBeenCalledWith('/(tabs)/categories/mindset');
  });

  it('completes the first finance path activity and persists finance progress', async () => {
    routeParams.categoryId = 'finance';
    routeParams.pathId = 'money-mindsets';
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText } = render(<PathDetailScreen />);

    await waitFor(() => {
      expect(getByText('Starving Artist No More')).toBeTruthy();
    });

    fireEvent.press(getByText('Starving Artist No More'));

    await waitFor(() => {
      expect(getByText('Complete StarvingArtist')).toBeTruthy();
    });

    fireEvent.press(getByText('Complete StarvingArtist'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'pathProgress',
        JSON.stringify({ 'finance_money-mindsets': 1 })
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'currentDay_finance_money-mindsets',
        '2'
      );
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });
});
