import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Alert, Pressable, StyleSheet } from 'react-native';

import { useUpdateAvatar } from '@/api/update-profile';
import { uploadAvatar } from '@/api/upload-image';
import { black, white } from '@/components/obytes/colors';
import { translate } from '@/i18n';
import { useAuthStore } from '@/stores/useAuthStore';

const AvatarPicker = ({ userId }: { userId: string }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const setProfile = useAuthStore((state) => state.setProfile);

  const { mutate: updateAvatar } = useUpdateAvatar();

  const handleImagePickerPress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    try {
      if (!result.canceled) {
        const imagePath = await uploadAvatar(result.assets[0].uri);
        if (!imagePath) return;

        updateAvatar(
          { userId: userId, img_url: imagePath },
          {
            onSuccess: (profile) => {
              setProfile(profile);
            },
          }
        );
      }
    } catch (error) {
      Alert.alert(translate('profile.avatar.error'));
    }
  };

  return (
    <Pressable onPress={handleImagePickerPress} style={styles.cameraIcon}>
      <Camera size={30} color={isDark ? white : black} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cameraIcon: {
    position: 'absolute',
    right: -16,
    bottom: -16,
  },
});

export default AvatarPicker;
