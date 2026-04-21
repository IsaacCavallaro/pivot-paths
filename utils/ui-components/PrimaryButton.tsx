import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface PrimaryButtonProps {
    onPress: () => void;
    title: string;
    subtitle?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    backgroundColor?: string;
    textColor?: string;
    showChevron?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    onPress,
    title,
    subtitle,
    style,
    textStyle,
    backgroundColor,
    textColor,
    showChevron = true,
    disabled = false,
    variant = 'primary',
}) => {
    const resolvedBackgroundColor = backgroundColor ?? (variant === 'secondary' ? 'transparent' : '#928490');
    const resolvedTextColor = textColor ?? (variant === 'secondary' ? '#647C90' : '#E2DED0');

    return (
        <TouchableOpacity
            style={[styles.buttonContainer, style]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <View style={[
                styles.buttonContent,
                { backgroundColor: resolvedBackgroundColor, borderColor: resolvedTextColor },
                disabled && styles.buttonDisabled
            ]}>
                <View style={styles.labelContainer}>
                    <Text style={[
                        styles.buttonText,
                        { color: resolvedTextColor },
                        textStyle,
                        disabled && styles.buttonTextDisabled
                    ]}>
                        {title}
                    </Text>
                    {subtitle ? (
                        <Text style={[styles.subtitleText, { color: resolvedTextColor }]}>
                            {subtitle}
                        </Text>
                    ) : null}
                </View>
                {showChevron && <ChevronRight size={16} color={resolvedTextColor} />}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: 30,
        overflow: 'hidden',
        marginTop: 15,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
    },
    labelContainer: {
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        marginRight: 8,
        fontWeight: '600',
    },
    subtitleText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    buttonTextDisabled: {
        color: '#A0A0A0',
    },
});
