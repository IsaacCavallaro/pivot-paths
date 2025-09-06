import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronRight, Users, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface NetworkQuestion {
    id: number;
    optionA: string;
    optionB: string;
}

interface YourHiddenNetworkProps {
    onComplete: () => void;
    onBack?: () => void;
}

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
                <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                    <ArrowLeft size={28} color="#647C90" />
                </TouchableOpacity>
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <Users size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Your Hidden Network</Text>

                    <Text style={styles.introDescription}>
                        This is a game of instincts to uncover your hidden network. Choose the answer that makes the most sense for you. There's no right or wrong!
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={() => setCurrentScreen(1)}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Start the game</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
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
                <View style={styles.header}>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {currentScreen}/9 questions
                        </Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${(currentScreen / 9) * 100}%` }]} />
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.questionContainer}>
                    <Text style={styles.questionTitle}>Your Hidden Network</Text>

                    <View style={styles.choicesContainer}>
                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoiceSelect(question.id, question.optionA)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.choiceText}>{question.optionA}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoiceSelect(question.id, question.optionB)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.choiceText}>{question.optionB}</Text>
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

    // Transition Screen
    if (currentScreen === 10) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.transitionContainer}>
                    <View style={styles.transitionIcon}>
                        <Users size={40} color="#5A7D7B" />
                    </View>

                    <Text style={styles.transitionTitle}>Explore Your Hidden Network</Text>

                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={() => setCurrentScreen(11)}
                    >
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#5A7D7B' }]}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
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
                <ScrollView style={styles.content} contentContainerStyle={styles.storyContainer}>
                    <View style={styles.storyIcon}>
                        <Users size={32} color="#5A7D7B" />
                    </View>

                    <Text style={styles.storyText}>{storyText}</Text>

                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => setCurrentScreen(currentScreen + 1)}
                    >
                        <Text style={styles.nextButtonText}>Swipe to continue</Text>
                        <ChevronRight size={16} color="#647C90" />
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Final Screen
    if (currentScreen === 20) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
                    <View style={styles.finalIcon}>
                        <Users size={40} color="#5A7D7B" />
                    </View>

                    <Text style={styles.finalTitle}>Your Hidden Network</Text>

                    <Text style={styles.finalText}>
                        Your network is everywhere. Each conversation, connection, and small act of courage adds another stepping stone on your path forward. You don't have to do this alone! Your support system is already forming around you if you're willing to look.
                    </Text>

                    <Text style={styles.finalClosing}>
                        See you tomorrow!
                    </Text>

                    <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
                        <View
                            style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.completeButtonText}>Mark As Complete</Text>
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
        marginBottom: 15,
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#746C70',
        textAlign: 'center',
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
    header: {
        padding: 20,
        paddingTop: 60,
    },
    progressContainer: {
        alignItems: 'center',
    },
    progressText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#647C90',
        marginBottom: 10,
    },
    progressBar: {
        width: '100%',
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
    questionContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    questionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 40,
    },
    choicesContainer: {
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
        alignItems: 'center',
    },
    choiceText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 22,
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
    transitionContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    transitionIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    transitionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 40,
    },
    continueButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    continueButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
    },
    storyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    storyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    storyText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 40,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    nextButtonText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#647C90',
        marginRight: 8,
    },
    finalContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    finalIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    finalTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 24,
    },
    finalText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    finalClosing: {
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
});