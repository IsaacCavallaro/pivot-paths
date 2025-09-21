import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, DollarSign, ArrowLeft, ChevronLeft } from 'lucide-react-native';

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
                        <DollarSign size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>More Money, More Headroom</Text>

                    <Text style={styles.introDescription}>
                        Wanting more isn't about greed… it's about creating breathing room so your mind can think, create, and choose. Swipe through these cards. Each one ends with a tiny action you can actually try this week.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Explore the cards</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Final Screen (handled by -1 in history)
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen === -1) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
                    <View style={styles.finalIcon}>
                        <DollarSign size={40} color="#928490" />
                    </View>
                    <Text style={styles.introTitle}>Moving Towards Clarity</Text>
                    <Text style={styles.finalText}>
                        Hopefully, some of these cards help you imagine a headspace that's clearer and more at peace. There are so many ways more money = more headroom and these ideas only just scratch the surface of what's possible.
                    </Text>

                    <Text style={styles.finalText}>
                        We're wrapping up tomorrow. See you then.
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

    // Card Screens
    const currentCard = tipCards[currentCardIndex];

    // Calculate progress for card screens
    const cardProgress = ((currentCardIndex + 1) / tipCards.length) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {currentCardIndex + 1} of {tipCards.length} cards
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${cardProgress}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.cardContainer}>
                <Text style={styles.cardTitle}>{currentCard.title}</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Why it matters:</Text>
                    <Text style={styles.sectionText}>{currentCard.whyItMatters}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Reflection question:</Text>
                    <Text style={styles.sectionText}>{currentCard.reflectionQuestion}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Tiny action:</Text>
                    <Text style={styles.sectionText}>{currentCard.tinyAction}</Text>
                </View>

                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <LinearGradient
                        colors={['#5A7D7B', '#647C90']}
                        style={styles.continueButtonGradient}
                    >
                        <Text style={styles.continueButtonText}>
                            {currentCardIndex < tipCards.length - 1 ? 'Next Card' : 'Finish'}
                        </Text>
                        <ChevronRight size={16} color="#E2DED0" />
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <ChevronLeft size={20} color="#647C90" />
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
    cardContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 40,
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
    },
    sectionLabel: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        marginBottom: 8,
    },
    sectionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
    },
    continueButton: {
        borderRadius: 12,
        overflow: 'hidden',
        alignSelf: 'center',
        marginTop: 20,
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
        marginBottom: 20,
    },
    completeButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 20,
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