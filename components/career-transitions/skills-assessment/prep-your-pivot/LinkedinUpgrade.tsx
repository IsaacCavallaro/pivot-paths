import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Linkedin, ArrowLeft, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface LinkedInScreen {
    id: number;
    title: string;
    content: string | React.ReactNode;
    buttonText?: string;
}

const linkedInScreens: LinkedInScreen[] = [
    {
        id: 1,
        title: "LinkedIn Upgrade",
        content: "Most dancers aren't active on LinkedIn. But the truth is, this is the main platform where recruiters and employers are definitely hanging out.\n\nSo, to kick off your pivot with an action plan you can do TODAY, let's go step by step through how to set up your LinkedIn for success.",
        buttonText: "Get started"
    },
    {
        id: 2,
        title: "Nail Your First Impression",
        content: "Do this:\n\n• Upload a clear headshot. (But opt out from using the ultra glam dance shots and definitely no midriff!)\n• Add a banner using the skyline of your city or a subtle colour palette."
    },
    {
        id: 3,
        title: "Claim Your Handle",
        content: "Do this:\n\n• Edit your public profile URL → linkedin.com/in/yourname.\n• Add contact info with a professional Gmail account"
    },
    {
        id: 4,
        title: "Headline That Translates Dance into Value",
        content: "Formula: Who you help + what you do + dance edge.\n\nExamples:\n\n• \"Project Coordinator | Turning performance discipline into on-time delivery\"\n• \"Creative Producer | Storytelling + stakeholder wrangling | Ex-pro dancer\"\n• \"Customer Success | Empathy, coaching, retention | Former dance educator\""
    },
    {
        id: 5,
        title: "Write an About Summary",
        content: "Template:\n\n1. Past → \"I'm a former/pro dancer & educator.\"\n2. Transfer → \"I bring X, Y, Z.\"\n3. Now → \"I'm focused on ___ roles where I can ___.\"\n\nExample:\n\"I'm a former professional dancer turned project coordinator. Years on stage taught me precision under pressure, learning fast, and team leadership. I'm now focused on marketing ops roles where I can streamline launches and support creative teams.\""
    },
    {
        id: 6,
        title: "Add Experience with Transferable Skills",
        content: "Examples:\n\n• Choreographer / Rehearsal Director\n  - Led 20-person teams to success, set timelines, delivered 15+ productions on schedule.\n\n• Dance Teacher\n  - Designed 12-month curriculum, tracked individual dancer progress, improved retention by 25% YOY\n\n• Touring Performer/Swing\n  - \"Coordinated travel/logistics across 40 cities, learned 7 different tracks for 3 separate shows"
    },
    {
        id: 7,
        title: "Tag Skills to Match Your Pivot",
        content: "Pick 10 (or choose your own!):\n\n• Project Coordination\n• Stakeholder Management\n• Public Speaking\n• Coaching\n• Event Ops\n• Content Creation\n• Customer Service\n• Time Management\n• Team Leadership\n• Visual Storytelling"
    },
    {
        id: 8,
        title: "Add Your Education",
        content: "Do this:\n\n• List formal training and notable intensives.\n• Add short courses (Google Project Management, Meta Social Media, HubSpot, etc.).\n• Start your free LinkedIn Learning trial (but remember to cancel if you don't want to get charged!"
    },
    {
        id: 9,
        title: "Ask for Recommendations",
        content: "Go to the Recommendations section and click +\n\nWho to ask: Directors, teachers, clients, stage managers.\n\nMessage template:\n\"Hi ___! I'm updating my LinkedIn for a career pivot into ___ roles. Would you be open to a 2–3 sentence recommendation about my reliability, teamwork, and discipline from our ___ project?\""
    },
    {
        id: 10,
        title: "Show Up",
        content: "For 10 minutes per week:\n\n• Comment thoughtfully on 3 posts\n• Connect with at least 2 people in your network\n• Consider posting\n\nDon't forget to follow Pivot for Dancers on LinkedIn too!"
    },
    {
        id: 11,
        title: "Final Polish",
        content: "Do this:\n\n• Check privacy (public name/headline), name pronunciation (optional), contact visible.\n• Read aloud for clarity. Fix typos."
    },
    {
        id: 12,
        title: "And that's it!",
        content: "With your LinkedIn profile finally up to scratch, you're ready to start applying to jobs right on the platform. Message your connections and start networking! We'll see you there."
    }
];

interface LinkedInUpgradeProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function LinkedInUpgrade({ onComplete, onBack }: LinkedInUpgradeProps) {
    const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
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
        if (currentScreenIndex < linkedInScreens.length - 1) {
            const newScreenIndex = currentScreenIndex + 1;
            setCurrentScreenIndex(newScreenIndex);
            setScreenHistory([...screenHistory, newScreenIndex]);
        } else {
            // All screens completed
            setScreenHistory([...screenHistory, -1]);
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            // If we're at the first screen, go back to intro
            setScreenHistory([]);
            setCurrentScreenIndex(0);
            return;
        }

        // Remove current screen from history
        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        // Get previous screen index
        const prevScreenIndex = newHistory[newHistory.length - 1];
        setCurrentScreenIndex(prevScreenIndex);
    };

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
                            <Text style={styles.headerTitle}>LinkedIn Upgrade</Text>
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
                                <Linkedin size={32} color="#928490" />
                            </View>

                            <Text style={styles.introTitle}>LinkedIn Upgrade</Text>
                            <Text style={styles.introDescription}>
                                Most dancers aren't active on LinkedIn. But the truth is, this is the main platform where recruiters and employers are definitely hanging out.{"\n\n"}
                                So, to kick off your pivot with an action plan you can do TODAY, let's go step by step through how to set up your LinkedIn for success.
                            </Text>

                            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Get started</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Final Screen (handled by -1 in history)
    if (screenHistory[screenHistory.length - 1] === -1) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backIconWrapper} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>LinkedIn Upgrade</Text>
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
                                <Linkedin size={40} color="#928490" />
                            </View>
                            <Text style={styles.introTitle}>And that's it!</Text>
                            <Text style={styles.finalText}>
                                With your LinkedIn profile finally up to scratch, you're ready to start applying to jobs right on the platform. Message your connections and start networking! We'll see you there.
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

    // Content Screens
    const currentScreen = linkedInScreens[currentScreenIndex];
    const progress = ((currentScreenIndex + 1) / linkedInScreens.length) * 100;

    return (
        <View style={styles.container}>
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                        <ChevronLeft size={24} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>
                            {currentScreenIndex + 1} of {linkedInScreens.length} steps
                        </Text>
                    </View>
                    <View style={styles.backIconWrapper} />
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
            </View>

            <View style={styles.scrollContainer}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>
                        <Text style={styles.screenTitle}>{currentScreen.title}</Text>

                        <View style={styles.screenContentCard}>
                            <Text style={styles.screenContentText}>{currentScreen.content}</Text>
                        </View>

                        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                            <LinearGradient
                                colors={['#928490', '#928490']}
                                style={styles.continueButtonContent}
                            >
                                <Text style={styles.continueButtonText}>
                                    {currentScreenIndex === linkedInScreens.length - 1 ? 'Complete' : 'Continue'}
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
        marginTop: 150,
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

    screenTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    screenContentCard: {
        backgroundColor: 'rgba(146,132,144,0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
    },
    screenContentText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
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