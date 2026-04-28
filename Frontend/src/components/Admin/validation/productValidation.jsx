import * as Yup from 'yup';

export const ProductValidation = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .required("Product name is required"),

  type: Yup.string()
    .required("Category is required"),

  ml: Yup.number()
    .typeError("Size must be a number")
    .min(1, "Must be greater than 0")
    .required("Size is required"),

  original_price: Yup.number()
    .typeError("Price must be a number")
    .min(1, "Price must be greater than 0")
    .required("Original price is required"),

  discount_percentage: Yup.number()
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%"),

  stock: Yup.number()
    .typeError("Stock must be a number")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),

  description: Yup.string()
    .min(5, "Description too short")
    .required("Description is required"),

  image: Yup.mixed()
    .required("Product image is required")
});