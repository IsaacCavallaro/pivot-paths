import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, ExternalLink } from 'lucide-react-native';

interface EmbraceTheBeginnerProps {
    onComplete: () => void;
}

export default function EmbraceTheBeginner({ onComplete }: EmbraceTheBeginnerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = main screen, 1 = promotion screen

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

    // Main Screen
    if (currentScreen === 0) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.mainContainer}>
                    <View style={styles.mainIcon}>
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

                    <Text style={styles.mainTitle}>Visualize your dream</Text>

                    <Text style={styles.mainDescription}>
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

    // Promotion Screen
    return (
        <View style={styles.container}>
            <ScrollView style={styles.content} contentContainerStyle={styles.promotionContainer}>
                <View style={styles.promotionIcon}>
                    <ExternalLink size={32} color="#928490" />
                </View>

                <Text style={styles.promotionTitle}>Ready for More?</Text>

                <Text style={styles.promotionText}>
                    You're ready to dream bigger and step into a full and rich life beyond dance.
                </Text>

                <Text style={styles.promotionText}>
                    Now, take it one step further with our How to Pivot ebook. Dive deeper into your values, mindset, and next steps with actionable activities and real-life examples.
                </Text>

                <Text style={styles.promotionCallout}>
                    Life is yours for the taking. Will you reach out and grab it?
                </Text>

                <TouchableOpacity style={styles.promotionButton} onPress={handleEbookLink}>
                    <View
                        style={[styles.promotionButtonGradient, { backgroundColor: '#928490' }]}
                    >
                        <Text style={styles.promotionButtonText}>Get the How to Pivot Ebook</Text>
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
    mainContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    mainIcon: {
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
    mainTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 15,
    },
    mainDescription: {
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
    promotionContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    promotionIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    promotionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 25,
    },
    promotionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    promotionCallout: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 30,
        fontStyle: 'italic',
    },
    promotionButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    promotionButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    promotionButtonText: {
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
});