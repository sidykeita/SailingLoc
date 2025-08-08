// src/pages/boats/TestUpload.jsx
import React from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export default function TestUpload() {
  const handleTest = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log("Uploading...", file);
    try {
      const storageRef = ref(storage, "test/" + file.name);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log("SUCCESS URL:", url);
      alert("Upload réussi ! URL : " + url);
    } catch (err) {
      console.error("UPLOAD ERROR", err);
      alert("Erreur upload : " + err.message);
    }
  };
  return (
    <div style={{padding: 30}}>
      <h2>Test Upload Firebase</h2>
      <input type="file" onChange={handleTest} />
    </div>
  );
}