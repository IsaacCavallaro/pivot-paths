
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Star, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface StrengthPair {
    id: number;
    strength: string;
    jobTitles: string;
}

interface StartWithYourStrengthsProps {
    onComplete: () => void;
    onBack?: () => void;
}

const strengthPairs: StrengthPair[] = [
    {
        id: 1,
        strength: "Creative expression",
        jobTitles: "Marketing, Graphic Design, or Creative Direction"
    },
    {
        id: 2,
        strength: "Leadership in rehearsals",
        jobTitles: "Project Manager, Team Lead, or People Manager"
    },
    {
        id: 3,
        strength: "Physical awareness & technique",
        jobTitles: "Physiotherapist, Occupational Therapist, or Personal Trainer"
    },
    {
        id: 4,
        strength: "Resilience through rejection",
        jobTitles: "Sales, Entrepreneurship, or Start-up Founder"
    },
    {
        id: 5,
        strength: "Attention to detail in choreography",
        jobTitles: "Data Analyst, Quality Assurance, or UX Designer"
    },
    {
        id: 6,
        strength: "Improvisation on stage",
        jobTitles: "Event Manager, Crisis Response, or Innovation Specialist"
    },
    {
        id: 7,
        strength: "Teaching younger dancers",
        jobTitles: "Educator, Corporate Trainer, or Learning & Development Specialist"
    },
    {
        id: 8,
        strength: "Balancing rehearsals, gigs & jobs",
        jobTitles: "Operations Manager, Administrative Coordinator, or Executive Assistant"
    },
    {
        id: 9,
        strength: "Performing under pressure",
        jobTitles: "Public Relations, Broadcaster, or Presenter"
    },
    {
        id: 10,
        strength: "Collaborating with casts & choreographers",
        jobTitles: "Human Resources, Community Manager, or Team Coordinator"
    }
];

export default function StartWithYourStrengths({ onComplete, onBack }: StartWithYourStrengthsProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1 = game, 2 = reflection
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'strength' | 'jobTitles' }>>([]);
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
        const firstThreePairs = strengthPairs.slice(0, 3);
        const strengths: Array<{ id: string; text: string; pairId: number; type: 'strength' | 'jobTitles' }> = [];
        const jobTitles: Array<{ id: string; text: string; pairId: number; type: 'strength' | 'jobTitles' }> = [];

        firstThreePairs.forEach(pair => {
            strengths.push({
                id: `strength_${pair.id}`,
                text: pair.strength,
                pairId: pair.id,
                type: 'strength'
            });
            jobTitles.push({
                id: `jobTitles_${pair.id}`,
                text: pair.jobTitles,
                pairId: pair.id,
                type: 'jobTitles'
            });
        });

        // Scramble strengths and job titles separately to avoid same-row alignment
        const scrambledStrengths = [...strengths].sort(() => Math.random() - 0.5);
        const scrambledJobTitles = [...jobTitles].sort(() => Math.random() - 0.5);

        // Combine into single array for game logic
        const allItems = [...scrambledStrengths, ...scrambledJobTitles];
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
                if (currentPairIndex < strengthPairs.length) {
                    const nextPair = strengthPairs[currentPairIndex];

                    // Separate existing items by type
                    const existingStrengths = remainingItems.filter(item => item.type === 'strength');
                    const existingJobTitles = remainingItems.filter(item => item.type === 'jobTitles');

                    // Add new strength and job titles
                    const newStrength = {
                        id: `strength_${nextPair.id}`,
                        text: nextPair.strength,
                        pairId: nextPair.id,
                        type: 'strength' as const
                    };
                    const newJobTitles = {
                        id: `jobTitles_${nextPair.id}`,
                        text: nextPair.jobTitles,
                        pairId: nextPair.id,
                        type: 'jobTitles' as const
                    };

                    // Randomly insert new items to avoid predictable positioning
                    const allStrengths = [...existingStrengths];
                    const allJobTitles = [...existingJobTitles];

                    // Insert new strength at random position
                    const strengthInsertIndex = Math.floor(Math.random() * (allStrengths.length + 1));
                    allStrengths.splice(strengthInsertIndex, 0, newStrength);

                    // Insert new job titles at random position
                    const jobTitlesInsertIndex = Math.floor(Math.random() * (allJobTitles.length + 1));
                    allJobTitles.splice(jobTitlesInsertIndex, 0, newJobTitles);

                    const newItems = [...allStrengths, ...allJobTitles];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                // Check if game is complete
                if (newMatchedPairs.length === strengthPairs.length) {
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

                    <Text style={styles.introTitle}>Start With Your Strengths</Text>

                    <Text style={styles.introDescription}>
                        Match your natural strengths as a dancer with relevant job titles.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={() => setCurrentScreen(1)}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Start the Game</Text>
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

                    <Text style={styles.reflectionTitle}>Step Back & Reflect</Text>

                    <Text style={styles.reflectionText}>
                        The best place to start learning new skills is not to start from scratch, but to build on your existing strengths.
                    </Text>

                    <Text style={styles.reflectionText}>
                        As you matched these pairs, did you start to consider a few career paths you hadn't previously considered?
                    </Text>

                    <Text style={styles.reflectionClosing}>
                        We'll build on this tomorrow.
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
                        {matchedPairs.length}/{strengthPairs.length} pairs matched
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(matchedPairs.length / strengthPairs.length) * 100}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.gameTitle}>Start With Your Strengths</Text>
                <Text style={styles.gameInstructions}>
                    Tap to match dancer strengths with relevant job titles
                </Text>

                <View style={styles.columnsContainer}>
                    <View style={styles.column}>
                        <Text style={styles.columnTitle}>Dancer Strength</Text>
                        {gameItems.filter(item => item.type === 'strength').map((item) => (
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
                        <Text style={styles.columnTitle}>Job Titles</Text>
                        {gameItems.filter(item => item.type === 'jobTitles').map((item) => (
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
        backgroundColor: 'rgba(90, 125, 123, 0.2)',
        borderColor: '#5A7D7B',
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
        color: '#5A7D7B',
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