import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, TextInput, Alert } from 'react-native';
import { ChevronRight, ArrowLeft, PlusCircle, Smile, Frown, Meh, Laugh, Angry, Heart } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

interface BeliefPair {
    id: number;
    oldBelief: string;
    reframe: string;
}

interface StarvingArtistProps {
    onComplete: () => void;
    onBack?: () => void;
}

const beliefPairs: BeliefPair[] = [
    {
        id: 1,
        oldBelief: "If I make money, I'm selling out.",
        reframe: "Earning money gives me freedom to create on my own terms."
    },
    {
        id: 2,
        oldBelief: "Artists should suffer for their art.",
        reframe: "My art is stronger when I'm supported and cared for."
    },
    {
        id: 3,
        oldBelief: "Money and creativity don't mix.",
        reframe: "Financial stability fuels creativity and risk-taking."
    },
    {
        id: 4,
        oldBelief: "I don't deserve more than survival.",
        reframe: "I deserve to thrive, not just survive."
    },
    {
        id: 5,
        oldBelief: "It's selfish to want more.",
        reframe: "Earning more allows me to give more."
    },
    {
        id: 6,
        oldBelief: "I'm not qualified for a high-paying job.",
        reframe: "I might be surprised how many high-paying jobs fit my skills."
    },
    {
        id: 7,
        oldBelief: "Wanting to make more money means I've failed as an artist.",
        reframe: "Increasing my income makes me resilient and resourceful."
    },
    {
        id: 8,
        oldBelief: "Real art doesn't pay well.",
        reframe: "Art and abundance can absolutely go hand in hand."
    },
    {
        id: 9,
        oldBelief: "I'm not good with money, so why bother?",
        reframe: "I can learn money skills the same way I learned dance skills."
    },
    {
        id: 10,
        oldBelief: "I'll never be financially stable because I chose to pursue dance.",
        reframe: "My dance background taught me so many skills I can use in other fields."
    }
];

export default function StarvingArtist({ onComplete, onBack }: StarvingArtistProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'oldBelief' | 'reframe' }>>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showMismatch, setShowMismatch] = useState(false);
    const [journalEntry, setJournalEntry] = useState('');
    const [morningJournalEntry, setMorningJournalEntry] = useState('');
    const [endOfDayJournalEntry, setEndOfDayJournalEntry] = useState('');
    const [selectedMorningMood, setSelectedMorningMood] = useState<string | null>(null);
    const [selectedEndOfDayMood, setSelectedEndOfDayMood] = useState<string | null>(null);
    const [selectedReflectionMood, setSelectedReflectionMood] = useState<string | null>(null);
    const [animatedValues] = useState(() => new Map());
    const [matchedPairs, setMatchedPairs] = useState<number[]>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('money-mindsets');
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('money-mindsets');

    // Scroll to top whenever screen changes
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
            setMatchedPairs([]); // Reset matched pairs in storage
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
        const firstThreePairs = beliefPairs.slice(0, 3);
        const oldBeliefs: Array<{ id: string; text: string; pairId: number; type: 'oldBelief' | 'reframe' }> = [];
        const reframes: Array<{ id: string; text: string; pairId: number; type: 'oldBelief' | 'reframe' }> = [];

        firstThreePairs.forEach(pair => {
            oldBeliefs.push({
                id: `oldBelief_${pair.id}`,
                text: pair.oldBelief,
                pairId: pair.id,
                type: 'oldBelief'
            });
            reframes.push({
                id: `reframe_${pair.id}`,
                text: pair.reframe,
                pairId: pair.id,
                type: 'reframe'
            });
        });

        // Scramble old beliefs and reframes separately to avoid same-row alignment
        const scrambledOldBeliefs = [...oldBeliefs].sort(() => Math.random() - 0.5);
        const scrambledReframes = [...reframes].sort(() => Math.random() - 0.5);

        // Combine into single array for game logic
        const allItems = [...scrambledOldBeliefs, ...scrambledReframes];
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
            setMatchedPairs(newMatchedPairs);

            // Remove matched items and add new pair if available
            setTimeout(() => {
                const remainingItems = gameItems.filter(item => !selected.includes(item.id));

                // Add next pair if available
                if (currentPairIndex < beliefPairs.length) {
                    const nextPair = beliefPairs[currentPairIndex];

                    // Separate existing items by type
                    const existingOldBeliefs = remainingItems.filter(item => item.type === 'oldBelief');
                    const existingReframes = remainingItems.filter(item => item.type === 'reframe');

                    // Add new old belief and reframe
                    const newOldBelief = {
                        id: `oldBelief_${nextPair.id}`,
                        text: nextPair.oldBelief,
                        pairId: nextPair.id,
                        type: 'oldBelief' as const
                    };
                    const newReframe = {
                        id: `reframe_${nextPair.id}`,
                        text: nextPair.reframe,
                        pairId: nextPair.id,
                        type: 'reframe' as const
                    };

                    // Randomly insert new items to avoid predictable positioning
                    const allOldBeliefs = [...existingOldBeliefs];
                    const allReframes = [...existingReframes];

                    // Insert new old belief at random position
                    const oldBeliefInsertIndex = Math.floor(Math.random() * (allOldBeliefs.length + 1));
                    allOldBeliefs.splice(oldBeliefInsertIndex, 0, newOldBelief);

                    // Insert new reframe at random position
                    const reframeInsertIndex = Math.floor(Math.random() * (allReframes.length + 1));
                    allReframes.splice(reframeInsertIndex, 0, newReframe);

                    const newItems = [...allOldBeliefs, ...allReframes];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                // Check if game is complete
                if (newMatchedPairs.length === beliefPairs.length) {
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

    const openYouTubeShort = async () => {
        const youtubeUrl = `https://www.youtube.com/shorts/8DwWYZHsUHw`;

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

    // Welcome Screen with Morning Journal Section
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
                                Today, we're diving into the money mindsets that shape our thinking as artists and dancers.
                            </Text>
                            <Text style={commonStyles.introDescription}>
                                Many of us carry beliefs about money that may actually be holding us back from building sustainable, fulfilling careers.
                            </Text>

                            <View style={styles.learningBox}>
                                <Text style={styles.learningBoxTitle}>What You'll Learn:</Text>
                                <Text style={styles.learningBoxItem}>• Common money beliefs that artists carry</Text>
                                <Text style={styles.learningBoxItem}>• How to reframe these limiting beliefs</Text>
                                <Text style={styles.learningBoxItem}>• Whether you still hold onto any starving artist stereotypes</Text>
                            </View>

                            <Text style={styles.welcomeFooter}>
                                You'll be playing a match game to help you identify and challenge the money mindsets you might be holding onto.
                            </Text>

                            <JournalEntrySection
                                pathTag="money-mindsets"
                                day="1"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Starving Artist No More"
                                journalInstruction="Before we begin, let's take a moment to check in with yourself. What are your current thoughts about money and being an artist? Is there anything you're hoping to gain today?"
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

                            <Text style={commonStyles.introTitle}>Starving Artist No More</Text>

                            <Text style={commonStyles.introDescription}>
                                You don't have to buy into the starving artist stereotype anymore. In this game, you'll match the old belief with a reframe that frees you.
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
                                Which money belief are you not convinced is actually limiting?{"\n"}
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Take a moment to reflect on the money mindsets you encountered.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                <Text style={styles.reflectionEmphasis}>(If you're having trouble recalling, feel free to go back and play the match game again)</Text>
                            </Text>

                            <JournalEntrySection
                                pathTag="money-mindsets"
                                day="1"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Starving Artist No More"
                                journalInstruction="Which money belief are you still holding onto? Why does it feel true to you?"
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

    // Congratulations Screen with End of Day Journal Section
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
                                You've spent years in an industry that romanticizes struggle, where working for little or nothing is framed as paying your dues. But you don't have to keep carrying that story.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The truth is, being a dancer has already made you resourceful, disciplined, and creative. Those are the exact qualities that can help you build stability and freedom in this next chapter.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Take a detour and check out the money mindsets our founder had to unlearn. But don't forget to come back and mark this day as complete!
                            </Text>

                            <TouchableOpacity
                                style={styles.videoThumbnailContainer}
                                onPress={openYouTubeShort}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={{ uri: 'https://img.youtube.com/vi/8DwWYZHsUHw/maxresdefault.jpg' }}
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
                title={`${matchedPairs.length}/${beliefPairs.length} pairs matched`}
                progress={matchedPairs.length / beliefPairs.length}
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
                    <Card style={styles.baseCard}>
                        <Text style={styles.gameTitle}>Starving Artist No More</Text>
                        <Text style={styles.gameInstructions}>
                            Tap to match old beliefs with their reframes
                        </Text>

                        <View style={styles.columnsContainer}>
                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>Old Belief</Text>
                                {gameItems.filter(item => item.type === 'oldBelief').map((item) => (
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
    baseCard: {
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
        marginTop: 50,
    },
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
    resultTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        fontWeight: '600',
        textAlign: 'center',
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
        height: 120,
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