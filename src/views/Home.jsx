import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../js/store/appContext";
import moment from "moment";
import Posts from "./Posts";

export const Home = () => {
  const { store, actions } = useContext(Context);
  const [preview, setPreview] = useState(null);
  const [postPic, setPostPic] = useState(null);
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const getCurrentDate = () => {
    return moment().format("YYYY-MM-DD");
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleImage = (e) => {
    const pictureToUpload = e.target.files[0];
    setPostPic(pictureToUpload);

    if (pictureToUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(pictureToUpload);
    } else {
      setPreview(null);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!postPic) {
      alert("Please, select a picture first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", postPic);
    formData.append("created_at", getCurrentDate());
    formData.append("location", JSON.stringify(location));
    formData.append("message", message);

    const result = await actions.createPost(formData);
    if (result) {
      alert("Published");
      document.getElementById("closePicModalButton").click();
      await actions.getPosts();
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="container my-5">
      {store.loggedUser === null && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {store.loggedUser === false && (
        <div className="body text-center m-5">
          <div className="d-grid gap-2 m-auto" style={{ width: "26rem" }}>
            <h1 className="text-primary-custom">
              <Link to="/login">Login</Link> or{" "}
              <Link to="/signup">register</Link> to watch some fun content.
            </h1>
          </div>
        </div>
      )}
      {store.loggedUser && (
        <>
          <div className="d-grid gap-2 col-6 mx-auto mb-4">
            <button
              type="button"
              className="btn btn-secondary ms-2 edit-picture-btn"
              data-bs-toggle="modal"
              data-bs-target="#picModal"
            >
              Create a post
            </button>
          </div>
          <div className="d-flex justify-content-center">
            <div>
              <Posts />
            </div>
          </div>
        </>
      )}
      <div
        className="modal fade"
        id="picModal"
        tabIndex="-1"
        aria-labelledby="postPicModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="postPicModalLabel">
                Update Profile Picture
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closePicModalButton"
              ></button>
            </div>
            <div className="picture-upload-container m-2">
              <form
                onSubmit={handleImageSubmit}
                className="picture-upload-form"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-3"
                  name="post_picture"
                  onChange={handleImage}
                />
                {preview && (
                  <div className="preview-container text-center">
                    <img
                      src={preview}
                      alt="Selected"
                      className="preview-image"
                    />
                  </div>
                )}
                <div className="modal-body">
                  <textarea
                    className="form-control"
                    placeholder="Post description"
                    style={{ height: "100px" }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
