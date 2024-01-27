import React, { useContext, useEffect, useState } from "react";
import { PhotoContext } from "../context/PhotoContext";
import { Link } from "react-router-dom";
import { getDownloadURL, ref } from 'firebase/storage';
import { storage,db } from "../firebase";
import { collection, onSnapshot } from 'firebase/firestore';
import "./GalleryPage.css";

const GalleryPage = () => {
  const { photos } = useContext(PhotoContext);
  const [firebasePhotos, setFirebasePhotos] = useState([]);
  
  useEffect(() => {
    // Fetch photos directly from Firestore on mount
    const photosCollection = collection(db, 'photos');
    const unsubscribe = onSnapshot(photosCollection, (snapshot) => {
      const updatedPhotos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFirebasePhotos(updatedPhotos);
      

    });
   
    // Fetch download URLs for currently fetched photos
    const fetchImageUrls = async () => {
      const updatedPhotosWithUrls = await Promise.all(
        firebasePhotos.map(async (photo) => {
          const storageRef = ref(storage, `images/${photo.id}`);
          const downloadURL = await getDownloadURL(storageRef);
          return { ...photo, imageUrl: downloadURL };
        })
      );
      setFirebasePhotos(updatedPhotosWithUrls);
    };

    fetchImageUrls();
    

    // Cleanup function to unsubscribe from Firestore listener
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div className="gallery-container">
        {
            (
          firebasePhotos.map((photo) => (
            <Link key={photo.id} to={`/photo/${photo.id}`}>
              <div className="photo-item">
                <img src={photo.imageUrl} alt={photo.title} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
