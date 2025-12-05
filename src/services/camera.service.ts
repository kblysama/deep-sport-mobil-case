import { Camera } from 'expo-camera';

export const requestCameraPermissions = async (): Promise<boolean> => {
    const { status } = await (Camera as any).requestCameraPermissionsAsync();
    return status === 'granted';
};

export const getCameraPermissions = async (): Promise<boolean> => {
    const { status } = await (Camera as any).getCameraPermissionsAsync();
    return status === 'granted';
};
