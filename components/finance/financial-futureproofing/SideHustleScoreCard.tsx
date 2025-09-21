import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, TrendingUp, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface SideHustleChoice {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface SideHustleScoreCardProps {
    onComplete: () => void;
    onBack?: () => void;
}

const sideHustleChoices: SideHustleChoice[] = [
    {
        id: 1,
        option1: 'Dog Walking',
        option2: 'Delivery Driving',
        storyKey: 'hustle1'
    },
    {
        id: 2,
        option1: 'Virtual Assistant',
        option2: 'Social Media Manager',
        storyKey: 'hustle2'
    },
    {
        id: 3,
        option1: 'Tutoring',
        option2: 'Video Editing',
        storyKey: 'hustle3'
    },
    {
        id: 4,
        option1: 'Graphic Design',
        option2: 'Web Design',
        storyKey: 'hustle4'
    },
    {
        id: 5,
        option1: 'Sell Crafts Online',
        option2: 'Start a Youtube channel',
        storyKey: 'hustle5'
    }
];

export default function SideHustleScoreCard({ onComplete, onBack }: SideHustleScoreCardProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-5 = choices, 6-11 = story
    const [choices, setChoices] = useState<{ [key: string]: string }>({});
    const [randomizedChoices, setRandomizedChoices] = useState<SideHustleChoice[]>([]);

    useEffect(() => {
        // Randomize the order of choices when component mounts
        const shuffled = [...sideHustleChoices].sort(() => Math.random() - 0.5);
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

        if (currentScreen < 5) {
            setCurrentScreen(currentScreen + 1);
        } else {
            // Skip to story screen 7 (Your Hustle, Your Rules)
            setCurrentScreen(7);
        }
    };

    const handleContinueStory = () => {
        if (currentScreen < 11) {
            setCurrentScreen(currentScreen + 1);
        } else {
            onComplete();
        }
    };

    const getStoryText = (screenNumber: number) => {
        switch (screenNumber) {
            case 7:
                return "Your Hustle, Your Rules";
            case 8:
                return `You decided to bring in extra cash through ${choices.hustle1?.toLowerCase()}. The flexible hours let you work around your dance schedule, and you love the variety.`;
            case 9:
                return `You decided to build your skills as a ${choices.hustle2?.toLowerCase()}. You love the creative challenge and the ability to work from anywhere on your own schedule. But it isn't quite enough.`;
            case 10:
                return `You dabble in ${choices.hustle3?.toLowerCase()} and start learning more about ${choices.hustle4?.toLowerCase()}. You're not only making extra money that you put into savings but you're learning valuable skills for the future.`;
            case 11:
                return `In the meantime, you take one of your other passions and start ${choices.hustle5 === 'Sell Crafts Online' ? 'selling your crafts online' : 'a YouTube channel'}. It feels amazing to finally have some agency in your life and build other income streams while you're still dancing.`;
            case 12:
                return "How does that feel? This isn't a far-off fantasy. This is what's possible when you direct your famous dancer discipline toward other goals.\n\nYour first step is simple: pick one side hustle from your choices and research how to get started this week. You don't have to commit forever, just try it.\n\nCome back tomorrow for more.";
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
                        <TrendingUp size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Side Hustle Scorecard</Text>

                    <Text style={styles.introDescription}>
                        Your financial goals need fuel. A side hustle is a powerful way to generate extra cash to build your future, fast.
                    </Text>

                    <Text style={styles.introDescription}>
                        This is a game of instincts. Choose the side gigs that sound most appealing to you. We'll use your choices to show you the impact that extra income can have.
                    </Text>

                    <Text style={styles.introDescription}>
                        Don't overthink it! There's no right or wrong.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
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

    // Choice Screens (1-5)
    if (currentScreen >= 1 && currentScreen <= 5) {
        const choiceIndex = currentScreen - 1;
        const currentChoice = randomizedChoices[choiceIndex];

        if (!currentChoice) return null;

        return (
            <View style={styles.container}>
                <View style={styles.choiceHeader}>
                    <Text style={styles.choiceProgress}>
                        {currentScreen} of 5
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(currentScreen / 5) * 100}%` }]} />
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

    // Story Screens (7-12)
    if (currentScreen >= 7 && currentScreen <= 12) {
        const storyText = getStoryText(currentScreen);
        const isTitle = currentScreen === 7;
        const isFinal = currentScreen === 12;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.storyContainer}>
                    {isTitle ? (
                        <Text style={styles.storyTitle}>{storyText}</Text>
                    ) : (
                        <>
                            {isFinal && (
                                <Text style={styles.finalHeading}>How does that feel?</Text>
                            )}
                            <Text style={styles.storyText}>{storyText}</Text>
                        </>
                    )}

                    {isFinal && (
                        <Text style={styles.alternativeClosing}>
                            Come back tomorrow for more.
                        </Text>
                    )}

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

                {!isFinal && (
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <ChevronLeft size={24} color="#647C90" />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                )}
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
        marginTop: 20,
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
        marginBottom: 20,
    },
    startButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 20,
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
    storyTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 40,
    },
    storyText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
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
    finalHeading: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
        width: '100%',
    },
});