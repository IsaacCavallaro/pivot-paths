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
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Ask for More</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <Zap size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>Ask for More</Text>

                            <Text style={styles.introDescription}>
                                In the dance world, talking about money can feel uncomfortable. But knowing your value and advocating for it is a non-negotiable skill for financial futureproofing.
                            </Text>

                            <Text style={styles.introSubtext}>
                                Let's practice. Choose how you'd handle this common scenario.
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleStart}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Begin Practice</Text>
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
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Salary Negotiation</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.scenarioCard}>
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

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={() => setCurrentScreen(2)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.continueButtonText}>See Your Options</Text>
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
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Your Options</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.choicesCard}>
                            <Text style={styles.choicesTitle}>Choose Your Response</Text>

                            <View style={styles.choicesContainer}>
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
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Response Screen
    if (currentScreen === 3) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Choice Analysis</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.responseCard}>
                            <Text style={styles.responseTitle}>Your Choice Analysis</Text>

                            <Text style={styles.responseText}>{getResponseText()}</Text>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.continueButtonText}>Learn the Best Approach</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Formula Screen
    if (currentScreen === 4) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Best Approach</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.formulaCard}>
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

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Conclusion Screen
    if (currentScreen === 5) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Remember This</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.conclusionCard}>
                            <View style={styles.conclusionIconContainer}>
                                <View style={[styles.conclusionIconGradient, { backgroundColor: '#5A7D7B' }]}>
                                    <Zap size={32} color="#E2DED0" />
                                </View>
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

                            <TouchableOpacity
                                style={styles.completeButton}
                                onPress={onComplete}
                                activeOpacity={0.8}
                            >
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
        marginBottom: 15,
    },
    introSubtext: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 16,
        color: '#928490',
        textAlign: 'center',
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
        marginBottom: 32,
        fontStyle: 'italic',
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
        lineHeight: 22,
        textAlign: 'center',
    },
    responseCard: {
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
    formulaCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    formulaTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
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
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
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
        color: '#928490',
        textAlign: 'center',
        marginBottom: 32,
    },
    conclusionCard: {
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
    conclusionIconContainer: {
        marginBottom: 24,
    },
    conclusionIconGradient: {
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
    conclusionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
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
});