import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, ChevronRight, ChevronLeft, Zap } from 'lucide-react-native';

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
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1 = game, 2 = conclusion
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'thought' | 'reality' }>>([]);
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

        // Scramble thoughts and realities separately to avoid same-row alignment
        const scrambledThoughts = [...thoughts].sort(() => Math.random() - 0.5);
        const scrambledRealities = [...realities].sort(() => Math.random() - 0.5);

        // Combine into single array for game logic
        const allItems = [...scrambledThoughts, ...scrambledRealities];
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
                if (currentPairIndex < thoughtPairs.length) {
                    const nextPair = thoughtPairs[currentPairIndex];

                    // Separate existing items by type
                    const existingThoughts = remainingItems.filter(item => item.type === 'thought');
                    const existingRealities = remainingItems.filter(item => item.type === 'reality');

                    // Add new thought and reality
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

                    // Randomly insert new items to avoid predictable positioning
                    const allThoughts = [...existingThoughts];
                    const allRealities = [...existingRealities];

                    // Insert new thought at random position
                    const thoughtInsertIndex = Math.floor(Math.random() * (allThoughts.length + 1));
                    allThoughts.splice(thoughtInsertIndex, 0, newThought);

                    // Insert new reality at random position
                    const realityInsertIndex = Math.floor(Math.random() * (allRealities.length + 1));
                    allRealities.splice(realityInsertIndex, 0, newReality);

                    const newItems = [...allThoughts, ...allRealities];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                // Check if game is complete
                if (newMatchedPairs.length === thoughtPairs.length) {
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
                        <Zap size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Feast or Famine Match Game</Text>

                    <Text style={styles.introDescription}>
                        Living with a variable income creates its own set of myths. Let's bust the ones that keep you stuck in a cycle of financial stress.
                    </Text>

                    <Text style={styles.introSubtext}>
                        Match the common thought to the practical reality to help you build your buffers and prepare for your pivot.
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

    // Conclusion Screen
    if (currentScreen === 2) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.conclusionContainer}>
                    <View style={styles.conclusionIcon}>
                        <Zap size={40} color="#5A7D7B" />
                    </View>

                    <Text style={styles.conclusionTitle}>Great Work!</Text>

                    <Text style={styles.conclusionText}>
                        The "feast or famine" cycle doesn't have to control you. By planning for the dips during the peaks, you take back control.
                    </Text>

                    <Text style={styles.conclusionText}>
                        Your financial stability isn't about how much you make in one month. It's about the system you build over time.
                    </Text>

                    <Text style={styles.conclusionClosing}>
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
                        {matchedPairs.length}/{thoughtPairs.length} pairs matched
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(matchedPairs.length / thoughtPairs.length) * 100}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.gameTitle}>Feast or Famine Match Game</Text>
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
        marginBottom: 20,
    },
    introSubtext: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
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
        minHeight: 100,
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
    conclusionContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    conclusionIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    conclusionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    conclusionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    conclusionClosing: {
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