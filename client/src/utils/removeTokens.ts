import config from "@/server/config";
import api from "./api";

export const removeTokens = async () => {
    try {
        await api.delete(`${config.API}/api/logout`);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresAt');
    } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresAt');
    }
};