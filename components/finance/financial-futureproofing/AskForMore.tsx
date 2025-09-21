import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronRight, Zap, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface AskForMoreProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function AskForMore({ onComplete, onBack }: AskForMoreProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1 = scenario, 2 = choices, 3 = response, 4 = formula, 5 = conclusion
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

    const handleStart = () => {
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
        } else if (currentScreen > 1 && currentScreen <= 5) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    const handleChoiceSelect = (choiceNumber: number) => {
        setSelectedChoice(choiceNumber);
        setCurrentScreen(3);
    };

    const handleContinue = () => {
        if (currentScreen === 3) {
            setCurrentScreen(4);
        } else if (currentScreen === 4) {
            setCurrentScreen(5);
        } else if (currentScreen === 5) {
            onComplete();
        } else {
            setCurrentScreen(currentScreen + 1);
        }
    };

    const getResponseText = () => {
        switch (selectedChoice) {
            case 1:
                return "The people-pleasing instinct is real! You've secured the job, which feels safe. But saying \"yes\" too quickly often leads to resentment later. When you undercharge, you not only lose income but also signal that your expertise is worth less, making it harder to raise your rates later.";
            case 2:
                return "Outstanding! You've shown confidence and professionalism. You stated your value clearly, based on research, and left the door open for a conversation. This is how you build a career based on respect, not just gigs.";
            case 3:
                return "You're protecting your boundaries and refusing to be undervalued, which is powerful. However, walking away from a negotiation without a conversation can close doors. A direct but polite counteroffer often gets you closer to your goal without burning a bridge.";
            default:
                return "";
        }
    };

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
                        <Zap size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Ask for More</Text>

                    <Text style={styles.introDescription}>
                        In the dance world, talking about money can feel uncomfortable. But knowing your value and advocating for it is a non-negotiable skill for financial futureproofing.
                    </Text>

                    <Text style={styles.introSubtext}>
                        Let's practice. Choose how you'd handle this common scenario.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Begin Practice</Text>
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
                    <Text style={styles.scenarioTitle}>Salary Negotiation Scenario</Text>
                    <Text style={styles.scenarioText}>
                        You just had a great interview for a new contract role at a reputable company. The hiring manager says, "We'd love to have you! The salary we'd like to offer you is $50,000. Does that work for you?"
                    </Text>

                    <Text style={styles.scenarioText}>
                        You know that for your experience and in this city, average salaries range between $60,000 to $80,000.
                    </Text>

                    <Text style={styles.scenarioQuestion}>
                        What do you do?
                    </Text>

                    <TouchableOpacity style={styles.continueButton} onPress={() => setCurrentScreen(2)}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.continueButtonText}>See Your Options</Text>
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
                <ScrollView style={styles.content} contentContainerStyle={styles.choicesContainer}>
                    <Text style={styles.choicesTitle}>Choose Your Response</Text>

                    <TouchableOpacity
                        style={styles.choiceButton}
                        onPress={() => handleChoiceSelect(1)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.choiceText}>
                            "Yes, that's fine!" You accept immediately, pushing down the feeling that you're undervaluing yourself.
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.choiceButton}
                        onPress={() => handleChoiceSelect(2)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.choiceText}>
                            "Thank you! I'm really excited to get started. Based on my [X years] of experience and the industry standard, my salary expectation is $65,000. Is that possible?" You negotiate politely and professionally.
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.choiceButton}
                        onPress={() => handleChoiceSelect(3)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.choiceText}>
                            "No, thank you." You decline and walk away, feeling frustrated.
                        </Text>
                    </TouchableOpacity>
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
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.responseContainer}>
                    <Text style={styles.responseTitle}>Your Choice Analysis</Text>
                    <Text style={styles.responseText}>{getResponseText()}</Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.continueButtonText}>Learn the Best Approach</Text>
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

    // Formula Screen
    if (currentScreen === 4) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.formulaContainer}>
                    <Text style={styles.formulaTitle}>The Best Approach: Polite, Prepared Negotiation</Text>

                    <Text style={styles.formulaText}>
                        You don't have to be aggressive to be effective. Here's a simple script you can adapt:
                    </Text>

                    <Text style={styles.formulaSubtitle}>The "Ask for More" Formula:</Text>

                    <View style={styles.formulaStep}>
                        <Text style={styles.formulaStepNumber}>1</Text>
                        <Text style={styles.formulaStepText}>
                            <Text style={styles.formulaStepTitle}>Show Enthusiasm:</Text> "Thank you so much for the offer! I'm really excited about the opportunity to work with you."
                        </Text>
                    </View>

                    <View style={styles.formulaStep}>
                        <Text style={styles.formulaStepNumber}>2</Text>
                        <Text style={styles.formulaStepText}>
                            <Text style={styles.formulaStepTitle}>State Your Rate Clearly:</Text> "Based on my [number] years of professional experience and certification in [specific skill], my salary expectations fall between $X and $X."
                        </Text>
                    </View>

                    <View style={styles.formulaStep}>
                        <Text style={styles.formulaStepNumber}>3</Text>
                        <Text style={styles.formulaStepText}>
                            <Text style={styles.formulaStepTitle}>Open the Door for Discussion:</Text> "I am very flexible and would love to make this work. Is there room to adjust the offer to match my experience?"
                        </Text>
                    </View>

                    <Text style={styles.formulaNote}>
                        This approach is collaborative, not confrontational.
                    </Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
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

    // Conclusion Screen
    if (currentScreen === 5) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.conclusionContainer}>
                    <View style={styles.conclusionIcon}>
                        <Zap size={40} color="#5A7D7B" />
                    </View>

                    <Text style={styles.conclusionTitle}>Remember This</Text>

                    <Text style={styles.conclusionText}>
                        Negotiation is a normal part of business. The worst they can say is "no," and you can then decide whether to accept their original rate or not.
                    </Text>

                    <Text style={styles.conclusionText}>
                        But you'd be surprised how often they say "yes," or meet you in the middle. That extra $5,000 or $10,000 can go a long way and becomes much harder to ask for once you're in the role.
                    </Text>

                    <Text style={styles.conclusionText}>
                        Back yourself and ask for more.
                    </Text>

                    <Text style={styles.conclusionClosing}>
                        See you tomorrow.
                    </Text>

                    <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
                        <View
                            style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.completeButtonText}>Mark As Complete</Text>
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
        marginBottom: 15,
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 15,
    },
    introSubtext: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
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
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    scenarioTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
    },
    scenarioText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    scenarioQuestion: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 40,
        fontStyle: 'italic',
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
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    choicesTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    choiceButton: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
        marginBottom: 15,
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
    responseTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
    },
    responseText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    formulaContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    formulaTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
    },
    formulaText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    formulaSubtitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
    },
    formulaStep: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 15,
    },
    formulaStepNumber: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#928490',
        marginRight: 15,
        minWidth: 25,
    },
    formulaStepText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#4E4F50',
        lineHeight: 20,
        flex: 1,
    },
    formulaStepTitle: {
        fontFamily: 'Montserrat-SemiBold',
    },
    formulaNote: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 14,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 40,
    },
    conclusionContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    conclusionIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    conclusionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 25,
    },
    conclusionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    conclusionClosing: {
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