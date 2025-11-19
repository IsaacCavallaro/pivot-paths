import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Target, ArrowLeft, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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
                            <Text style={styles.headerTitle}>Work Backwards</Text>
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

    // Final Screen (handled by -1 in history)
    if (screenHistory[screenHistory.length - 1] === -1) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backIconWrapper} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Work Backwards</Text>
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
                                <Target size={40} color="#928490" />
                            </View>
                            <Text style={styles.introTitle}>Start Learning Today!</Text>
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

    // Step Screens
    const currentStep = steps[currentStepIndex];

    // Calculate progress for step screens
    const stepProgress = ((currentStepIndex + 1) / steps.length) * 100;

    return (
        <View style={styles.container}>
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                        <ChevronLeft size={24} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>
                            {currentStepIndex + 1} of {steps.length}
                        </Text>
                    </View>
                    <View style={styles.backIconWrapper} />
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${stepProgress}%` }]} />
                </View>
            </View>

            <View style={styles.scrollContainer}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>
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
                                colors={['#928490', '#928490']}
                                style={styles.continueButtonContent}
                            >
                                <Text style={styles.continueButtonText}>{currentStep.buttonText}</Text>
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
    backIconWrapper: { width: 40, alignItems: 'center' },
    headerTitleContainer: { flex: 1, alignItems: 'center' },
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

    stepTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 22,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 28,
    },
    stepCard: {
        backgroundColor: 'rgba(90, 125, 123, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
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
        overflow: 'hidden'
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