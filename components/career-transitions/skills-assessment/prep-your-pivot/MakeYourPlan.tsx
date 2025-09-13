import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Target, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface PlanChoice {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface MakeYourPlanProps {
    onComplete: () => void;
    onBack?: () => void;
}

const planChoices: PlanChoice[] = [
    {
        id: 1,
        option1: 'I want to start my career change now',
        option2: 'I want to start my career change soon',
        storyKey: 'timing'
    },
    {
        id: 2,
        option1: 'I have a clear direction and goal',
        option2: 'I\'m honestly lost',
        storyKey: 'direction'
    },
    {
        id: 3,
        option1: 'I have the skills I need to pivot',
        option2: 'I\'ll need to upskill for sure',
        storyKey: 'skills'
    },
    {
        id: 4,
        option1: 'I have a strong network outside of dance',
        option2: 'I don\'t have many non-dance connections',
        storyKey: 'network'
    },
    {
        id: 5,
        option1: 'I have some savings stashed away',
        option2: 'I\'m living paycheck to paycheck',
        storyKey: 'finances'
    },
    {
        id: 6,
        option1: 'I have a Bachelor\'s degree',
        option2: 'I never went to college/university',
        storyKey: 'education'
    },
    {
        id: 7,
        option1: 'I live in a big city like New York or London',
        option2: 'I live somewhere with fewer opportunities',
        storyKey: 'location'
    },
    {
        id: 8,
        option1: 'I have a support system around me',
        option2: 'I\'m pretty isolated at the moment',
        storyKey: 'support'
    },
    {
        id: 9,
        option1: 'I\'ve worked on my non-dance resume already',
        option2: 'I still only have a dance resume',
        storyKey: 'resume'
    },
    {
        id: 10,
        option1: 'I feel ready to take on my pivot',
        option2: 'I\'m nervous about starting this career change',
        storyKey: 'readiness'
    }
];

export default function MakeYourPlan({ onComplete, onBack }: MakeYourPlanProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-10 = choices, 11+ = story
    const [choices, setChoices] = useState<{ [key: string]: string }>({});
    const [randomizedChoices, setRandomizedChoices] = useState<PlanChoice[]>([]);

    useEffect(() => {
        // Randomize the order of choices when component mounts
        const shuffled = [...planChoices].sort(() => Math.random() - 0.5);
        setRandomizedChoices(shuffled);
    }, []);

    const handleStartGame = () => {
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
        } else if (currentScreen > 1) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    const handleChoice = (choiceKey: string, selectedOption: string) => {
        const newChoices = { ...choices, [choiceKey]: selectedOption };
        setChoices(newChoices);

        if (currentScreen < 10) {
            setCurrentScreen(currentScreen + 1);
        } else {
            // Skip to story screen 12 (Make Your Plan)
            setCurrentScreen(12);
        }
    };

    const handleContinueStory = () => {
        if (currentScreen < 18) {
            setCurrentScreen(currentScreen + 1);
        } else {
            onComplete();
        }
    };

    const getStoryText = (screenNumber: number) => {
        switch (screenNumber) {
            case 12:
                return "Make Your Plan";
            case 13:
                return `${choices.timing === 'I want to start my career change now' ? 'You\'re ready to start your career change which is so exciting.' : 'You\'re not quite ready to start your career change which is completely ok.'} ${choices.direction === 'I have a clear direction and goal' ? 'And the good news is, you have a clear vision for your future with a solid goal to aim for.' : 'But you\'re feeling a little lost and directionless. Start with your interests and values to discover what path you might want to go down.'}`;
            case 14:
                return `${choices.skills === 'I have the skills I need to pivot' ? 'You already have the skills you need to launch your next career.' : 'You\'ll definitely need to upskill so YouTube, Skillshare, and Udemy will become your best friends.'} ${choices.network === 'I have a strong network outside of dance' ? 'And your strong connections outside of dance will be so important in this transition. Reach out to your network!' : 'But, it\'s important to start building a network outside of dance. Go to events, find an internship, or talk to people in other departments at work.'} It's the best way to find new opportunities!`;
            case 15:
                return `${choices.finances === 'I have some savings stashed away' ? 'Your savings will be a godsend during your transition. Invest in courses and networking events to give yourself a leg up.' : 'It\'s tough living paycheck to paycheck, but now\'s the time to really cut back on expenses and save up as much as humanly possible.'} ${choices.education === 'I have a Bachelor\'s degree' ? 'And since you already have a degree, leverage it in your new career. Completing a degree is an accomplishment in and of itself, regardless of the subject matter.' : 'And no degree? Start with free and low-cost learning options like YouTube and Udemy first. Then, if you\'re in the U.S., check out the LEAP program which offers college credit for professional dance experience!'}`;
            case 16:
                return `${choices.location === 'I live in a big city like New York or London' ? 'In a big city, the opportunities are boundless. Get out there!' : 'In a place with fewer opportunities, consider remote work to get your foot in the door with bigger companies.'} ${choices.support === 'I have a support system around me' ? 'You\'ll also want to prep your support system that you\'re embarking on a big change. You\'re going to need them!' : 'Focus on building your relationships now. A strong support system is key to any major life change.'}`;
            case 17:
                return `${choices.resume === 'I\'ve worked on my non-dance resume already' ? 'Your muggle resume is locked and loaded. Good work!' : 'Find the transferable skills within your dance resume and find a Canva template to bring your muggle resume to life!'} ${choices.readiness === 'I feel ready to take on my pivot' ? 'You are SO ready to step onto your next stage!' : 'It\'s ok to be nervous but what if you reframed that feeling into excitement? Nerves just mean that something is important to you and you\'re stepping into the unknown. Give yourself permission to take the next step.'}`;
            case 18:
                return "Now you have a game plan and all that's left to do is follow-through. You know what you have to work on so it's time to get going! Go deeper with our Happy Trials, a 5-year career change roadmap for before, during, and after your pivot.";
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
                        <Target size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Make a Plan</Text>

                    <Text style={styles.introDescription}>
                        Choose the answer that best describes your situation to help you create your career game plan. But there's no right or wrong! It's just your starting point and we'll build from there.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Let's plan</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Choice Screens (1-10)
    if (currentScreen >= 1 && currentScreen <= 10) {
        const choiceIndex = currentScreen - 1;
        const currentChoice = randomizedChoices[choiceIndex];

        if (!currentChoice) return null;

        return (
            <View style={styles.container}>
                <View style={styles.choiceHeader}>
                    <Text style={styles.choiceProgress}>
                        {currentScreen} of 10
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(currentScreen / 10) * 100}%` }]} />
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.choiceContainer}>
                    <View style={styles.choiceButtons}>
                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoice(currentChoice.storyKey, currentChoice.option1)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.choiceButtonText}>{currentChoice.option1}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoice(currentChoice.storyKey, currentChoice.option2)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.choiceButtonText}>{currentChoice.option2}</Text>
                        </TouchableOpacity>
                    </View>
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

    // Story Screens (12-18)
    if (currentScreen >= 12 && currentScreen <= 18) {
        const storyText = getStoryText(currentScreen);
        const isTitle = currentScreen === 12;
        const isFinal = currentScreen === 18;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.storyContainer}>
                    {isFinal && (
                        <Text style={styles.finalHeading}>Start Your Pivot</Text>
                    )}

                    {isTitle ? (
                        <Text style={styles.storyTitle}>{storyText}</Text>
                    ) : (
                        <Text style={styles.storyText}>{storyText}</Text>
                    )}

                    {isFinal && (
                        <Text style={styles.alternativeClosing}>
                            Ready to dive deeper into your career change?
                        </Text>
                    )}

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinueStory}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.continueButtonText}>
                                {isFinal ? 'Learn more' : 'Continue'}
                            </Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>

                    {isFinal && (
                        <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
                            <View
                                style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
                            >
                                <Text style={styles.completeButtonText}>Mark As Complete</Text>
                                <ChevronRight size={16} color="#E2DED0" />
                            </View>
                        </TouchableOpacity>
                    )}
                </ScrollView>
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
    alternativeClosing: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
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
        fontSize: 32,
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
        fontStyle: 'italic',
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
    choiceHeader: {
        padding: 20,
        paddingTop: 60,
        alignItems: 'center',
    },
    choiceProgress: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#647C90',
        marginBottom: 10,
    },
    progressBar: {
        width: '80%',
        height: 6,
        backgroundColor: 'rgba(100, 124, 144, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#928490',
        borderRadius: 3,
    },
    choiceContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    choiceButtons: {
        gap: 20,
    },
    choiceButton: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        borderWidth: 2,
        borderColor: 'transparent',
        minHeight: 80,
        justifyContent: 'center',
    },
    choiceButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
    },
    storyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    storyTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 40,
    },
    storyText: {
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
        marginBottom: 20,
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
    secondaryButton: {
        alignSelf: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    secondaryButtonText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        textDecorationLine: 'underline',
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
    finalHeading: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
        width: '100%',
    },
    completeButton: {
        borderRadius: 12,
        overflow: 'hidden',
        alignSelf: 'center',
        width: 'auto',
    },
    completeButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    completeButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
    },
});