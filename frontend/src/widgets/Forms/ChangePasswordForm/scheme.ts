import * as yup from "yup";

export const changePasswordFormScheme = yup.object().shape({
  currentPassword: yup.string().trim().required("Обязательное поле"),
  newPassword: yup
    .string()
    .trim()
    .required("Обязательное поле")
    .min(8, "Минимум 8 символов")
    .max(64, "Максимум 64 символа")
    .matches(/[A-Z]/, "Нужна хотя бы одна заглавная буква")
    .matches(/[a-z]/, "Нужна хотя бы одна строчная буква")
    .matches(/\d/, "Нужна хотя бы одна цифра"),
  repeatPassword: yup
    .string()
    .trim()
    .required("Обязательное поле")
    .oneOf([yup.ref("newPassword")], "Пароли не совпадают"),
});
