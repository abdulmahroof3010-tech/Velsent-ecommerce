import * as Yup from 'yup'

export const RegisterValidation= Yup.object({
    name:Yup.string().min(4,"Name must be at least 4 character")
    .required("Please Enter name") ,

    email:Yup.string().email("Please Enter Valid email")
    .required("Please Enter Email "),

    password:Yup.string().min(6,"Password must be at least 6 ").required("Please Enter  password"),

    cpassword:Yup.string().oneOf([Yup.ref("password")],"Password not matched")
    .required("Please Enter  Confirm Password ")
})