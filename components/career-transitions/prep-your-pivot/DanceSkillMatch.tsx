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

interface SkillPair {
    id: number;
    danceExperience: string;
    careerSkill: string;
}

interface DanceSkillMatchProps {
    onComplete: () => void;
    onBack?: () => void;
}

const skillPairs: SkillPair[] = [
    {
        id: 1,
        danceExperience: "Auditioned in a room of 500",
        careerSkill: "Performs well under pressure"
    },
    {
        id: 2,
        danceExperience: "Learned choreography in under an hour",
        careerSkill: "Quick learner who thrives in fast-paced environments"
    },
    {
        id: 3,
        danceExperience: "Performed the same show 12 times a week for months",
        careerSkill: "Reliable, consistent, and committed to excellence"
    },
    {
        id: 4,
        danceExperience: "Toured internationally with minimal support",
        careerSkill: "Adaptable and self-sufficient in high-stress situations"
    },
    {
        id: 5,
        danceExperience: "Collaborated with diverse casts and creative teams",
        careerSkill: "Strong communicator and team player across cultures and personalities"
    },
    {
        id: 6,
        danceExperience: "Trained in an elite form of dance for 24 years",
        careerSkill: "Disciplined and motivated with the ability to follow-through"
    },
    {
        id: 7,
        danceExperience: "Always made sure headshots and resumes were printed for auditions",
        careerSkill: "Experience in administration, organization, and project management"
    },
    {
        id: 8,
        danceExperience: "Maintained a successful freelance dance career for 11 years",
        careerSkill: "A self-starter with a determined, entrepreneurial spirit"
    },
    {
        id: 9,
        danceExperience: "Held various part-time jobs at once to support the dance lifestyle",
        careerSkill: "Hard-working with the ability to balance competing priorities"
    },
    {
        id: 10,
        danceExperience: "Acted as dance captain to a cast of 12 dancers",
        careerSkill: "Able to give and receive feedback to ensure high-quality output"
    }
];

export default function DanceSkillMatch({ onComplete, onBack }: DanceSkillMatchProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'dance' | 'career' }>>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showMismatch, setShowMismatch] = useState(false);

    const [danceMatchedPairs, setDanceMatchedPairs] = useStorage<number[]>('DANCE_MATCHED_PAIRS', []);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    // Ensure danceMatchedPairs is always an array
    const matchedPairs = Array.isArray(danceMatchedPairs) ? danceMatchedPairs : [];

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
            await setDanceMatchedPairs([]);
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
        const firstThreePairs = skillPairs.slice(0, 3);
        const danceExperiences: Array<{ id: string; text: string; pairId: number; type: 'dance' | 'career' }> = [];
        const careerSkills: Array<{ id: string; text: string; pairId: number; type: 'dance' | 'career' }> = [];

        firstThreePairs.forEach(pair => {
            danceExperiences.push({
                id: `dance_${pair.id}`,
                text: pair.danceExperience,
                pairId: pair.id,
                type: 'dance'
            });
            careerSkills.push({
                id: `career_${pair.id}`,
                text: pair.careerSkill,
                pairId: pair.id,
                type: 'career'
            });
        });

        const scrambledDance = [...danceExperiences].sort(() => Math.random() - 0.5);
        const scrambledCareer = [...careerSkills].sort(() => Math.random() - 0.5);

        const allItems = [...scrambledDance, ...scrambledCareer];
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
            await setDanceMatchedPairs(newMatchedPairs);

            setTimeout(() => {
                const remainingItems = gameItems.filter(item => !selected.includes(item.id));

                if (currentPairIndex < skillPairs.length) {
                    const nextPair = skillPairs[currentPairIndex];

                    const existingDance = remainingItems.filter(item => item.type === 'dance');
                    const existingCareer = remainingItems.filter(item => item.type === 'career');

                    const newDance = {
                        id: `dance_${nextPair.id}`,
                        text: nextPair.danceExperience,
                        pairId: nextPair.id,
                        type: 'dance' as const
                    };
                    const newCareer = {
                        id: `career_${nextPair.id}`,
                        text: nextPair.careerSkill,
                        pairId: nextPair.id,
                        type: 'career' as const
                    };

                    const allDance = [...existingDance];
                    const allCareer = [...existingCareer];

                    const danceInsertIndex = Math.floor(Math.random() * (allDance.length + 1));
                    allDance.splice(danceInsertIndex, 0, newDance);

                    const careerInsertIndex = Math.floor(Math.random() * (allCareer.length + 1));
                    allCareer.splice(careerInsertIndex, 0, newCareer);

                    const newItems = [...allDance, ...allCareer];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                if (newMatchedPairs.length === skillPairs.length) {
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

                            <Text style={commonStyles.introTitle}>Welcome to Dance Skill Match!</Text>

                            <Text style={commonStyles.introDescription}>
                                Your dance background has equipped you with incredible transferable skills that are highly valuable in any career.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Today, we'll explore how your dance experiences translate directly to workplace competencies that employers are looking for.
                            </Text>

                            <View style={styles.learningBox}>
                                <Text style={styles.learningBoxTitle}>What You'll Discover:</Text>
                                <Text style={styles.learningBoxItem}>• How dance skills translate to career competencies</Text>
                                <Text style={styles.learningBoxItem}>• The hidden value in your dance experiences</Text>
                                <Text style={styles.learningBoxItem}>• How to articulate your dance background in job interviews</Text>
                            </View>

                            <Text style={styles.welcomeFooter}>
                                You'll be playing a match game to help you recognize and value the incredible skills you've developed through dance.
                            </Text>

                            <JournalEntrySection
                                pathTag="prep-your-pivot"
                                day="4"
                                category="Career Transitions"
                                pathTitle="Prep Your Pivot"
                                dayTitle="Dance Skill Match"
                                journalInstruction="Before we begin, let's take a moment to reflect on your dance journey. What skills do you think you've developed through dance that might be valuable in other careers?"
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

                            <Text style={commonStyles.introTitle}>Dance Skill Match</Text>

                            <Text style={commonStyles.introDescription}>
                                Let's match dance experiences with their career value to recognize the incredible skills you've developed.
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
                                Which skill translation was most surprising or meaningful to you?
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Take a moment to reflect on how your dance background has prepared you for success in any career path.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                <Text style={styles.reflectionEmphasis}>(If you're having trouble recalling, feel free to go back and play the match game again)</Text>
                            </Text>

                            <JournalEntrySection
                                pathTag="prep-your-pivot"
                                journalInstruction="Looking at the skills you've matched, which ones feel most authentic to your experience? How might you describe these skills in a job interview or on your resume?"
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

                            <Text style={commonStyles.reflectionTitle}>You're Recognizing Your Value!</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Your dance experience has given you valuable transferable skills that are highly sought after in many careers.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Recognizing these connections can help you see the true value of your dance background beyond the studio or stage and articulate your unique strengths to potential employers.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Check out this additional resource to learn more about translating dance skills:
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
                                See you tomorrow for more.
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
                title={`${matchedPairs.length}/${skillPairs.length} pairs matched`}
                progress={matchedPairs.length / skillPairs.length}
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
                        <Text style={styles.gameTitle}>Dance Skill Match</Text>
                        <Text style={styles.gameInstructions}>
                            Tap to match dance experiences with their career value
                        </Text>

                        <View style={styles.columnsContainer}>
                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>Dance Experience</Text>
                                {gameItems.filter(item => item.type === 'dance').map((item) => (
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
                                <Text style={styles.columnTitle}>Career Skill</Text>
                                {gameItems.filter(item => item.type === 'career').map((item) => (
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
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 14,
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