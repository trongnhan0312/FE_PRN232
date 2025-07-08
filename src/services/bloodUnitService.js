import axios from "axios";
import { API_ENDPOINT } from "../config/apiConfig";

export const getBloodUnitsNoPaging = async () => {
    try {
        const res = await axios.get(
            `${API_ENDPOINT.BLOOD_UNIT.ALL.replace("/all", "/all/nopaging")}`
        );
        if (res.data?.isSuccessed) {
            return res.data.resultObj;
        }
        return [];
    } catch (err) {
        console.error("❌ Error fetching blood units (no paging):", err);
        return [];
    }
};
