import * as yup from "yup";

const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const signupFormScheme = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Обязательное поле")
    .min(9, "Минимум 9 символов")
    .matches(regexEmail, "Введите корректный email"),
  password: yup
    .string()
    .required("Обязательное поле")
    .min(8, "Минимум 8 символов")
    .max(128, "Максимум 128 символов")
    .matches(/[A-Z]/, "Нужна заглавная буква (A-Z)")
    .matches(/[a-z]/, "Нужна строчная буква (a-z)")
    .matches(/[0-9]/, "Нужна цифра (0-9)")
    .matches(/[^a-zA-Z0-9]/, "Нужен спецсимвол (!@#$%^&*)"),
  repeatPassword: yup
    .string()
    .trim()
    .required("Обязательное поле")
    .oneOf([yup.ref("password")], "Пароли не совпадают"),
});
