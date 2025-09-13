import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, ExternalLink } from 'lucide-react-native';

interface GriefProps {
    onComplete: () => void;
}

export default function Grief({ onComplete }: GriefProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = voice message, 1 = ebook promotion

    const handlePlayPause = () => {
        // Placeholder for audio functionality
        setIsPlaying(!isPlaying);

        // Simulate audio completion after 3 seconds for demo
        if (!isPlaying) {
            setTimeout(() => {
                setIsPlaying(false);
                setCurrentScreen(1);
            }, 3000);
        }
    };

    const handleEbookLink = () => {
        console.log('Opening How to Pivot ebook link');
    };

    // Voice Message Screen
    if (currentScreen === 0) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.voiceContainer}>
                    <View style={styles.voiceIcon}>
                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={handlePlayPause}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#647C90', '#928490']}
                                style={styles.playButtonGradient}
                            >
                                {isPlaying ? (
                                    <Pause size={40} color="#E2DED0" />
                                ) : (
                                    <Play size={40} color="#E2DED0" />
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.voiceTitle}>Visualize your dream</Text>

                    <Text style={styles.voiceDescription}>
                        {isPlaying
                            ? "Playing personal message..."
                            : "Tap to listen to a guided visualization"
                        }
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
                </ScrollView>
            </View>
        );
    }

    // Ebook Promotion Screen
    return (
        <View style={styles.container}>
            <ScrollView style={styles.content} contentContainerStyle={styles.ebookContainer}>
                <View style={styles.ebookIcon}>
                    <ExternalLink size={32} color="#928490" />
                </View>

                <Text style={styles.ebookTitle}>Ready for More?</Text>

                <Text style={styles.ebookText}>
                    You're ready to dream bigger and step into a full and rich life beyond dance.
                </Text>

                <Text style={styles.ebookText}>
                    Now, take it one step further with our How to Pivot ebook. Dive deeper into your values, mindset, and next steps with actionable activities and real-life examples.
                </Text>

                <Text style={styles.ebookCallout}>
                    Life is yours for the taking. Will you reach out and grab it?
                </Text>

                <TouchableOpacity style={styles.ebookButton} onPress={handleEbookLink}>
                    <View
                        style={[styles.ebookButtonGradient, { backgroundColor: '#928490' }]}
                    >
                        <Text style={styles.ebookButtonText}>Get the How to Pivot Ebook</Text>
                        <ExternalLink size={16} color="#E2DED0" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
                    <View
                        style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
                    >
                        <Text style={styles.completeButtonText}>Mark as complete</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0',
    },
    content: {
        flex: 1,
    },
    voiceContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
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
    ebookContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    ebookIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
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
    ebookButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
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
    completeButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    completeButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 10,
    },
    backButtonText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#647C90',
        marginLeft: 8,
    },
});