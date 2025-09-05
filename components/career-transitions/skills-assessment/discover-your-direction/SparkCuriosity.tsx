import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Lightbulb, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface CuriosityCard {
    id: number;
    prompt: string;
    buttonText: string;
}

const curiosityCards: CuriosityCard[] = [
    {
        id: 1,
        prompt: "Think of a career you've admired from afar. What is it about this role that catches your attention?",
        buttonText: "Write it down"
    },
    {
        id: 2,
        prompt: "If you could spend one day in someone else's job, who would it be and why?",
        buttonText: "Think about it"
    },
    {
        id: 3,
        prompt: "What tasks or activities make time fly for you? Could these appear in a career?",
        buttonText: "Let's reflect"
    },
    {
        id: 4,
        prompt: "Imagine a time when you felt fully confident. What environment, people, and responsibilities helped create that confidence?",
        buttonText: "Hmm… interesting"
    },
    {
        id: 5,
        prompt: "Pick an industry you know nothing about. What's one question you'd ask someone working there to learn more?",
        buttonText: "Start asking"
    },
    {
        id: 6,
        prompt: "Think about a problem you enjoyed solving in your dance career. Could that same mindset apply in another context?",
        buttonText: "Do some reflection"
    },
    {
        id: 7,
        prompt: "Who do you know with a career you're curious about? What would you want to ask them if you had 15 minutes?",
        buttonText: "Get thinking"
    },
    {
        id: 8,
        prompt: "If you had unlimited time for learning, what skill or craft would you dive into next?",
        buttonText: "Let's learn"
    },
    {
        id: 9,
        prompt: "Picture your ideal workday five years from now. What are three things you'd do that excite you most?",
        buttonText: "Sounds good!"
    }
];

interface SparkCuriosityProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function SparkCuriosity({ onComplete, onBack }: SparkCuriosityProps) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ cardIndex: number }>>([]);

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartGame = () => {
        setScreenHistory([{ cardIndex: 0 }]);
    };

    const handleContinue = () => {
        if (currentCardIndex < curiosityCards.length - 1) {
            const newCardIndex = currentCardIndex + 1;
            setCurrentCardIndex(newCardIndex);
            setScreenHistory([...screenHistory, { cardIndex: newCardIndex }]);
        } else {
            // All cards completed, go to final screen
            setScreenHistory([...screenHistory, { cardIndex: -1 }]); // -1 represents final screen
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            // If we're at the first screen, go back to intro
            setScreenHistory([]);
            setCurrentCardIndex(0);
            return;
        }

        // Remove current screen from history
        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        // Get previous screen state
        const prevScreen = newHistory[newHistory.length - 1];

        if (prevScreen.cardIndex === -1) {
            // Shouldn't happen as we handle final screen separately
            return;
        }

        setCurrentCardIndex(prevScreen.cardIndex);
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
                        <Lightbulb size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Spark Curiosity</Text>

                    <Text style={styles.introDescription}>
                        Curiosity is the engine of your pivot. Today we're here to spark new ideas, help you explore untapped careers, and uncover possibilities you might not have considered.
                    </Text>

                    <Text style={styles.introDescription}>
                        Swipe through each card, reflect, and take note of what excites you.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Let's go</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Final Screen (handled by cardIndex = -1 in history)
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.cardIndex === -1) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
                    <View style={styles.finalIcon}>
                        <Lightbulb size={40} color="#928490" />
                    </View>
                    <Text style={styles.introTitle}>It's Time to Reflect</Text>
                    <Text style={styles.finalText}>
                        Exploring your curiosity doesn't mean you have to have all the answers right now. Each question is a doorway to possibilities, and the more you engage with them, the clearer your path becomes.
                    </Text>

                    <Text style={styles.finalText}>
                        Take note of anything that excites you. You'll come back to it as you explore career options in the coming days.
                    </Text>

                    <Text style={styles.finalClosing}>
                        See you tomorrow.
                    </Text>

                    <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                        <View
                            style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.completeButtonText}>Mark as Complete</Text>
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

    // Card Screens
    const currentCard = curiosityCards[currentCardIndex];

    // Calculate progress for card screens
    const cardProgress = ((currentCardIndex + 1) / curiosityCards.length) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {currentCardIndex + 1} of {curiosityCards.length}
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${cardProgress}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.cardContainer}>
                <View style={styles.promptCard}>
                    <Text style={styles.promptText}>"{currentCard.prompt}"</Text>
                </View>

                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <LinearGradient
                        colors={['#5A7D7B', '#647C90']}
                        style={styles.continueButtonGradient}
                    >
                        <Text style={styles.continueButtonText}>{currentCard.buttonText}</Text>
                        <ChevronRight size={16} color="#E2DED0" />
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <ChevronLeft size={20} color="#647C90" />
                <Text style={styles.backButtonText}>
                    {screenHistory.length <= 1 ? 'Back to Intro' : 'Previous'}
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
        marginBottom: 20,
    },
    startButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 20,
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
    cardContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    promptCard: {
        backgroundColor: 'rgba(90, 125, 123, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
    },
    promptText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
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