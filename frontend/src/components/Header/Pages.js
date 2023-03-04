import { NavLink } from "react-router-dom";
import classes from "./Pages.module.css";

const Pages = () => {
  const pagesArray = [
    { path: "/", name: "Home" },
    { path: "/upload", name: "Upload Image" },
    { path: "/privacy-policy", name: "Privacy Policy" },
  ];

  return (
    <ul>
      {pagesArray.map((page) => {
        return (
          <li className={classes.pages} key={page.path}>
            <NavLink
              className={({ isActive }) => {
                return isActive ? classes.active : "";
              }}
              to={page.path}
            >
              {page.name}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};
export default Pages;
