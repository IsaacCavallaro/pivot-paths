import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight, Sparkles, ArrowLeft, Check } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { useStorage } from '@/hooks/useStorage';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

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
    { id: 1, option1: 'Break a problem down into smaller chunks', option2: 'Brainstorm multiple potential solutions', storyKey: 'novelProblem' },
    { id: 2, option1: 'Keep asking "Why?" to get to the root of an issue', option2: 'Zoom out and imagine how your Ideal Self would decide', storyKey: 'rootIssue' },
    { id: 3, option1: 'List the pros and cons', option2: 'Talk it out with a trusted friend', storyKey: 'analysis' },
    { id: 4, option1: 'Make the best choice you can and adjust later', option2: 'Gather more info before acting', storyKey: 'flexibleApproach' },
    { id: 5, option1: 'Note your gut instinct, but pause before acting', option2: 'Research what\'s worked for others', storyKey: 'balancedApproach' },
    { id: 6, option1: 'Start with the easiest task', option2: 'Tackle the hardest task first', storyKey: 'progress' },
    { id: 7, option1: 'Sleep on it and revisit tomorrow', option2: 'Fail fast, learn from mistakes, and move forward', storyKey: 'reflection' }
];

export default function DecisionMaking({ onComplete, onBack }: DecisionMakingProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [randomizedTactics, setRandomizedTactics] = useState<DecisionTactic[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('mindset-shifts');
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('mindset-shifts');
    const [decisionChoices, setDecisionChoices] = useStorage<{ [key: string]: string }>('DECISION_MAKING_CHOICES', {});

    useEffect(() => {
        const shuffled = [...decisionTactics].sort(() => Math.random() - 0.5);
        setRandomizedTactics(shuffled);
    }, []);

    const handleStartPractice = () => {
        setCurrentScreen(0);
        scrollToTop();
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const goBack = () => {
        if (currentScreen === -1) {
            if (onBack) onBack();
        } else if (currentScreen === 0) {
            setCurrentScreen(-1);
        } else if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1 && currentScreen <= 7) {
            setCurrentScreen(currentScreen - 1);
        }
        scrollToTop();
    };

    const handleChoice = async (choiceKey: string, selectedOption: string) => {
        setSelectedOption(selectedOption);

        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 150));

        const newChoices = { ...decisionChoices, [choiceKey]: selectedOption };
        await setDecisionChoices(newChoices);

        if (currentScreen < 7) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
        } else {
            setCurrentScreen(9);
        }
        scrollToTop();
        setIsTransitioning(false);
    };

    const handleContinue = async () => {
        if (selectedOption === null || isTransitioning) return;

        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 150));

        const choiceIndex = currentScreen - 1;
        const currentTactic = randomizedTactics[choiceIndex];

        if (currentTactic) {
            const newChoices = { ...decisionChoices, [currentTactic.storyKey]: selectedOption };
            await setDecisionChoices(newChoices);
        }

        if (currentScreen < 7) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
        } else {
            setCurrentScreen(9);
        }
        scrollToTop();
        setIsTransitioning(false);
    };

    const handleContinueStory = () => {
        if (currentScreen < 8) {
            setCurrentScreen(currentScreen + 1);
        } else if (currentScreen === 8) {
            setCurrentScreen(9);
        } else {
            onComplete();
        }
        scrollToTop();
    };

    // NEW: Intro Screen with Morning Journal
    if (currentScreen === -1) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={handleBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={commonStyles.introTitle}>Decision-Making Practice</Text>

                            <Text style={commonStyles.introDescription}>
                                As dancers, you know how to follow directions. But now, you're the choreographer of your choices.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                This isn't about making the perfect decision (no such thing), but about learning different ways to problem solve. Because the truth is, by following the dance path, there's a chance you've never really made a decision for yourself that wasn't based on the path laid out for you.
                            </Text>

                            <JournalEntrySection
                                pathTag="mindset-shifts"
                                day="3"
                                category="Mindset and Wellness"
                                pathTitle="Mindset Shifts"
                                dayTitle="Decision Making"
                                journalInstruction="Before we begin, let's take a moment to check in with yourself. How are you feeling about making decisions for your future?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Continue" onPress={handleStartPractice} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Original Intro Screen (now screen 0)
    if (currentScreen === 0) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={commonStyles.introTitle}>Decision-Making Practice</Text>

                            <Text style={commonStyles.introDescription}>
                                Swipe through and pick a decision-making tactic that makes the most sense to you. There's no right or wrong!
                                {'\n\n'}
                                Beware: This isn't about making the perfect decision (no such thing), but about learning different ways to problem solve.
                            </Text>

                            <PrimaryButton title="Start practicing" onPress={() => setCurrentScreen(1)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Choice Screens (1-7) - UPDATED WITH HIGHLIGHT AND CONTINUE BUTTON
    if (currentScreen >= 1 && currentScreen <= 7) {
        const choiceIndex = currentScreen - 1;
        const currentTactic = randomizedTactics[choiceIndex];

        if (!currentTactic) return null;

        return (
            <View style={commonStyles.container}>
                <StickyHeader
                    onBack={goBack}
                    title={`${currentScreen} of 7`}
                    progress={currentScreen / 7}
                />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={styles.choiceButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedOption === currentTactic.option1 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => setSelectedOption(currentTactic.option1)}
                                    activeOpacity={0.8}
                                    disabled={isTransitioning}
                                >
                                    <View style={styles.optionContent}>
                                        {selectedOption === currentTactic.option1 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceButtonText,
                                            selectedOption === currentTactic.option1 && styles.choiceButtonTextSelected
                                        ]}>
                                            {currentTactic.option1}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedOption === currentTactic.option2 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => setSelectedOption(currentTactic.option2)}
                                    activeOpacity={0.8}
                                    disabled={isTransitioning}
                                >
                                    <View style={styles.optionContent}>
                                        {selectedOption === currentTactic.option2 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceButtonText,
                                            selectedOption === currentTactic.option2 && styles.choiceButtonTextSelected
                                        ]}>
                                            {currentTactic.option2}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinue}
                                disabled={selectedOption === null || isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Result Screen (now screen 8)
    if (currentScreen === 8) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={styles.finalHeader}>
                                <Sparkles size={24} color="#928490" />
                                <Text style={styles.finalHeading}>Decision-Making is a Skill</Text>
                                <Sparkles size={24} color="#928490" />
                            </View>

                            <View style={styles.storyTextContainer}>
                                <Text style={styles.storyText}>
                                    And it's a skill that many dancers haven't mastered. As you embark on the challenge of deciding which path to take post-dance, refer to these tactics to help you move more towards the life you really want.
                                </Text>

                                <Text style={styles.storyText}>
                                    The more you practice, the more you'll trust yourself to choose (and to adjust when needed).
                                </Text>
                            </View>

                            <PrimaryButton title="Continue" onPress={handleContinueStory} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen (now screen 9) with End of Day Journal
    if (currentScreen === 9) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <View style={styles.storyTextContainer}>
                                <Text style={styles.storyText}>
                                    Take a moment to reflect on today's decision-making practice. Which tactics resonated with you the most?
                                </Text>

                                <Text style={styles.storyText}>
                                    Remember that decision-making is like any other skill - it improves with practice and patience.
                                </Text>

                                <Text style={styles.storyText}>
                                    Every choice you make, big or small, is strengthening your ability to navigate life beyond dance.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="mindset-shifts"
                                journalInstruction="Before we bring today's session to a close, let's take a moment to check in with yourself again. How are you feeling about your decision-making abilities after today's practice?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.alternativeClosing}>
                                See you for more tomorrow
                            </Text>

                            <PrimaryButton
                                title="Mark As Complete"
                                onPress={onComplete}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
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
    choiceButtonSelected: {
        backgroundColor: 'rgba(146, 132, 144, 0.3)',
        borderColor: '#928490',
        borderWidth: 2,
    },
    choiceButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
    },
    choiceButtonTextSelected: {
        color: '#4E4F50',
        fontWeight: '600',
    },
    optionContent: {
        paddingRight: 40,
    },
    selectedIndicator: {
        position: 'absolute',
        top: '50%',
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#928490',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: -12 }],
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
        marginTop: 10,
    },
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        marginTop: 0,
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