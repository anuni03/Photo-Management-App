import React, { useState, useContext } from "react";
import { PhotoContext } from "../context/PhotoContext";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; 

import "./UploadPage.css";
import { storage, db } from "../firebase"; 

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const { addPhoto } = useContext(PhotoContext); //global context
  const navigate = useNavigate();
//Prevents default form submission behaviour
  const handleSubmit = async (e) => {
    e.preventDefault();

    //  This Check for empty fields
    if (!title || !description || !file) {
      setError("All fields are required.");
      return;
    }

    // Generate a unique identifier using uuid
    const photoId = uuidv4();

    // Create a storage reference
    const storageRef = ref(storage, `images/${photoId}-${file.name}`);

    // Upload the file
    try {
      await uploadBytes(storageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Add data to Firestore
      const photosCollection = collection(db, 'photos');
      await addDoc(photosCollection, {
        id: photoId,
        title,
        description,
        imageUrl: downloadURL,
        timestamp: serverTimestamp(),
      });

      // Create a new photo object with the unique identifier
      const newPhoto = {
        id: photoId,
        title,
        description,
        imageUrl: downloadURL,
      };

      // Add the new photo to the context
      addPhoto(newPhoto);
      navigate("/");
    } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error);
      setError('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="upload-container">
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Photo:
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadPage;
