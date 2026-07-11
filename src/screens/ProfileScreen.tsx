import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { scaleWidth, scaleHeight, scaleFont } from '../utils/responsive';

interface MenuItem {
  key: string;
  label: string;
}

const MENU_ITEMS: MenuItem[] = [
  { key: 'tickets', label: 'My Tickets' },
  { key: 'payments', label: 'Payment Methods' },
  { key: 'notifications', label: 'Notification Settings' },
  { key: 'help', label: 'Help & Support' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Plié</Text>

      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>{(user?.usr_fname || 'D')[0]}</Text>
        </View>
      </View>
      <Text style={styles.name}>
        {user ? `${user.usr_fname} ${user.usr_lname}` : 'Dance Enthusiast'}
      </Text>
      <Text style={styles.email}>{user?.usr_email || 'abc@gmail.com'}</Text>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity key={item.key} style={styles.menuItem}>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.logoutLabel}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: scaleHeight(12) },
  brand: { fontSize: scaleFont(20), fontWeight: '700', textAlign: 'center' },
  avatarWrap: { alignItems: 'center', marginTop: scaleHeight(24) },
  avatar: {
    width: scaleWidth(84),
    height: scaleWidth(84),
    borderRadius: scaleWidth(42),
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { fontSize: scaleFont(28), fontWeight: '700', color: '#666' },
  name: { fontSize: scaleFont(18), fontWeight: '700', textAlign: 'center', marginTop: scaleHeight(12) },
  email: { fontSize: scaleFont(13), color: '#999', textAlign: 'center', marginTop: scaleHeight(2) },
  menu: { marginTop: scaleHeight(32), paddingHorizontal: scaleWidth(16) },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleHeight(16),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLabel: { fontSize: scaleFont(15), color: '#111' },
  chevron: { fontSize: scaleFont(18), color: '#bbb' },
  logoutLabel: { fontSize: scaleFont(15), color: '#C1272D', fontWeight: '600' },
});
