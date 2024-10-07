import axios from "axios";
import { apiConfig } from "../../../../config/apiConfig";

export const shopifyApi = axios.create({
  baseURL: apiConfig.shopify.baseUrl,
  headers: apiConfig.shopify.headers,
});
