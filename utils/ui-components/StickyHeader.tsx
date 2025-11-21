import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

interface StickyHeaderProps {
    onBack: () => void;
    title?: string;
    progress?: number | Animated.AnimatedInterpolation<string>; // Value between 0 and 1 or an Animated Interpolation
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
    const interpolatedProgress = React.useMemo(() => {
        if (typeof progress === 'number') {
            return new Animated.Value(progress).interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
            });
        }
        return progress;
    }, [progress]);

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
                    {interpolatedProgress && (
                        <Animated.View style={[styles.progressFill, { backgroundColor: textColor, width: interpolatedProgress }]} />
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
