import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ChevronRight, ArrowLeft, Zap } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useStorage } from '@/hooks/useStorage';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

interface ThoughtPair {
    id: number;
    thought: string;
    reality: string;
}

interface FeastOrFamineProps {
    onComplete: () => void;
    onBack?: () => void;
}

const thoughtPairs: ThoughtPair[] = [
    {
        id: 1,
        thought: "My income is unpredictable, so I can't budget.",
        reality: "A budget is your most powerful tool for managing unpredictability."
    },
    {
        id: 2,
        thought: "When I have a big paycheck, I deserve to splurge.",
        reality: "A big paycheck is my chance to prepare for the lean months ahead."
    },
    {
        id: 3,
        thought: "I'll never get ahead because it's always feast or famine.",
        reality: "The \"feast\" periods are what fund my stability during the \"famine.\""
    },
    {
        id: 4,
        thought: "My bank account balance is what I can spend.",
        reality: "My available money is my balance minus my upcoming bills."
    },
    {
        id: 5,
        thought: "I can't save money until I have a steady job.",
        reality: "I can start building a savings buffer with any amount, right now."
    },
    {
        id: 6,
        thought: "It's pointless to plan because I don't know what I'll earn.",
        reality: "Planning based on my average income creates stability."
    },
    {
        id: 7,
        thought: "All my financial problems would be solved with a higher income.",
        reality: "Without a system, more money often just leads to more spending."
    },
    {
        id: 8,
        thought: "I'm just bad with money.",
        reality: "I'm not bad with money. I just need a system that works for my unique income."
    },
    {
        id: 9,
        thought: "Freelancers can't get loans or mortgages.",
        reality: "Lenders look for consistent average income and good credit, not just a salaried job."
    },
    {
        id: 10,
        thought: "I should just accept the stress as part of the gig.",
        reality: "Financial stress is optional, not a mandatory part of being a dancer."
    }
];

export default function FeastOrFamine({ onComplete, onBack }: FeastOrFamineProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'thought' | 'reality' }>>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [showMismatch, setShowMismatch] = useState(false);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const [feastOrFamineMatchedPairs, setFeastOrFamineMatchedPairs] = useStorage<number[]>('FEAST_OR_FAMINE_MATCHED_PAIRS', []);

    // Ensure feastOrFamineMatchedPairs is always an array
    const matchedPairs = Array.isArray(feastOrFamineMatchedPairs) ? feastOrFamineMatchedPairs : [];

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
            await setFeastOrFamineMatchedPairs([]);
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
        const firstThreePairs = thoughtPairs.slice(0, 3);
        const thoughts: Array<{ id: string; text: string; pairId: number; type: 'thought' | 'reality' }> = [];
        const realities: Array<{ id: string; text: string; pairId: number; type: 'thought' | 'reality' }> = [];

        firstThreePairs.forEach(pair => {
            thoughts.push({
                id: `thought_${pair.id}`,
                text: pair.thought,
                pairId: pair.id,
                type: 'thought'
            });
            realities.push({
                id: `reality_${pair.id}`,
                text: pair.reality,
                pairId: pair.id,
                type: 'reality'
            });
        });

        const scrambledThoughts = [...thoughts].sort(() => Math.random() - 0.5);
        const scrambledRealities = [...realities].sort(() => Math.random() - 0.5);

        const allItems = [...scrambledThoughts, ...scrambledRealities];
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
            await setFeastOrFamineMatchedPairs(newMatchedPairs);

            setTimeout(() => {
                const remainingItems = gameItems.filter(item => !selected.includes(item.id));

                if (currentPairIndex < thoughtPairs.length) {
                    const nextPair = thoughtPairs[currentPairIndex];

                    const existingThoughts = remainingItems.filter(item => item.type === 'thought');
                    const existingRealities = remainingItems.filter(item => item.type === 'reality');

                    const newThought = {
                        id: `thought_${nextPair.id}`,
                        text: nextPair.thought,
                        pairId: nextPair.id,
                        type: 'thought' as const
                    };
                    const newReality = {
                        id: `reality_${nextPair.id}`,
                        text: nextPair.reality,
                        pairId: nextPair.id,
                        type: 'reality' as const
                    };

                    const allThoughts = [...existingThoughts];
                    const allRealities = [...existingRealities];

                    const thoughtInsertIndex = Math.floor(Math.random() * (allThoughts.length + 1));
                    allThoughts.splice(thoughtInsertIndex, 0, newThought);

                    const realityInsertIndex = Math.floor(Math.random() * (allRealities.length + 1));
                    allRealities.splice(realityInsertIndex, 0, newReality);

                    const newItems = [...allThoughts, ...allRealities];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                if (newMatchedPairs.length === thoughtPairs.length) {
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

                            <Text style={commonStyles.introTitle}>Welcome Back!</Text>

                            <Text style={commonStyles.introDescription}>
                                Today we're exploring the financial mindsets that keep dancers stuck in the "feast or famine" cycle.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Many dancers struggle with variable income and develop thought patterns that can actually increase financial stress.
                            </Text>

                            <View style={styles.learningBox}>
                                <Text style={styles.learningBoxTitle}>What You'll Learn:</Text>
                                <Text style={styles.learningBoxItem}>• Common financial thoughts that increase stress</Text>
                                <Text style={styles.learningBoxItem}>• Practical realities to counter these thoughts</Text>
                                <Text style={styles.learningBoxItem}>• How to build financial stability with variable income</Text>
                            </View>

                            <Text style={styles.welcomeFooter}>
                                You'll be playing a match game to help you identify and challenge the financial thoughts that might be holding you back.
                            </Text>

                            <JournalEntrySection
                                pathTag="budgeting-for-dancers"
                                day="6"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Feast Or Famine"
                                journalInstruction="Before we begin, let's check in with your current financial mindset. How are you feeling about money today? What thoughts come up when you think about budgeting with variable income?"
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

                            <Text style={commonStyles.introTitle}>Feast or Famine</Text>

                            <Text style={commonStyles.introDescription}>
                                Living with a variable income creates its own set of myths. Let's bust the ones that keep you stuck in a cycle of financial stress.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Match the common thought to the practical reality to help you build your buffers and prepare for your pivot.
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
                                Which financial thought feels most true to you right now?{"\n"}
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Take a moment to reflect on the thoughts and realities you encountered.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                <Text style={styles.reflectionEmphasis}>(If you're having trouble recalling, feel free to go back and play the match game again)</Text>
                            </Text>

                            <JournalEntrySection
                                pathTag="budgeting-for-dancers"
                                day="6"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Feast Or Famine"
                                journalInstruction="Which financial thought are you still holding onto? What would it take for you to embrace the practical reality instead?"
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

    // Congratulations Screen
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

                            <Text style={commonStyles.reflectionTitle}>Great Work!</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The "feast or famine" cycle doesn't have to control you. By planning for the dips during the peaks, you take back control.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Your financial stability isn't about how much you make in one month. It's about the system you build over time.
                            </Text>

                            <Text style={styles.reflectionClosing}>
                                See you tomorrow.
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
                title={`${matchedPairs.length}/${thoughtPairs.length} pairs matched`}
                progress={matchedPairs.length / thoughtPairs.length}
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
                        <Text style={styles.gameTitle}>Feast or Famine</Text>
                        <Text style={styles.gameInstructions}>
                            Tap to match common thoughts with their practical realities
                        </Text>

                        <View style={styles.columnsContainer}>
                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>Common Thought</Text>
                                {gameItems.filter(item => item.type === 'thought').map((item) => (
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
                                <Text style={styles.columnTitle}>Practical Reality</Text>
                                {gameItems.filter(item => item.type === 'reality').map((item) => (
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
        height: 130,
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
        fontSize: 14,
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
});