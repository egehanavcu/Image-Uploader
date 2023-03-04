import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./MiniImage.module.css";
import useLike from "../../hooks/useLike";

const MiniImage = ({ id, url }) => {
  const cardRef = useRef();
  const imageRef = useRef();
  const [cardOnMouse, setCardOnMouse] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    (JSON.parse(window.localStorage.getItem("likes")) || []).includes(id)
  );
  const navigate = useNavigate();
  const sendLike = useLike();

  const mouseOverHandler = (event) => {
    setCardOnMouse(true);
  };

  const mouseOutHandler = (event) => {
    setCardOnMouse(false);
  };

  const preventCardClick = (e) => {
    if (!e) e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  };

  useEffect(() => {
    if (hasLiked) {
      const localStorage = window.localStorage.getItem("likes") || [];
      if (!localStorage.includes(id)) {
        sendLike(id);
      }
    }
  }, [hasLiked]);

  useEffect(() => {
    if (cardOnMouse) {
      const height = imageRef.current.height;
      cardRef.current.style.background =
        "linear-gradient(to bottom, transparent 0%, black 100%)";
      cardRef.current.style.display = "";
      cardRef.current.style.height = `${height}px`;
    } else {
      imageRef.current.style.filter = "blur(0px)";
      cardRef.current.style.display = "none";
    }
  }, [cardOnMouse]);

  return (
    <div
      className={classes["img-container"]}
      onMouseOver={mouseOverHandler}
      onMouseOut={mouseOutHandler}
    >
      <img src={url} alt={id} className={classes.img} ref={imageRef} />
      <div
        onClick={() => {
          navigate(`/image/${id}`);
        }}
      >
        <div className={classes["hidden-card"]} ref={cardRef}>
          <span
            className={`material-symbols-outlined ${classes["reaction"]} ${
              hasLiked ? classes.active : ""
            }`}
            onClick={(event) => {
              preventCardClick(event);
              if (!hasLiked) {
                setHasLiked(true);
              }
            }}
          >
            favorite
          </span>
        </div>
      </div>
    </div>
  );
};

export default MiniImage;
