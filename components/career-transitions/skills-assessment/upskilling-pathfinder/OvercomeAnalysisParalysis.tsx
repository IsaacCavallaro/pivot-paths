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
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Overcome Analysis Paralysis</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <Target size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>Overcome Analysis Paralysis</Text>

                            <Text style={styles.introDescription}>
                                Match the thought that keeps you stuck with the action that breaks the pattern.
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={() => setCurrentScreen(1)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Start the game</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen
    if (currentScreen === 2) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backButton} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Reflection</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.reflectionCard}>
                            <View style={styles.reflectionIconContainer}>
                                <View style={[styles.reflectionIconGradient, { backgroundColor: '#928490' }]}>
                                    <Target size={40} color="#E2DED0" />
                                </View>
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

                            <TouchableOpacity
                                style={styles.completeButton}
                                onPress={handleComplete}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.completeButtonText}>Mark As Complete</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Game Screen
    return (
        <View style={styles.container}>
            {/* Sticky Header with Progress */}
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <ArrowLeft size={28} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.progressText}>
                            {matchedPairs.length}/{thoughtActionPairs.length} pairs matched
                        </Text>
                    </View>
                    <View style={styles.backButton} />
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(matchedPairs.length / thoughtActionPairs.length) * 100}%` }]} />
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.gameCard}>
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
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0',
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
    },
    content: {
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
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
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
        marginBottom: 15,
        fontWeight: '700',
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 40,
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
    gameCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
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
        height: 80,
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
    reflectionCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    reflectionIconContainer: {
        marginBottom: 30,
    },
    reflectionIconGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    reflectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: '700',
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
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: '600',
    },
    completeButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    completeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E2DED0',
    },
    completeButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
});