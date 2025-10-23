import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, DollarSign, ArrowLeft, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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

    // Calculate progress for statement screens
    const statementProgress = ((currentPairIndex + 1) / valuePairs.length) * 100;

    // Intro Screen
    if (screenHistory.length === 0) {
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
                            <Text style={styles.headerTitle}>Know Your Value</Text>
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
                                <DollarSign size={32} color="#928490" />
                            </View>

                            <Text style={styles.introTitle}>Know Your Value</Text>
                            <Text style={styles.introDescription}>
                                In dance, it's common to be underpaid or told you should "do it for exposure". That conditioning sticks. But your skills are worth real money and you deserve to ask for it.
                            </Text>

                            <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Let's rewrite the story</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Final Screen (handled by pairIndex = -1 in history)
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.pairIndex === -1) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backIconWrapper} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Know Your Value</Text>
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
                                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.completeButtonText}>Mark As Complete</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Statement Screens
    const currentPair = valuePairs[currentPairIndex];

    if (!showNewStatement) {
        // Show old statement
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                            <ChevronLeft size={24} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>
                                {currentPairIndex + 1} of {valuePairs.length}
                            </Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${statementProgress}%` }]} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
                            <Text style={styles.scriptLabel}>What I used to say:</Text>

                            <View style={styles.oldScriptCard}>
                                <Text style={styles.oldScriptText}>"{currentPair.oldStatement}"</Text>
                            </View>

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                                <LinearGradient
                                    colors={['#928490', '#746C70']}
                                    style={styles.continueButtonContent}
                                >
                                    <Text style={styles.continueButtonText}>See the alternative</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    } else {
        // Show new statement
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                            <ChevronLeft size={24} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>
                                {currentPairIndex + 1} of {valuePairs.length}
                            </Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${statementProgress}%` }]} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
                            <Text style={styles.scriptLabel}>What I could say now:</Text>

                            <View style={styles.newScriptCard}>
                                <Text style={styles.newScriptText}>"{currentPair.newStatement}"</Text>
                            </View>

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                                <LinearGradient
                                    colors={['#928490', '#928490']}
                                    style={styles.continueButtonContent}
                                >
                                    <Text style={styles.continueButtonText}>{currentPair.buttonText}</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0'
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
        marginTop: 100,
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
        borderRadius: 12,
        overflow: 'hidden'
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

    scriptLabel: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    oldScriptCard: {
        backgroundColor: 'rgba(146,132,144,0.15)',
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
        backgroundColor: 'rgba(90,125,123,0.15)',
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
        overflow: 'hidden'
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

    finalIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(146,132,144,0.1)',
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
        overflow: 'hidden'
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
});