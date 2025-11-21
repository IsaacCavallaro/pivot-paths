import React from 'react';
import RoleplayPromptEngine from '@/components/shared/roleplay-prompt-engine/RoleplayPromptEngine';
import { RoleplayScenarioContent } from '@/types/roleplayPromptEngine'; // Updated import to RoleplayScenarioContent

interface RoleplayScenarioProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function RoleplayScenario({ onComplete, onBack }: RoleplayScenarioProps) {
  const scenarios: RoleplayScenarioContent[] = [
    {
      id: 1,
      scenarioTitle: "Imagine This",
      scenarioText: "It's a year in the future and you just booked your next dance contract. You open the mail to discover one of your best childhood friends is getting married in the Bahamas in a few months and you're invited.",
      scenarioQuestion: "What do you do?", // Added from original flow
      choices: [
        { id: 'choice1', text: "Respectfully decline the invitation. Your dance career comes first. It's a no-brainer." },
        { id: 'choice2', text: "You can't really afford it but you plan to go, of course. That's what swings are for! You'll think about the financial consequences later…" },
        { id: 'choice3', text: "You have enough savings to cover the trip but you're nervous to ask your director for the time off so early into the contract." },
      ],
      responses: [
        "The best part of this is that you have clarity! Dance comes first and that's ok. But let's see where that could lead.",
        "You seem to be prioritizing your friends and family which is nice to see! But your dance career is making it difficult to show up in all the ways you'd like to.",
        "Your finances are in order and you know you want to be there for your friend's big day. But guilt and pressure are piling on. So no matter what you do, you're conflicted.",
      ],
      followUpTexts: [
        "There's a possibility that you could look back and realize that you missed out on the important stuff. Family, friends, relationships… that's really what life is all about and it's what matters in the end. It's easy to feel like dance will never let you down like people might, but the truth is, dance isn't a person who can love you back either. Only the people you pour your time and effort into can do that.",
        "We all know that dance careers are hardly financially lucrative. We're not in it for the money and that's ok. But when it comes to big life events like your best friend's wedding, you feel strapped for cash and restricted to the bare minimum. While you don't need to be rolling in the dough, what if there was another way?",
        "Your dance career has put you between a rock and a hard place. The lifestyle and expectations that come with being a professional dancer are making it harder and harder to do the things that truly matter to you. You don't want to let go of dance, but you want don't want to feel pressure to choose between having a normal life and being successful in your career.",
      ],
      alternativeTitle: "So, what's the alternative?",
      alternativeText: "You finish off your dance contract on your terms, retiring with grace and dignity. You've started in a new career making more money than ever with three weeks of paid time off. You take dance class every Thursday and spend your weekends trying different hobbies. You get invited to your childhood friend's wedding in the Bahamas and you immediately RSVP. You pay for everything in full (no credit cards needed!) and use your PTO with no hassle from your boss. (In fact, you're slightly freaking out in the inside about getting PAID to go on vacation!) You have the best time seeing old friends and celebrating this once in a lifetime event with the memories to prove it. You're still living the dream. How does that sound?",
      reflectionPrompt: "If you could put family and friends before your dance career, what would that mean to you?",
    },
  ];

  const welcomeScreen = {
    title: "We’re so glad you’re back!",
    descriptions: [
      "By showing up again and again, you’re proving that you’re serious about creating a meaningful life beyond dance.",
      "It’s possible to honor both your passion for dance and your dreams beyond it. And we’re so glad to be here with you."
    ],
    learningBox: {
      title: "Celebrating Your Progress",
      items: [
        { id: 1, text: "You've identified your dreamer type" },
        { id: 2, text: "You've challenged industry myths" },
        { id: 3, text: "You're building self-awareness" },
        { id: 4, text: "You're prioritizing your future" },
      ],
    },
    welcomeFooter: "Today, we'll explore what life could look like if you continued down the path of professional dance versus choosing a different route. Get ready to imagine new possibilities!",
    journalSectionProps: {
      pathTag: "discover-dream-life",
      day: "3",
      category: "Mindset and Wellness",
      pathTitle: "Discover Your Dream Life",
      dayTitle: "What's The Alternative",
      journalInstruction: "Before we begin, what challenges do you hope to tackle in these roleplay scenarios? What skills do you want to develop?",
      moodLabel: "",
      saveButtonText: "Save Entry",
    },
    buttonText: "Let's Begin",
  };

  const engineIntroScreen = {
    title: "What's the alternative?",
    descriptions: [
      "Let's walk through a common scenario you may find yourself in if you continue down the path of professional dance. Choose what you'd be most likely to do in this scenario and we'll shed light on an alternative. You have more options than you might think."
    ],
    buttonText: "Begin",
  };

  const reflectionScreen = {
    title: "Expanding Your Vision",
    descriptions: [
      "This was just one specific example of an alternative path. As you continue to work on becoming an expansive dreamer and bust those myths, who knows what else you can apply the alternative to?",
      "Every choice you make opens up new possibilities. The wedding scenario shows how financial stability and work-life balance can transform your ability to show up for the people and experiences that matter most."
    ],
    reflectionEmphasis: "Take a detour to see how our founder has done it, but don't forget to come back and mark this day as complete!",
    journalSectionProps: {
      pathTag: "discover-dream-life",
      day: "3",
      category: "Mindset and Wellness",
      pathTitle: "Discover Your Dream Life",
      dayTitle: "What's The Alternative",
      journalInstruction: "If you could put family and friends before your dance career, what would that mean to you?",
      moodLabel: "",
      saveButtonText: "Save Entry",
    },
    buttonText: "Mark As Complete",
  };

  const finalScreen = {
    title: "Roleplay Complete!",
    descriptions: [
      "Congratulations on completing the roleplay scenarios! You've taken a significant step in practicing important life skills.",
      "Remember, practice makes progress. The more you visualize and rehearse these situations, the more confident you'll become in real life."
    ],
    videoLink: "https://www.youtube.com/shorts/s-hpQ9XBGP4",
    alternativeClosing: "Keep practicing and evolving!",
    journalSectionProps: {
      pathTag: "discover-dream-life",
      day: "3",
      category: "Mindset and Wellness",
      pathTitle: "Discover Your Dream Life",
      dayTitle: "Your Personal Space",
      journalInstruction: "Remember, feel free to use the journal tab at any time to jot down your thoughts. This app is for you! Use it how you’d like to!",
      moodLabel: "",
      saveButtonText: "Save Entry",
    },
    buttonText: "Mark Day As Complete",
  };


  return (
    <RoleplayPromptEngine
      onComplete={onComplete}
      onBack={onBack}
      imageSource="https://pivotfordancers.com/assets/logo.png"
      engineTitle="What's The Alternative"
      engineInstructions="Imagine new possibilities!"
      scenarios={scenarios}
      welcomeScreen={welcomeScreen}
      engineIntroScreen={engineIntroScreen}
      reflectionScreen={reflectionScreen}
      finalScreen={finalScreen}
    />
  );
}
