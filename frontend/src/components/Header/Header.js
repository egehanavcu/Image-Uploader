import { Link } from "react-router-dom";
import Button from "../UI/Button";
import classes from "./Header.module.css";

import Pages from "./Pages";

const Header = () => {
  return (
    <nav className={classes.header}>
      <div>
        <h1 unselectable="on" className={classes.logo}>
          <Link to="/">ImgUp</Link>
        </h1>
        <Link to="/upload">
          <Button value="Upload Image" />
        </Link>
      </div>
      <div>
        <Pages />
      </div>
    </nav>
  );
};

export default Header;
