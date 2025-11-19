import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight, TrendingUp, ArrowLeft, Check } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { useStorage } from '@/hooks/useStorage';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface SideHustleChoice {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface SideHustleScoreCardProps {
    onComplete: () => void;
    onBack?: () => void;
}

const sideHustleOptions: SideHustleChoice[] = [
    {
        id: 1,
        option1: 'Dog Walking',
        option2: 'Delivery Driving',
        storyKey: 'hustle1'
    },
    {
        id: 2,
        option1: 'Virtual Assistant',
        option2: 'Social Media Manager',
        storyKey: 'hustle2'
    },
    {
        id: 3,
        option1: 'Tutoring',
        option2: 'Video Editing',
        storyKey: 'hustle3'
    },
    {
        id: 4,
        option1: 'Graphic Design',
        option2: 'Web Design',
        storyKey: 'hustle4'
    },
    {
        id: 5,
        option1: 'Sell Crafts Online',
        option2: 'Start a Youtube channel',
        storyKey: 'hustle5'
    }
];

// Mapping function to convert specific choices to their story representations
const getStoryMapping = (choice: string): string => {
    const mappings: { [key: string]: string } = {
        'Sell Crafts Online': 'selling your crafts online',
        'Start a Youtube channel': 'a YouTube channel'
    };

    return mappings[choice] || choice;
};

export default function SideHustleScoreCard({ onComplete, onBack }: SideHustleScoreCardProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [randomizedChoices, setRandomizedChoices] = useState<SideHustleChoice[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('financial-futureproofing');
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('financial-futureproofing');
    const [userChoices, setUserChoices] = useStorage<{ [key: string]: string }>('SIDE_HUSTLE_CHOICES', {});

    useEffect(() => {
        const shuffled = [...sideHustleOptions].sort(() => Math.random() - 0.5);
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
        } else if (currentScreen > 1 && currentScreen <= 6) {
            setCurrentScreen(currentScreen - 1);
        }
        scrollToTop();
    };

    const handleContinue = async () => {
        if (selectedOption === null || isTransitioning) return;

        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 150));

        const choiceIndex = currentScreen - 1;
        const currentChoice = randomizedChoices[choiceIndex];

        if (currentChoice) {
            const newChoices = { ...userChoices, [currentChoice.storyKey]: selectedOption };
            await setUserChoices(newChoices);
        }

        if (currentScreen < 5) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
        } else {
            setCurrentScreen(7);
        }
        scrollToTop();
        setIsTransitioning(false);
    };

    const handleContinueStory = () => {
        if (currentScreen < 12) {
            setCurrentScreen(currentScreen + 1);
        } else {
            onComplete();
        }
        scrollToTop();
    };

    const getStoryText = (screenNumber: number) => {
        switch (screenNumber) {
            case 7:
                return "Your Hustle, Your Rules";
            case 8:
                return `You decided to bring in extra cash through ${userChoices.hustle1?.toLowerCase()}. The flexible hours let you work around your dance schedule, and you love the variety.`;
            case 9:
                return `You decided to build your skills as a ${userChoices.hustle2?.toLowerCase()}. You love the creative challenge and the ability to work from anywhere on your own schedule. But it isn't quite enough.`;
            case 10:
                return `You dabble in ${userChoices.hustle3?.toLowerCase()} and start learning more about ${userChoices.hustle4?.toLowerCase()}. You're not only making extra money that you put into savings but you're learning valuable skills for the future.`;
            case 11:
                return `In the meantime, you take one of your other passions and start ${getStoryMapping(userChoices.hustle5 || '').toLowerCase()}. It feels amazing to finally have some agency in your life and build other income streams while you're still dancing.`;
            case 12:
                return "How does that feel? This isn't a far-off fantasy. This is what's possible when you direct your famous dancer discipline toward other goals.\n\nYour first step is simple: pick one side hustle from your choices and research how to get started this week. You don't have to commit forever, just try it.\n\nCome back tomorrow for more.";
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

                            <Text style={commonStyles.introTitle}>Side Hustle Scorecard</Text>

                            <Text style={commonStyles.introDescription}>
                                Your financial goals need fuel. A side hustle is a powerful way to generate extra cash to build your future, fast.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                This is a game of instincts. Choose the side gigs that sound most appealing to you. We'll use your choices to show you the impact that extra income can have.
                            </Text>

                            <JournalEntrySection
                                pathTag="financial-futureproofing"
                                day="2"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Side Hustle Scorecard"
                                journalInstruction="Before we begin, let's take a moment to check in with yourself. How are you feeling about exploring side hustle opportunities?"
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

                            <Text style={commonStyles.introTitle}>Side Hustle Scorecard</Text>

                            <Text style={commonStyles.introDescription}>
                                This is a game of instincts. Choose the side gigs that sound most appealing to you. We'll use your choices to show you the impact that extra income can have.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Don't overthink it! There's no right or wrong.
                            </Text>

                            <PrimaryButton title="Begin" onPress={() => setCurrentScreen(1)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Choice Screens (1-5) - UPDATED WITH HIGHLIGHT AND CONTINUE BUTTON
    if (currentScreen >= 1 && currentScreen <= 5) {
        const choiceIndex = currentScreen - 1;
        const currentChoice = randomizedChoices[choiceIndex];

        if (!currentChoice) return null;

        return (
            <View style={commonStyles.container}>
                <StickyHeader
                    onBack={goBack}
                    title={`${currentScreen} of 5`}
                    progress={currentScreen / 5}
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

    // Story Screens (7-12)
    if (currentScreen >= 7 && currentScreen <= 12) {
        const storyText = getStoryText(currentScreen);
        const isTitle = currentScreen === 7;
        const isFinal = currentScreen === 12;

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
                                    {isFinal && (
                                        <View style={styles.finalHeader}>
                                            <TrendingUp size={24} color="#928490" />
                                            <Text style={styles.finalHeading}>How does that feel?</Text>
                                            <TrendingUp size={24} color="#928490" />
                                        </View>
                                    )}
                                    <Text style={styles.storyText}>{storyText}</Text>
                                </View>
                            )}

                            {isFinal && (
                                <JournalEntrySection
                                    pathTag="financial-futureproofing"
                                    day="2"
                                    category="finance"
                                    pathTitle="Money Mindsets"
                                    dayTitle="Side Hustle Scorecard"
                                    journalInstruction="Before we bring today's session to a close, let's take a moment to check in with yourself again. How are you feeling after exploring side hustle possibilities?"
                                    moodLabel=""
                                    saveButtonText="Save Entry"
                                />
                            )}

                            <Text style={styles.alternativeClosing}>
                                {isFinal ? 'Come back tomorrow for more.' : ''}
                            </Text>

                            <PrimaryButton
                                title={isFinal ? 'Mark As Complete' : 'Continue'}
                                onPress={handleContinueStory}
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
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        marginTop: 0,
        fontWeight: '600',
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
});