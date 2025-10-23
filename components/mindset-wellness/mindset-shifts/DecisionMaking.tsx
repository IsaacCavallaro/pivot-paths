import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
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

const { width, height } = Dimensions.get('window');

const decisionTactics: DecisionTactic[] = [
    { id: 1, option1: 'Break a problem down into smaller chunks', option2: 'Brainstorm multiple potential solutions', storyKey: 'novelProblem' },
    { id: 2, option1: 'Keep asking "Why?" to get to the root of an issue', option2: 'Zoom out and imagine how your Ideal Self would decide', storyKey: 'rootIssue' },
    { id: 3, option1: 'List the pros and cons', option2: 'Talk it out with a trusted friend', storyKey: 'analysis' },
    { id: 4, option1: 'Make the best choice you can and adjust later', option2: 'Gather more info before acting', storyKey: 'flexibleApproach' },
    { id: 5, option1: 'Note your gut instinct, but pause before acting', option2: 'Research what\'s worked for others', storyKey: 'balancedApproach' },
    { id: 6, option1: 'Start with the easiest task', option2: 'Tackle the hardest task first', storyKey: 'progress' },
    { id: 7, option1: 'Sleep on it and revisit tomorrow', option2: 'Fail fast, learn from mistakes, and move forward', storyKey: 'reflection' }
];

export default function DecisionMaking({ onComplete, onBack }: DecisionMakingProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-7 = choices, 8 = result
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
            // Move directly to the result screen
            setCurrentScreen(8);
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    // Intro Screen
    if (currentScreen === 0) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Decision-Making Practice</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <Sparkles size={32} color="#E2DED0" />
                                </View>
                            </View>
                            <Text style={styles.introTitle}>Decision-Making Practice</Text>
                            <Text style={styles.introDescription}>
                                As dancers, you know how to follow directions. But now, you're the choreographer of your choices.
                                {'\n\n'}
                                Beware: This isn't about making the perfect decision (no such thing), but about learning different ways to problem solve. Because the truth is, by following the dance path, there's a chance you've never really made a decision for yourself that wasn't based on the path laid out for you.
                                {'\n\n'}
                                Swipe through and pick a decision-making tactic that makes the most sense to you. There's no right or wrong!
                            </Text>
                            <TouchableOpacity style={styles.startButton} onPress={handleStartPractice} activeOpacity={0.8}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Start practicing</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
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
                {/* Sticky Header with Progress */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.progressText}>{currentScreen} of 7</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(currentScreen / 7) * 100}%` }]} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.choiceCard}>
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
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Result Screen (8)
    if (currentScreen === 8) {
        return (
            <View style={styles.container}>
                <View style={styles.storyBackground}>
                    <View style={styles.storyBackgroundPattern} />
                </View>

                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backButton} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Decision-Making</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.storyCard}>
                            <View style={styles.finalHeader}>
                                <Sparkles size={24} color="#928490" />
                                <Text style={styles.finalHeading}>Decision-Making is a Skill</Text>
                                <Sparkles size={24} color="#928490" />
                            </View>
                            <View style={styles.storyTextContainer}>
                                <Text style={styles.storyText}>
                                    And it's a skill that many dancers haven't mastered. As you embark on the challenge of deciding which path to take post-dance, refer to these tactics to help you move more towards the life you really want.
                                    {'\n\n'}
                                    The more you practice, the more you'll trust yourself to choose (and to adjust when needed).
                                </Text>
                            </View>
                            <Text style={styles.alternativeClosing}>
                                See you for more tomorrow
                            </Text>
                            <TouchableOpacity style={styles.continueButton} onPress={handleComplete} activeOpacity={0.8}>
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.continueButtonText}>Mark as Complete</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    storyBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    storyBackgroundPattern: {
        flex: 1,
        opacity: 0.03,
        backgroundColor: '#928490',
        transform: [{ rotate: '45deg' }, { scale: 1.5 }],
    },
    stickyHeader: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    scrollView: {
        flex: 1,
        marginTop: 100,
        zIndex: 1,
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: height - 200,
        paddingBottom: 30,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 28,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    titleText: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 25,
        color: '#E2DED0',
        textAlign: 'center',
    },
    progressText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#E2DED0',
        textAlign: 'center',
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(226, 222, 208, 0.3)',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 12,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#E2DED0',
        borderRadius: 3,
    },
    introCard: {
        width: width * 0.85,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
        marginTop: 60,
    },
    introIconContainer: {
        marginBottom: 24,
    },
    introIconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    introTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 32,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#928490',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        fontStyle: 'italic',
    },
    startButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    startButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E2DED0',
    },
    startButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
    choiceCard: {
        width: width * 0.85,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
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
    storyCard: {
        width: width * 0.85,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
    },
    storyTextContainer: {
        width: '100%',
        marginBottom: 32,
    },
    storyText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 28,
    },
    continueButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    continueButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E2DED0',
        minWidth: width * 0.5,
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        marginTop: 5,
        fontWeight: '600',
    },
    finalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        gap: 12,
    },
    finalHeading: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '700',
    },
});