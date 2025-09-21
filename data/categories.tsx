import { Brain, Rocket, DollarSign } from 'lucide-react-native';

export interface PathDay {
  day: number;
  title: string;
  content: string;
  prompt: string;
  callout?: string;
  hasQuiz?: boolean;
  hasLeadershipExperience?: boolean;
  hasMythBuster?: boolean;
  hasRoleplay?: boolean;
  hasDreamBigger?: boolean;
  hasValuesDiscovery?: boolean;
  hasFlipScript?: boolean;
  hasVoiceMessage?: boolean;
  hasExpandYourHorizons?: boolean;
  hasWhatEnergizesYou?: boolean;
  hasSparkCuriosity?: boolean;
  hasTryItOn?: boolean;
  hasBreakOutOfYourBubble?: boolean;
  hasDealBreakerGame?: boolean;
  hasYourFirstExperiment?: boolean;
  hasStartWithYourStrengths?: boolean;
  hasFindYourLearningStyle?: boolean;
  hasWorkBackwards?: boolean;
  hasYourHiddenNetwork?: boolean;
  hasOvercomeAnalysis?: boolean;
  hasEmbraceTheBeginner?: boolean;
  hasJustStart?: boolean;
  hasConfidenceGap?: boolean;
  hasCureImposterSyndrome?: boolean;
  hasTalkTheTalk?: boolean;
  hasDanceSkillMatch?: boolean;
  hasLinkedinUpgrade?: boolean;
  hasWhoWouldYouHire?: boolean;
  hasMakeYourPlan?: boolean;
  hasBeyondYourIdentity?: boolean;
  hasLettingGoOfValidation?: boolean;
  hasGrief?: boolean;
  hasDecisionMaking?: boolean;
  hasSunkCostFallacy?: boolean;
  hasMissingDance?: boolean;
  hasIgniteYourCuriosity?: boolean;
  hasEnergyAudit?: boolean;
  hasHobbyHunting?: boolean;
  hasMoreThanWork?: boolean;
  hasBoundariesCheck?: boolean;
  hasTimeMapping?: boolean;
  hasANewYou?: boolean;
  hasReflectAndAdjust?: boolean;
  hasStarvingArtist?: boolean;
  hasKnowYourValue?: boolean;
  hasGenerosity?: boolean;
  hasShameAroundMoney?: boolean;
  hasScarcityVsAbundance?: boolean;
  hasMoreMoneyMoreHeadroom?: boolean;
  hasYourStartingLine?: boolean;
  hasGoalSetting?: boolean;
  hasSpendingTemperatureCheck?: boolean;
  hasBudgetingMethodsDecoded?: boolean;
  hasEmergency?: boolean;
  hasMeetYourMustHaves?: boolean;
  hasFeastOrFamine?: boolean;
  hasSavingsSprint?: boolean;
  hasTamingYourDebt?: boolean;
  hasSideHustleScorecard?: boolean;
  hasAskForMore?: boolean;
  hasTheTotalPackage?: boolean;
  hasInvestmentInvestigations?: boolean;
  hasLifestyleCreepRiskMeter?: boolean;
  hasSavingsSprint?: boolean;

}

export interface Path {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  totalDays: number;
  days: PathDay[];
  callout?: {
    text: string;
    url: string;
  };
}

export interface Category {
  id: string;
  title: string;
  description: string;
  color: string;
  paths: Path[];
}

export const categories: Category[] = [
  {
    id: 'mindset',
    title: 'Mindset & Wellness',
    description: 'Develop the mental resilience and wellness practices for successful transition',
    color: '#647C90',
    icon: <Brain size={24} color='rgba(226, 222, 208, 0.9)' />,
    paths: [
      {
        id: 'discover-dream-life',
        title: 'Discover Your Dream Life',
        subtitle: '', // We only use subheadings for "Coming Soon"
        description: 'It\'s time to dream big. Each step in this path offers mindset shifts and thought-provoking exercises to help you discover what you want beyond dance and explore what it means to let go of your dream job to build your dream life.',
        duration: '7 days',
        totalDays: 7,
        days: [
          {
            day: 1,
            title: 'What kind of dreamer are you?',
            content: 'It\'s a skill to dream big. Sure, we had dance dreams and achieved them, but when we start dreaming on our own terms, it can start to fall apart. To help you dream bigger, let\'s start by figuring out your "Dreamer Type" to unlock what could be holding you back.',
            hasQuiz: true,
          },
          {
            day: 2,
            title: 'Permission to Want More',
            content: 'Today we explore what it means to give yourself full permission to want more than what feels "realistic" or "safe."',
            hasMythBuster: true,
          },
          {
            day: 3,
            title: 'Beyond the Practical',
            content: 'Let\'s walk through a common scenario you may find yourself in if you continue down the path of professional dance. Choose what you\'d be most likely to do in this scenario and we\'ll shed light on an alternative.',
            hasRoleplay: true,
          },
          {
            day: 4,
            title: 'Dream Bigger',
            content: 'This is a game of instincts. Choose the answer that you resonate with the most to help you dream bigger about what life after dance can be. Don\'t think too much! There\'s no right or wrong. Let\'s see what you can dream up.',
            hasDreamBigger: true,
          },
          {
            day: 5,
            title: 'What do you actually value?',
            content: 'We might all be dancers, but we all connected with dance for different reasons. Why we love something comes down to what we value and understanding our values helps us to build a dream life. Let\'s explore our hidden values to discover all the exciting ways we can build our dream life based on our values, not the other way around.',
            hasValuesDiscovery: true,
          },
          {
            day: 6,
            title: 'Flip the Script',
            content: 'One of the scariest parts of leaving your dance career is answering the dreaded small-talk question, "So, what have you been up to?". When you\'re in the middle of a huge shift, it\'s easy to make a joke or shirk the question entirely. But what if we flip the script and talked about our pivot with confidence?',
            hasFlipScript: true,
          },
          {
            day: 7,
            title: 'Your Expansive Vision',
            content: 'You\'re ready to dream bigger and step into a full and rich life beyond dance. Take it one step further with actionable next steps.',
            hasVoiceMessage: true,
          },
        ]
      },
      {
        id: 'mindset-shift',
        title: 'Mindset Shift',
        // subtitle: 'Coming Soon',
        description: 'Explore who you are beyond your dancer identity - comprehensive path coming soon',
        duration: '7 days',
        totalDays: 7,
        days: [
          {
            day: 1,
            title: 'Beyond Your Identity',
            content: 'You are more than what you do and more than what you’ve done. Match each identity-rooted phrase with a reminder that you can just be you… no identity needed.',
            hasBeyondYourIdentity: true,
          },
          {
            day: 2,
            title: 'Letting Go of Validation',
            content: 'As dancers, we’re used to applause, casting lists, and approval from teachers and directors. But what happens when those voices go quiet Let’s practice rewriting validation so it comes from you.',
            hasLettingGoOfValidation: true,
          },
          {
            day: 3,
            title: 'Grief',
            content: '',
            hasGrief: true,
          },
          {
            day: 4,
            title: 'Decision Making',
            content: 'As dancers, you know how to follow directions. But now, you’re the choreographer of your choices. ',
            hasDecisionMaking: true,
          },
          {
            day: 5,
            title: 'Sunk Cost Fallacy',
            content: 'You haven’t wasted your years in dance. Match each sunk-cost thought with a reframe that opens new doors.',
            hasSunkCostFallacy: true,
          },
          {
            day: 6,
            title: 'Missing Dance',
            content: 'You are more than what you do and more than what you’ve done. Match each identity-rooted phrase with a reminder that you can just be you… no identity needed.',
            hasMissingDance: true,
          },
          {
            day: 7,
            title: 'Ignite Your Curiosity',
            content: 'Curiosity isn’t something you either have or don’t.. it’s like a muscle. This quiz will stretch your curiosity and help you practice seeing the world with fresh eyes.',
            hasIgniteYourCuriosity: true,
          },
        ],
      },
      {
        id: 'work-life-balance',
        title: 'Work/Life Banlance',
        // subtitle: 'Coming Soon',
        description: 'Let’s find out when your energy is at its peak and when it dips to help you plan your work, hobbies, and rest. ',
        duration: '7 days',
        totalDays: 7,
        days: [
          {
            day: 1,
            title: 'Energy Audit',
            content: 'Let’s find out when your energy is at its peak and when it dips to help you plan your work, hobbies, and rest.',
            hasEnergyAudit: true,
          },
          {
            day: 2,
            title: 'Hobby Hunting',
            content: 'As dancers, we often have a one-track mind and hobbies often get put on the backburner. So, today we’re hobby hunting! Pick the option that excites you most.',
            hasHobbyHunting: true,
          },
          {
            day: 3,
            title: 'More Than Work',
            content: 'As a dancer, you lived and breathed it. We all did! But now, we’re going to do things differently. Of course, we hope you find meaningful work off the stage. But we also want to make sure you’re still you, in ways that have nothing to do with your job. Here are some action ideas to remind you that you’re more than work.',
            hasMoreThanWork: true,
          },
          {
            day: 4,
            title: 'Boundaries Check',
            content: 'As dancers, we’re used to saying “yes” to everything: extra rehearsals, extra shifts, extra favors. But outside of dance, that same habit can drain your energy. Let’s practice spotting healthy boundaries.',
            hasBoundariesCheck: true,
          },
          {
            day: 5,
            title: 'Time Mapping',
            content: 'Choose the option that feels best to you and create a balanced schedule for work, hobbies, and rest.',
            hasTimeMapping: true,
          },
          {
            day: 6,
            title: 'A New You',
            content: '',
            hasANewYou: true,
          },
          {
            day: 7,
            title: 'Reflect & Adjust',
            content: 'You’ve tried new things this week to bring more balance into your life. Let’s reflect on how it felt. Your answers will help you see what’s working and what to adjust.',
            hasReflectAndAdjust: true,
          },
        ],
      },
    ],
  },
  {
    id: 'career-transitions',
    title: 'Career Transitions',
    description: 'Navigate your path from dance to your next fulfilling career',
    color: '#647C90',
    icon: <Rocket size={24} color='rgba(226, 222, 208, 0.9)' />,
    paths: [
      {
        id: 'skills-assessment',
        title: 'Discover Your Direction',
        subtitle: '',
        description: 'Not sure what career is right for you? Curious to know if you’re on the right path? Each step in the path helps you explore career options you may have never considered and start taking action towards landing a job in the industry that’s works for you.',
        duration: '7 days',
        totalDays: 7,
        days: [
          {
            day: 1,
            title: 'Expand Your Horizons',
            content: 'This comprehensive path on transferable skills discovery is being developed and will be available soon. Check back for updates on identifying and articulating your valuable dance skills.',
            hasExpandYourHorizons: true,
          },
          {
            day: 2,
            title: 'What Energizes You?',
            content: 'Some work drains you. Other work fuels you. This quiz helps you spot the tasks, environments, and wins that give you real energy, so you can steer your career in that direction.',
            hasWhatEnergizesYou: true,
          },
          {
            day: 3,
            title: 'Spark Curiosity',
            content: 'Curiosity is the engine of your pivot. Today we’re here to spark new ideas, help you explore untapped careers, and uncover possibilities you might not have considered.',
            hasSparkCuriosity: true,
          },
          {
            day: 4,
            title: 'Try it on',
            content: 'Let’s try on some new careers to see how they might feel in the real world. We’ll show you a few scenarios and you’ll choose what you’d do in each situation.',
            hasTryItOn: true,
          },
          {
            day: 5,
            title: 'Break Out of Your Bubble',
            content: '',
            hasBreakOutOfYourBubble: true,
          },
          {
            day: 6,
            title: 'Deal Breakers',
            content: 'Match each deal breaker with the type of work environment or situation it aligns with. These will be the circumstance to avoid.',
            hasDealBreakerGame: true,
          },
          {
            day: 7,
            title: 'Your First Experiment',
            content: 'It’s time to put ideas into action.Today, you’re going to try one small experiment to explore a career you’re curious about.The goal isn’t perfection… it’s discovery.',
            hasYourFirstExperiment: true,
          },
        ],
      },
      {
        id: 'upskilling-pathfinder',
        title: 'Upskilling Pathfinder',
        subtitle: '',
        description: 'Not sure what career is right for you? Curious to know if you’re on the right path? Each step in the path helps you explore career options you may have never considered and start taking action towards landing a job in the industry that’s works for you.',
        duration: '7 days',
        totalDays: 7,
        days: [
          {
            day: 1,
            title: 'Start With Your Strengths',
            content: 'Match your natural strengths as a dancer with relevant job titles.',
            hasStartWithYourStrengths: true,
          },
          {
            day: 2,
            title: 'Find Your Learing Style?',
            content: 'Let’s face it. Starting your career change will likely require you to learn a thing or two (at least!). So it’s useful to know how you learn best so that when it comes to upskilling, you can choose the most effective path.',
            hasFindYourLearningStyle: true,
          },
          {
            day: 3,
            title: 'Work Backwards',
            content: 'Not sure what skills to learn first? The best place to look is in real job descriptions. They show you what employers actually value.',
            hasWorkBackwards: true,
          },
          {
            day: 4,
            title: 'Your Hidden Network',
            content: 'This is a game of instincts to uncover your hidden network. Choose the answer that makes the most sense for you. There’s no right or wrong!',
            hasYourHiddenNetwork: true,
          },
          {
            day: 5,
            title: 'Overcome Analysis Paralysis',
            content: 'Match the thought that keeps you stuck with the action that breaks the pattern.',
            hasOvercomeAnalysis: true,
          },
          {
            day: 6,
            title: 'Embrace the Beginner',
            content: '',
            hasEmbraceTheBeginner: true,
          },
          {
            day: 7,
            title: 'Just Start',
            content: '',
            hasJustStart: true,
          },
        ],
      },
      {
        id: 'prep-your-pivot',
        title: 'Prep Your Pivot',
        subtitle: '',
        description: 'Making a big career change is as much about mindset as it is about skills. This quick check will help you see where your confidence tends to dip, so you know what to focus on as you prep your pivot.',
        duration: '7 days',
        totalDays: 7,
        days: [
          {
            day: 1,
            title: 'Confidence Gap',
            content: 'Making a big career change is as much about mindset as it is about skills. This quick check will help you see where your confidence tends to dip, so you know what to focus on as you prep your pivot.',
            hasConfidenceGap: true,
          },
          {
            day: 2,
            title: 'Cure Imposter Syndrome',
            content: 'Play button with a pre-recorded voice message for users to listen to',
            hasCureImposterSyndrome: true,
          },
          {
            day: 3,
            title: 'Talk The Talk',
            content: 'When it comes to interviewing and networking, it can come down to learning how to “talk the talk” in a way the outside world understands. Capitalize on your dance experience by talking about it in muggle terms.',
            hasTalkTheTalk: true,
          },
          {
            day: 4,
            title: 'Dance Skill Match',
            content: 'Match the dance skill with the career skill',
            hasDanceSkillMatch: true,
          },
          {
            day: 5,
            title: 'LinkedIn Upgrade',
            content: 'Most dancers aren’t active on LinkedIn. But the truth is, this is the main platform where recruiters and employers are definitely hanging out. ',
            hasLinkedinUpgrade: true,
          },
          {
            day: 6,
            title: 'Who Would You Hire?',
            content: 'Take yourself out of the equation and pretend YOU are the hiring manager putting another dancer in the hot seat for an interview. Put yourself in their shoes and decide who you would hire.',
            hasWhoWouldYouHire: true,
          },
          {
            day: 7,
            title: 'Make Your Plan',
            content: 'Choose the answer that best describes your situation to help you create your career game plan. But there’s no right or wrong! It’s just your starting point and we’ll build from there.',
            hasMakeYourPlan: true,
          },
        ],
      },
    ],
  },
  {
    id: 'finance',
    title: 'Financial Wellness',
    description: 'Master your money mindset and build financial security during your transition',
    color: '#647C90',
    icon: <DollarSign size={24} color='rgba(226, 222, 208, 0.9)' />,
    paths: [
      {
        id: 'money-mindsets',
        title: 'Money Mindsets',
        subtitle: '',
        description: 'You don’t have to buy into the starving artist stereotype anymore. In this game, you’ll match the old belief with a reframe that frees you.',
        duration: '7 days',
        totalDays: 7,
        days: [
          {
            day: 1,
            title: 'Starving Artist No More',
            content: 'You don’t have to buy into the starving artist stereotype anymore. In this game, you’ll match the old belief with a reframe that frees you.',
            hasStarvingArtist: true,
          },
          {
            day: 2,
            title: 'Know Your Value',
            content: 'In dance, it’s common to be underpaid or told you should “do it for exposure” That conditioning sticks. But your skills are worth real money and you deserve to ask for it.',
            hasKnowYourValue: true,
          },
          {
            day: 3,
            title: 'Generosity',
            content: 'Let’s explore a scenario where your financial situation influences how much you can give back. Choose what you’d do and then see what other options might open up if you had more stability and income.',
            hasGenerosity: true,
          },
          {
            day: 4,
            title: 'Shame Around Money',
            content: '',
            hasShameAroundMoney: true,
          },
          {
            day: 5,
            title: 'Scarcity Vs Abundance',
            content: 'As dancers, we’ve been taught to accept less… low pay, “exposure gigs,” and the starving artist life. But what if you flipped the script? Let’s explore scarcity vs. abundance thinking by matching the scarcity thought with the abundance reframe.',
            hasScarcityVsAbundance: true,
          },
          {
            day: 6,
            title: 'More Money, More Headroom',
            content: 'Wanting more isn’t about greed… it’s about creating breathing room so your mind can think, create, and choose. Swipe through these cards. Each one ends with a tiny action you can actually try this week.s',
            hasMoreMoneyMoreHeadroom: true,
          },
          {
            day: 7,
            title: 'Your Starting Line',
            content: 'Before you can move forward with money, it helps to know where you’re standing. Answer these 10 quick questions to uncover your money starting line. No shame, just awareness. Let’s go.”',
            hasYourStartingLine: true,
          },
        ],
      },
      {
        id: 'budgeting-for-dancers',
        title: 'Budgeting For Dancers',
        subtitle: '',
        description: 'Let’s talk about your money goals. Not the vague ones like ‘I should probably save more’—I’m talking about the goals that light you up. The ones that make budgeting worth it.',
        duration: '7 days',
        totalDays: 7,
        days: [
          {
            day: 1,
            title: 'Goal Setting',
            content: '',
            hasGoalSetting: true,
          },
          {
            day: 2,
            title: 'Spending Temperature Check',
            content: 'In dance, it’s common to be underpaid or told you should “do it for exposure” That conditioning sticks. But your skills are worth real money and you deserve to ask for it.',
            hasSpendingTemperatureCheck: true,
          },
          {
            day: 3,
            title: 'Budgeting Methods Decoded',
            content: "You know you need a budget, but where to start? Dancers thrive with structure so let's find a financial framework that fits your flow. We'll walk through three popular methods. Your job is to see which one is best for you.",
            hasBudgetingMethodsDecoded: true,
          },
          {
            day: 4,
            title: 'Emergency',
            content: "Life is full of surprises. An emergency fund isn't just money in the bank… it's your ticket to handling a crisis with grace, not panic. Let's walk through a few scenarios. Choose what you'd do, and we'll show you how a safety net changes the game.",
            hasEmergency: true,
          },
          {
            day: 5,
            title: 'Meet Your Must-Haves',
            content: 'This is a game of instincts. We’re going to uncover what you truly value by having you choose between common spending categories. Your choices will help us build a personalized snapshot of your financial priorities. Don’t overthink it!',
            hasMeetYourMustHaves: true,
          },
          {
            day: 6,
            title: 'Feast or Famine',
            content: "Living with a variable income creates its own set of myths.Let's bust the ones that keep you stuck in a cycle of financial stress.",
            hasFeastOrFamine: true,
          },
          {
            day: 7,
            title: 'Savings Sprint',
            content: "This isn't about huge sacrifices, it's about small, consistent actions that prove you are in control of your money. Let's walk through three simple challenges.Your only job is to pick one and start.",
            hasSavingsSprint: true,
          },
        ],
      },
      {
        id: 'financial-futureproofing',
        title: 'Financial Futureproofing ',
        subtitle: '',
        description: "Debt can feel like a weight holding you back. But think of it like a complex dance routine: it can be mastered one step at a time with a clear plan. You're not alone in this.Let's choose a strategy and build your payoff plan.",
        duration: '7 days',
        totalDays: 7,
        days: [
          {
            day: 1,
            title: 'Taming Your Debt',
            content: "Debt can feel like a weight holding you back. But think of it like a complex dance routine: it can be mastered one step at a time with a clear plan. You're not alone in this.Let's choose a strategy and build your payoff plan.",
            hasTamingYourDebt: true,
          },
          {
            day: 2,
            title: 'Side Hustle Scorecard',
            content: "Your financial goals need fuel. A side hustle is a powerful way to generate extra cash to build your future, fast. This is a game of instincts.Choose the side gigs that sound most appealing to you.We'll use your choices to show you the impact that extra income can have.",
            hasSideHustleScorecard: true,
          },
          {
            day: 3,
            title: 'Ask For More',
            content: "In the dance world, talking about money can feel uncomfortable. But knowing your value and advocating for it is a non-negotiable skill for financial futureproofing. Let's practice. Choose how you'd handle this common scenario.",
            hasAskForMore: true,
          },
          {
            day: 4,
            title: 'The Total Package',
            content: "Your salary is just one part of your compensation. The full package includes benefits that can be even more valuable than a slight pay raise.",
            hasTheTotalPackage: true,
          },
          {
            day: 5,
            title: 'Investment Investigations',
            content: 'Building wealth means knowing both where to put your money (your accounts) and what to put in it (your investments).',
            hasInvestmentInvestigations: true,
          },
          {
            day: 6,
            title: 'Lifestyle Creep Risk Meter',
            content: "Lifestyle creep happens when your income rises, but your spending rises right alongside it (or faster). This quiz will help you see how at risk you are, and what you can do to keep more of your hard-earned money.",
            hasLifestyleCreepRiskMeter: true,
          },
          {
            day: 7,
            title: 'Celebrate The Wins',
            content: '',
            hasCelebrateTheWins: true,
          },
        ],
      },
    ],
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getPathById = (categoryId: string, pathId: string): Path | undefined => {
  const category = getCategoryById(categoryId);
  return category?.paths.find(path => path.id === pathId);
};