import * as Yup from 'yup';

export const EditProductValidation = Yup.object({
  name: Yup.string().trim().required("Product name is required"),
  type: Yup.string().required("Category is required"),
  ml: Yup.number().min(1).required("Size is required"),
  original_price: Yup.number().min(1).required("Price is required"),
  discount_percentage: Yup.number().min(0).max(100),
  stock: Yup.number().min(0).required("Stock is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed().notRequired()
});