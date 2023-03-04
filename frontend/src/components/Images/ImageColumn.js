import React from "react";
import MiniImage from "./MiniImage";

const ImageColumn = ({ images }) => {
  return (
    <React.Fragment>
      {[1, 2, 3, 0].map((columnId) => {
        const columnImages = images.map((image, index) => {
          const imageOrder = index + 1;
          if (imageOrder % 4 == columnId) {
            return (
              <MiniImage
                key={image.name}
                id={image.name}
                url={`/images/${image.name}.${image.extension}`}
              />
            );
          }
        });
        return <div key={columnId}>{columnImages}</div>;
      })}
    </React.Fragment>
  );
};

export default ImageColumn;
