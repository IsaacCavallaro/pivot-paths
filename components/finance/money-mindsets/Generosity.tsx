import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ChevronRight, Heart, Gift, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface GenerosityProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function Generosity({ onComplete, onBack }: GenerosityProps) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [currentScenario, setCurrentScenario] = useState(1); // 1 = sibling, 2 = dance studio, 3 = friend
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

    const handleStartRoleplay = () => {
        setCurrentScreen(1);
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const goBack = () => {
        if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    const handleChoiceSelect = (choiceNumber: number) => {
        setSelectedChoice(choiceNumber);
        setCurrentScreen(3); // Go to response screen
    };

    const handleContinue = () => {
        if (currentScreen === 3) {
            setCurrentScreen(4); // Go to alternative vision
        } else if (currentScreen === 4) {
            // Move to next scenario or complete
            if (currentScenario < 3) {
                setCurrentScenario(currentScenario + 1);
                setSelectedChoice(null);
                setCurrentScreen(1); // Back to scenario screen
            } else {
                setCurrentScreen(5); // Final screen
            }
        } else if (currentScreen === 5) {
            onComplete();
        } else {
            setCurrentScreen(currentScreen + 1);
        }
    };

    const getScenarioData = () => {
        switch (currentScenario) {
            case 1:
                return {
                    title: "Your Sibling's Big Day",
                    text: "It's a year from now and your youngest sibling is about to graduate college. They've always looked up to you and your dream is to surprise them with a meaningful graduation gift or experience.",
                    choices: [
                        "You write them a heartfelt letter and skip the gift, your budget is too tight.",
                        "You chip in a small amount with other family members, even though you'd love to give more.",
                        "You find something affordable but it's not exactly what you dreamed of giving them."
                    ],
                    responses: [
                        "You're showing love in the best way you can, and that matters. But the financial strain is limiting how you express generosity.",
                        "Collaborating with family is thoughtful, but deep down, you wish you could contribute more freely.",
                        "You've found a way to give, but you still feel the tug of wishing you could do more without stress or compromise."
                    ],
                    alternative: "You've transitioned into a new career that pays you well and gives you financial breathing room. When your sibling graduates, you book a weekend trip for the two of you to celebrate, covering everything without a second thought.\n\nThat's the real gift of financial stability: freedom to give your time, energy, and experiences."
                };
            case 2:
                return {
                    title: "Supporting Your Roots",
                    text: "Your hometown dance studio is running a fundraiser to stay afloat. You'd love to support them. After all, they gave you so much growing up.",
                    choices: [
                        "Share their fundraiser on social media. Unfortunately, you can't afford to donate right now.",
                        "Pitch in a small donation, even though you wish you could do more.",
                        "Volunteer your time since you can't afford a monetary donation."
                    ],
                    responses: [
                        "Sharing helps, but you can't shake the feeling that you'd love to back it up with action.",
                        "Donating is meaningful, but you know in your heart you want to give without worrying about the cost.",
                        "Volunteering is huge and super helpful. You just wish you could make more of an impact to the place that helped raise you."
                    ],
                    alternative: "In your new career, you not only buy a ticket to every recital, but you also create a scholarship for students facing financial hardship. You're fueling the future of dance while still volunteering when you can. You're making a real difference and earning more money has been the biggest driver of this generosity."
                };
            case 3:
                return {
                    title: "A Friend in Need",
                    text: "A friend from your previous company has been struggling to cover physical therapy bills after an injury. They're too proud to ask, but you know they could use some help.",
                    choices: [
                        "Offer emotional support, but money isn't something you can give right now.",
                        "Send them an UberEats gift card, even though it means cutting corners for yourself this month.",
                        "Promise to check in later, but avoid the money conversation."
                    ],
                    responses: [
                        "Your presence matters, but you wish you could do more than words.",
                        "It feels good to help even a little, but it also leaves you more stressed about your own bills.",
                        "You feel guilty… you want to help but don't have the financial room to step in."
                    ],
                    alternative: "You offer to cover a few of your friend's PT sessions without a second thought, helping them heal faster. You even set aside a small \"support fund\" each month for moments like this. Generosity becomes part of your lifestyle, not a rare stretch."
                };
            default:
                return getScenarioData();
        }
    };

    const scenarioData = getScenarioData();

    // Intro Screen
    if (currentScreen === 0) {
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
                    <View style={styles.content}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={styles.heroImage}
                                />
                            </View>

                            <Text style={styles.introTitle}>How Money Creates Generosity</Text>

                            <Text style={styles.introDescription}>
                                Let's explore a scenario where your financial situation influences how much you can give back. Choose what you'd do and then see what other options might open up if you had more stability and income.
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleStartRoleplay}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Begin</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario Screen
    if (currentScreen === 1) {
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
                    <View style={styles.content}>
                        <View style={styles.scenarioCard}>
                            <Text style={styles.scenarioTitle}>{scenarioData.title}</Text>

                            <Text style={styles.scenarioText}>
                                {scenarioData.text}
                            </Text>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={() => setCurrentScreen(2)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.continueButtonText}>What will you do?</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Choices Screen
    if (currentScreen === 2) {
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
                    <View style={styles.content}>
                        <View style={styles.choicesCard}>
                            <Text style={styles.choicesTitle}>Your Options</Text>

                            <View style={styles.choicesContainer}>
                                {scenarioData.choices.map((choice, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.choiceButton}
                                        onPress={() => handleChoiceSelect(index + 1)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.choiceText}>{choice}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Response Screen
    if (currentScreen === 3) {
        const responseText = selectedChoice ? scenarioData.responses[selectedChoice - 1] : "";

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
                    <View style={styles.content}>
                        <View style={styles.responseCard}>
                            <Text style={styles.responseTitle}>Here's where you're at</Text>

                            <Text style={styles.responseText}>{responseText}</Text>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.continueButtonText}>
                                        {currentScenario < 3 ? 'See the Alternative' : 'Continue'}
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

    // Alternative Vision Screen
    if (currentScreen === 4) {
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
                    <View style={styles.content}>
                        <View style={styles.alternativeCard}>
                            <View style={styles.alternativeIconContainer}>
                                <View style={[styles.alternativeIconGradient, { backgroundColor: '#928490' }]}>
                                    <Gift size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.alternativeTitle}>
                                {currentScenario < 3 ? 'But what if money wasn\'t an object?' : 'Picture this:'}
                            </Text>

                            <Text style={styles.alternativeText}>
                                {scenarioData.alternative}
                            </Text>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.continueButtonText}>
                                        {currentScenario < 3 ? 'Try another example' : 'Continue'}
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

    // Final Screen
    if (currentScreen === 5) {
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
                    <View style={styles.content}>
                        <View style={styles.alternativeCard}>
                            <View style={styles.alternativeIconContainer}>
                                <View style={[styles.alternativeIconGradient, { backgroundColor: '#928490' }]}>
                                    <Heart size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.alternativeTitle}>Money isn't holding you back.</Text>

                            <Text style={styles.alternativeText}>
                                It's amplifying your ability to show love and support for the people and causes that matter most.
                            </Text>

                            <Text style={styles.alternativeText}>
                                Think about it. How could you give back if you gave yourself permission to earn more?
                            </Text>

                            <Text style={styles.alternativeClosing}>
                                See you again tomorrow.
                            </Text>

                            <TouchableOpacity
                                style={styles.completeButton}
                                onPress={onComplete}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.completeButtonText}>Mark as Complete</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
    },
    content: {
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
    titleText: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 25,
        color: '#E2DED0',
        textAlign: 'center',
    },
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
    scenarioCard: {
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
    scenarioTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '700',
    },
    scenarioText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 32,
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
        fontWeight: '600',
    },
    choicesCard: {
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
    choicesTitle: {
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
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    choiceText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        textAlign: 'center',
    },
    responseCard: {
        marginHorizontal: 24,
        marginTop: 100,
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
    responseTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    responseText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    alternativeCard: {
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
    alternativeIconContainer: {
        marginBottom: 24,
    },
    alternativeIconGradient: {
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
    alternativeTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    alternativeText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
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
    heroImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderColor: '#647C90',
        borderWidth: 2,
    },
});