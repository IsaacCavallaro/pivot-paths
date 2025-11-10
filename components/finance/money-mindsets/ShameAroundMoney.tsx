import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Linking, Image } from 'react-native';
import { Play, Pause, ExternalLink, ArrowLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface ShameAroundMoneyProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function ShameAroundMoney({ onComplete, onBack }: ShameAroundMoneyProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(1); // Start at screen 1 (shame around money)

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);

        if (!isPlaying) {
            setTimeout(() => {
                setIsPlaying(false);
                setCurrentScreen(2);
            }, 3000);
        }
    };

    const handleEbookLink = () => {
        Linking.openURL('https://pivotfordancers.com/products/how-to-pivot/');
    };

    const goBack = () => {
        if (currentScreen === 2) {
            // Go back from ebook to shame around money
            setCurrentScreen(1);
        } else if (currentScreen === 1) {
            if (onBack) {
                onBack();
            }
        }
    };

    // Shame Around Money Screen
    if (currentScreen === 1) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
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
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Ebook Promotion Screen
    return (
        <View style={styles.container}>
            {/* Sticky Header */}
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <ArrowLeft size={28} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.backButton} />
                </View>
            </View>

            <View style={styles.scrollContainer}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>
                        <View style={styles.finalIconContainer}>
                            <Image
                                source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                style={styles.heroImage}
                            />
                        </View>

                        <Text style={styles.ebookTitle}>How did that feel?</Text>

                        <Text style={styles.ebookText}>
                            There's often a lot of shame baked into dealing with money (dancer or not). In fact, generational shame and trauma around finances can seep into how you feel about your finances. But when you leave the past in the past, you can start to move forward. Half the battle is accepting that you're not in the best money situation. Start there.
                        </Text>

                        <Text style={styles.reflectionClosing}>
                            See you tomorrow!
                        </Text>

                        <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
                            <View
                                style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}
                            >
                                <Text style={styles.completeButtonText}>Mark as complete</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0',
    },
    scrollContainer: {
        marginTop: 70,
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    stickyHeader: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 28,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    titleText: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 25,
        color: '#E2DED0',
        textAlign: 'center',
    },
    card: {
        width: width * 0.85,
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
    },
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
    ebookIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    ebookTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 25,
    },
    ebookText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    ebookCallout: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 30,
        fontStyle: 'italic',
    },
    ebookButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    ebookButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    ebookButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
    },
    completeButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    completeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    completeButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
    },
    finalIconContainer: {
        marginBottom: 30,
    },
    heroImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderColor: '#647C90',
        borderWidth: 2,
    },
    reflectionClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: '600',
    },
});