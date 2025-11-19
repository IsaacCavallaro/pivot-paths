import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, MessageCircle, ArrowLeft, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ScriptPair {
    id: number;
    oldScript: string;
    newScript: string;
    buttonText: string;
}

const scriptPairs: ScriptPair[] = [
    {
        id: 1,
        oldScript: "I've spent my whole life training and performing as a dancer.",
        newScript: "I worked in the highly competitive dance industry where discipline, teamwork, and constant feedback are part of the job. It's taught me how to perform under pressure and deliver results consistently.",
        buttonText: "See the difference?"
    },
    {
        id: 2,
        oldScript: "I'm used to memorizing choreography quickly.",
        newScript: "I'm a fast learner who can absorb complex information and apply it immediately, whether that's a new system, process, or way of working.",
        buttonText: "Nice!"
    },
    {
        id: 3,
        oldScript: "I'm comfortable performing on stage.",
        newScript: "I'm confident presenting ideas, speaking in front of groups, and adapting to high-stakes situations with professionalism.",
        buttonText: "Look at those transferable skills!"
    },
    {
        id: 4,
        oldScript: "I've done a lot of auditions, so I'm used to rejection.",
        newScript: "I'm resilient. I can take feedback, stay motivated, and keep improving… qualities that help me persist through challenges at work.",
        buttonText: "Ok, she's evolving!"
    },
    {
        id: 5,
        oldScript: "I've always worked in dance companies.",
        newScript: "In the dance companies I performed with, collaboration, trust, and communication were essential for success.",
        buttonText: "Look at you!"
    },
    {
        id: 6,
        oldScript: "I'm totally dedicated to dance.",
        newScript: "I'm committed and passionate. When I take on a role or a project, I give it my complete focus and follow through until it's done.",
        buttonText: "You're in your growth era!"
    },
    {
        id: 7,
        oldScript: "I was a dance teacher while performing.",
        newScript: "I have experience leading groups, explaining complex concepts in simple ways, and motivating people to reach their goals. These skills translate directly into leadership and communication in any setting.",
        buttonText: "We love that skill translation!"
    }
];

interface TalkTheTalkProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function TalkTheTalk({ onComplete, onBack }: TalkTheTalkProps) {
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showNewScript, setShowNewScript] = useState(false);
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
        if (showNewScript) {
            // Move to next pair
            if (currentPairIndex < scriptPairs.length - 1) {
                const newPairIndex = currentPairIndex + 1;
                setCurrentPairIndex(newPairIndex);
                setShowNewScript(false);
                setScreenHistory([...screenHistory, { pairIndex: newPairIndex, showNew: false }]);
            } else {
                // All pairs completed, go to final screen
                setScreenHistory([...screenHistory, { pairIndex: -1, showNew: false }]); // -1 represents final screen
            }
        } else {
            // Show new script for current pair
            setShowNewScript(true);
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
            setShowNewScript(false);
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
        setShowNewScript(prevScreen.showNew);
    };

    // Calculate progress for script screens
    const scriptProgress = ((currentPairIndex + 1) / scriptPairs.length) * 100;

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
                            <Text style={styles.headerTitle}>Talk the Talk</Text>
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
                                <MessageCircle size={32} color="#928490" />
                            </View>

                            <Text style={styles.introTitle}>Talk the Talk</Text>
                            <Text style={styles.introDescription}>
                                When it comes to interviewing and networking, it can come down to learning how to "talk the talk" in a way the outside world understands. Capitalize on your dance experience by talking about it in muggle terms.
                            </Text>

                            <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Let's go</Text>
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
                            <Text style={styles.headerTitle}>Talk the Talk</Text>
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
                                <MessageCircle size={40} color="#928490" />
                            </View>
                            <Text style={styles.introTitle}>Can you "talk the talk"?</Text>
                            <Text style={styles.finalText}>
                                Employers and hiring managers are looking for transferable strengths they can immediately recognize. The more you learn to "speak their language", the more doors you open.
                            </Text>

                            <Text style={styles.finalClosing}>
                                Let's keep going. See you here again tomorrow.
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

    // Script Screens
    const currentPair = scriptPairs[currentPairIndex];

    return (
        <View style={styles.container}>
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                        <ChevronLeft size={24} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>
                            {currentPairIndex + 1} of {scriptPairs.length}
                        </Text>
                    </View>
                    <View style={styles.backIconWrapper} />
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${scriptProgress}%` }]} />
                </View>
            </View>

            <View style={styles.scrollContainer}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>
                        <Text style={styles.scriptLabel}>
                            {showNewScript ? 'What I could say instead:' : 'What I used to say:'}
                        </Text>

                        <View style={showNewScript ? styles.newScriptCard : styles.oldScriptCard}>
                            <Text style={showNewScript ? styles.newScriptText : styles.oldScriptText}>
                                "{showNewScript ? currentPair.newScript : currentPair.oldScript}"
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                            <LinearGradient
                                colors={showNewScript ? ['#647C90', '#647C90'] : ['#928490', '#746C70']}
                                style={styles.continueButtonContent}
                            >
                                <Text style={styles.continueButtonText}>
                                    {showNewScript ? currentPair.buttonText : 'See the alternative'}
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
        marginTop: 120,
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
        backgroundColor: 'rgba(100,124,144,0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#647C90',
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