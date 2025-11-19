import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight, Target, ArrowLeft, Check } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { useStorage } from '@/hooks/useStorage';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface PlanChoice {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface MakeYourPlanProps {
    onComplete: () => void;
    onBack?: () => void;
}

const planChoices: PlanChoice[] = [
    {
        id: 1,
        option1: 'I want to start my career change now',
        option2: 'I want to start my career change soon',
        storyKey: 'timing'
    },
    {
        id: 2,
        option1: 'I have a clear direction and goal',
        option2: 'I\'m honestly lost',
        storyKey: 'direction'
    },
    {
        id: 3,
        option1: 'I have the skills I need to pivot',
        option2: 'I\'ll need to upskill for sure',
        storyKey: 'skills'
    },
    {
        id: 4,
        option1: 'I have a strong network outside of dance',
        option2: 'I don\'t have many non-dance connections',
        storyKey: 'network'
    },
    {
        id: 5,
        option1: 'I have some savings stashed away',
        option2: 'I\'m living paycheck to paycheck',
        storyKey: 'finances'
    },
    {
        id: 6,
        option1: 'I have a Bachelor\'s degree',
        option2: 'I never went to college/university',
        storyKey: 'education'
    },
    {
        id: 7,
        option1: 'I live in a big city like New York or London',
        option2: 'I live somewhere with fewer opportunities',
        storyKey: 'location'
    },
    {
        id: 8,
        option1: 'I have a support system around me',
        option2: 'I\'m pretty isolated at the moment',
        storyKey: 'support'
    },
    {
        id: 9,
        option1: 'I\'ve worked on my non-dance resume already',
        option2: 'I still only have a dance resume',
        storyKey: 'resume'
    },
    {
        id: 10,
        option1: 'I feel ready to take on my pivot',
        option2: 'I\'m nervous about starting this career change',
        storyKey: 'readiness'
    }
];

export default function MakeYourPlan({ onComplete, onBack }: MakeYourPlanProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [randomizedChoices, setRandomizedChoices] = useState<PlanChoice[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('prep-your-pivot');
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('prep-your-pivot');
    const [makeYourPlanChoices, setMakeYourPlanChoices] = useStorage<{ [key: string]: string }>('MAKE_YOUR_PLAN_CHOICES', {});

    useEffect(() => {
        const shuffled = [...planChoices].sort(() => Math.random() - 0.5);
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

        const newChoices = { ...makeYourPlanChoices, [choiceKey]: selectedOption };
        await setMakeYourPlanChoices(newChoices);

        if (currentScreen < 10) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
        } else {
            setCurrentScreen(12);
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
            const newChoices = { ...makeYourPlanChoices, [currentChoice.storyKey]: selectedOption };
            await setMakeYourPlanChoices(newChoices);
        }

        if (currentScreen < 10) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
        } else {
            setCurrentScreen(12);
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

    const getStoryText = (screenNumber: number) => {
        switch (screenNumber) {
            case 12:
                return "Make Your Plan";
            case 13:
                return `${makeYourPlanChoices.timing === 'I want to start my career change now' ? 'You\'re ready to start your career change which is so exciting.' : 'You\'re not quite ready to start your career change which is completely ok.'} ${makeYourPlanChoices.direction === 'I have a clear direction and goal' ? 'And the good news is, you have a clear vision for your future with a solid goal to aim for.' : 'But you\'re feeling a little lost and directionless. Start with your interests and values to discover what path you might want to go down.'}`;
            case 14:
                return `${makeYourPlanChoices.skills === 'I have the skills I need to pivot' ? 'You already have the skills you need to launch your next career.' : 'You\'ll definitely need to upskill so YouTube, Skillshare, and Udemy will become your best friends.'} ${makeYourPlanChoices.network === 'I have a strong network outside of dance' ? 'And your strong connections outside of dance will be so important in this transition. Reach out to your network!' : 'But, it\'s important to start building a network outside of dance. Go to events, find an internship, or talk to people in other departments at work.'} It's the best way to find new opportunities!`;
            case 15:
                return `${makeYourPlanChoices.finances === 'I have some savings stashed away' ? 'Your savings will be a godsend during your transition. Invest in courses and networking events to give yourself a leg up.' : 'It\'s tough living paycheck to paycheck, but now\'s the time to really cut back on expenses and save up as much as humanly possible.'} ${makeYourPlanChoices.education === 'I have a Bachelor\'s degree' ? 'And since you already have a degree, leverage it in your new career. Completing a degree is an accomplishment in and of itself, regardless of the subject matter.' : 'And no degree? Start with free and low-cost learning options like YouTube and Udemy first. Then, if you\'re in the U.S., check out the LEAP program which offers college credit for professional dance experience!'}`;
            case 16:
                return `${makeYourPlanChoices.location === 'I live in a big city like New York or London' ? 'In a big city, the opportunities are boundless. Get out there!' : 'In a place with fewer opportunities, consider remote work to get your foot in the door with bigger companies.'} ${makeYourPlanChoices.support === 'I have a support system around me' ? 'You\'ll also want to prep your support system that you\'re embarking on a big change. You\'re going to need them!' : 'Focus on building your relationships now. A strong support system is key to any major life change.'}`;
            case 17:
                return `${makeYourPlanChoices.resume === 'I\'ve worked on my non-dance resume already' ? 'Your muggle resume is locked and loaded. Good work!' : 'Find the transferable skills within your dance resume and find a Canva template to bring your muggle resume to life!'} ${makeYourPlanChoices.readiness === 'I feel ready to take on my pivot' ? 'You are SO ready to step onto your next stage!' : 'It\'s ok to be nervous but what if you reframed that feeling into excitement? Nerves just mean that something is important to you and you\'re stepping into the unknown. Give yourself permission to take the next step.'}`;
            case 18:
                return "Now you have a game plan and all that's left to do is follow-through. You know what you have to work on so it's time to get going! Go deeper with our Happy Trials, a 5-year career change roadmap for before, during, and after your pivot.";
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

                            <Text style={commonStyles.introTitle}>Prep Your Pivot</Text>

                            <Text style={commonStyles.introDescription}>
                                Welcome to Day 1 of your career transition journey. This is where we'll help you create a personalized game plan based on your current situation.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Before we begin planning your pivot, let's check in with where you're starting from.
                            </Text>

                            <JournalEntrySection
                                pathTag="prep-your-pivot"
                                day="1"
                                category="Career Transitions"
                                pathTitle="Prep Your Pivot"
                                dayTitle="Make Your Plan"
                                journalInstruction="Before we begin planning your career pivot, take a moment to reflect on your current situation. What brings you to this point in your journey?"
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

                            <Text style={commonStyles.introTitle}>Make Your Plan</Text>

                            <Text style={commonStyles.introDescription}>
                                Choose the answer that best describes your situation to help you create your career game plan. But there's no right or wrong! It's just your starting point and we'll build from there.
                            </Text>

                            <PrimaryButton title="Let's plan" onPress={() => setCurrentScreen(1)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Choice Screens (1-10) - UPDATED WITH HIGHLIGHT AND CONTINUE BUTTON
    if (currentScreen >= 1 && currentScreen <= 10) {
        const choiceIndex = currentScreen - 1;
        const currentChoice = randomizedChoices[choiceIndex];

        if (!currentChoice) return null;

        return (
            <View style={commonStyles.container}>
                <StickyHeader
                    onBack={goBack}
                    title={`${currentScreen} of 10`}
                    progress={currentScreen / 10}
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

    // Story Screens (12-18)
    if (currentScreen >= 12 && currentScreen <= 18) {
        const storyText = getStoryText(currentScreen);
        const isTitle = currentScreen === 12;
        const isFinal = currentScreen === 18;

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
                                title={isFinal ? 'Learn more' : 'Continue'}
                                onPress={handleContinueStory}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen (now screen 19) with End of Day Journal
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

                            <View style={styles.finalHeader}>
                                <Target size={24} color="#928490" />
                                <Text style={styles.finalHeading}>Start Your Pivot</Text>
                                <Target size={24} color="#928490" />
                            </View>

                            <View style={styles.storyTextContainer}>
                                <Text style={styles.storyText}>
                                    Now you have a game plan and all that's left to do is follow-through. You know what you have to work on so it's time to get going!
                                </Text>

                                <Text style={styles.storyText}>
                                    Remember that this is just the beginning of your journey. Every small step you take brings you closer to your new career.
                                </Text>

                                <Text style={styles.storyText}>
                                    Go deeper with our Happy Trials, a 5-year career change roadmap for before, during, and after your pivot.
                                </Text>
                            </View>

                            <Text style={styles.alternativeClosing}>
                                Ready to dive deeper into your career change?
                            </Text>

                            <JournalEntrySection
                                pathTag="prep-your-pivot"
                                journalInstruction="As you complete Day 1, reflect on your personalized game plan. What feels most achievable? What areas will need the most attention?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

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
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        marginTop: 20,
        fontWeight: '600',
    },
});