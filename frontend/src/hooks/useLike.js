import axios from "axios";

const useLike = (id) => {
  return (id) => {
    let formData = new FormData();
    formData.append("name", id);
    axios.post("/api/like", formData, {
      method: "POST",
    });

    let localStorageLikes =
      JSON.parse(window.localStorage.getItem("likes")) || [];

    if (!localStorageLikes.includes(id)) {
      localStorageLikes.push(id);
    }

    window.localStorage.setItem("likes", JSON.stringify(localStorageLikes));
  };
};

export default useLike;
