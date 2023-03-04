import React, { useEffect, Suspense, useState } from "react";
import { Await, defer, useLoaderData } from "react-router-dom";

import ImageColumn from "../components/Images/ImageColumn";

import classes from "./Home.module.css";

const HomePage = () => {
  const { imagesData: loaderImagesData } = useLoaderData();
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    loaderImagesData.then((loadedImages) => {
      setImages(loadedImages);
    });
  }, [loaderImagesData]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setPage((previousPage) => {
          const newPage = previousPage + 1;

          const fetchImages = fetch(`/api/images/${newPage}`);
          fetchImages
            .then((response) => {
              return response.json();
            })
            .then((nextImages) => {
              setImages((previousImages) => {
                return [...previousImages, ...nextImages];
              });
            });

          return newPage;
        });
      }
    });
  }, []);

  return (
    <React.Fragment>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Await resolve={images}>
          <div className={classes.flex}>
            <div className={classes["images-container"]}>
              <ImageColumn images={images} />
            </div>
          </div>
        </Await>
      </Suspense>
    </React.Fragment>
  );
};

export default HomePage;

async function fetchImages(page) {
  const response = await fetch(`/api/images/0`);
  const resData = await response.json();
  return resData;
}

export function loader() {
  return defer({ imagesData: fetchImages(0) });
}
