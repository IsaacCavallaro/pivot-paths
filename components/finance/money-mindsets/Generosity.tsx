import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
                    text: "It's a year from now and your youngest sibling is about to graduate college. They've always looked up to you and your dream is to surprise them with a meaningful graduation gift or experience. What do you do?",
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
                    text: "Your hometown dance studio is running a fundraiser to stay afloat. You'd love to support them. After all, they gave you so much growing up. What do you do?",
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
                    text: "A friend from your previous company has been struggling to cover physical therapy bills after an injury. They're too proud to ask, but you know they could use some help. What do you do?",
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
                {onBack && (
                    <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                        <ArrowLeft size={28} color="#647C90" />
                    </TouchableOpacity>
                )}
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <Heart size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>How Money Creates Generosity</Text>

                    <Text style={styles.introDescription}>
                        Let's explore a scenario where your financial situation influences how much you can give back. Choose what you'd do and then see what other options might open up if you had more stability and income.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartRoleplay}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Begin</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Scenario Screen
    if (currentScreen === 1) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.scenarioContainer}>
                    <Text style={styles.introTitle}>{scenarioData.title}</Text>
                    <Text style={styles.scenarioText}>
                        {scenarioData.text}
                    </Text>

                    <TouchableOpacity style={styles.continueButton} onPress={() => setCurrentScreen(2)}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.continueButtonText}>What will you do?</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>
                        {currentScreen === 1 ? 'Back to Intro' : 'Previous'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Choices Screen
    if (currentScreen === 2) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.choicesScreenContainer}>
                    <View style={styles.choicesContainer}>
                        <Text style={styles.alternativeTitle}>Here are your Options</Text>
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
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Response Screen
    if (currentScreen === 3) {
        const responseText = selectedChoice ? scenarioData.responses[selectedChoice - 1] : "";

        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.responseContainer}>
                    <Text style={styles.alternativeTitle}>Here's where you're at</Text>
                    <Text style={styles.responseText}>{responseText}</Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.continueButtonText}>
                                {currentScenario < 3 ? 'See the Alternative' : 'Continue'}
                            </Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Alternative Vision Screen
    if (currentScreen === 4) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.alternativeContainer}>
                    <View style={styles.alternativeIcon}>
                        <Gift size={32} color="#5A7D7B" />
                    </View>

                    <Text style={styles.alternativeTitle}>
                        {currentScenario < 3 ? 'But what if money wasn\'t an object?' : 'Picture this:'}
                    </Text>

                    <Text style={styles.alternativeText}>
                        {scenarioData.alternative}
                    </Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.continueButtonText}>
                                {currentScenario < 3 ? 'Let\'s try another example' : 'Continue'}
                            </Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Final Screen
    if (currentScreen === 5) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.alternativeContainer}>
                    <View style={styles.alternativeIcon}>
                        <Heart size={32} color="#5A7D7B" />
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

                    <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
                        <View
                            style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.completeButtonText}>Mark as Complete</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
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
    topBackButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        zIndex: 1,
        padding: 8,
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
    scenarioContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    scenarioText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
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
    choicesContainer: {
        paddingHorizontal: 24,
        gap: 15,
    },
    choicesScreenContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    choiceButton: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    choiceText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 22,
        textAlign: 'center',
    },
    responseContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    responseText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    alternativeContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    alternativeIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    alternativeTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 25,
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
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 40,
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
});