import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import SkillsQuiz from '@/components/mindset-wellness/discover-your-dream-life/SkillsQuiz';
import MythBusterGame from '@/components/mindset-wellness/discover-your-dream-life/MythBusterGame';
import RoleplayScenario from '@/components/mindset-wellness/discover-your-dream-life/RoleplayScenario';
import DreamBiggerGame from '@/components/mindset-wellness/discover-your-dream-life/DreamBiggerGame';

jest.mock('@/utils/hooks/useFirstName', () => ({
  useFirstName: () => 'John',
  personalizeGreeting: (baseGreeting: string, firstName: string | null) =>
    firstName ? `${baseGreeting} ${firstName}` : baseGreeting,
}));

jest.mock('@/utils/hooks/useJournaling', () => ({
  useJournaling: () => ({
    journalEntry: '',
    setJournalEntry: jest.fn(),
    selectedMood: null,
    setSelectedMood: jest.fn(),
    addJournalEntry: jest.fn(),
  }),
}));

jest.mock('@/hooks/useStorage', () => ({
  useStorage: (key: string, initialValue: unknown) => {
    const React = require('react');

    if (key === 'DAY1_SKILLS_QUIZ_RESULT') {
      return React.useState(null);
    }

    if (key === 'MYTH_BUSTER_MATCHED_PAIRS') {
      return React.useState([]);
    }

    return React.useState(initialValue);
  },
}));

describe('interactive feature clusters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('advances through the skills quiz intro into question flow', async () => {
    const { getByText, findByText } = render(
      <SkillsQuiz onComplete={jest.fn()} onBack={jest.fn()} />
    );

    fireEvent.press(getByText("I'm Ready to Begin"));
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(await findByText("What kind of dreamer are you?")).toBeTruthy();

    fireEvent.press(getByText("Let's do it"));
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(
      await findByText('When someone asks what you want to do after dance, you usually…')
    ).toBeTruthy();

    fireEvent.press(getByText('Say something you think is realistic and achievable.'));
    fireEvent.press(getByText('Continue'));

    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(await findByText('Which statement feels most true right now?')).toBeTruthy();
  });

  it('advances through the myth buster intro into the game board', async () => {
    const { getByText, findByText } = render(
      <MythBusterGame onComplete={jest.fn()} onBack={jest.fn()} />
    );

    fireEvent.press(getByText('Continue'));
    expect(await findByText('Myth Buster')).toBeTruthy();

    fireEvent.press(getByText('Start the Game'));

    expect(await findByText('Myth')).toBeTruthy();
    expect(await findByText('Reality')).toBeTruthy();
    expect(await findByText("Dancers shouldn't have a plan B.")).toBeTruthy();
  });

  it('follows the required roleplay flow from welcome to congrats', async () => {
    const { getByText, findByText } = render(
      <RoleplayScenario onComplete={jest.fn()} onBack={jest.fn()} />
    );

    expect(getByText('Welcome Back John')).toBeTruthy();
    expect(getByText("What we'll learn today")).toBeTruthy();
    expect(getByText(/Journal Prompt:/)).toBeTruthy();

    fireEvent.press(getByText("Let's Begin"));
    expect(await findByText('What is this roleplay about?')).toBeTruthy();

    fireEvent.press(getByText('Begin'));
    expect(await findByText('Imagine This')).toBeTruthy();

    fireEvent.press(getByText('Continue'));
    expect(await findByText('Your Options')).toBeTruthy();

    fireEvent.press(
      getByText(
        "Respectfully decline the invitation. Your dance career comes first. It's a no-brainer."
      )
    );
    fireEvent.press(getByText('Continue'));

    expect(await findByText("Here's where you're at")).toBeTruthy();
    fireEvent.press(getByText('Continue'));

    expect(await findByText("Here's your situation")).toBeTruthy();
    fireEvent.press(getByText('See the Alternative'));

    expect(await findByText("So, what's the alternative?")).toBeTruthy();
    fireEvent.press(getByText('Continue to Reflection'));

    expect(await findByText('Reflect on Today')).toBeTruthy();
    expect(getByText(/Journal Prompt:/)).toBeTruthy();
    fireEvent.press(getByText('Continue'));

    expect(await findByText('Congrats!')).toBeTruthy();
  });

  it('follows the required this-or-that flow from welcome to congrats', async () => {
    const { getByText, findByText, queryByText } = render(
      <DreamBiggerGame onComplete={jest.fn()} onBack={jest.fn()} />
    );

    expect(getByText('Welcome Back John')).toBeTruthy();
    expect(getByText("What we'll learn today")).toBeTruthy();
    expect(getByText(/Journal Prompt:/)).toBeTruthy();

    fireEvent.press(getByText('Continue'));
    expect(await findByText('What is this day about?')).toBeTruthy();

    fireEvent.press(getByText('Start dreaming'));

    const dreamOptions = [
      'Beach house',
      'Mountain cabin',
      'Travel the world',
      'Buy your forever home',
      'Learn to surf',
      'Learn to build pottery',
      'Start a family',
      'Start a business',
      '6-figure income',
      'Unlimited time off',
      'Personal chef',
      'High-quality wardrobe',
      'Work part time',
      'Retire early',
      'Season tickets to the theatre',
      'Create your own show',
      'Run a marathon',
      'Annual yoga retreats',
      'Donate to charity',
      'Help your parents retire',
    ];

    for (let i = 0; i < 10; i += 1) {
      const visibleOption = dreamOptions.find((option) => queryByText(option));
      expect(visibleOption).toBeTruthy();

      fireEvent.press(getByText(visibleOption!));
      fireEvent.press(getByText('Continue'));

      await act(async () => {
        jest.advanceTimersByTime(200);
      });
    }

    expect(await findByText('Reflect on Today')).toBeTruthy();
    expect(getByText(/Journal Prompt:/)).toBeTruthy();

    fireEvent.press(getByText('Continue'));
    expect(await findByText('Congrats!')).toBeTruthy();
  });
});
