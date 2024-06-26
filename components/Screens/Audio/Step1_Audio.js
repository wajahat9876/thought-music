import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getRespValue } from "../../../design/desin";
import Header from "../../global/Header/index";
import Background from "../../global/ImageBackground/index";

const tracks = [
  {
    id: 1,
    Url: require("../../../assets/Sound/Humnava.mp3"),
    title: "Humnava",
    artist: "Humnava",
    artwork: require("../../../assets/SoundImages/humnava.jpeg"),
  },
  {
    id: 2,
    Url: require("../../../assets/Sound/Pehli.mp3"),
    title: "Pehli",
    artist: "Pehli",
    artwork: require("../../../assets/SoundImages/pehli.jpeg"),
  },
  {
    id: 3,
    Url: require("../../../assets/Sound/Arijit.mp3"),
    title: "Arijit",
    artist: "Arijit",
    artwork: require("../../../assets/SoundImages/arijit.jpeg"),
  },
  {
    id: 4,
    Url: require("../../../assets/Sound/12Saal.mp3"),
    title: "12 Saal",
    artist: "Bilal Saeed",
    artwork: require("../../../assets/SoundImages/12Saal.jpg"),
  },
  {
    id: 5,
    Url: require("../../../assets/Sound/bilalSaeed.mp3"),
    title: "Uchiyan Dewaran",
    artist: "Bilal Saeed",
    artwork: require("../../../assets/SoundImages/uchiyan.jpg"),
  },
];

const Step1_Audio = () => {
  const [sound, setSound] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(true);

  useEffect(() => {
    const loadAudio = async () => {
      setLoading(true);
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        tracks[currentTrackIndex].Url,
        {},
        updatePlaybackStatus
      );
      setSound(newSound);
      setLoading(false);
      setIsPlaying(false);
      await newSound.playAsync(); // Automatically play the sound once loaded
      setIsPlaying(true); // Update the state to reflect the playing status
    };

    if (currentTrackIndex !== null) {
      loadAudio();
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
  }, [sound]);

  const updatePlaybackStatus = (status) => {
    setPosition(status.positionMillis);
    setDuration(status.durationMillis);
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      playNextTrack();
    }
    setPosition(status.positionMillis);
    setDuration(status.durationMillis);
  };

  const playSound = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  const selectTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaylistVisible(false);
  };

  return (
    <View style={styles.container}>
      {isPlaylistVisible && (
        <Header>
          <Background>
            <FlatList
              style={{ marginBottom: 90 }}
              scrollEnabled
              showsVerticalScrollIndicator={false}
              data={tracks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectTrack(item.id - 1)}
                  style={styles.playlistItem}
                >
                  <View style={{ flex: 1 }}>
                    <Image source={item.artwork} style={styles.image} />
                    <Text style={{ color: "white", fontSize: getRespValue(18) }}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </Background>
        </Header>
      )}
      <Modal
        visible={!isPlaylistVisible && currentTrackIndex !== null}
        animationType="slide"
        onRequestClose={() => setIsPlaylistVisible(true)}
      >
        <ImageBackground
          resizeMode="cover"
          source={tracks[currentTrackIndex]?.artwork}
          style={styles.backgroundImage}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.title}>{tracks[currentTrackIndex]?.title}</Text>
            <Text style={styles.artist}>{tracks[currentTrackIndex]?.artist}</Text>
            <View style={styles.controls}>
              {loading ? (
                <Ionicons name="refresh-circle" size={64} color="white" />
              ) : isPlaying ? (
                <TouchableOpacity onPress={pauseSound}>
                  <Ionicons
                    name="pause-circle-sharp"
                    size={84}
                    color="white"
                    style={{ opacity: 0.4 }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={playSound}>
                  <Ionicons
                    name="play-circle"
                    size={84}
                    color="white"
                    style={{ opacity: 0.4 }}
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={() => {
                setIsPlaylistVisible(true);
                pauseSound(); // Stop the sound when close icon is pressed
              }}
              style={[styles.closeButton, { opacity: loading ? 0.5 : 1 }]} // Disable close icon if loading
              disabled={loading}
            >
              <Ionicons name="close-circle" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Modal>
    </View>
  );
};

export default Step1_Audio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 5,
  },
  closeButton: {
    position: "absolute",
    bottom: getRespValue(80),
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  artist: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 150,
    alignItems: "center",
  },
  playlistContainer: {
    flex: 1,
    paddingTop: 10,
  },
  playlistItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    flexDirection: "row",
  },
});
