import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { ChevronRight, ArrowLeft } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useStorage } from '@/hooks/useStorage';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

interface BeliefPair {
    id: number;
    scarcityThought: string;
    abundanceReframe: string;
}

interface ScarcityVsAbundanceProps {
    onComplete: () => void;
    onBack?: () => void;
}

const beliefPairs: BeliefPair[] = [
    {
        id: 1,
        scarcityThought: "I should be grateful for what I have.",
        abundanceReframe: "I can be grateful and still build wealth for myself and my family."
    },
    {
        id: 2,
        scarcityThought: "Money will always be tight.",
        abundanceReframe: "Money can be plentiful if I just learn how to manage it."
    },
    {
        id: 3,
        scarcityThought: "Negotiating makes me look greedy.",
        abundanceReframe: "Negotiating shows I value my time and talent."
    },
    {
        id: 4,
        scarcityThought: "There's only so much work to go around.",
        abundanceReframe: "There are endless ways to earn and create."
    },
    {
        id: 5,
        scarcityThought: "I can't afford to invest in myself.",
        abundanceReframe: "Investing in myself multiplies my opportunities."
    },
    {
        id: 6,
        scarcityThought: "If I earn more, others will have less.",
        abundanceReframe: "The more I earn, the more I can give and share."
    },
    {
        id: 7,
        scarcityThought: "Debt is a normal part of life.",
        abundanceReframe: "I deserve to live within my means and without the stress of debt."
    },
    {
        id: 8,
        scarcityThought: "I'll never catch up after past mistakes.",
        abundanceReframe: "I can learn, grow, and make better choices now."
    },
    {
        id: 9,
        scarcityThought: "Money stresses me out.",
        abundanceReframe: "Money gives me breathing room and clarity."
    },
    {
        id: 10,
        scarcityThought: "Being underpaid is normal and I'm used to it.",
        abundanceReframe: "It feels uncomfortable but I'm ready to earn more."
    }
];

export default function ScarcityVsAbundance({ onComplete, onBack }: ScarcityVsAbundanceProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: 'scarcityThought' | 'abundanceReframe' }>>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showMismatch, setShowMismatch] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const [scarcityMatchedPairs, setScarcityMatchedPairs] = useStorage<number[]>('SCARCITY_MATCHED_PAIRS', []);

    // Ensure we always have an array, even if storage returns null/undefined
    const matchedPairs = Array.isArray(scarcityMatchedPairs) ? scarcityMatchedPairs : [];

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
            await setScarcityMatchedPairs([]); // Reset matched pairs in storage
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
        const firstThreePairs = beliefPairs.slice(0, 3);
        const scarcityThoughts: Array<{ id: string; text: string; pairId: number; type: 'scarcityThought' | 'abundanceReframe' }> = [];
        const abundanceReframes: Array<{ id: string; text: string; pairId: number; type: 'scarcityThought' | 'abundanceReframe' }> = [];

        firstThreePairs.forEach(pair => {
            scarcityThoughts.push({
                id: `scarcityThought_${pair.id}`,
                text: pair.scarcityThought,
                pairId: pair.id,
                type: 'scarcityThought'
            });
            abundanceReframes.push({
                id: `abundanceReframe_${pair.id}`,
                text: pair.abundanceReframe,
                pairId: pair.id,
                type: 'abundanceReframe'
            });
        });

        // Scramble scarcity thoughts and abundance reframes separately to avoid same-row alignment
        const scrambledScarcityThoughts = [...scarcityThoughts].sort(() => Math.random() - 0.5);
        const scrambledAbundanceReframes = [...abundanceReframes].sort(() => Math.random() - 0.5);

        // Combine into single array for game logic
        const allItems = [...scrambledScarcityThoughts, ...scrambledAbundanceReframes];
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
            await setScarcityMatchedPairs(newMatchedPairs);

            // Remove matched items and add new pair if available
            setTimeout(() => {
                const remainingItems = gameItems.filter(item => !selected.includes(item.id));

                // Add next pair if available
                if (currentPairIndex < beliefPairs.length) {
                    const nextPair = beliefPairs[currentPairIndex];

                    // Separate existing items by type
                    const existingScarcityThoughts = remainingItems.filter(item => item.type === 'scarcityThought');
                    const existingAbundanceReframes = remainingItems.filter(item => item.type === 'abundanceReframe');

                    // Add new scarcity thought and abundance reframe
                    const newScarcityThought = {
                        id: `scarcityThought_${nextPair.id}`,
                        text: nextPair.scarcityThought,
                        pairId: nextPair.id,
                        type: 'scarcityThought' as const
                    };
                    const newAbundanceReframe = {
                        id: `abundanceReframe_${nextPair.id}`,
                        text: nextPair.abundanceReframe,
                        pairId: nextPair.id,
                        type: 'abundanceReframe' as const
                    };

                    // Randomly insert new items to avoid predictable positioning
                    const allScarcityThoughts = [...existingScarcityThoughts];
                    const allAbundanceReframes = [...existingAbundanceReframes];

                    // Insert new scarcity thought at random position
                    const scarcityThoughtInsertIndex = Math.floor(Math.random() * (allScarcityThoughts.length + 1));
                    allScarcityThoughts.splice(scarcityThoughtInsertIndex, 0, newScarcityThought);

                    // Insert new abundance reframe at random position
                    const abundanceReframeInsertIndex = Math.floor(Math.random() * (allAbundanceReframes.length + 1));
                    allAbundanceReframes.splice(abundanceReframeInsertIndex, 0, newAbundanceReframe);

                    const newItems = [...allScarcityThoughts, ...allAbundanceReframes];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                // Check if game is complete
                if (newMatchedPairs.length === beliefPairs.length) {
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

    const openYouTubeVideo = async () => {
        const youtubeUrl = `https://www.youtube.com/watch?v=1J26CRRwr-k`;

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

                            <Text style={commonStyles.introTitle}>Welcome Back!</Text>
                            <Text style={commonStyles.introDescription}>
                                Today, we're exploring how our mindset about scarcity and abundance shapes our relationship with money.
                            </Text>
                            <Text style={commonStyles.introDescription}>
                                Many of us carry scarcity thinking that limits our earning potential and financial freedom.
                            </Text>

                            <View style={styles.learningBox}>
                                <Text style={styles.learningBoxTitle}>What You'll Learn:</Text>
                                <Text style={styles.learningBoxItem}>• How to identify scarcity thinking patterns</Text>
                                <Text style={styles.learningBoxItem}>• Powerful abundance reframes for common money beliefs</Text>
                                <Text style={styles.learningBoxItem}>• How to shift from limitation to possibility thinking</Text>
                            </View>

                            <Text style={styles.welcomeFooter}>
                                You'll be playing a match game to help you transform scarcity thoughts into abundance mindsets.
                            </Text>

                            <JournalEntrySection
                                pathTag="money-mindsets"
                                day="5"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Scarcity Vs Abundance"
                                journalInstruction="Before we begin, let's take a moment to check in with yourself. What are your current thoughts about scarcity and abundance? Do you notice any patterns in how you think about money?"
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

                            <Text style={commonStyles.introTitle}>Scarcity vs Abundance Match Game</Text>

                            <Text style={commonStyles.introDescription}>
                                As dancers, we've been taught to accept less… low pay, "exposure gigs," and the starving artist life. But what if you flipped the script? Let's explore scarcity vs. abundance thinking by matching the scarcity thought with the abundance reframe.
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
                                Which scarcity thought feels most familiar to you?{"\n"}
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Take a moment to reflect on the scarcity and abundance mindsets you encountered.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                <Text style={styles.reflectionEmphasis}>(If you're having trouble recalling, feel free to go back and play the match game again)</Text>
                            </Text>

                            <JournalEntrySection
                                pathTag="money-mindsets"
                                day="5"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Scarcity Vs Abundance"
                                journalInstruction="Which scarcity thought are you still holding onto? Why does it feel true to you?"
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

    // Congratulations Screen with Final Content
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

                            <Text style={commonStyles.reflectionTitle}>Aim for Abundance</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Money isn't the enemy… it's the fuel that allows you to take risks, rest, and grow.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                You're allowed to want more. You're allowed to earn more. And you're allowed to create a life where your worth isn't tied to how much you sacrifice.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Watch this 5 min clip for more ideas about shifting from scarcity to abundance thinking!
                            </Text>

                            <TouchableOpacity
                                style={styles.videoThumbnailContainer}
                                onPress={openYouTubeVideo}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={{ uri: 'https://img.youtube.com/vi/1J26CRRwr-k/maxresdefault.jpg' }}
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
                                Get ready for tomorrow.
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
                title={`${matchedPairs.length}/${beliefPairs.length} pairs matched`}
                progress={matchedPairs.length / beliefPairs.length}
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
                        <Text style={styles.gameTitle}>Scarcity vs Abundance</Text>
                        <Text style={styles.gameInstructions}>
                            Tap to match scarcity thoughts with their abundance reframes
                        </Text>

                        <View style={styles.columnsContainer}>
                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>Scarcity Thought</Text>
                                {gameItems.filter(item => item.type === 'scarcityThought').map((item) => (
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
                                <Text style={styles.columnTitle}>Abundance Reframe</Text>
                                {gameItems.filter(item => item.type === 'abundanceReframe').map((item) => (
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