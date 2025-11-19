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
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    onPress,
    title,
    style,
    textStyle,
    backgroundColor = '#928490',
    textColor = '#E2DED0',
    showChevron = true,
}) => {
    return (
        <TouchableOpacity
            style={[styles.buttonContainer, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={[styles.buttonContent, { backgroundColor, borderColor: textColor }]}>
                <Text style={[styles.buttonText, { color: textColor }, textStyle]}>
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
    buttonText: {
        fontFamily: 'Montserrat-SemiBold', // Using a common font, adjust if needed
        fontSize: 16,
        marginRight: 8,
        fontWeight: '600',
    },
});
