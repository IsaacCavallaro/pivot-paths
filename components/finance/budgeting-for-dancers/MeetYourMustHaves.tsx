import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Target, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface ChoicePair {
    id: number;
    option1: string;
    option2: string;
}

interface UserChoices {
    [key: number]: number; // Stores which option was chosen for each pair (1 or 2)
}

const choicePairs: ChoicePair[] = [
    { id: 1, option1: "Spotify Premium", option2: "Gym membership" },
    { id: 2, option1: "Daily coffee", option2: "Streaming subscriptions" },
    { id: 3, option1: "Organic groceries", option2: "Dining out" },
    { id: 4, option1: "Dance classes", option2: "Massage appointments" },
    { id: 5, option1: "New clothes", option2: "Travel fund" },
    { id: 6, option1: "Savings", option2: "Investments" },
    { id: 7, option1: "Phone upgrade", option2: "Concert tickets" },
    { id: 8, option1: "Charity donations", option2: "Gifts for friends and family" },
    { id: 9, option1: "Hair or nail appointments", option2: "Home decor" }
];

interface MeetYourMustHavesProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function MeetYourMustHaves({ onComplete, onBack }: MeetYourMustHavesProps) {
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [userChoices, setUserChoices] = useState<UserChoices>({});
    const [screenHistory, setScreenHistory] = useState<Array<{ pairIndex: number, showResults: boolean }>>([]);
    const [currentResultIndex, setCurrentResultIndex] = useState(0); // Moved to top level

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartGame = () => {
        setScreenHistory([{ pairIndex: 0, showResults: false }]);
        setCurrentResultIndex(0); // Reset result index
    };

    const handleChoiceSelect = (choiceNumber: number) => {
        const newChoices = { ...userChoices, [currentPairIndex + 1]: choiceNumber };
        setUserChoices(newChoices);

        if (currentPairIndex < choicePairs.length - 1) {
            // Move to next pair
            const newPairIndex = currentPairIndex + 1;
            setCurrentPairIndex(newPairIndex);
            setScreenHistory([...screenHistory, { pairIndex: newPairIndex, showResults: false }]);
        } else {
            // All pairs completed, go to results
            setScreenHistory([...screenHistory, { pairIndex: -1, showResults: false }]);
        }
    };

    const handleContinue = () => {
        setScreenHistory([...screenHistory, { pairIndex: -2, showResults: true }]);
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            // If we're at the first screen, go back to intro
            setScreenHistory([]);
            setCurrentPairIndex(0);
            setCurrentResultIndex(0); // Reset result index
            return;
        }

        // Remove current screen from history
        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        // Get previous screen state
        const prevScreen = newHistory[newHistory.length - 1];

        if (prevScreen.pairIndex >= 0) {
            setCurrentPairIndex(prevScreen.pairIndex);
        }

        // Reset result index when going back from results screens
        if (prevScreen.pairIndex !== -2) {
            setCurrentResultIndex(0);
        }
    };

    // Generate personalized results based on user choices
    const getPersonalizedResults = () => {
        const results = [];

        // Screen 12: Spotify vs Gym
        if (userChoices[1] === 1) {
            results.push("Spotify Premium is non-negotiable for you, allowing you to stream with no ads.");
        } else {
            results.push("staying fit and healthy with a gym membership is essential for you.");
        }

        // Screen 13: Coffee vs Streaming
        if (userChoices[2] === 1) {
            results.push("Your daily joy comes from small treats like your coffee habit, a ritual you protect.");
        } else {
            results.push("You value entertainment and relaxation, choosing a full suite of streaming subscriptions over daily coffees. You'd rather create a cozy night in than a cafe trip.");
        }

        // Screen 14: Groceries vs Dining & Dance vs Massage
        const foodChoice = userChoices[3] === 1 ? "cooking at home with your organic groceries" : "dining out at quality restaurants";
        const wellnessChoice = userChoices[4] === 1 ? "dance classes" : "massages";
        results.push(`You love ${foodChoice}. And you invest in your body through regular ${wellnessChoice}, knowing it's essential for your well-being.`);

        // Screen 15: Clothes vs Travel
        if (userChoices[5] === 1) {
            results.push("You believe in looking the part and presenting yourself well, investing in new clothes over a distant travel fund.");
        } else {
            results.push("You clearly value experiences, choosing to put money toward your travel fund over updating your wardrobe.");
        }

        // Screen 16: Savings vs Investments & Charity vs Gifts
        const financeChoice = userChoices[6] === 1 ? "consistently contributing to your savings account" : "putting money into investments for potential future gains";
        const givingChoice = userChoices[8] === 1 ? "charity donations" : "thoughtful gifts";
        results.push(`You're building a foundation for the future, ${financeChoice}. You also believe in supporting your community and loved ones, setting aside money for ${givingChoice}.`);

        // Screen 17: Phone vs Concerts & Beauty vs Home
        const splurgeChoice = userChoices[7] === 1 ? "a phone upgrade" : "concert tickets";
        const selfCareChoice = userChoices[9] === 1 ? "hair and nail appointments" : "home decor";
        results.push(`And you haven't forgotten how to live in the moment. You splurge on ${splurgeChoice} and treat yourself to ${selfCareChoice} to create a space that feels like you.`);

        return results;
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
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Meet Your Must-Haves</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <Target size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>Meet Your Must-Haves</Text>

                            <Text style={styles.introDescription}>
                                This is a game of instincts. We're going to uncover what you truly value by having you choose between common spending categories. Your choices will help us build a personalized snapshot of your financial priorities. Don't overthink it!
                                {"\n\n"}
                                There's no right or wrong. Let's see what you build.
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleStartGame}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Begin Choosing</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Results Overview Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.pairIndex === -1) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Explore Your Spending Values</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.overviewCard}>
                            <View style={styles.overviewIconContainer}>
                                <View style={[styles.overviewIconGradient, { backgroundColor: '#928490' }]}>
                                    <Target size={40} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.overviewTitle}>Explore Your Spending Values</Text>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.continueButtonText}>See Your Results</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Results Screens
    if (currentScreen.pairIndex === -2) {
        const personalizedResults = getPersonalizedResults();

        const handleNextResult = () => {
            if (currentResultIndex < personalizedResults.length - 1) {
                setCurrentResultIndex(currentResultIndex + 1);
            } else {
                // All results shown, go to final screen
                setScreenHistory([...screenHistory, { pairIndex: -3, showResults: true }]);
                // Reset the result index for potential future use
                setCurrentResultIndex(0);
            }
        };

        if (currentResultIndex < personalizedResults.length) {
            return (
                <View style={styles.container}>
                    {/* Sticky Header */}
                    <View style={[styles.stickyHeader, { backgroundColor: '#5A7D7B' }]}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity style={styles.backButton} onPress={goBack}>
                                <ArrowLeft size={28} color="#E2DED0" />
                            </TouchableOpacity>
                            <View style={styles.headerTitleContainer}>
                                <Text style={styles.titleText}>Your Results</Text>
                            </View>
                            <View style={styles.backButton} />
                        </View>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.content}>
                            <View style={styles.resultCard}>
                                <Text style={styles.resultTitle}>Here's what your choices reveal</Text>

                                <Text style={styles.resultText}>{personalizedResults[currentResultIndex]}</Text>

                                <TouchableOpacity
                                    style={styles.continueButton}
                                    onPress={handleNextResult}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.continueButtonContent, { backgroundColor: '#5A7D7B' }]}>
                                        <Text style={styles.continueButtonText}>
                                            {currentResultIndex < personalizedResults.length - 1 ? 'Continue' : 'See Summary'}
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
    }

    // Final Summary Screen
    if (screenHistory[screenHistory.length - 1].pairIndex === -3) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Your Values</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.finalCard}>
                            <View style={styles.finalIconContainer}>
                                <View style={[styles.finalIconGradient, { backgroundColor: '#928490' }]}>
                                    <Target size={40} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.finalTitle}>Your Budget Shows Your Values</Text>

                            <Text style={styles.finalText}>
                                How does this financial portrait feel? Use this as a starting point to craft a budget that truly reflects your values. A budget that fuels what you love and cuts what you don't.
                                {"\n\n"}
                                The goal isn't restriction, it's alignment.
                                {"\n\n"}
                                Let's keep going tomorrow.
                            </Text>

                            <TouchableOpacity
                                style={styles.completeButton}
                                onPress={handleComplete}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.completeButtonText}>Mark As Complete</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Choice Screens
    const currentPair = choicePairs[currentPairIndex];
    const choiceProgress = ((currentPairIndex + 1) / choicePairs.length) * 100;

    return (
        <View style={styles.container}>
            {/* Sticky Header */}
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <ArrowLeft size={28} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.titleText}>Make Your Choice</Text>
                    </View>
                    <View style={styles.backButton} />
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {currentPairIndex + 1} of {choicePairs.length} choices
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${choiceProgress}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.choiceCard}>
                        <Text style={styles.choiceTitle}>Which would you choose?</Text>

                        <View style={styles.choicesContainer}>
                            <TouchableOpacity
                                style={styles.choiceButton}
                                onPress={() => handleChoiceSelect(1)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.choiceText}>{currentPair.option1}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.choiceButton}
                                onPress={() => handleChoiceSelect(2)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.choiceText}>{currentPair.option2}</Text>
                            </TouchableOpacity>
                        </View>
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
        marginTop: 140,
    },
    content: {
        paddingBottom: 30,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
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
    progressContainer: {
        alignItems: 'center',
    },
    progressText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#E2DED0',
        marginBottom: 10,
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(226, 222, 208, 0.3)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#E2DED0',
        borderRadius: 3,
    },
    // Intro Screen Styles
    introCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
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
        fontSize: 28,
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
    // Choice Screen Styles
    choiceCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    choiceTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: '700',
    },
    choicesContainer: {
        gap: 16,
    },
    choiceButton: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        borderWidth: 2,
        borderColor: 'transparent',
        minHeight: 120,
        justifyContent: 'center',
    },
    choiceText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 22,
    },
    // Overview Screen Styles
    overviewCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    overviewIconContainer: {
        marginBottom: 24,
    },
    overviewIconGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    overviewTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '700',
    },
    // Result Screen Styles
    resultCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    resultTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    resultText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 32,
    },
    // Final Screen Styles
    finalCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    finalIconContainer: {
        marginBottom: 24,
    },
    finalIconGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    finalTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    finalText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    // Common Button Styles
    continueButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    continueButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E2DED0',
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
    completeButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    completeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E2DED0',
    },
    completeButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
});