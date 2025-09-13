import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Sparkles, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface TimeChoice {
    id: number;
    question: string;
    option1: string;
    option2: string;
    resultKey: string;
}

interface TimeMappingProps {
    onComplete: () => void;
    onBack?: () => void;
}

const timeChoices: TimeChoice[] = [
    {
        id: 1,
        question: 'I feel most focused…',
        option1: 'In the morning',
        option2: 'In the evening',
        resultKey: 'focusTime'
    },
    {
        id: 2,
        question: 'I prefer to move by doing…',
        option1: 'A structured workout',
        option2: 'A walk or casual activity',
        resultKey: 'movement'
    },
    {
        id: 3,
        question: 'When it comes to hobbies, I like…',
        option1: 'Creative, expressive things',
        option2: 'Quiet, reflective things',
        resultKey: 'hobbies'
    },
    {
        id: 4,
        question: 'For social time, I prefer…',
        option1: 'Small group / 1:1 connections',
        option2: 'Larger gatherings & events',
        resultKey: 'social'
    },
    {
        id: 5,
        question: 'On weekends, I want…',
        option1: 'Rest + reset',
        option2: 'Adventure + activities',
        resultKey: 'weekends'
    },
    {
        id: 6,
        question: 'For winding down at night, I\'d rather…',
        option1: 'Something calming (journaling, stretching)',
        option2: 'Something light (knitting, games)',
        resultKey: 'windDown'
    }
];

export default function TimeMapping({ onComplete, onBack }: TimeMappingProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-6 = choices, 7 = results, 8 = final message
    const [choices, setChoices] = useState<{ [key: string]: string }>({});

    const handleStartGame = () => {
        setCurrentScreen(1);
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

    const handleChoice = (choiceKey: string, selectedOption: string) => {
        const newChoices = { ...choices, [choiceKey]: selectedOption };
        setChoices(newChoices);

        if (currentScreen < 6) {
            setCurrentScreen(currentScreen + 1);
        } else {
            setCurrentScreen(7); // Results screen
        }
    };

    const handleContinue = () => {
        if (currentScreen === 7) {
            setCurrentScreen(8); // Final message screen
        } else if (currentScreen === 8) {
            onComplete();
        }
    };

    const getResultText = () => {
        const focusTime = choices.focusTime;
        const movement = choices.movement;
        const hobbies = choices.hobbies;
        const social = choices.social;
        const weekends = choices.weekends;
        const windDown = choices.windDown;

        return {
            weekdayMorning: focusTime === 'In the morning'
                ? 'Deep-focus work, project planning, or study'
                : 'Slow start with coffee, errands, and admin tasks',
            weekdayMidday: movement === 'A structured workout'
                ? 'Quick 30-min workout'
                : 'Go for a walk or do a quick stretch',
            weekdayAfternoon: focusTime === 'In the morning'
                ? 'Team meetings or admin work'
                : 'Deep-focus work, creative projects, or study',
            weekdayEvening: hobbies === 'Creative, expressive things'
                ? 'Hobbies like painting or music practice'
                : 'Hobbies like journaling or reading',
            weekdayBed: windDown === 'Something calming (journaling, stretching)'
                ? 'Calming wind-down routine with yoga or reading'
                : 'Light wind down activities like board games or knitting',
            weekendMorning: focusTime === 'In the morning'
                ? 'Light movement like a pilates/barre class'
                : 'Sleep in for a relaxed start',
            weekendDaytime: weekends === 'Rest + reset'
                ? 'Errands, creative time, or coffee with a close friend'
                : 'Hiking, a day trip, or exploring a new cafe',
            weekendEvening: social === 'Small group / 1:1 connections'
                ? 'Movie or a quiet dinner'
                : 'Dinner out with friends',
            weekendNight: focusTime === 'In the morning'
                ? 'Early wind-down to recharge'
                : 'Flexible bed time, riding the energy wave'
        };
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
                        <Sparkles size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Plan Your Ideal Week</Text>

                    <Text style={styles.introDescription}>
                        Choose the option that feels best to you and create a balanced schedule for work, hobbies, and rest.
                    </Text>
                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Start planning</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Choice Screens (1-6)
    if (currentScreen >= 1 && currentScreen <= 6) {
        const currentChoice = timeChoices[currentScreen - 1];

        if (!currentChoice) return null;

        return (
            <View style={styles.container}>
                <View style={styles.choiceHeader}>
                    <Text style={styles.choiceProgress}>
                        {currentScreen} of 6
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(currentScreen / 6) * 100}%` }]} />
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.choiceContainer}>
                    <Text style={styles.choiceQuestion}>{currentChoice.question}</Text>

                    <View style={styles.choiceButtons}>
                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoice(currentChoice.resultKey, currentChoice.option1)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.choiceButtonText}>{currentChoice.option1}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoice(currentChoice.resultKey, currentChoice.option2)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.choiceButtonText}>{currentChoice.option2}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>
                        {currentScreen === 1 ? 'Back to Intro' : 'Previous'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Results Screen (7)
    if (currentScreen === 7) {
        const results = getResultText();

        return (
            <View style={styles.container}>
                {onBack && (
                    <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                        <ArrowLeft size={28} color="#647C90" />
                    </TouchableOpacity>
                )}
                <ScrollView style={styles.content} contentContainerStyle={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>Your Ideal Weekly Rhythm</Text>

                    <View style={styles.scheduleSection}>
                        <Text style={styles.scheduleHeading}>Monday–Friday</Text>
                        <View style={styles.scheduleItem}>
                            <Text style={styles.scheduleTime}>Morning:</Text>
                            <Text style={styles.scheduleActivity}>{results.weekdayMorning}</Text>
                        </View>
                        <View style={styles.scheduleItem}>
                            <Text style={styles.scheduleTime}>Midday:</Text>
                            <Text style={styles.scheduleActivity}>{results.weekdayMidday}</Text>
                        </View>
                        <View style={styles.scheduleItem}>
                            <Text style={styles.scheduleTime}>Afternoon:</Text>
                            <Text style={styles.scheduleActivity}>{results.weekdayAfternoon}</Text>
                        </View>
                        <View style={styles.scheduleItem}>
                            <Text style={styles.scheduleTime}>Evening:</Text>
                            <Text style={styles.scheduleActivity}>{results.weekdayEvening}</Text>
                        </View>
                        <View style={styles.scheduleItem}>
                            <Text style={styles.scheduleTime}>Before Bed:</Text>
                            <Text style={styles.scheduleActivity}>{results.weekdayBed}</Text>
                        </View>
                    </View>

                    <View style={styles.scheduleSection}>
                        <Text style={styles.scheduleHeading}>Saturday–Sunday</Text>
                        <View style={styles.scheduleItem}>
                            <Text style={styles.scheduleTime}>Morning:</Text>
                            <Text style={styles.scheduleActivity}>{results.weekendMorning}</Text>
                        </View>
                        <View style={styles.scheduleItem}>
                            <Text style={styles.scheduleTime}>Daytime:</Text>
                            <Text style={styles.scheduleActivity}>{results.weekendDaytime}</Text>
                        </View>
                        <View style={styles.scheduleItem}>
                            <Text style={styles.scheduleTime}>Evening:</Text>
                            <Text style={styles.scheduleActivity}>{results.weekendEvening}</Text>
                        </View>
                        <View style={styles.scheduleItem}>
                            <Text style={styles.scheduleTime}>Night:</Text>
                            <Text style={styles.scheduleActivity}>{results.weekendNight}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Final Message Screen (8)
    if (currentScreen === 8) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
                    <Text style={styles.finalTitle}>Your Day, Your Terms</Text>

                    <Text style={styles.finalText}>
                        One of the best parts of stepping away from dance is finally gaining control of your day.
                        But there's no perfect schedule. What matters is that it reflects you… your energy,
                        your priorities, and your personality.
                    </Text>

                    <Text style={styles.finalText}>
                        Even small shifts can make your days feel more aligned. Keep experimenting until your
                        week feels like it's working for you… not the other way around.
                    </Text>

                    <Text style={styles.finalText}>
                        See you tomorrow for the next step!
                    </Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.continueButtonText}>Mark as complete</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
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
        fontSize: 32,
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
        fontStyle: 'italic',
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
    choiceHeader: {
        padding: 20,
        paddingTop: 60,
        alignItems: 'center',
    },
    choiceProgress: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#647C90',
        marginBottom: 10,
    },
    progressBar: {
        width: '80%',
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
    choiceContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    choiceQuestion: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 40,
    },
    choiceButtons: {
        gap: 20,
    },
    choiceButton: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        borderWidth: 2,
        borderColor: 'transparent',
        minHeight: 80,
        justifyContent: 'center',
    },
    choiceButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
    },
    resultsContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 60,
    },
    resultsTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 40,
    },
    scheduleSection: {
        marginBottom: 30,
    },
    scheduleHeading: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
        color: '#4E4F50',
        marginBottom: 16,
    },
    scheduleItem: {
        marginBottom: 16,
    },
    scheduleTime: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#647C90',
        marginBottom: 4,
    },
    scheduleActivity: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 22,
    },
    finalContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    finalTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
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
    continueButton: {
        borderRadius: 12,
        overflow: 'hidden',
        alignSelf: 'center',
        marginTop: 30,
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