import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, DollarSign, ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface ValuePair {
    id: number;
    oldStatement: string;
    newStatement: string;
    buttonText: string;
}

const valuePairs: ValuePair[] = [
    {
        id: 1,
        oldStatement: "I don't want to seem greedy if I ask for more.",
        newStatement: "Asking for fair pay is respecting myself, not being greedy.",
        buttonText: "Exactly!"
    },
    {
        id: 2,
        oldStatement: "I should be grateful for any opportunity.",
        newStatement: "Gratitude doesn't mean undercutting myself. I can be thankful *and* well-compensated.",
        buttonText: "So true!"
    },
    {
        id: 3,
        oldStatement: "I can't negotiate — I might lose the job.",
        newStatement: "Negotiation shows confidence. The right opportunity won't disappear just because I ask.",
        buttonText: "Totally!"
    },
    {
        id: 4,
        oldStatement: "Money doesn't matter if I love what I do.",
        newStatement: "Loving what I do *and* earning well is possible. Passion and pay can co-exist.",
        buttonText: "Amen!"
    },
    {
        id: 5,
        oldStatement: "I should just take what's offered.",
        newStatement: "Taking what's offered keeps me stuck. Asking for more raises the bar, for me and for others.",
        buttonText: "So good!"
    },
    {
        id: 6,
        oldStatement: "I'm not experienced enough to charge more.",
        newStatement: "Experience isn't just years on paper. My unique background already adds value.",
        buttonText: "Yes ma'am!"
    },
    {
        id: 7,
        oldStatement: "I don't see myself in a high-paying role.",
        newStatement: "Undervaluing myself was part of the dance world's culture. That doesn't have to be my future.",
        buttonText: "Onwards and upwards!"
    }
];

interface KnowYourValueProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function KnowYourValue({ onComplete, onBack }: KnowYourValueProps) {
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showNewStatement, setShowNewStatement] = useState(false);
    const [screenHistory, setScreenHistory] = useState<Array<{ pairIndex: number, showNew: boolean }>>([]);

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartGame = () => {
        setScreenHistory([{ pairIndex: 0, showNew: false }]);
    };

    const handleContinue = () => {
        if (showNewStatement) {
            // Move to next pair
            if (currentPairIndex < valuePairs.length - 1) {
                const newPairIndex = currentPairIndex + 1;
                setCurrentPairIndex(newPairIndex);
                setShowNewStatement(false);
                setScreenHistory([...screenHistory, { pairIndex: newPairIndex, showNew: false }]);
            } else {
                // All pairs completed, go to final screen
                setScreenHistory([...screenHistory, { pairIndex: -1, showNew: false }]); // -1 represents final screen
            }
        } else {
            // Show new statement for current pair
            setShowNewStatement(true);
            setScreenHistory([...screenHistory, { pairIndex: currentPairIndex, showNew: true }]);
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            // If we're at the first screen, go back to intro
            setScreenHistory([]);
            setCurrentPairIndex(0);
            setShowNewStatement(false);
            return;
        }

        // Remove current screen from history
        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        // Get previous screen state
        const prevScreen = newHistory[newHistory.length - 1];

        if (prevScreen.pairIndex === -1) {
            // Shouldn't happen as we handle final screen separately
            return;
        }

        setCurrentPairIndex(prevScreen.pairIndex);
        setShowNewStatement(prevScreen.showNew);
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

                    <Text style={styles.introTitle}>Know Your Value</Text>

                    <Text style={styles.introDescription}>
                        In dance, it's common to be underpaid or told you should "do it for exposure". That conditioning sticks. But your skills are worth real money and you deserve to ask for it.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Let's rewrite the story</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Final Screen (handled by pairIndex = -1 in history)
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.pairIndex === -1) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
                    <View style={styles.finalIcon}>
                        <DollarSign size={40} color="#928490" />
                    </View>
                    <Text style={styles.introTitle}>You Deserve It</Text>
                    <Text style={styles.finalText}>
                        You've spent years (and maybe decades) delivering excellence for less than you're worth. That doesn't mean you're 'worthless', it means the system was broken.
                    </Text>

                    <Text style={styles.finalText}>
                        From here on, you get to set new standards for yourself. Advocate, negotiate, and expect more. You deserve it.
                    </Text>

                    <Text style={styles.finalClosing}>
                        See you tomorrow for more.
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

    // Statement Screens
    const currentPair = valuePairs[currentPairIndex];

    // Calculate progress for statement screens
    const statementProgress = ((currentPairIndex + 1) / valuePairs.length) * 100;

    if (!showNewStatement) {
        // Show old statement
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {currentPairIndex + 1} of {valuePairs.length} pairs
                        </Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${statementProgress}%` }]} />
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.scriptContainer}>
                    <Text style={styles.scriptLabel}>What I used to say:</Text>

                    <View style={styles.oldScriptCard}>
                        <Text style={styles.oldScriptText}>"{currentPair.oldStatement}"</Text>
                    </View>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <LinearGradient
                            colors={['#928490', '#746C70']}
                            style={styles.continueButtonGradient}
                        >
                            <Text style={styles.continueButtonText}>See the alternative</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>
                        {screenHistory.length <= 1 ? 'Back to Intro' : 'Previous'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        // Show new statement
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {currentPairIndex + 1} of {valuePairs.length} pairs
                        </Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${statementProgress}%` }]} />
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.scriptContainer}>
                    <Text style={styles.scriptLabel}>What I could say now:</Text>

                    <View style={styles.newScriptCard}>
                        <Text style={styles.newScriptText}>"{currentPair.newStatement}"</Text>
                    </View>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <LinearGradient
                            colors={['#5A7D7B', '#647C90']}
                            style={styles.continueButtonGradient}
                        >
                            <Text style={styles.continueButtonText}>{currentPair.buttonText}</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={20} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }
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
    scriptContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    scriptLabel: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    oldScriptCard: {
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
    },
    oldScriptText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 26,
        fontStyle: 'italic',
    },
    newScriptCard: {
        backgroundColor: 'rgba(90, 125, 123, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
    },
    newScriptText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
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
    finalClosing: {
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