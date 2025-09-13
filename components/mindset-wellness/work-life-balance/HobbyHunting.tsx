import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Sparkles, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface HobbyChoice {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface HobbyHuntingProps {
    onComplete: () => void;
    onBack?: () => void;
}

const hobbyChoices: HobbyChoice[] = [
    {
        id: 1,
        option1: 'Painting',
        option2: 'Pottery',
        storyKey: 'creative'
    },
    {
        id: 2,
        option1: 'Cooking',
        option2: 'Knitting',
        storyKey: 'winddown'
    },
    {
        id: 3,
        option1: 'Yoga',
        option2: 'Martial arts',
        storyKey: 'balance'
    },
    {
        id: 4,
        option1: 'Gardening',
        option2: 'Photography',
        storyKey: 'weekend'
    },
    {
        id: 5,
        option1: 'Learning a language',
        option2: 'Learning an instrument',
        storyKey: 'challenge'
    },
    {
        id: 6,
        option1: 'Volunteering',
        option2: 'Blogging',
        storyKey: 'connection'
    },
    {
        id: 7,
        option1: 'Hiking',
        option2: 'Rock climbing',
        storyKey: 'movement'
    },
    {
        id: 8,
        option1: 'Board games',
        option2: 'Book clubs',
        storyKey: 'social'
    },
    {
        id: 9,
        option1: 'Pickleball',
        option2: 'Paddleboarding',
        storyKey: 'saturday'
    }
];

export default function HobbyHunting({ onComplete, onBack }: HobbyHuntingProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-9 = choices, 10-16 = story
    const [choices, setChoices] = useState<{ [key: string]: string }>({});
    const [randomizedChoices, setRandomizedChoices] = useState<HobbyChoice[]>([]);

    useEffect(() => {
        // Randomize the order of choices when component mounts
        const shuffled = [...hobbyChoices].sort(() => Math.random() - 0.5);
        setRandomizedChoices(shuffled);
    }, []);

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

        if (currentScreen < 9) {
            setCurrentScreen(currentScreen + 1);
        } else {
            // Skip to story screen 11 (first story screen)
            setCurrentScreen(11);
        }
    };

    const handleContinueStory = () => {
        if (currentScreen < 16) {
            setCurrentScreen(currentScreen + 1);
        } else {
            onComplete();
        }
    };

    const getStoryText = (screenNumber: number) => {
        switch (screenNumber) {
            case 11:
                return `After work, you dive into ${choices.creative?.toLowerCase()}, feeling curious and excited by this new form of expression or challenge. And as you wind down for the day, your new ${choices.winddown === 'Cooking' ? 'cookbook' : 'knitting project'} keeps you engaged.`;
            case 12:
                return `A few times a week, you find balance and focus through ${choices.balance?.toLowerCase()}, letting your body and mind reconnect in new ways.`;
            case 13:
                return `Your weekends are filled with ${choices.weekend?.toLowerCase()} to help you slow down and notice the details, giving you a sense of accomplishment and calm.\n\nAnd when you're itching for a challenge, you decide to stretch your mind ${choices.challenge?.toLowerCase()}.`;
            case 14:
                return `As a summer project, you explore connection and purpose through ${choices.connection?.toLowerCase()}, sharing your time, skills, or thoughts with others.\n\nAnd your daily movement off the stage finally becomes playtime again as you enjoy ${choices.movement?.toLowerCase()} with friends.`;
            case 15:
                return `${choices.social === 'Board games' ? 'Board games with family' : 'A book club with friends'} and ${choices.saturday === 'Pickleball' ? 'pickleball tournaments' : 'solo paddleboarding excursions'} fill those Saturdays that used to be spent auditioning (or scrolling).`;
            case 16:
                return "You actually have hobbies now and letting go of dance doesn't seem so hard. You have other things to enjoy and new ways to recharge and play.\n\nTry adding at least one of these hobbies to your routine this week.";
            default:
                return "";
        }
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

                    <Text style={styles.introTitle}>Hobby Hunting</Text>

                    <Text style={styles.introDescription}>
                        As dancers, we often have a one-track mind and hobbies often get put on the backburner. So, today we're hobby hunting! Pick the option that excites you most.
                    </Text>
                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Get started</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Choice Screens (1-9)
    if (currentScreen >= 1 && currentScreen <= 9) {
        const choiceIndex = currentScreen - 1;
        const currentChoice = randomizedChoices[choiceIndex];

        if (!currentChoice) return null;

        return (
            <View style={styles.container}>
                <View style={styles.choiceHeader}>
                    <Text style={styles.choiceProgress}>
                        {currentScreen} of 9
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(currentScreen / 9) * 100}%` }]} />
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.choiceContainer}>
                    <View style={styles.choiceButtons}>
                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoice(currentChoice.storyKey, currentChoice.option1)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.choiceButtonText}>{currentChoice.option1}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoice(currentChoice.storyKey, currentChoice.option2)}
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

    // Story Screens (11-16)
    if (currentScreen >= 11 && currentScreen <= 16) {
        const storyText = getStoryText(currentScreen);
        const isFinal = currentScreen === 16;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.storyContainer}>
                    <Text style={styles.storyText}>{storyText}</Text>

                    <Text style={styles.alternativeClosing}>
                        {isFinal ? 'See you tomorrow for more' : ''}
                    </Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinueStory}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.continueButtonText}>
                                {isFinal ? 'Mark as complete' : 'Continue'}
                            </Text>
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
    alternativeClosing: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 40,
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
    storyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    storyText: {
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