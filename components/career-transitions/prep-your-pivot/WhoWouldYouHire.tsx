import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Users, Award, Check } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';

interface WhoWouldYouHireProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function WhoWouldYouHire({ onComplete, onBack }: WhoWouldYouHireProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const { scrollViewRef, scrollToTop } = useScrollToTop();
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

    // Safe access to current scenario
    const getCurrentScenario = () => {
        return scenarios[currentScenario] || scenarios[0];
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
        } else if (currentScreen === 2) {
            setCurrentScreen(1);
        } else if (currentScreen === 3) {
            setCurrentScreen(2);
            setSelectedChoice(null);
        } else if (currentScreen === 4) {
            setCurrentScreen(3);
        }
        scrollToTop();
    };

    const handleStartActivity = () => {
        setCurrentScreen(0);
        scrollToTop();
    };

    const handleChoiceSelect = (choiceNumber: number) => {
        setSelectedChoice(choiceNumber);
        scrollToTop();
    };

    const handleContinue = () => {
        if (currentScreen === 0) {
            setCurrentScreen(1);
        } else if (currentScreen === 1) {
            setCurrentScreen(2);
        } else if (currentScreen === 2 && selectedChoice !== null) {
            setCurrentScreen(3);
        } else if (currentScreen === 3) {
            if (currentScenario < scenarios.length - 1) {
                setCurrentScenario(currentScenario + 1);
                setSelectedChoice(null);
                setCurrentScreen(1);
            } else {
                setCurrentScreen(4);
            }
        } else if (currentScreen === 4) {
            onComplete();
        }
        scrollToTop();
    };

    const getResponseText = () => {
        const scenario = getCurrentScenario();
        if (selectedChoice === 1) {
            return scenario.response1;
        } else if (selectedChoice === 2) {
            return scenario.response2;
        }
        return "";
    };

    // Welcome Screen
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
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <Users size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={commonStyles.introTitle}>Who would you hire?</Text>

                            <Text style={commonStyles.introDescription}>
                                Take yourself out of the equation and pretend YOU are the hiring manager putting another dancer in the hot seat for an interview. Put yourself in their shoes and decide who you would hire.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                You'll see how the same dance experience can be framed in different ways, and learn what employers are really looking for when they hear your story.
                            </Text>

                            <PrimaryButton title="Let's Begin" onPress={handleStartActivity} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario Intro Screen
    if (currentScreen === 0) {
        const scenario = getCurrentScenario();
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
                            <Text style={styles.scenarioTitle}>Scenario {currentScenario + 1} of {scenarios.length}</Text>

                            <Text style={styles.scenarioText}>
                                You're hiring a <Text style={{ fontWeight: '600' }}>{scenario.role}</Text>.
                            </Text>

                            <Text style={styles.scenarioText}>
                                The role involves <Text style={{ fontWeight: '600' }}>{scenario.challenge}</Text>. Two dancers explain their experience. Who would you hire?
                            </Text>

                            <PrimaryButton title="See Their Answers" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Choices Screen
    if (currentScreen === 1) {
        const scenario = getCurrentScenario();
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
                            <Text style={styles.choicesTitle}>Who would you hire?</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 1 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(1)}
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
                                            {scenario.choice1}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 2 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(2)}
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
                                            {scenario.choice2}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinue}
                                disabled={selectedChoice === null}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Response Screen
    if (currentScreen === 2) {
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
                            <Text style={styles.responseTitle}>Here's our take</Text>

                            <Text style={styles.responseText}>{getResponseText()}</Text>

                            <Text style={styles.continuePrompt}>
                                {currentScenario < scenarios.length - 1 ? "Let's try another one." : "Ready for the final thoughts?"}
                            </Text>

                            <PrimaryButton title="Continue" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen
    if (currentScreen === 3) {
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
                                <View style={[styles.introIconGradient, { backgroundColor: '#5A7D7B' }]}>
                                    <Award size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={commonStyles.reflectionTitle}>Both candidates did well.</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The difference is in how they translated their skills, focused on their strengths, and highlighted how they could add value to the particular role they applied for.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                When preparing for your interviews, keep putting yourself in the employer's shoes and choose your answers based on what will resonate for them.
                            </Text>

                            <Text style={styles.alternativeClosing}>
                                See you for your final step tomorrow.
                            </Text>

                            <JournalEntrySection
                                pathTag="prep-your-pivot"
                                day="6"
                                category="Career Transitions"
                                pathTitle="Prep Your Pivot"
                                dayTitle="Who Would You Hire?"
                                journalInstruction="What did you learn about how to frame your dance experience for interviews?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <View style={styles.journalCallout}>
                                <Text style={styles.journalCalloutTitle}>Your Interview Prep Space</Text>
                                <Text style={styles.journalCalloutText}>
                                    Use the journal tab anytime to practice framing your dance experience for different roles. The more you practice, the more natural it will feel!
                                </Text>
                            </View>

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
    // Intro Icon Styles
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
        elevation: 5,
    },
    // Scenario Styles
    scenarioTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    scenarioText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 20,
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
    continuePrompt: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
    },
    // Final Screen Styles
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '600',
    },
    // Journal Callout
    journalCallout: {
        width: '100%',
        backgroundColor: 'rgba(100, 124, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(100, 124, 144, 0.2)',
    },
    journalCalloutTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '600',
    },
    journalCalloutText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 22,
    },
});