import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronRight, Target, ArrowLeft, Check } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useStorage } from '@/hooks/useStorage';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';

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
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [userChoices, setUserChoices] = useStorage<UserChoices>('MUST_HAVES_CHOICES', {});
    const [currentResultIndex, setCurrentResultIndex] = useState(0);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    const handleStartGame = () => {
        setCurrentScreen(0);
        scrollToTop();
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const goBack = () => {
        if (currentScreen === -1) {
            if (onBack) onBack();
        } else if (currentScreen === 0) {
            setCurrentScreen(-1);
        } else if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1 && currentScreen <= 6) {
            setCurrentScreen(currentScreen - 1);
        }
        scrollToTop();
    };

    const handleChoiceSelect = async (choiceNumber: number) => {
        const newChoices = { ...userChoices, [currentScreen + 1]: choiceNumber };
        await setUserChoices(newChoices);
        scrollToTop();
    };

    const handleContinue = () => {
        if (currentScreen === 8) {
            setCurrentScreen(9);
        } else if (currentScreen === 9) {
            setCurrentScreen(10);
        } else if (currentScreen === 10) {
            setCurrentScreen(11);
        } else if (currentScreen === 11) {
            onComplete();
        } else {
            setCurrentScreen(currentScreen + 1);
        }
        scrollToTop();
    };

    const handleNextResult = () => {
        if (currentResultIndex < getPersonalizedResults().length - 1) {
            setCurrentResultIndex(currentResultIndex + 1);
        } else {
            setCurrentScreen(11);
            setCurrentResultIndex(0);
        }
        scrollToTop();
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

    // Day 5 Welcome Screen
    if (currentScreen === -1) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={handleBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <Target size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={commonStyles.introTitle}>Meet Your Must-Haves</Text>

                            <Text style={commonStyles.introDescription}>
                                This is a game of instincts. We're going to uncover what you truly value by having you choose between common spending categories. Your choices will help us build a personalized snapshot of your financial priorities. Don't overthink it!
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                There's no right or wrong. Let's see what you build.
                            </Text>

                            <PrimaryButton title="Begin Choosing" onPress={handleStartGame} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Choice Screens (0-8)
    if (currentScreen >= 0 && currentScreen <= 8) {
        const currentPair = choicePairs[currentScreen];
        const choiceProgress = ((currentScreen + 1) / choicePairs.length) * 100;

        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={styles.progressContainer}>
                                <Text style={styles.progressText}>
                                    {currentScreen + 1} of {choicePairs.length} choices
                                </Text>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: `${choiceProgress}%` }]} />
                                </View>
                            </View>

                            <Text style={styles.choiceTitle}>Which would you choose?</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        userChoices[currentScreen + 1] === 1 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(1)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {userChoices[currentScreen + 1] === 1 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            userChoices[currentScreen + 1] === 1 && styles.choiceTextSelected
                                        ]}>
                                            {currentPair.option1}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        userChoices[currentScreen + 1] === 2 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(2)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {userChoices[currentScreen + 1] === 2 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            userChoices[currentScreen + 1] === 2 && styles.choiceTextSelected
                                        ]}>
                                            {currentPair.option2}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinue}
                                disabled={!userChoices[currentScreen + 1]}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Results Overview Screen
    if (currentScreen === 9) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={styles.overviewIconContainer}>
                                <View style={[styles.overviewIconGradient, { backgroundColor: '#928490' }]}>
                                    <Target size={40} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.overviewTitle}>Explore Your Spending Values</Text>

                            <PrimaryButton title="See Your Results" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Results Screens
    if (currentScreen === 10) {
        const personalizedResults = getPersonalizedResults();

        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <Text style={styles.resultTitle}>Here's what your choices reveal</Text>

                            <Text style={styles.resultText}>{personalizedResults[currentResultIndex]}</Text>

                            <PrimaryButton
                                title={currentResultIndex < personalizedResults.length - 1 ? 'Continue' : 'See Summary'}
                                onPress={handleNextResult}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Summary Screen with Journal
    if (currentScreen === 11) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
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

                            <JournalEntrySection
                                pathTag="budgeting-for-dancers"
                                day="5"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Meet Your Must Haves"
                                journalInstruction="How do your spending choices reflect your core values? What surprised you about your must-haves?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <View style={styles.journalCallout}>
                                <Text style={styles.journalCalloutTitle}>Your Personal Space</Text>
                                <Text style={styles.journalCalloutText}>
                                    Remember, feel free to use the journal tab at any time to jot down your thoughts. This app is for you! Use it how you'd like to!
                                </Text>
                            </View>

                            <PrimaryButton title="Mark As Complete" onPress={onComplete} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    // Progress Styles
    progressContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    progressText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#928490',
        marginBottom: 10,
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(146, 132, 144, 0.3)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#928490',
        borderRadius: 3,
    },
    // Choice Screen Styles
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
        marginBottom: 24,
    },
    choiceButton: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    choiceButtonSelected: {
        backgroundColor: 'rgba(146, 132, 144, 0.3)',
        borderColor: '#928490',
        borderWidth: 2,
    },
    choiceContent: {
        padding: 24,
        paddingRight: 50,
        minHeight: 120,
        justifyContent: 'center',
    },
    choiceText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 22,
    },
    choiceTextSelected: {
        color: '#4E4F50',
        fontWeight: '600',
    },
    selectedIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#928490',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Intro Screen Styles
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
        elevation: 5,
    },
    // Overview Screen Styles
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
        elevation: 5,
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
        elevation: 5,
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
    // Journal Callout
    journalCallout: {
        width: '100%',
        backgroundColor: 'rgba(100, 124, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(100, 124, 144, 0.2)',
    },
    journalCalloutTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '600',
    },
    journalCalloutText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 22,
    },
});