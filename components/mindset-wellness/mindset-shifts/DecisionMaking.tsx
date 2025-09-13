import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Sparkles, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface DecisionTactic {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface DecisionMakingProps {
    onComplete: () => void;
    onBack?: () => void;
}

const decisionTactics: DecisionTactic[] = [
    {
        id: 1,
        option1: 'Break a problem down into smaller chunks',
        option2: 'Brainstorm multiple potential solutions',
        storyKey: 'novelProblem'
    },
    {
        id: 2,
        option1: 'Keep asking "Why?" to get to the root of an issue',
        option2: 'Zoom out and imagine how your Ideal Self would decide',
        storyKey: 'rootIssue'
    },
    {
        id: 3,
        option1: 'List the pros and cons',
        option2: 'Talk it out with a trusted friend',
        storyKey: 'analysis'
    },
    {
        id: 4,
        option1: 'Make the best choice you can and adjust later',
        option2: 'Gather more info before acting',
        storyKey: 'flexibleApproach'
    },
    {
        id: 5,
        option1: 'Note your gut instinct, but pause before acting',
        option2: 'Research what\'s worked for others',
        storyKey: 'balancedApproach'
    },
    {
        id: 6,
        option1: 'Start with the easiest task',
        option2: 'Tackle the hardest task first',
        storyKey: 'progress'
    },
    {
        id: 7,
        option1: 'Sleep on it and revisit tomorrow',
        option2: 'Fail fast, learn from mistakes, and move forward',
        storyKey: 'reflection'
    }
];

export default function DecisionMaking({ onComplete, onBack }: DecisionMakingProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-7 = choices, 8-15 = story, 16 = result
    const [choices, setChoices] = useState<{ [key: string]: string }>({});
    const [randomizedTactics, setRandomizedTactics] = useState<DecisionTactic[]>([]);

    useEffect(() => {
        // Randomize the order of tactics when component mounts
        const shuffled = [...decisionTactics].sort(() => Math.random() - 0.5);
        setRandomizedTactics(shuffled);
    }, []);

    const handleStartPractice = () => {
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

        if (currentScreen < 7) {
            setCurrentScreen(currentScreen + 1);
        } else {
            // Move to the first story screen
            setCurrentScreen(8);
        }
    };

    const handleContinueStory = () => {
        if (currentScreen < 15) {
            setCurrentScreen(currentScreen + 1);
        } else {
            // Move to the result screen
            setCurrentScreen(16);
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    const getStoryText = (screenNumber: number) => {
        switch (screenNumber) {
            case 8:
                return `You have a novel problem and tried ${choices.novelProblem?.toLowerCase()}. You instantly feel less overwhelmed. Sometimes, clarity comes just from starting somewhere.`;
            case 9:
                return `You ${choices.rootIssue?.toLowerCase()}, and suddenly the heart of the matter was obvious. Decisions can feel less scary when you dig a bit deeper.`;
            case 10:
                return `You ${choices.analysis?.toLowerCase()} and noticed that what feels the best in the moment might not always produce the outcome you want in the long run.`;
            case 11:
                return `You ${choices.flexibleApproach?.toLowerCase()}, proving to yourself that there isn't one perfect way to make a decision. There are many "right" answers.`;
            case 12:
                return `You ${choices.balancedApproach?.toLowerCase()}, balancing intuition and wisdom, and honoring the fact that we don't know all the answers.`;
            case 13:
                return `You ${choices.progress?.toLowerCase()} and finally made progress. Inertia is powerful and following through on a decision is half the battle.`;
            case 14:
                return `You ${choices.reflection?.toLowerCase()} and realized that different decisions call for different strategies. There's freedom in accepting that there are no rules when it comes to building your life on your terms.`;
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
                        <Sparkles size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Decision-Making Practice</Text>

                    <Text style={styles.introDescription}>
                        As dancers, you know how to follow directions. But now, you're the choreographer of your choices.
                        {'\n\n'}
                        Beware: This isn't about making the perfect decision (no such thing), but about learning different ways to problem solve. Because the truth is, by following the dance path, there's a chance you've never really made a decision for yourself that wasn't based on the path laid out for you.
                        {'\n\n'}
                        Swipe through and pick a decision-making tactic that makes the most sense to you. There's no right or wrong!
                    </Text>
                    <TouchableOpacity style={styles.startButton} onPress={handleStartPractice}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Start practicing</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Choice Screens (1-7)
    if (currentScreen >= 1 && currentScreen <= 7) {
        const choiceIndex = currentScreen - 1;
        const currentTactic = randomizedTactics[choiceIndex];

        if (!currentTactic) return null;

        return (
            <View style={styles.container}>
                <View style={styles.choiceHeader}>
                    <Text style={styles.choiceProgress}>
                        {currentScreen} of 7
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(currentScreen / 7) * 100}%` }]} />
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.choiceContainer}>
                    <View style={styles.choiceButtons}>
                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoice(currentTactic.storyKey, currentTactic.option1)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.choiceButtonText}>{currentTactic.option1}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoice(currentTactic.storyKey, currentTactic.option2)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.choiceButtonText}>{currentTactic.option2}</Text>
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

    // Story Screens (8-15)
    if (currentScreen >= 8 && currentScreen <= 15) {
        const storyText = getStoryText(currentScreen);
        const isFinalStory = currentScreen === 15;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.storyContainer}>
                    <Text style={styles.storyText}>{storyText}</Text>

                    <Text style={styles.alternativeClosing}>
                        {isFinalStory ? '→ swipe to screen 16' : `→ swipe to screen ${currentScreen + 1}`}
                    </Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinueStory}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.continueButtonText}>
                                {isFinalStory ? 'See results' : 'Continue'}
                            </Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Result Screen (16)
    if (currentScreen === 16) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <Sparkles size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Decision-Making is a Skill</Text>

                    <Text style={styles.introDescription}>
                        And it's a skill that many dancers haven't mastered. As you embark on the challenge of deciding which path to take post-dance, refer to these tactics to help you move more towards the life you really want.
                        {'\n\n'}
                        The more you practice, the more you'll trust yourself to choose (and to adjust when needed).
                        {'\n\n'}
                        See you tomorrow!
                    </Text>
                    <TouchableOpacity style={styles.startButton} onPress={handleComplete}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Mark as Complete</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
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
        marginBottom: 40,
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