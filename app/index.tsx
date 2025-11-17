import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useAssets } from 'expo-asset';
import { ResizeMode, Video } from 'expo-av';
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Page = () => {
  const [assets] = useAssets([require('@/assets/videos/intro.mp4')]);

  return (
    <View style={styles.container}>
      {assets && (
        <Video
          resizeMode={ResizeMode.COVER}
          source={{ uri: assets[0].uri }}
          style={styles.video}
          shouldPlay
          isLooping
          isMuted
        />
      )}
      <View style={{ marginTop: 80, padding: 20 }}>
        <Text style={styles.header}>Ready to change the way you money?</Text>
      </View>
      <View style={styles.buttons}>
        <Link
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: Colors.dark },
          ]}
          href="/login"
          asChild
        >
          <TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: '500', color: 'white' }}>
              Log in
            </Text>
          </TouchableOpacity>
        </Link>
        <Link
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: 'white' },
          ]}
          href="/signup"
          asChild
        >
          <TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: '500', color: 'black' }}>
              Sign up
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  header: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    textTransform: 'uppercase',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default Page;
