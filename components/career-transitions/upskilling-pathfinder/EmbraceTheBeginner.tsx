import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Linking, Image } from 'react-native';
import { Play, Pause, ExternalLink, ArrowLeft, Headphones, Star, Users, Target } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';

const { width, height } = Dimensions.get('window');

interface EmbraceTheBeginnerProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function EmbraceTheBeginner({ onComplete, onBack }: EmbraceTheBeginnerProps) {
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
        Linking.openURL('https://pivotfordancers.com/how-to-pivot-ebook/');
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

                            <Text style={commonStyles.introTitle}>Embrace The Beginner</Text>

                            <Text style={commonStyles.introDescription}>
                                Starting something new can feel intimidating, but every expert was once a beginner. This is your opportunity to explore, learn, and grow without pressure.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                In this session, we'll guide you through embracing the beginner mindset - a powerful approach that opens you up to new possibilities and reduces the fear of not being perfect right away.
                            </Text>

                            <JournalEntrySection
                                pathTag="upskilling-pathfinder"
                                day="6"
                                category="Career Transitions"
                                pathTitle="Upskilling Pathfinder"
                                dayTitle="Embrace The Beginner"
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
                                            Find a comfortable space where you won't be interrupted
                                        </Text>
                                    </View>
                                    <View style={styles.preparationItem}>
                                        <View style={styles.bulletPoint} />
                                        <Text style={styles.preparationText}>
                                            Bring a curious and open mindset
                                        </Text>
                                    </View>
                                    <View style={styles.preparationItem}>
                                        <View style={styles.bulletPoint} />
                                        <Text style={styles.preparationText}>
                                            Remember that growth happens outside your comfort zone
                                        </Text>
                                    </View>
                                    <View style={styles.preparationItem}>
                                        <View style={styles.bulletPoint} />
                                        <Text style={styles.preparationText}>
                                            Get ready to embrace the learning process
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

                            <Text style={styles.voiceTitle}>Embrace The Beginner</Text>

                            <Text style={styles.voiceDescription}>
                                {!isPlaying && "Tap to listen to guidance on embracing the beginner mindset"}
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

                            <Text style={styles.journalTitle}>Reflect on Your Beginner Journey</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Take a moment to reflect on what it felt like to embrace the beginner mindset. What fears came up? What felt exciting? Capture your thoughts about this learning experience.
                            </Text>

                            <JournalEntrySection
                                pathTag="upskilling-pathfinder"
                                day="6"
                                category="Career Transitions"
                                pathTitle="Upskilling Pathfinder"
                                dayTitle="Embrace The Beginner"
                                journalInstruction="Reflect on embracing the beginner mindset"
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

                        <Text style={styles.ebookTitle}>Ready for more?</Text>

                        <Text style={commonStyles.reflectionDescription}>
                            You're ready to dream bigger and step into a full and rich life beyond dance. You've embraced the beginner mindset - now it's time to build on that foundation.
                        </Text>

                        <Text style={commonStyles.reflectionDescription}>
                            Take it one step further with our How to Pivot ebook. Dive deeper into your values, mindset, and next steps with actionable activities and real-life examples that will help you navigate your career transition with confidence.
                        </Text>

                        <Text style={styles.ebookCallout}>
                            Life is yours for the taking. Will you reach out and grab it?
                        </Text>

                        {/* Ebook CTA Card */}
                        <TouchableOpacity style={styles.ebookCard} onPress={handleEbookLink}>
                            <View style={styles.ebookCardContent}>
                                <View style={styles.ebookCardHeader}>
                                    <View style={styles.ebookIconContainer}>
                                        <ExternalLink size={24} color="#647C90" />
                                    </View>
                                    <Text style={styles.ebookCardTitle}>How to Pivot Ebook</Text>
                                </View>

                                <View style={styles.ebookFeatures}>
                                    <View style={styles.featureItem}>
                                        <Star size={16} color="#928490" />
                                        <Text style={styles.featureText}>Actionable activities</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Target size={16} color="#928490" />
                                        <Text style={styles.featureText}>Real-life examples</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Users size={16} color="#928490" />
                                        <Text style={styles.featureText}>Career transition guidance</Text>
                                    </View>
                                </View>

                                <View style={styles.ebookCardFooter}>
                                    <Text style={styles.ebookCardButtonText}>Get the Ebook</Text>
                                    <ExternalLink size={16} color="#647C90" />
                                </View>
                            </View>
                        </TouchableOpacity>

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