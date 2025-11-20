import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { ChevronRight, ArrowLeft, Shield } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { useStorage } from '@/hooks/useStorage';

interface BoundaryPair {
    id: number;
    scenario: string;
    response: string;
}

interface BoundariesCheckProps {
    onComplete: () => void;
    onBack?: () => void;
}

const boundaryPairs: BoundaryPair[] = [
    {
        id: 1,
        scenario: "Boss asks you to take on extra tasks late at night",
        response: "Politely decline and schedule for next day"
    },
    {
        id: 2,
        scenario: "Friend invites you to a social event after a long workday",
        response: "Suggest another time or shorter visit"
    },
    {
        id: 3,
        scenario: "Feeling overwhelmed with email",
        response: "Schedule focused email blocks, turn off notifications"
    },
    {
        id: 4,
        scenario: "Colleague interrupts your focus",
        response: "Use headphones or set 'do not disturb'"
    },
    {
        id: 5,
        scenario: "Saying yes to every social invite",
        response: "Choosing one or two social events you *really* want to attend"
    },
    {
        id: 6,
        scenario: "Checking emails late at night",
        response: "Clocking off at 5pm and not checking until the next day"
    },
    {
        id: 7,
        scenario: "Skipping meals to \"get it all done\"",
        response: "Scheduling breaks to be as important as your other \"to-dos\""
    },
    {
        id: 8,
        scenario: "Taking on tasks to avoid disappointing others",
        response: "Saying \"I'd love to, but I can't right now.\""
    },
    {
        id: 9,
        scenario: "Overcommitting to multiple hobbies at once",
        response: "Starting with just *one* new interest at a time"
    },
    {
        id: 10,
        scenario: "Feeling guilty for resting",
        response: "Recognizing rest as part of productivity"
    }
];

export default function BoundariesCheck({ onComplete, onBack }: BoundariesCheckProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'scenario' | 'response' }>>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showMismatch, setShowMismatch] = useState(false);

    const [boundariesMatchedPairs, setBoundariesMatchedPairs] = useStorage<number[]>('BOUNDARIES_MATCHED_PAIRS', []);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    // Ensure boundariesMatchedPairs is always an array
    const matchedPairs = Array.isArray(boundariesMatchedPairs) ? boundariesMatchedPairs : [];

    useEffect(() => {
        scrollToTop();
    }, [currentScreen]);

    const handleBack = () => {
        onBack?.();
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = async () => {
        if (currentScreen === 0) {
            setCurrentScreen(-1);
        } else if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen === 2) {
            await setBoundariesMatchedPairs([]);
            setSelectedItems([]);
            setCurrentPairIndex(0);
            setShowMismatch(false);
            setCurrentScreen(1);
        } else if (currentScreen === 3) {
            setCurrentScreen(2);
        } else if (currentScreen > 3) {
            setCurrentScreen(currentScreen - 1);
        }
        scrollToTop();
    };

    useEffect(() => {
        if (currentScreen === 1) {
            setupGame();
        }
    }, [currentScreen]);

    const setupGame = () => {
        const firstThreePairs = boundaryPairs.slice(0, 3);
        const scenarios: Array<{ id: string; text: string; pairId: number; type: 'scenario' | 'response' }> = [];
        const responses: Array<{ id: string; text: string; pairId: number; type: 'scenario' | 'response' }> = [];

        firstThreePairs.forEach(pair => {
            scenarios.push({
                id: `scenario_${pair.id}`,
                text: pair.scenario,
                pairId: pair.id,
                type: 'scenario'
            });
            responses.push({
                id: `response_${pair.id}`,
                text: pair.response,
                pairId: pair.id,
                type: 'response'
            });
        });

        const scrambledScenarios = [...scenarios].sort(() => Math.random() - 0.5);
        const scrambledResponses = [...responses].sort(() => Math.random() - 0.5);

        const allItems = [...scrambledScenarios, ...scrambledResponses];
        setGameItems(allItems);
        setCurrentPairIndex(3);
    };

    const handleItemPress = async (itemId: string) => {
        if (selectedItems.includes(itemId) || showMismatch) return;

        const newSelected = [...selectedItems, itemId];
        setSelectedItems(newSelected);

        if (newSelected.length === 2) {
            await checkMatch(newSelected);
        }
    };

    const checkMatch = async (selected: string[]) => {
        const item1 = gameItems.find(item => item.id === selected[0]);
        const item2 = gameItems.find(item => item.id === selected[1]);

        if (item1 && item2 && item1.pairId === item2.pairId) {
            const newMatchedPairs = [...matchedPairs, item1.pairId];
            await setBoundariesMatchedPairs(newMatchedPairs);

            setTimeout(() => {
                const remainingItems = gameItems.filter(item => !selected.includes(item.id));

                if (currentPairIndex < boundaryPairs.length) {
                    const nextPair = boundaryPairs[currentPairIndex];

                    const existingScenarios = remainingItems.filter(item => item.type === 'scenario');
                    const existingResponses = remainingItems.filter(item => item.type === 'response');

                    const newScenario = {
                        id: `scenario_${nextPair.id}`,
                        text: nextPair.scenario,
                        pairId: nextPair.id,
                        type: 'scenario' as const
                    };
                    const newResponse = {
                        id: `response_${nextPair.id}`,
                        text: nextPair.response,
                        pairId: nextPair.id,
                        type: 'response' as const
                    };

                    const allScenarios = [...existingScenarios];
                    const allResponses = [...existingResponses];

                    const scenarioInsertIndex = Math.floor(Math.random() * (allScenarios.length + 1));
                    allScenarios.splice(scenarioInsertIndex, 0, newScenario);

                    const responseInsertIndex = Math.floor(Math.random() * (allResponses.length + 1));
                    allResponses.splice(responseInsertIndex, 0, newResponse);

                    const newItems = [...allScenarios, ...allResponses];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                if (newMatchedPairs.length === boundaryPairs.length) {
                    setTimeout(() => {
                        setCurrentScreen(2);
                    }, 500);
                }
            }, 600);
        } else {
            setShowMismatch(true);
            setTimeout(() => {
                setShowMismatch(false);
                setSelectedItems([]);
            }, 800);
        }
    };

    const getItemStyle = (itemId: string) => {
        const isSelected = selectedItems.includes(itemId);
        const isMatched = gameItems.find(item => item.id === itemId && matchedPairs.includes(item.pairId));

        if (isMatched) {
            return [styles.gameButton, styles.matchedButton];
        } else if (isSelected && showMismatch) {
            return [styles.gameButton, styles.mismatchButton];
        } else if (isSelected) {
            return [styles.gameButton, styles.selectedButton];
        } else {
            return [styles.gameButton];
        }
    };

    const openYouTubeShort = async () => {
        const youtubeUrl = `https://www.youtube.com/shorts/YOUR_VIDEO_ID`;

        try {
            const supported = await Linking.canOpenURL(youtubeUrl);

            if (supported) {
                await Linking.openURL(youtubeUrl);
            } else {
                console.log("YouTube app not available");
            }
        } catch (error) {
            console.log("Error opening YouTube:", error);
        }
    };

    // Welcome Screen with Journal Section
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

                            <Text style={commonStyles.introTitle}>Welcome to Boundaries Check!</Text>

                            <Text style={commonStyles.introDescription}>
                                As dancers, we're used to saying "yes" to everything: extra rehearsals, extra shifts, extra favors. But outside of dance, that same habit can drain your energy.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Today, we're practicing how to spot and establish healthy boundaries to protect your time, energy, and well-being.
                            </Text>

                            <View style={styles.learningBox}>
                                <Text style={styles.learningBoxTitle}>What You'll Learn:</Text>
                                <Text style={styles.learningBoxItem}>• How to recognize boundary-crossing scenarios</Text>
                                <Text style={styles.learningBoxItem}>• Healthy responses to protect your energy</Text>
                                <Text style={styles.learningBoxItem}>• Practical strategies for work-life balance</Text>
                            </View>

                            <Text style={styles.welcomeFooter}>
                                You'll be playing a match game to help you practice identifying and responding to common boundary challenges.
                            </Text>

                            <JournalEntrySection
                                pathTag="work-life-balance"
                                day="4"
                                category="Mindset and Wellness"
                                pathTitle="Work Life Balance"
                                dayTitle="Boundaries Check"
                                journalInstruction="Before we begin, let's take a moment to check in with your current boundary habits. What areas of your life feel most challenging when it comes to setting boundaries? What would you like to improve?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Continue" onPress={() => setCurrentScreen(0)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Intro Screen
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

                            <Text style={commonStyles.introTitle}>Boundaries Check</Text>

                            <Text style={commonStyles.introDescription}>
                                Let's match common boundary scenarios with healthy responses to build your boundary-setting skills.
                            </Text>

                            <PrimaryButton title="Start the Game" onPress={() => setCurrentScreen(1)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen after Game Completion
    if (currentScreen === 2) {
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

                            <Text style={commonStyles.reflectionTitle}>Time for Reflection</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Which boundary scenario felt most familiar or challenging to you?
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Take a moment to reflect on what you've learned about setting healthy boundaries.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                <Text style={styles.reflectionEmphasis}>(If you're having trouble recalling, feel free to go back and play the match game again)</Text>
                            </Text>

                            <JournalEntrySection
                                pathTag="work-life-balance"
                                journalInstruction="Which boundary response are you most interested in practicing in your own life? What makes it challenging for you?"
                                moodLabel=""
                                saveButtonText="Add to Journal"
                            />

                            <PrimaryButton title="Continue" onPress={() => setCurrentScreen(3)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Congratulations Screen with Completion
    if (currentScreen === 3) {
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

                            <Text style={commonStyles.reflectionTitle}>You're Building Better Boundaries!</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Boundaries aren't walls. They're guardrails that protect your energy. Notice one area where you might need stronger boundaries right now.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Check out this additional resource to learn more about setting healthy boundaries:
                            </Text>

                            <TouchableOpacity
                                style={styles.videoThumbnailContainer}
                                onPress={openYouTubeShort}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={{ uri: 'https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg' }}
                                    style={styles.videoThumbnail}
                                    resizeMode="cover"
                                />
                                <View style={styles.playButtonOverlay}>
                                    <View style={styles.playButton}>
                                        <Text style={styles.playIcon}>▶</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <Text style={styles.reflectionClosing}>
                                See you tomorrow for more.
                            </Text>

                            <PrimaryButton title="Mark As Complete" onPress={handleComplete} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Game Screen
    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${matchedPairs.length}/${boundaryPairs.length} pairs matched`}
                progress={matchedPairs.length / boundaryPairs.length}
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
                        <Text style={styles.gameTitle}>Boundaries Check</Text>
                        <Text style={styles.gameInstructions}>
                            Tap to match scenarios with healthy boundary responses
                        </Text>

                        <View style={styles.columnsContainer}>
                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>Scenario</Text>
                                {gameItems.filter(item => item.type === 'scenario').map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={getItemStyle(item.id)}
                                        onPress={() => handleItemPress(item.id)}
                                        activeOpacity={0.8}
                                        disabled={matchedPairs.includes(item.pairId)}
                                    >
                                        <Text style={[
                                            styles.gameButtonText,
                                            selectedItems.includes(item.id) && styles.selectedButtonText,
                                            matchedPairs.includes(item.pairId) && styles.matchedButtonText,
                                            selectedItems.includes(item.id) && showMismatch && styles.mismatchButtonText
                                        ]}>
                                            {item.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>Response</Text>
                                {gameItems.filter(item => item.type === 'response').map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={getItemStyle(item.id)}
                                        onPress={() => handleItemPress(item.id)}
                                        activeOpacity={0.8}
                                        disabled={matchedPairs.includes(item.pairId)}
                                    >
                                        <Text style={[
                                            styles.gameButtonText,
                                            selectedItems.includes(item.id) && styles.selectedButtonText,
                                            matchedPairs.includes(item.pairId) && styles.matchedButtonText,
                                            selectedItems.includes(item.id) && showMismatch && styles.mismatchButtonText
                                        ]}>
                                            {item.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // Welcome Screen Styles
    learningBox: {
        width: '100%',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(146, 132, 144, 0.2)',
    },
    learningBoxTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        marginBottom: 12,
        fontWeight: '600',
    },
    learningBoxItem: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#4E4F50',
        lineHeight: 24,
        marginBottom: 8,
    },
    welcomeFooter: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    // Game Styles
    gameTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '700',
    },
    gameInstructions: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 30,
    },
    columnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    column: {
        flex: 1,
    },
    columnTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 15,
        fontWeight: '700',
    },
    gameButton: {
        width: '100%',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: 'rgba(100, 124, 144, 0.2)',
        borderColor: '#647C90',
    },
    matchedButton: {
        backgroundColor: 'rgba(90, 125, 123, 0.2)',
        borderColor: '#5A7D7B',
        opacity: 0,
    },
    mismatchButton: {
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        borderColor: '#dc3545',
    },
    gameButtonText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 18,
    },
    selectedButtonText: {
        color: '#647C90',
        fontFamily: 'Montserrat-SemiBold',
    },
    matchedButtonText: {
        color: '#5A7D7B',
    },
    mismatchButtonText: {
        color: '#dc3545',
    },
    reflectionEmphasis: {
        fontStyle: 'italic',
        color: '#928490',
    },
    reflectionClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '600',
    },
    // YouTube Thumbnail Styles
    videoThumbnailContainer: {
        width: '100%',
        marginBottom: 25,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        position: 'relative',
    },
    videoThumbnail: {
        width: '100%',
        height: 200,
        borderRadius: 16,
    },
    playButtonOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    playButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF0000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    playIcon: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 4,
    },
});