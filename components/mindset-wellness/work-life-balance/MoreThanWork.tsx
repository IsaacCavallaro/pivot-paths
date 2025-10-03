import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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

    // Calculate progress for activity screens
    const activityProgress = ((currentActivityIndex + 1) / activities.length) * 100;

    // Intro Screen
    if (screenHistory.length === 0) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>More Than Your Work</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollViewContent}
                >
                    <View style={styles.content}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIcon, { backgroundColor: '#928490' }]}>
                                    <Heart size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>More Than Your Work</Text>

                            <Text style={styles.introDescription}>
                                As a dancer, you lived and breathed it. We all did! But now, we're going to do things differently. Of course, we hope you find meaningful work off the stage. But we also want to make sure you're still *you,* in ways that have nothing to do with your job. Here are some action ideas to remind you that you're more than work.
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleStartActivity}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Let's Start</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen (handled by activityIndex = -1 in history)
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.activityIndex === -1) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Reflection</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollViewContent}
                >
                    <View style={styles.content}>
                        <View style={styles.reflectionCard}>
                            <View style={styles.reflectionIconContainer}>
                                <View style={[styles.reflectionIcon, { backgroundColor: '#928490' }]}>
                                    <Heart size={40} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.reflectionTitle}>You're so much more</Text>

                            <Text style={styles.reflectionText}>
                                You're more than a dancer and you're more than the work you do next. You're a friend, a learner, a dreamer, an explorer, and so much more. Let these roles remind you that balance is about honoring *all parts the of you*.
                            </Text>

                            <Text style={styles.reflectionClosing}>
                                See you tomorrow.
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

    // Activity Screens
    const currentActivity = activities[currentActivityIndex];

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
                            {currentActivityIndex + 1} of {activities.length} activities
                        </Text>
                    </View>
                    <View style={styles.backButton} />
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${activityProgress}%` }]} />
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                <View style={styles.content}>
                    <View style={styles.activityCard}>
                        <Text style={styles.activityQuestion}>{currentActivity.question}</Text>

                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleContinue}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                <Text style={styles.continueButtonText}>{currentActivity.buttonText}</Text>
                                <ChevronRight size={16} color="#E2DED0" />
                            </View>
                        </TouchableOpacity>
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
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
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
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginTop: 50,
    },
    introIconContainer: {
        marginBottom: 24,
    },
    introIcon: {
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
    activityCard: {
        marginHorizontal: 24,
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
    activityQuestion: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 32,
        fontWeight: '700',
    },
    continueButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    continueButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
    reflectionCard: {
        marginHorizontal: 24,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginTop: 50,
    },
    reflectionIconContainer: {
        marginBottom: 30,
    },
    reflectionIcon: {
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