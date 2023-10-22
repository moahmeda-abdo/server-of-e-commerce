import express from "express";

import {
  handleAllProdcuts,
  handleAllProdcutsForAdmin,
  handleCategories,
  handleCreateProdcutsForAdmin,
  handleDeleteForAdmin,
  handleIdProdcuts,
  handleReviews,
  handleSlugProdcuts,
  handleUpdateProdcuts,
  handleUpdateProductForAdmin,
  handleSearchProdcuts,
  handleCategoryProdcuts,
} from "../controllers/productController.js";
import { isAdmin, isAuth, isViewer } from "../utils/isAuth.js";

const productRouter = express.Router();

productRouter.post("/create", isAuth, isAdmin, handleCreateProdcutsForAdmin);

productRouter.get("/category", handleCategoryProdcuts);

productRouter.get("/search", handleSearchProdcuts);

productRouter.get("/", handleAllProdcuts);

productRouter.put("/updateproduct", handleUpdateProdcuts);

productRouter.post("/:id/reviews", isAuth, handleReviews);

productRouter.delete("/:id", isAuth, isAdmin, handleDeleteForAdmin);

productRouter.get("/admin", isAuth, isViewer, handleAllProdcutsForAdmin);

productRouter.put("/:id", isAuth, isAdmin, handleUpdateProductForAdmin);

productRouter.get("/categories", handleCategories);

productRouter.get("/slug/:slug", handleSlugProdcuts);

productRouter.get("/:id", handleIdProdcuts);




export default productRouter;
