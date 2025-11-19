import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Linking, Animated, ScrollView } from 'react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface TipCard {
    id: number;
    title: string;
    whyItMatters: string;
    reflectionQuestion: string;
    tinyAction: string;
}

const tipCards: TipCard[] = [
    {
        id: 1,
        title: "Name the Pressure",
        whyItMatters: "Stress narrows your thinking. Naming the money pressures gives you power over them.",
        reflectionQuestion: "What three money worries show up most often?",
        tinyAction: "Spend 10 minutes listing those three items in your phone notes."
    },
    {
        id: 2,
        title: "Start a Cushion",
        whyItMatters: "Even a small cushion buys time to make better choices.",
        reflectionQuestion: "How much calmer would you feel if your bills were covered for the next week? What about the next month?",
        tinyAction: "Set a simple savings target: one week's living costs. If you can't do the full amount, set aside one small recurring transfer."
    },
    {
        id: 3,
        title: "Pay Yourself First",
        whyItMatters: "Treat savings like a non-negotiable. It builds discipline.",
        reflectionQuestion: "What amount feels doable to move automatically from each paycheck?",
        tinyAction: "Set up an automatic transfer (even $10) to a 'headroom' savings account."
    },
    {
        id: 4,
        title: "Declutter Your Money Life",
        whyItMatters: "Multiple accounts and subscriptions create cognitive noise. Fewer moving parts = clearer thinking.",
        reflectionQuestion: "Which subscription or recurring payment drains your headspace?",
        tinyAction: "Spend 15 minutes to list subscriptions and cancel at least one you haven't used this week."
    },
    {
        id: 5,
        title: "Budget for Time Off",
        whyItMatters: "Knowing you can afford a break removes the 'always-on' anxiety dancers know well.",
        reflectionQuestion: "What small trip or weekend would recharge you? How much would it cost?",
        tinyAction: "Create a 'Time Off' savings bucket and schedule an automatic weekly or monthly transfer (start tiny)."
    },
    {
        id: 6,
        title: "Practice One Negotiation Line",
        whyItMatters: "Negotiation creates more headroom faster than tiny savings alone. You already advocate for yourself in rehearsal… this is another form of that skill.",
        reflectionQuestion: "What's a job you could ask for more pay on this month?",
        tinyAction: "Copy this and adapt: 'I'm excited about this role! Based on the responsibilities, I was expecting $X. Is there flexibility on the rate?' Say it out loud and consider how it makes you feel."
    },
    {
        id: 7,
        title: "Build a Small 'Support & Generosity' Fund",
        whyItMatters: "Generosity feels better when it doesn't come from scarcity. What would it be like to give freely without stress.",
        reflectionQuestion: "Who would you most like to help if money wasn't the barrier?",
        tinyAction: "Start making a list of the people you'd be thrilled to help support and keep this in mind whenever you try to back out of going for more."
    },
    {
        id: 8,
        title: "A Weekly 15-Minute Money Check",
        whyItMatters: "Regular micro-checkins keep anxiety from accumulating into overwhelm. It's rehearsal for financial calm.",
        reflectionQuestion: "Which day feels easiest this week to do a 15-minute check-in?",
        tinyAction: "Block 15 minutes on that day now. Use these prompts: What's my balance? One quick win? One small next step?"
    }
];

interface MoreMoneyMoreHeadroomProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function MoreMoneyMoreHeadroom({ onComplete, onBack }: MoreMoneyMoreHeadroomProps) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ cardIndex: number }>>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('money-mindsets');
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('money-mindsets');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStart = () => {
        setScreenHistory([{ cardIndex: 0 }]);
        scrollToTop();
    };

    const handleContinue = useCallback(() => {
        if (currentCardIndex < tipCards.length - 1) {
            // Fade out current card
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                const newCardIndex = currentCardIndex + 1;

                // Reset animations BEFORE updating state
                fadeAnim.setValue(0);

                // Update state
                setCurrentCardIndex(newCardIndex);

                // Animate in the next card with a slight delay
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.spring(progressAnim, {
                            toValue: (newCardIndex + 1) / tipCards.length,
                            tension: 50,
                            friction: 7,
                            useNativeDriver: false,
                        })
                    ]).start();
                }, 50);

                setScreenHistory(prev => [...prev, { cardIndex: newCardIndex }]);
                scrollToTop();
            });
        } else {
            // Smooth transition to reflection screen
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setScreenHistory(prev => [...prev, { cardIndex: -2 }]);
                fadeAnim.setValue(1);
                scrollToTop();
            });
        }
    }, [currentCardIndex, fadeAnim, progressAnim, scrollToTop]);

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
            setCurrentCardIndex(0);
            fadeAnim.setValue(1);
            cardScale.setValue(1);
            scrollToTop();
            return;
        }

        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        const prevScreen = newHistory[newHistory.length - 1];
        if (prevScreen.cardIndex === -1 || prevScreen.cardIndex === -2) {
            return;
        }

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setCurrentCardIndex(prevScreen.cardIndex);
            // Reset animations based on current state
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            scrollToTop();
        });
    };

    const handleOpenEbook = () => {
        Linking.openURL('https://pivotfordancers.com/products/how-to-pivot/');
    };

    // Progress animation interpolation
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // Update progress when currentCardIndex changes
    React.useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: (currentCardIndex + 1) / tipCards.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentCardIndex]);

    // Intro Screen with Morning Journal
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
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={commonStyles.introTitle}>More Headroom</Text>
                            <Text style={commonStyles.introDescription}>
                                Wanting more isn't about greed… it's about creating breathing room so your mind can think, create, and choose. Go through the following reflections. Each one ends with a tiny action you can actually try this week.
                            </Text>

                            <JournalEntrySection
                                pathTag="money-mindsets"
                                day="6"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="More Money More Headroom"
                                journalInstruction="Before we begin, take a moment to reflect on your current financial headspace. What money pressures are you feeling right now?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Let's Explore" onPress={handleStart} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.cardIndex === -2) {
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
                            <View style={commonStyles.reflectionHeader}>
                                <Text style={styles.reflectionTitle}>Moving Towards Clarity</Text>
                            </View>

                            <View style={commonStyles.reflectionIntro}>
                                <Text style={commonStyles.reflectionDescription}>
                                    Hopefully, some of these reflections help you imagine a headspace that's clearer and more at peace. There are so many ways more money = more headroom and these ideas only just scratch the surface of what's possible.
                                </Text>
                            </View>

                            <View style={styles.ebookCard}>
                                <Text style={styles.ebookTitle}>Hungry for more?</Text>
                                <Text style={styles.ebookDescription}>
                                    Our How to Pivot eBook dives into psychological and philosophical concepts that can guide you through a career change, merging academic insights with real-world experience.
                                </Text>
                                <PrimaryButton
                                    title="Learn More"
                                    onPress={handleOpenEbook}
                                    variant="secondary"
                                />
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={() => {
                                    setScreenHistory(prev => [...prev, { cardIndex: -1 }]);
                                    scrollToTop();
                                }}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen with End of Day Journal
    if (currentScreen.cardIndex === -1) {
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
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <View style={commonStyles.finalHeader}>
                                <Text style={commonStyles.finalHeading}>Creating Headroom</Text>
                            </View>

                            <View style={commonStyles.finalTextContainer}>
                                <Text style={commonStyles.finalText}>
                                    You've explored powerful ways to create more financial and mental headroom in your life. These practices will help you build the breathing room needed to make clearer decisions and reduce financial stress.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="money-mindsets"
                                day="6"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="More Money More Headroom"
                                journalInstruction="Reflect on today's exercise. Which tiny action resonated most with you? How will you implement these headroom-creating practices?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.alternativeClosing}>
                                We're wrapping up tomorrow. See you then.
                            </Text>

                            <View style={commonStyles.finalButtonContainer}>
                                <PrimaryButton
                                    title="Mark As Complete"
                                    onPress={handleComplete}
                                />
                            </View>
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Card Screens
    const currentCard = tipCards[currentCardIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentCardIndex + 1} of ${tipCards.length}`}
                progress={(currentCardIndex + 1) / tipCards.length}
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
                    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim, transform: [{ scale: cardScale }] }]}>
                        <Card style={styles.card}>
                            <Text style={styles.cardTitle}>{currentCard.title}</Text>

                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Why it matters:</Text>
                                <View style={styles.sectionCard}>
                                    <Text style={styles.sectionText}>{currentCard.whyItMatters}</Text>
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Reflection question:</Text>
                                <View style={styles.sectionCard}>
                                    <Text style={styles.sectionText}>{currentCard.reflectionQuestion}</Text>
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Tiny action:</Text>
                                <View style={styles.sectionCard}>
                                    <Text style={styles.sectionText}>{currentCard.tinyAction}</Text>
                                </View>
                            </View>

                            <PrimaryButton
                                title={currentCardIndex < tipCards.length - 1 ? 'Next' : 'Finish'}
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
    cardContainer: {
        width: width * 0.85,
    },
    card: {
        width: '100%',
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
    cardTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    section: {
        marginBottom: 30,
        width: '100%',
    },
    sectionLabel: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        marginBottom: 12,
    },
    sectionCard: {
        backgroundColor: 'rgba(100,124,144,0.15)',
        borderRadius: 16,
        padding: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#647C90',
    },
    sectionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
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
    reflectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '700',
    },
    ebookCard: {
        backgroundColor: 'rgba(100, 124, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        borderLeftWidth: 4,
        borderLeftColor: '#647C90',
        width: '100%',
    },
    ebookTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    ebookDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
});