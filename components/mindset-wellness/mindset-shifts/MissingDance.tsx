import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Heart, ArrowLeft, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DanceTip {
    id: number;
    title: string;
    description: string;
    buttonText: string;
}

const danceTips: DanceTip[] = [
    {
        id: 1,
        title: "Create a \"feels like me\" playlist",
        description: "Build a playlist of songs that light you up. They could be tunes from a show you loved or your favorite cast's backstage pump up song. Whenever you need a reminder, blast this playlist to remember, you're still that girl.",
        buttonText: "Cue the playlist!"
    },
    {
        id: 2,
        title: "Move your body!",
        description: "It might seem obvious, but as dancers, we feel best in motion. In your new job, you're likely not moving as much. So whether you take a dance class or find a new workout routine altogether, get moving to feel like yourself again.",
        buttonText: "Get moving!"
    },
    {
        id: 3,
        title: "Find a new creative outlet",
        description: "Obvious choices could be painting or writing, but there are so many ways to explore your creativity that are practical too. Gardening, cooking, and interior design are all new ways to tap into your creative side.",
        buttonText: "The juices are flowing!"
    },
    {
        id: 4,
        title: "Reconnect with dance friends",
        description: "There's no friends like dance friends and even if it feels isolating to pivot, you're really not alone. Schedule a coffee or call with a dance friend you haven't seen in a while.",
        buttonText: "Call her up!"
    },
    {
        id: 5,
        title: "Design a structured routine",
        description: "Former dancers often miss the structure of dance more than anything. Daily, repetitive movements ground us and comfort us. Create a short ritual like a warm-up routine or ballet barre that grounds you.",
        buttonText: "Create routine"
    },
    {
        id: 6,
        title: "Support the arts",
        description: "With your new salary and time off, you probably have more time to actually go support the arts. Warning: The first few times you're in the audience can be triggering. But instead of wishing you were up there, what if you allowed yourself to feel the joy of experiencing art?",
        buttonText: "Support arts"
    },
    {
        id: 7,
        title: "Just dance!",
        description: "It's easy to feel like if you're not dancing professionally that you can't still tap into your dancer side. Stay in class, drop in for a performance if you have time, create your own show.",
        buttonText: "Dance!"
    }
];

interface MissingDanceProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function MissingDance({ onComplete, onBack }: MissingDanceProps) {
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ tipIndex: number }>>([]);

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStart = () => {
        setScreenHistory([{ tipIndex: 0 }]);
    };

    const handleContinue = () => {
        if (currentTipIndex < danceTips.length - 1) {
            const newTipIndex = currentTipIndex + 1;
            setCurrentTipIndex(newTipIndex);
            setScreenHistory([...screenHistory, { tipIndex: newTipIndex }]);
        } else {
            // All tips completed, go to final screen
            setScreenHistory([...screenHistory, { tipIndex: -1 }]); // -1 represents final screen
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            // If we're at the first screen, go back to intro
            setScreenHistory([]);
            setCurrentTipIndex(0);
            return;
        }

        // Remove current screen from history
        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        // Get previous screen state
        const prevScreen = newHistory[newHistory.length - 1];

        if (prevScreen.tipIndex === -1) {
            // Shouldn't happen as we handle final screen separately
            return;
        }

        setCurrentTipIndex(prevScreen.tipIndex);
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
                            <Text style={styles.headerTitle}>Missing Dance</Text>
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
                                <Heart size={32} color="#928490" />
                            </View>

                            <Text style={styles.introTitle}>Missing dance?</Text>

                            <Text style={styles.introDescription}>
                                When you first step away from the stage, chances are, you're going to miss it. Tap through these easy ideas to tap back into your dancer side when you're feeling nostalgic.
                            </Text>

                            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Let’s Begin</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Final Screen (handled by tipIndex = -1 in history)
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.tipIndex === -1) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backIconWrapper} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Missing Dance</Text>
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
                                <Heart size={40} color="#928490" />
                            </View>
                            <Text style={styles.introTitle}>You'll always be a dancer</Text>
                            <Text style={styles.finalText}>
                                You don't need to abandon dance (even if it sometimes feels like it's abandoning you). You'll always be a dancer, and it's ok to prioritize those little things that help you feel like your dancer self again when you're missing the comforts of your first love.
                            </Text>

                            <Text style={styles.finalClosing}>
                                See you tomorrow for your final step.
                            </Text>

                            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.completeButtonText}>Mark As Complete</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Tip Screens
    const currentTip = danceTips[currentTipIndex];

    // Calculate progress for tip screens
    const tipProgress = ((currentTipIndex + 1) / danceTips.length) * 100;

    return (
        <View style={styles.container}>
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                        <ChevronLeft size={24} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>
                            {currentTipIndex + 1} of {danceTips.length}
                        </Text>
                    </View>
                    <View style={styles.backIconWrapper} />
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${tipProgress}%` }]} />
                </View>
            </View>

            <View style={styles.scrollContainer}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>
                        <Text style={styles.tipTitle}>{currentTip.title}</Text>

                        <View style={styles.tipCard}>
                            <Text style={styles.tipText}>{currentTip.description}</Text>
                        </View>

                        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                            <LinearGradient
                                colors={['#5A7D7B', '#647C90']}
                                style={styles.continueButtonContent}
                            >
                                <Text style={styles.continueButtonText}>{currentTip.buttonText}</Text>
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
        marginBottom: 40,
    },

    startButton: {
        borderRadius: 12,
        overflow: 'hidden',
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

    tipTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    tipCard: {
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
    },
    tipText: {
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
    continueButtonContent: {
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
        backgroundColor: 'rgba(100, 124, 144, 0.1)',
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