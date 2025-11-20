import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ChevronRight, ArrowLeft, Heart } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { useStorage } from '@/hooks/useStorage';

interface IdentityPair {
    id: number;
    identityPhrase: string;
    reframe: string;
}

interface BeyondYourIdentityProps {
    onComplete: () => void;
    onBack?: () => void;
}

const identityPairs: IdentityPair[] = [
    {
        id: 1,
        identityPhrase: "I am a dancer.",
        reframe: "Dancing is something I do, but it's not all of me."
    },
    {
        id: 2,
        identityPhrase: "I am a teacher.",
        reframe: "Teaching is one way I share my gifts."
    },
    {
        id: 3,
        identityPhrase: "I am a failure.",
        reframe: "I failed this time but I can learn and grow."
    },
    {
        id: 4,
        identityPhrase: "I am successful when I'm performing.",
        reframe: "Success is in how I live, not just what I achieve."
    },
    {
        id: 5,
        identityPhrase: "I am what others see me as.",
        reframe: "Who I am goes deeper than what's visible to others."
    },
    {
        id: 6,
        identityPhrase: "I am my achievements.",
        reframe: "Achievements are important, but they're not the whole story."
    },
    {
        id: 7,
        identityPhrase: "I am my body.",
        reframe: "My health is essential but I'm more than what I look like."
    },
    {
        id: 8,
        identityPhrase: "I am my mistakes.",
        reframe: "Mistakes are lessons, not definitions."
    },
    {
        id: 9,
        identityPhrase: "I am my resume.",
        reframe: "Past roles shaped me, but they don't limit who I can become."
    },
    {
        id: 10,
        identityPhrase: "I am productive.",
        reframe: "My worth is constant, even in stillness and rest."
    }
];

export default function BeyondYourIdentity({ onComplete, onBack }: BeyondYourIdentityProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'identity' | 'reframe' }>>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showMismatch, setShowMismatch] = useState(false);

    const [identityMatchedPairs, setIdentityMatchedPairs] = useStorage<number[]>('BEYOND_IDENTITY_MATCHED_PAIRS', []);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    // Ensure identityMatchedPairs is always an array
    const matchedPairs = Array.isArray(identityMatchedPairs) ? identityMatchedPairs : [];

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
            await setIdentityMatchedPairs([]);
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
        // Start with first 3 pairs, scrambled
        const firstThreePairs = identityPairs.slice(0, 3);
        const identities: Array<{ id: string; text: string; pairId: number; type: 'identity' | 'reframe' }> = [];
        const reframes: Array<{ id: string; text: string; pairId: number; type: 'identity' | 'reframe' }> = [];

        firstThreePairs.forEach(pair => {
            identities.push({
                id: `identity_${pair.id}`,
                text: pair.identityPhrase,
                pairId: pair.id,
                type: 'identity'
            });
            reframes.push({
                id: `reframe_${pair.id}`,
                text: pair.reframe,
                pairId: pair.id,
                type: 'reframe'
            });
        });

        // Scramble identities and reframes separately to avoid same-row alignment
        const scrambledIdentities = [...identities].sort(() => Math.random() - 0.5);
        const scrambledReframes = [...reframes].sort(() => Math.random() - 0.5);

        // Combine into single array for game logic
        const allItems = [...scrambledIdentities, ...scrambledReframes];
        setGameItems(allItems);
        setCurrentPairIndex(3); // Next pair to add
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
            // Match found!
            const newMatchedPairs = [...matchedPairs, item1.pairId];
            await setIdentityMatchedPairs(newMatchedPairs);

            // Remove matched items and add new pair if available
            setTimeout(() => {
                const remainingItems = gameItems.filter(item => !selected.includes(item.id));

                // Add next pair if available
                if (currentPairIndex < identityPairs.length) {
                    const nextPair = identityPairs[currentPairIndex];

                    // Separate existing items by type
                    const existingIdentities = remainingItems.filter(item => item.type === 'identity');
                    const existingReframes = remainingItems.filter(item => item.type === 'reframe');

                    // Add new identity and reframe
                    const newIdentity = {
                        id: `identity_${nextPair.id}`,
                        text: nextPair.identityPhrase,
                        pairId: nextPair.id,
                        type: 'identity' as const
                    };
                    const newReframe = {
                        id: `reframe_${nextPair.id}`,
                        text: nextPair.reframe,
                        pairId: nextPair.id,
                        type: 'reframe' as const
                    };

                    // Randomly insert new items to avoid predictable positioning
                    const allIdentities = [...existingIdentities];
                    const allReframes = [...existingReframes];

                    // Insert new identity at random position
                    const identityInsertIndex = Math.floor(Math.random() * (allIdentities.length + 1));
                    allIdentities.splice(identityInsertIndex, 0, newIdentity);

                    // Insert new reframe at random position
                    const reframeInsertIndex = Math.floor(Math.random() * (allReframes.length + 1));
                    allReframes.splice(reframeInsertIndex, 0, newReframe);

                    const newItems = [...allIdentities, ...allReframes];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                // Check if game is complete
                if (newMatchedPairs.length === identityPairs.length) {
                    setTimeout(() => {
                        setCurrentScreen(2);
                    }, 500);
                }
            }, 600);
        } else {
            // No match - show red briefly
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
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <Heart size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={commonStyles.introTitle}>Welcome to Beyond Your Identity!</Text>

                            <Text style={commonStyles.introDescription}>
                                You are more than what you do and more than what you've done. Our identities can sometimes limit how we see ourselves and our potential.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Today, we're exploring how to separate who you are from what you do, creating space for more authentic self-expression.
                            </Text>

                            <View style={styles.learningBox}>
                                <Text style={styles.learningBoxTitle}>What You'll Explore:</Text>
                                <Text style={styles.learningBoxItem}>• Common identity-based phrases we tell ourselves</Text>
                                <Text style={styles.learningBoxItem}>• Reframes that expand your sense of self</Text>
                                <Text style={styles.learningBoxItem}>• How to release limiting identity attachments</Text>
                            </View>

                            <Text style={styles.welcomeFooter}>
                                You'll be playing a match game to help you recognize and reframe identity-limiting beliefs.
                            </Text>

                            <JournalEntrySection
                                pathTag="mindset-shifts"
                                day="1"
                                category="Mindset and Wellness"
                                pathTitle="Mindset Shifts"
                                dayTitle="Beyond Your Identity"
                                journalInstruction="Before we begin, let's take a moment to check in with your current relationship with identity. What roles or labels do you strongly identify with? How do they make you feel?"
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

                            <Text style={commonStyles.introTitle}>Beyond Your Identity</Text>

                            <Text style={commonStyles.introDescription}>
                                Match each identity-rooted phrase with a reminder that you can just be you… no identity needed.
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
                                How did this make you feel? Was it uncomfortable to peel back your identity?
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Are there some unnecessary layers that you've been holding on to?
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                <Text style={styles.reflectionEmphasis}>(If you're having trouble recalling, feel free to go back and play the match game again)</Text>
                            </Text>

                            <JournalEntrySection
                                pathTag="mindset-shifts"
                                journalInstruction="Consider what life could look like when you free yourself from an identity and just start to be you. Which identity reframes resonated most with you?"
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

                            <Text style={commonStyles.reflectionTitle}>You're Expanding Beyond Identity!</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Remember that you are more than any single role, achievement, or label. Your worth is inherent and doesn't depend on what you do or what others think of you.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Consider what life could look like when you free yourself from an identity and just start to be you.
                            </Text>

                            <Text style={styles.reflectionClosing}>
                                We'll see you here tomorrow for more.
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
                title={`${matchedPairs.length}/${identityPairs.length} pairs matched`}
                progress={matchedPairs.length / identityPairs.length}
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
                        <Text style={styles.gameTitle}>Beyond Your Identity</Text>
                        <Text style={styles.gameInstructions}>
                            Tap to match identity phrases with their reframes
                        </Text>

                        <View style={styles.columnsContainer}>
                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>Identity</Text>
                                {gameItems.filter(item => item.type === 'identity').map((item) => (
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
                                <Text style={styles.columnTitle}>Reframe</Text>
                                {gameItems.filter(item => item.type === 'reframe').map((item) => (
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
    // Icon Styles
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
        height: 100, // Changed from 80 to 100 to match MythBusterGame
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
        fontSize: 10,
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