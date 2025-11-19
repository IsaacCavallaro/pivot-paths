import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Linking, Image } from 'react-native';
import { Play, Pause, ExternalLink, ArrowLeft, BookOpen, Star, Target, Users } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';

const { width, height } = Dimensions.get('window');

interface ShameAroundMoneyProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function ShameAroundMoney({ onComplete, onBack }: ShameAroundMoneyProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(0);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);

        if (!isPlaying) {
            setTimeout(() => {
                setIsPlaying(false);
                setCurrentScreen(2); // Now goes to journal prompt screen
                scrollToTop();
            }, 3000);
        }
    };

    const handleEbookLink = () => {
        Linking.openURL('https://pivotfordancers.com/products/how-to-pivot/');
    };

    const goBack = () => {
        if (currentScreen === 3) {
            setCurrentScreen(2);
        } else if (currentScreen === 2) {
            setCurrentScreen(1);
        } else if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen === 0) {
            if (onBack) {
                onBack();
            }
        }
        scrollToTop();
    };

    const handleContinueToVoiceMessage = () => {
        setCurrentScreen(1);
        scrollToTop();
    };

    const handleContinueToFinal = () => {
        setCurrentScreen(3); // Go to final CTA screen
        scrollToTop();
    };

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

                            <Text style={commonStyles.introTitle}>Confront Money Shame</Text>

                            <Text style={commonStyles.introDescription}>
                                Money shame can be a heavy burden, especially for dancers navigating financial uncertainty. This exercise will help you identify and release the shame that might be holding you back from financial freedom.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                We'll start with a guided reflection to help you uncover and confront money shame, followed by an opportunity to reflect on your experience.
                            </Text>

                            <JournalEntrySection
                                pathTag="money-mindsets"
                                day="3"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Shame Around Money"
                                journalInstruction="A quick check in before we start this session"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <View style={styles.preparationSection}>
                                <Text style={styles.preparationTitle}>Before We Begin:</Text>
                                <View style={styles.preparationList}>
                                    <View style={styles.preparationItem}>
                                        <View style={styles.bulletPoint} />
                                        <Text style={styles.preparationText}>
                                            Find a quiet, comfortable space to reflect
                                        </Text>
                                    </View>
                                    <View style={styles.preparationItem}>
                                        <View style={styles.bulletPoint} />
                                        <Text style={styles.preparationText}>
                                            Be honest and gentle with yourself
                                        </Text>
                                    </View>
                                    <View style={styles.preparationItem}>
                                        <View style={styles.bulletPoint} />
                                        <Text style={styles.preparationText}>
                                            Remember that money shame is common and you're not alone
                                        </Text>
                                    </View>
                                    <View style={styles.preparationItem}>
                                        <View style={styles.bulletPoint} />
                                        <Text style={styles.preparationText}>
                                            Get ready to release what no longer serves you
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <PrimaryButton title="I'm Ready to Begin" onPress={handleContinueToVoiceMessage} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Voice Message Screen (now screen 1)
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
                            <View style={styles.voiceIcon}>
                                <TouchableOpacity
                                    style={styles.playButton}
                                    onPress={handlePlayPause}
                                    activeOpacity={0.8}
                                >
                                    <View
                                        style={[styles.playButtonGradient, { backgroundColor: '#928490' }]}
                                    >
                                        {isPlaying ? (
                                            <Pause size={40} color="#E2DED0" />
                                        ) : (
                                            <Play size={40} color="#E2DED0" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.voiceTitle}>Confront Money Shame</Text>

                            <Text style={styles.voiceDescription}>
                                {!isPlaying && "Tap to listen to a guided reflection on money mindset"}
                            </Text>

                            {isPlaying && (
                                <View style={styles.playingIndicator}>
                                    <View style={styles.waveform}>
                                        {[...Array(5)].map((_, i) => (
                                            <View key={i} style={[styles.wave, { animationDelay: `${i * 0.1}s` }]} />
                                        ))}
                                    </View>
                                    <Text style={styles.playingText}>Playing...</Text>
                                </View>
                            )}
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Journal Prompt Screen (now screen 2)
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

                            <Text style={styles.journalTitle}>Reflect on Money Shame</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Take a moment to reflect on what came up during the guided reflection. What feelings or thoughts emerged around money? What insights did you gain about your relationship with finances?
                            </Text>

                            <JournalEntrySection
                                pathTag="money-mindsets"
                                day="3"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Shame Around Money"
                                journalInstruction="Reflect on your experience with money shame"
                                moodLabel=""
                                saveButtonText="Save Reflection"
                            />
                            <PrimaryButton title="Continue" onPress={handleContinueToFinal} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Ebook Promotion Screen (now screen 3)
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

                        <Text style={styles.ebookTitle}>How did that feel?</Text>

                        <Text style={commonStyles.reflectionDescription}>
                            There's often a lot of shame baked into dealing with money (dancer or not). In fact, generational shame and trauma around finances can seep into how you feel about your finances. But when you leave the past in the past, you can start to move forward. Half the battle is accepting that you're not in the best money situation. Start there.
                        </Text>

                        <Text style={styles.ebookCallout}>
                            Ready to dive deeper into transforming your money mindset?
                        </Text>

                        {/* Ebook CTA Card */}
                        <TouchableOpacity style={styles.ebookCard} onPress={handleEbookLink}>
                            <View style={styles.ebookCardContent}>
                                <View style={styles.ebookCardHeader}>
                                    <View style={styles.ebookIconContainer}>
                                        <BookOpen size={24} color="#647C90" />
                                    </View>
                                    <Text style={styles.ebookCardTitle}>How to Pivot Ebook</Text>
                                </View>

                                <View style={styles.ebookFeatures}>
                                    <View style={styles.featureItem}>
                                        <Star size={16} color="#928490" />
                                        <Text style={styles.featureText}>Comprehensive career transition guide</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Target size={16} color="#928490" />
                                        <Text style={styles.featureText}>Practical financial strategies</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Users size={16} color="#928490" />
                                        <Text style={styles.featureText}>Dancer-specific advice</Text>
                                    </View>
                                </View>

                                <View style={styles.ebookCardFooter}>
                                    <Text style={styles.ebookCardButtonText}>Learn More</Text>
                                    <ExternalLink size={16} color="#647C90" />
                                </View>
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.reflectionClosing}>
                            See you tomorrow!
                        </Text>

                        <PrimaryButton title="Mark As Complete" onPress={onComplete} />
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // Preparation Section Styles
    preparationSection: {
        width: '100%',
        marginBottom: 32,
        padding: 20,
        backgroundColor: 'rgba(146, 132, 144, 0.08)',
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
    },
    preparationTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '700',
    },
    preparationList: {
        gap: 12,
    },
    preparationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#928490',
        marginTop: 8,
        marginRight: 12,
    },
    preparationText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#4E4F50',
        lineHeight: 20,
        flex: 1,
    },
    // Voice Message Styles
    voiceIcon: {
        marginBottom: 30,
    },
    playButton: {
        borderRadius: 60,
        overflow: 'hidden',
    },
    playButtonGradient: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    voiceTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 15,
    },
    voiceDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 24,
    },
    playingIndicator: {
        alignItems: 'center',
        marginTop: 30,
    },
    waveform: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    wave: {
        width: 4,
        height: 20,
        backgroundColor: '#647C90',
        marginHorizontal: 2,
        borderRadius: 2,
    },
    playingText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#647C90',
    },
    // Journal Prompt Styles
    journalTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 25,
    },
    // Ebook Styles
    ebookTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 25,
    },
    ebookCallout: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 30,
        fontStyle: 'italic',
    },
    reflectionClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: '600',
    },
    // Ebook Card Styles
    ebookCard: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(146, 132, 144, 0.2)',
    },
    ebookCardContent: {
        gap: 16,
    },
    ebookCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ebookIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(100, 124, 144, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    ebookCardTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#647C90',
        fontWeight: '700',
    },
    ebookFeatures: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#4E4F50',
        lineHeight: 20,
    },
    ebookCardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(146, 132, 144, 0.1)',
    },
    ebookCardButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#647C90',
        fontWeight: '600',
    },
});