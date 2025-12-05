import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.option, language === 'tr' && styles.activeOption]}
                onPress={() => setLanguage('tr')}
                activeOpacity={0.8}
            >
                <Text style={[styles.text, language === 'tr' && styles.activeText]}>TR</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.option, language === 'en' && styles.activeOption]}
                onPress={() => setLanguage('en')}
                activeOpacity={0.8}
            >
                <Text style={[styles.text, language === 'en' && styles.activeText]}>EN</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 2,
        borderWidth: 1,
        borderColor: '#374151',
    },
    option: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 18,
    },
    activeOption: {
        backgroundColor: '#2563EB',
    },
    text: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '600',
    },
    activeText: {
        color: '#FFFFFF',
    },
});
