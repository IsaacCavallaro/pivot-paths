import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Modal, Linking } from 'react-native';
import { ChevronRight, Heart, Gift, ArrowLeft, ChevronLeft, X, Check } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';

const { width, height } = Dimensions.get('window');

interface GenerosityProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function Generosity({ onComplete, onBack }: GenerosityProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [currentScenario, setCurrentScenario] = useState(1); // 1 = sibling, 2 = dance studio, 3 = friend
    const [isPlaying, setIsPlaying] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    const handleStartRoleplay = () => {
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

    const handleChoiceSelect = (choiceNumber: number) => {
        setSelectedChoice(choiceNumber);
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
            // Move to next scenario or complete
            if (currentScenario < 3) {
                setCurrentScenario(currentScenario + 1);
                setSelectedChoice(null);
                setCurrentScreen(1); // Back to scenario screen
                scrollToTop();
            } else {
                setCurrentScreen(6);
            }
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

    const getScenarioData = () => {
        switch (currentScenario) {
            case 1:
                return {
                    title: "Your Sibling's Big Day",
                    text: "It's a year from now and your youngest sibling is about to graduate college. They've always looked up to you and your dream is to surprise them with a meaningful graduation gift or experience.",
                    choices: [
                        "You write them a heartfelt letter and skip the gift, your budget is too tight.",
                        "You chip in a small amount with other family members, even though you'd love to give more.",
                        "You find something affordable but it's not exactly what you dreamed of giving them."
                    ],
                    responses: [
                        "You're showing love in the best way you can, and that matters. But the financial strain is limiting how you express generosity.",
                        "Collaborating with family is thoughtful, but deep down, you wish you could contribute more freely.",
                        "You've found a way to give, but you still feel the tug of wishing you could do more without stress or compromise."
                    ],
                    alternative: "You've transitioned into a new career that pays you well and gives you financial breathing room. When your sibling graduates, you book a weekend trip for the two of you to celebrate, covering everything without a second thought.\n\nThat's the real gift of financial stability: freedom to give your time, energy, and experiences."
                };
            case 2:
                return {
                    title: "Supporting Your Roots",
                    text: "Your hometown dance studio is running a fundraiser to stay afloat. You'd love to support them. After all, they gave you so much growing up.",
                    choices: [
                        "Share their fundraiser on social media. Unfortunately, you can't afford to donate right now.",
                        "Pitch in a small donation, even though you wish you could do more.",
                        "Volunteer your time since you can't afford a monetary donation."
                    ],
                    responses: [
                        "Sharing helps, but you can't shake the feeling that you'd love to back it up with action.",
                        "Donating is meaningful, but you know in your heart you want to give without worrying about the cost.",
                        "Volunteering is huge and super helpful. You just wish you could make more of an impact to the place that helped raise you."
                    ],
                    alternative: "In your new career, you not only buy a ticket to every recital, but you also create a scholarship for students facing financial hardship. You're fueling the future of dance while still volunteering when you can. You're making a real difference and earning more money has been the biggest driver of this generosity."
                };
            case 3:
                return {
                    title: "A Friend in Need",
                    text: "A friend from your previous company has been struggling to cover physical therapy bills after an injury. They're too proud to ask, but you know they could use some help.",
                    choices: [
                        "Offer emotional support, but money isn't something you can give right now.",
                        "Send them an UberEats gift card, even though it means cutting corners for yourself this month.",
                        "Promise to check in later, but avoid the money conversation."
                    ],
                    responses: [
                        "Your presence matters, but you wish you could do more than words.",
                        "It feels good to help even a little, but it also leaves you more stressed about your own bills.",
                        "You feel guilty… you want to help but don't have the financial room to step in."
                    ],
                    alternative: "You offer to cover a few of your friend's PT sessions without a second thought, helping them heal faster. You even set aside a small \"support fund\" each month for moments like this. Generosity becomes part of your lifestyle, not a rare stretch."
                };
            default:
                return getScenarioData();
        }
    };

    const scenarioData = getScenarioData();

    const getResponseText = () => {
        if (!selectedChoice) return "";
        return scenarioData.responses[selectedChoice - 1];
    };

    const getFollowUpText = () => {
        switch (selectedChoice) {
            case 1:
                return "Your heart wants to give generously, but your current financial situation creates limitations. This doesn't reflect on your character - it reflects the reality of your resources. When money is tight, generosity often becomes the first thing we sacrifice, even when it brings us so much joy.";
            case 2:
                return "You're finding creative ways to give within your means, which shows incredible thoughtfulness. But that lingering feeling of 'I wish I could do more' is telling you something important. True generosity should feel expansive, not restrictive.";
            case 3:
                return "You're making compromises between what you'd love to give and what you can practically afford. This balancing act between your generous spirit and financial reality creates internal tension that diminishes the joy of giving.";
            default:
                return "";
        }
    };

    // Day 3 Welcome Screen
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

                            <Text style={commonStyles.introTitle}>The Power of Generosity</Text>

                            <Text style={commonStyles.introDescription}>
                                Welcome to Day 3 of Money Mindsets! Today we'll explore how financial stability can transform your ability to give back to the people and causes you care about most.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Generosity isn't just about money - it's about having the freedom to express your love and support without financial constraints holding you back.
                            </Text>

                            <View style={styles.celebrationBox}>
                                <Text style={styles.celebrationTitle}>What You'll Explore Today</Text>
                                <Text style={styles.celebrationItem}>• How money amplifies your ability to give</Text>
                                <Text style={styles.celebrationItem}>• The emotional impact of financial generosity</Text>
                                <Text style={styles.celebrationItem}>• Creating a lifestyle of giving</Text>
                                <Text style={styles.celebrationItem}>• Supporting your community and loved ones</Text>
                            </View>

                            <Text style={styles.welcomeFooter}>
                                Get ready to imagine how financial freedom could transform your ability to support the people and causes that matter most to you.
                            </Text>

                            <PrimaryButton title="Begin Exploring" onPress={handleStartRoleplay} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Main Intro Screen
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

                            <Text style={commonStyles.introTitle}>How Money Creates Generosity</Text>

                            <Text style={commonStyles.introDescription}>
                                Let's explore scenarios where your financial situation influences how much you can give back. Choose what you'd do and then see what other options might open up if you had more stability and income.
                            </Text>

                            <PrimaryButton title="Begin" onPress={() => {
                                setCurrentScreen(1);
                                scrollToTop();
                            }} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario Screen
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
                            <Text style={styles.scenarioTitle}>{scenarioData.title}</Text>

                            <Text style={styles.scenarioText}>
                                {scenarioData.text}
                            </Text>

                            <PrimaryButton title="What will you do?" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Choices Screen
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
                            <Text style={styles.choicesTitle}>Your Options</Text>

                            <View style={styles.choicesContainer}>
                                {scenarioData.choices.map((choice, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.choiceButton,
                                            selectedChoice === index + 1 && styles.choiceButtonSelected
                                        ]}
                                        onPress={() => handleChoiceSelect(index + 1)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.choiceContent}>
                                            {selectedChoice === index + 1 && (
                                                <View style={styles.selectedIndicator}>
                                                    <Check size={16} color="#E2DED0" />
                                                </View>
                                            )}
                                            <Text style={[
                                                styles.choiceText,
                                                selectedChoice === index + 1 && styles.choiceTextSelected
                                            ]}>
                                                {choice}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
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
                            <Text style={styles.responseTitle}>Here's where you're at</Text>

                            <Text style={styles.responseText}>{getResponseText()}</Text>

                            <PrimaryButton title="Continue" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Follow-up Screen
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
                            <Text style={styles.followUpTitle}>Here's your situation</Text>

                            <Text style={styles.followUpText}>{getFollowUpText()}</Text>

                            <PrimaryButton
                                title="See the Alternative"
                                onPress={handleContinue}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Alternative Vision Screen
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
                                <View style={[styles.alternativeIconGradient, { backgroundColor: '#928490' }]}>
                                    <Gift size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.alternativeTitle}>
                                {currentScenario < 3 ? 'But what if money wasn\'t an object?' : 'Picture this:'}
                            </Text>

                            <Text style={styles.alternativeText}>
                                {scenarioData.alternative}
                            </Text>

                            <PrimaryButton
                                title={currentScenario < 3 ? 'Try another example' : 'Continue to Reflection'}
                                onPress={handleContinue}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen with Journal
    if (currentScreen === 6) {
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

                            <Text style={commonStyles.reflectionTitle}>Amplifying Your Generosity</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                These scenarios show how financial stability transforms generosity from something you carefully budget for to something that flows naturally from your lifestyle.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                When money isn't a constant concern, you can focus on what truly matters: showing up for the people you love and supporting the causes that align with your values.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Financial freedom gives you the capacity to make a real difference - whether it's for family, your dance community, or friends in need.
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
                                pathTag="money-mindsets"
                                day="3"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Generosity"
                                journalInstruction="How would your ability to give back change if you had more financial stability? What causes or people would you love to support more generously?"
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
        marginBottom: 32,
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
    // Follow-up Styles
    followUpTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    followUpText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    // Alternative Styles
    alternativeTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    alternativeText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    alternativeIconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
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