import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { ChevronRight, Palette, Briefcase, Heart, ArrowLeft, Check } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useStorage } from '@/hooks/useStorage';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';

interface TryItOnProps {
    onComplete: () => void;
    onBack?: () => void;
}

const hanndleMockInterviewOpen = () => {
    Linking.openURL('https://pivotfordancers.com/services/mock-interviews/');
};

export default function TryItOn({ onComplete, onBack }: TryItOnProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [currentScenario, setCurrentScenario] = useStorage<number>('TRY_IT_ON_CURRENT_SCENARIO', 0);
    const [selectedChoices, setSelectedChoices] = useState<{ [key: number]: number }>({});

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    const scenarios = [
        {
            title: "Creative Role: Graphic Designer",
            scenarioTitle: "Your First Client Meeting",
            icon: Palette,
            color: "#928490",
            question1: {
                text: "The client asks you directly: \"What do you think of our brand colors?\"\n\nYou weren't expecting to give an opinion.",
                choice1: "\"I'm not sure, I'll need to think about it.\"",
                choice2: "\"They're strong colors, but I'd love to explore a version that feels more modern.\"",
                response1: "If you're not sure, this answer is fine. But if you do have an opinion, you might try offering something more meaningful.",
                response2: "Nice! You leaned in with curiosity and creativity, which is what clients value."
            },
            question2: {
                text: "Later, the client requests multiple design changes last-minute. How do you handle it?",
                choice1: "Stress out and agree to everything immediately.",
                choice2: "Acknowledge their request, then suggest priorities to make sure the deadline is realistic.",
                response1: "It's natural to feel pressure, but burnout comes quickly if you say yes to everything. This is a common dancer response, but let's learn from it and take a different path.",
                response2: "Excellent, you're practicing boundaries while still being collaborative."
            },
            reflection: "Creative roles often mean balancing your own voice with client needs. How did that feel to you? Energizing, stressful, or a mix of both?\n\nLet's try another scenario."
        },
        {
            title: "Corporate Role: Project Coordinator",
            scenarioTitle: "The Team Huddle",
            icon: Briefcase,
            color: "#928490",
            question1: {
                text: "The manager says: \"Let's go around—what are you working on today?\"\n\nIt's your turn.",
                choice1: "\"I'm just doing the tasks I was assigned.\"",
                choice2: "\"I'm updating the schedule for Project X and checking in with the design team this afternoon.\"",
                response1: "You kept it vague, but in these meetings, clarity helps the whole team.",
                response2: "Great! Short, specific updates keep projects moving smoothly."
            },
            question2: {
                text: "Next, a teammate asks you to help track deadlines, but you're already at capacity.",
                choice1: "Agree anyway. You don't want to let anyone down.",
                choice2: "Thank them, explain your current workload, and offer to revisit after finishing priority tasks.",
                response1: "Saying yes feels supportive, but it can backfire if you burn out.",
                response2: "Smart move—clear communication helps you set healthy expectations."
            },
            reflection: "Corporate roles are often about communication and juggling tasks. Did this pace and structure feel like a fit for you?\n\nTry one more roleplay."
        },
        {
            title: "People-Focused Role: Youth Counselor",
            scenarioTitle: "First Day With Clients",
            icon: Heart,
            color: "#928490",
            question1: {
                text: "One teen immediately challenges you: \"Why should we listen to you?\"",
                choice1: "Stay quiet and hope the group calms down.",
                choice2: "Acknowledge their feelings and explain you're here to support everyone, not to control them.",
                response1: "Staying quiet is safe, but it may make it harder to connect with the group.",
                response2: "Excellent! You're establishing respect and showing leadership in a supportive way."
            },
            question2: {
                text: "Later, a teen confides something personal and emotional.",
                choice1: "Offer a quick solution and move on.",
                choice2: "Listen actively, validate their feelings, and discuss next steps collaboratively.",
                response1: "It's natural to want to \"fix\" things, but listening builds trust.",
                response2: "Perfect, you're practicing empathy and showing you can be present with others' challenges."
            },
            reflection: "Helping roles are about presence, patience, and balancing guidance with autonomy. How did it feel to step into this role? Did you notice yourself enjoying the interaction, or did it feel challenging?"
        }
    ];

    const handleStartTryItOn = () => {
        setCurrentScreen(0);
        scrollToTop();
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const goBack = () => {
        if (currentScreen === -1) {
            if (onBack) onBack();
        } else if (currentScreen === 0) {
            setCurrentScreen(-1);
        } else if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1 && currentScreen <= 6) {
            setCurrentScreen(currentScreen - 1);
        }
        scrollToTop();
    };

    const handleChoiceSelect = (questionNumber: number, choiceNumber: number) => {
        setSelectedChoices(prev => ({
            ...prev,
            [questionNumber]: choiceNumber
        }));
    };

    const handleContinue = () => {
        setCurrentScreen(currentScreen + 1);
        scrollToTop();
    };

    const handleNextScenario = () => {
        if (currentScenario < scenarios.length - 1) {
            setCurrentScenario(currentScenario + 1);
            setSelectedChoices({});
            setCurrentScreen(1);
        } else {
            setCurrentScreen(6); // Changed from 7 to 6 to match the final screen
        }
        scrollToTop();
    };

    const getCurrentScenarioData = () => {
        // Add bounds checking to prevent undefined errors
        if (currentScenario >= 0 && currentScenario < scenarios.length) {
            return scenarios[currentScenario];
        }
        // Return first scenario as fallback
        return scenarios[0];
    };

    const getCurrentResponse = (questionNumber: number) => {
        return selectedChoices[questionNumber];
    };

    // Screen -1: Welcome Screen
    if (currentScreen === -1) {
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

                            <Text style={commonStyles.introTitle}>Try It On</Text>

                            <Text style={commonStyles.introDescription}>
                                Let's try on some new careers to see how they might feel in the real world. We'll show you a few scenarios and you'll choose what you'd do in each situation.
                            </Text>

                            <PrimaryButton title="Begin" onPress={handleStartTryItOn} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 0: Scenario Intro
    if (currentScreen === 0) {
        const scenario = getCurrentScenarioData();
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
                            <Text style={styles.scenarioTitle}>{scenario.scenarioTitle}</Text>
                            <Text style={styles.scenarioSubtitle}>({scenario.title})</Text>

                            <Text style={styles.scenarioText}>
                                {scenario.question1.text}
                            </Text>

                            <PrimaryButton
                                title={currentScenario === 1 ? "What will you say?" : currentScenario === 2 ? "How do you respond?" : "What will you do?"}
                                onPress={handleContinue}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 1: First Choice
    if (currentScreen === 1) {
        const scenario = getCurrentScenarioData();
        const selectedChoice = getCurrentResponse(1);

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
                            <Text style={styles.choicesTitle}>Here are your options</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 1 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(1, 1)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 1 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 1 && styles.choiceTextSelected
                                        ]}>
                                            {scenario.question1.choice1}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 2 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(1, 2)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 2 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 2 && styles.choiceTextSelected
                                        ]}>
                                            {scenario.question1.choice2}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinue}
                                disabled={selectedChoice === undefined}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 2: Response to first choice
    if (currentScreen === 2) {
        const scenario = getCurrentScenarioData();
        const selectedChoice = getCurrentResponse(1);
        const responseText = selectedChoice === 1 ? scenario.question1.response1 : scenario.question1.response2;

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
                            <Text style={styles.responseTitle}>Here's where you're at</Text>

                            <Text style={styles.responseText}>{responseText}</Text>

                            <PrimaryButton title="Continue" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 3: Second scenario question
    if (currentScreen === 3) {
        const scenario = getCurrentScenarioData();

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
                            <Text style={styles.scenarioText}>{scenario.question2.text}</Text>

                            <PrimaryButton title="What will you do?" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 4: Second set of choices
    if (currentScreen === 4) {
        const scenario = getCurrentScenarioData();
        const selectedChoice = getCurrentResponse(2);

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
                            <Text style={styles.choicesTitle}>Here are your options</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 1 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(2, 1)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 1 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 1 && styles.choiceTextSelected
                                        ]}>
                                            {scenario.question2.choice1}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 2 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(2, 2)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 2 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 2 && styles.choiceTextSelected
                                        ]}>
                                            {scenario.question2.choice2}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinue}
                                disabled={selectedChoice === undefined}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 5: Response to second choice + Reflection
    if (currentScreen === 5) {
        const scenario = getCurrentScenarioData();
        const selectedChoice = getCurrentResponse(2);
        const responseText = selectedChoice === 1 ? scenario.question2.response1 : scenario.question2.response2;

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
                            <Text style={styles.responseTitle}>Here's where you're at</Text>

                            <Text style={styles.responseText}>{responseText}</Text>
                            <Text style={styles.responseText}>{scenario.reflection}</Text>

                            <PrimaryButton
                                title={currentScenario < scenarios.length - 1 ? "Next Scenario" : "Continue"}
                                onPress={handleNextScenario}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 6: Final reflection with journal prompts
    if (currentScreen === 6) {
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

                            <Text style={commonStyles.reflectionTitle}>How did that feel?</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                You just "tried on" your first week in a new role. When you put yourself in those shoes, which one felt most aligned? Perhaps that's a good place to start as you dive deeper into your exploration.
                            </Text>

                            <JournalEntrySection
                                pathTag="map-your-direction"
                                day="4"
                                category="Career Transitions"
                                pathTitle="Map Your Direction"
                                dayTitle="Try It On"
                                journalInstruction="Which career scenario felt most natural to you? What surprised you about your choices in these roleplay situations?"
                                moodLabel=""
                                saveButtonText="Save Reflection"
                            />

                            <View style={styles.mockInterviewCard}>
                                <Text style={styles.mockInterviewTitle}>Ready to practice together?</Text>
                                <Text style={styles.mockInterviewDescription}>
                                    Practice interviewing in a safe environment before the real thing. Reduce interview anxiety and increase your confidence through realistic simulation and expert guidance.
                                </Text>
                                <TouchableOpacity style={styles.mockInterviewButton} onPress={hanndleMockInterviewOpen}>
                                    <View style={[styles.mockInterviewButtonContent, { backgroundColor: '#647C90' }]}>
                                        <Text style={styles.mockInterviewButtonText}>Learn More</Text>
                                        <ChevronRight size={16} color="#E2DED0" />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.alternativeClosing}>
                                Meet you here again tomorrow.
                            </Text>

                            <PrimaryButton title="Mark As Complete" onPress={onComplete} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    // Scenario Styles
    scenarioTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    scenarioSubtitle: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 24,
    },
    scenarioText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 32,
    },
    // Choices Styles
    choicesTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: '700',
    },
    choicesContainer: {
        gap: 16,
        marginBottom: 24,
    },
    choiceButton: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    choiceButtonSelected: {
        backgroundColor: 'rgba(146, 132, 144, 0.3)',
        borderColor: '#928490',
        borderWidth: 2,
    },
    choiceContent: {
        padding: 20,
        paddingRight: 50,
    },
    choiceText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        textAlign: 'center',
    },
    choiceTextSelected: {
        color: '#4E4F50',
        fontWeight: '600',
    },
    selectedIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#928490',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Response Styles
    responseTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    responseText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    // Mock Interview Styles
    mockInterviewCard: {
        backgroundColor: 'rgba(100, 124, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(100, 124, 144, 0.2)',
    },
    mockInterviewTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    mockInterviewDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    mockInterviewButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    mockInterviewButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#647C90',
    },
    mockInterviewButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 14,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '600',
    },
});