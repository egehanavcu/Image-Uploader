import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./Upload.module.css";
import Button from "../UI/Button";

const Upload = () => {
  const navigate = useNavigate();
  const uploadTag = useRef();
  const [uploadText, setUploadText] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append("title", event.target[0].value);
    formData.append("photo", uploadTag.current.files[0]);
    formData.append("description", event.target[2].value);

    axios
      .post("/api/upload-image", formData, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        navigate("/image/" + response.data.name);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };
  return (
    <React.Fragment>
      <form
        method="post"
        encType="multipart/form-data"
        className={classes.form}
        onSubmit={(event) => {
          submitHandler(event);
        }}
      >
        <input type="text" placeholder="Image Name (not required)" />
        <label htmlFor="photo">
          <div className={classes["file-info"]}>
            {uploadText === "" ? (
              <React.Fragment>
                <p>File not selected</p>
                <h1>Upload Image</h1>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p>File selected</p>
                <h1>{uploadText}</h1>
              </React.Fragment>
            )}
          </div>
          <input
            type="file"
            id="photo"
            style={{ display: "none" }}
            ref={uploadTag}
            onChange={(event) => {
              setUploadText(event.target.value.replace(/^.*[\\\/]/, ""));
            }}
          />
        </label>
        <textarea rows="5" placeholder="Description (not required)"></textarea>
        <Button style={{ padding: "1rem" }} value="Upload" />
      </form>
    </React.Fragment>
  );
};

export default Upload;
