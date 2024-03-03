import * as FileSystem from "expo-file-system";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useState, useEffect } from "react";
import { Buffer } from "buffer";

export const JsonMaker = ({ formData }) => {
  // const [jsonData, setJsonData] = useState(formData);
  console.log("json", formData);
  const printFormData = () => {
    // setJsonData(formData);

    console.log("formData@jsonmaker", formData);
  };

  ////////////////// Save file and write to json ////////////////////////
  // Convert JSON object to a string
  const filePath = `${FileSystem.documentDirectory}example.json`;
  console.log("filePath", filePath);

  useEffect(() => {
    const WriteJson = () => {
      const formDataRelImgPath = { ...formData };
      // console.log("FROMDATA", formData);
      console.log("formDataRelImgPath", formDataRelImgPath);
      const imgPath = formDataRelImgPath;
      // console.log("imgPath", imgPath);
      // const pathSegments = imgPath.split("/");
      // console.log("pathSegments"), pathSegments;

      // Get the last element from the pathSegments array
      // const lastSegment = pathSegments[pathSegments.length - 1];

      // console.log("last Segment", lastSegment);
      const jsonString = JSON.stringify(formDataRelImgPath);

      // Define the file path (you can choose the file name and location)
      const fileName = `${formDataRelImgPath.windFarm}_${formDataRelImgPath.turbine}_${formDataRelImgPath.date}`;

      // const relativeFilePath = `/example.json`;

      FileSystem.writeAsStringAsync(filePath, jsonString)
        .then(() => {
          console.log("JSON file saved successfully!");
        })
        .catch((error) => {
          console.error("Error saving JSON file:", error);
        });
    };

    WriteJson();
  }, [formData]);

  ////////////////// List files ////////////////////////
  const listFilesInDirectory = async (directoryPath) => {
    try {
      const files = await FileSystem.readDirectoryAsync(directoryPath);
      console.log("Files in Directory: @jsonMaker", files);
    } catch (error) {
      console.error("Error reading directory:", error);
    }
  };

  // Assuming that the directory path is the part before the last '/'
  const directoryPath = filePath.substring(0, filePath.lastIndexOf("/") + 1);

  listFilesInDirectory(directoryPath);

  ////////////////// Upload to DROPBOX ////////////////////////
  const uploadFilesToDropbox = async (dirPath, accessToken, appKey) => {
    try {
      const files = await FileSystem.readDirectoryAsync(dirPath);

      for (const file of files) {
        const filePath = `${dirPath}/${file}`;

        if (filePath.includes("SQLite")) {
          continue;
        }

        let fileContent;
        const fileExtension = file.split(".").pop().toLowerCase();

        if (
          fileExtension === "jpg" ||
          fileExtension === "jpeg" ||
          fileExtension === "json"
        ) {
          fileContent = await FileSystem.readAsStringAsync(filePath, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const uploadUrl = "https://content.dropboxapi.com/2/files/upload";
          const headers = {
            "Content-Type": "application/octet-stream",
            Authorization: `Bearer ${accessToken}`,
            "Dropbox-API-Arg": JSON.stringify({
              path: `/${file}`,
              mode: "add",
              strict_conflict: false,
            }),
          };

          var fileData = Buffer.from(fileContent, "base64");

          // Use the fetch function for the upload
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers,
            body: fileData,
          });

          // Access the content-type from response headers
          console.log(
            `Fileupload ${file} uploaded to Dropbox header content type: ${response.headers.get(
              "content-type"
            )}`
          );
        }
      }

      console.log("All files uploaded successfully.");
    } catch (error) {
      console.error("Error uploading files to Dropbox:", error.message);
    }
  };

  const DBPath = FileSystem.documentDirectory; // Specify the local directory path
  const accessToken =
    "sl.Bu8uklzSKq3PWH3lxzWEnmL91MAJedNfOIZ6IfJgULco3Sns3w_U7nYI0R6DwugZAagd_yAuVhFejtnuJT4FCsCBvIKfzAREiZWdK1eo-t2Fc7J5-p9BhNWUSoa1KzS6TB8fr7aLIn1i9NH-k74w";

  const appKey = "t3vq6p8tpzand8l";

  uploadFilesToDropbox(DBPath, accessToken, appKey);

  return (
    <View style={styles.buttonContainer}>
      <Button style={{ width: 200 }} mode="contained" onPress={printFormData}>
        Save JSON
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally},
    marginBottom: 20,
  },
});
