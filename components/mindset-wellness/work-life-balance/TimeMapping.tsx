import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';

interface TimeMappingProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function TimeMapping({ onComplete, onBack }: TimeMappingProps) {
    const timeChoices = [
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

    // Custom content function for reflection screen
    const renderScheduleContent = (choices: { [key: string]: string }): ReactNode => {
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

        const results = getResultText();

        return (
            <View style={styles.scheduleContent}>
                {/* Add the title and divider from your requirements */}
                <Text style={styles.resultsTitle}>Your Ideal Weekly Rhythm</Text>
                <View style={styles.titleDivider} />

                <View style={styles.scheduleSection}>
                    <Text style={styles.scheduleHeading}>Monday–Friday</Text>
                    <View style={styles.scheduleItem}>
                        <Text style={styles.scheduleTime}>Based on Screen 2 → Morning:</Text>
                        <Text style={styles.scheduleActivity}>{results.weekdayMorning}</Text>
                    </View>
                    <View style={styles.scheduleItem}>
                        <Text style={styles.scheduleTime}>Based on Screen 3 ⇒ Midday:</Text>
                        <Text style={styles.scheduleActivity}>{results.weekdayMidday}</Text>
                    </View>
                    <View style={styles.scheduleItem}>
                        <Text style={styles.scheduleTime}>Based on Screen 2 → Afternoon:</Text>
                        <Text style={styles.scheduleActivity}>{results.weekdayAfternoon}</Text>
                    </View>
                    <View style={styles.scheduleItem}>
                        <Text style={styles.scheduleTime}>Based on Screen 4 → Evening:</Text>
                        <Text style={styles.scheduleActivity}>{results.weekdayEvening}</Text>
                    </View>
                    <View style={styles.scheduleItem}>
                        <Text style={styles.scheduleTime}>Based on Screen 7 → Before Bed:</Text>
                        <Text style={styles.scheduleActivity}>{results.weekdayBed}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.scheduleSection}>
                    <Text style={styles.scheduleHeading}>Saturday–Sunday</Text>
                    <View style={styles.scheduleItem}>
                        <Text style={styles.scheduleTime}>Based on Screen 2 → Morning:</Text>
                        <Text style={styles.scheduleActivity}>{results.weekendMorning}</Text>
                    </View>
                    <View style={styles.scheduleItem}>
                        <Text style={styles.scheduleTime}>Based on Screen 6 → Daytime:</Text>
                        <Text style={styles.scheduleActivity}>{results.weekendDaytime}</Text>
                    </View>
                    <View style={styles.scheduleItem}>
                        <Text style={styles.scheduleTime}>Based on Screen 5 → Evening:</Text>
                        <Text style={styles.scheduleActivity}>{results.weekendEvening}</Text>
                    </View>
                    <View style={styles.scheduleItem}>
                        <Text style={styles.scheduleTime}>Based on Screen 2 → Night:</Text>
                        <Text style={styles.scheduleActivity}>{results.weekendNight}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="choice"
            primaryButtonText="Continue"
            imageSource="https://pivotfordancers.com/assets/logo.png"
            introScreen={{
                title: "Plan Your Ideal Week",
                descriptions: [
                    "Choose the option that feels best to you and create a balanced schedule for work, hobbies, and rest."
                ],
                buttonText: "Let's Start Planning",
                journalSectionProps: {
                    pathTag: "work-life-balance",
                    day: "5",
                    category: "Mindset and Wellness",
                    pathTitle: "Work Life Balance",
                    dayTitle: "Time Mapping",
                    journalInstruction: "Before we begin, take a moment to reflect: What does your ideal week look like currently? What would you like to change?",
                    moodLabel: "",
                    saveButtonText: "Save Entry"
                }
            }}
            secondaryIntroScreen={{
                title: "Design Your Weekly Rhythm",
                descriptions: [
                    "Let's create a schedule that works with your natural energy patterns and personal preferences. You'll answer a few questions about your ideal timing for different activities."
                ],
                buttonText: "Begin Planning"
            }}
            cards={timeChoices.map(choice => ({
                ...choice,
                buttonText: "" // Not used for choice cards
            }))}
            reflectionScreen={{
                title: "Your Ideal Weekly Rhythm",
                description: "Based on your preferences, here's a suggested weekly schedule that aligns with your natural energy patterns and personal style.",
                buttonText: "Continue",
                customContent: renderScheduleContent
            }}
            finalScreen={{
                title: "Your Day, Your Terms",
                descriptions: [
                    "One of the best parts of stepping away from dance is finally gaining control of your day. But there's no perfect schedule. What matters is that it reflects you… your energy, your priorities, and your personality.",
                    "Even small shifts can make your days feel more aligned. Keep experimenting until your week feels like it's working for you… not the other way around."
                ],
                buttonText: "Mark As Complete",
                alternativeClosing: "See you tomorrow for the next step!",
                journalSectionProps: {
                    pathTag: "work-life-balance",
                    day: "5",
                    category: "Mindset and Wellness",
                    pathTitle: "Work Life Balance",
                    dayTitle: "Time Mapping",
                    journalInstruction: "Reflect on your ideal schedule. What feels most aligned with your natural rhythms? What adjustments will you make to your current routine?",
                    moodLabel: "",
                    saveButtonText: "Save Entry"
                }
            }}
        />
    );
}

const styles = StyleSheet.create({
    scheduleContent: {
        width: '100%',
    },
    resultsTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 16,
    },
    titleDivider: {
        height: 1,
        backgroundColor: '#E2DED0',
        marginVertical: 20,
        width: '100%',
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
    divider: {
        height: 1,
        backgroundColor: '#E2DED0',
        marginVertical: 20,
        width: '100%',
    },
});