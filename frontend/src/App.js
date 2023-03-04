import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/Root";
import HomePage, { loader as homeLoader } from "./pages/Home";
import UploadPage from "./pages/Upload";
import PrivacyPage from "./pages/Privacy";
import ImagePage, { loader as imageLoader } from "./pages/Image";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage />, loader: homeLoader },
      { path: "/image/:imageId", element: <ImagePage />, loader: imageLoader },
      { path: "/upload", element: <UploadPage /> },
      { path: "/privacy-policy", element: <PrivacyPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
