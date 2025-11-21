import React from 'react';
import AudioPromptEngine from '@/components/shared/audio-prompt-engine/AudioPromptEngine';
import { Users, Star, Target } from 'lucide-react-native';

interface VoiceMessageProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function VoiceMessage({ onComplete, onBack }: VoiceMessageProps) {
  const introDescriptions = [
    "You've come so far on this path of self-discovery. From identifying your dreamer type to flipping the script and uncovering your core values, you've been building the foundation for what comes next.",
    "Now, we're going to bring it all together with a guided visualization exercise. This will help you connect with your future self and solidify the vision you've been creating.",
  ];

  const preparationSection = [
    "Find a comfortable, quiet place to sit",
    "Headphones are recommended for the best experience",
    "Allow yourself 5-10 minutes of uninterrupted time",
    "Get ready to relax and visualize your dream future",
  ];

  const mentorshipCardFeatures = [
    { icon: Star, text: "Personalized guidance" },
    { icon: Target, text: "Custom action plan" },
    { icon: Users, text: "Ongoing support" },
  ];

  const mentorshipDescriptions = [
    "You've taken incredible steps toward building your dream life beyond dance. Now, imagine having personalized guidance to help you navigate this transition with confidence.",
    "Our mentorship program provides one-on-one support to help you clarify your goals, overcome obstacles, and create a concrete action plan for your next chapter.",
  ];

  return (
    <AudioPromptEngine
      onComplete={onComplete}
      onBack={onBack}
      introTitle="Finish Line"
      introDescriptions={introDescriptions}
      journalIntroSectionProps={{
        pathTag: "discover-dream-life",
        day: "7",
        category: "Mindset and Wellness",
        pathTitle: "Discover Your Dream Life",
        dayTitle: "Visualize your dream life",
        journalInstruction: "A quick check in before we start this session",
        moodLabel: "",
        saveButtonText: "Save Entry",
      }}
      preparationSection={preparationSection}
      voiceMessageTitle="Visualize Your Dream"
      voiceMessageDescription="Tap to listen to a guided visualization"
      journalReflectionTitle="Reflect on Your Experience"
      journalReflectionDescription="Take a moment to capture your thoughts and feelings after the visualization exercise. What insights emerged? What felt most meaningful to you?"
      journalReflectionSectionProps={{
        pathTag: "post-visualization-reflection",
        day: "7",
        category: "Mindset and Wellness",
        pathTitle: "Discover Your Dream Life",
        dayTitle: "Visualize your dream life",
        journalInstruction: "Reflect on your visualization experience",
        moodLabel: "",
        saveButtonText: "Save Reflection",
      }}
      ebookProps={{
        title: "Ready for Extra Support?",
        descriptions: mentorshipDescriptions,
        callout: "You don't have to figure this out alone. Let's build your future together.",
        link: "https://pivotfordancers.com/services/mentorship/",
        cardTitle: "1:1 Mentorship Program",
        cardIcon: Users,
        cardFeatures: mentorshipCardFeatures,
        cardButtonText: "Learn More",
      }}
    />
  );
}