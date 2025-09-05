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
            color: "#5A7D7B"
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
                {onBack && (
                    <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                        <ArrowLeft size={28} color="#647C90" />
                    </TouchableOpacity>
                )}
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <Palette size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Try It On</Text>

                    <Text style={styles.introDescription}>
                        Let's try on some new careers to see how they might feel in the real world. We'll show you a few scenarios and you'll choose what you'd do in each situation.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartTryItOn}>
                        <View style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}>
                            <Text style={styles.startButtonText}>Begin</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Screen 1: Scenario 1 - First Client Meeting (Creative Role)
    if (currentScreen === 1) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.scenarioContainer}>
                    <Text style={styles.alternativeTitle}>Your First Client Meeting ({getCurrentScenarioData().title})</Text>
                    <Text style={styles.scenarioText}>
                        The client asks you directly: <Text style={{ fontStyle: 'italic' }}>"What do you think of our brand colors?"</Text>
                    </Text>
                    <Text style={styles.scenarioText}>
                        You weren't expecting to give an opinion.
                    </Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <View style={[styles.continueButtonGradient, { backgroundColor: getCurrentScenarioData().color }]}>
                            <Text style={styles.continueButtonText}>What will you do?</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>Back to Intro</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Screen 2: Choice 1 for Creative Role
    if (currentScreen === 2) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.choicesScreenContainer}>
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
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Screen 3: Response to first choice
    if (currentScreen === 3) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.responseContainer}>
                    <Text style={styles.responseText}>{getResponseText(3, selectedChoice!)}</Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <View style={[styles.continueButtonGradient, { backgroundColor: getCurrentScenarioData().color }]}>
                            <Text style={styles.continueButtonText}>Continue</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
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
                <ScrollView style={styles.content} contentContainerStyle={styles.scenarioContainer}>
                    <Text style={styles.scenarioText}>{scenarioText}</Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <View style={[styles.continueButtonGradient, { backgroundColor: getCurrentScenarioData().color }]}>
                            <Text style={styles.continueButtonText}>What will you do?</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
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
                <ScrollView style={styles.content} contentContainerStyle={styles.choicesScreenContainer}>
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
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
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
                <ScrollView style={styles.content} contentContainerStyle={styles.responseContainer}>
                    <Text style={styles.responseText}>{getResponseText(5, selectedChoice!)}</Text>
                    <Text style={styles.responseText}>{reflectionText}</Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleNextScenario}>
                        <View style={[styles.continueButtonGradient, { backgroundColor: getCurrentScenarioData().color }]}>
                            <Text style={styles.continueButtonText}>
                                {currentScenario < 2 ? "Next Scenario" : "Continue"}
                            </Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Screens 7-8: Corporate Role - Team Huddle
    if (currentScreen === 7) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.scenarioContainer}>
                    <Text style={styles.alternativeTitle}>"The Team Huddle" ({getCurrentScenarioData().title})</Text>
                    <Text style={styles.scenarioText}>
                        The manager says: "Let's go around—what are you working on today?"
                    </Text>
                    <Text style={styles.scenarioText}>
                        It's your turn.
                    </Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <View style={[styles.continueButtonGradient, { backgroundColor: getCurrentScenarioData().color }]}>
                            <Text style={styles.continueButtonText}>What will you say?</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (currentScreen === 8) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.choicesScreenContainer}>
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
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Screens 9-14: Continue pattern for People-focused role
    if (currentScreen >= 9 && currentScreen <= 14) {
        // Similar pattern for Youth Counselor scenario
        if (currentScreen === 13) {
            return (
                <View style={styles.container}>
                    <ScrollView style={styles.content} contentContainerStyle={styles.scenarioContainer}>
                        <Text style={styles.alternativeTitle}>"First Day With Clients" ({getCurrentScenarioData().title})</Text>
                        <Text style={styles.scenarioText}>
                            One teen immediately challenges you: <Text style={{ fontStyle: 'italic' }}>"Why should we listen to you?"</Text>
                        </Text>

                        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                            <View style={[styles.continueButtonGradient, { backgroundColor: getCurrentScenarioData().color }]}>
                                <Text style={styles.continueButtonText}>How do you respond?</Text>
                                <ChevronRight size={16} color="#E2DED0" />
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <ChevronLeft size={24} color="#647C90" />
                        <Text style={styles.backButtonText}>Previous</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (currentScreen === 14) {
            return (
                <View style={styles.container}>
                    <ScrollView style={styles.content} contentContainerStyle={styles.choicesScreenContainer}>
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
                    </ScrollView>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <ChevronLeft size={24} color="#647C90" />
                        <Text style={styles.backButtonText}>Previous</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    // Screen 22: Final reflection
    if (currentScreen === 22) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.alternativeContainer}>
                    <Text style={styles.alternativeTitle}>How did that feel?</Text>

                    <Text style={styles.alternativeText}>
                        You just "tried on" your first week in a new role. When you put yourself in those shoes, which one felt most aligned? Perhaps that's a good place to start as you dive deeper into your exploration.
                    </Text>

                    <Text style={styles.alternativeClosing}>
                        Meet you here again tomorrow.
                    </Text>

                    <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
                        <View style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}>
                            <Text style={styles.completeButtonText}>Mark as Complete</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
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
                        <ScrollView style={styles.content} contentContainerStyle={styles.responseContainer}>
                            <Text style={styles.responseText}>{getResponseText(3, selectedChoice!)}</Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                                <View style={[styles.continueButtonGradient, { backgroundColor: getCurrentScenarioData().color }]}>
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ChevronLeft size={24} color="#647C90" />
                            <Text style={styles.backButtonText}>Previous</Text>
                        </TouchableOpacity>
                    </View>
                );
            }

            if (currentScreen === 10) {
                return (
                    <View style={styles.container}>
                        <ScrollView style={styles.content} contentContainerStyle={styles.scenarioContainer}>
                            <Text style={styles.scenarioText}>
                                Next, a teammate asks you to help track deadlines, but you're already at capacity.
                            </Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                                <View style={[styles.continueButtonGradient, { backgroundColor: getCurrentScenarioData().color }]}>
                                    <Text style={styles.continueButtonText}>What will you do?</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ChevronLeft size={24} color="#647C90" />
                            <Text style={styles.backButtonText}>Previous</Text>
                        </TouchableOpacity>
                    </View>
                );
            }

            if (currentScreen === 11) {
                return (
                    <View style={styles.container}>
                        <ScrollView style={styles.content} contentContainerStyle={styles.choicesScreenContainer}>
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
                        </ScrollView>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ChevronLeft size={24} color="#647C90" />
                            <Text style={styles.backButtonText}>Previous</Text>
                        </TouchableOpacity>
                    </View>
                );
            }

            if (currentScreen === 12) {
                return (
                    <View style={styles.container}>
                        <ScrollView style={styles.content} contentContainerStyle={styles.responseContainer}>
                            <Text style={styles.responseText}>{getResponseText(5, selectedChoice!)}</Text>
                            <Text style={styles.responseText}>
                                Corporate roles are often about communication and juggling tasks. Did this pace and structure feel like a fit for you?{"\n\n"}Try one more roleplay.
                            </Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleNextScenario}>
                                <View style={[styles.continueButtonGradient, { backgroundColor: getCurrentScenarioData().color }]}>
                                    <Text style={styles.continueButtonText}>Next Scenario</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ChevronLeft size={24} color="#647C90" />
                            <Text style={styles.backButtonText}>Previous</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }

        // Handle People-focused scenario (screens 13-21)
        if (currentScreen >= 13 && currentScreen <= 21 && currentScenario === 2) {
            if (currentScreen === 15) {
                return (
                    <View style={styles.container}>
                        <ScrollView style={styles.content} contentContainerStyle={styles.responseContainer}>
                            <Text style={styles.responseText}>{getResponseText(3, selectedChoice!)}</Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                                <View style={[styles.continueButtonGradient, { backgroundColor: getCurrentScenarioData().color }]}>
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ChevronLeft size={24} color="#647C90" />
                            <Text style={styles.backButtonText}>Previous</Text>
                        </TouchableOpacity>
                    </View>
                );
            }

            if (currentScreen === 16) {
                return (
                    <View style={styles.container}>
                        <ScrollView style={styles.content} contentContainerStyle={styles.scenarioContainer}>
                            <Text style={styles.scenarioText}>
                                Later, a teen confides something personal and emotional.
                            </Text>

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                                <View style={[styles.continueButtonGradient, { backgroundColor: getCurrentScenarioData().color }]}>
                                    <Text style={styles.continueButtonText}>What will you do?</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ChevronLeft size={24} color="#647C90" />
                            <Text style={styles.backButtonText}>Previous</Text>
                        </TouchableOpacity>
                    </View>
                );
            }

            if (currentScreen === 17) {
                return (
                    <View style={styles.container}>
                        <ScrollView style={styles.content} contentContainerStyle={styles.choicesScreenContainer}>
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
                        </ScrollView>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ChevronLeft size={24} color="#647C90" />
                            <Text style={styles.backButtonText}>Previous</Text>
                        </TouchableOpacity>
                    </View>
                );
            }

            if (currentScreen === 18) {
                return (
                    <View style={styles.container}>
                        <ScrollView style={styles.content} contentContainerStyle={styles.responseContainer}>
                            <Text style={styles.responseText}>{getResponseText(5, selectedChoice!)}</Text>
                            <Text style={styles.responseText}>
                                Helping roles are about presence, patience, and balancing guidance with autonomy. How did it feel to step into this role? Did you notice yourself enjoying the interaction, or did it feel challenging?
                            </Text>

                            <TouchableOpacity style={styles.continueButton} onPress={() => setCurrentScreen(22)}>
                                <View style={[styles.continueButtonGradient, { backgroundColor: getCurrentScenarioData().color }]}>
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ChevronLeft size={24} color="#647C90" />
                            <Text style={styles.backButtonText}>Previous</Text>
                        </TouchableOpacity>
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
    topBackButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        zIndex: 1,
        padding: 8,
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
    scenarioContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    scenarioText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 40,
        whiteSpace: 'pre-line',
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
    choicesContainer: {
        paddingHorizontal: 24,
        gap: 15,
    },
    choicesScreenContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    choiceButton: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    choiceText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 22,
        textAlign: 'center',
    },
    responseContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    responseText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    alternativeContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    alternativeIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    alternativeTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 25,
    },
    alternativeText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
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
});