import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import AppText from '../components/common/AppText';
import AppButton from '../components/common/AppButton';
import LanguageToggle from '../components/common/LanguageToggle';

export default function WelcomeScreen({ navigation }: any) {
    const { t } = useLanguage();

    const features = [
        {
            title: t('gestureControlTitle'),
            desc: t('gestureControlDesc'),
            icon: 'hand-left-outline',
        },
        {
            title: t('poseDetectionTitle'),
            desc: t('poseDetectionDesc'),
            icon: 'body-outline',
        },
        {
            title: t('secureLocalTitle'),
            desc: t('secureLocalDesc'),
            icon: 'lock-closed-outline',
        },
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
                <View style={styles.hero}>
                    <AppText variant="h1" style={styles.heroTitle}>{t('welcomeTitle')}</AppText>
                    <AppText variant="body" style={styles.heroSubtitle}>
                        {t('welcomeSubtitle')}
                    </AppText>
                </View>

                <View style={styles.features}>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featureCard}>
                            <View style={styles.iconContainer}>
                                <Ionicons name={feature.icon as any} size={24} color="#2563EB" />
                            </View>
                            <View style={styles.featureContent}>
                                <AppText variant="h3" style={styles.featureTitle}>{feature.title}</AppText>
                                <AppText variant="caption" style={styles.featureDesc}>{feature.desc}</AppText>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <AppButton title={t('start')} onPress={() => navigation.navigate('IntroCalibration')} />
                <View style={styles.links}>
                    <AppText variant="caption">{t('privacyPolicy')}</AppText>
                    <AppText variant="caption"> • </AppText>
                    <AppText variant="caption">{t('termsOfService')}</AppText>
                </View>
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
    hero: {
        marginTop: 20,
        marginBottom: 40,
    },
    heroTitle: {
        marginBottom: 12,
    },
    heroSubtitle: {
        lineHeight: 24,
    },
    features: {
        gap: 16,
    },
    featureCard: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#374151',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        marginBottom: 4,
        fontSize: 16,
    },
    featureDesc: {
        color: '#9CA3AF',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#1E293B',
    },
    links: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        opacity: 0.6,
    },
});
