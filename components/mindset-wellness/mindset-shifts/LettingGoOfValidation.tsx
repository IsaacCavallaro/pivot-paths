import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Heart, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface ValidationPair {
    id: number;
    oldBelief: string;
    newBelief: string;
    buttonText: string;
}

const validationPairs: ValidationPair[] = [
    {
        id: 1,
        oldBelief: "I need applause to feel accomplished.",
        newBelief: "I celebrate myself when I show up, try, and grow.",
        buttonText: "That's better!"
    },
    {
        id: 2,
        oldBelief: "I only know I'm good enough when others say it.",
        newBelief: "I decide what's enough for me.",
        buttonText: "Ok strong inner monologue!"
    },
    {
        id: 3,
        oldBelief: "My resume proves my worth.",
        newBelief: "I'm worthy, no matter what I've booked.",
        buttonText: "Unshakable confidence!"
    },
    {
        id: 4,
        oldBelief: "Other people's approval keeps me going.",
        newBelief: "I'm giving myself permission to feel joy and fulfillment.",
        buttonText: "Yes, that's sustainable!"
    },
    {
        id: 5,
        oldBelief: "I'll never measure up to their expectations.",
        newBelief: "I set my own standards and only need to be better than yesterday.",
        buttonText: "Growth mindset unlocked!"
    }
];

interface LettingGoOfValidationProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function LettingGoOfValidation({ onComplete, onBack }: LettingGoOfValidationProps) {
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showNewBelief, setShowNewBelief] = useState(false);
    const [screenHistory, setScreenHistory] = useState<Array<{ pairIndex: number, showNew: boolean }>>([]);

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartGame = () => {
        setScreenHistory([{ pairIndex: 0, showNew: false }]);
    };

    const handleContinue = () => {
        if (showNewBelief) {
            // Move to next pair
            if (currentPairIndex < validationPairs.length - 1) {
                const newPairIndex = currentPairIndex + 1;
                setCurrentPairIndex(newPairIndex);
                setShowNewBelief(false);
                setScreenHistory([...screenHistory, { pairIndex: newPairIndex, showNew: false }]);
            } else {
                // All pairs completed, go to final screen
                setScreenHistory([...screenHistory, { pairIndex: -1, showNew: false }]); // -1 represents final screen
            }
        } else {
            // Show new belief for current pair
            setShowNewBelief(true);
            setScreenHistory([...screenHistory, { pairIndex: currentPairIndex, showNew: true }]);
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            // If we're at the first screen, go back to intro
            setScreenHistory([]);
            setCurrentPairIndex(0);
            setShowNewBelief(false);
            return;
        }

        // Remove current screen from history
        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        // Get previous screen state
        const prevScreen = newHistory[newHistory.length - 1];

        if (prevScreen.pairIndex === -1) {
            // Shouldn't happen as we handle final screen separately
            return;
        }

        setCurrentPairIndex(prevScreen.pairIndex);
        setShowNewBelief(prevScreen.showNew);
    };

    // Intro Screen
    if (screenHistory.length === 0) {
        return (
            <View style={styles.container}>
                {onBack && (
                    <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                        <ArrowLeft size={28} color="#647C90" />
                    </TouchableOpacity>
                )}
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <Heart size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Letting Go of Validation</Text>

                    <Text style={styles.introDescription}>
                        As dancers, we're used to applause, casting lists, and approval from teachers and directors. But what happens when those voices go quiet?

                        Let's practice rewriting validation so it comes from you.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Swipe to begin</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Final Screen (handled by pairIndex = -1 in history)
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.pairIndex === -1) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
                    <View style={styles.finalIcon}>
                        <Heart size={40} color="#928490" />
                    </View>
                    <Text style={styles.introTitle}>Internal vs External Validation</Text>
                    <Text style={styles.finalText}>
                        Validation feels different when it comes from within. Practice these reframes out loud, and notice how it shifts your energy.

                        When you validate yourself, external praise becomes extra, not essential.
                    </Text>

                    <Text style={styles.finalClosing}>
                        See you tomorrow for the next step.
                    </Text>

                    <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                        <View
                            style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.completeButtonText}>Mark As Complete</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={20} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Belief Screens
    const currentPair = validationPairs[currentPairIndex];

    // Calculate progress for belief screens
    const beliefProgress = ((currentPairIndex + 1) / validationPairs.length) * 100;

    if (!showNewBelief) {
        // Show old belief
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {currentPairIndex + 1} of {validationPairs.length}
                        </Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${beliefProgress}%` }]} />
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.beliefContainer}>
                    <Text style={styles.beliefLabel}>What I used to believe:</Text>

                    <View style={styles.oldBeliefCard}>
                        <Text style={styles.oldBeliefText}>"{currentPair.oldBelief}"</Text>
                    </View>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <LinearGradient
                            colors={['#928490', '#746C70']}
                            style={styles.continueButtonGradient}
                        >
                            <Text style={styles.continueButtonText}>See the alternative</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>
                        {screenHistory.length <= 1 ? 'Back to Intro' : 'Previous'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        // Show new belief
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {currentPairIndex + 1} of {validationPairs.length}
                        </Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${beliefProgress}%` }]} />
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.beliefContainer}>
                    <Text style={styles.beliefLabel}>What I can say instead:</Text>

                    <View style={styles.newBeliefCard}>
                        <Text style={styles.newBeliefText}>"{currentPair.newBelief}"</Text>
                    </View>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <LinearGradient
                            colors={['#5A7D7B', '#647C90']}
                            style={styles.continueButtonGradient}
                        >
                            <Text style={styles.continueButtonText}>{currentPair.buttonText}</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={20} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0',
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
        marginBottom: 20,
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 24,
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
    beliefContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    beliefLabel: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    oldBeliefCard: {
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
    },
    oldBeliefText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 26,
        fontStyle: 'italic',
    },
    newBeliefCard: {
        backgroundColor: 'rgba(90, 125, 123, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
    },
    newBeliefText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
        fontStyle: 'italic',
    },
    continueButton: {
        borderRadius: 12,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    continueButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
    },
    finalContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    finalIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    finalText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    finalClosing: {
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
    topBackButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        zIndex: 1,
        padding: 8,
    },
});