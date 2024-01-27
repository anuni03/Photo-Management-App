import React, { createContext, useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase.js'; // Adjust the path

export const PhotoContext = createContext();

export const PhotoProvider = ({ children }) => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const photosCollection = collection(db, 'photos');

    // Real-time listener
    const unsubscribe = onSnapshot(photosCollection, (snapshot) => {
      const fetchedPhotos = [];
      snapshot.forEach((doc) => {
        fetchedPhotos.push({ id: doc.id, ...doc.data() });
      });
      setPhotos(fetchedPhotos);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching photos:', error);
      setError(error);
      setIsLoading(false);
    });

    // Unsubscribe from the listener when component unmounts
    return () => unsubscribe();
  }, []);

  const addPhoto = async (newPhoto) => {
    try {
      // Upload the new photo to Firebase Storage
      const storageRef = ref(storage, `images/${newPhoto.file.name}`);
      await uploadBytes(storageRef, newPhoto.file);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Add title, description, and download URL to Firestore
      const photosCollection = collection(db, 'photos');
      await addDoc(photosCollection, {
        title: newPhoto.title,
        description: newPhoto.description,
        imageUrl: downloadURL,
      });
    } catch (error) {
      console.error('Error adding photo:', error);
    }
  };

  return (
    <PhotoContext.Provider value={{ photos, addPhoto, isLoading, error }}>
      {children}
    </PhotoContext.Provider>
  );
};
