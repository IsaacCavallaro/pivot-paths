import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Linking, Image } from 'react-native';
import { ExternalLink, LucideIcon } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { AudioPromptEngineProps } from '@/types/audioPromptEngine';

const { width, height } = Dimensions.get('window');

export default function AudioPromptEngine({
    onComplete,
    onBack,
    introTitle,
    introDescriptions,
    journalIntroSectionProps,
    preparationSection,
    voiceMessageTitle,
    voiceMessageDescription,
    journalReflectionTitle,
    journalReflectionDescription,
    journalReflectionSectionProps,
    ebookProps,
    youtubeVideoId, // NEW: Add youtubeVideoId prop
}: AudioPromptEngineProps & { youtubeVideoId?: string }) { // NEW: Add youtubeVideoId to props
    const [currentScreen, setCurrentScreen] = useState(0);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    const handleEbookLink = () => {
        Linking.openURL(ebookProps.link);
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

    const handleContinueToJournal = () => {
        setCurrentScreen(2);
        scrollToTop();
    };

    const handleContinueToFinal = () => {
        setCurrentScreen(3);
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

                            <Text style={commonStyles.introTitle}>{introTitle}</Text>

                            {introDescriptions.map((desc, index) => (
                                <Text key={index} style={commonStyles.introDescription}>
                                    {desc}
                                </Text>
                            ))}

                            <JournalEntrySection {...journalIntroSectionProps} />

                            <View style={styles.preparationSection}>
                                <Text style={styles.preparationTitle}>Before We Begin:</Text>
                                <View style={styles.preparationList}>
                                    {preparationSection.map((item, index) => (
                                        <View key={index} style={styles.preparationItem}>
                                            <View style={styles.bulletPoint} />
                                            <Text style={styles.preparationText}>{item}</Text>
                                        </View>
                                    ))}
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
                            <Text style={styles.voiceTitle}>{voiceMessageTitle}</Text>

                            <Text style={styles.voiceDescription}>
                                {voiceMessageDescription}
                            </Text>

                            {/* YouTube Video Section */}
                            {youtubeVideoId && (
                                <View style={styles.videoSection}>
                                    <View style={styles.videoContainer}>
                                        <View style={styles.youtubePlayer}>
                                            <YoutubePlayer
                                                height={140}
                                                play={false}
                                                videoId={youtubeVideoId}
                                                webViewStyle={styles.youtubeWebView}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}

                            <PrimaryButton
                                title="Continue to Reflection"
                                onPress={handleContinueToJournal}
                            />
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

                            <Text style={styles.journalTitle}>{journalReflectionTitle}</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                {journalReflectionDescription}
                            </Text>

                            <JournalEntrySection {...journalReflectionSectionProps} />
                            <PrimaryButton title="Continue" onPress={handleContinueToFinal} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Ebook Promotion Screen (now screen 3)
    const EbookCardIcon: LucideIcon = ebookProps.cardIcon;

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

                        <Text style={styles.ebookTitle}>{ebookProps.title}</Text>

                        {ebookProps.descriptions.map((desc, index) => (
                            <Text key={index} style={commonStyles.reflectionDescription}>
                                {desc}
                            </Text>
                        ))}

                        <Text style={styles.ebookCallout}>
                            {ebookProps.callout}
                        </Text>

                        {/* Ebook CTA Card */}
                        <TouchableOpacity style={styles.ebookCard} onPress={handleEbookLink}>
                            <View style={styles.ebookCardContent}>
                                <View style={styles.ebookCardHeader}>
                                    <View style={styles.ebookIconContainer}>
                                        <EbookCardIcon size={24} color="#647C90" />
                                    </View>
                                    <Text style={styles.ebookCardTitle}>{ebookProps.cardTitle}</Text>
                                </View>

                                <View style={styles.ebookFeatures}>
                                    {ebookProps.cardFeatures.map((feature, index) => {
                                        const FeatureIcon: LucideIcon = feature.icon;
                                        return (
                                            <View key={index} style={styles.featureItem}>
                                                <FeatureIcon size={16} color="#928490" />
                                                <Text style={styles.featureText}>{feature.text}</Text>
                                            </View>
                                        );
                                    })}
                                </View>

                                <View style={styles.ebookCardFooter}>
                                    <Text style={styles.ebookCardButtonText}>{ebookProps.cardButtonText}</Text>
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
        marginBottom: 30,
    },
    // NEW: Video Section Styles
    videoSection: {
        marginBottom: 30,
    },
    videoContainer: {
        width: '100%',
    },
    youtubePlayer: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    youtubeWebView: {
        borderRadius: 16,
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