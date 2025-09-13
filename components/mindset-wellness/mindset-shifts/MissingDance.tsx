import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Heart, ArrowLeft, ChevronLeft } from 'lucide-react-native';

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
                {onBack && (
                    <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                        <ArrowLeft size={28} color="#647C90" />
                    </TouchableOpacity>
                )}
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <Heart size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Missing dance?</Text>

                    <Text style={styles.introDescription}>
                        When you first step away from the stage, chances are, you're going to miss it. Tap through these easy ideas to tap back into your dancer side when you're feeling nostalgic.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Let's begin</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Final Screen (handled by tipIndex = -1 in history)
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.tipIndex === -1) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
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

    // Tip Screens
    const currentTip = danceTips[currentTipIndex];

    // Calculate progress for tip screens
    const tipProgress = ((currentTipIndex + 1) / danceTips.length) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {currentTipIndex + 1} of {danceTips.length} tips
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${tipProgress}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.tipContainer}>
                <Text style={styles.tipTitle}>{currentTip.title}</Text>

                <View style={styles.tipCard}>
                    <Text style={styles.tipText}>{currentTip.description}</Text>
                </View>

                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <LinearGradient
                        colors={['#5A7D7B', '#647C90']}
                        style={styles.continueButtonGradient}
                    >
                        <Text style={styles.continueButtonText}>{currentTip.buttonText}</Text>
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
    tipContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    tipTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    tipCard: {
        backgroundColor: 'rgba(90, 125, 123, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
    },
    tipText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
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