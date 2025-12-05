import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface AppButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function AppButton({ title, onPress, variant = 'primary', loading = false, style, textStyle }: AppButtonProps) {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary': return '#2563EB'; // blue-600
            case 'secondary': return '#374151'; // gray-700
            case 'outline': return 'transparent';
            default: return '#2563EB';
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'outline': return '#2563EB';
            default: return '#FFFFFF';
        }
    };

    const getBorder = () => {
        if (variant === 'outline') return { borderWidth: 1, borderColor: '#2563EB' };
        return {};
    };

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: getBackgroundColor() }, getBorder(), style]}
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
