import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Scissors, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface SunkCostPair {
    id: number;
    sunkCostThought: string;
    reframe: string;
}

interface SunkCostFallacyProps {
    onComplete: () => void;
    onBack?: () => void;
}

const sunkCostPairs: SunkCostPair[] = [
    {
        id: 1,
        sunkCostThought: "I trained too long to start over.",
        reframe: "My training gave me discipline that transfers anywhere."
    },
    {
        id: 2,
        sunkCostThought: "Leaving dance means I wasted 20 years.",
        reframe: "Experience is never wasted. Dance shaped how I think and learn."
    },
    {
        id: 3,
        sunkCostThought: "If I quit, it means I failed.",
        reframe: "Pivoting means I'm choosing growth, not giving up."
    },
    {
        id: 4,
        sunkCostThought: "All those sacrifices were for nothing.",
        reframe: "Those sacrifices gave me the resilience I'll always carry."
    },
    {
        id: 5,
        sunkCostThought: "I should stick it out because I've already invested so much.",
        reframe: "If I'm feeling stuck, I should cut my losses."
    },
    {
        id: 6,
        sunkCostThought: "If I stop now, I'll disappoint everyone who believed in me.",
        reframe: "The people who matter want me to be fulfilled."
    },
    {
        id: 7,
        sunkCostThought: "I'm too old to start something new.",
        reframe: "My maturity and experience give me an edge in any new path."
    },
    {
        id: 8,
        sunkCostThought: "I've only ever been a dancer.",
        reframe: "Dance shaped my identity but it's not the whole of who I am."
    },
    {
        id: 9,
        sunkCostThought: "Switching careers means starting from zero.",
        reframe: "I'll need to be a beginner again but the challenge will be worth it."
    },
    {
        id: 10,
        sunkCostThought: "Walking away means giving up my dream.",
        reframe: "Dreams evolve. I can honor what was and still create new ones."
    }
];

export default function SunkCostFallacy({ onComplete, onBack }: SunkCostFallacyProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1 = game, 2 = reflection
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'sunkCost' | 'reframe' }>>([]);
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
        const firstThreePairs = sunkCostPairs.slice(0, 3);
        const sunkCosts: Array<{ id: string; text: string; pairId: number; type: 'sunkCost' | 'reframe' }> = [];
        const reframes: Array<{ id: string; text: string; pairId: number; type: 'sunkCost' | 'reframe' }> = [];

        firstThreePairs.forEach(pair => {
            sunkCosts.push({
                id: `sunkCost_${pair.id}`,
                text: pair.sunkCostThought,
                pairId: pair.id,
                type: 'sunkCost'
            });
            reframes.push({
                id: `reframe_${pair.id}`,
                text: pair.reframe,
                pairId: pair.id,
                type: 'reframe'
            });
        });

        // Scramble sunk costs and reframes separately to avoid same-row alignment
        const scrambledSunkCosts = [...sunkCosts].sort(() => Math.random() - 0.5);
        const scrambledReframes = [...reframes].sort(() => Math.random() - 0.5);

        // Combine into single array for game logic
        const allItems = [...scrambledSunkCosts, ...scrambledReframes];
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
                if (currentPairIndex < sunkCostPairs.length) {
                    const nextPair = sunkCostPairs[currentPairIndex];

                    // Separate existing items by type
                    const existingSunkCosts = remainingItems.filter(item => item.type === 'sunkCost');
                    const existingReframes = remainingItems.filter(item => item.type === 'reframe');

                    // Add new sunk cost and reframe
                    const newSunkCost = {
                        id: `sunkCost_${nextPair.id}`,
                        text: nextPair.sunkCostThought,
                        pairId: nextPair.id,
                        type: 'sunkCost' as const
                    };
                    const newReframe = {
                        id: `reframe_${nextPair.id}`,
                        text: nextPair.reframe,
                        pairId: nextPair.id,
                        type: 'reframe' as const
                    };

                    // Randomly insert new items to avoid predictable positioning
                    const allSunkCosts = [...existingSunkCosts];
                    const allReframes = [...existingReframes];

                    // Insert new sunk cost at random position
                    const sunkCostInsertIndex = Math.floor(Math.random() * (allSunkCosts.length + 1));
                    allSunkCosts.splice(sunkCostInsertIndex, 0, newSunkCost);

                    // Insert new reframe at random position
                    const reframeInsertIndex = Math.floor(Math.random() * (allReframes.length + 1));
                    allReframes.splice(reframeInsertIndex, 0, newReframe);

                    const newItems = [...allSunkCosts, ...allReframes];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                // Check if game is complete
                if (newMatchedPairs.length === sunkCostPairs.length) {
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
                            <Text style={styles.titleText}>Sunk Cost Fallacy</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <Scissors size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>The Sunk Cost Fallacy</Text>

                            <Text style={styles.introDescription}>
                                You haven't wasted your years in dance. Match each sunk-cost thought with a reframe that opens new doors.
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={() => setCurrentScreen(1)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Start the Game</Text>
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
                                    <Scissors size={40} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.reflectionTitle}>Cutting Your Losses</Text>

                            <Text style={styles.reflectionText}>
                                If you're ready for a shift, there's no point staying where you are. The sunk cost fallacy keeps dancers stuck in a cycle, only making it harder and harder to step away.
                            </Text>

                            <Text style={styles.reflectionText}>
                                Nothing has been wasted. It was an incredible chapter that doesn't just evaporate. You might be surprised how much of your experiences you can bring with you on the other side.
                            </Text>

                            <Text style={styles.reflectionClosing}>
                                We'll see you again tomorrow.
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
                            {matchedPairs.length}/{sunkCostPairs.length} pairs matched
                        </Text>
                    </View>
                    <View style={styles.backButton} />
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(matchedPairs.length / sunkCostPairs.length) * 100}%` }]} />
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.gameCard}>
                        <Text style={styles.gameTitle}>The Sunk Cost Fallacy</Text>
                        <Text style={styles.gameInstructions}>
                            Tap to match sunk-cost thoughts with their reframes
                        </Text>

                        <View style={styles.columnsContainer}>
                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>Sunk-Cost</Text>
                                <View style={styles.columnContent}>
                                    {gameItems.filter(item => item.type === 'sunkCost').map((item) => (
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

                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>Reframe</Text>
                                <View style={styles.columnContent}>
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
        alignItems: 'stretch', // ✅ ensure both columns stretch equally
        gap: 16,
    },
    column: {
        flex: 1,
    },
    columnContent: {
        flex: 1,              // ✅ makes each column content stretch
        justifyContent: 'space-between', // ✅ evenly distribute cards vertically
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