import * as Yup from "yup";

export const phoneValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Phone number is required")
    .matches(
      /^\+[0-9]+$/,
      "Phone number must be only digits, and should start with +",
    )
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
});

export const checkPhoneIsValid = async (phone: string) => {
  try {
    await phoneValidationSchema.validate({ phone });
    return {
      status: true,
      message: "",
    };
  } catch (error: any) {
    return {
      status: false,
      message: error.message,
    };
  }
};
