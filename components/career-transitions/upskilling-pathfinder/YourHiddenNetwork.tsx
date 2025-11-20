import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight, Users, ArrowLeft, Check } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { useStorage } from '@/hooks/useStorage';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface NetworkQuestion {
    id: number;
    optionA: string;
    optionB: string;
    storyKey: string;
}

interface YourHiddenNetworkProps {
    onComplete: () => void;
    onBack?: () => void;
}

const networkQuestions: NetworkQuestion[] = [
    {
        id: 1,
        optionA: "Friend in a corporate job",
        optionB: "Friend who freelances",
        storyKey: 'choice1'
    },
    {
        id: 2,
        optionA: "Former school teacher",
        optionB: "Dance friend who already pivoted",
        storyKey: 'choice2'
    },
    {
        id: 3,
        optionA: "Family member who owns a business",
        optionB: "Online community forums",
        storyKey: 'choice3'
    },
    {
        id: 4,
        optionA: "LinkedIn networking",
        optionB: "Informal coffee chats",
        storyKey: 'choice4'
    },
    {
        id: 5,
        optionA: "Colleague from your survival job",
        optionB: "Artist running their own business",
        storyKey: 'choice5'
    },
    {
        id: 6,
        optionA: "Former mentor",
        optionB: "Friend of a friend with experience",
        storyKey: 'choice6'
    },
    {
        id: 7,
        optionA: "Asking for a skills swap",
        optionB: "Asking to volunteer on a project",
        storyKey: 'choice7'
    },
    {
        id: 8,
        optionA: "Dance friend who's also changing careers",
        optionB: "Career coach",
        storyKey: 'choice8'
    },
    {
        id: 9,
        optionA: "Professional networking groups",
        optionB: "University alumni network",
        storyKey: 'choice9'
    }
];

const storyScreens = [
    {
        id: 1,
        text: "You start your pivot by reaching out to {CHOICE_1}. They share stories that open your eyes to paths you hadn't considered before."
    },
    {
        id: 2,
        text: "When you hit a wall, you look back to {CHOICE_2}. Their guidance reminds you that you're not starting from scratch — you're building on everything you already know."
    },
    {
        id: 3,
        text: "Support also shows up in surprising places: Advice from {CHOICE_3} gives you confidence to test new ideas and trust your instincts."
    },
    {
        id: 4,
        text: "You practice reaching out by inviting others to {CHOICE_4}. Each conversation feels like a classroom and you're feeling more and more excited about the future."
    },
    {
        id: 5,
        text: "Even in everyday life, learning happens. {CHOICE_5} shows you how transferable skills can open surprising doors."
    },
    {
        id: 6,
        text: "Mentorship comes in many forms when {CHOICE_6} appears out of nowhere and gives you honest advice that shapes your next steps."
    },
    {
        id: 7,
        text: "You put yourself out there by {CHOICE_7}. These moments become your most practical learning experiences."
    },
    {
        id: 8,
        text: "You lean on {CHOICE_8} to help you stay accountable and reminds you that growth is easier when shared."
    },
    {
        id: 9,
        text: "And when you zoom out, your network expands through {CHOICE_9}, giving you a bigger picture of what's possible."
    }
];

export default function YourHiddenNetwork({ onComplete, onBack }: YourHiddenNetworkProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [randomizedQuestions, setRandomizedQuestions] = useState<NetworkQuestion[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('upskilling-pathfinder');
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('upskilling-pathfinder');
    const [networkChoices, setNetworkChoices] = useStorage<{ [key: string]: string }>('HIDDEN_NETWORK_CHOICES', {});

    useEffect(() => {
        const shuffled = [...networkQuestions].sort(() => Math.random() - 0.5);
        setRandomizedQuestions(shuffled);
    }, []);

    const handleStartGame = () => {
        setCurrentScreen(0);
        scrollToTop();
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const goBack = () => {
        if (currentScreen === -1) {
            if (onBack) onBack();
        } else if (currentScreen === 0) {
            setCurrentScreen(-1);
        } else if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1 && currentScreen <= 19) {
            setCurrentScreen(currentScreen - 1);
        }
        scrollToTop();
    };

    const handleContinue = async () => {
        if (selectedOption === null || isTransitioning) return;

        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 150));

        const questionIndex = currentScreen - 1;
        const currentQuestion = randomizedQuestions[questionIndex];

        if (currentQuestion) {
            const newChoices = { ...networkChoices, [currentQuestion.storyKey]: selectedOption };
            await setNetworkChoices(newChoices);
        }

        if (currentScreen < 9) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
        } else {
            setCurrentScreen(11);
        }
        scrollToTop();
        setIsTransitioning(false);
    };

    const handleContinueStory = () => {
        if (currentScreen < 19) {
            setCurrentScreen(currentScreen + 1);
        } else {
            onComplete();
        }
        scrollToTop();
    };

    const handleOpenEbook = () => {
        Linking.openURL('https://pivotfordancers.com/products/how-to-pivot/');
    };

    const getStoryText = (screenNumber: number) => {
        const storyIndex = screenNumber - 11;
        const story = storyScreens[storyIndex];
        if (!story) return "";

        const questionId = randomizedQuestions[storyIndex]?.id;
        const choice = networkChoices[`choice${storyIndex + 1}`] || "";
        return story.text.replace(`{CHOICE_${storyIndex + 1}}`, choice.toLowerCase());
    };

    // NEW: Intro Screen with Morning Journal
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

                            <Text style={commonStyles.introTitle}>Your Hidden Network</Text>

                            <Text style={commonStyles.introDescription}>
                                Today we're exploring the incredible network that's already around you, waiting to be discovered and activated for your career transition.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                You'll be surprised at how many connections and resources you already have access to when you know where to look.
                            </Text>

                            <JournalEntrySection
                                pathTag="upskilling-pathfinder"
                                day="4"
                                category="Career Transitions"
                                pathTitle="Upskilling Pathfinder"
                                dayTitle="Your Hidden Network"
                                journalInstruction="Before we begin exploring your network, let's check in. How are you feeling about your current support system and connections?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Continue" onPress={handleStartGame} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Original Intro Screen (now screen 0)
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

                            <Text style={commonStyles.introTitle}>Your Hidden Network</Text>

                            <Text style={commonStyles.introDescription}>
                                This is a game of instincts to uncover your hidden network. Choose the answer that makes the most sense for you. There's no right or wrong!
                            </Text>

                            <PrimaryButton title="Start the Game" onPress={() => setCurrentScreen(1)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Choice Screens (1-9) - UPDATED WITH HIGHLIGHT AND CONTINUE BUTTON
    if (currentScreen >= 1 && currentScreen <= 9) {
        const questionIndex = currentScreen - 1;
        const currentQuestion = randomizedQuestions[questionIndex];

        if (!currentQuestion) return null;

        return (
            <View style={commonStyles.container}>
                <StickyHeader
                    onBack={goBack}
                    title={`${currentScreen} of 9`}
                    progress={currentScreen / 9}
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
                            <View style={styles.choiceButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedOption === currentQuestion.optionA && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => setSelectedOption(currentQuestion.optionA)}
                                    activeOpacity={0.8}
                                    disabled={isTransitioning}
                                >
                                    <View style={styles.optionContent}>
                                        {selectedOption === currentQuestion.optionA && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceButtonText,
                                            selectedOption === currentQuestion.optionA && styles.choiceButtonTextSelected
                                        ]}>
                                            {currentQuestion.optionA}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedOption === currentQuestion.optionB && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => setSelectedOption(currentQuestion.optionB)}
                                    activeOpacity={0.8}
                                    disabled={isTransitioning}
                                >
                                    <View style={styles.optionContent}>
                                        {selectedOption === currentQuestion.optionB && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceButtonText,
                                            selectedOption === currentQuestion.optionB && styles.choiceButtonTextSelected
                                        ]}>
                                            {currentQuestion.optionB}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinue}
                                disabled={selectedOption === null || isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Transition Screen (now screen 10)
    if (currentScreen === 10) {
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
                            <View style={styles.storyTitleContainer}>
                                <Text style={styles.storyTitle}>Explore Your Hidden Network</Text>
                                <View style={styles.titleUnderline} />
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={() => setCurrentScreen(11)}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Story Screens (11-19)
    if (currentScreen >= 11 && currentScreen <= 19) {
        const storyText = getStoryText(currentScreen);
        const isFinal = currentScreen === 19;

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
                            <View style={styles.storyTextContainer}>
                                <Text style={styles.storyText}>{storyText}</Text>
                            </View>

                            <PrimaryButton
                                title={isFinal ? 'Complete Journey' : 'Continue'}
                                onPress={handleContinueStory}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen (now screen 20) with End of Day Journal
    if (currentScreen === 20) {
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
                                <Users size={48} color="#928490" />
                            </View>

                            <View style={styles.finalHeader}>
                                <Users size={24} color="#928490" />
                                <Text style={styles.finalHeading}>Your Hidden Network</Text>
                                <Users size={24} color="#928490" />
                            </View>

                            <View style={styles.storyTextContainer}>
                                <Text style={styles.storyText}>
                                    Your network is everywhere. Each conversation, connection, and small act of courage adds another stepping stone on your path forward. You don't have to do this alone! Your support system is already forming around you if you're willing to look.
                                </Text>
                            </View>

                            {/* Ebook Callout */}
                            <View style={styles.ebookCard}>
                                <Text style={styles.ebookTitle}>Expand Your Network Further</Text>
                                <Text style={styles.ebookDescription}>
                                    If you'd like to learn more about building meaningful professional connections, our book "How to Pivot" offers networking strategies tailored for dancers.
                                </Text>
                                <PrimaryButton
                                    title="Learn More"
                                    onPress={handleOpenEbook}
                                    style={styles.ebookButton}
                                />
                            </View>

                            <JournalEntrySection
                                pathTag="upskilling-pathfinder"
                                journalInstruction="Before we complete today's session, let's reflect on your network discoveries. How has your perspective on your support system changed?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.alternativeClosing}>
                                See you tomorrow!
                            </Text>

                            <PrimaryButton
                                title="Mark As Complete"
                                onPress={onComplete}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    choiceButtons: {
        gap: 20,
    },
    choiceButton: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        borderWidth: 2,
        borderColor: 'transparent',
        minHeight: 80,
        justifyContent: 'center',
    },
    choiceButtonSelected: {
        backgroundColor: 'rgba(146, 132, 144, 0.3)',
        borderColor: '#928490',
        borderWidth: 2,
    },
    choiceButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
    },
    choiceButtonTextSelected: {
        color: '#4E4F50',
        fontWeight: '600',
    },
    optionContent: {
        paddingRight: 40,
    },
    selectedIndicator: {
        position: 'absolute',
        top: '50%',
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#928490',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: -12 }],
    },
    storyTitleContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    storyTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 32,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 38,
        fontWeight: '700',
    },
    titleUnderline: {
        height: 4,
        width: 60,
        backgroundColor: '#928490',
        borderRadius: 2,
        marginTop: 16,
        opacity: 0.6,
    },
    storyTextContainer: {
        width: '100%',
        marginBottom: 32,
    },
    storyText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 28,
    },
    finalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        gap: 12,
    },
    finalHeading: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '700',
    },
    ebookCard: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
    },
    ebookTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    ebookDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    ebookButton: {
        alignSelf: 'center',
    },
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        marginTop: 0,
        fontWeight: '600',
    },
});