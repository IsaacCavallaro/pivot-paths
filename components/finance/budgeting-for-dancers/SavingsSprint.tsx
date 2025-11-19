import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, PiggyBank, ArrowLeft, ChevronLeft, Target, Trash2 } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface ChallengeOption {
    id: number;
    title: string;
    description: string;
    goal: string;
    target: string;
    result: string;
    bestFor: string;
    steps: string[];
    proTip: string;
    icon: React.ReactNode;
}

const challengeOptions: ChallengeOption[] = [
    {
        id: 1,
        title: "The Spare Change Round-Up",
        description: "A micro-habit challenge that builds consistency.",
        goal: "Save a small amount of money every single day for 30 days.",
        target: "$1 - $5 per day.",
        result: "$30 to $150 in one month.",
        bestFor: "Anyone. It proves that saving is a daily habit, not a grand gesture.",
        steps: [
            "Get a jar or create a separate account in your banking app.",
            "Each night, add $1-$5 to the pot.",
            "Don't overthink it. The amount doesn't matter as much as the action.",
            "Watch it grow. The daily act builds momentum and makes saving automatic."
        ],
        proTip: "Set a daily phone reminder for 9 PM that says 'Save $3 Today.'",
        icon: <PiggyBank size={32} color="#928490" />
    },
    {
        id: 2,
        title: "The No-Brainer",
        description: "A one-and-done challenge that practices 'paying yourself first.'",
        goal: "Immediately move 10% to savings from your next paycheck.",
        target: "Paying yourself first",
        result: "Savings secured instantly",
        bestFor: "Dancers who want a quick win and ready to master an important rule of saving.",
        steps: [
            "Know your next pay date. Is it this Friday? Next Wednesday?",
            "Set an alert on your phone for that morning: 'TRANSFER 10% TO SAVINGS.'",
            "Do it immediately. Before you pay bills, before you buy groceries. Pay yourself first.",
            "Forget it exists. Let it sit in your savings account. You've already won the challenge."
        ],
        proTip: "If 10% feels like too much, start with just $50. The principle is what counts.",
        icon: <Target size={32} color="#928490" />
    },
    {
        id: 3,
        title: "The 30-Day Declutter",
        description: "A bonus challenge that turns clutter into cash.",
        goal: "Sell one item each week for a month.",
        target: "4 items in 30 days.",
        result: "An easy $50 to $200+ from stuff you don't use.",
        bestFor: "Dancers who have stuff to sell and likes the idea of 'free money.' It's girl math!",
        steps: [
            "Week 1: Find 1-2 items (old dance shoes, costumes, unused electronics, books).",
            "Week 2: Take good photos and list them on Facebook Marketplace or Poshmark.",
            "Week 3: As things sell, immediately transfer the money to your savings account.",
            "Week 4: Repeat! Find more items, list them, and watch your savings grow."
        ],
        proTip: "Price items to sell. The goal is fast cash, not maximum value.",
        icon: <Trash2 size={32} color="#928490" />
    }
];

interface SavingsSprintProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function SavingsSprint({ onComplete, onBack }: SavingsSprintProps) {
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
    const [screenHistory, setScreenHistory] = useState<Array<{ challengeIndex: number, showDetail: boolean }>>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('budgeting-for-dancers');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartChallengeWalkthrough = () => {
        setScreenHistory([{ challengeIndex: 0, showDetail: false }]);
        scrollToTop();
    };

    const handleContinueToChallenges = () => {
        setScreenHistory([{ challengeIndex: -3, showDetail: false }]);
        scrollToTop();
    };

    const handleContinue = useCallback(() => {
        if (currentChallengeIndex < challengeOptions.length - 1) {
            // Fade out current content
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                const newChallengeIndex = currentChallengeIndex + 1;

                // Reset animations BEFORE updating state
                fadeAnim.setValue(0);

                // Update state
                setCurrentChallengeIndex(newChallengeIndex);

                // Animate in the next content with a slight delay
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.spring(progressAnim, {
                            toValue: (newChallengeIndex + 1) / challengeOptions.length,
                            tension: 50,
                            friction: 7,
                            useNativeDriver: false,
                        })
                    ]).start();
                }, 50);

                setScreenHistory(prev => [...prev, { challengeIndex: newChallengeIndex, showDetail: false }]);
                scrollToTop();
            });
        } else {
            // Smooth transition to choose screen
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setScreenHistory(prev => [...prev, { challengeIndex: -2, showDetail: false }]);
                fadeAnim.setValue(1);
                scrollToTop();
            });
        }
    }, [currentChallengeIndex, fadeAnim, progressAnim, scrollToTop]);

    const handleSelectChallenge = (id: number) => {
        setSelectedChallenge(id);
        // Smooth transition to mission screen
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            setScreenHistory(prev => [...prev, { challengeIndex: -1, showDetail: false }]);
            fadeAnim.setValue(1);
            scrollToTop();
        });
    };

    const handleComplete = () => {
        // Add a subtle scale animation on complete
        Animated.sequence([
            Animated.timing(cardScale, {
                toValue: 1.02,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(cardScale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => {
            onComplete();
        });
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            setScreenHistory([]);
            setCurrentChallengeIndex(0);
            setSelectedChallenge(null);
            fadeAnim.setValue(1);
            cardScale.setValue(1);
            scrollToTop();
            return;
        }

        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        const prevScreen = newHistory[newHistory.length - 1];
        if (prevScreen.challengeIndex === -1 || prevScreen.challengeIndex === -2 || prevScreen.challengeIndex === -3) {
            return;
        }

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setCurrentChallengeIndex(prevScreen.challengeIndex);
            setSelectedChallenge(null);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            scrollToTop();
        });
    };

    // Progress animation interpolation
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // Update progress when currentChallengeIndex changes
    React.useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: (currentChallengeIndex + 1) / challengeOptions.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentChallengeIndex]);

    // Intro Screen with Journal
    if (screenHistory.length === 0) {
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
                                <PiggyBank size={48} color="#928490" />
                            </View>

                            <Text style={commonStyles.introTitle}>The 30-Day Savings Sprint</Text>
                            <Text style={commonStyles.introDescription}>
                                Think you can't save? Think again. This isn't about huge sacrifices, it's about small, consistent actions that prove you are in control of your money.
                            </Text>

                            <JournalEntrySection
                                pathTag="budgeting-for-dancers"
                                day="2"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Know Your Value"
                                journalInstruction="Before we begin, let's check in with your current relationship with saving. What comes to mind when you think about saving money?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Let's begin" onPress={handleContinueToChallenges} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Savings Sprint Intro Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.challengeIndex === -3) {
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
                            <View style={commonStyles.introIconContainer}>
                                <PiggyBank size={48} color="#928490" />
                            </View>

                            <Text style={styles.introTitle}>Your Savings Journey</Text>
                            <Text style={styles.introDescription}>
                                Let's walk through three simple challenges. Your only job is to pick one and start. Remember, this isn't about huge amounts - it's about building the habit.
                            </Text>

                            <PrimaryButton title="Start Exploring Challenges" onPress={handleStartChallengeWalkthrough} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Choose Challenge Screen
    if (currentScreen.challengeIndex === -2) {
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
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: cardScale }] }}>
                            <Card style={commonStyles.baseCard}>
                                <Text style={styles.chooseTitle}>Choose Your Saving Style</Text>
                                <Text style={styles.chooseDescription}>
                                    Reflect for a moment. Which challenge felt the most doable?
                                </Text>

                                {challengeOptions.map((challenge) => (
                                    <TouchableOpacity
                                        key={challenge.id}
                                        style={[
                                            styles.challengeOption,
                                            selectedChallenge === challenge.id && styles.challengeOptionSelected
                                        ]}
                                        onPress={() => setSelectedChallenge(challenge.id)}
                                    >
                                        <View style={styles.challengeOptionIcon}>
                                            {challenge.icon}
                                        </View>
                                        <View style={styles.challengeOptionText}>
                                            <Text style={styles.challengeOptionTitle}>
                                                {challenge.id === 1 && "The Daily Habit (Spare Change)"}
                                                {challenge.id === 2 && "The One-Time Win (10% Transfer)"}
                                                {challenge.id === 3 && "The Bonus Round (Declutter)"}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}

                                <Text style={styles.chooseFooter}>
                                    There is no wrong answer. The best challenge is the one you'll actually do.
                                </Text>

                                <PrimaryButton
                                    title="Confirm Selection"
                                    onPress={() => selectedChallenge && handleSelectChallenge(selectedChallenge)}
                                    disabled={!selectedChallenge}
                                />
                            </Card>
                        </Animated.View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Mission Screen with Journal
    if (currentScreen.challengeIndex === -1) {
        const selectedChallengeData = challengeOptions.find(c => c.id === selectedChallenge);

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
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: cardScale }] }}>
                            <Card style={commonStyles.baseCard}>
                                <View style={commonStyles.introIconContainer}>
                                    <PiggyBank size={48} color="#647C90" />
                                </View>

                                <View style={commonStyles.finalHeader}>
                                    <Text style={commonStyles.finalHeading}>Your Mission</Text>
                                </View>

                                <View style={commonStyles.finalTextContainer}>
                                    <Text style={commonStyles.finalText}>
                                        You've chosen your challenge! Now it's time to put it into action. Remember, the goal isn't perfection - it's progress.
                                    </Text>
                                </View>

                                <View style={styles.missionSteps}>
                                    <Text style={styles.missionStep}>1. Pick one challenge to commit to for the next 30 days.</Text>
                                    <Text style={styles.missionStep}>2. Schedule it. Put the actionable step in your calendar or set those reminders.</Text>
                                    <Text style={styles.missionStep}>3. Name your savings goal. What is this pot of money for? Emergency Fund, Pivot Savings, Breathing Room</Text>
                                </View>

                                <Text style={styles.missionEncouragement}>
                                    You are building proof that you can do this.
                                </Text>

                                <JournalEntrySection
                                    pathTag="budgeting-for-dancers"
                                    day="2"
                                    category="finance"
                                    pathTitle="Money Mindsets"
                                    dayTitle="Know Your Value"
                                    journalInstruction="What excites you most about starting this savings challenge? What feels challenging?"
                                    moodLabel=""
                                    saveButtonText="Save Entry"
                                />

                                <View style={commonStyles.finalButtonContainer}>
                                    <PrimaryButton
                                        title="Mark As Complete"
                                        onPress={handleComplete}
                                    />
                                </View>
                            </Card>
                        </Animated.View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Challenge Detail Screens
    const currentChallenge = challengeOptions[currentChallengeIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentChallengeIndex + 1} of ${challengeOptions.length}`}
                progress={(currentChallengeIndex + 1) / challengeOptions.length}
            />

            <ScrollView
                ref={scrollViewRef}
                style={commonStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                onContentSizeChange={() => scrollToTop()}
                onLayout={() => scrollToTop()}
            >
                <View style={commonStyles.centeredContent}>
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: cardScale }] }}>
                        <Card style={commonStyles.baseCard}>
                            <Text style={styles.challengeTitle}>{currentChallenge.title}</Text>
                            <Text style={styles.challengeDescription}>{currentChallenge.description}</Text>

                            <View style={styles.infoCard}>
                                <Text style={styles.infoLabel}>The Goal:</Text>
                                <Text style={styles.infoText}>{currentChallenge.goal}</Text>

                                <Text style={styles.infoLabel}>The Target:</Text>
                                <Text style={styles.infoText}>{currentChallenge.target}</Text>

                                <Text style={styles.infoLabel}>The Result:</Text>
                                <Text style={styles.infoText}>{currentChallenge.result}</Text>

                                <Text style={styles.infoLabel}>Best for:</Text>
                                <Text style={styles.infoText}>{currentChallenge.bestFor}</Text>
                            </View>

                            <Text style={styles.sectionTitle}>How to Do It</Text>

                            <View style={styles.stepsContainer}>
                                {currentChallenge.steps.map((step, index) => (
                                    <View key={index} style={styles.stepRow}>
                                        <View style={styles.stepNumber}>
                                            <Text style={styles.stepNumberText}>{index + 1}</Text>
                                        </View>
                                        <Text style={styles.stepText}>{step}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.proTipContainer}>
                                <Text style={styles.proTipText}>Pro Tip: {currentChallenge.proTip}</Text>
                            </View>

                            <PrimaryButton
                                title={currentChallengeIndex < challengeOptions.length - 1 ? 'Next Challenge' : 'Choose Your Challenge'}
                                onPress={handleContinue}
                            />
                        </Card>
                    </Animated.View>
                </View>
            </ScrollView>
        </View>
    );
}

// Add TouchableOpacity to the styles since it's used in the component
const TouchableOpacity = require('react-native').TouchableOpacity;

const styles = StyleSheet.create({
    // Intro Screen Styles
    introTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 34,
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },

    // Challenge Detail Styles
    challengeTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 10,
    },
    challengeDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 30,
    },
    infoCard: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
        width: '100%',
    },
    infoLabel: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#4E4F50',
        marginBottom: 5,
    },
    infoText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#746C70',
        marginBottom: 15,
        lineHeight: 22,
    },
    sectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 22,
        color: '#4E4F50',
        marginBottom: 15,
        alignSelf: 'flex-start',
    },
    stepsContainer: {
        marginBottom: 20,
        width: '100%',
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    stepNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#928490',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        marginTop: 2,
    },
    stepNumberText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: '#E2DED0',
    },
    stepText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#4E4F50',
        flex: 1,
        lineHeight: 22,
    },
    proTipContainer: {
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 30,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
    },
    proTipText: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 15,
        color: '#4E4F50',
        lineHeight: 22,
    },

    // Choose Screen Styles
    chooseTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 10,
    },
    chooseDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 30,
    },
    challengeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
        width: '100%',
    },
    challengeOptionSelected: {
        backgroundColor: 'rgba(90, 125, 123, 0.2)',
        borderWidth: 2,
        borderColor: '#928490',
    },
    challengeOptionIcon: {
        marginRight: 15,
    },
    challengeOptionText: {
        flex: 1,
    },
    challengeOptionTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#4E4F50',
    },
    chooseFooter: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 15,
        color: '#746C70',
        textAlign: 'center',
        marginVertical: 20,
    },

    // Mission Screen Styles
    missionSteps: {
        marginBottom: 30,
        width: '100%',
    },
    missionStep: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        marginBottom: 15,
        lineHeight: 24,
    },
    missionEncouragement: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 40,
    },
});