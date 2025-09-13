import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Heart, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface Activity {
    id: number;
    question: string;
    buttonText: string;
}

const activities: Activity[] = [
    {
        id: 1,
        question: "Who's someone you've shown up for recently, or who's shown up for you?",
        buttonText: "Send them a 'thinking of you' message"
    },
    {
        id: 2,
        question: "Where do you feel a sense of belonging outside of work?",
        buttonText: "Show up in that space this week"
    },
    {
        id: 3,
        question: "How do you move your body now that feels good… not to perform, but for just you?",
        buttonText: "Schedule it in"
    },
    {
        id: 4,
        question: "Dance let you tell stories. How else can you share your perspective?",
        buttonText: "Write down 5 ideas"
    },
    {
        id: 5,
        question: "What's the last thing you made that wasn't work-related?",
        buttonText: "Block out 30 minutes to create something"
    },
    {
        id: 6,
        question: "What topic or skill excites your curiosity right now?",
        buttonText: "Find a podcast to explore it today"
    },
    {
        id: 7,
        question: "What vision or idea has been floating around in your mind lately?",
        buttonText: "Map it out"
    },
    {
        id: 8,
        question: "When was the last time you tried something brand new?",
        buttonText: "Pick a new hobby to try this week"
    }
];

interface MoreThanWorkProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function MoreThanWork({ onComplete, onBack }: MoreThanWorkProps) {
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ activityIndex: number }>>([]);

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartActivity = () => {
        setScreenHistory([{ activityIndex: 0 }]);
    };

    const handleContinue = () => {
        if (currentActivityIndex < activities.length - 1) {
            const newActivityIndex = currentActivityIndex + 1;
            setCurrentActivityIndex(newActivityIndex);
            setScreenHistory([...screenHistory, { activityIndex: newActivityIndex }]);
        } else {
            // All activities completed, go to final screen
            setScreenHistory([...screenHistory, { activityIndex: -1 }]); // -1 represents final screen
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            // If we're at the first screen, go back to intro
            setScreenHistory([]);
            setCurrentActivityIndex(0);
            return;
        }

        // Remove current screen from history
        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        // Get previous screen state
        const prevScreen = newHistory[newHistory.length - 1];

        if (prevScreen.activityIndex === -1) {
            // Shouldn't happen as we handle final screen separately
            return;
        }

        setCurrentActivityIndex(prevScreen.activityIndex);
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

                    <Text style={styles.introTitle}>More Than Your Work</Text>

                    <Text style={styles.introDescription}>
                        As a dancer, you lived and breathed it. We all did! But now, we're going to do things differently. Of course, we hope you find meaningful work off the stage. But we also want to make sure you're still *you,* in ways that have nothing to do with your job. Here are some action ideas to remind you that you're more than work.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartActivity}>
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

    // Final Screen (handled by activityIndex = -1 in history)
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.activityIndex === -1) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
                    <View style={styles.finalIcon}>
                        <Heart size={40} color="#928490" />
                    </View>
                    <Text style={styles.introTitle}>You're so much more</Text>
                    <Text style={styles.finalText}>
                        You're more than a dancer and you're more than the work you do next. You're a friend, a learner, a dreamer, an explorer, and so much more. Let these roles remind you that balance is about honoring *all parts the of you*.
                    </Text>

                    <Text style={styles.finalClosing}>
                        See you tomorrow.
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

    // Activity Screens
    const currentActivity = activities[currentActivityIndex];

    // Calculate progress for activity screens
    const activityProgress = ((currentActivityIndex + 1) / activities.length) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {currentActivityIndex + 1} of {activities.length} activities
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${activityProgress}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.activityContainer}>
                <Text style={styles.activityQuestion}>{currentActivity.question}</Text>

                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <LinearGradient
                        colors={['#5A7D7B', '#647C90']}
                        style={styles.continueButtonGradient}
                    >
                        <Text style={styles.continueButtonText}>{currentActivity.buttonText}</Text>
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
    activityContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    activityQuestion: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 32,
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