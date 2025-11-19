import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Animated, ScrollView } from 'react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { Linkedin } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface LinkedInScreen {
    id: number;
    title: string;
    content: string | React.ReactNode;
    buttonText?: string;
}

const linkedInScreens: LinkedInScreen[] = [
    {
        id: 1,
        title: "Nail Your First Impression",
        content: "Do this:\n\n• Upload a clear headshot. (But opt out from using the ultra glam dance shots and definitely no midriff!)\n• Add a banner using the skyline of your city or a subtle colour palette."
    },
    {
        id: 2,
        title: "Claim Your Handle",
        content: "Do this:\n\n• Edit your public profile URL → linkedin.com/in/yourname.\n• Add contact info with a professional Gmail account"
    },
    {
        id: 3,
        title: "Headline That Translates Dance into Value",
        content: "Formula: Who you help + what you do + dance edge.\n\nExamples:\n\n• \"Project Coordinator | Turning performance discipline into on-time delivery\"\n• \"Creative Producer | Storytelling + stakeholder wrangling | Ex-pro dancer\"\n• \"Customer Success | Empathy, coaching, retention | Former dance educator\""
    },
    {
        id: 4,
        title: "Write an About Summary",
        content: "Template:\n\n1. Past → \"I'm a former/pro dancer & educator.\"\n2. Transfer → \"I bring X, Y, Z.\"\n3. Now → \"I'm focused on ___ roles where I can ___.\"\n\nExample:\n\"I'm a former professional dancer turned project coordinator. Years on stage taught me precision under pressure, learning fast, and team leadership. I'm now focused on marketing ops roles where I can streamline launches and support creative teams.\""
    },
    {
        id: 5,
        title: "Add Experience with Transferable Skills",
        content: "Examples:\n\n• Choreographer / Rehearsal Director\n  - Led 20-person teams to success, set timelines, delivered 15+ productions on schedule.\n\n• Dance Teacher\n  - Designed 12-month curriculum, tracked individual dancer progress, improved retention by 25% YOY\n\n• Touring Performer/Swing\n  - \"Coordinated travel/logistics across 40 cities, learned 7 different tracks for 3 separate shows"
    },
    {
        id: 6,
        title: "Tag Skills to Match Your Pivot",
        content: "Pick 10 (or choose your own!):\n\n• Project Coordination\n• Stakeholder Management\n• Public Speaking\n• Coaching\n• Event Ops\n• Content Creation\n• Customer Service\n• Time Management\n• Team Leadership\n• Visual Storytelling"
    },
    {
        id: 7,
        title: "Add Your Education",
        content: "Do this:\n\n• List formal training and notable intensives.\n• Add short courses (Google Project Management, Meta Social Media, HubSpot, etc.).\n• Start your free LinkedIn Learning trial (but remember to cancel if you don't want to get charged!"
    },
    {
        id: 8,
        title: "Ask for Recommendations",
        content: "Go to the Recommendations section and click +\n\nWho to ask: Directors, teachers, clients, stage managers.\n\nMessage template:\n\"Hi ___! I'm updating my LinkedIn for a career pivot into ___ roles. Would you be open to a 2–3 sentence recommendation about my reliability, teamwork, and discipline from our ___ project?\""
    },
    {
        id: 9,
        title: "Show Up",
        content: "For 10 minutes per week:\n\n• Comment thoughtfully on 3 posts\n• Connect with at least 2 people in your network\n• Consider posting\n\nDon't forget to follow Pivot for Dancers on LinkedIn too!"
    },
    {
        id: 10,
        title: "Final Polish",
        content: "Do this:\n\n• Check privacy (public name/headline), name pronunciation (optional), contact visible.\n• Read aloud for clarity. Fix typos."
    }
];

interface LinkedInUpgradeProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function LinkedInUpgrade({ onComplete, onBack }: LinkedInUpgradeProps) {
    const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ screenIndex: number }>>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('prep-your-pivot');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStart = () => {
        setScreenHistory([{ screenIndex: 0 }]);
        scrollToTop();
    };

    const handleContinue = useCallback(() => {
        if (currentScreenIndex < linkedInScreens.length - 1) {
            // Fade out current content
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                const newScreenIndex = currentScreenIndex + 1;

                // Reset animation
                fadeAnim.setValue(0);

                // Update state
                setCurrentScreenIndex(newScreenIndex);

                // Animate in the next screen
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.spring(progressAnim, {
                            toValue: (newScreenIndex + 1) / linkedInScreens.length,
                            tension: 50,
                            friction: 7,
                            useNativeDriver: false,
                        })
                    ]).start();
                }, 50);

                setScreenHistory(prev => [...prev, { screenIndex: newScreenIndex }]);
                scrollToTop();
            });
        } else {
            // Smooth transition to reflection screen
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setScreenHistory(prev => [...prev, { screenIndex: -2 }]);
                fadeAnim.setValue(1);
                scrollToTop();
            });
        }
    }, [currentScreenIndex, fadeAnim, progressAnim, scrollToTop]);

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            setScreenHistory([]);
            setCurrentScreenIndex(0);
            fadeAnim.setValue(1);
            scrollToTop();
            return;
        }

        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        const prevScreen = newHistory[newHistory.length - 1];
        if (prevScreen.screenIndex === -1 || prevScreen.screenIndex === -2) {
            return;
        }

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setCurrentScreenIndex(prevScreen.screenIndex);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            scrollToTop();
        });
    };

    // Progress animation interpolation
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // Update progress when currentScreenIndex changes
    React.useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: (currentScreenIndex + 1) / linkedInScreens.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentScreenIndex]);

    // Intro Screen with Journal
    if (screenHistory.length === 0) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={handleBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <Linkedin size={48} color="#928490" />
                            </View>

                            <Text style={commonStyles.introTitle}>LinkedIn Upgrade</Text>
                            <Text style={commonStyles.introDescription}>
                                Most dancers aren't active on LinkedIn. But the truth is, this is the main platform where recruiters and employers are definitely hanging out.{"\n\n"}
                                So, to kick off your pivot with an action plan you can do TODAY, let's go step by step through how to set up your LinkedIn for success.
                            </Text>

                            <JournalEntrySection
                                pathTag="prep-your-pivot"
                                day="5"
                                category="Career Transitions"
                                pathTitle="Prep Your Pivot"
                                dayTitle="Linkedin Upgrade"
                                journalInstruction="Before we begin optimizing your LinkedIn, what are your current thoughts or concerns about creating a professional online presence?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Get started" onPress={handleStart} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.screenIndex === -2) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.reflectionHeader}>
                                <Text style={styles.reflectionTitle}>LinkedIn Optimization Tips</Text>
                            </View>

                            <View style={commonStyles.reflectionIntro}>
                                <Text style={commonStyles.reflectionDescription}>
                                    Remember that your LinkedIn profile is a living document. Keep it updated as you gain new skills and experiences. The platform is most effective when you're active - engage with content, join relevant groups, and don't be afraid to reach out to people in your target industries.
                                </Text>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={() => {
                                    setScreenHistory(prev => [...prev, { screenIndex: -1 }]);
                                    scrollToTop();
                                }}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen with Journal
    if (currentScreen.screenIndex === -1) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <Linkedin size={48} color="#928490" />
                            </View>

                            <View style={commonStyles.finalHeader}>
                                <Text style={commonStyles.finalHeading}>And that's it!</Text>
                            </View>

                            <View style={commonStyles.finalTextContainer}>
                                <Text style={commonStyles.finalText}>
                                    With your LinkedIn profile finally up to scratch, you're ready to start applying to jobs right on the platform. Message your connections and start networking! We'll see you there.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="prep-your-pivot"
                                day="5"
                                category="Career Transitions"
                                pathTitle="Prep Your Pivot"
                                dayTitle="Linkedin Upgrade"
                                journalInstruction="How do you feel about your LinkedIn profile now? What was the most helpful tip you learned today?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <View style={commonStyles.finalButtonContainer}>
                                <PrimaryButton
                                    title="Mark As Complete"
                                    onPress={handleComplete}
                                />
                            </View>
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Content Screens
    const currentLinkedInScreen = linkedInScreens[currentScreenIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentScreenIndex + 1} of ${linkedInScreens.length} steps`}
                progress={(currentScreenIndex + 1) / linkedInScreens.length}
            />

            <ScrollView
                ref={scrollViewRef}
                style={commonStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                onContentSizeChange={() => scrollToTop()}
                onLayout={() => scrollToTop()}
            >
                <View style={commonStyles.centeredContent}>
                    <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
                        <Card style={commonStyles.baseCard}>
                            <Text>
                                {currentLinkedInScreen.title}
                            </Text>

                            <View style={styles.contentCard}>
                                <Text style={styles.contentText}>
                                    {currentLinkedInScreen.content}
                                </Text>
                            </View>

                            <PrimaryButton
                                title={currentScreenIndex === linkedInScreens.length - 1 ? 'Complete' : 'Continue'}
                                onPress={handleContinue}
                            />
                        </Card>
                    </Animated.View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    contentCard: {
        backgroundColor: 'rgba(146,132,144,0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
    },
    contentText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
    },
    reflectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#928490',
        textAlign: 'center',
        fontWeight: '700',
    },
});