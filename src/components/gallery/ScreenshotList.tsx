import React from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AppText from '../common/AppText';
import { useLanguage } from '../../context/LanguageContext';

interface ScreenshotListProps {
    screenshots: string[];
    onDelete?: (index: number) => void;
    onShare?: (uri: string) => void;
}

export default function ScreenshotList({ screenshots, onDelete, onShare }: ScreenshotListProps) {
    const { t } = useLanguage();

    if (screenshots.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AppText variant="h3" style={styles.title}>{t('screenshots')} ({screenshots.length})</AppText>
            </View>
            <ScrollView horizontal contentContainerStyle={styles.list} showsHorizontalScrollIndicator={false}>
                {screenshots.map((uri, index) => (
                    <View key={index} style={styles.item}>
                        <Image source={{ uri }} style={styles.image} />
                        <View style={styles.actions}>
                            {/* Placeholder actions */}
                            <TouchableOpacity style={styles.actionBtn} onPress={() => onShare && onShare(uri)}>
                                <AppText style={styles.actionText}>Share</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
    },
    list: {
        paddingHorizontal: 20,
        gap: 12,
    },
    item: {
        width: 120,
        height: 160,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#1E293B',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    actions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 4,
        alignItems: 'center',
    },
    actionBtn: {
        padding: 4,
    },
    actionText: {
        color: '#FFF',
        fontSize: 10,
    },
});
