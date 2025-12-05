import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import AppText from '../components/common/AppText';
import AppButton from '../components/common/AppButton';
import LanguageToggle from '../components/common/LanguageToggle';

export default function IntroCalibrationScreen({ navigation }: any) {
    const { t } = useLanguage();

    const steps = [
        { id: 1, text: t('allowCamera') },
        { id: 2, text: t('showHand') },
        { id: 3, text: t('introDesc') },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
            <View style={styles.header}>
                <View>
                    <AppText variant="h3" style={styles.logoText}>DeepSport</AppText>
                    <AppText variant="caption">{t('appSubtitle')}</AppText>
                </View>
                <LanguageToggle />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.textBlock}>
                    <AppText variant="h2" style={styles.title}>{t('introTitle')}</AppText>
                    <AppText variant="body" style={styles.desc}>
                        {t('introDesc')}
                    </AppText>
                </View>

                <View style={styles.howItWorks}>
                    <AppText variant="h3" style={styles.sectionTitle}>{t('howItWorks')}</AppText>
                    <View style={styles.steps}>
                        {steps.map((step) => (
                            <View key={step.id} style={styles.stepRow}>
                                <View style={styles.stepNumberContainer}>
                                    <AppText style={styles.stepNumber}>{step.id}</AppText>
                                </View>
                                <AppText style={styles.stepText}>{step.text}</AppText>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.visualGuide}>
                    <View style={styles.guidePlaceholder}>
                        <AppText style={styles.guideText}>{t('calibrationGuide')}</AppText>
                        <View style={styles.thresholdLine} />
                        <AppText style={styles.thresholdLabel}>{t('thresholdLabel')}</AppText>
                    </View>
                </View>

                <View style={styles.calibrationInfo}>
                    <AppText variant="caption" style={{ textAlign: 'center' }}>
                        {t('needThreshold')}
                    </AppText>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <AppButton title={t('continue')} onPress={() => navigation.navigate('Main')} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1E293B',
    },
    logoText: {
        color: '#FFFFFF',
    },
    scrollContent: {
        padding: 20,
    },
    textBlock: {
        marginBottom: 24,
    },
    title: {
        marginBottom: 12,
    },
    desc: {
        lineHeight: 24,
    },
    howItWorks: {
        backgroundColor: '#111827',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#374151',
    },
    sectionTitle: {
        marginBottom: 16,
        fontSize: 18,
    },
    steps: {
        gap: 16,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepNumberContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#374151',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepNumber: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    stepText: {
        flex: 1,
        color: '#D1D5DB',
    },
    visualGuide: {
        marginBottom: 24,
    },
    guidePlaceholder: {
        height: 200,
        backgroundColor: '#CD7F32', // Bronze/Orange tone
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    guideText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        opacity: 0.8,
    },
    thresholdLine: {
        position: 'absolute',
        right: '25%',
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    thresholdLabel: {
        position: 'absolute',
        right: '26%',
        top: 10,
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    calibrationInfo: {
        marginBottom: 20,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#1E293B',
    },
});
