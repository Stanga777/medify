import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { styles } from '../estilos/estilos';

interface PantallaCargarRecetaProps {
  uploadedImage: string | null;
  onNavigate: (screen: string) => void;
  onTakePhoto: () => void;
  onPickImage: () => void;
  onClearImage: () => void;
}

export const PantallaCargarReceta: React.FC<PantallaCargarRecetaProps> = ({
  uploadedImage,
  onNavigate,
  onTakePhoto,
  onPickImage,
  onClearImage
}) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={() => onNavigate('dashboard')}>
        <Text style={styles.backButton}>← Atrás</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Cargar Receta</Text>
    </View>
    
    <View style={styles.centerContainer}>
      {!uploadedImage ? (
        <>
          <View style={styles.uploadPlaceholder}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadText}>Coloca la receta dentro del marco</Text>
          </View>
          
          <TouchableOpacity onPress={onTakePhoto} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>📸 Tomar Foto</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onPickImage} style={[styles.secondaryButton, { marginTop: 16 }]}>
            <Text style={styles.secondaryButtonText}>🖼️ Subir desde Galería</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Image 
            source={{ uri: uploadedImage }} 
            style={styles.uploadedImage}
            resizeMode="contain"
          />
          
          <TouchableOpacity onPress={() => onNavigate('pharmacies')} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>✓ Usar esta foto</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onClearImage} style={[styles.secondaryButton, { marginTop: 16 }]}>
            <Text style={styles.secondaryButtonText}>Tomar otra foto</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </SafeAreaView>
);