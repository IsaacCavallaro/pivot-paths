import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Lightbulb, ArrowLeft, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        {onBack ? (
                            <TouchableOpacity style={styles.backIconWrapper} onPress={handleBack}>
                                <ArrowLeft size={24} color="#E2DED0" />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.backIconWrapper} />
                        )}
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Spark Curiosity</Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
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
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Let's go</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Final Screen (handled by cardIndex = -1 in history)
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.cardIndex === -1) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                            <ChevronLeft size={24} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Spark Curiosity</Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
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

                            <Text style={styles.finalText}>
                                See you tomorrow.
                            </Text>

                            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.completeButtonText}>Mark as Complete</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Card Screens
    const currentCard = curiosityCards[currentCardIndex];

    // Calculate progress for card screens
    const cardProgress = ((currentCardIndex + 1) / curiosityCards.length) * 100;

    return (
        <View style={styles.container}>
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                        <ChevronLeft size={24} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>
                            {currentCardIndex + 1} of {curiosityCards.length}
                        </Text>
                    </View>
                    <View style={styles.backIconWrapper} />
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${cardProgress}%` }]} />
                </View>
            </View>

            <View style={styles.scrollContainer}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>
                        <View style={styles.promptCard}>
                            <Text style={styles.promptText}>"{currentCard.prompt}"</Text>
                        </View>

                        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                            <LinearGradient
                                colors={['#928490', '#928490']}
                                style={styles.continueButtonGradient}
                            >
                                <Text style={styles.continueButtonText}>{currentCard.buttonText}</Text>
                                <ChevronRight size={16} color="#E2DED0" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
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
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backIconWrapper: {
        width: 40,
        alignItems: 'center'
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#E2DED0',
    },

    card: {
        width: width * 0.85,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
        marginTop: 120,
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
        fontSize: 28,
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
    startButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    startButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#E2DED0',
        marginRight: 8,
    },

    promptCard: {
        backgroundColor: 'rgba(90, 125, 123, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 30,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
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
    },
    continueButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
    },

    finalIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
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
    completeButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    completeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    completeButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
    },

    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        marginTop: 12,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#E2DED0',
        borderRadius: 3,
    },
});