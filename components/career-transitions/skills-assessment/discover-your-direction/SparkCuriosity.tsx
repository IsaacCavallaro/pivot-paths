import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { ChevronRight, Lightbulb, ArrowLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface CuriosityCard {
    id: number;
    prompt: string;
    buttonText: string;
}

const curiosityCards: CuriosityCard[] = [
    {
        id: 1,
        prompt: "Think of a career you've admired from afar. What is it about this role that catches your attention?",
        buttonText: "Write it down"
    },
    {
        id: 2,
        prompt: "If you could spend one day in someone else's job, who would it be and why?",
        buttonText: "Think about it"
    },
    {
        id: 3,
        prompt: "What tasks or activities make time fly for you? Could these appear in a career?",
        buttonText: "Let's reflect"
    },
    {
        id: 4,
        prompt: "Imagine a time when you felt fully confident. What environment, people, and responsibilities helped create that confidence?",
        buttonText: "Hmm… interesting"
    },
    {
        id: 5,
        prompt: "Pick an industry you know nothing about. What's one question you'd ask someone working there to learn more?",
        buttonText: "Start asking"
    },
    {
        id: 6,
        prompt: "Think about a problem you enjoyed solving in your dance career. Could that same mindset apply in another context?",
        buttonText: "Do some reflection"
    },
    {
        id: 7,
        prompt: "Who do you know with a career you're curious about? What would you want to ask them if you had 15 minutes?",
        buttonText: "Get thinking"
    },
    {
        id: 8,
        prompt: "If you had unlimited time for learning, what skill or craft would you dive into next?",
        buttonText: "Let's learn"
    },
    {
        id: 9,
        prompt: "Picture your ideal workday five years from now. What are three things you'd do that excite you most?",
        buttonText: "Sounds good!"
    }
];

interface SparkCuriosityProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function SparkCuriosity({ onComplete, onBack }: SparkCuriosityProps) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ cardIndex: number }>>([]);

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartGame = () => {
        setScreenHistory([{ cardIndex: 0 }]);
    };

    const handleContinue = () => {
        if (currentCardIndex < curiosityCards.length - 1) {
            const newCardIndex = currentCardIndex + 1;
            setCurrentCardIndex(newCardIndex);
            setScreenHistory([...screenHistory, { cardIndex: newCardIndex }]);
        } else {
            setScreenHistory([...screenHistory, { cardIndex: -1 }]);
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            setScreenHistory([]);
            setCurrentCardIndex(0);
            return;
        }

        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        const prevScreen = newHistory[newHistory.length - 1];
        if (prevScreen.cardIndex === -1) {
            return;
        }

        setCurrentCardIndex(prevScreen.cardIndex);
    };

    // Intro Screen
    if (screenHistory.length === 0) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={styles.heroImage}
                                />
                            </View>

                            <Text style={styles.introTitle}>Spark Curiosity</Text>
                            <Text style={styles.introDescription}>
                                Curiosity is the engine of your pivot. Today we're here to spark new ideas, help you explore untapped careers, and uncover possibilities you might not have considered.
                            </Text>
                            <Text style={styles.introDescription}>
                                Swipe through each card, reflect, and take note of what excites you.
                            </Text>

                            <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Let's go</Text>
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
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.cardIndex === -1) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.finalCard}>
                            <View style={styles.finalIconContainer}>
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={styles.heroImage}
                                />
                            </View>

                            <View style={styles.finalHeader}>
                                <Text style={styles.finalHeading}>It's Time to Reflect</Text>
                            </View>

                            <View style={styles.finalTextContainer}>
                                <Text style={styles.finalText}>
                                    Exploring your curiosity doesn't mean you have to have all the answers right now. Each question is a doorway to possibilities, and the more you engage with them, the clearer your path becomes.
                                </Text>
                                <Text style={styles.finalText}>
                                    Take note of anything that excites you. You'll come back to it as you explore career options in the coming days.
                                </Text>
                            </View>

                            <Text style={styles.alternativeClosing}>
                                See you tomorrow.
                            </Text>

                            <View style={styles.finalButtonContainer}>
                                <TouchableOpacity
                                    style={styles.continueButton}
                                    onPress={handleComplete}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                        <Text style={styles.continueButtonText}>Mark As Complete</Text>
                                        <ChevronRight size={16} color="#E2DED0" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Card Screens
    const currentCard = curiosityCards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / curiosityCards.length) * 100;

    return (
        <View style={styles.container}>
            {/* Sticky Header with Progress */}
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <ArrowLeft size={28} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.progressText}>{currentCardIndex + 1} of {curiosityCards.length}</Text>
                    </View>
                    <View style={styles.backButton} />
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.centeredContent}>
                    <View style={styles.choiceCard}>
                        <View style={styles.newScriptCard}>
                            <Text style={styles.newScriptText}>
                                "{currentCard.prompt}"
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleContinue}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                <Text style={styles.continueButtonText}>
                                    {currentCard.buttonText}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0',
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
        marginBottom: 20,
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
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
    },
    scriptLabel: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    newScriptCard: {
        backgroundColor: 'rgba(146,132,144,0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
    },
    newScriptText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
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
    finalCard: {
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
    finalIconContainer: {
        marginBottom: 30,
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
        color: '#928490',
        textAlign: 'center',
        fontWeight: '700',
    },
    finalTextContainer: {
        width: '100%',
        marginBottom: 32,
    },
    finalText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 0,
    },
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 5,
        marginTop: 0,
        fontWeight: '600',
    },
    finalButtonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    heroImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderColor: '#928490',
        borderWidth: 2,
    },
});