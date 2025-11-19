import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { useStorage } from '@/hooks/useStorage';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface CareerChoice {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface ExpandYourHorizonsProps {
    onComplete: () => void;
    onBack?: () => void;
}

const careerChoices: CareerChoice[] = [
    {
        id: 1,
        option1: 'Working with people',
        option2: 'Working with numbers',
        storyKey: 'workStyle'
    },
    {
        id: 2,
        option1: 'A job with creativity at its core',
        option2: 'A job that solves problems',
        storyKey: 'approach'
    },
    {
        id: 3,
        option1: 'Helping individuals one-on-one',
        option2: 'Designing systems that help many people at once',
        storyKey: 'impact'
    },
    {
        id: 4,
        option1: 'A structured office role',
        option2: 'A flexible, self-directed role',
        storyKey: 'structure'
    },
    {
        id: 5,
        option1: 'A job where you\'re constantly learning',
        option2: 'A job where you\'re the expert, teaching others',
        storyKey: 'learning'
    },
    {
        id: 6,
        option1: 'Stability and long-term security',
        option2: 'Adventure and variety',
        storyKey: 'lifestyle'
    },
    {
        id: 7,
        option1: 'A role tied closely to the arts',
        option2: 'A role that stretches you into a brand-new industry',
        storyKey: 'industry'
    },
    {
        id: 8,
        option1: 'A behind-the-scenes role',
        option2: 'A front-facing role with lots of interaction',
        storyKey: 'visibility'
    },
    {
        id: 9,
        option1: 'Building something new',
        option2: 'Joining something established',
        storyKey: 'environment'
    }
];

// Mapping function to convert choices to their story representations
const getStoryMapping = (choice: string, storyKey: string): string => {
    const mappings: { [key: string]: string } = {
        'A job with creativity at its core': 'a job with creativity at its core',
        'A job that solves problems': 'a job that solves logical problems',
        'A job where you\'re constantly learning': 'constantly learning',
        'A job where you\'re the expert, teaching others': 'teaching others as the expert',
        'A behind-the-scenes role': 'a behind-the-scenes role',
        'A front-facing role with lots of interaction': 'a front-facing, interactive role'
    };

    return mappings[choice] || choice.toLowerCase();
};

export default function ExpandYourHorizons({ onComplete, onBack }: ExpandYourHorizonsProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [randomizedChoices, setRandomizedChoices] = useState<CareerChoice[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('expand-your-horizons');
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('expand-your-horizons');
    const [expandHorizonsChoices, setExpandHorizonsChoices] = useStorage<{ [key: string]: string }>('EXPAND_HORIZONS_CHOICES', {});

    useEffect(() => {
        const shuffled = [...careerChoices].sort(() => Math.random() - 0.5);
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

        const newChoices = { ...expandHorizonsChoices, [choiceKey]: selectedOption };
        await setExpandHorizonsChoices(newChoices);

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
            const newChoices = { ...expandHorizonsChoices, [currentChoice.storyKey]: selectedOption };
            await setExpandHorizonsChoices(newChoices);
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

    const openYouTubeShort = async () => {
        const youtubeUrl = `https://www.youtube.com/shorts/H9DMFyi8voM`;

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

    const getStoryText = (screenNumber: number) => {
        switch (screenNumber) {
            case 11:
                return "Explore Your Horizons";
            case 12:
                return `You're excited (and to be honest, a bit nervous) about starting your new job ${getStoryMapping(expandHorizonsChoices.workStyle || '', 'workStyle')} after performing full-time for so long. But instantly, you realize that this is a place where your skills could shine.`;
            case 13:
                return `You're thrilled by the idea of ${getStoryMapping(expandHorizonsChoices.approach || '', 'approach')} and realize that life off the stage isn't so bad after all.`;
            case 14:
                return `You're making an impact and ${getStoryMapping(expandHorizonsChoices.impact || '', 'impact')}. The way you create value might look different than before, but isn't any less meaningful.`;
            case 15:
                return `You're in ${getStoryMapping(expandHorizonsChoices.structure || '', 'structure')} and your day-to-day life is no longer dictated by scarcity and chaos like it was when you were a dancer.`;
            case 16:
                return `In this new role, you're ${getStoryMapping(expandHorizonsChoices.learning || '', 'learning')} and you feel prepared because your dance background taught you discipline and resourcefulness.`;
            case 17:
                return `You've been craving ${getStoryMapping(expandHorizonsChoices.lifestyle || '', 'lifestyle')} and you've finally found it by stepping into this new chapter.`;
            case 18:
                return `You're in ${getStoryMapping(expandHorizonsChoices.industry || '', 'industry')} as you continue to rediscover who you actually are in the workplace.`;
            case 19:
                return `You're thriving in ${getStoryMapping(expandHorizonsChoices.visibility || '', 'visibility')} and giving your best in a role that fits exactly who you are.`;
            case 20:
                return `You're excited to be ${getStoryMapping(expandHorizonsChoices.environment || '', 'environment')} and ready to take on the amazing opportunities available to you.`;
            case 21:
                return "You've started mapping out the landscape of possibilities off the stage without pressure, just curiosity. Every small choice you've made is a clue about what excites you most. Remember: career pivots don't have to look one way. The more you explore, the more options you'll uncover.";
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

                            <Text style={commonStyles.introTitle}>Expand Your Horizons</Text>

                            <Text style={commonStyles.introDescription}>
                                This is a game of instincts to help you open your mind to careers you may have never considered. Pick the answer that sparks your curiosity most. There are no wrong choices!
                            </Text>

                            <JournalEntrySection
                                pathTag="expand-your-horizons"
                                journalInstruction="Before we begin, let's take a moment to check in with yourself. How are you feeling about exploring new career possibilities?"
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

                            <Text style={commonStyles.introTitle}>Expand Your Horizons</Text>

                            <Text style={commonStyles.introDescription}>
                                This is a game of instincts to help you open your mind to careers you may have never considered. Pick the answer that sparks your curiosity most. There are no wrong choices!
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

    // Story Screens (11-21)
    if (currentScreen >= 11 && currentScreen <= 21) {
        const storyText = getStoryText(currentScreen);
        const isTitle = currentScreen === 11;
        const isFinal = currentScreen === 21;

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

                            {/* Added YouTube Short Thumbnail */}
                            {isFinal && (
                                <TouchableOpacity
                                    style={styles.videoThumbnailContainer}
                                    onPress={openYouTubeShort}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={{ uri: 'https://img.youtube.com/vi/H9DMFyi8voM/maxresdefault.jpg' }}
                                        style={styles.videoThumbnail}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.playButtonOverlay}>
                                        <View style={styles.playButton}>
                                            <Text style={styles.playIcon}>▶</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}

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

    // Reflection Screen (now screen 22)
    if (currentScreen === 22) {
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

                            <Text style={commonStyles.reflectionTitle}>Expanding Your Career Possibilities</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Perhaps some of these career paths feel unfamiliar or even intimidating? But the goal is to give yourself permission to explore beyond what you already know.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                This is just an exercise in opening your mind to the vast landscape of opportunities available to someone with your unique skills and background.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Every time you allow yourself to consider a different path, you're expanding your horizons and creating more possibilities for your future.
                            </Text>

                            <PrimaryButton title="Continue" onPress={handleContinueStory} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen (now screen 23) with End of Day Journal
    if (currentScreen === 23) {
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
                                    Take a moment to notice how you're feeling right now. Are you curious? Overwhelmed? Excited about new possibilities?
                                </Text>

                                <Text style={styles.storyText}>
                                    If any part of you thought "I could never do that" - that's exactly the kind of limiting belief we're working to overcome.
                                </Text>

                                <Text style={styles.storyText}>
                                    Remember that your dance background has given you unique strengths that are valuable in many different fields.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="expand-your-horizons"
                                journalInstruction="Before we bring today's session to a close, let's take a moment to check in with yourself again. How are you feeling after exploring these new career possibilities?"
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
        backgroundColor: '#FF0000', // YouTube red
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
        marginLeft: 4, // Slight offset to center the play icon
    },
});