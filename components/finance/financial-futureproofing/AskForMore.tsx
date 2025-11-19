import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Modal, Linking } from 'react-native';
import { ChevronRight, Zap, ArrowLeft, ChevronLeft, X, Check } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useStorage } from '@/hooks/useStorage';
import { STORAGE_KEYS } from '@/utils/storageKeys';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';

const { width, height } = Dimensions.get('window');

interface AskForMoreProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function AskForMore({ onComplete, onBack }: AskForMoreProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const [selectedChoice, setSelectedChoice] = useStorage<number | null>('ASK_FOR_MORE_CHOICE', null);

    const handleStart = () => {
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
        } else if (currentScreen > 1 && currentScreen <= 5) {
            setCurrentScreen(currentScreen - 1);
        }
        scrollToTop();
    };

    const handleChoiceSelect = async (choiceNumber: number) => {
        await setSelectedChoice(choiceNumber);
        scrollToTop();
    };

    const handleContinue = () => {
        if (currentScreen === 2 && selectedChoice !== null) {
            setCurrentScreen(3);
        } else if (currentScreen === 3) {
            setCurrentScreen(4);
        } else if (currentScreen === 4) {
            setCurrentScreen(5);
        } else if (currentScreen === 5) {
            setCurrentScreen(6);
        } else if (currentScreen === 6) {
            onComplete();
        } else {
            setCurrentScreen(currentScreen + 1);
        }
        scrollToTop();
    };

    const openVideoModal = () => {
        setShowVideoModal(true);
        setIsPlaying(true);
    };

    const closeVideoModal = () => {
        setIsPlaying(false);
        setShowVideoModal(false);
    };

    const openYouTubeShort = async () => {
        const youtubeUrl = `https://www.youtube.com/shorts/s-hpQ9XBGP4`;

        try {
            const supported = await Linking.canOpenURL(youtubeUrl);

            if (supported) {
                await Linking.openURL(youtubeUrl);
            } else {
                console.log("YouTube app not available, opening in modal");
                openVideoModal();
            }
        } catch (error) {
            console.log("Error opening YouTube:", error);
            openVideoModal();
        }
    };

    const getResponseText = () => {
        switch (selectedChoice) {
            case 1:
                return "The people-pleasing instinct is real! You've secured the job, which feels safe. But saying \"yes\" too quickly often leads to resentment later. When you undercharge, you not only lose income but also signal that your expertise is worth less, making it harder to raise your rates later.";
            case 2:
                return "Outstanding! You've shown confidence and professionalism. You stated your value clearly, based on research, and left the door open for a conversation. This is how you build a career based on respect, not just gigs.";
            case 3:
                return "You're protecting your boundaries and refusing to be undervalued, which is powerful. However, walking away from a negotiation without a conversation can close doors. A direct but polite counteroffer often gets you closer to your goal without burning a bridge.";
            default:
                return "";
        }
    };

    // NEW: Welcome Screen
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

                            <Text style={commonStyles.introTitle}>Ask for More</Text>

                            <Text style={commonStyles.introDescription}>
                                In the dance world, talking about money can feel uncomfortable. But knowing your value and advocating for it is a non-negotiable skill for financial futureproofing.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Let's practice. Choose how you'd handle this common scenario.
                            </Text>

                            <View style={styles.celebrationBox}>
                                <Text style={styles.celebrationTitle}>What You'll Learn</Text>
                                <Text style={styles.celebrationItem}>• How to negotiate with confidence</Text>
                                <Text style={styles.celebrationItem}>• Professional scripts for asking for more</Text>
                                <Text style={styles.celebrationItem}>• Overcoming people-pleasing tendencies</Text>
                                <Text style={styles.celebrationItem}>• Setting your financial worth</Text>
                            </View>

                            <Text style={styles.welcomeFooter}>
                                This practice will give you concrete tools to advocate for your financial value in any professional situation.
                            </Text>

                            <PrimaryButton title="Begin Practice" onPress={handleStart} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario Screen
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
                            <Text style={styles.scenarioTitle}>Salary Negotiation Scenario</Text>

                            <Text style={styles.scenarioText}>
                                You just had a great interview for a new contract role at a reputable company. The hiring manager says, "We'd love to have you! The salary we'd like to offer you is $50,000. Does that work for you?"
                            </Text>

                            <Text style={styles.scenarioText}>
                                You know that for your experience and in this city, average salaries range between $60,000 to $80,000.
                            </Text>

                            <Text style={styles.scenarioQuestion}>
                                What do you do?
                            </Text>

                            <PrimaryButton title="See Your Options" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Choices Screen
    if (currentScreen === 1) {
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
                            <Text style={styles.choicesTitle}>Choose Your Response</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 1 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(1)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 1 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 1 && styles.choiceTextSelected
                                        ]}>
                                            "Yes, that's fine!" You accept immediately, pushing down the feeling that you're undervaluing yourself.
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 2 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(2)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 2 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 2 && styles.choiceTextSelected
                                        ]}>
                                            "Thank you! I'm really excited to get started. Based on my [X years] of experience and the industry standard, my salary expectation is $65,000. Is that possible?" You negotiate politely and professionally.
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 3 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(3)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 3 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 3 && styles.choiceTextSelected
                                        ]}>
                                            "No, thank you." You decline and walk away, feeling frustrated.
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinue}
                                disabled={selectedChoice === null}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Response Screen
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
                            <Text style={styles.responseTitle}>Your Choice Analysis</Text>

                            <Text style={styles.responseText}>{getResponseText()}</Text>

                            <PrimaryButton title="Learn the Best Approach" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Formula Screen
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
                            <Text style={styles.formulaTitle}>The Best Approach: Polite, Prepared Negotiation</Text>

                            <Text style={styles.formulaText}>
                                You don't have to be aggressive to be effective. Here's a simple script you can adapt:
                            </Text>

                            <Text style={styles.formulaSubtitle}>The "Ask for More" Formula:</Text>

                            <View style={styles.formulaStep}>
                                <Text style={styles.formulaStepNumber}>1</Text>
                                <Text style={styles.formulaStepText}>
                                    <Text style={styles.formulaStepTitle}>Show Enthusiasm:</Text> "Thank you so much for the offer! I'm really excited about the opportunity to work with you."
                                </Text>
                            </View>

                            <View style={styles.formulaStep}>
                                <Text style={styles.formulaStepNumber}>2</Text>
                                <Text style={styles.formulaStepText}>
                                    <Text style={styles.formulaStepTitle}>State Your Rate Clearly:</Text> "Based on my [number] years of professional experience and certification in [specific skill], my salary expectations fall between $X and $X."
                                </Text>
                            </View>

                            <View style={styles.formulaStep}>
                                <Text style={styles.formulaStepNumber}>3</Text>
                                <Text style={styles.formulaStepText}>
                                    <Text style={styles.formulaStepTitle}>Open the Door for Discussion:</Text> "I am very flexible and would love to make this work. Is there room to adjust the offer to match my experience?"
                                </Text>
                            </View>

                            <Text style={styles.formulaNote}>
                                This approach is collaborative, not confrontational.
                            </Text>

                            <PrimaryButton title="Continue" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Conclusion Screen
    if (currentScreen === 4) {
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

                            <Text style={styles.conclusionTitle}>Remember This</Text>

                            <Text style={styles.conclusionText}>
                                Negotiation is a normal part of business. The worst they can say is "no," and you can then decide whether to accept their original rate or not.
                            </Text>

                            <Text style={styles.conclusionText}>
                                But you'd be surprised how often they say "yes," or meet you in the middle. That extra $5,000 or $10,000 can go a long way and becomes much harder to ask for once you're in the role.
                            </Text>

                            <Text style={styles.conclusionText}>
                                Back yourself and ask for more.
                            </Text>

                            <Text style={styles.conclusionClosing}>
                                See you tomorrow.
                            </Text>

                            <PrimaryButton title="Mark As Complete" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // NEW: Reflection Screen with Journal
    if (currentScreen === 5) {
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

                            <Text style={commonStyles.reflectionTitle}>Your Negotiation Power</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                You now have the tools to confidently negotiate your worth. Remember that asking for what you deserve is not greedy—it's professional and shows self-respect.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Every time you advocate for your financial value, you're not just earning more money—you're building a career based on mutual respect and professional boundaries.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Take a moment to reflect on how you can apply these negotiation skills in your current or next professional opportunity.
                            </Text>

                            {/* YouTube Short Thumbnail */}
                            <TouchableOpacity
                                style={styles.videoThumbnailContainer}
                                onPress={openYouTubeShort}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={{ uri: 'https://img.youtube.com/vi/s-hpQ9XBGP4/maxresdefault.jpg' }}
                                    style={styles.videoThumbnail}
                                    resizeMode="cover"
                                />
                                <View style={styles.playButtonOverlay}>
                                    <View style={styles.playButton}>
                                        <Text style={styles.playIcon}>▶</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <JournalEntrySection
                                pathTag="financial-futureproofing"
                                day="3"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Ask For More"
                                journalInstruction="What would change in your life if you felt confident negotiating your worth in every professional situation?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <View style={styles.journalCallout}>
                                <Text style={styles.journalCalloutTitle}>Your Personal Space</Text>
                                <Text style={styles.journalCalloutText}>
                                    Remember, feel free to use the journal tab at any time to jot down your thoughts. This app is for you! Use it how you'd like to!
                                </Text>
                            </View>

                            <PrimaryButton title="Mark As Complete" onPress={onComplete} />
                        </Card>
                    </View>
                </ScrollView>

                {/* Keep the modal as fallback */}
                <Modal
                    visible={showVideoModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={closeVideoModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeVideoModal}
                                activeOpacity={0.8}
                            >
                                <X size={28} color="#FFFFFF" />
                            </TouchableOpacity>

                            <View style={styles.videoPlayerContainer}>
                                <YoutubePlayer
                                    height={height * 0.75}
                                    play={isPlaying}
                                    videoId={'ShIxdYpquqA'}
                                    webViewProps={{
                                        allowsFullscreenVideo: true,
                                    }}
                                    onChangeState={(state) => {
                                        console.log('Video state:', state);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    // Welcome Screen Styles
    celebrationBox: {
        width: '100%',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(146, 132, 144, 0.2)',
    },
    celebrationTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        marginBottom: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    celebrationItem: {
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
    // Scenario Styles
    scenarioTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '700',
    },
    scenarioText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 20,
    },
    scenarioQuestion: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 32,
        fontStyle: 'italic',
    },
    // Choices Styles
    choicesTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: '700',
    },
    choicesContainer: {
        gap: 16,
        marginBottom: 24,
    },
    choiceButton: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    choiceButtonSelected: {
        backgroundColor: 'rgba(146, 132, 144, 0.3)',
        borderColor: '#928490',
        borderWidth: 2,
    },
    choiceContent: {
        padding: 20,
        paddingRight: 50,
    },
    choiceText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        textAlign: 'center',
    },
    choiceTextSelected: {
        color: '#4E4F50',
        fontWeight: '600',
    },
    selectedIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#928490',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Response Styles
    responseTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    responseText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    // Formula Styles
    formulaTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    formulaText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    formulaSubtitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    formulaStep: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 15,
    },
    formulaStepNumber: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#928490',
        marginRight: 15,
        minWidth: 25,
    },
    formulaStepText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#4E4F50',
        lineHeight: 20,
        flex: 1,
    },
    formulaStepTitle: {
        fontFamily: 'Montserrat-SemiBold',
    },
    formulaNote: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 14,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 32,
    },
    // Conclusion Styles
    conclusionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    conclusionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    conclusionClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '600',
    },
    // Journal Callout
    journalCallout: {
        width: '100%',
        backgroundColor: 'rgba(100, 124, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(100, 124, 144, 0.2)',
    },
    journalCalloutTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '600',
    },
    journalCalloutText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 22,
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
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.9,
        maxWidth: 500,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: -50,
        right: 0,
        zIndex: 10,
        padding: 10,
    },
    videoPlayerContainer: {
        width: '100%',
        aspectRatio: 9 / 16,
        backgroundColor: '#000',
        borderRadius: 16,
        overflow: 'hidden',
    },
});