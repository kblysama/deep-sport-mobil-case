import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import { RefObject } from 'react';

export const requestMediaLibraryPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
};

export const takeScreenshot = async (cameraRef: RefObject<any>) => {
    if (cameraRef.current) {
        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.7,
                skipProcessing: true, // Faster capture
            });
            return photo;
        } catch (error) {
            console.error('Error taking picture:', error);
            return null;
        }
    }
    return null;
};

export const saveToGallery = async (uri: string) => {
    try {
        const asset = await MediaLibrary.createAssetAsync(uri);
        return asset;
    } catch (error) {
        console.error('Error saving to gallery:', error);
        return null;
    }
};
