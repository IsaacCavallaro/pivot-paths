import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Star, ArrowLeft, ChevronLeft } from 'lucide-react-native';

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
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1 = game, 2 = reflection
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'oldBelief' | 'reframe' }>>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showMismatch, setShowMismatch] = useState(false);
    const [animatedValues] = useState(() => new Map());

    const handleBack = () => {
        onBack?.();
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1) {
            setCurrentScreen(currentScreen - 1);
        }
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

    const handleItemPress = (itemId: string) => {
        if (selectedItems.includes(itemId) || showMismatch) return;

        const newSelected = [...selectedItems, itemId];
        setSelectedItems(newSelected);

        if (newSelected.length === 2) {
            checkMatch(newSelected);
        }
    };

    const checkMatch = (selected: string[]) => {
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

    // Intro Screen
    if (currentScreen === 0) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                    <ArrowLeft size={28} color="#647C90" />
                </TouchableOpacity>
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <Star size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Starving Artist No More</Text>

                    <Text style={styles.introDescription}>
                        You don't have to buy into the starving artist stereotype anymore. In this game, you'll match the old belief with a reframe that frees you.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={() => setCurrentScreen(1)}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Start the game</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen
    if (currentScreen === 2) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.reflectionContainer}>
                    <View style={styles.reflectionIcon}>
                        <Star size={40} color="#5A7D7B" />
                    </View>

                    <Text style={styles.reflectionTitle}>Great Work!</Text>

                    <Text style={styles.reflectionText}>
                        You've spent years in an industry that romanticizes struggle, where working for little or nothing is framed as paying your dues. But you don't have to keep carrying that story.
                    </Text>

                    <Text style={styles.reflectionText}>
                        The truth is, being a dancer has already made you resourceful, disciplined, and creative. Those are the exact qualities that can help you build stability and freedom in this next chapter.
                    </Text>

                    <Text style={styles.reflectionClosing}>
                        See you tomorrow.
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
            </View>
        );
    }

    // Game Screen
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {matchedPairs.length}/{beliefPairs.length} pairs matched
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(matchedPairs.length / beliefPairs.length) * 100}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content}>
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
        fontSize: 32,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 15,
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
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
    header: {
        padding: 20,
        paddingTop: 60,
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
        backgroundColor: '#928490',
        borderRadius: 3,
    },
    gameTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 10,
        paddingHorizontal: 24,
    },
    gameInstructions: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 24,
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
    columnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        paddingHorizontal: 16,
    },
    column: {
        flex: 1,
    },
    columnTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 15,
    },
    gameButton: {
        width: '100%',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        minHeight: 80,
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
    reflectionContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    reflectionIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    reflectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    reflectionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    reflectionClosing: {
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
});