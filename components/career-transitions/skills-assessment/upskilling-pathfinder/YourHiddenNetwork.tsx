import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { ChevronRight, Users, ArrowLeft } from 'lucide-react-native';

interface NetworkQuestion {
    id: number;
    optionA: string;
    optionB: string;
}

interface YourHiddenNetworkProps {
    onComplete: () => void;
    onBack?: () => void;
}

const { width, height } = Dimensions.get('window');

const networkQuestions: NetworkQuestion[] = [
    {
        id: 1,
        optionA: "Friend in a corporate job",
        optionB: "Friend who freelances"
    },
    {
        id: 2,
        optionA: "Former school teacher",
        optionB: "Dance friend who already pivoted"
    },
    {
        id: 3,
        optionA: "Family member who owns a business",
        optionB: "Online community forums"
    },
    {
        id: 4,
        optionA: "LinkedIn networking",
        optionB: "Informal coffee chats"
    },
    {
        id: 5,
        optionA: "Colleague from your survival job",
        optionB: "Artist running their own business"
    },
    {
        id: 6,
        optionA: "Former mentor",
        optionB: "Friend of a friend with experience"
    },
    {
        id: 7,
        optionA: "Asking for a skills swap",
        optionB: "Asking to volunteer on a project"
    },
    {
        id: 8,
        optionA: "Dance friend who's also changing careers",
        optionB: "Career coach"
    },
    {
        id: 9,
        optionA: "Professional networking groups",
        optionB: "University alumni network"
    }
];

const storyScreens = [
    {
        id: 1,
        text: "You start your pivot by reaching out to {CHOICE_1}. They share stories that open your eyes to paths you hadn't considered before."
    },
    {
        id: 2,
        text: "When you hit a wall, you look back to {CHOICE_2}. Their guidance reminds you that you're not starting from scratch — you're building on everything you already know."
    },
    {
        id: 3,
        text: "Support also shows up in surprising places: Advice from {CHOICE_3} gives you confidence to test new ideas and trust your instincts."
    },
    {
        id: 4,
        text: "You practice reaching out by inviting others to {CHOICE_4}. Each conversation feels like a classroom and you're feeling more and more excited about the future."
    },
    {
        id: 5,
        text: "Even in everyday life, learning happens. {CHOICE_5} shows you how transferable skills can open surprising doors."
    },
    {
        id: 6,
        text: "Mentorship comes in many forms when {CHOICE_6} appears out of nowhere and gives you honest advice that shapes your next steps."
    },
    {
        id: 7,
        text: "You put yourself out there by {CHOICE_7}. These moments become your most practical learning experiences."
    },
    {
        id: 8,
        text: "You lean on {CHOICE_8} to help you stay accountable and reminds you that growth is easier when shared."
    },
    {
        id: 9,
        text: "And when you zoom out, your network expands through {CHOICE_9}, giving you a bigger picture of what's possible."
    }
];

export default function YourHiddenNetwork({ onComplete, onBack }: YourHiddenNetworkProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-9 = questions, 10 = transition, 11-19 = story, 20 = final
    const [choices, setChoices] = useState<Record<number, string>>({});
    const [randomizedQuestions, setRandomizedQuestions] = useState<NetworkQuestion[]>([]);

    const handleBack = () => {
        onBack?.();
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    useEffect(() => {
        // Randomize questions when component mounts
        const shuffled = [...networkQuestions].sort(() => Math.random() - 0.5);
        setRandomizedQuestions(shuffled);
    }, []);

    const handleChoiceSelect = (questionId: number, choice: string) => {
        setChoices(prev => ({ ...prev, [questionId]: choice }));

        if (currentScreen < 9) {
            // Move to next question
            setTimeout(() => {
                setCurrentScreen(currentScreen + 1);
            }, 300);
        } else {
            // Move to transition screen
            setTimeout(() => {
                setCurrentScreen(10);
            }, 300);
        }
    };

    const getStoryText = (storyIndex: number) => {
        const story = storyScreens[storyIndex];
        const questionId = randomizedQuestions[storyIndex]?.id;
        const choice = choices[questionId] || "";
        return story.text.replace(`{CHOICE_${storyIndex + 1}}`, choice.toLowerCase());
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
                            <Text style={styles.titleText}>Your Hidden Network</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <Users size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>Your Hidden Network</Text>

                            <Text style={styles.introDescription}>
                                This is a game of instincts to uncover your hidden network. Choose the answer that makes the most sense for you. There's no right or wrong!
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={() => setCurrentScreen(1)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Start the Game</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Question Screens (1-9)
    if (currentScreen >= 1 && currentScreen <= 9) {
        const questionIndex = currentScreen - 1;
        const question = randomizedQuestions[questionIndex];

        if (!question) {
            return (
                <View style={styles.container}>
                    <Text>Loading...</Text>
                </View>
            );
        }

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
                                    onPress={() => handleChoiceSelect(question.id, question.optionA)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceButtonText}>{question.optionA}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(question.id, question.optionB)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceButtonText}>{question.optionB}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Transition Screen
    if (currentScreen === 10) {
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
                            <Text style={styles.titleText}>Your Hidden Network</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.storyCard}>
                            <View style={styles.storyTitleContainer}>
                                <Text style={styles.storyTitle}>Explore Your Hidden Network</Text>
                                <View style={styles.titleUnderline} />
                            </View>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={() => setCurrentScreen(11)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Story Screens (11-19)
    if (currentScreen >= 11 && currentScreen <= 19) {
        const storyIndex = currentScreen - 11;
        const storyText = getStoryText(storyIndex);

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
                            <Text style={styles.titleText}>Your Hidden Network</Text>
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

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={() => setCurrentScreen(currentScreen + 1)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen
    if (currentScreen === 20) {
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
                            <Text style={styles.titleText}>Your Hidden Network</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.storyCard}>
                            <View style={styles.finalHeader}>
                                <Users size={24} color="#928490" />
                                <Text style={styles.finalHeading}>Your Hidden Network</Text>
                                <Users size={24} color="#928490" />
                            </View>

                            <View style={styles.storyTextContainer}>
                                <Text style={styles.storyText}>
                                    Your network is everywhere. Each conversation, connection, and small act of courage adds another stepping stone on your path forward. You don't have to do this alone! Your support system is already forming around you if you're willing to look.
                                </Text>
                            </View>

                            <Text style={styles.alternativeClosing}>
                                See you tomorrow!
                            </Text>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={onComplete}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.continueButtonText}>Mark As Complete</Text>
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
    storyTitleContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    storyTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 32,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 38,
        fontWeight: '700',
    },
    titleUnderline: {
        height: 4,
        width: 60,
        backgroundColor: '#928490',
        borderRadius: 2,
        marginTop: 16,
        opacity: 0.6,
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
        marginTop: 20,
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
});