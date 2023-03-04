import React, { useState, useEffect, Suspense, useRef } from "react";
import { Await, defer, useLoaderData, useParams } from "react-router-dom";
import useLike from "../hooks/useLike";

import classes from "./Image.module.css";

const ImagePage = () => {
  const { imageData: loaderImageData } = useLoaderData();
  const { imageId: id } = useParams();
  const [image, setImage] = useState({});
  const [hasLiked, setHasLiked] = useState(
    (JSON.parse(window.localStorage.getItem("likes")) || []).includes(id)
  );
  const likeCountRef = useRef();
  const sendLike = useLike();

  useEffect(() => {
    loaderImageData.then((detail) => {
      setImage(detail);
    });
  }, [loaderImageData]);

  useEffect(() => {
    if (hasLiked) {
      const localStorage = window.localStorage.getItem("likes") || [];
      if (!localStorage.includes(id)) {
        likeCountRef.current.innerHTML =
          Number(likeCountRef.current.innerHTML) + 1;
        sendLike(id);
      }
    }
  }, [hasLiked]);

  const previewUrl = `${window.location.origin}/image/${image.name}`;
  const imageURL = `${window.location.origin}/images/${
    image.name + "." + image.extension
  }`;

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Await resolve={loaderImageData}>
        <div className={classes.image}>
          <img src={imageURL} />
          <div className={classes.detail}>
            {image.title && <h1>{image.title}</h1>}
            {image.description && (
              <p>
                <span className="material-symbols-outlined">description</span>
                {image.description}
              </p>
            )}
            <p>
              <span className="material-symbols-outlined">calendar_month</span>
              {image.created_at}
            </p>
            <span
              className={`material-symbols-outlined ${classes.heart} ${
                hasLiked ? classes["heart-active"] : undefined
              }`}
              onClick={() => {
                if (!hasLiked) {
                  setHasLiked(true);
                }
              }}
            >
              favorite
            </span>
            <div className={classes["heart-count"]} ref={likeCountRef}>
              {image.likes}
            </div>
            <div style={{ marginBottom: "2.5rem" }} />
            {[previewUrl, imageURL].map((url) => {
              return (
                <p
                  className={classes.url}
                  style={{ color: "#009DDC", fontWeight: "bold" }}
                  key={url}
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                  }}
                >
                  <span className="material-symbols-outlined">
                    content_copy
                  </span>
                  {url} <span>(click to copy)</span>
                </p>
              );
            })}
          </div>
        </div>
      </Await>
    </Suspense>
  );
};

export default ImagePage;

async function fetchImageDetail(imageId) {
  const response = await fetch(`/api/image/${imageId}`);
  const resData = await response.json();
  return resData;
}

export function loader({ params }) {
  return defer({ imageData: fetchImageDetail(params.imageId) });
}
