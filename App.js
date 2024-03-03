import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, ScrollView } from "react-native";
import * as React from "react";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as FileSystem from "expo-file-system";

// Components

import { DataBase } from "./components/dataBase";
import { InputForm } from "./components/inputForm";
import { Delete } from "./components/deleteDocuments";
import { JsonMaker } from "./components/jsonMaker";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

export default function App() {
  // List files in directory
  const listFilesInDirectory = async (directoryPath) => {
    try {
      const files = await FileSystem.readDirectoryAsync(directoryPath);
      console.log("Files in Directory?:", files);
    } catch (error) {
      console.error("Error reading directory:", error);
    }
  };
  const dir = `${FileSystem.documentDirectory}/SQLite`;
  listFilesInDirectory(dir);
  console.log("documentDirectory @app.js", dir);

  const [formData, setFormData] = useState([]);
  // console.log("data@root", formData);
  console.log("data", formData);
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <StatusBar style="auto" />
          <InputForm setFormData={setFormData} />
          <JsonMaker formData={formData} />
          <DataBase formData={formData} />
          <Delete />
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    flexDirection: "column",
  },
});
