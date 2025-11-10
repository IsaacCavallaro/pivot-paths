import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Sparkles, ArrowLeft, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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
                            <Text style={styles.headerTitle}>Plan Your Ideal Week</Text>
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
                                <Sparkles size={32} color="#928490" />
                            </View>

                            <Text style={styles.introTitle}>Plan Your Ideal Week</Text>

                            <Text style={styles.introDescription}>
                                Choose the option that feels best to you and create a balanced schedule for work, hobbies, and rest.
                            </Text>

                            <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Start planning</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Choice Screens (1-6)
    if (currentScreen >= 1 && currentScreen <= 6) {
        const currentChoice = timeChoices[currentScreen - 1];

        if (!currentChoice) return null;

        // Calculate progress for choice screens
        const choiceProgress = ((currentScreen) / 6) * 100;

        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                            <ChevronLeft size={24} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>
                                {currentScreen} of 6
                            </Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${choiceProgress}%` }]} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
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
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Results Screen (7)
    if (currentScreen === 7) {
        const results = getResultText();

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
                            <Text style={styles.headerTitle}>Your Ideal Week</Text>
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
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Final Message Screen (8)
    if (currentScreen === 8) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backIconWrapper} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Plan Your Ideal Week</Text>
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
                                <Sparkles size={40} color="#928490" />
                            </View>
                            <Text style={styles.introTitle}>Your Day, Your Terms</Text>
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

                            <TouchableOpacity style={styles.completeButton} onPress={handleContinue}>
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

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0',
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
    backIconWrapper: {
        width: 40,
        alignItems: 'center'
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
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

    choiceQuestion: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    choiceButtons: {
        gap: 20,
        width: '100%',
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

    resultsTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    scheduleSection: {
        marginBottom: 30,
        width: '100%',
    },
    scheduleHeading: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
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

    continueButton: {
        borderRadius: 12,
        overflow: 'hidden',
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
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
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
        marginBottom: 20,
    },
    completeButton: {
        borderRadius: 12,
        overflow: 'hidden',
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
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        marginTop: 12,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#E2DED0',
        borderRadius: 3,
    },
});