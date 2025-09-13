import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, MessageCircle, ArrowLeft, ChevronLeft } from 'lucide-react-native';

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
                        <MessageCircle size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Talk the Talk</Text>

                    <Text style={styles.introDescription}>
                        When it comes to interviewing and networking, it can come down to learning how to "talk the talk" in a way the outside world understands. Capitalize on your dance experience by talking about it in muggle terms.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Let's go</Text>
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

    // Script Screens
    const currentPair = scriptPairs[currentPairIndex];

    // Calculate progress for script screens
    const scriptProgress = ((currentPairIndex + 1) / scriptPairs.length) * 100;

    if (!showNewScript) {
        // Show old script
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {currentPairIndex + 1} of {scriptPairs.length} pairs
                        </Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${scriptProgress}%` }]} />
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.scriptContainer}>
                    <Text style={styles.scriptLabel}>What I used to say:</Text>

                    <View style={styles.oldScriptCard}>
                        <Text style={styles.oldScriptText}>"{currentPair.oldScript}"</Text>
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
        // Show new script
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {currentPairIndex + 1} of {scriptPairs.length} pairs
                        </Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${scriptProgress}%` }]} />
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.scriptContainer}>
                    <Text style={styles.scriptLabel}>What I could say instead:</Text>

                    <View style={styles.newScriptCard}>
                        <Text style={styles.newScriptText}>"{currentPair.newScript}"</Text>
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