import auth from "@/Service/FireAuth";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getAITags } from "./aiTagging";
import { addEntry, deleteEntry, getEntries, initDB, updateEntry } from "./CenterData";

export default function JournalPage({navigation}) {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [locationFilter, setLocationFilter] = useState(null);

  // Edit mode state
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    initDB();
    loadEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, searchQuery, tagFilter, dateFrom, dateTo, locationFilter]);

  const loadEntries = () => getEntries(setEntries);

  const handleAddPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        let aiTags = [];
        try {
          aiTags = await getAITags(uri);
        } catch (err) {
          console.log("AI tagging failed:", err);
        }
        setPhotos([...photos, { uri, tags: aiTags }]);
      }
    } catch (err) {
      console.log("Image picker error:", err);
    }
  };

  const handleAddOrUpdateEntry = async () => {
    if (!title.trim()) {
      Alert.alert("Title required");
      return;
    }

    let location = { coords: { latitude: 0, longitude: 0 } };
    try {
      await Location.requestForegroundPermissionsAsync();
      location = await Location.getCurrentPositionAsync({});
    } catch (err) {
      console.log("Location error:", err);
    }

    const newEntry = {
      title,
      description,
      photos,
      dateTime: new Date().toISOString(),
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    if (editingId) {
      await updateEntry(editingId, newEntry, loadEntries);
      setEditingId(null);
    } else {
      await addEntry(newEntry, loadEntries);
    }

    setTitle("");
    setDescription("");
    setPhotos([]);
  };

  const handleEdit = (entry) => {
    setTitle(entry.title);
    setDescription(entry.description);
    setPhotos(entry.photos);
    setEditingId(entry.id);
  };

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  const filterEntries = () => {
    const filtered = entries.filter((e) => {
      const matchesKeyword =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag =
        !tagFilter ||
        e.photos.some((p) =>
          p.tags.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()))
        );

      const entryDate = new Date(e.dateTime);
      const matchesDate =
        (!dateFrom || entryDate >= new Date(dateFrom)) &&
        (!dateTo || entryDate <= new Date(dateTo));

      let matchesLocation = true;
      if (locationFilter) {
        const distanceKm = getDistanceFromLatLonInKm(
          e.latitude,
          e.longitude,
          locationFilter.latitude,
          locationFilter.longitude
        );
        matchesLocation = distanceKm <= locationFilter.radiusKm;
      }

      return matchesKeyword && matchesTag && matchesDate && matchesLocation;
    });

    setFilteredEntries(filtered);
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const deg2rad = (deg) => deg * (Math.PI / 180);
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const logout=()=>{
    signOut(auth)
    onAuthStateChanged(auth,(user)=>{
      if(user){
        console.log("user_present")
      }else{
        navigation.navigate('Login')

      }
    })
  }

  return (
    <ScrollView style={[styles.container, themeStyles.container]}>
      <View style={styles.themeToggle}>
        <Text style={[styles.toggleText, themeStyles.text]}>
          {isDarkMode ? "Dark Mode" : "Light Mode"}
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          thumbColor={isDarkMode ? "#fff" : "#000"}
          trackColor={{ false: "#ccc", true: "#555" }}
        />
      </View>

      {/* 👇 Logout Button (UI only) */}
      <View style={{ alignItems: "flex-end", marginBottom: 10 }}>
        <TouchableOpacity style={styles.logoutButton}>
          <Text onPress={logout} style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.header, themeStyles.text]}>
        {editingId ? "Edit Journal Entry" : "Add Journal Entry"}
      </Text>

      <TextInput
        placeholder="Title"
        placeholderTextColor={isDarkMode ? "#888" : "#666"}
        style={[styles.input, themeStyles.input]}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Description"
        placeholderTextColor={isDarkMode ? "#888" : "#666"}
        style={[styles.input, { height: 100 }, themeStyles.input]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity
        style={[styles.dropZone, themeStyles.dropZone]}
        onPress={handleAddPhoto}
      >
        <Text style={[styles.dropZoneText, themeStyles.text]}>
          Tap to Select Photos
        </Text>
      </TouchableOpacity>

      <ScrollView horizontal style={{ marginVertical: 10 }}>
        {photos.map((p, i) => (
          <View key={i} style={styles.photoContainer}>
            <Image source={{ uri: p.uri }} style={styles.photo} />
            {p.tags.length > 0 && (
              <Text style={[styles.photoTags, themeStyles.text]}>
                {p.tags.join(", ")}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.saveButton, themeStyles.saveButton]}
        onPress={handleAddOrUpdateEntry}
      >
        <Text style={styles.saveButtonText}>
          {editingId ? "Update Entry" : "Save Entry"}
        </Text>
      </TouchableOpacity>

      {/* Filters */}
      <Text style={[styles.subHeader, themeStyles.text]}>Search & Filters</Text>
      <TextInput
        placeholder="Search by keyword..."
        placeholderTextColor={isDarkMode ? "#888" : "#666"}
        style={[styles.input, themeStyles.input]}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TextInput
        placeholder="Filter by tag..."
        placeholderTextColor={isDarkMode ? "#888" : "#666"}
        style={[styles.input, themeStyles.input]}
        value={tagFilter}
        onChangeText={setTagFilter}
      />
      <TextInput
        placeholder="From (YYYY-MM-DD)"
        placeholderTextColor={isDarkMode ? "#888" : "#666"}
        style={[styles.input, themeStyles.input]}
        value={dateFrom}
        onChangeText={setDateFrom}
      />
      <TextInput
        placeholder="To (YYYY-MM-DD)"
        placeholderTextColor={isDarkMode ? "#888" : "#666"}
        style={[styles.input, themeStyles.input]}
        value={dateTo}
        onChangeText={setDateTo}
      />

      <Text style={[styles.subHeader, themeStyles.text]}>My Entries</Text>
      {filteredEntries.map((e) => (
        <View key={e.id} style={[styles.entryCard, themeStyles.entryCard]}>
          <Text style={[styles.entryTitle, themeStyles.text]}>{e.title}</Text>
          <Text style={[styles.entryDesc, themeStyles.text]}>{e.description}</Text>
          <Text style={[styles.entryDate, themeStyles.date]}>
            {new Date(e.dateTime).toLocaleString()}
          </Text>
          <Text style={[styles.entryDate, themeStyles.date]}>
            📍 Lat: {e.latitude?.toFixed(4)} | Lon: {e.longitude?.toFixed(4)}
          </Text>

          {e.photos.map((p, i) => (
            <View key={i} style={{ marginTop: 8 }}>
              <Image source={{ uri: p.uri }} style={styles.entryPhoto} />
              {p.tags.length > 0 && (
                <Text style={[styles.entryPhotoTags, themeStyles.text]}>
                  {p.tags.join(", ")}
                </Text>
              )}
            </View>
          ))}

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              style={[styles.editButton]}
              onPress={() => handleEdit(e)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteEntry(e.id, loadEntries)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  subHeader: { fontSize: 20, fontWeight: "600", marginVertical: 12 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, marginVertical: 8 },
  dropZone: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginTop: 8,
  },
  dropZoneText: { fontSize: 14, fontWeight: "500" },
  saveButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 12,
  },
  saveButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  photoContainer: { marginRight: 12, alignItems: "center" },
  photo: { width: 90, height: 90, borderRadius: 12 },
  photoTags: { fontSize: 10, marginTop: 4, maxWidth: 90, textAlign: "center" },
  entryCard: {
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  entryTitle: { fontSize: 18, fontWeight: "bold" },
  entryDesc: { marginVertical: 6 },
  entryDate: { fontSize: 12 },
  entryPhoto: { width: "100%", height: 180, borderRadius: 12, marginTop: 6 },
  entryPhotoTags: { fontSize: 12, marginTop: 4 },
  editButton: {
    marginTop: 10,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#007bff",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  editButtonText: { color: "#fff", fontWeight: "600" },
  deleteButton: {
    marginTop: 10,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#ff4d4d",
    alignItems: "center",
    flex: 1,
  },
  deleteButtonText: { color: "#fff", fontWeight: "600" },
  themeToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  toggleText: { fontSize: 16, fontWeight: "600" },

  // 👇 Added logout button styles
  logoutButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#1c1c1c" },
  text: { color: "#fff" },
  input: { borderColor: "#555", backgroundColor: "#2a2a2a", color: "#fff" },
  dropZone: { borderColor: "#555" },
  saveButton: { backgroundColor: "#28a745" },
  entryCard: { backgroundColor: "#2a2a2a", shadowColor: "#000" },
  date: { color: "#888" },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#f2f2f2" },
  text: { color: "#000" },
  input: { borderColor: "#ccc", backgroundColor: "#fff", color: "#000" },
  dropZone: { borderColor: "#aaa" },
  saveButton: { backgroundColor: "#28a745" },
  entryCard: { backgroundColor: "#fff", shadowColor: "#aaa" },
  date: { color: "#555" },
});
