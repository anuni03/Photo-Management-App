import React, { useContext, useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { PhotoContext } from "../context/PhotoContext";
import { getDownloadURL, ref } from 'firebase/storage';
import { collection, doc, getDoc } from "firebase/firestore";
import { storage,db } from '../firebase';
import "./PhotoDetailsPage.css";

const PhotoDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { photos } = useContext(PhotoContext);
  const [photoDetails, setPhotoDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhotoDetails = async () => {
      try {
        // Try to find the photo in the context first
        const matchingPhoto = photos.find((photo) => photo.id === id);
        if (matchingPhoto) {
          // Fetch download URL from Storage if needed
          if (!matchingPhoto.imageUrl) {
            const storageRef = ref(storage, `images/${matchingPhoto.id}`);
            const downloadURL = await getDownloadURL(storageRef);
            setPhotoDetails({
              ...matchingPhoto,
              imageUrl: downloadURL,
            });
          } else {
            setPhotoDetails(matchingPhoto);
          }
        } else {
          // Fetch from Firestore if not found in context
          const imagesCollection = collection(db, 'images');
          const photoDoc = doc(imagesCollection, id);
          const photoDocSnapshot = await getDoc(photoDoc);
          if (photoDocSnapshot.exists()) {
            const photoDetailsFromFirestore = photoDocSnapshot.data();
            const storageRef = ref(storage, `images/${photoDetailsFromFirestore.id}`);
            const downloadURL = await getDownloadURL(storageRef);
            setPhotoDetails({
              ...photoDetailsFromFirestore,
              imageUrl: downloadURL,
            });
          } else {
            setError('Photo not found');
          }
        }
      } catch (error) {
        setError('Error fetching photo details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotoDetails();
  }, [id, photos]);

  if (isLoading) {
    return (
      <div className="photo-details-container" style={{ textAlign: "center" }}>
        <p>Loading photo details...</p>
      </div>
    );
  }
 

 

  return (
    <div className="photo-details-container">
    {photoDetails &&(
    <>
      <img src={photoDetails.imageUrl} alt={photoDetails.title} className="photo-fullsize" />
      <h2>{photoDetails.title}</h2>
      <p>{photoDetails.description}</p>
      <button onClick={() => navigate(-1)} className="back-button">Back to Gallery</button>
      </>
    
  )}
</div>
  );
    };

export default PhotoDetailsPage;


