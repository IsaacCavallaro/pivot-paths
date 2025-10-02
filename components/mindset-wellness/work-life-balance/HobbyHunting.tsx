import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
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

const { width, height } = Dimensions.get('window');

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
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Hobby Hunting</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <Sparkles size={32} color="#E2DED0" />
                                </View>
                            </View>
                            <Text style={styles.introTitle}>Hobby Hunting</Text>
                            <Text style={styles.introDescription}>
                                As dancers, we often have a one-track mind and hobbies often get put on the backburner. So, today we're hobby hunting! Pick the option that excites you most.
                            </Text>
                            <TouchableOpacity style={styles.startButton} onPress={handleStartGame} activeOpacity={0.8}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Get started</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
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
                {/* Sticky Header with Progress */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.progressText}>{currentScreen} of 9</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(currentScreen / 9) * 100}%` }]} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.choiceCard}>
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
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Story Screens (11-16)
    if (currentScreen >= 11 && currentScreen <= 16) {
        const storyText = getStoryText(currentScreen);
        const isFinal = currentScreen === 16;

        return (
            <View style={styles.container}>
                <View style={styles.storyBackground}>
                    <View style={styles.storyBackgroundPattern} />
                </View>

                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backButton} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Hobby Hunting</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.storyCard}>
                            <View style={styles.storyTextContainer}>
                                <Text style={styles.storyText}>{storyText}</Text>
                            </View>

                            {isFinal && (
                                <Text style={styles.alternativeClosing}>
                                    See you tomorrow for more
                                </Text>
                            )}

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinueStory} activeOpacity={0.8}>
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.continueButtonText}>
                                        {isFinal ? 'Mark as complete' : 'Continue'}
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

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0',
    },
    storyBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    storyBackgroundPattern: {
        flex: 1,
        opacity: 0.03,
        backgroundColor: '#928490',
        transform: [{ rotate: '45deg' }, { scale: 1.5 }],
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
        zIndex: 1,
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: height - 200,
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
    progressText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#E2DED0',
        textAlign: 'center',
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(226, 222, 208, 0.3)',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 12,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#E2DED0',
        borderRadius: 3,
    },
    introCard: {
        width: width * 0.85,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
        marginTop: 60,
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
        fontSize: 32,
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
        fontStyle: 'italic',
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
    choiceCard: {
        width: width * 0.85,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
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
    storyCard: {
        width: width * 0.85,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
    },
    storyTextContainer: {
        width: '100%',
        marginBottom: 32,
    },
    storyText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 28,
    },
    continueButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    continueButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E2DED0',
        minWidth: width * 0.5,
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
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
        marginTop: 5,
        fontWeight: '600',
    },
});