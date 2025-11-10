import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, Users, Target, Lightbulb, Heart, Star, ArrowRight } from 'lucide-react-native';

interface LeadershipScenario {
  id: number;
  title: string;
  situation: string;
  danceContext: string;
  options: {
    id: string;
    action: string;
    leadershipStyle: string;
    outcome: string;
    skills: string[];
  }[];
}

interface LeadershipResult {
  primaryStyle: string;
  description: string;
  strengths: string[];
  workplaceApplications: string[];
  icon: React.ReactNode;
  color: string;
}

const leadershipScenarios: LeadershipScenario[] = [
  {
    id: 1,
    title: "The Struggling Ensemble Member",
    situation: "You notice a fellow dancer is consistently behind during group rehearsals and seems frustrated.",
    danceContext: "This reminds you of times when you've had to help struggling dancers in your company or class.",
    options: [
      {
        id: 'a',
        action: "Offer to practice with them one-on-one after rehearsal",
        leadershipStyle: 'Supportive Mentor',
        outcome: "They improve significantly and gain confidence, strengthening the entire group.",
        skills: ['mentoring', 'patience', 'individual development', 'empathy']
      },
      {
        id: 'b',
        action: "Suggest breaking down the choreography into smaller, manageable sections",
        leadershipStyle: 'Strategic Coach',
        outcome: "The systematic approach helps not just them, but the whole group learns more efficiently.",
        skills: ['problem-solving', 'strategic thinking', 'process improvement', 'teaching']
      },
      {
        id: 'c',
        action: "Create a buddy system pairing stronger dancers with those who need support",
        leadershipStyle: 'Team Builder',
        outcome: "The collaborative environment improves everyone's performance and builds stronger relationships.",
        skills: ['team building', 'collaboration', 'systems thinking', 'inclusive leadership']
      },
      {
        id: 'd',
        action: "Adapt the choreography to highlight everyone's strengths while maintaining the artistic vision",
        leadershipStyle: 'Adaptive Visionary',
        outcome: "The performance becomes more dynamic and everyone feels valued for their unique contributions.",
        skills: ['adaptability', 'creative problem-solving', 'inclusive design', 'vision alignment']
      }
    ]
  },
  {
    id: 2,
    title: "The Last-Minute Crisis",
    situation: "Your lead dancer gets injured 2 days before a major performance. The understudy is talented but lacks confidence.",
    danceContext: "You've experienced the pressure of stepping up when others couldn't perform.",
    options: [
      {
        id: 'a',
        action: "Focus intensively on building their confidence through positive reinforcement and extra practice",
        leadershipStyle: 'Supportive Mentor',
        outcome: "They deliver a beautiful performance, discovering capabilities they didn't know they had.",
        skills: ['confidence building', 'motivation', 'crisis management', 'emotional support']
      },
      {
        id: 'b',
        action: "Quickly reorganize the choreography to play to the understudy's specific strengths",
        leadershipStyle: 'Strategic Coach',
        outcome: "The performance is seamless because you maximized their natural abilities.",
        skills: ['quick thinking', 'strategic adaptation', 'strengths-based leadership', 'efficiency']
      },
      {
        id: 'c',
        action: "Rally the entire cast to provide extra support and create a collaborative rehearsal environment",
        leadershipStyle: 'Team Builder',
        outcome: "The collective support creates an even stronger performance than originally planned.",
        skills: ['team mobilization', 'collaborative leadership', 'crisis response', 'collective efficacy']
      },
      {
        id: 'd',
        action: "Reimagine the role to create something uniquely suited to the understudy's artistic voice",
        leadershipStyle: 'Adaptive Visionary',
        outcome: "The performance becomes a breakthrough moment that redefines the piece in a powerful way.",
        skills: ['creative leadership', 'innovation under pressure', 'artistic vision', 'transformation']
      }
    ]
  },
  {
    id: 3,
    title: "The Creative Conflict",
    situation: "Two choreographers have completely different visions for a collaborative piece, and tensions are rising.",
    danceContext: "You've navigated creative differences in collaborative dance projects before.",
    options: [
      {
        id: 'a',
        action: "Facilitate individual conversations to understand each person's core concerns and motivations",
        leadershipStyle: 'Supportive Mentor',
        outcome: "By addressing underlying needs, you help them find common ground and mutual respect.",
        skills: ['active listening', 'conflict mediation', 'emotional intelligence', 'relationship building']
      },
      {
        id: 'b',
        action: "Propose a structured process for combining elements from both visions systematically",
        leadershipStyle: 'Strategic Coach',
        outcome: "The methodical approach creates a stronger piece that incorporates the best of both ideas.",
        skills: ['process design', 'systematic thinking', 'integration skills', 'structured problem-solving']
      },
      {
        id: 'c',
        action: "Organize a collaborative workshop where the entire team can contribute to finding solutions",
        leadershipStyle: 'Team Builder',
        outcome: "The inclusive process generates innovative solutions and strengthens team cohesion.",
        skills: ['facilitation', 'inclusive decision-making', 'collective creativity', 'democratic leadership']
      },
      {
        id: 'd',
        action: "Suggest creating two distinct sections that showcase each vision, connected by a unifying theme",
        leadershipStyle: 'Adaptive Visionary',
        outcome: "The contrasting sections create a more dynamic and interesting artistic statement.",
        skills: ['creative synthesis', 'artistic vision', 'innovative thinking', 'aesthetic leadership']
      }
    ]
  }
];

const leadershipResults: { [key: string]: LeadershipResult } = {
  'Supportive Mentor': {
    primaryStyle: 'The Supportive Mentor',
    description: 'You lead through empathy, individual development, and creating safe spaces for growth. Your dance experience taught you that everyone has potential that can be unlocked with the right support.',
    strengths: ['Building confidence in others', 'One-on-one development', 'Creating psychological safety', 'Emotional intelligence', 'Patient guidance'],
    workplaceApplications: ['Team coaching and development', 'Onboarding new employees', 'Performance management', 'Conflict resolution', 'Change management support'],
    icon: <Heart size={24} color="#E2DED0" />,
    color: '#928490'
  },
  'Strategic Coach': {
    primaryStyle: 'The Strategic Coach',
    description: 'You lead through systematic thinking, process improvement, and strategic problem-solving. Dance taught you to break down complex movements into learnable components.',
    strengths: ['Process optimization', 'Strategic planning', 'Systematic problem-solving', 'Skills development', 'Performance improvement'],
    workplaceApplications: ['Project management', 'Process improvement', 'Training program design', 'Strategic planning', 'Quality assurance'],
    icon: <Target size={24} color="#E2DED0" />,
    color: '#647C90'
  },
  'Team Builder': {
    primaryStyle: 'The Team Builder',
    description: 'You lead through collaboration, inclusive practices, and collective empowerment. Your ensemble experience showed you the power of unified effort.',
    strengths: ['Building team cohesion', 'Inclusive leadership', 'Collaborative decision-making', 'Conflict mediation', 'Collective motivation'],
    workplaceApplications: ['Team leadership', 'Cross-functional collaboration', 'Organizational culture development', 'Change management', 'Community building'],
    icon: <Users size={24} color="#E2DED0" />,
    color: '#5A7D7B'
  },
  'Adaptive Visionary': {
    primaryStyle: 'The Adaptive Visionary',
    description: 'You lead through creative innovation, adaptive thinking, and inspiring others with possibility. Dance taught you to see potential in every moment and person.',
    strengths: ['Creative problem-solving', 'Adaptive leadership', 'Vision casting', 'Innovation management', 'Inspirational motivation'],
    workplaceApplications: ['Innovation leadership', 'Creative direction', 'Organizational transformation', 'Product development', 'Strategic visioning'],
    icon: <Lightbulb size={24} color="#E2DED0" />,
    color: '#746C70'
  }
};

interface LeadershipExperienceProps {
  onComplete: (result: LeadershipResult) => void;
}

export default function LeadershipExperience({ onComplete }: LeadershipExperienceProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<LeadershipResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowOutcome(true);
  };

  const handleContinue = () => {
    if (!selectedOption) return;

    const newResponses = { ...responses, [currentScenario]: selectedOption };
    setResponses(newResponses);
    setSelectedOption(null);
    setShowOutcome(false);

    if (currentScenario < leadershipScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      calculateResult(newResponses);
    }
  };

  const calculateResult = (finalResponses: { [key: number]: string }) => {
    const styleScores: { [key: string]: number } = {};

    leadershipScenarios.forEach((scenario, index) => {
      const selectedOption = scenario.options.find(opt => opt.id === finalResponses[index]);
      if (selectedOption) {
        const style = selectedOption.leadershipStyle;
        styleScores[style] = (styleScores[style] || 0) + 1;
      }
    });

    const primaryStyle = Object.entries(styleScores).reduce((a, b) =>
      styleScores[a[0]] > styleScores[b[0]] ? a : b
    )[0];

    const finalResult = leadershipResults[primaryStyle];
    setResult(finalResult);
    setShowResult(true);
  };

  const goBack = () => {
    if (showOutcome) {
      setShowOutcome(false);
      setSelectedOption(null);
    } else if (currentScenario > 0) {
      setCurrentScenario(currentScenario - 1);
    }
  };

  const restartExperience = () => {
    setCurrentScenario(0);
    setResponses({});
    setShowResult(false);
    setResult(null);
    setSelectedOption(null);
    setShowOutcome(false);
  };

  if (showResult && result) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[result.color, `${result.color}CC`]}
          style={styles.resultHeader}
        >
          <View style={styles.resultIcon}>
            {result.icon}
          </View>
          <Text style={styles.resultTitle}>{result.primaryStyle}</Text>
          <Text style={styles.resultDescription}>{result.description}</Text>
        </LinearGradient>

        <ScrollView style={styles.resultContent}>
          <View style={styles.strengthsSection}>
            <Text style={styles.sectionTitle}>Your Leadership Strengths</Text>
            {result.strengths.map((strength, index) => (
              <View key={index} style={styles.strengthItem}>
                <Star size={16} color={result.color} />
                <Text style={styles.strengthText}>{strength}</Text>
              </View>
            ))}
          </View>

          <View style={styles.applicationsSection}>
            <Text style={styles.sectionTitle}>Workplace Applications</Text>
            <Text style={styles.applicationsIntro}>
              Your dance-developed leadership style translates perfectly to these professional contexts:
            </Text>
            {result.workplaceApplications.map((application, index) => (
              <View key={index} style={styles.applicationItem}>
                <ArrowRight size={14} color="#647C90" />
                <Text style={styles.applicationText}>{application}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: result.color }]}
              onPress={() => onComplete(result)}
            >
              <Text style={styles.actionButtonText}>Mark As Complete</Text>
              <ChevronRight size={16} color="#928490" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.retakeButton}
              onPress={restartExperience}
            >
              <Text style={styles.retakeButtonText}>Explore Different Scenarios</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  const scenario = leadershipScenarios[currentScenario];
  const progress = ((currentScenario + 1) / leadershipScenarios.length) * 100;
  const selectedOptionData = selectedOption ? scenario.options.find(opt => opt.id === selectedOption) : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Scenario {currentScenario + 1} of {leadershipScenarios.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {!showOutcome ? (
          <>
            <Text style={styles.scenarioTitle}>{scenario.title}</Text>

            <View style={styles.situationCard}>
              <Text style={styles.situationLabel}>The Situation:</Text>
              <Text style={styles.situationText}>{scenario.situation}</Text>
            </View>

            <View style={styles.contextCard}>
              <Text style={styles.contextLabel}>From Your Dance Experience:</Text>
              <Text style={styles.contextText}>{scenario.danceContext}</Text>
            </View>

            <Text style={styles.questionText}>How would you lead in this situation?</Text>

            <View style={styles.optionsContainer}>
              {scenario.options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionButton}
                  onPress={() => handleOptionSelect(option.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.optionText}>{option.action}</Text>
                  <View style={styles.styleTag}>
                    <Text style={styles.styleTagText}>{option.leadershipStyle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          selectedOptionData && (
            <View style={styles.outcomeContainer}>
              <Text style={styles.outcomeTitle}>Your Leadership Choice</Text>

              <View style={styles.choiceCard}>
                <Text style={styles.choiceAction}>{selectedOptionData.action}</Text>
                <View style={[styles.choiceStyleTag, { backgroundColor: '#647C90' }]}>
                  <Text style={styles.choiceStyleText}>{selectedOptionData.leadershipStyle}</Text>
                </View>
              </View>

              <View style={styles.outcomeCard}>
                <Text style={styles.outcomeLabel}>The Outcome:</Text>
                <Text style={styles.outcomeText}>{selectedOptionData.outcome}</Text>
              </View>

              <View style={styles.skillsCard}>
                <Text style={styles.skillsLabel}>Leadership Skills Demonstrated:</Text>
                <View style={styles.skillsList}>
                  {selectedOptionData.skills.map((skill, index) => (
                    <View key={index} style={styles.skillChip}>
                      <Text style={styles.skillChipText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
              >
                <Text style={styles.continueButtonText}>
                  {currentScenario < leadershipScenarios.length - 1 ? 'Next Scenario' : 'See Your Leadership Profile'}
                </Text>
                <ChevronRight size={16} color="#E2DED0" />
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>

      {(currentScenario > 0 || showOutcome) && (
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color="#647C90" />
          <Text style={styles.backButtonText}>
            {showOutcome ? 'Change Choice' : 'Previous Scenario'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DED0',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(100, 124, 144, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#647C90',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scenarioTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 22,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 20,
  },
  situationCard: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  situationLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#647C90',
    marginBottom: 8,
  },
  situationText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 24,
  },
  contextCard: {
    backgroundColor: 'rgba(100, 124, 144, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  contextLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#5A7D7B',
    marginBottom: 8,
  },
  contextText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#746C70',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  questionText: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 25,
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 22,
    marginBottom: 10,
  },
  styleTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(100, 124, 144, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  styleTagText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#647C90',
  },
  outcomeContainer: {
    paddingTop: 10,
  },
  outcomeTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 20,
  },
  choiceCard: {
    backgroundColor: 'rgba(100, 124, 144, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  choiceAction: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#4E4F50',
    marginBottom: 10,
  },
  choiceStyleTag: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  choiceStyleText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: '#E2DED0',
  },
  outcomeCard: {
    backgroundColor: 'rgba(90, 125, 123, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  outcomeLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#5A7D7B',
    marginBottom: 8,
  },
  outcomeText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 24,
  },
  skillsCard: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
  },
  skillsLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#647C90',
    marginBottom: 12,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: 'rgba(100, 124, 144, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skillChipText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#647C90',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#647C90',
    borderRadius: 12,
    padding: 16,
  },
  continueButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    marginRight: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
    marginLeft: 8,
  },
  resultHeader: {
    padding: 30,
    alignItems: 'center',
  },
  resultIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(226, 222, 208, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: '#E2DED0',
    textAlign: 'center',
    marginBottom: 15,
  },
  resultDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: 'rgba(226, 222, 208, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultContent: {
    flex: 1,
    backgroundColor: '#E2DED0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 30,
  },
  strengthsSection: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#4E4F50',
    marginBottom: 15,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  strengthText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    marginLeft: 12,
  },
  applicationsSection: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  applicationsIntro: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#746C70',
    marginBottom: 15,
    lineHeight: 20,
  },
  applicationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 10,
  },
  applicationText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#647C90',
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  actionButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    marginRight: 8,
  },
  retakeButton: {
    alignItems: 'center',
    padding: 12,
  },
  retakeButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#928490',
  },
});