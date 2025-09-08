import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Users, Award, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface WhoWouldYouHireProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function WhoWouldYouHire({ onComplete, onBack }: WhoWouldYouHireProps) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [currentScenario, setCurrentScenario] = useState(0);

    const scenarios = [
        {
            role: "sales assistant",
            challenge: "facing rejection from customers and staying motivated",
            choice1: "In dance, I went to hundreds of auditions and didn't always get the part. It was tough, but I learned to deal with it and move on.",
            choice2: "As a professional dancer, I experienced rejection almost daily at auditions. I developed resilience, learned how to take constructive feedback, and kept improving my performance. These are qualities I'll bring to handling challenges in sales.",
            response1: "Both candidates have the same background but the dancer you chose framed how she dealt with rejection as a struggle. The other dancer saw it as a strength. Employers are drawn to resilience and growth.",
            response2: "We'd hire her too! Both candidates have the same background but the dancer you chose framed how she dealt with rejection as a strength. The other dancer saw it as a struggle. Employers are drawn to resilience and growth."
        },
        {
            role: "project coordinator",
            challenge: "clear communication and guiding a team through deadlines",
            choice1: "I've taught a lot of dance classes to both kids and adults so I'm comfortable speaking in front of an audience and communicating my ideas.",
            choice2: "I led weekly dance classes of up to 30 kids, adapted my teaching style to different learning needs, and motivated dancers to be performance-ready in time for recital. These are skills directly applicable to managing a team here.",
            response1: "The same experience can sound casual or highly professional depending on how it's presented. The dancer you chose started to dive into her transferable skills but stopped short.",
            response2: "We'd hire her too! The same experience can sound casual or highly professional depending on how it's presented. The dancer you chose took the opportunity to highlight clear transferable skills from her teaching experience."
        },
        {
            role: "front-facing client role in events management",
            challenge: "professional presence",
            choice1: "As a dancer, I'm used to taking care of my appearance, performing in large crowds, and looking the part.",
            choice2: "As a dancer, I understand the importance of professional presentation and body language. I know how to create a strong first impression, carry myself with confidence, and adapt my appearance to suit the occasion.",
            response1: "The dancer you chose put a solid foot forward, but presentation isn't just about appearance. It's about professionalism, confidence, and representing yourself well. Dancers already excel at this, and employers value it.",
            response2: "We'd hire her too! Presentation isn't just about appearance. It's about professionalism, confidence, and representing yourself well. The dancer you chose showed that she already excels at this, and employers value it."
        }
    ];

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const goBack = () => {
        if (currentScreen === 0) {
            // Can't go back from intro screen
            return;
        } else if (currentScreen === 1) {
            // From scenario intro, go back to main intro
            setCurrentScreen(0);
        } else if (currentScreen === 2) {
            // From choices, go back to scenario intro
            setCurrentScreen(1);
        } else if (currentScreen === 3) {
            // From response, go back to choices
            setCurrentScreen(2);
            setSelectedChoice(null); // Reset choice
        } else if (currentScreen === 4) {
            // From final screen, go back to last response
            setCurrentScenario(scenarios.length - 1);
            setCurrentScreen(3);
        }
    };

    const handleChoiceSelect = (choiceNumber: number) => {
        setSelectedChoice(choiceNumber);
        setCurrentScreen(3); // Go to response screen
    };

    const handleContinue = () => {
        if (currentScreen === 0) {
            // From intro to first scenario
            setCurrentScenario(0);
            setCurrentScreen(1);
        } else if (currentScreen === 1) {
            // From scenario intro to choices
            setCurrentScreen(2);
        } else if (currentScreen === 3) {
            // From response screen
            if (currentScenario < scenarios.length - 1) {
                // More scenarios to go
                setCurrentScenario(currentScenario + 1);
                setCurrentScreen(1); // Go to next scenario intro
                setSelectedChoice(null); // Reset choice for next scenario
            } else {
                // All scenarios completed, go to final screen
                setCurrentScreen(4);
            }
        } else if (currentScreen === 4) {
            // From final screen, complete the module
            onComplete();
        }
    };

    const getResponseText = () => {
        if (selectedChoice === 1) {
            return scenarios[currentScenario].response1;
        } else if (selectedChoice === 2) {
            return scenarios[currentScenario].response2;
        }
        return "";
    };

    // Intro Screen
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
                        <Users size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Who would you hire?</Text>

                    <Text style={styles.introDescription}>
                        Take yourself out of the equation and pretend YOU are the hiring manager putting another dancer in the hot seat for an interview. Put yourself in their shoes and decide who you would hire.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleContinue}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Begin</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Scenario Intro Screen
    if (currentScreen === 1) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.scenarioContainer}>
                    <Text style={styles.introTitle}>You're hiring a {scenarios[currentScenario].role}.</Text>
                    <Text style={styles.scenarioText}>
                        The role involves {scenarios[currentScenario].challenge}. Two dancers explain their experience. Who would you hire?
                    </Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.continueButtonText}>See their answers</Text>
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

    // Choices Screen
    if (currentScreen === 2) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.choicesScreenContainer}>
                    <View style={styles.choicesContainer}>
                        <Text style={styles.alternativeTitle}>Who would you hire?</Text>
                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoiceSelect(1)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.choiceText}>
                                {scenarios[currentScenario].choice1}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoiceSelect(2)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.choiceText}>
                                {scenarios[currentScenario].choice2}
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

    // Response Screen
    if (currentScreen === 3) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.responseContainer}>
                    <Text style={styles.responseText}>{getResponseText()}</Text>
                    <Text style={styles.continuePrompt}>
                        {currentScenario < scenarios.length - 1 ? "Let's try another one." : "Ready for the final thoughts?"}
                    </Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
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

    // Final Screen
    if (currentScreen === 4) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.alternativeContainer}>
                    <View style={styles.alternativeIcon}>
                        <Award size={32} color="#5A7D7B" />
                    </View>

                    <Text style={styles.alternativeTitle}>Both candidates did well.</Text>

                    <Text style={styles.alternativeText}>
                        The difference is in how they translated their skills, focused on their strengths, and highlighted how they could add value to the particular role they applied for.
                    </Text>

                    <Text style={styles.alternativeText}>
                        When preparing for your interviews, keep putting yourself in the employer's shoes and choose your answers based on what will resonate for them.
                    </Text>

                    <Text style={styles.alternativeClosing}>
                        See you for your final step tomorrow.
                    </Text>

                    <TouchableOpacity style={styles.completeButton} onPress={handleContinue}>
                        <View
                            style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.completeButtonText}>Mark As Complete</Text>
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

    // Fallback - should never reach here
    return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text>Error: Invalid screen state</Text>
        </View>
    );
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
        marginBottom: 20,
    },
    continuePrompt: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
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
    alternativeClosing: {
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
});