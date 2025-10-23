import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ArrowLeft, ChevronLeft, Play } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ActionCard {
    id: number;
    action: string;
    buttonText: string;
}

const actionCards: ActionCard[] = [
    {
        id: 1,
        action: "Send one LinkedIn connection request to someone you admire",
        buttonText: "Sent!"
    },
    {
        id: 2,
        action: "Research one course, workshop, or webinar in a field that interests you",
        buttonText: "Done!"
    },
    {
        id: 3,
        action: "Write a 3-line elevator pitch about your skills and experience",
        buttonText: "Nailed it!"
    },
    {
        id: 4,
        action: "Reach out to a friend or former colleague to ask about their career path",
        buttonText: "Sent!"
    },
    {
        id: 5,
        action: "Ask someone for a small feedback or advice session",
        buttonText: "Asked!"
    },
    {
        id: 6,
        action: "Volunteer for a project in your community",
        buttonText: "Done!"
    },
    {
        id: 7,
        action: "Make a list of 3 potential roles or industries you'd like to explore",
        buttonText: "Got it!"
    },
    {
        id: 8,
        action: "Comment on a LinkedIn post or join a discussion in an online community",
        buttonText: "Posted!"
    },
    {
        id: 9,
        action: "Spend 15 minutes practicing or trying a new skill",
        buttonText: "Yes!"
    },
    {
        id: 10,
        action: "Reflect for 5 minutes: what's one small step you can take right now?",
        buttonText: "Start now"
    }
];

interface JustStartProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function JustStart({ onComplete, onBack }: JustStartProps) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ cardIndex: number }>>([]);
    const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartGame = () => {
        setScreenHistory([{ cardIndex: 0 }]);
    };

    const handleCardComplete = () => {
        const newCompletedCards = new Set(completedCards);
        newCompletedCards.add(currentCardIndex);
        setCompletedCards(newCompletedCards);

        if (currentCardIndex < actionCards.length - 1) {
            // Move to next card
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
                            <Text style={styles.headerTitle}>Just Start</Text>
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
                                <Play size={32} color="#928490" />
                            </View>

                            <Text style={styles.introTitle}>Just Start</Text>

                            <Text style={styles.introDescription}>
                                Swipe through each card and commit to doing it today. Even small actions count.
                            </Text>

                            <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Get started</Text>
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
                        <View style={styles.backIconWrapper} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Just Start</Text>
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
                                <Play size={40} color="#928490" />
                            </View>
                            <Text style={styles.introTitle}>The time is now</Text>
                            <Text style={styles.finalText}>
                                Stop waiting for tomorrow to make a change. Each small action builds momentum toward your pivot. Keep taking steps, even tiny ones, because progress compounds over time. It won't be perfect, it won't be linear, but it can be done.
                            </Text>

                            <Text style={styles.finalClosing}>
                                This is your life. Start now.
                            </Text>

                            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.completeButtonText}>Mark as complete</Text>
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
    const currentCard = actionCards[currentCardIndex];

    // Calculate progress for card screens
    const cardProgress = ((currentCardIndex + 1) / actionCards.length) * 100;
    const isCompleted = completedCards.has(currentCardIndex);

    return (
        <View style={styles.container}>
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                        <ChevronLeft size={24} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>
                            {currentCardIndex + 1} of {actionCards.length}
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
                        <View style={[styles.actionCard, isCompleted && styles.completedCard]}>
                            <Text style={styles.actionText}>{currentCard.action}</Text>
                        </View>

                        <View style={styles.navigationDots}>
                            {actionCards.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        index === currentCardIndex && styles.activeDot,
                                        completedCards.has(index) && styles.completedDot
                                    ]}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.actionButton, isCompleted && styles.completedButton]}
                            onPress={handleCardComplete}
                        >
                            <LinearGradient
                                colors={isCompleted ? ['#5A7D7B', '#647C90'] : ['#928490', '#746C70']}
                                style={styles.actionButtonContent}
                            >
                                <Text style={styles.actionButtonText}>
                                    {isCompleted ? '✓ ' + currentCard.buttonText : currentCard.buttonText}
                                </Text>
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
        backgroundColor: '#E2DED0'
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
        alignItems: 'center'
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
        backgroundColor: 'rgba(146,132,144,0.1)',
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
        marginBottom: 40,
    },

    startButton: {
        borderRadius: 12,
        overflow: 'hidden'
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

    actionCard: {
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
    },
    completedCard: {
        backgroundColor: 'rgba(90, 125, 123, 0.15)',
        borderLeftColor: '#5A7D7B',
    },
    actionText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
    },

    navigationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(100, 124, 144, 0.3)',
        marginHorizontal: 4,
        marginVertical: 2,
    },
    activeDot: {
        backgroundColor: '#928490',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    completedDot: {
        backgroundColor: '#5A7D7B',
    },

    actionButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    completedButton: {
        opacity: 0.8,
    },
    actionButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    actionButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
    },

    finalIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(100,124,144,0.1)',
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
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 40,
    },

    completeButton: {
        borderRadius: 12,
        overflow: 'hidden'
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
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 3,
        marginTop: 12,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#E2DED0',
        borderRadius: 3,
    },
});