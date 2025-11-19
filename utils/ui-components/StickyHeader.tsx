import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

interface StickyHeaderProps {
    onBack: () => void;
    title?: string;
    progress?: number; // Value between 0 and 1 for progress bar
    backgroundColor?: string;
    textColor?: string;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
    onBack,
    title,
    progress,
    backgroundColor = '#928490',
    textColor = '#E2DED0',
}) => {
    const progressWidth = progress !== undefined ? new Animated.Value(progress) : null;

    const animatedProgressStyle = progressWidth ? {
        width: progressWidth.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
        }),
    } : {};

    return (
        <View style={[styles.stickyHeader, { backgroundColor }]}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <ArrowLeft size={28} color={textColor} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    {title && <Text style={[styles.titleText, { color: textColor }]}>{title}</Text>}
                </View>
                <View style={styles.backButton} />
            </View>
            {progress !== undefined && (
                <View style={styles.progressBar}>
                    {progressWidth && (
                        <Animated.View style={[styles.progressFill, { backgroundColor: textColor }, animatedProgressStyle]} />
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
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
        fontFamily: 'Montserrat-Medium', // Using a common font, adjust if needed
        fontSize: 16,
        textAlign: 'center',
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(226, 222, 208, 0.3)', // Light background for the bar
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 12,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
});
