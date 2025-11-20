import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Animated, Image } from 'react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { Target, ChevronRight } from 'lucide-react-native';

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
    const [screenHistory, setScreenHistory] = useState<Array<{ stepIndex: number }>>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('upskilling-pathfinder');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartLearning = () => {
        setScreenHistory([{ stepIndex: 0 }]);
        scrollToTop();
    };

    const handleContinueToSteps = () => {
        setScreenHistory([{ stepIndex: -2 }]);
        scrollToTop();
    };

    const handleContinue = () => {
        if (currentStepIndex < steps.length - 1) {
            // Fade out current card
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                const newStepIndex = currentStepIndex + 1;

                // Reset animation BEFORE updating state
                fadeAnim.setValue(0);

                // Update state
                setCurrentStepIndex(newStepIndex);

                // Animate in the next card with a slight delay
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.spring(progressAnim, {
                            toValue: (newStepIndex + 1) / steps.length,
                            tension: 50,
                            friction: 7,
                            useNativeDriver: false,
                        })
                    ]).start();
                }, 50);

                setScreenHistory(prev => [...prev, { stepIndex: newStepIndex }]);
                scrollToTop();
            });
        } else {
            // Smooth transition to final screen
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setScreenHistory(prev => [...prev, { stepIndex: -1 }]);
                fadeAnim.setValue(1);
                scrollToTop();
            });
        }
    };

    const handleComplete = () => {
        // Add a subtle scale animation on complete
        Animated.sequence([
            Animated.timing(cardScale, {
                toValue: 1.02,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(cardScale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => {
            onComplete();
        });
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            setScreenHistory([]);
            setCurrentStepIndex(0);
            fadeAnim.setValue(1);
            cardScale.setValue(1);
            scrollToTop();
            return;
        }

        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        const prevScreen = newHistory[newHistory.length - 1];
        if (prevScreen.stepIndex === -1 || prevScreen.stepIndex === -2) {
            return;
        }

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setCurrentStepIndex(prevScreen.stepIndex);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            scrollToTop();
        });
    };

    // Progress animation interpolation
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // Update progress when currentStepIndex changes
    React.useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: (currentStepIndex + 1) / steps.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentStepIndex]);

    // Intro Screen with Journal
    if (screenHistory.length === 0) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={handleBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={commonStyles.introTitle}>Work Backwards from Job Descriptions</Text>
                            <Text style={commonStyles.introDescription}>
                                Not sure what skills to learn first? The best place to look is in real job descriptions. They show you what employers *actually* value.
                            </Text>
                            <Text style={commonStyles.introDescription}>
                                Let's go step by step on how to scan a role and figure out where to start upskilling.
                            </Text>

                            <JournalEntrySection
                                pathTag="upskilling-pathfinder"
                                day="3"
                                category="Career Transitions"
                                pathTitle="Upskilling Pathfinder"
                                dayTitle="Work Backwards"
                                journalInstruction="Before we begin, what kind of roles are you curious about exploring? What skills do you think might be important for those roles?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Let's go" onPress={handleContinueToSteps} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Steps Intro Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.stepIndex === -2) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={styles.introTitle}>The 5-Step Process</Text>
                            <Text style={styles.introDescription}>
                                We'll walk through a simple 5-step process to analyze job descriptions and identify the most valuable skills to learn first.
                            </Text>
                            <Text style={styles.introDescription}>
                                This method will save you time and help you focus on what really matters to employers.
                            </Text>

                            <PrimaryButton title="Start Learning" onPress={handleStartLearning} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen with Journal
    if (currentScreen.stepIndex === -1) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <View style={commonStyles.finalHeader}>
                                <Text style={commonStyles.finalHeading}>Start Learning Today!</Text>
                            </View>

                            <View style={commonStyles.finalTextContainer}>
                                <Text style={commonStyles.finalText}>
                                    Upskilling doesn't have to be overwhelming.
                                </Text>
                                <Text style={commonStyles.finalText}>
                                    Work backwards from the jobs you want → start with the most common skills → and practice as you go.
                                </Text>
                                <Text style={commonStyles.finalText}>
                                    Each step builds momentum. You'll be surprised how quickly you start to feel "hire ready."
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="upskilling-pathfinder"
                                day="3"
                                category="Career Transitions"
                                pathTitle="Upskilling Pathfinder"
                                dayTitle="Work Backwards"
                                journalInstruction="Based on what you learned today, what are 2-3 skills you want to focus on first? What's one small action you can take this week to start learning?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.finalNote}>
                                See you tomorrow for your next step!
                            </Text>

                            <View style={commonStyles.finalButtonContainer}>
                                <PrimaryButton
                                    title="Mark As Complete"
                                    onPress={handleComplete}
                                />
                            </View>
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Step Screens
    const currentStep = steps[currentStepIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentStepIndex + 1} of ${steps.length}`}
                progress={(currentStepIndex + 1) / steps.length}
            />

            <ScrollView
                ref={scrollViewRef}
                style={commonStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                onContentSizeChange={() => scrollToTop()}
                onLayout={() => scrollToTop()}
            >
                <View style={styles.centeredContent}>
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: cardScale }] }}>
                        <Card style={commonStyles.baseCard}>
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

                            <PrimaryButton
                                title={currentStep.buttonText}
                                onPress={handleContinue}
                            />
                        </Card>
                    </Animated.View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 30,
        marginTop: 20,
    },
    introTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 34,
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
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
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
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
    finalNote: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 5,
        marginTop: 0,
        fontWeight: '600',
    },
});