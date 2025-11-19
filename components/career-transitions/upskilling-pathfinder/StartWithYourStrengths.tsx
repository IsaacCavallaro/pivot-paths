import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { ChevronRight, ArrowLeft, Star } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { useStorage } from '@/hooks/useStorage';

interface StrengthPair {
    id: number;
    strength: string;
    jobTitles: string;
}

interface StartWithYourStrengthsProps {
    onComplete: () => void;
    onBack?: () => void;
}

const strengthPairs: StrengthPair[] = [
    {
        id: 1,
        strength: "Creative expression",
        jobTitles: "Marketing, Graphic Design, or Creative Direction"
    },
    {
        id: 2,
        strength: "Leadership in rehearsals",
        jobTitles: "Project Manager, Team Lead, or People Manager"
    },
    {
        id: 3,
        strength: "Physical awareness & technique",
        jobTitles: "Physiotherapist, Occupational Therapist, or Personal Trainer"
    },
    {
        id: 4,
        strength: "Resilience through rejection",
        jobTitles: "Sales, Entrepreneurship, or Start-up Founder"
    },
    {
        id: 5,
        strength: "Attention to detail in choreography",
        jobTitles: "Data Analyst, Quality Assurance, or UX Designer"
    },
    {
        id: 6,
        strength: "Improvisation on stage",
        jobTitles: "Event Manager, Crisis Response, or Innovation Specialist"
    },
    {
        id: 7,
        strength: "Teaching younger dancers",
        jobTitles: "Educator, Corporate Trainer, or Learning & Development Specialist"
    },
    {
        id: 8,
        strength: "Balancing rehearsals, gigs & jobs",
        jobTitles: "Operations Manager, Administrative Coordinator, or Executive Assistant"
    },
    {
        id: 9,
        strength: "Performing under pressure",
        jobTitles: "Public Relations, Broadcaster, or Presenter"
    },
    {
        id: 10,
        strength: "Collaborating with casts & choreographers",
        jobTitles: "Human Resources, Community Manager, or Team Coordinator"
    }
];

export default function StartWithYourStrengths({ onComplete, onBack }: StartWithYourStrengthsProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'strength' | 'jobTitles' }>>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showMismatch, setShowMismatch] = useState(false);

    const [strengthMatchedPairs, setStrengthMatchedPairs] = useStorage<number[]>('STRENGTH_MATCHED_PAIRS', []);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    // Ensure strengthMatchedPairs is always an array
    const matchedPairs = Array.isArray(strengthMatchedPairs) ? strengthMatchedPairs : [];

    useEffect(() => {
        scrollToTop();
    }, [currentScreen]);

    const handleBack = () => {
        onBack?.();
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = async () => {
        if (currentScreen === 0) {
            setCurrentScreen(-1);
        } else if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen === 2) {
            await setStrengthMatchedPairs([]);
            setSelectedItems([]);
            setCurrentPairIndex(0);
            setShowMismatch(false);
            setCurrentScreen(1);
        } else if (currentScreen === 3) {
            setCurrentScreen(2);
        } else if (currentScreen > 3) {
            setCurrentScreen(currentScreen - 1);
        }
        scrollToTop();
    };

    useEffect(() => {
        if (currentScreen === 1) {
            setupGame();
        }
    }, [currentScreen]);

    const setupGame = () => {
        const firstThreePairs = strengthPairs.slice(0, 3);
        const strengths: Array<{ id: string; text: string; pairId: number; type: 'strength' | 'jobTitles' }> = [];
        const jobTitles: Array<{ id: string; text: string; pairId: number; type: 'strength' | 'jobTitles' }> = [];

        firstThreePairs.forEach(pair => {
            strengths.push({
                id: `strength_${pair.id}`,
                text: pair.strength,
                pairId: pair.id,
                type: 'strength'
            });
            jobTitles.push({
                id: `jobTitles_${pair.id}`,
                text: pair.jobTitles,
                pairId: pair.id,
                type: 'jobTitles'
            });
        });

        const scrambledStrengths = [...strengths].sort(() => Math.random() - 0.5);
        const scrambledJobTitles = [...jobTitles].sort(() => Math.random() - 0.5);

        const allItems = [...scrambledStrengths, ...scrambledJobTitles];
        setGameItems(allItems);
        setCurrentPairIndex(3);
    };

    const handleItemPress = async (itemId: string) => {
        if (selectedItems.includes(itemId) || showMismatch) return;

        const newSelected = [...selectedItems, itemId];
        setSelectedItems(newSelected);

        if (newSelected.length === 2) {
            await checkMatch(newSelected);
        }
    };

    const checkMatch = async (selected: string[]) => {
        const item1 = gameItems.find(item => item.id === selected[0]);
        const item2 = gameItems.find(item => item.id === selected[1]);

        if (item1 && item2 && item1.pairId === item2.pairId) {
            const newMatchedPairs = [...matchedPairs, item1.pairId];
            await setStrengthMatchedPairs(newMatchedPairs);

            setTimeout(() => {
                const remainingItems = gameItems.filter(item => !selected.includes(item.id));

                if (currentPairIndex < strengthPairs.length) {
                    const nextPair = strengthPairs[currentPairIndex];

                    const existingStrengths = remainingItems.filter(item => item.type === 'strength');
                    const existingJobTitles = remainingItems.filter(item => item.type === 'jobTitles');

                    const newStrength = {
                        id: `strength_${nextPair.id}`,
                        text: nextPair.strength,
                        pairId: nextPair.id,
                        type: 'strength' as const
                    };
                    const newJobTitles = {
                        id: `jobTitles_${nextPair.id}`,
                        text: nextPair.jobTitles,
                        pairId: nextPair.id,
                        type: 'jobTitles' as const
                    };

                    const allStrengths = [...existingStrengths];
                    const allJobTitles = [...existingJobTitles];

                    const strengthInsertIndex = Math.floor(Math.random() * (allStrengths.length + 1));
                    allStrengths.splice(strengthInsertIndex, 0, newStrength);

                    const jobTitlesInsertIndex = Math.floor(Math.random() * (allJobTitles.length + 1));
                    allJobTitles.splice(jobTitlesInsertIndex, 0, newJobTitles);

                    const newItems = [...allStrengths, ...allJobTitles];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                if (newMatchedPairs.length === strengthPairs.length) {
                    setTimeout(() => {
                        setCurrentScreen(2);
                    }, 500);
                }
            }, 600);
        } else {
            setShowMismatch(true);
            setTimeout(() => {
                setShowMismatch(false);
                setSelectedItems([]);
            }, 800);
        }
    };

    const getItemStyle = (itemId: string) => {
        const isSelected = selectedItems.includes(itemId);
        const isMatched = gameItems.find(item => item.id === itemId && matchedPairs.includes(item.pairId));

        if (isMatched) {
            return [styles.gameButton, styles.matchedButton];
        } else if (isSelected && showMismatch) {
            return [styles.gameButton, styles.mismatchButton];
        } else if (isSelected) {
            return [styles.gameButton, styles.selectedButton];
        } else {
            return [styles.gameButton];
        }
    };

    const openYouTubeShort = async () => {
        const youtubeUrl = `https://www.youtube.com/shorts/YOUR_VIDEO_ID`;

        try {
            const supported = await Linking.canOpenURL(youtubeUrl);

            if (supported) {
                await Linking.openURL(youtubeUrl);
            } else {
                console.log("YouTube app not available");
            }
        } catch (error) {
            console.log("Error opening YouTube:", error);
        }
    };

    // Welcome Screen with Journal Section
    if (currentScreen === -1) {
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
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={commonStyles.introTitle}>Welcome to Start With Your Strengths!</Text>

                            <Text style={commonStyles.introDescription}>
                                Your journey as a dancer has equipped you with unique strengths that are highly valuable in many career paths.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Today, we'll explore how your dance skills translate to various professional roles through an interactive matching game.
                            </Text>

                            <View style={styles.learningBox}>
                                <Text style={styles.learningBoxTitle}>What You'll Discover:</Text>
                                <Text style={styles.learningBoxItem}>• How your dance skills transfer to other careers</Text>
                                <Text style={styles.learningBoxItem}>• Potential job titles that align with your strengths</Text>
                                <Text style={styles.learningBoxItem}>• New career paths you may not have considered</Text>
                            </View>

                            <Text style={styles.welcomeFooter}>
                                You'll be playing a match game to connect your dancer strengths with relevant career opportunities.
                            </Text>

                            <JournalEntrySection
                                pathTag="upskilling-pathfinder"
                                day="1"
                                category="Career Transitions"
                                pathTitle="Upskilling Pathfinder"
                                dayTitle="Start With Your Strengths"
                                journalInstruction="Before we begin, let's take a moment to reflect. What do you consider to be your greatest strengths as a dancer? Are there any careers you've already considered that might use these skills?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Continue" onPress={() => setCurrentScreen(0)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Intro Screen
    if (currentScreen === 0) {
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
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={commonStyles.introTitle}>Start With Your Strengths</Text>

                            <Text style={commonStyles.introDescription}>
                                Match your natural strengths as a dancer with relevant job titles.
                            </Text>

                            <PrimaryButton title="Start the Game" onPress={() => setCurrentScreen(1)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen after Game Completion
    if (currentScreen === 2) {
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
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={commonStyles.reflectionTitle}>Time for Reflection</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Which strength-to-career connections were most surprising or interesting to you?
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Take a moment to reflect on how your dance skills can open doors to new career possibilities.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                <Text style={styles.reflectionEmphasis}>(If you're having trouble recalling, feel free to go back and play the match game again)</Text>
                            </Text>

                            <JournalEntrySection
                                pathTag="upskilling-pathfinder"
                                journalInstruction="Which career paths that you discovered today are you most excited to explore further? What skills would you need to develop to pursue them?"
                                moodLabel=""
                                saveButtonText="Add to Journal"
                            />

                            <PrimaryButton title="Continue" onPress={() => setCurrentScreen(3)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Congratulations Screen with Completion
    if (currentScreen === 3) {
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
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={commonStyles.reflectionTitle}>You've Discovered Your Transferable Strengths!</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Remember that these are just starting points for your career exploration. The best career path for you will depend on your unique interests, values, and goals.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                We encourage you to use these connections as inspiration for further research and networking in fields that interest you.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Check out this additional resource to learn more about translating dance skills to other careers:
                            </Text>

                            <TouchableOpacity
                                style={styles.videoThumbnailContainer}
                                onPress={openYouTubeShort}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={{ uri: 'https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg' }}
                                    style={styles.videoThumbnail}
                                    resizeMode="cover"
                                />
                                <View style={styles.playButtonOverlay}>
                                    <View style={styles.playButton}>
                                        <Text style={styles.playIcon}>▶</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <Text style={styles.reflectionClosing}>
                                We'll build on this tomorrow.
                            </Text>

                            <PrimaryButton title="Mark As Complete" onPress={handleComplete} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Game Screen
    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${matchedPairs.length}/${strengthPairs.length} pairs matched`}
                progress={matchedPairs.length / strengthPairs.length}
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
                    <Card style={commonStyles.baseCard}>
                        <Text style={styles.gameTitle}>Start With Your Strengths</Text>
                        <Text style={styles.gameInstructions}>
                            Tap to match dancer strengths with relevant job titles
                        </Text>

                        <View style={styles.columnsContainer}>
                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>Strength</Text>
                                {gameItems.filter(item => item.type === 'strength').map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={getItemStyle(item.id)}
                                        onPress={() => handleItemPress(item.id)}
                                        activeOpacity={0.8}
                                        disabled={matchedPairs.includes(item.pairId)}
                                    >
                                        <Text style={[
                                            styles.gameButtonText,
                                            selectedItems.includes(item.id) && styles.selectedButtonText,
                                            matchedPairs.includes(item.pairId) && styles.matchedButtonText,
                                            selectedItems.includes(item.id) && showMismatch && styles.mismatchButtonText
                                        ]}>
                                            {item.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>Title</Text>
                                {gameItems.filter(item => item.type === 'jobTitles').map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={getItemStyle(item.id)}
                                        onPress={() => handleItemPress(item.id)}
                                        activeOpacity={0.8}
                                        disabled={matchedPairs.includes(item.pairId)}
                                    >
                                        <Text style={[
                                            styles.gameButtonText,
                                            selectedItems.includes(item.id) && styles.selectedButtonText,
                                            matchedPairs.includes(item.pairId) && styles.matchedButtonText,
                                            selectedItems.includes(item.id) && showMismatch && styles.mismatchButtonText
                                        ]}>
                                            {item.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // Welcome Screen Styles
    learningBox: {
        width: '100%',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(146, 132, 144, 0.2)',
    },
    learningBoxTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        marginBottom: 12,
        fontWeight: '600',
    },
    learningBoxItem: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#4E4F50',
        lineHeight: 24,
        marginBottom: 8,
    },
    welcomeFooter: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    // Game Styles
    gameTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '700',
    },
    gameInstructions: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 30,
    },
    columnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    column: {
        flex: 1,
    },
    columnTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 15,
        fontWeight: '700',
    },
    gameButton: {
        width: '100%',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 120,
    },
    selectedButton: {
        backgroundColor: 'rgba(100, 124, 144, 0.2)',
        borderColor: '#647C90',
    },
    matchedButton: {
        backgroundColor: 'rgba(90, 125, 123, 0.2)',
        borderColor: '#5A7D7B',
        opacity: 0,
    },
    mismatchButton: {
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        borderColor: '#dc3545',
    },
    gameButtonText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 18,
    },
    selectedButtonText: {
        color: '#647C90',
        fontFamily: 'Montserrat-SemiBold',
    },
    matchedButtonText: {
        color: '#5A7D7B',
    },
    mismatchButtonText: {
        color: '#dc3545',
    },
    reflectionEmphasis: {
        fontStyle: 'italic',
        color: '#928490',
    },
    reflectionClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '600',
    },
    // YouTube Thumbnail Styles
    videoThumbnailContainer: {
        width: '100%',
        marginBottom: 25,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        position: 'relative',
    },
    videoThumbnail: {
        width: '100%',
        height: 200,
        borderRadius: 16,
    },
    playButtonOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    playButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF0000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    playIcon: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 4,
    },
});