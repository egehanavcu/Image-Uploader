import classes from "./Button.module.css";

const Button = ({ style, value }) => {
  return (
    <input
      type="submit"
      className={classes.button}
      style={style}
      value={value}
    />
  );
};

export default Button;
