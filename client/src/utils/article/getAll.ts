import api from '@/utils/api';

const getAll = async () => {
    try {
        const response = await api.get("/article/all");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export default getAll;