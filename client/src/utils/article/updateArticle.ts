import api from '@/utils/api';

const updateArticle = async (category: string, content: string) => {
    try {
        const response = await api.post("/article/update", {
            category: category,
            content: content
        });
        return response.data.data[0];
    } catch (error) {
        throw error;
    }
};

export default updateArticle;