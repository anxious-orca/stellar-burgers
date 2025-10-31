import { TLoginData, TRegisterData } from "@api";
import { TUser } from "@utils-types";


export const mockUser: TUser = {
    email: "example@yandex.ru",
    name: "Боб"
};

export const newMockUser: TUser = {
    email: "example2@yandex.ru",
    name: "Бобби"
};

export const userRegisterData: TRegisterData = {
    email: "example@yandex.ru",
    name: "Боб",
    password: "123456"
};

export const userLoginData: TLoginData = {
    email: "example@yandex.ru",
    password: "123456"
};