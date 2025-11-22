import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { MatchGameEngineProps, MatchPair } from '@/types/matchGameEngine';

export default function MatchGameEngine({
    onComplete,
    onBack,
    imageSource,
    gameTitle,
    gameInstructions,
    leftColumnTitle,
    rightColumnTitle,
    pairs,
    welcomeScreen,
    gameIntroScreen,
    reflectionScreen,
    finalScreen,
}: MatchGameEngineProps) {
    const [currentScreen, setCurrentScreen] = useState(-1); // -1: Welcome, 0: Game Intro, 1: Game, 2: Reflection, 3: Final
    const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; pairId: number; type: string }>>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showMismatch, setShowMismatch] = useState(false);
    const [matchedPairs, setMatchedPairs] = useState<number[]>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    useEffect(() => {
        scrollToTop();
    }, [currentScreen]);

    const handleBackPress = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const goBack = () => {
        if (currentScreen === 0 && welcomeScreen) {
            setCurrentScreen(-1); // Go back to welcome screen
        } else if (currentScreen === 1 && gameIntroScreen) {
            setCurrentScreen(0); // Go back to game intro
        } else if (currentScreen === 1 && !gameIntroScreen) {
            setCurrentScreen(-1); // Go back to welcome if no game intro
        } else if (currentScreen === 2) {
            // Reset game state when going back from reflection
            setMatchedPairs([]);
            setSelectedItems([]);
            setCurrentPairIndex(0);
            setShowMismatch(false);
            setCurrentScreen(1); // Go back to game screen
        } else if (currentScreen === 3) {
            setCurrentScreen(2); // Go back to reflection
        } else if (currentScreen === -1) {
            handleBackPress(); // Use external onBack if on welcome screen
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
        const initialPairs = pairs.slice(0, Math.min(3, pairs.length));
        const leftItems: Array<{ id: string; text: string; pairId: number; type: string }> = [];
        const rightItems: Array<{ id: string; text: string; pairId: number; type: string }> = [];

        initialPairs.forEach(pair => {
            leftItems.push({
                id: `${pair.leftType}_${pair.id}`,
                text: pair.leftText,
                pairId: pair.id,
                type: pair.leftType
            });
            rightItems.push({
                id: `${pair.rightType}_${pair.id}`,
                text: pair.rightText,
                pairId: pair.id,
                type: pair.rightType
            });
        });

        const scrambledLeftItems = [...leftItems].sort(() => Math.random() - 0.5);
        const scrambledRightItems = [...rightItems].sort(() => Math.random() - 0.5);

        const allItems = [...scrambledLeftItems, ...scrambledRightItems];
        setGameItems(allItems);
        setCurrentPairIndex(initialPairs.length); // Next pair to add
    };

    const handleItemPress = useCallback(async (itemId: string) => {
        if (selectedItems.includes(itemId) || showMismatch) return;

        const newSelected = [...selectedItems, itemId];
        setSelectedItems(newSelected);

        if (newSelected.length === 2) {
            await checkMatch(newSelected);
        }
    }, [selectedItems, showMismatch, gameItems, matchedPairs, currentPairIndex, pairs]);

    const checkMatch = useCallback(async (selected: string[]) => {
        const item1 = gameItems.find(item => item.id === selected[0]);
        const item2 = gameItems.find(item => item.id === selected[1]);

        if (item1 && item2 && item1.pairId === item2.pairId) {
            const newMatchedPairs = [...matchedPairs, item1.pairId];
            setMatchedPairs(newMatchedPairs);

            setTimeout(() => {
                const remainingItems = gameItems.filter(item => !selected.includes(item.id));

                if (currentPairIndex < pairs.length) {
                    const nextPair = pairs[currentPairIndex];

                    const existingLeftItems = remainingItems.filter(item => item.type === nextPair.leftType);
                    const existingRightItems = remainingItems.filter(item => item.type === nextPair.rightType);

                    const newLeftItem = {
                        id: `${nextPair.leftType}_${nextPair.id}`,
                        text: nextPair.leftText,
                        pairId: nextPair.id,
                        type: nextPair.leftType
                    };
                    const newRightItem = {
                        id: `${nextPair.rightType}_${nextPair.id}`,
                        text: nextPair.rightText,
                        pairId: nextPair.id,
                        type: nextPair.rightType
                    };

                    const allLeftItems = [...existingLeftItems];
                    const allRightItems = [...existingRightItems];

                    const leftInsertIndex = Math.floor(Math.random() * (allLeftItems.length + 1));
                    allLeftItems.splice(leftInsertIndex, 0, newLeftItem);

                    const rightInsertIndex = Math.floor(Math.random() * (allRightItems.length + 1));
                    allRightItems.splice(rightInsertIndex, 0, newRightItem);

                    const newItems = [...allLeftItems, ...allRightItems];

                    setGameItems(newItems);
                    setCurrentPairIndex(currentPairIndex + 1);
                } else {
                    setGameItems(remainingItems);
                }

                setSelectedItems([]);

                if (newMatchedPairs.length === pairs.length) {
                    setTimeout(() => {
                        setCurrentScreen(2); // Go to reflection screen
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
    }, [selectedItems, showMismatch, gameItems, matchedPairs, currentPairIndex, pairs]);

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

    const openYouTubeShort = useCallback(async (videoLink: string) => {
        if (!videoLink) return;
        try {
            const supported = await Linking.canOpenURL(videoLink);
            if (supported) {
                await Linking.openURL(videoLink);
            } else {
                console.log("Cannot open URL:", videoLink);
            }
        } catch (error) {
            console.log("Error opening YouTube:", error);
        }
    }, []);

    // Welcome Screen
    if (currentScreen === -1) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={handleBackPress} />

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
                                {imageSource && (
                                    <Image
                                        source={{ uri: imageSource }}
                                        style={commonStyles.heroImage}
                                    />
                                )}
                            </View>

                            <Text style={commonStyles.introTitle}>{welcomeScreen.title}</Text>
                            {welcomeScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={commonStyles.introDescription}>
                                    {desc}
                                </Text>
                            ))}

                            {welcomeScreen.learningBox && (
                                <View style={styles.learningBox}>
                                    <Text style={styles.learningBoxTitle}>{welcomeScreen.learningBox.title}</Text>
                                    {welcomeScreen.learningBox.items.map((item, index) => (
                                        <Text key={item.id} style={styles.learningBoxItem}>
                                            • {item.text}
                                        </Text>
                                    ))}
                                </View>
                            )}

                            {welcomeScreen.welcomeFooter && (
                                <Text style={styles.welcomeFooter}>
                                    {welcomeScreen.welcomeFooter}
                                </Text>
                            )}

                            <JournalEntrySection {...welcomeScreen.journalSectionProps} />

                            <PrimaryButton title={welcomeScreen.buttonText} onPress={() => setCurrentScreen(gameIntroScreen ? 0 : 1)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Game Intro Screen
    if (currentScreen === 0 && gameIntroScreen) {
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
                                {imageSource && (
                                    <Image
                                        source={{ uri: imageSource }}
                                        style={commonStyles.heroImage}
                                    />
                                )}
                            </View>

                            <Text style={commonStyles.introTitle}>{gameIntroScreen.title}</Text>
                            {gameIntroScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={commonStyles.introDescription}>
                                    {desc}
                                </Text>
                            ))}

                            <PrimaryButton title={gameIntroScreen.buttonText} onPress={() => setCurrentScreen(1)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen
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
                                {imageSource && (
                                    <Image
                                        source={{ uri: imageSource }}
                                        style={commonStyles.heroImage}
                                    />
                                )}
                            </View>

                            <Text style={commonStyles.reflectionTitle}>{reflectionScreen.title}</Text>
                            {reflectionScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={commonStyles.reflectionDescription}>
                                    {desc}
                                </Text>
                            ))}

                            {reflectionScreen.reflectionEmphasis && (
                                <Text style={commonStyles.reflectionDescription}>
                                    <Text style={styles.reflectionEmphasis}>({reflectionScreen.reflectionEmphasis})</Text>
                                </Text>
                            )}

                            <JournalEntrySection {...reflectionScreen.journalSectionProps} />

                            <PrimaryButton title={reflectionScreen.buttonText} onPress={() => setCurrentScreen(3)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen
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
                                {imageSource && (
                                    <Image
                                        source={{ uri: imageSource }}
                                        style={commonStyles.heroImage}
                                    />
                                )}
                            </View>

                            <Text style={commonStyles.reflectionTitle}>{finalScreen.title}</Text>

                            {finalScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={commonStyles.reflectionDescription}>
                                    {desc}
                                </Text>
                            ))}

                            {finalScreen.videoLink && (
                                <TouchableOpacity
                                    style={styles.videoThumbnailContainer}
                                    onPress={() => openYouTubeShort(finalScreen.videoLink!)}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={{ uri: `https://img.youtube.com/vi/${finalScreen.videoLink.split('/').pop()}/maxresdefault.jpg` }}
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

                            {finalScreen.journalSectionProps && (
                                <JournalEntrySection {...finalScreen.journalSectionProps} />
                            )}

                            {finalScreen.alternativeClosing && (
                                <Text style={styles.reflectionClosing}>
                                    {finalScreen.alternativeClosing}
                                </Text>
                            )}

                            <PrimaryButton title={finalScreen.buttonText} onPress={onComplete} />
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
                title={`${matchedPairs.length}/${pairs.length} pairs matched`}
                progress={matchedPairs.length / pairs.length}
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
                        <Text style={styles.gameTitle}>{gameTitle}</Text>
                        <Text style={styles.gameInstructions}>
                            {gameInstructions}
                        </Text>

                        <View style={styles.columnsContainer}>
                            <View style={styles.column}>
                                <Text style={styles.columnTitle}>{leftColumnTitle}</Text>
                                {gameItems.filter(item => item.type === pairs[0]?.leftType).map((item) => (
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
                                <Text style={styles.columnTitle}>{rightColumnTitle}</Text>
                                {gameItems.filter(item => item.type === pairs[0]?.rightType).map((item) => (
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
        marginTop: 50,
        paddingBottom: 30,
    },
    baseCard: { // Overrides commonStyles.baseCard to fit the game layout better
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
        marginTop: 50,
        width: '90%', // Ensure it fits content
    },
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
        width: '100%',
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
        height: 140, // Adjusted height for better fit
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
        opacity: 0, // Matched items disappear
    },
    mismatchButton: {
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        borderColor: '#dc3545',
    },
    gameButtonText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 10,
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
