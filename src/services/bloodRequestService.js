import axios from "axios";
import { API_ENDPOINT } from "../config/apiConfig";

export const createBloodRequest = async (data) => {
    try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });
        const res = await axios.post(
            API_ENDPOINT.BLOOD_REQUEST.CREATE,
            formData
        );
        return res.data;
    } catch (err) {
        console.error("❌ Error creating blood request:", err);
        throw err;
    }
};

export const getBloodGroups = async () => {
    try {
        const res = await axios.get(API_ENDPOINT.BLOOD_GROUP.ALL);
        return res.data;
    } catch (err) {
        console.error("❌ Error fetching blood groups:", err);
        throw err;
    }
};
