import classes from "./Filter.module.css";

const Filter = () => {
  return (
    <div className={classes["dropdown"]}>
      <span>
        MOST LIKED
        <span className="material-symbols-outlined">keyboard_arrow_down</span>
      </span>
      <div className={classes["dropdown-content"]}>
        <ul className={classes.filters}>
          <li>MOST LIKED</li>
          <div style={{ margin: "0.5rem" }}></div>
          <li>MOST VIEWED</li>
        </ul>
      </div>
    </div>
  );
};

export default Filter;
