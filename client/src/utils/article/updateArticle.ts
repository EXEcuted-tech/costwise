import api from '@/utils/api';

const updateArticle = async (category: string, content: string) => {
    try {
        const response = await api.post("/article/update", {
            category: category,
            content: content
        });
        console.log("This is the Category Data: ", response.data.data[0].content);
        return response.data.data[0].content;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export default updateArticle;