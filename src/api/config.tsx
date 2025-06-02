import { Buffer } from "buffer";
import { Platform } from "react-native";
import { URLS } from "./Urls";

export const getBasicAuthHeaders = () => {
  const basicAuth = `Basic ${Buffer.from(`${"dorian"}:${"admin123/*"}`).toString("base64")}`;

  return {
    Authorization: basicAuth,
    "Device-Type": Platform.OS,
    "Installed-App": "2",
  };
}

export const getAuthHeader = (token:string) => {
  return {
    Authorization: `Bearer ${token}`,
    "Device-Type": Platform.OS,
    "Installed-App": "2",
  };
}

export const getApiUrl= (endpoint:any) => {
    let url = URLS.BASE_URL + endpoint;
    return url;
  };