import { FetchClient } from "./fetchClient";

const baseUrl = "http://localhost:8000";

const apiClient = new FetchClient(baseUrl || "");

export default apiClient;
