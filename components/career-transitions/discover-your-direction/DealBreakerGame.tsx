import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ChevronRight, ArrowLeft } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useStorage } from '@/hooks/useStorage';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

interface DealBreakerPair {
    id: number;
    dealBreaker: string;
    environment: string;
}

interface DealBreakerGameProps {
    onComplete: () => void;
    onBack?: () => void;
}

const dealBreakerPairs: DealBreakerPair[] = [
    {
        id: 1,
        dealBreaker: "No creative freedom",
        environment: "Rigid, highly structured corporate roles"
    },
    {
        id: 2,
        dealBreaker: "Low flexibility",
        environment: "Jobs with strict 9–5 schedules and no hybrid options"
    },
    {
        id: 3,
        dealBreaker: "Constant public scrutiny",
        environment: "Front-facing client roles or media positions"
    },
    {
        id: 4,
        dealBreaker: "Minimal social interaction",
        environment: "Remote or solitary work without collaboration"
    },
    {
        id: 5,
        dealBreaker: "Unclear expectations",
        environment: "Roles with no defined processes or guidance"
    },
    {
        id: 6,
        dealBreaker: "Repetitive tasks",
        environment: "Roles with limited variety or creativity like data entry or admin"
    },
    {
        id: 7,
        dealBreaker: "Lack of growth opportunities",
        environment: "Positions with little training or promotion potential"
    },
    {
        id: 8,
        dealBreaker: "Low autonomy",
        environment: "Jobs requiring constant supervision"
    }
];

export default function DealBreakerGame({ onComplete, onBack }: DealBreakerGameProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'dealBreaker' | 'environment' }>>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showMismatch, setShowMismatch] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const [dealBreakerMatchedPairs, setDealBreakerMatchedPairs] = useStorage<number[]>('DEAL_BREAKER_MATCHED_PAIRS', []);

    // Ensure dealBreakerMatchedPairs is always an array
    const matchedPairs = Array.isArray(dealBreakerMatchedPairs) ? dealBreakerMatchedPairs : [];

    // Scroll to top whenever screen changes
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
            await setDealBreakerMatchedPairs([]); // Reset matched pairs in storage
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
        // Start with first 3 pairs, scrambled
        const firstThreePairs = dealBreakerPairs.slice(0, 3);
        const dealBreakers: Array<{ id: string; text: string; pairId: number; type: 'dealBreaker' | 'environment' }> = [];
        const environments: Array<{ id: string; text: string; pairId: number; type: 'dealBreaker' | 'environment' }> = [];

        firstThreePairs.forEach(pair => {
            dealBreakers.push({
                id: `dealBreaker_${pair.id}`,
                text: pair.dealBreaker,
                pairId: pair.id,
                type: 'dealBreaker'
            });
            environments.push({
                id: `environment_${pair.id}`,
                text: pair.environment,
                pairId: pair.id,
                type: 'environment'
            });
        });

        // Scramble deal breakers and environments separately to avoid same-row alignment
        const scrambledDealBreakers = [...dealBreakers].sort(() => Math.random() - 0.5);
        const scrambledEnvironments = [...environments].sort(() => Math.random() - 0.5);

        // Combine into single array for game logic
        const allItems = [...scrambledDealBreakers, ...scrambledEnvironments];
        setGameItems(allItems);
        setCurrentPairIndex(3); // Next pair to add
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
            // Match found!
            const newMatchedPairs = [...matchedPairs, item1.pairId];
            await setDealBreakerMatchedPairs(newMatchedPairs);

            // Remove matched items and add new pair if available
            setTimeout(() => {
                const remainingItems = gameItems.filter(item => !selected.includes(item.id));

                // Add next pair if available
                if (currentPairIndex < dealBreakerPairs.length) {
                    const nextPair = dealBreakerPairs[currentPairIndex];

                    // Separate existing items by type
                    const existingDealBreakers = remainingItems.filter(item => item.type === 'dealBreaker');
                    const existingEnvironments = remainingItems.filter(item => item.type === 'environment');

                    // Add new deal breaker and environment
                    const newDealBreaker = {
                        id: `dealBreaker_${nextPair.id}`,
                        text: nextPair.dealBreaker,
                        pairId: nextPair.id,
                        type: 'dealBreaker' as const
                    };
                    const newEnvironment = {
                        id: `environment_${nextPair.id}`,
                        text: nextPair.environment,
                        pairId: nextPair.id,
                        type: 'environment' as const
                    };

                    // Randomly insert new items to avoid predictable positioning
                    const allDealBreakers = [...existingDealBreakers];
                    const allEnvironments = [...existingEnvironments];

                    // Insert new deal breaker at random position
                    const dealBreakerInsertIndex = Math.floor(Math.random() * (allDealBreakers.length + 1));
                    allDealBreakers.splice(dealBreakerInsertIndex, 0, newDealBreaker);

                    // Insert new environment at random position
                    const environmentInsertIndex = Math.floor(Math.random() * (allEnvironments.length + 1));
                    allEnvironments.splice(environmentInsertIndex, 0, newEnvironment);

                    const newItems = [...allDealBreakers, ...allEnvironments];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                // Check if game is complete
                if (newMatchedPairs.length === dealBreakerPairs.length) {
                    setTimeout(() => {
                        setCurrentScreen(2);
                    }, 500);
                }
            }, 600);
        } else {
            // No match - show red briefly
            setShowMismatch(true);
            setTimeout(() => {
                setShowMismatch(false);
                setSelectedItems([]);
            }, 800);
        }
    };

    const getItemStyle = (itemId: string) => {
        const isSelected = selectedItems.includes(itemId);
        const item = gameItems.find(item => item.id === itemId);
        const isMatched = item && matchedPairs.includes(item.pairId);

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

                            <Text style={commonStyles.introTitle}>Welcome Back!</Text>

                            <Text style={commonStyles.introDescription}>
                                Today, we're exploring deal breakers - those non-negotiable factors that can make or break your satisfaction in a career.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Understanding what you won't accept is just as important as knowing what you do want. This clarity will help you evaluate opportunities with confidence.
                            </Text>

                            <View style={styles.learningBox}>
                                <Text style={styles.learningBoxTitle}>What You'll Discover:</Text>
                                <Text style={styles.learningBoxItem}>• Your personal deal breakers in work environments</Text>
                                <Text style={styles.learningBoxItem}>• Types of situations to avoid in your career search</Text>
                                <Text style={styles.learningBoxItem}>• How to protect your wellbeing and values</Text>
                            </View>

                            <Text style={styles.welcomeFooter}>
                                You'll be playing a match game to help identify deal breakers and the environments they align with.
                            </Text>

                            <JournalEntrySection
                                pathTag="map-your-direction"
                                day="6"
                                category="Career Transitions"
                                pathTitle="Map Your Direction"
                                dayTitle="Deal Breakers"
                                journalInstruction="Before we begin, reflect on your past experiences. What work situations have made you feel drained or unhappy? What environments have felt energizing?"
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

                            <Text style={commonStyles.introTitle}>Deal Breakers</Text>

                            <Text style={commonStyles.introDescription}>
                                Match each deal breaker with the type of work environment or situation it aligns with. These will be the circumstances to avoid.
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

                            <Text style={commonStyles.reflectionTitle}>Take a moment to reflect</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Which deal breakers stood out to you the most?
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                How might these influence your career choices?
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Did you notice that a lot of what you might consider deal breakers in other industries actually already exist in your dance career?
                            </Text>

                            <JournalEntrySection
                                pathTag="discover-dream-life"
                                journalInstruction="Reflect on your deal breakers. Which ones feel most important to you? Are there any that surprised you?"
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

    // Congratulations Screen
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

                            <Text style={commonStyles.reflectionTitle}>Great Work!</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Knowing what you won't accept is just as important as knowing what you do want. Use these insights to guide your next steps and evaluate new opportunities with clarity and confidence.
                            </Text>

                            <Text style={styles.reflectionClosing}>
                                See you tomorrow for the final step!
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
                title={`${matchedPairs.length}/${dealBreakerPairs.length} pairs matched`}
                progress={matchedPairs.length / dealBreakerPairs.length}
            />

            <ScrollView
                ref={scrollViewRef}
                style={commonStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                onContentSizeChange={() => scrollToTop()}
                onLayout={() => scrollToTop()}
            >
                <View style={styles.centeredContent}>
                    <Card style={commonStyles.baseCard}>
                        <Text style={styles.gameTitle}>Deal Breakers</Text>
                        <Text style={styles.gameInstructions}>
                            Tap to match deal breakers with their environments
                        </Text>

                        <View style={styles.columnsContainer}>
                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>Deal Breaker</Text>
                                {gameItems.filter(item => item.type === 'dealBreaker').map((item) => (
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
                                <Text style={styles.columnTitle}>Environment</Text>
                                {gameItems.filter(item => item.type === 'environment').map((item) => (
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
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 30,
        marginTop: 50,
    },
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
        fontSize: 16,
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
        height: 140,
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
    reflectionClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '600',
    },
});