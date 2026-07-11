import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { scaleWidth, scaleHeight, scaleFont } from '../utils/responsive';

export default function SplashScreen() {
  return (
    <ImageBackground
      source={require('../assets/splash.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.spacer} />

        <View style={styles.center}>
          <Text style={styles.title}>Plié</Text>
          <Text style={styles.tagline}>ELEVATE THE MOVEMENT</Text>

          <ActivityIndicator
            style={{ marginTop: scaleHeight(24) }}
            color="#111"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLine1}>Your Dance - Your Stage</Text>

          <Text style={styles.footerLine2}>DISCOVER · BOOK · MOVE</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: scaleHeight(60),
  },
  spacer: { flex: 1 },
  center: { alignItems: 'center' },
  title: { fontSize: scaleFont(40), fontWeight: '700', color: '#111' },
  tagline: {
    fontSize: scaleFont(12),
    letterSpacing: 1.5,
    color: '#333',
    marginTop: scaleHeight(8),
  },
  footer: { alignItems: 'center' },
  footerLine1: { fontSize: scaleFont(12), color: '#333', fontWeight: '600' },
  footerLine2: {
    fontSize: scaleFont(10),
    color: '#666',
    marginTop: scaleHeight(4),
    letterSpacing: 1,
  },
});
