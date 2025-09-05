import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Users, Heart, ArrowLeft, ChevronLeft } from 'lucide-react-native';
interface RoleplayScenarioProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function RoleplayScenario({ onComplete, onBack }: RoleplayScenarioProps) {
  const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1 = scenario, 2 = choices, 3 = response, 4 = follow-up, 5 = alternative
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const handleStartRoleplay = () => {
    setCurrentScreen(1);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const goBack = () => {
    if (currentScreen === 1) {
      setCurrentScreen(0);
    } else if (currentScreen > 1 && currentScreen <= 5) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleChoiceSelect = (choiceNumber: number) => {
    setSelectedChoice(choiceNumber);
    setCurrentScreen(3);
  };

  const handleContinue = () => {
    if (currentScreen === 3) {
      setCurrentScreen(4);
    } else if (currentScreen === 4) {
      setCurrentScreen(5);
    } else if (currentScreen === 5) {
      onComplete();
    } else {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const getResponseText = () => {
    switch (selectedChoice) {
      case 1:
        return "The best part of this is that you have clarity! Dance comes first and that's ok. But let's see where that could lead.";
      case 2:
        return "You seem to be prioritizing your friends and family which is nice to see! But your dance career is making it difficult to show up in all the ways you'd like to.";
      case 3:
        return "Your finances are in order and you know you want to be there for your friend's big day. But guilt and pressure are piling on. So no matter what you do, you're conflicted.";
      default:
        return "";
    }
  };

  const getFollowUpText = () => {
    switch (selectedChoice) {
      case 1:
        return "There's a possibility that you could look back and realize that you missed out on the important stuff. Family, friends, relationships… that's really what life is all about and it's what matters in the end. It's easy to feel like dance will never let you down like people might, but the truth is, dance isn't a person who can love you back either. Only the people you pour your time and effort into can do that.";
      case 2:
        return "We all know that dance careers are hardly financially lucrative. We're not in it for the money and that's ok. But when it comes to big life events like your best friend's wedding, you feel strapped for cash and restricted to the bare minimum. While you don't need to be rolling in the dough, what if there was another way?";
      case 3:
        return "Your dance career has put you between a rock and a hard place. The lifestyle and expectations that come with being a professional dancer are making it harder and harder to do the things that truly matter to you. You don't want to let go of dance, but you want don't want to feel pressure to choose between having a normal life and being successful in your career.";
      default:
        return "";
    }
  };

  // Intro Screen
  if (currentScreen === 0) {
    return (
      <View style={styles.container}>
        {onBack && (
          <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
            <ArrowLeft size={28} color="#647C90" />
          </TouchableOpacity>
        )}
        <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
          <View style={styles.introIcon}>
            <Users size={32} color="#928490" />
          </View>
          
          <Text style={styles.introTitle}>What's the alternative?</Text>
          
          <Text style={styles.introDescription}>
            Let's walk through a common scenario you may find yourself in if you continue down the path of professional dance. Choose what you'd be most likely to do in this scenario and we'll shed light on an alternative and show you that you have more options than you might think.
          </Text>

          <TouchableOpacity style={styles.startButton} onPress={handleStartRoleplay}>
            <View
              style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
            >
              <Text style={styles.startButtonText}>Begin</Text>
              <ChevronRight size={16} color="#E2DED0" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Scenario Screen
  if (currentScreen === 1) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={styles.scenarioContainer}>
          <Text style={styles.introTitle}>Imagine This</Text>
          <Text style={styles.scenarioText}>
            It's a year in the future and you just booked your next dance contract. You open the mail to discover one of your best childhood friends is getting married in the Bahamas in a few months and you're invited. What do you do?
          </Text>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <View
              style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
            >
              <Text style={styles.continueButtonText}>What will you do?</Text>
              <ChevronRight size={16} color="#E2DED0" />
            </View>
          </TouchableOpacity>
        </ScrollView>
         <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color="#647C90" />
            <Text style={styles.backButtonText}>
              {currentScreen === 1 ? 'Back to Intro' : 'Previous'}
            </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Choices Screen
  if (currentScreen === 2) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={styles.choicesScreenContainer}>
          <View style={styles.choicesContainer}>
            <Text style={styles.alternativeTitle}>Here are your Options</Text>
            <TouchableOpacity
              style={styles.choiceButton}
              onPress={() => handleChoiceSelect(1)}
              activeOpacity={0.8}
            >
              <Text style={styles.choiceText}>
                Respectfully decline the invitation. Your dance career comes first. It's a no-brainer.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.choiceButton}
              onPress={() => handleChoiceSelect(2)}
              activeOpacity={0.8}
            >
              <Text style={styles.choiceText}>
                You can't <Text style={{fontStyle: 'italic'}}>really</Text> afford it but you plan to go, of course. That's what swings are for! You'll think about the financial consequences later…
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.choiceButton}
              onPress={() => handleChoiceSelect(3)}
              activeOpacity={0.8}
            >
              <Text style={styles.choiceText}>
                You have enough savings to cover the trip but you're nervous to ask your director for the time off so early into the contract.
              </Text>
            </TouchableOpacity>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color="#647C90" />
            <Text style={styles.backButtonText}>
              {currentScreen === 1 ? 'Back to Intro' : 'Previous'}
            </Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Response Screen
  if (currentScreen === 3) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={styles.responseContainer}>
          <Text style={styles.alternativeTitle}>Here's where you're at</Text>
          <Text style={styles.responseText}>{getResponseText()}</Text>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <View
              style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <ChevronRight size={16} color="#E2DED0" />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color="#647C90" />
            <Text style={styles.backButtonText}>
              {currentScreen === 1 ? 'Back to Intro' : 'Previous'}
            </Text>
          </TouchableOpacity>
      </View>
    );
  }

  // Follow-up Screen
  if (currentScreen === 4) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={styles.followUpContainer}>
          <Text style={styles.alternativeTitle}>Here's your situation</Text>
          <Text style={styles.followUpText}>{getFollowUpText()}</Text>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <View
            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
          >
            <Text style={styles.continueButtonText}>See the Alternative</Text>
            <ChevronRight size={16} color="#E2DED0" />
          </View>
        </TouchableOpacity>
        </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color="#647C90" />
            <Text style={styles.backButtonText}>
              {currentScreen === 1 ? 'Back to Intro' : 'Previous'}
            </Text>
          </TouchableOpacity>
      </View>
    );
  }

  // Alternative Screen
  if (currentScreen === 5) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={styles.alternativeContainer}>
          <View style={styles.alternativeIcon}>
            <Heart size={32} color="#5A7D7B" />
          </View>
          
          <Text style={styles.alternativeTitle}>So, what's the alternative?</Text>
          
          <Text style={styles.alternativeText}>
            You finish off your dance contract on your terms, retiring with grace and dignity. You've started in a new career making more money than ever with three weeks of paid time off. You take dance class every Thursday and spend your weekends trying different hobbies.
          </Text>

          <Text style={styles.alternativeText}>
            You get invited to your childhood friend's wedding in the Bahamas and you immediately RSVP. You pay for everything in full (no credit cards needed!) and use your PTO with no hassle from your boss. (In fact, you're slightly freaking out in the inside about getting PAID to go on vacation!)
          </Text>

          <Text style={styles.alternativeText}>
            You have the best time seeing old friends and celebrating this once in a lifetime event with the memories to prove it. You're still living the dream. How does that sound?
          </Text>

          <Text style={styles.alternativeClosing}>
            See you for more tomorrow.
          </Text>

          <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
            <View
              style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
            >
              <Text style={styles.completeButtonText}>Mark As Complete</Text>
              <ChevronRight size={16} color="#E2DED0" />
            </View>
          </TouchableOpacity>
        </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color="#647C90" />
            <Text style={styles.backButtonText}>
              {currentScreen === 1 ? 'Back to Intro' : 'Previous'}
            </Text>
          </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DED0',
  },
  topBackButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  introContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  introIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  introTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 20,
  },
  introDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#746C70',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  startButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#E2DED0',
    marginRight: 8,
  },
  scenarioContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  scenarioText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  continueButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#E2DED0',
    marginRight: 8,
  },
  choicesTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  choicesContainer: {
    paddingHorizontal: 24,
    gap: 15,
  },
  choicesScreenContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  choiceButton: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  choiceText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    lineHeight: 22,
    textAlign: 'center',
  },
  responseContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  responseText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  followUpContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  followUpText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  alternativeContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  alternativeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(90, 125, 123, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  alternativeTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#4E4F50',
    textAlign: 'center',
    marginBottom: 25,
  },
  alternativeText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#4E4F50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  alternativeClosing: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#647C90',
    textAlign: 'center',
    marginBottom: 40,
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  completeButtonText: {
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
});