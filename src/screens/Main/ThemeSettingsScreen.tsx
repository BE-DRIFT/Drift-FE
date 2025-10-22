import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, useThemeColors } from '../../hooks/useThemeColors';

const ThemeSettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Theme Settings</Text>
      
      <TouchableOpacity
        style={[styles.option, { backgroundColor: colors.card }]}
        onPress={toggleTheme}
      >
        <Text style={[styles.optionText, { color: colors.text }]}>
          Current Theme: {theme}
        </Text>
        <Text style={[styles.optionSubText, { color: colors.textSecondary }]}>
          Tap to toggle
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionSubText: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default ThemeSettingsScreen;