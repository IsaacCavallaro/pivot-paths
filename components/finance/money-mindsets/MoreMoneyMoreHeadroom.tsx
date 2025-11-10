import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, DollarSign, ArrowLeft, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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
    const [screenHistory, setScreenHistory] = useState<number[]>([]);

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStart = () => {
        setScreenHistory([0]);
    };

    const handleContinue = () => {
        if (currentCardIndex < tipCards.length - 1) {
            const newCardIndex = currentCardIndex + 1;
            setCurrentCardIndex(newCardIndex);
            setScreenHistory([...screenHistory, newCardIndex]);
        } else {
            // All cards completed, go to final screen
            setScreenHistory([...screenHistory, -1]); // -1 represents final screen
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            // If we're at the first screen, go back to intro
            setScreenHistory([]);
            setCurrentCardIndex(0);
            return;
        }

        // Remove current screen from history
        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        // Get previous screen state
        const prevScreenIndex = newHistory[newHistory.length - 1];

        if (prevScreenIndex === -1) {
            // Shouldn't happen as we handle final screen separately
            return;
        }

        setCurrentCardIndex(prevScreenIndex);
    };

    // Calculate progress for card screens
    const cardProgress = ((currentCardIndex + 1) / tipCards.length) * 100;

    // Intro Screen
    if (screenHistory.length === 0) {
        return (
            <View style={styles.container}>
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
                            <View style={styles.introIcon}>
                                <DollarSign size={32} color="#928490" />
                            </View>

                            <Text style={styles.introTitle}>More Headroom</Text>
                            <Text style={styles.introDescription}>
                                Wanting more isn't about greed… it's about creating breathing room so your mind can think, create, and choose. Go through the following reflections. Each one ends with a tiny action you can actually try this week.
                            </Text>

                            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Let's Explore</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen (handled by -1 in history)
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen === -1) {
        return (
            <View style={styles.container}>
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
                            <View style={styles.finalIcon}>
                                <DollarSign size={40} color="#928490" />
                            </View>
                            <Text style={styles.introTitle}>Moving Towards Clarity</Text>
                            <Text style={styles.finalText}>
                                Hopefully, some of these reflections help you imagine a headspace that's clearer and more at peace. There are so many ways more money = more headroom and these ideas only just scratch the surface of what's possible.
                            </Text>

                            <Text style={styles.finalClosing}>
                                We're wrapping up tomorrow. See you then.
                            </Text>

                            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
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

    // Card Screens
    const currentCard = tipCards[currentCardIndex];

    return (
        <View style={styles.container}>
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <ArrowLeft size={28} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.progressText}>
                            {currentCardIndex + 1} of {tipCards.length}
                        </Text>
                    </View>
                    <View style={styles.backButton} />
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${cardProgress}%` }]} />
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.centeredContent}>
                    <View style={styles.card}>
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

                        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                            <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                <Text style={styles.continueButtonText}>
                                    {currentCardIndex < tipCards.length - 1 ? 'Next' : 'Finish'}
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
    scrollView: {
        flex: 1,
        marginTop: 100,
        zIndex: 1,
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 30,
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

    card: {
        width: width * 0.85,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
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
    introIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(146,132,144,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    introTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
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
    finalIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(100,124,144,0.1)',
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
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
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
});