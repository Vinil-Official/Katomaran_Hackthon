import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "journal_entries";

// ✅ Initialize storage
export const initDB = async () => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    if (!existing) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      console.log("✅ AsyncStorage initialized");
    }
  } catch (err) {
    console.log("AsyncStorage init error:", err);
  }
};

// ✅ Add new entry
export const addEntry = async (entry, callback) => {
  try {
    const existing = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY) || "[]");
    const id = Date.now(); // simple unique id
    const newEntry = { ...entry, id };
    existing.push(newEntry);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    console.log("✅ Entry added");
    callback && callback();
  } catch (err) {
    console.log("Add entry error:", err);
  }
};

// ✅ Get all entries
export const getEntries = async (setEntries) => {
  try {
    const existing = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY) || "[]");
    setEntries(existing);
  } catch (err) {
    console.log("Get entries error:", err);
  }
};

// ✅ Delete entry by id
export const deleteEntry = async (id, callback) => {
  try {
    const existing = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY) || "[]");
    const filtered = existing.filter((e) => e.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    console.log("✅ Entry deleted");
    callback && callback();
  } catch (err) {
    console.log("Delete entry error:", err);
  }
};

// ✅ Update entry by id (Edit feature)
export const updateEntry = async (id, updatedEntry, callback) => {
  try {
    const existing = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY) || "[]");
    const updatedList = existing.map((entry) =>
      entry.id === id ? { ...entry, ...updatedEntry } : entry
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    console.log("✅ Entry updated");
    callback && callback();
  } catch (err) {
    console.log("Update entry error:", err);
  }
};
