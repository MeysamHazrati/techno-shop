import App from "./App";
import Root from "./pages/root/Root";
import Home from "./pages/root/Home";
import Categories from "./pages/root/Categories";
import Category from "./pages/root/Category";
import Brands from "./pages/root/Brands";
import Brand from "./pages/root/Brand";
import Products from "./pages/root/Products";
import Offers from "./pages/root/Offers";
import Offer from "./pages/root/Offer";
import Error from "./pages/Error";
import NotFound from "./pages/NotFound";

export default [
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <Root />,
        children: [
          { index: true, element: <Home /> },
          { path: "categories", element: <Categories /> },
          { path: "categories/:title", element: <Category /> },
          { path: "brands", element: <Brands /> },
          { path: "brands/:name", element: <Brand /> },
          { path: "products", element: <Products /> },
          { path: "offers", element: <Offers /> },
          { path: "offers/:title", element: <Offer /> },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];