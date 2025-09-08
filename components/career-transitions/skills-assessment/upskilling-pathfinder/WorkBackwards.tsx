import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Target, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface StepData {
    id: number;
    title: string;
    description: string;
    examples?: string[];
    tips?: string;
    buttonText: string;
}

const steps: StepData[] = [
    {
        id: 1,
        title: "Step 1: Pick a Target Role",
        description: "Search on job boards like Seek, Indeed, or LinkedIn for roles you're curious about. (Or go back to Day 1 and start with your strengths to find job titles that might fit!)",
        examples: [
            "Event Coordinator",
            "Marketing Assistant",
            "Studio Manager",
            "Community Engagement Officer",
            "Project Manager"
        ],
        buttonText: "Got it, what's next?"
    },
    {
        id: 2,
        title: "Step 2: Scan for Repeats",
        description: "Look at at least 10 job postings for the same role. Highlight skills or software that show up more than once.\n\nFor Event Coordinator roles, you might end up with a list including:",
        examples: [
            "Time management",
            "Vendor communication",
            "Budget tracking",
            "Asana"
        ],
        buttonText: "Makes sense!"
    },
    {
        id: 3,
        title: "Step 3: Spot the \"Must-Haves\" vs. \"Nice-to-Haves\"",
        description: "• Must-Haves = Skills mentioned in almost every description (These go at the top of your upskill list.)\n• Nice-to-Haves = Skills mentioned sometimes (Tackle these later.)\n\nFor Marketing Assistant roles, this could look like:\n\n• Must-Haves: Social media scheduling, Canva, copywriting\n• Nice-to-Haves: Video editing skills, basic SEO",
        buttonText: "I'm following along"
    },
    {
        id: 4,
        title: "Step 4: Make an Action Plan",
        description: "Once you've spotted the must-haves, research free or affordable courses to learn these essential skills.\n\n• Free: Start with YouTube\n• Affordable: Udemy, Skillshare, LinkedIn Learning",
        tips: "Most course platforms offer a free trial. Take advantage of those first!",
        buttonText: "Ready to learn!"
    },
    {
        id: 5,
        title: "Step 5: Test & Apply Your New Skills",
        description: "Don't wait until you feel like an expert. Use your new skills in small, safe ways:",
        examples: [
            "Create a mock event budget",
            "Write a sample social media calendar",
            "Set up a pretend email marketing flow"
        ],
        tips: "This way, you're building both skills and confidence while filling your portfolio.",
        buttonText: "Let's do this!"
    }
];

interface WorkBackwardsProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function WorkBackwards({ onComplete, onBack }: WorkBackwardsProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<number[]>([]);

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartLearning = () => {
        setCurrentStepIndex(0);
        setScreenHistory([0]);
    };

    const handleContinue = () => {
        if (currentStepIndex < steps.length - 1) {
            // Move to next step
            const newStepIndex = currentStepIndex + 1;
            setCurrentStepIndex(newStepIndex);
            setScreenHistory([...screenHistory, newStepIndex]);
        } else {
            // All steps completed, go to final screen
            setScreenHistory([...screenHistory, -1]); // -1 represents final screen
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

        if (prevScreen === -1) {
            // Shouldn't happen as we handle final screen separately
            return;
        }

        setCurrentStepIndex(prevScreen);
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

                    <Text style={styles.introTitle}>Work Backwards from Job Descriptions</Text>

                    <Text style={styles.introDescription}>
                        Not sure what skills to learn first? The best place to look is in real job descriptions. They show you what employers *actually* value.
                    </Text>

                    <Text style={styles.introSubDescription}>
                        Let's go step by step on how to scan a role and figure out where to start upskilling.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartLearning}>
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

    // Final Screen (handled by -1 in history)
    if (screenHistory[screenHistory.length - 1] === -1) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
                    <View style={styles.finalIcon}>
                        <Target size={40} color="#928490" />
                    </View>
                    <Text style={styles.finalTitle}>Start Learning Today!</Text>
                    <Text style={styles.finalText}>
                        Upskilling doesn't have to be overwhelming.
                    </Text>
                    <Text style={styles.finalProcess}>
                        Work backwards from the jobs you want → start with the most common skills → and practice as you go.
                    </Text>
                    <Text style={styles.finalClosing}>
                        Each step builds momentum. You'll be surprised how quickly you start to feel "hire ready."
                    </Text>
                    <Text style={styles.finalNote}>
                        See you tomorrow for your next step!
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
    const currentStep = steps[currentStepIndex];

    // Calculate progress for step screens
    const stepProgress = ((currentStepIndex + 1) / steps.length) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {currentStepIndex + 1} of {steps.length} steps
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${stepProgress}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.stepContainer}>
                <Text style={styles.stepTitle}>{currentStep.title}</Text>

                <View style={styles.stepCard}>
                    <Text style={styles.stepDescription}>{currentStep.description}</Text>

                    {currentStep.examples && (
                        <View style={styles.examplesContainer}>
                            {currentStep.examples.map((example, index) => (
                                <View key={index} style={styles.exampleItem}>
                                    <View style={styles.bulletPoint} />
                                    <Text style={styles.exampleText}>{example}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {currentStep.tips && (
                        <View style={styles.tipContainer}>
                            <Text style={styles.tipLabel}>Pro tip:</Text>
                            <Text style={styles.tipText}>{currentStep.tips}</Text>
                        </View>
                    )}
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
        fontSize: 32,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 38,
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
    },
    introSubDescription: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#4E4F50',
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
        borderLeftColor: '#928490',
    },
    stepDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        marginBottom: 16,
    },
    examplesContainer: {
        marginTop: 8,
    },
    exampleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#928490',
        marginRight: 12,
        marginTop: 9,
    },
    exampleText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        flex: 1,
    },
    tipContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
    },
    tipLabel: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 14,
        color: '#928490',
        marginBottom: 4,
    },
    tipText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#746C70',
        lineHeight: 20,
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
    finalTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 32,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
    },
    finalText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
    },
    finalProcess: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
    },
    finalClosing: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
    },
    finalNote: {
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