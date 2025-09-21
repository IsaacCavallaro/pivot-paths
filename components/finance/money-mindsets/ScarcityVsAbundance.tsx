import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react-native';

interface BeliefPair {
    id: number;
    scarcityThought: string;
    abundanceReframe: string;
}

interface ScarcityVsAbundanceProps {
    onComplete: () => void;
    onBack?: () => void;
}

const beliefPairs: BeliefPair[] = [
    {
        id: 1,
        scarcityThought: "I should be grateful for what I have.",
        abundanceReframe: "I can be grateful *and* still build wealth for myself and my family."
    },
    {
        id: 2,
        scarcityThought: "Money will always be tight.",
        abundanceReframe: "Money can be plentiful if I just learn how to manage it."
    },
    {
        id: 3,
        scarcityThought: "Negotiating makes me look greedy.",
        abundanceReframe: "Negotiating shows I value my time and talent."
    },
    {
        id: 4,
        scarcityThought: "There's only so much work to go around.",
        abundanceReframe: "There are endless ways to earn and create."
    },
    {
        id: 5,
        scarcityThought: "I can't afford to invest in myself.",
        abundanceReframe: "Investing in myself multiplies my opportunities."
    },
    {
        id: 6,
        scarcityThought: "If I earn more, others will have less.",
        abundanceReframe: "The more I earn, the more I can give and share."
    },
    {
        id: 7,
        scarcityThought: "Debt is a normal part of life.",
        abundanceReframe: "I deserve to live within my means and without the stress of debt."
    },
    {
        id: 8,
        scarcityThought: "I'll never catch up after past mistakes.",
        abundanceReframe: "I can learn, grow, and make better choices now."
    },
    {
        id: 9,
        scarcityThought: "Money stresses me out.",
        abundanceReframe: "Money gives me breathing room and clarity."
    },
    {
        id: 10,
        scarcityThought: "Being underpaid is normal and I'm used to it.",
        abundanceReframe: "It feels uncomfortable but I'm ready to earn more."
    }
];

export default function ScarcityVsAbundance({ onComplete, onBack }: ScarcityVsAbundanceProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1 = game, 2 = reflection
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'scarcityThought' | 'abundanceReframe' }>>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showMismatch, setShowMismatch] = useState(false);

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
        const scarcityThoughts: Array<{ id: string; text: string; pairId: number; type: 'scarcityThought' | 'abundanceReframe' }> = [];
        const abundanceReframes: Array<{ id: string; text: string; pairId: number; type: 'scarcityThought' | 'abundanceReframe' }> = [];

        firstThreePairs.forEach(pair => {
            scarcityThoughts.push({
                id: `scarcityThought_${pair.id}`,
                text: pair.scarcityThought,
                pairId: pair.id,
                type: 'scarcityThought'
            });
            abundanceReframes.push({
                id: `abundanceReframe_${pair.id}`,
                text: pair.abundanceReframe,
                pairId: pair.id,
                type: 'abundanceReframe'
            });
        });

        // Scramble scarcity thoughts and abundance reframes separately to avoid same-row alignment
        const scrambledScarcityThoughts = [...scarcityThoughts].sort(() => Math.random() - 0.5);
        const scrambledAbundanceReframes = [...abundanceReframes].sort(() => Math.random() - 0.5);

        // Combine into single array for game logic
        const allItems = [...scrambledScarcityThoughts, ...scrambledAbundanceReframes];
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
                    const existingScarcityThoughts = remainingItems.filter(item => item.type === 'scarcityThought');
                    const existingAbundanceReframes = remainingItems.filter(item => item.type === 'abundanceReframe');

                    // Add new scarcity thought and abundance reframe
                    const newScarcityThought = {
                        id: `scarcityThought_${nextPair.id}`,
                        text: nextPair.scarcityThought,
                        pairId: nextPair.id,
                        type: 'scarcityThought' as const
                    };
                    const newAbundanceReframe = {
                        id: `abundanceReframe_${nextPair.id}`,
                        text: nextPair.abundanceReframe,
                        pairId: nextPair.id,
                        type: 'abundanceReframe' as const
                    };

                    // Randomly insert new items to avoid predictable positioning
                    const allScarcityThoughts = [...existingScarcityThoughts];
                    const allAbundanceReframes = [...existingAbundanceReframes];

                    // Insert new scarcity thought at random position
                    const scarcityThoughtInsertIndex = Math.floor(Math.random() * (allScarcityThoughts.length + 1));
                    allScarcityThoughts.splice(scarcityThoughtInsertIndex, 0, newScarcityThought);

                    // Insert new abundance reframe at random position
                    const abundanceReframeInsertIndex = Math.floor(Math.random() * (allAbundanceReframes.length + 1));
                    allAbundanceReframes.splice(abundanceReframeInsertIndex, 0, newAbundanceReframe);

                    const newItems = [...allScarcityThoughts, ...allAbundanceReframes];

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
                        <Text style={styles.introIconText}>💭</Text>
                    </View>

                    <Text style={styles.introTitle}>Scarcity vs Abundance Match Game</Text>

                    <Text style={styles.introDescription}>
                        As dancers, we've been taught to accept less… low pay, "exposure gigs," and the starving artist life. But what if you flipped the script? Let's explore scarcity vs. abundance thinking by matching the scarcity thought with the abundance reframe.
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
                        <Text style={styles.reflectionIconText}>💰</Text>
                    </View>

                    <Text style={styles.reflectionTitle}>Aim for Abundance</Text>

                    <Text style={styles.reflectionText}>
                        Money isn't the enemy… it's the fuel that allows you to take risks, rest, and grow.
                    </Text>

                    <Text style={styles.reflectionText}>
                        You're allowed to want more. You're allowed to earn more. And you're allowed to create a life where your worth isn't tied to how much you sacrifice.
                    </Text>

                    <Text style={styles.reflectionClosing}>
                        Get ready for tomorrow.
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
                <Text style={styles.gameTitle}>Scarcity vs Abundance</Text>
                <Text style={styles.gameInstructions}>
                    Tap to match scarcity thoughts with their abundance reframes
                </Text>

                <View style={styles.columnsContainer}>
                    <View style={styles.column}>
                        <Text style={styles.columnTitle}>Scarcity Thought</Text>
                        {gameItems.filter(item => item.type === 'scarcityThought').map((item) => (
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
                        <Text style={styles.columnTitle}>Abundance Reframe</Text>
                        {gameItems.filter(item => item.type === 'abundanceReframe').map((item) => (
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
    introIconText: {
        fontSize: 40,
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
    reflectionIconText: {
        fontSize: 50,
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