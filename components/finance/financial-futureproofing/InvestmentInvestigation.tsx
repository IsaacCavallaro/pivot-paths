import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { ChevronRight, ArrowLeft, TrendingUp } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { useStorage } from '@/hooks/useStorage';

interface InvestmentPair {
    id: number;
    term: string;
    definition: string;
}

interface InvestmentInvestigationProps {
    onComplete: () => void;
    onBack?: () => void;
}

const investmentPairs: InvestmentPair[] = [
    {
        id: 1,
        term: "401(k)/403(b)",
        definition: "An employer-sponsored retirement account. The biggest perk is often the company match."
    },
    {
        id: 2,
        term: "Roth IRA",
        definition: "A retirement account you fund with after-tax money. Your investments grow completely tax-free."
    },
    {
        id: 3,
        term: "ETF / Index Fund",
        definition: "A single investment that automatically holds hundreds of companies. It's built for diversification."
    },
    {
        id: 4,
        term: "Stocks (Shares)",
        definition: "A piece of ownership in a single company. High potential growth, but higher risk."
    },
    {
        id: 5,
        term: "Health Savings Account (HSA)",
        definition: "An account for medical expenses. It's the only account that is triple-tax-advantaged."
    },
    {
        id: 6,
        term: "Cryptocurrency",
        definition: "A highly volatile, decentralized digital asset. It's considered a speculative investment."
    },
    {
        id: 7,
        term: "High-Yield Savings Account",
        definition: "A safe place for your cash that earns a much higher interest rate than a standard bank account."
    }
];

export default function InvestmentInvestigation({ onComplete, onBack }: InvestmentInvestigationProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'term' | 'definition' }>>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showMismatch, setShowMismatch] = useState(false);

    const [investmentMatchedPairs, setInvestmentMatchedPairs] = useStorage<number[]>('INVESTMENT_MATCHED_PAIRS', []);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    // Ensure investmentMatchedPairs is always an array
    const matchedPairs = Array.isArray(investmentMatchedPairs) ? investmentMatchedPairs : [];

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
            await setInvestmentMatchedPairs([]);
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
        const firstThreePairs = investmentPairs.slice(0, 3);
        const terms: Array<{ id: string; text: string; pairId: number; type: 'term' | 'definition' }> = [];
        const definitions: Array<{ id: string; text: string; pairId: number; type: 'term' | 'definition' }> = [];

        firstThreePairs.forEach(pair => {
            terms.push({
                id: `term_${pair.id}`,
                text: pair.term,
                pairId: pair.id,
                type: 'term'
            });
            definitions.push({
                id: `definition_${pair.id}`,
                text: pair.definition,
                pairId: pair.id,
                type: 'definition'
            });
        });

        const scrambledTerms = [...terms].sort(() => Math.random() - 0.5);
        const scrambledDefinitions = [...definitions].sort(() => Math.random() - 0.5);

        const allItems = [...scrambledTerms, ...scrambledDefinitions];
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
            await setInvestmentMatchedPairs(newMatchedPairs);

            setTimeout(() => {
                const remainingItems = gameItems.filter(item => !selected.includes(item.id));

                if (currentPairIndex < investmentPairs.length) {
                    const nextPair = investmentPairs[currentPairIndex];

                    const existingTerms = remainingItems.filter(item => item.type === 'term');
                    const existingDefinitions = remainingItems.filter(item => item.type === 'definition');

                    const newTerm = {
                        id: `term_${nextPair.id}`,
                        text: nextPair.term,
                        pairId: nextPair.id,
                        type: 'term' as const
                    };
                    const newDefinition = {
                        id: `definition_${nextPair.id}`,
                        text: nextPair.definition,
                        pairId: nextPair.id,
                        type: 'definition' as const
                    };

                    const allTerms = [...existingTerms];
                    const allDefinitions = [...existingDefinitions];

                    const termInsertIndex = Math.floor(Math.random() * (allTerms.length + 1));
                    allTerms.splice(termInsertIndex, 0, newTerm);

                    const definitionInsertIndex = Math.floor(Math.random() * (allDefinitions.length + 1));
                    allDefinitions.splice(definitionInsertIndex, 0, newDefinition);

                    const newItems = [...allTerms, ...allDefinitions];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                if (newMatchedPairs.length === investmentPairs.length) {
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

                            <Text style={commonStyles.introTitle}>Welcome to Investment Investigation!</Text>

                            <Text style={commonStyles.introDescription}>
                                Building wealth means knowing both where to put your money (your accounts) and what to put in it (your investments).
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Today, we're exploring the fundamental building blocks of investing to help you become a more confident investor.
                            </Text>

                            <View style={styles.learningBox}>
                                <Text style={styles.learningBoxTitle}>What You'll Learn:</Text>
                                <Text style={styles.learningBoxItem}>• Key investment accounts and their benefits</Text>
                                <Text style={styles.learningBoxItem}>• Different types of investment vehicles</Text>
                                <Text style={styles.learningBoxItem}>• How to match the right investments to your goals</Text>
                            </View>

                            <Text style={styles.welcomeFooter}>
                                You'll be playing a match game to help you understand and remember these important financial concepts.
                            </Text>

                            <JournalEntrySection
                                pathTag="financial-futureproofing"
                                day="5"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Investment Investigations"
                                journalInstruction="Before we begin, let's take a moment to check in with your current knowledge. What investment terms are you already familiar with? What would you like to learn more about?"
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

                            <Text style={commonStyles.introTitle}>Investment Investigation</Text>

                            <Text style={commonStyles.introDescription}>
                                Let's match investment terms with their definitions to build your financial knowledge foundation.
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
                                Which investment concept was most surprising or new to you?
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Take a moment to reflect on what you've learned about different investment options.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                <Text style={styles.reflectionEmphasis}>(If you're having trouble recalling, feel free to go back and play the match game again)</Text>
                            </Text>

                            <JournalEntrySection
                                pathTag="financial-futureproofing"
                                journalInstruction="Which investment account or concept are you most interested in exploring further? Why does it appeal to you?"
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

                            <Text style={commonStyles.reflectionTitle}>You're Thinking Like an Investor!</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                This is not financial or investment advice. This game is simply an educational guide to basic definitions.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The right choices for you depend on your personal financial situation, goals, and risk tolerance. We strongly encourage you to use these definitions as a starting point for your own research or to consult with a qualified financial advisor before making any investment decisions.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Check out this additional resource to learn more about investment basics:
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
                title={`${matchedPairs.length}/${investmentPairs.length} pairs matched`}
                progress={matchedPairs.length / investmentPairs.length}
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
                        <Text style={styles.gameTitle}>Investment Investigation</Text>
                        <Text style={styles.gameInstructions}>
                            Tap to match investment terms with their definitions
                        </Text>

                        <View style={styles.columnsContainer}>
                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>The Term</Text>
                                {gameItems.filter(item => item.type === 'term').map((item) => (
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
                                <Text style={styles.columnTitle}>What It Means</Text>
                                {gameItems.filter(item => item.type === 'definition').map((item) => (
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