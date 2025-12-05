import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface AppTextProps {
    children: React.ReactNode;
    style?: TextStyle;
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
    color?: string;
}

export default function AppText({ children, style, variant = 'body', color }: AppTextProps) {
    const getStyle = () => {
        switch (variant) {
            case 'h1': return styles.h1;
            case 'h2': return styles.h2;
            case 'h3': return styles.h3;
            case 'caption': return styles.caption;
            default: return styles.body;
        }
    };

    return (
        <Text style={[getStyle(), color ? { color } : {}, style]}>
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    h1: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
    h2: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
    h3: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
    body: { fontSize: 16, color: '#9CA3AF' },
    caption: { fontSize: 12, color: '#6B7280' },
});
