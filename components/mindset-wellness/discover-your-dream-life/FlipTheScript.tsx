import React from 'react';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';

interface FlipTheScriptProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function FlipTheScript({ onComplete, onBack }: FlipTheScriptProps) {
  const introScreen = {
    title: "Look at you!",
    descriptions: [
      "You're almost at the end of this path and you've already dug through a lot. It's not easy and it's ok if this is all still really uncomfortable. You're taking action and you're turning up. The rest is a matter of time, trust me. Let's keep going, one small step at a time.",
    ],
    journalSectionProps: {
      pathTag: "discover-dream-life",
      day: "6",
      category: "Mindset and Wellness",
      pathTitle: "Discover Your Dream Life",
      dayTitle: "Flip The Script",
      journalInstruction: "Before we begin, let's take a moment to check in with yourself. How are you feeling as you continue this journey?",
      moodLabel: "",
      saveButtonText: "Save Entry",
    },
    buttonText: "Let's go",
  };

  const secondaryIntroScreen = {
    title: "Flip the Script",
    descriptions: [
      "One of the scariest parts of leaving your dance career is answering the dreaded small-talk question, 'So, what have you been up to?' … But what if we flipped the script and talked about our pivot with confidence?",
    ],
    buttonText: "Start Flipping",
  };

  const cards = [
    {
      id: 1,
      oldBelief: "Oh, I'm just a washed-up dancer now.",
      newBelief: "I had an amazing dance career, and now I'm exploring a whole new chapter I'm really excited about.",
      buttonText: "Flip the script!",
      flipButtonText: "Doesn't that feel better?"
    },
    {
      id: 2,
      oldBelief: "I don't really dance anymore… I guess I'm retired.",
      newBelief: "I'm channeling my creativity into new projects these days, and it's been surprisingly fulfilling.",
      buttonText: "Flip the script!",
      flipButtonText: "See how empowering that sounds?"
    },
    {
      id: 3,
      oldBelief: "Yeah… I quit dance.",
      newBelief: "I transitioned out of the industry recently. I'm learning a bunch of new things right now, just trying to find my next adventure.",
      buttonText: "Flip the script!",
      flipButtonText: "That's owning your story!"
    },
    {
      id: 4,
      oldBelief: "I'm not really doing anything interesting right now.",
      newBelief: "I'm in the middle of discovering what's next, and it's been an adventure.",
      buttonText: "Flip the script!",
      flipButtonText: "Ok, she's evolving!"
    },
    {
      id: 5,
      oldBelief: "Oh, I just do boring stuff now.",
      newBelief: "I've been exploring corporate work that's completely different from dance and I've learned so much.",
      buttonText: "Flip the script!",
      flipButtonText: "Look at you!"
    },
    {
      id: 6,
      oldBelief: "I guess I peaked when I was on stage.",
      newBelief: "I loved performing, and now I'm building something that excites me in a whole new way.",
      buttonText: "Flip the script!",
      flipButtonText: "You're in your growth era!"
    },
    {
      id: 7,
      oldBelief: "Nothing compares to dance, so it's just… whatever.",
      newBelief: "I'll always love dance, and I've found other passions that light me up too.",
      buttonText: "Flip the script!",
      flipButtonText: "Ok, multi-hyphenate queen!"
    },
    {
      id: 8,
      oldBelief: "I'm kind of lost without dance.",
      newBelief: "I'm learning so much about myself outside of dance, and it's been eye-opening.",
      buttonText: "Flip the script!",
      flipButtonText: "We love that positive honesty!"
    },
    {
      id: 9,
      oldBelief: "I used to be a dancer, but now… not really.",
      newBelief: "I danced professionally for years, and now I'm applying those skills in new ways.",
      buttonText: "Flip the script!",
      flipButtonText: "You're still a dancer, girl!"
    },
    {
      id: 10,
      oldBelief: "Yeah, I don't dance anymore. It's over.",
      newBelief: "I'm dancing as a hobby now and recently found a new career that's actually been surprisingly meaningful.",
      buttonText: "Flip the script!",
      flipButtonText: "That's the confidence we love!"
    }
  ];

  const reflectionScreen = {
    title: "Navigating Imposter Syndrome",
    description: "A big part of flipping the script with confidence is navigating imposter syndrome. To end today, let's watch this 5-minute clip to dive deeper into imposter syndrome in dancers and how to get through it.",
    videoId: "w9Tzx-sZhTg",
    buttonText: "Continue",
  };

  const finalScreen = {
    title: "Now It's Your Turn",
    descriptions: [
      "It's not easy to own your story, especially when dance has given you a story since age 3. But as scary as it is, now it's time to write your own story and unveil the next chapter.",
    ],
    journalSectionProps: {
      pathTag: "discover-dream-life",
      day: "6",
      category: "Mindset and Wellness",
      pathTitle: "Discover Your Dream Life",
      dayTitle: "Flip The Script",
      journalInstruction: "Write your own script for how you'll talk about your transition. What feels authentic and empowering to you?",
      moodLabel: "",
      saveButtonText: "Save Entry",
    },
    alternativeClosing: "The last day of this path is coming up next!",
    buttonText: "Mark As Complete",
  };

  return (
    <CardPromptEngine
      onComplete={onComplete}
      onBack={onBack}
      cardType="flip"
      primaryButtonText="Let's go"
      imageSource="https://pivotfordancers.com/assets/logo.png"
      introScreen={introScreen}
      secondaryIntroScreen={secondaryIntroScreen}
      cards={cards}
      reflectionScreen={reflectionScreen}
      finalScreen={finalScreen}
    />
  );
}