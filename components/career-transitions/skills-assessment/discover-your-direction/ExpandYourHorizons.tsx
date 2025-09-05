import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Compass, ArrowLeft, ChevronLeft } from 'lucide-react-native';

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
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-9 = choices, 10-20 = story
    const [choices, setChoices] = useState<{ [key: string]: string }>({});
    const [randomizedChoices, setRandomizedChoices] = useState<CareerChoice[]>([]);

    useEffect(() => {
        // Randomize the order of choices when component mounts
        const shuffled = [...careerChoices].sort(() => Math.random() - 0.5);
        setRandomizedChoices(shuffled);
    }, []);

    const handleStartGame = () => {
        setCurrentScreen(1);
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const goBack = () => {
        if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    const handleChoice = (choiceKey: string, selectedOption: string) => {
        const newChoices = { ...choices, [choiceKey]: selectedOption };
        setChoices(newChoices);

        if (currentScreen < 9) {
            setCurrentScreen(currentScreen + 1);
        } else {
            // Skip to story screen 11 (Explore Your Horizons)
            setCurrentScreen(11);
        }
    };

    const handleContinueStory = () => {
        if (currentScreen < 21) {
            setCurrentScreen(currentScreen + 1);
        } else {
            onComplete();
        }
    };

    const getStoryText = (screenNumber: number) => {
        switch (screenNumber) {
            case 11:
                return "Explore Your Horizons";
            case 12:
                return `You're excited (and to be honest, a bit nervous) about starting your new job ${getStoryMapping(choices.workStyle || '', 'workStyle')} after performing full-time for so long. But instantly, you realize that this is a place where your skills could shine.`;
            case 13:
                return `You're thrilled by the idea of ${getStoryMapping(choices.approach || '', 'approach')} and realize that life off the stage isn't so bad after all.`;
            case 14:
                return `You're making an impact and ${getStoryMapping(choices.impact || '', 'impact')}. The way you create value might look different than before, but isn't any less meaningful.`;
            case 15:
                return `You're in ${getStoryMapping(choices.structure || '', 'structure')} and your day-to-day life is no longer dictated by scarcity and chaos like it was when you were a dancer.`;
            case 16:
                return `In this new role, you're ${getStoryMapping(choices.learning || '', 'learning')} and you feel prepared because your dance background taught you discipline and resourcefulness.`;
            case 17:
                return `You've been craving ${getStoryMapping(choices.lifestyle || '', 'lifestyle')} and you've finally found it by stepping into this new chapter.`;
            case 18:
                return `You're in ${getStoryMapping(choices.industry || '', 'industry')} as you continue to rediscover who you actually are in the workplace.`;
            case 19:
                return `You're thriving in ${getStoryMapping(choices.visibility || '', 'visibility')} and giving your best in a role that fits exactly who you are.`;
            case 20:
                return `You're excited to be ${getStoryMapping(choices.environment || '', 'environment')} and ready to take on the amazing opportunities available to you.`;
            case 21:
                return "You've started mapping out the landscape of possibilities off the stage without pressure, just curiosity. Every small choice you've made is a clue about what excites you most. Remember: career pivots don't have to look one way. The more you explore, the more options you'll uncover.";
            default:
                return "";
        }
    };

    // Intro Screen
    if (currentScreen === 0) {
        return (
            <View style={styles.container}>
                {onBack && (
                    <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                        <ArrowLeft size={28} color="#647C90" />
                    </TouchableOpacity>
                )}
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <Compass size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Expand Your Horizons</Text>

                    <Text style={styles.introDescription}>
                        This is a game of instincts to help you open your mind to careers you may have never considered. Pick the answer that sparks your curiosity most. There are no wrong choices!
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Start exploring</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Choice Screens (1-9)
    if (currentScreen >= 1 && currentScreen <= 9) {
        const choiceIndex = currentScreen - 1;
        const currentChoice = randomizedChoices[choiceIndex];

        if (!currentChoice) return null;

        return (
            <View style={styles.container}>
                <View style={styles.choiceHeader}>
                    <Text style={styles.choiceProgress}>
                        {currentScreen} of 9
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(currentScreen / 9) * 100}%` }]} />
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.choiceContainer}>
                    <View style={styles.choiceButtons}>
                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoice(currentChoice.storyKey, currentChoice.option1)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.choiceButtonText}>{currentChoice.option1}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoice(currentChoice.storyKey, currentChoice.option2)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.choiceButtonText}>{currentChoice.option2}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <ChevronLeft size={24} color="#647C90" />
                    <Text style={styles.backButtonText}>
                        {currentScreen === 1 ? 'Back to Intro' : 'Previous'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Story Screens (11-21)
    if (currentScreen >= 11 && currentScreen <= 21) {
        const storyText = getStoryText(currentScreen);
        const isTitle = currentScreen === 11;
        const isFinal = currentScreen === 21;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.storyContainer}>
                    {isFinal && (
                        <Text style={styles.finalHeading}>Expand Your Horizons</Text>
                    )}

                    {isTitle ? (
                        <Text style={styles.storyTitle}>{storyText}</Text>
                    ) : (
                        <Text style={styles.storyText}>{storyText}</Text>
                    )}

                    <Text style={styles.alternativeClosing}>
                        {isFinal ? 'See you tomorrow!' : ''}
                    </Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinueStory}>
                        <View
                            style={[styles.continueButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.continueButtonText}>
                                {isFinal ? 'Mark as complete' : 'Continue'}
                            </Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0',
    },
    alternativeClosing: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 40,
    },
    topBackButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        zIndex: 1,
        padding: 8,
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
        fontStyle: 'italic',
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
    choiceHeader: {
        padding: 20,
        paddingTop: 60,
        alignItems: 'center',
    },
    choiceProgress: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#647C90',
        marginBottom: 10,
    },
    progressBar: {
        width: '80%',
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
    choiceContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
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
    choiceButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
    },
    storyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    storyTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 40,
    },
    storyText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 40,
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
    finalHeading: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
        width: '100%',
    },
});