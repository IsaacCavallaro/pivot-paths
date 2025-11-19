import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface PrimaryButtonProps {
    onPress: () => void;
    title: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    backgroundColor?: string;
    textColor?: string;
    showChevron?: boolean;
    disabled?: boolean; // Add disabled prop
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    onPress,
    title,
    style,
    textStyle,
    backgroundColor = '#928490',
    textColor = '#E2DED0',
    showChevron = true,
    disabled = false, // Default to false
}) => {
    return (
        <TouchableOpacity
            style={[styles.buttonContainer, style]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled} // Pass disabled prop to TouchableOpacity
        >
            <View style={[
                styles.buttonContent,
                { backgroundColor, borderColor: textColor },
                disabled && styles.buttonDisabled // Apply disabled style
            ]}>
                <Text style={[
                    styles.buttonText,
                    { color: textColor },
                    textStyle,
                    disabled && styles.buttonTextDisabled // Apply disabled text style
                ]}>
                    {title}
                </Text>
                {showChevron && <ChevronRight size={16} color={textColor} />}
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
    buttonDisabled: {
        opacity: 0.6, // Reduce opacity when disabled
    },
    buttonText: {
        fontFamily: 'Montserrat-SemiBold', // Using a common font, adjust if needed
        fontSize: 16,
        marginRight: 8,
        fontWeight: '600',
    },
    buttonTextDisabled: {
        color: '#A0A0A0', // Lighter color for disabled text
    },
});
