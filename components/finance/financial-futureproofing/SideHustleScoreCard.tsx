import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
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

const { width, height } = Dimensions.get('window');

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
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Side Hustle Scorecard</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <TrendingUp size={32} color="#E2DED0" />
                                </View>
                            </View>
                            <Text style={styles.introTitle}>Side Hustle Scorecard</Text>
                            <Text style={styles.introDescription}>
                                Your financial goals need fuel. A side hustle is a powerful way to generate extra cash to build your future, fast.
                                {'\n\n'}
                                This is a game of instincts. Choose the side gigs that sound most appealing to you. We'll use your choices to show you the impact that extra income can have.
                                {'\n\n'}
                                Don't overthink it! There's no right or wrong.
                            </Text>
                            <TouchableOpacity style={styles.startButton} onPress={handleStartGame} activeOpacity={0.8}>
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

    // Choice Screens (1-5)
    if (currentScreen >= 1 && currentScreen <= 5) {
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
                            <Text style={styles.progressText}>{currentScreen} of 5</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(currentScreen / 5) * 100}%` }]} />
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

    // Story Screens (7-12)
    if (currentScreen >= 7 && currentScreen <= 12) {
        const storyText = getStoryText(currentScreen);
        const isTitle = currentScreen === 7;
        const isFinal = currentScreen === 12;

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
                            <Text style={styles.titleText}>Side Hustle Scorecard</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.storyCard}>
                            {isTitle ? (
                                <Text style={styles.storyTitle}>{storyText}</Text>
                            ) : (
                                <>
                                    {isFinal && (
                                        <View style={styles.finalHeader}>
                                            <TrendingUp size={24} color="#928490" />
                                            <Text style={styles.finalHeading}>How does that feel?</Text>
                                            <TrendingUp size={24} color="#928490" />
                                        </View>
                                    )}
                                    <View style={styles.storyTextContainer}>
                                        <Text style={styles.storyText}>{storyText}</Text>
                                    </View>
                                </>
                            )}

                            {isFinal && (
                                <Text style={styles.alternativeClosing}>
                                    Come back tomorrow for more.
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

                {!isFinal && (
                    <TouchableOpacity style={styles.bottomBackButton} onPress={goBack}>
                        <ChevronLeft size={24} color="#647C90" />
                        <Text style={styles.bottomBackButtonText}>Back</Text>
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
    storyTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: '700',
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
    finalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        gap: 12,
    },
    finalHeading: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '700',
    },
    bottomBackButton: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    bottomBackButtonText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#647C90',
        marginLeft: 8,
    },
});