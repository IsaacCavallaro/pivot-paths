import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Palette, Briefcase, Heart, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface TryItOnProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function TryItOn({ onComplete, onBack }: TryItOnProps) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [currentScenario, setCurrentScenario] = useState(0); // 0 = Creative, 1 = Corporate, 2 = People-focused
    const [scenarioResponses, setScenarioResponses] = useState<{ [key: string]: number[] }>({});

    const scenarios = [
        {
            title: "Creative Role: Graphic Designer",
            icon: Palette,
            color: "#928490"
        },
        {
            title: "Corporate Role: Project Coordinator",
            icon: Briefcase,
            color: "#647C90"
        },
        {
            title: "People-Focused Role: Youth Counselor",
            icon: Heart,
            color: "#928490"
        }
    ];

    const handleStartTryItOn = () => {
        setCurrentScreen(1); // Go to first scenario
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const goBack = () => {
        if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    const handleChoiceSelect = (choiceNumber: number) => {
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
        setCurrentScreen(currentScreen + 1);
    };

    const handleNextScenario = () => {
        if (currentScenario < 2) {
            setCurrentScenario(currentScenario + 1);
            setSelectedChoice(null);
            setCurrentScreen(6); // Go to next scenario intro
        } else {
            setCurrentScreen(22); // Go to final reflection
        }
    };

    const getCurrentScenarioData = () => {
        return scenarios[currentScenario];
    };

    const getResponseText = (screen: number, choice: number) => {
        if (currentScenario === 0) { // Creative Role
            if (screen === 3) {
                return choice === 1
                    ? "If you're not sure, this answer is fine. But if you do have an opinion, you might try offering something more meaningful."
                    : "Nice! You leaned in with curiosity and creativity, which is what clients value.";
            } else if (screen === 5) {
                return choice === 1
                    ? "It's natural to feel pressure, but burnout comes quickly if you say yes to everything. This is a common dancer response, but let's learn from it and take a different path."
                    : "Excellent, you're practicing boundaries while still being collaborative.";
            }
        } else if (currentScenario === 1) { // Corporate Role
            if (screen === 3) {
                return choice === 1
                    ? "You kept it vague, but in these meetings, clarity helps the whole team."
                    : "Great! Short, specific updates keep projects moving smoothly.";
            } else if (screen === 5) {
                return choice === 1
                    ? "Saying yes feels supportive, but it can backfire if you burn out."
                    : "Smart move—clear communication helps you set healthy expectations.";
            }
        } else if (currentScenario === 2) { // People-focused Role
            if (screen === 3) {
                return choice === 1
                    ? "Staying quiet is safe, but it may make it harder to connect with the group."
                    : "Excellent! You're establishing respect and showing leadership in a supportive way.";
            } else if (screen === 5) {
                return choice === 1
                    ? "It's natural to want to \"fix\" things, but listening builds trust."
                    : "Perfect, you're practicing empathy and showing you can be present with others' challenges.";
            }
        }
        return "";
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
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <Palette size={32} color="#E2DED0" />
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

    // Screen 1: Scenario 1 - First Client Meeting (Creative Role)
    if (currentScreen === 1) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getCurrentScenarioData().color }]}>
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
                            <Text style={styles.scenarioTitle}>Your First Client Meeting</Text>
                            <Text style={styles.scenarioSubtitle}>({getCurrentScenarioData().title})</Text>

                            <Text style={styles.scenarioText}>
                                The client asks you directly: <Text style={{ fontStyle: 'italic' }}>"What do you think of our brand colors?"</Text>
                            </Text>
                            <Text style={styles.scenarioText}>
                                You weren't expecting to give an opinion.
                            </Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                                <View style={[styles.continueButtonContent, { backgroundColor: getCurrentScenarioData().color }]}>
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

    // Screen 2: Choice 1 for Creative Role
    if (currentScreen === 2) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getCurrentScenarioData().color }]}>
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
                            <Text style={styles.choicesTitle}>Here are your Options</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(1)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        "I'm not sure, I'll need to think about it."
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(2)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        "They're strong colors, but I'd love to explore a version that feels more modern."
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

                            <Text style={styles.responseText}>{getResponseText(3, selectedChoice!)}</Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                                <View style={[styles.continueButtonContent, { backgroundColor: getCurrentScenarioData().color }]}>
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
        const scenarioText = currentScenario === 0
            ? "Later, the client requests multiple design changes last-minute. How do you handle it?"
            : currentScenario === 1
                ? "Next, a teammate asks you to help track deadlines, but you're already at capacity."
                : "Later, a teen confides something personal and emotional.";

        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getCurrentScenarioData().color }]}>
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
                            <Text style={styles.scenarioText}>{scenarioText}</Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                                <View style={[styles.continueButtonContent, { backgroundColor: getCurrentScenarioData().color }]}>
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
        let choice1Text = "";
        let choice2Text = "";

        if (currentScenario === 0) {
            choice1Text = "Stress out and agree to everything immediately.";
            choice2Text = "Acknowledge their request, then suggest priorities to make sure the deadline is realistic.";
        } else if (currentScenario === 1) {
            choice1Text = "Agree anyway. You don't want to let anyone down.";
            choice2Text = "Thank them, explain your current workload, and offer to revisit after finishing priority tasks.";
        } else {
            choice1Text = "Offer a quick solution and move on.";
            choice2Text = "Listen actively, validate their feelings, and discuss next steps collaboratively.";
        }

        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getCurrentScenarioData().color }]}>
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
                            <Text style={styles.choicesTitle}>Here are your Options</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(1)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>{choice1Text}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(2)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>{choice2Text}</Text>
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
        let reflectionText = "";

        if (currentScenario === 0) {
            reflectionText = "Creative roles often mean balancing your own voice with client needs. How did that feel to you? Energizing, stressful, or a mix of both?\n\nLet's try another scenario.";
        } else if (currentScenario === 1) {
            reflectionText = "Corporate roles are often about communication and juggling tasks. Did this pace and structure feel like a fit for you?\n\nTry one more roleplay.";
        } else {
            reflectionText = "Helping roles are about presence, patience, and balancing guidance with autonomy. How did it feel to step into this role? Did you notice yourself enjoying the interaction, or did it feel challenging?";
        }

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

                            <Text style={styles.responseText}>{getResponseText(5, selectedChoice!)}</Text>
                            <Text style={styles.responseText}>{reflectionText}</Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleNextScenario} activeOpacity={0.8}>
                                <View style={[styles.continueButtonContent, { backgroundColor: getCurrentScenarioData().color }]}>
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

    // Screens 7-8: Corporate Role - Team Huddle
    if (currentScreen === 7) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getCurrentScenarioData().color }]}>
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
                            <Text style={styles.scenarioTitle}>"The Team Huddle"</Text>
                            <Text style={styles.scenarioSubtitle}>({getCurrentScenarioData().title})</Text>

                            <Text style={styles.scenarioText}>
                                The manager says: "Let's go around—what are you working on today?"
                            </Text>
                            <Text style={styles.scenarioText}>
                                It's your turn.
                            </Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                                <View style={[styles.continueButtonContent, { backgroundColor: getCurrentScenarioData().color }]}>
                                    <Text style={styles.continueButtonText}>What will you say?</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (currentScreen === 8) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getCurrentScenarioData().color }]}>
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
                            <Text style={styles.choicesTitle}>Here are your Options</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(1)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        "I'm just doing the tasks I was assigned."
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(2)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        "I'm updating the schedule for Project X and checking in with the design team this afternoon."
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Screens 9-14: Continue pattern for People-focused role
    if (currentScreen >= 9 && currentScreen <= 14) {
        // Similar pattern for Youth Counselor scenario
        if (currentScreen === 13) {
            return (
                <View style={styles.container}>
                    {/* Sticky Header */}
                    <View style={[styles.stickyHeader, { backgroundColor: getCurrentScenarioData().color }]}>
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
                                <Text style={styles.scenarioTitle}>"First Day With Clients"</Text>
                                <Text style={styles.scenarioSubtitle}>({getCurrentScenarioData().title})</Text>

                                <Text style={styles.scenarioText}>
                                    One teen immediately challenges you: <Text style={{ fontStyle: 'italic' }}>"Why should we listen to you?"</Text>
                                </Text>

                                <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                                    <View style={[styles.continueButtonContent, { backgroundColor: getCurrentScenarioData().color }]}>
                                        <Text style={styles.continueButtonText}>How do you respond?</Text>
                                        <ChevronRight size={16} color="#E2DED0" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        if (currentScreen === 14) {
            return (
                <View style={styles.container}>
                    {/* Sticky Header */}
                    <View style={[styles.stickyHeader, { backgroundColor: getCurrentScenarioData().color }]}>
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
                                <Text style={styles.choicesTitle}>Here are your Options</Text>

                                <View style={styles.choicesContainer}>
                                    <TouchableOpacity
                                        style={styles.choiceButton}
                                        onPress={() => handleChoiceSelect(1)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.choiceText}>
                                            Stay quiet and hope the group calms down.
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.choiceButton}
                                        onPress={() => handleChoiceSelect(2)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.choiceText}>
                                            Acknowledge their feelings and explain you're here to support everyone, not to control them.
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            );
        }
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
                                    <Heart size={32} color="#E2DED0" />
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

    // Handle intermediate screens for Corporate and People-focused scenarios
    if (currentScreen >= 7) {
        // Navigate through the Corporate scenario (screens 7-12)
        if (currentScreen >= 7 && currentScreen <= 12 && currentScenario === 1) {
            // This handles the corporate scenario flow
            if (currentScreen === 9) {
                return (
                    <View style={styles.container}>
                        {/* Sticky Header */}
                        <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
                            <View style={styles.headerRow}>
                                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                                    <ArrowLeft size={28} color="#E2DED0" />
                                </TouchableOpacity>
                                <View style={styles.headerTitleContainer}>
                                    <Text style={styles.titleText}>Your Status</Text>
                                </View>
                                <View style={styles.backButton} />
                            </View>
                        </View>

                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            <View style={styles.content}>
                                <View style={styles.responseCard}>
                                    <Text style={styles.responseTitle}>Here's where you're at</Text>

                                    <Text style={styles.responseText}>{getResponseText(3, selectedChoice!)}</Text>

                                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                                        <View style={[styles.continueButtonContent, { backgroundColor: getCurrentScenarioData().color }]}>
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

            if (currentScreen === 10) {
                return (
                    <View style={styles.container}>
                        {/* Sticky Header */}
                        <View style={[styles.stickyHeader, { backgroundColor: getCurrentScenarioData().color }]}>
                            <View style={styles.headerRow}>
                                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                                    <ArrowLeft size={28} color="#E2DED0" />
                                </TouchableOpacity>
                                <View style={styles.headerTitleContainer}>
                                    <Text style={styles.titleText}>Next Challenge</Text>
                                </View>
                                <View style={styles.backButton} />
                            </View>
                        </View>

                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            <View style={styles.content}>
                                <View style={styles.scenarioCard}>
                                    <Text style={styles.scenarioText}>
                                        Next, a teammate asks you to help track deadlines, but you're already at capacity.
                                    </Text>

                                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                                        <View style={[styles.continueButtonContent, { backgroundColor: getCurrentScenarioData().color }]}>
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

            if (currentScreen === 11) {
                return (
                    <View style={styles.container}>
                        {/* Sticky Header */}
                        <View style={[styles.stickyHeader, { backgroundColor: getCurrentScenarioData().color }]}>
                            <View style={styles.headerRow}>
                                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                                    <ArrowLeft size={28} color="#E2DED0" />
                                </TouchableOpacity>
                                <View style={styles.headerTitleContainer}>
                                    <Text style={styles.titleText}>Your Options</Text>
                                </View>
                                <View style={styles.backButton} />
                            </View>
                        </View>

                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            <View style={styles.content}>
                                <View style={styles.choicesCard}>
                                    <Text style={styles.choicesTitle}>Here are your Options</Text>

                                    <View style={styles.choicesContainer}>
                                        <TouchableOpacity
                                            style={styles.choiceButton}
                                            onPress={() => handleChoiceSelect(1)}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.choiceText}>
                                                Agree anyway. You don't want to let anyone down.
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.choiceButton}
                                            onPress={() => handleChoiceSelect(2)}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.choiceText}>
                                                Thank them, explain your current workload, and offer to revisit after finishing priority tasks.
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                );
            }

            if (currentScreen === 12) {
                return (
                    <View style={styles.container}>
                        {/* Sticky Header */}
                        <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
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

                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            <View style={styles.content}>
                                <View style={styles.responseCard}>
                                    <Text style={styles.responseTitle}>Here's where you're at</Text>

                                    <Text style={styles.responseText}>{getResponseText(5, selectedChoice!)}</Text>
                                    <Text style={styles.responseText}>
                                        Corporate roles are often about communication and juggling tasks. Did this pace and structure feel like a fit for you?{"\n\n"}Try one more roleplay.
                                    </Text>

                                    <TouchableOpacity style={styles.continueButton} onPress={handleNextScenario} activeOpacity={0.8}>
                                        <View style={[styles.continueButtonContent, { backgroundColor: getCurrentScenarioData().color }]}>
                                            <Text style={styles.continueButtonText}>Next Scenario</Text>
                                            <ChevronRight size={16} color="#E2DED0" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                );
            }
        }

        // Handle People-focused scenario (screens 13-21)
        if (currentScreen >= 13 && currentScreen <= 21 && currentScenario === 2) {
            if (currentScreen === 15) {
                return (
                    <View style={styles.container}>
                        {/* Sticky Header */}
                        <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
                            <View style={styles.headerRow}>
                                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                                    <ArrowLeft size={28} color="#E2DED0" />
                                </TouchableOpacity>
                                <View style={styles.headerTitleContainer}>
                                    <Text style={styles.titleText}>Your Status</Text>
                                </View>
                                <View style={styles.backButton} />
                            </View>
                        </View>

                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            <View style={styles.content}>
                                <View style={styles.responseCard}>
                                    <Text style={styles.responseTitle}>Here's where you're at</Text>

                                    <Text style={styles.responseText}>{getResponseText(3, selectedChoice!)}</Text>

                                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                                        <View style={[styles.continueButtonContent, { backgroundColor: getCurrentScenarioData().color }]}>
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

            if (currentScreen === 16) {
                return (
                    <View style={styles.container}>
                        {/* Sticky Header */}
                        <View style={[styles.stickyHeader, { backgroundColor: getCurrentScenarioData().color }]}>
                            <View style={styles.headerRow}>
                                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                                    <ArrowLeft size={28} color="#E2DED0" />
                                </TouchableOpacity>
                                <View style={styles.headerTitleContainer}>
                                    <Text style={styles.titleText}>Next Challenge</Text>
                                </View>
                                <View style={styles.backButton} />
                            </View>
                        </View>

                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            <View style={styles.content}>
                                <View style={styles.scenarioCard}>
                                    <Text style={styles.scenarioText}>
                                        Later, a teen confides something personal and emotional.
                                    </Text>

                                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                                        <View style={[styles.continueButtonContent, { backgroundColor: getCurrentScenarioData().color }]}>
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

            if (currentScreen === 17) {
                return (
                    <View style={styles.container}>
                        {/* Sticky Header */}
                        <View style={[styles.stickyHeader, { backgroundColor: getCurrentScenarioData().color }]}>
                            <View style={styles.headerRow}>
                                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                                    <ArrowLeft size={28} color="#E2DED0" />
                                </TouchableOpacity>
                                <View style={styles.headerTitleContainer}>
                                    <Text style={styles.titleText}>Your Options</Text>
                                </View>
                                <View style={styles.backButton} />
                            </View>
                        </View>

                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            <View style={styles.content}>
                                <View style={styles.choicesCard}>
                                    <Text style={styles.choicesTitle}>Here are your Options</Text>

                                    <View style={styles.choicesContainer}>
                                        <TouchableOpacity
                                            style={styles.choiceButton}
                                            onPress={() => handleChoiceSelect(1)}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.choiceText}>
                                                Offer a quick solution and move on.
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.choiceButton}
                                            onPress={() => handleChoiceSelect(2)}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.choiceText}>
                                                Listen actively, validate their feelings, and discuss next steps collaboratively.
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                );
            }

            if (currentScreen === 18) {
                return (
                    <View style={styles.container}>
                        {/* Sticky Header */}
                        <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
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

                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            <View style={styles.content}>
                                <View style={styles.responseCard}>
                                    <Text style={styles.responseTitle}>Here's where you're at</Text>

                                    <Text style={styles.responseText}>{getResponseText(5, selectedChoice!)}</Text>
                                    <Text style={styles.responseText}>
                                        Helping roles are about presence, patience, and balancing guidance with autonomy. How did it feel to step into this role? Did you notice yourself enjoying the interaction, or did it feel challenging?
                                    </Text>

                                    <TouchableOpacity style={styles.continueButton} onPress={() => setCurrentScreen(22)} activeOpacity={0.8}>
                                        <View style={[styles.continueButtonContent, { backgroundColor: getCurrentScenarioData().color }]}>
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
        }
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
});