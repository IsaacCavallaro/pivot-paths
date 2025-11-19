import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Animated, ScrollView } from 'react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { Briefcase, DollarSign, Clock, Home, GraduationCap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface BenefitOption {
    id: number;
    title: string;
    description: string;
    whatItIs: string;
    whyValuable: string;
    howToAsk: string;
    bestFor: string;
    icon: React.ReactNode;
}

const benefitOptions: BenefitOption[] = [
    {
        id: 1,
        title: "The Retirement Boost (401(k) Match)",
        description: "A powerful tool for long-term wealth building.",
        whatItIs: "Many companies will match your retirement contributions up to a certain percentage of your salary (e.g. your employer makes 50% of your contributions up to 6% of your salary.)",
        whyValuable: "This is free money that grows tax-free for decades. A higher match can be worth thousands more per year.",
        howToAsk: "\"Is there any flexibility with the 401(k) matching structure?\"",
        bestFor: "Dancers thinking about their long-term financial future.",
        icon: <DollarSign size={32} color="#928490" />
    },
    {
        id: 2,
        title: "The Flexibility Factor (Remote/Hybrid Work)",
        description: "Time is money, and flexibility is priceless.",
        whatItIs: "The ability to work from home (fully remote) or split time between home and the office (hybrid).",
        whyValuable: "Saves money and time on commuting, reduces stress, and allows for a better work-life balance. This can be a game-changer for auditioning or taking class.",
        howToAsk: "\"What is the policy on remote or hybrid work arrangements?\"",
        bestFor: "Dancers who value control over their time and schedule.",
        icon: <Home size={32} color="#928490" />
    },
    {
        id: 3,
        title: "The Value of Time (Paid Time Off - PTO)",
        description: "More time off means more time for your art, life, and rest.",
        whatItIs: "Additional paid vacation days, sick days, or personal days.",
        whyValuable: "It protects your income when you need to recharge, travel, or deal with unexpected life events. It directly improves your quality of life.",
        howToAsk: "\"Is there any flexibility with the number of paid vacation days?\"",
        bestFor: "Everyone. You can't pour from an empty cup.",
        icon: <Clock size={32} color="#928490" />
    },
    {
        id: 4,
        title: "Skill Building (Professional Development Fund)",
        description: "Investing in your future earning potential.",
        whatItIs: "A stipend or budget to use for courses, certifications, conferences, or workshops.",
        whyValuable: "It allows you to gain new, valuable skills for free, making you more marketable for your next role or promotion.",
        howToAsk: "\"Does the company offer a professional development stipend or cover costs for relevant certifications?\"",
        bestFor: "Dancers planning a long-term career pivot and wanting to build new skills.",
        icon: <GraduationCap size={32} color="#928490" />
    }
];

interface TheTotalPackageProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function TheTotalPackage({ onComplete, onBack }: TheTotalPackageProps) {
    const [currentBenefitIndex, setCurrentBenefitIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<number[]>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('financial-futureproofing');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartBenefits = () => {
        setScreenHistory([0]);
        scrollToTop();
    };

    const handleContinue = useCallback(() => {
        if (currentBenefitIndex < benefitOptions.length - 1) {
            // Fade out current content
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                const newBenefitIndex = currentBenefitIndex + 1;

                // Reset animation
                fadeAnim.setValue(0);

                // Update state
                setCurrentBenefitIndex(newBenefitIndex);

                // Animate in the next content
                setTimeout(() => {
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }).start();
                }, 50);

                setScreenHistory(prev => [...prev, newBenefitIndex]);
                scrollToTop();
            });
        } else {
            // Smooth transition to game plan screen
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setScreenHistory(prev => [...prev, -2]);
                fadeAnim.setValue(1);
                scrollToTop();
            });
        }
    }, [currentBenefitIndex, fadeAnim, scrollToTop]);

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
            setCurrentBenefitIndex(0);
            fadeAnim.setValue(1);
            cardScale.setValue(1);
            scrollToTop();
            return;
        }

        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        const prevScreen = newHistory[newHistory.length - 1];

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            if (prevScreen >= 0) {
                setCurrentBenefitIndex(prevScreen);
            }
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            scrollToTop();
        });
    };

    // NEW: Intro Screen with Journal
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
                                <Briefcase size={48} color="#928490" />
                            </View>

                            <Text style={commonStyles.introTitle}>The Total Package</Text>
                            <Text style={commonStyles.introDescription}>
                                Your salary is just one part of your compensation. The full package includes benefits that can be even more valuable than a slight pay raise.
                            </Text>

                            <Text style={styles.introSubtext}>
                                If an employer can't meet your salary request, you can often negotiate for other perks that provide financial security, flexibility, and peace of mind. Let's explore your options.
                            </Text>

                            <JournalEntrySection
                                pathTag="financial-futureproofing"
                                day="4"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Taming Your Debt"
                                journalInstruction="Before we explore benefits, let's check in with your current mindset about compensation. What are your thoughts on negotiating beyond just salary?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Explore Benefits" onPress={handleStartBenefits} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // NEW: Game Plan Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen === -2) {
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
                                <Text style={styles.gamePlanTitle}>Your Negotiation Game Plan</Text>

                                <View style={styles.stepsContainer}>
                                    <View style={styles.stepRow}>
                                        <View style={styles.stepNumber}>
                                            <Text style={styles.stepNumberText}>1</Text>
                                        </View>
                                        <Text style={styles.stepText}>
                                            <Text style={styles.stepBold}>Prioritize:</Text> If the salary isn't flexible, which one or two of these benefits would have the biggest impact on your life? Don't try to negotiate all of them!
                                        </Text>
                                    </View>

                                    <View style={styles.stepRow}>
                                        <View style={styles.stepNumber}>
                                            <Text style={styles.stepNumberText}>2</Text>
                                        </View>
                                        <Text style={styles.stepText}>
                                            <Text style={styles.stepBold}>Do Your Homework:</Text> Know the standard for the industry and role.
                                        </Text>
                                    </View>

                                    <View style={styles.stepRow}>
                                        <View style={styles.stepNumber}>
                                            <Text style={styles.stepNumberText}>3</Text>
                                        </View>
                                        <Text style={styles.stepText}>
                                            <Text style={styles.stepBold}>Frame it Collaboratively:</Text> Use phrases like, "I'm really excited about this role. If the salary is firm at $X, would you be open to discussing a more flexible work arrangement / additional week of PTO to help make it work?"
                                        </Text>
                                    </View>

                                    <View style={styles.stepRow}>
                                        <View style={styles.stepNumber}>
                                            <Text style={styles.stepNumberText}>4</Text>
                                        </View>
                                        <Text style={styles.stepText}>
                                            <Text style={styles.stepBold}>Get it in Writing:</Text> Any negotiated benefit must be documented in your official offer letter.
                                        </Text>
                                    </View>
                                </View>

                                <PrimaryButton
                                    title="Continue"
                                    onPress={() => {
                                        setScreenHistory(prev => [...prev, -1]);
                                        scrollToTop();
                                    }}
                                />
                            </Card>
                        </Animated.View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen with Journal
    if (currentScreen === -1) {
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
                                    <Briefcase size={48} color="#5A7D7B" />
                                </View>

                                <View style={commonStyles.finalHeader}>
                                    <Text style={commonStyles.finalHeading}>Complete</Text>
                                </View>

                                <View style={commonStyles.finalTextContainer}>
                                    <Text style={commonStyles.finalText}>
                                        Remember, negotiation is a conversation. You're not being demanding, you're being strategic. A good employer will respect you for it.
                                    </Text>
                                    <Text style={commonStyles.finalText}>
                                        These benefits build the foundation for a sustainable and fulfilling career.
                                    </Text>
                                </View>

                                <JournalEntrySection
                                    pathTag="financial-futureproofing"
                                    day="4"
                                    category="finance"
                                    pathTitle="Money Mindsets"
                                    dayTitle="Taming Your Debt"
                                    journalInstruction="Reflect on which benefits resonated most with you and why. How might you approach your next compensation discussion differently?"
                                    moodLabel=""
                                    saveButtonText="Save Entry"
                                />

                                <Text style={styles.finalClosing}>
                                    See you again tomorrow.
                                </Text>

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

    // Benefit Detail Screens
    const benefit = benefitOptions[currentBenefitIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentBenefitIndex + 1} of ${benefitOptions.length}`}
                progress={(currentBenefitIndex + 1) / benefitOptions.length}
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
                            <Text style={styles.benefitTitle}>{benefit.title}</Text>
                            <Text style={styles.benefitDescription}>{benefit.description}</Text>

                            <View style={styles.infoCard}>
                                <Text style={styles.infoLabel}>What it is:</Text>
                                <Text style={styles.infoText}>{benefit.whatItIs}</Text>

                                <Text style={styles.infoLabel}>Why it's valuable:</Text>
                                <Text style={styles.infoText}>{benefit.whyValuable}</Text>

                                <Text style={styles.infoLabel}>How to ask:</Text>
                                <Text style={styles.infoText}>{benefit.howToAsk}</Text>

                                <Text style={styles.infoLabel}>Best for:</Text>
                                <Text style={styles.infoText}>{benefit.bestFor}</Text>
                            </View>

                            <PrimaryButton
                                title={currentBenefitIndex < benefitOptions.length - 1 ? 'Next Benefit' : 'See Game Plan'}
                                onPress={handleContinue}
                            />
                        </Card>
                    </Animated.View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // Intro Screen Styles
    introSubtext: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },

    // Benefit Screen Styles
    benefitTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 10,
    },
    benefitDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 30,
    },
    infoCard: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 30,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
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

    // Game Plan Styles
    gamePlanTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    stepsContainer: {
        marginBottom: 30,
        width: '100%',
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    stepNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#5A7D7B',
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
    stepBold: {
        fontFamily: 'Montserrat-SemiBold',
    },

    // Final Screen Styles
    finalClosing: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
});