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
                {onBack && (
                    <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                        <ArrowLeft size={28} color="#647C90" />
                    </TouchableOpacity>
                )}
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <Target size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Meet Your Must-Haves</Text>

                    <Text style={styles.introDescription}>
                        This is a game of instincts. We're going to uncover what you truly value by having you choose between common spending categories. Your choices will help us build a personalized snapshot of your financial priorities. Don't overthink it!
                        {"\n\n"}
                        There's no right or wrong. Let's see what you build.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Begin Choosing</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Results Overview Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.pairIndex === -1) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.overviewContainer}>
                    <View style={styles.overviewIcon}>
                        <Target size={40} color="#928490" />
                    </View>
                    <Text style={styles.introTitle}>Explore Your Spending Values</Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <LinearGradient
                            colors={['#928490', '#746C70']}
                            style={styles.continueButtonGradient}
                        >
                            <Text style={styles.continueButtonText}>See Your Results</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={20} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
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
                    <ScrollView style={styles.content} contentContainerStyle={styles.resultContainer}>
                        <Text style={styles.resultText}>{personalizedResults[currentResultIndex]}</Text>

                        <TouchableOpacity style={styles.continueButton} onPress={handleNextResult}>
                            <LinearGradient
                                colors={['#5A7D7B', '#647C90']}
                                style={styles.continueButtonGradient}
                            >
                                <Text style={styles.continueButtonText}>
                                    {currentResultIndex < personalizedResults.length - 1 ? 'Continue' : 'See Summary'}
                                </Text>
                                <ChevronRight size={16} color="#E2DED0" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <ChevronLeft size={20} color="#647C90" />
                        <Text style={styles.backButtonText}>Previous</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    // Final Summary Screen
    if (screenHistory[screenHistory.length - 1].pairIndex === -3) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
                    <View style={styles.finalIcon}>
                        <Target size={40} color="#928490" />
                    </View>
                    <Text style={styles.introTitle}>Your Budget Shows Your Values</Text>

                    <Text style={styles.finalText}>
                        How does this financial portrait feel? Use this as a starting point to craft a budget that truly reflects your values. A budget that fuels what you love and cuts what you don't.
                        {"\n\n"}
                        The goal isn't restriction, it's alignment.
                        {"\n\n"}
                        Let's keep going tomorrow.
                    </Text>

                    <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                        <View
                            style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.completeButtonText}>Mark As Complete</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={20} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Choice Screens
    const currentPair = choicePairs[currentPairIndex];
    const choiceProgress = ((currentPairIndex + 1) / choicePairs.length) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {currentPairIndex + 1} of {choicePairs.length} choices
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${choiceProgress}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.choiceContainer}>
                <Text style={styles.choicePrompt}>Which would you choose?</Text>

                <View style={styles.choicesRow}>
                    <TouchableOpacity
                        style={styles.choiceButton}
                        onPress={() => handleChoiceSelect(1)}
                    >
                        <Text style={styles.choiceText}>{currentPair.option1}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.choiceButton}
                        onPress={() => handleChoiceSelect(2)}
                    >
                        <Text style={styles.choiceText}>{currentPair.option2}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <ChevronLeft size={24} color="#647C90" />
                <Text style={styles.backButtonText}>
                    {screenHistory.length <= 1 ? 'Back to Intro' : 'Previous'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0',
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
    choiceContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    choicePrompt: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 40,
    },
    choicesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    choiceButton: {
        flex: 1,
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    choiceText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
    },
    overviewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    overviewIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    resultContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    resultText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 40,
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
    finalText: {
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
    topBackButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        zIndex: 1,
        padding: 8,
    },
});