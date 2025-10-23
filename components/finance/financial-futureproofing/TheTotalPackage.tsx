import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Briefcase, ArrowLeft, ChevronLeft, DollarSign, Clock, Home, GraduationCap } from 'lucide-react-native';

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
    const [currentScreen, setCurrentScreen] = useState(0); // 0: intro, 1-4: benefit details, 5: game plan, 6: final
    const [screenHistory, setScreenHistory] = useState<number[]>([0]);

    const handleBack = useCallback(() => {
        if (onBack && screenHistory.length === 1) {
            onBack();
            return;
        }

        if (screenHistory.length > 1) {
            const newHistory = [...screenHistory];
            newHistory.pop();
            setScreenHistory(newHistory);
            setCurrentScreen(newHistory[newHistory.length - 1]);
        }
    }, [onBack, screenHistory]);

    const navigateTo = (screen: number) => {
        setScreenHistory([...screenHistory, screen]);
        setCurrentScreen(screen);
    };

    const handleComplete = () => {
        onComplete();
    };

    // Intro Screen
    if (currentScreen === 0) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        {onBack ? (
                            <TouchableOpacity style={styles.backIconWrapper} onPress={handleBack}>
                                <ArrowLeft size={24} color="#E2DED0" />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.backIconWrapper} />
                        )}
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>The Total Package</Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
                            <View style={styles.introIcon}>
                                <Briefcase size={32} color="#928490" />
                            </View>

                            <Text style={styles.introTitle}>The Total Package</Text>

                            <Text style={styles.introDescription}>
                                Your salary is just one part of your compensation. The full package includes benefits that can be even more valuable than a slight pay raise.
                            </Text>

                            <Text style={styles.introSubtext}>
                                If an employer can't meet your salary request, you can often negotiate for other perks that provide financial security, flexibility, and peace of mind. Let's explore your options.
                            </Text>

                            <TouchableOpacity style={styles.startButton} onPress={() => navigateTo(1)}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Explore Benefits</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Benefit Detail Screens (1-4)
    if (currentScreen >= 1 && currentScreen <= 4) {
        const benefit = benefitOptions[currentScreen - 1];
        const progressPercentage = ((currentScreen) / benefitOptions.length) * 100;

        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backIconWrapper} onPress={handleBack}>
                            <ChevronLeft size={24} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>
                                {currentScreen} of {benefitOptions.length}
                            </Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
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

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={() => {
                                    if (currentScreen < 4) {
                                        navigateTo(currentScreen + 1);
                                    } else {
                                        navigateTo(5); // Go to game plan after last benefit
                                    }
                                }}
                            >
                                <LinearGradient
                                    colors={['#928490', '#746C70']}
                                    style={styles.continueButtonContent}
                                >
                                    <Text style={styles.continueButtonText}>
                                        {currentScreen < 4 ? 'Next Benefit' : 'See Game Plan'}
                                    </Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Game Plan Screen
    if (currentScreen === 5) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#5A7D7B' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backIconWrapper} onPress={handleBack}>
                            <ChevronLeft size={24} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Game Plan</Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
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

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={() => navigateTo(6)}
                            >
                                <LinearGradient
                                    colors={['#5A7D7B', '#647C90']}
                                    style={styles.continueButtonContent}
                                >
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Final Screen
    if (currentScreen === 6) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#5A7D7B' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backIconWrapper} onPress={handleBack}>
                            <ChevronLeft size={24} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Complete</Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
                            <View style={styles.finalIcon}>
                                <Briefcase size={40} color="#5A7D7B" />
                            </View>

                            <Text style={styles.finalText}>
                                Remember, negotiation is a conversation. You're not being demanding, you're being strategic. A good employer will respect you for it.
                            </Text>

                            <Text style={styles.finalText}>
                                These benefits build the foundation for a sustainable and fulfilling career.
                            </Text>

                            <Text style={styles.finalClosing}>
                                See you again tomorrow.
                            </Text>

                            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                                <View style={[styles.completeButtonContent, { backgroundColor: '#5A7D7B' }]}>
                                    <Text style={styles.completeButtonText}>Mark as complete</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
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
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },

    // Header Styles
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
    backIconWrapper: {
        width: 40,
        alignItems: 'center'
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center'
    },
    headerTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#E2DED0',
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 3,
        marginTop: 12,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#E2DED0',
        borderRadius: 3,
    },

    // Card Layout
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
        marginTop: 150,
    },

    // Intro Screen Styles
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
        marginBottom: 10,
    },
    introSubtext: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
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
    finalClosing: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 40,
    },

    // Button Styles
    startButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    startButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    startButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#E2DED0',
        marginRight: 8,
    },

    continueButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    continueButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
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
    completeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    completeButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
    },
});