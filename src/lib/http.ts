import axios from "axios";

const BASE_URL = "https://api.moysklad.ru/api";
const AUTH = "Basic YWRtaW5AY2hhaW5tZXRhbGw6VGFzaGtlbnQ3Nw==";

export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: AUTH,
    "Content-Type": "application/json",
  },
});
