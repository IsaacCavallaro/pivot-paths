import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Target, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface ExperimentStep {
    id: number;
    title: string;
    description: string;
    buttonText: string;
}

const experimentSteps: ExperimentStep[] = [
    {
        id: 1,
        title: "Step 1: Choose Your Focus",
        description: "Pick one career idea from your exploration so far. Don't overthink it. Choose the one that excites you most right now.",
        buttonText: "I've chosen my focus"
    },
    {
        id: 2,
        title: "Step 2: Find a Resource",
        description: "Find one free way to step into that world:\n\n• Go down a rabbit hole on YouTube for 30 minutes\n• Read 10 blogs or articles on the role\n• Listen to a podcast by someone in that field",
        buttonText: "I found my resource"
    },
    {
        id: 3,
        title: "Step 3: Set a Small Goal",
        description: "Decide on one tangible thing you will do today:\n\n• Write down 3 job titles in that industry\n• List 3 questions you want answered by an expert\n• Identify one skill you want to try",
        buttonText: "Goal set!"
    },
    {
        id: 4,
        title: "Step 4: Connect With Someone",
        description: "Reach out to one person connected to that career:\n\n• Send a short message to a friend, mentor, or LinkedIn contact\n• Ask about their experience or for a tip to get started",
        buttonText: "Connection made"
    },
    {
        id: 5,
        title: "Step 5: Reflect",
        description: "After completing your experiment, ask yourself:\n\n• What surprised me?\n• What felt exciting or energizing?\n• What felt challenging or uncomfortable?\n\nTake a few minutes to write your observations.",
        buttonText: "I've reflected"
    },
    {
        id: 6,
        title: "Step 6: Decide Next Move",
        description: "Based on what you learned, pick your next small step:\n\n• Repeat a similar experiment (we're building on momentum here!)\n• This time, try a different career idea\n• Or reach deeper into this field with a workshop, class, or volunteer opportunity",
        buttonText: "Next move decided"
    }
];

interface YourFirstExperimentProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function YourFirstExperiment({ onComplete, onBack }: YourFirstExperimentProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ stepIndex: number }>>([]);

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartExperiment = () => {
        setScreenHistory([{ stepIndex: 0 }]);
    };

    const handleContinue = () => {
        if (currentStepIndex < experimentSteps.length - 1) {
            // Move to next step
            const newStepIndex = currentStepIndex + 1;
            setCurrentStepIndex(newStepIndex);
            setScreenHistory([...screenHistory, { stepIndex: newStepIndex }]);
        } else {
            // All steps completed, go to final screen
            setScreenHistory([...screenHistory, { stepIndex: -1 }]); // -1 represents final screen
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            // If we're at the first screen, go back to intro
            setScreenHistory([]);
            setCurrentStepIndex(0);
            return;
        }

        // Remove current screen from history
        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        // Get previous screen state
        const prevScreen = newHistory[newHistory.length - 1];

        if (prevScreen.stepIndex === -1) {
            // Shouldn't happen as we handle final screen separately
            return;
        }

        setCurrentStepIndex(prevScreen.stepIndex);
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
                        <Target size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Take the Leap: Your First Career Experiment</Text>

                    <Text style={styles.introDescription}>
                        It's time to put ideas into action. Today, you're going to try <Text style={styles.boldText}>one small experiment</Text> to explore a career you're curious about. The goal isn't perfection… it's discovery.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartExperiment}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Let's experiment</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Final Screen (handled by stepIndex = -1 in history)
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.stepIndex === -1) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
                    <View style={styles.finalIcon}>
                        <Target size={40} color="#928490" />
                    </View>
                    <Text style={styles.introTitle}>Make Progress Every Day</Text>
                    <Text style={styles.finalText}>
                        Every big career change starts with <Text style={styles.boldText}>small daily experiments</Text>. You don't need to know everything today. The goal is to <Text style={styles.boldText}>learn, test, and explore</Text>, one step at a time.
                    </Text>

                    <Text style={styles.finalClosing}>
                        Ready to dive deeper into your career change?
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

    // Step Screens
    const currentStep = experimentSteps[currentStepIndex];

    // Calculate progress for step screens
    const stepProgress = ((currentStepIndex + 1) / experimentSteps.length) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Step {currentStepIndex + 1} of {experimentSteps.length}
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${stepProgress}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.stepContainer}>
                <Text style={styles.stepTitle}>{currentStep.title}</Text>

                <View style={styles.stepCard}>
                    <Text style={styles.stepText}>{currentStep.description}</Text>
                </View>

                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <LinearGradient
                        colors={['#5A7D7B', '#647C90']}
                        style={styles.continueButtonGradient}
                    >
                        <Text style={styles.continueButtonText}>{currentStep.buttonText}</Text>
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
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 36,
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    boldText: {
        fontFamily: 'Montserrat-SemiBold',
        fontWeight: '600',
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
    stepContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    stepTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 30,
    },
    stepCard: {
        backgroundColor: 'rgba(90, 125, 123, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#5A7D7B',
    },
    stepText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
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
        backgroundColor: '#5A7D7B',
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