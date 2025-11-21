import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight, Sparkles, ArrowLeft, Check } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface HobbyChoice {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface HobbyHuntingProps {
    onComplete: () => void;
    onBack?: () => void;
}

const hobbyChoices: HobbyChoice[] = [
    {
        id: 1,
        option1: 'Painting',
        option2: 'Pottery',
        storyKey: 'creative'
    },
    {
        id: 2,
        option1: 'Cooking',
        option2: 'Knitting',
        storyKey: 'winddown'
    },
    {
        id: 3,
        option1: 'Yoga',
        option2: 'Martial arts',
        storyKey: 'balance'
    },
    {
        id: 4,
        option1: 'Gardening',
        option2: 'Photography',
        storyKey: 'weekend'
    },
    {
        id: 5,
        option1: 'Learning a language',
        option2: 'Learning an instrument',
        storyKey: 'challenge'
    },
    {
        id: 6,
        option1: 'Volunteering',
        option2: 'Blogging',
        storyKey: 'connection'
    },
    {
        id: 7,
        option1: 'Hiking',
        option2: 'Rock climbing',
        storyKey: 'movement'
    },
    {
        id: 8,
        option1: 'Board games',
        option2: 'Book clubs',
        storyKey: 'social'
    },
    {
        id: 9,
        option1: 'Pickleball',
        option2: 'Paddleboarding',
        storyKey: 'saturday'
    }
];

export default function HobbyHunting({ onComplete, onBack }: HobbyHuntingProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [randomizedChoices, setRandomizedChoices] = useState<HobbyChoice[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [hobbyHuntingChoices, setHobbyHuntingChoices] = useState<{ [key: string]: string }>({});

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('work-life-balance');
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('work-life-balance');

    useEffect(() => {
        const shuffled = [...hobbyChoices].sort(() => Math.random() - 0.5);
        setRandomizedChoices(shuffled);
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

    const handleChoice = async (choiceKey: string, selectedOption: string) => {
        setSelectedOption(selectedOption);

        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 150));

        const newChoices = { ...hobbyHuntingChoices, [choiceKey]: selectedOption };
        setHobbyHuntingChoices(newChoices);

        if (currentScreen < 9) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
        } else {
            setCurrentScreen(11);
        }
        scrollToTop();
        setIsTransitioning(false);
    };

    const handleContinue = async () => {
        if (selectedOption === null || isTransitioning) return;

        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 150));

        const choiceIndex = currentScreen - 1;
        const currentChoice = randomizedChoices[choiceIndex];

        if (currentChoice) {
            const newChoices = { ...hobbyHuntingChoices, [currentChoice.storyKey]: selectedOption };
            setHobbyHuntingChoices(newChoices);
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
        if (currentScreen < 18) {
            setCurrentScreen(currentScreen + 1);
        } else if (currentScreen === 18) {
            setCurrentScreen(19);
        } else {
            onComplete();
        }
        scrollToTop();
    };

    const handleOpenEbook = () => {
        Linking.openURL('https://pivotfordancers.com/products/how-to-pivot/');
    };

    const getStoryText = (screenNumber: number) => {
        switch (screenNumber) {
            case 11:
                return "Explore Your New Hobby Life";
            case 12:
                return `After work, you dive into ${hobbyHuntingChoices.creative?.toLowerCase()}, feeling curious and excited by this new form of expression or challenge. And as you wind down for the day, your new ${hobbyHuntingChoices.winddown === 'Cooking' ? 'cookbook' : 'knitting project'} keeps you engaged.`;
            case 13:
                return `A few times a week, you find balance and focus through ${hobbyHuntingChoices.balance?.toLowerCase()}, letting your body and mind reconnect in new ways.`;
            case 14:
                return `Your weekends are filled with ${hobbyHuntingChoices.weekend?.toLowerCase()} to help you slow down and notice the details, giving you a sense of accomplishment and calm.\n\nAnd when you're itching for a challenge, you decide to stretch your mind ${hobbyHuntingChoices.challenge?.toLowerCase()}.`;
            case 15:
                return `As a summer project, you explore connection and purpose through ${hobbyHuntingChoices.connection?.toLowerCase()}, sharing your time, skills, or thoughts with others.\n\nAnd your daily movement off the stage finally becomes playtime again as you enjoy ${hobbyHuntingChoices.movement?.toLowerCase()} with friends.`;
            case 16:
                return `${hobbyHuntingChoices.social === 'Board games' ? 'Board games with family' : 'A book club with friends'} and ${hobbyHuntingChoices.saturday === 'Pickleball' ? 'pickleball tournaments' : 'solo paddleboarding excursions'} fill those Saturdays that used to be spent auditioning (or scrolling).`;
            case 17:
                return "You actually have hobbies now and letting go of dance doesn't seem so hard. You have other things to enjoy and new ways to recharge and play.\n\nTry adding at least one of these hobbies to your routine this week.";
            default:
                return "";
        }
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

                            <Text style={commonStyles.introTitle}>You're back for more!</Text>

                            <Text style={commonStyles.introDescription}>
                                This is where we're diving deeper into building a balanced life beyond dance.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                You've already started exploring what life after dance could look like. Now, let's discover hobbies that can bring you joy and fulfillment.
                            </Text>

                            <JournalEntrySection
                                pathTag="work-life-balance"
                                day="2"
                                category="Mindset and Wellness"
                                pathTitle="Work Life Balance"
                                dayTitle="Hobby Hunting"
                                journalInstruction="Before we begin, let's take a moment to check in with yourself. How are you feeling about exploring new hobbies outside of dance?"
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

                            <Text style={commonStyles.introTitle}>Hobby Hunting</Text>

                            <Text style={commonStyles.introDescription}>
                                This is a game of instincts. Choose the answer that you resonate with the most to help you discover new hobbies that bring you joy outside of dance. Don't think too much! There's no right or wrong. Let's see what hobbies you're drawn to.
                            </Text>

                            <PrimaryButton title="Start exploring" onPress={() => setCurrentScreen(1)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Choice Screens (1-9) - UPDATED WITH HIGHLIGHT AND CONTINUE BUTTON
    if (currentScreen >= 1 && currentScreen <= 9) {
        const choiceIndex = currentScreen - 1;
        const currentChoice = randomizedChoices[choiceIndex];

        if (!currentChoice) return null;

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
                                        selectedOption === currentChoice.option1 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => setSelectedOption(currentChoice.option1)}
                                    activeOpacity={0.8}
                                    disabled={isTransitioning}
                                >
                                    <View style={styles.optionContent}>
                                        {selectedOption === currentChoice.option1 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceButtonText,
                                            selectedOption === currentChoice.option1 && styles.choiceButtonTextSelected
                                        ]}>
                                            {currentChoice.option1}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedOption === currentChoice.option2 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => setSelectedOption(currentChoice.option2)}
                                    activeOpacity={0.8}
                                    disabled={isTransitioning}
                                >
                                    <View style={styles.optionContent}>
                                        {selectedOption === currentChoice.option2 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceButtonText,
                                            selectedOption === currentChoice.option2 && styles.choiceButtonTextSelected
                                        ]}>
                                            {currentChoice.option2}
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

    // Story Screens (11-17)
    if (currentScreen >= 11 && currentScreen <= 17) {
        const storyText = getStoryText(currentScreen);
        const isTitle = currentScreen === 11;
        const isFinal = currentScreen === 17;

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
                            {isTitle ? (
                                <View style={styles.storyTitleContainer}>
                                    <Text style={styles.storyTitle}>{storyText}</Text>
                                    <View style={styles.titleUnderline} />
                                </View>
                            ) : (
                                <View style={styles.storyTextContainer}>
                                    <Text style={styles.storyText}>{storyText}</Text>
                                </View>
                            )}

                            <PrimaryButton
                                title={isFinal ? 'Own It' : 'Continue'}
                                onPress={handleContinueStory}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen (now screen 18)
    if (currentScreen === 18) {
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

                            <Text style={commonStyles.reflectionTitle}>Building Your Hobby Muscle</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Perhaps this doesn't sound possible with your busy schedule? But the goal is to give yourself permission to explore interests outside of dance.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                This is just an exercise of building the muscle to imagine a life filled with diverse interests and activities.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Every time you allow yourself to explore a new hobby, you're strengthening that part of you that exists beyond the dance studio.
                            </Text>

                            <PrimaryButton title="Continue" onPress={handleContinueStory} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen (now screen 19) with End of Day Journal
    if (currentScreen === 19) {
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

                            <View style={styles.storyTextContainer}>
                                <Text style={styles.storyText}>
                                    Take a moment to notice how you're feeling right now. Are you excited about trying new hobbies? Skeptical? Overwhelmed?
                                </Text>

                                <Text style={styles.storyText}>
                                    If any part of you thought "I don't have time for hobbies" - that sounds like a story that keeps you from having a balanced life.
                                </Text>

                                <Text style={styles.storyText}>
                                    These mindset shifts around time and identity are exactly what we explore in our dancer-specific resources, helping you create space for life beyond dance.
                                </Text>
                            </View>

                            {/* Ebook Callout */}
                            <View style={styles.ebookCard}>
                                <Text style={styles.ebookTitle}>Explore Balance Tools</Text>
                                <Text style={styles.ebookDescription}>
                                    If you'd like to dive deeper into creating work-life balance, our book "How to Pivot" offers practical strategies that might help.
                                </Text>
                                <PrimaryButton
                                    title="Learn More"
                                    onPress={handleOpenEbook}
                                    style={styles.ebookButton}
                                />
                            </View>

                            <JournalEntrySection
                                pathTag="work-life-balance"
                                journalInstruction="Before we bring today's session to a close, let's take a moment to check in with yourself again. How are you feeling after exploring potential hobbies?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.alternativeClosing}>
                                See you tomorrow for more
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
        marginTop: 10,
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