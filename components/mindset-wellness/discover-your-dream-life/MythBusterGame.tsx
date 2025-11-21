import React from 'react';
import MatchGameEngine from '@/components/shared/match-game-engine/MatchGameEngine';

interface MythBusterGameProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function MythBusterGame({ onComplete, onBack }: MythBusterGameProps) {
  const pairs = [
    {
      id: 1,
      leftText: "Dancers shouldn't have a plan B.",
      rightText: "A backup plan is essential.",
      leftType: "myth",
      rightType: "reality"
    },
    {
      id: 2,
      leftText: "I can dance well into my 40s.",
      rightText: "Most dance careers end in your early 30s.",
      leftType: "myth",
      rightType: "reality"
    },
    {
      id: 3,
      leftText: "Real dancers sacrifice everything.",
      rightText: "Balance doesn't make you a worse dancer.",
      leftType: "myth",
      rightType: "reality"
    },
    {
      id: 4,
      leftText: "The dance industry is my family.",
      rightText: "Dance work cultures are often toxic.",
      leftType: "myth",
      rightType: "reality"
    },
    {
      id: 5,
      leftText: "Do what you love.",
      rightText: "Passion doesn't pay the bills.",
      leftType: "myth",
      rightType: "reality"
    },
    {
      id: 6,
      leftText: "The show must go on.",
      rightText: "Everyone needs sick days.",
      leftType: "myth",
      rightType: "reality"
    },
    {
      id: 7,
      leftText: "Dance is the dream.",
      rightText: "You can have more than one dream.",
      leftType: "myth",
      rightType: "reality"
    },
    {
      id: 8,
      leftText: "Leaving dance makes me a sellout.",
      rightText: "Staying in dance can be seen as settling.",
      leftType: "myth",
      rightType: "reality"
    },
    {
      id: 9,
      leftText: "Never give up.",
      rightText: "It's ok to let go.",
      leftType: "myth",
      rightType: "reality"
    }
  ];

  const welcomeScreen = {
    title: "Welcome Back!",
    descriptions: [
      "Today, we're diving into the myths that shape our thinking in the dance industry.",
      "Many dancers carry beliefs that may actually be holding them back from building sustainable, fulfilling careers."
    ],
    learningBox: {
      title: "What You'll Learn:",
      items: [
        { id: 1, text: "Common myths that dancers believe" },
        { id: 2, text: "The reality behind these industry narratives" },
        { id: 3, text: "Whether you still believe in these common myths" },
      ],
    },
    welcomeFooter: "You'll be playing a match game to help you identify and challenge the myths you might be holding onto.",
    journalSectionProps: {
      pathTag: "discover-dream-life",
      day: "2",
      category: "Mindset and Wellness",
      pathTitle: "Discover Your Dream Life",
      dayTitle: "Myth Buster",
      journalInstruction: "Before we begin, let's take a moment to check in with yourself. How are you feeling after yesterday's quiz? Is there anything you're hoping to gain today?",
      moodLabel: "",
      saveButtonText: "Save Entry",
    },
    buttonText: "Continue",
  };

  const gameIntroScreen = {
    title: "Myth Buster",
    descriptions: [
      "Let's see if we can expose the myths of the dance industry by matching the myth to the reality"
    ],
    buttonText: "Start the Game",
  };

  const reflectionScreen = {
    title: "Time for Reflection",
    descriptions: [
      "Which myth are you not convinced is actually a myth?",
      "Take a moment to reflect on the myths you encountered."
    ],
    reflectionEmphasis: "(If you're having trouble recalling, feel free to go back and play the match game again)",
    journalSectionProps: {
      pathTag: "discover-dream-life",
      day: "2",
      category: "Mindset and Wellness",
      pathTitle: "Discover Your Dream Life",
      dayTitle: "Myth Buster",
      journalInstruction: "Which myth are you still holding onto? Why does it feel true to you?",
      moodLabel: "",
      saveButtonText: "Add to Journal",
    },
    buttonText: "Continue",
  };

  const finalScreen = {
    title: "Great Work!",
    descriptions: [
      "When pivoting away from dance, it's so important to really think about the myths you currently believe and whether or not they're serving you.",
      "The dance industry feeds us a lot of noise that doesn't actually benefit dancers.",
      "Take a detour and check out the myths our founder had to unlearn. But don't forget to come back and mark this day as complete!"
    ],
    videoLink: "https://www.youtube.com/shorts/8DwWYZHsUHw",
    alternativeClosing: "See you tomorrow.",
    buttonText: "Mark As Complete",
  };

  return (
    <MatchGameEngine
      onComplete={onComplete}
      onBack={onBack}
      imageSource="https://pivotfordancers.com/assets/logo.png"
      gameTitle="Myth Buster"
      gameInstructions="Tap to match myths with their realities"
      leftColumnTitle="Myth"
      rightColumnTitle="Reality"
      pairs={pairs}
      welcomeScreen={welcomeScreen}
      gameIntroScreen={gameIntroScreen}
      reflectionScreen={reflectionScreen}
      finalScreen={finalScreen}
    />
  );
}