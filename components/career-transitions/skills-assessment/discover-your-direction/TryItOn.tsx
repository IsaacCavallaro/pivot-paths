import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ChevronRight, Palette, Briefcase, Heart, ArrowLeft } from 'lucide-react-native';

interface TryItOnProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function TryItOn({ onComplete, onBack }: TryItOnProps) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [currentScenario, setCurrentScenario] = useState(0); // 0 = Creative, 1 = Corporate, 2 = People-focused
    const [scenarioResponses, setScenarioResponses] = useState<{ [key: string]: number[] }>({});
    const [navigationHistory, setNavigationHistory] = useState<Array<{ screen: number; scenario: number; choice: number | null }>>([]);

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
            color: "#647C90",
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
        saveToHistory();
        setCurrentScreen(1);
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const saveToHistory = () => {
        setNavigationHistory([...navigationHistory, {
            screen: currentScreen,
            scenario: currentScenario,
            choice: selectedChoice
        }]);
    };

    const goBack = () => {
        if (navigationHistory.length === 0) {
            // If no history, go back to intro or call parent onBack
            if (currentScreen === 0 && onBack) {
                onBack();
            } else {
                setCurrentScreen(0);
                setCurrentScenario(0);
                setSelectedChoice(null);
            }
            return;
        }

        // Get the last state from history
        const previousState = navigationHistory[navigationHistory.length - 1];

        // Remove the last item from history
        setNavigationHistory(navigationHistory.slice(0, -1));

        // Restore previous state
        setCurrentScreen(previousState.screen);
        setCurrentScenario(previousState.scenario);
        setSelectedChoice(previousState.choice);

        // Also need to remove the last choice from scenarioResponses if going back from a choice screen
        if (currentScreen === 3 || currentScreen === 6) {
            const scenarioKey = `scenario_${currentScenario}`;
            const responses = scenarioResponses[scenarioKey] || [];
            if (responses.length > 0) {
                const updatedResponses = responses.slice(0, -1);
                setScenarioResponses({
                    ...scenarioResponses,
                    [scenarioKey]: updatedResponses
                });
            }
        }
    };

    const handleChoiceSelect = (choiceNumber: number) => {
        saveToHistory();
        setSelectedChoice(choiceNumber);

        // Store the response
        const scenarioKey = `scenario_${currentScenario}`;
        const responses = scenarioResponses[scenarioKey] || [];
        responses.push(choiceNumber);
        setScenarioResponses({
            ...scenarioResponses,
            [scenarioKey]: responses
        });

        setCurrentScreen(currentScreen + 1);
    };

    const handleContinue = () => {
        saveToHistory();
        setCurrentScreen(currentScreen + 1);
    };

    const handleNextScenario = () => {
        saveToHistory();
        if (currentScenario < 2) {
            setCurrentScenario(currentScenario + 1);
            setSelectedChoice(null);
            setCurrentScreen(1);
        } else {
            setCurrentScreen(22);
        }
    };

    const getCurrentScenarioData = () => {
        return scenarios[currentScenario];
    };

    // Screen 0: Intro
    if (currentScreen === 0) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={styles.finalIconContainer}>
                                    <Image
                                        source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                        style={styles.heroImage}
                                    />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>Try It On</Text>

                            <Text style={styles.introDescription}>
                                Let's try on some new careers to see how they might feel in the real world. We'll show you a few scenarios and you'll choose what you'd do in each situation.
                            </Text>

                            <TouchableOpacity style={styles.startButton} onPress={handleStartTryItOn} activeOpacity={0.8}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Begin</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 1: Scenario Intro
    if (currentScreen === 1) {
        const scenario = getCurrentScenarioData();
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: scenario.color }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.scenarioCard}>
                            <Text style={styles.scenarioTitle}>{scenario.scenarioTitle}</Text>
                            <Text style={styles.scenarioSubtitle}>({scenario.title})</Text>

                            <Text style={styles.scenarioText}>
                                {scenario.question1.text}
                            </Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                                <View style={[styles.continueButtonContent, { backgroundColor: scenario.color }]}>
                                    <Text style={styles.continueButtonText}>
                                        {currentScenario === 1 ? "What will you say?" : currentScenario === 2 ? "How do you respond?" : "What will you do?"}
                                    </Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 2: First Choice
    if (currentScreen === 2) {
        const scenario = getCurrentScenarioData();
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: scenario.color }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.choicesCard}>
                            <Text style={styles.choicesTitle}>Here are your options</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(1)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        {scenario.question1.choice1}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(2)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        {scenario.question1.choice2}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 3: Response to first choice
    if (currentScreen === 3) {
        const scenario = getCurrentScenarioData();
        const responseText = selectedChoice === 1 ? scenario.question1.response1 : scenario.question1.response2;

        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.responseCard}>
                            <Text style={styles.responseTitle}>Here's where you're at</Text>

                            <Text style={styles.responseText}>{responseText}</Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                                <View style={[styles.continueButtonContent, { backgroundColor: scenario.color }]}>
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 4: Second scenario question
    if (currentScreen === 4) {
        const scenario = getCurrentScenarioData();

        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: scenario.color }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.scenarioCard}>
                            <Text style={styles.scenarioText}>{scenario.question2.text}</Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                                <View style={[styles.continueButtonContent, { backgroundColor: scenario.color }]}>
                                    <Text style={styles.continueButtonText}>What will you do?</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 5: Second set of choices
    if (currentScreen === 5) {
        const scenario = getCurrentScenarioData();

        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: scenario.color }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.choicesCard}>
                            <Text style={styles.choicesTitle}>Here are your options</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(1)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>{scenario.question2.choice1}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(2)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>{scenario.question2.choice2}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 6: Response to second choice + Reflection
    if (currentScreen === 6) {
        const scenario = getCurrentScenarioData();
        const responseText = selectedChoice === 1 ? scenario.question2.response1 : scenario.question2.response2;

        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.responseCard}>
                            <Text style={styles.responseTitle}>Here's where you're at</Text>

                            <Text style={styles.responseText}>{responseText}</Text>
                            <Text style={styles.responseText}>{scenario.reflection}</Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleNextScenario} activeOpacity={0.8}>
                                <View style={[styles.continueButtonContent, { backgroundColor: scenario.color }]}>
                                    <Text style={styles.continueButtonText}>
                                        {currentScenario < 2 ? "Next Scenario" : "Continue"}
                                    </Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screen 22: Final reflection
    if (currentScreen === 22) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.alternativeCard}>
                            <View style={styles.alternativeIconContainer}>
                                <View style={[styles.alternativeIconGradient, { backgroundColor: '#928490' }]}>
                                    <Image
                                        source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                        style={styles.heroImage}
                                    />
                                </View>
                            </View>

                            <Text style={styles.alternativeTitle}>How did that feel?</Text>

                            <Text style={styles.alternativeText}>
                                You just "tried on" your first week in a new role. When you put yourself in those shoes, which one felt most aligned? Perhaps that's a good place to start as you dive deeper into your exploration.
                            </Text>

                            <Text style={styles.alternativeClosing}>
                                Meet you here again tomorrow.
                            </Text>

                            <TouchableOpacity style={styles.completeButton} onPress={onComplete} activeOpacity={0.8}>
                                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.completeButtonText}>Mark as Complete</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return null;
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
    introCard: {
        marginHorizontal: 24,
        marginTop: 50,
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
    introIconContainer: {
        marginBottom: 24,
    },
    introIconGradient: {
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
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#928490',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
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
    scenarioCard: {
        marginHorizontal: 24,
        marginTop: 50,
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
    continueButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    continueButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E2DED0',
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
    choicesCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
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
    },
    choiceButton: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    choiceText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        textAlign: 'center',
    },
    responseCard: {
        marginHorizontal: 24,
        marginTop: 50,
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
        marginBottom: 32,
    },
    alternativeCard: {
        marginHorizontal: 24,
        marginTop: 50,
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
    alternativeIconContainer: {
        marginBottom: 24,
    },
    alternativeIconGradient: {
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
    alternativeTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    alternativeText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
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
    finalIconContainer: {
        marginBottom: 30,
    },
    heroImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderColor: '#647C90',
        borderWidth: 2,
    },
});