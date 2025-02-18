import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import type { Equipment } from '../../types/schema';

const equipment: Equipment[] = [
  { n: 'Four', d: 'Utilisé pour rôtir' },
  { n: 'Couteau', d: 'Trancher les légumes' }
];

export default function EquipmentScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textLight]}>Équipement</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.equipmentGrid}>
          {equipment.map((item, index) => (
            <View
              key={index}
              style={[styles.equipmentCard, isDark && styles.equipmentCardDark]}>
              <Text style={[styles.equipmentTitle, isDark && styles.textLight]}>{item.n}</Text>
              <Text style={[styles.equipmentDescription, isDark && styles.textLight]}>
                {item.d}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textLight: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  equipmentGrid: {
    padding: 20,
    gap: 20,
  },
  equipmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  equipmentCardDark: {
    backgroundColor: '#1A1A1A',
  },
  equipmentTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  equipmentDescription: {
    fontSize: 16,
    color: '#666666',
  },
});