import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Target, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface ThoughtActionPair {
    id: number;
    thought: string;
    action: string;
}

interface OvercomeAnalysisParalysisProps {
    onComplete: () => void;
    onBack?: () => void;
}

const thoughtActionPairs: ThoughtActionPair[] = [
    {
        id: 1,
        thought: "I don't know enough yet",
        action: "Start learning for free on YouTube"
    },
    {
        id: 2,
        thought: "What if I fail?",
        action: "Start towards your goal today and aim to fail faster"
    },
    {
        id: 3,
        thought: "I need more research first",
        action: "Take action into the unknown"
    },
    {
        id: 4,
        thought: "I'll never be ready",
        action: "Take the first step before you feel ready"
    },
    {
        id: 5,
        thought: "I don't have the right connections",
        action: "Reach out to one person in your network"
    },
    {
        id: 6,
        thought: "I don't have time",
        action: "Set a 15-minute time block to start"
    },
    {
        id: 7,
        thought: "I need perfect clarity first",
        action: "Draft a rough plan and aim for completion, not perfection"
    },
    {
        id: 8,
        thought: "I can't do it alone",
        action: "Ask one person for feedback or help"
    },
    {
        id: 9,
        thought: "I should wait until inspiration hits",
        action: "Take action through discipline, not motivation"
    }
];

export default function OvercomeAnalysisParalysis({ onComplete, onBack }: OvercomeAnalysisParalysisProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1 = game, 2 = reflection
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'thought' | 'action' }>>([]);
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
        const firstThreePairs = thoughtActionPairs.slice(0, 3);
        const thoughts: Array<{ id: string; text: string; pairId: number; type: 'thought' | 'action' }> = [];
        const actions: Array<{ id: string; text: string; pairId: number; type: 'thought' | 'action' }> = [];

        firstThreePairs.forEach(pair => {
            thoughts.push({
                id: `thought_${pair.id}`,
                text: pair.thought,
                pairId: pair.id,
                type: 'thought'
            });
            actions.push({
                id: `action_${pair.id}`,
                text: pair.action,
                pairId: pair.id,
                type: 'action'
            });
        });

        // Scramble thoughts and actions separately to avoid same-row alignment
        const scrambledThoughts = [...thoughts].sort(() => Math.random() - 0.5);
        const scrambledActions = [...actions].sort(() => Math.random() - 0.5);

        // Combine into single array for game logic
        const allItems = [...scrambledThoughts, ...scrambledActions];
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
                if (currentPairIndex < thoughtActionPairs.length) {
                    const nextPair = thoughtActionPairs[currentPairIndex];

                    // Separate existing items by type
                    const existingThoughts = remainingItems.filter(item => item.type === 'thought');
                    const existingActions = remainingItems.filter(item => item.type === 'action');

                    // Add new thought and action
                    const newThought = {
                        id: `thought_${nextPair.id}`,
                        text: nextPair.thought,
                        pairId: nextPair.id,
                        type: 'thought' as const
                    };
                    const newAction = {
                        id: `action_${nextPair.id}`,
                        text: nextPair.action,
                        pairId: nextPair.id,
                        type: 'action' as const
                    };

                    // Randomly insert new items to avoid predictable positioning
                    const allThoughts = [...existingThoughts];
                    const allActions = [...existingActions];

                    // Insert new thought at random position
                    const thoughtInsertIndex = Math.floor(Math.random() * (allThoughts.length + 1));
                    allThoughts.splice(thoughtInsertIndex, 0, newThought);

                    // Insert new action at random position
                    const actionInsertIndex = Math.floor(Math.random() * (allActions.length + 1));
                    allActions.splice(actionInsertIndex, 0, newAction);

                    const newItems = [...allThoughts, ...allActions];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                // Check if game is complete
                if (newMatchedPairs.length === thoughtActionPairs.length) {
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
                        <Target size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Overcome Analysis Paralysis</Text>

                    <Text style={styles.introDescription}>
                        Match the thought that keeps you stuck with the action that breaks the pattern.
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
                        <Target size={40} color="#5A7D7B" />
                    </View>

                    <Text style={styles.reflectionTitle}>Action > Analysis</Text>

                    <Text style={styles.reflectionText}>
                        Great job! Notice how each overthinking thought can be paired with a small action.
                    </Text>

                    <Text style={styles.reflectionText}>
                        When you take one step, momentum grows, and the next step becomes easier.
                    </Text>

                    <Text style={styles.reflectionText}>
                        It's always good to have a plan, but the hard part isn't talking the talk, it's walking the walk.
                    </Text>

                    <Text style={styles.reflectionClosing}>
                        Take action today and we'll see you again tomorrow.
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
                        {matchedPairs.length}/{thoughtActionPairs.length} pairs matched
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(matchedPairs.length / thoughtActionPairs.length) * 100}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.gameTitle}>Overcome Analysis Paralysis</Text>
                <Text style={styles.gameInstructions}>
                    Tap to match overthinking thoughts with breakthrough actions
                </Text>

                <View style={styles.columnsContainer}>
                    <View style={styles.column}>
                        <Text style={styles.columnTitle}>Thought</Text>
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
                        <Text style={styles.columnTitle}>Action</Text>
                        {gameItems.filter(item => item.type === 'action').map((item) => (
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