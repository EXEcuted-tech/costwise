import api from '@/utils/api';

const getArticle = async (category: string) => {
  try {
    const response = await api.post("/article/data", {
      category: category
    });
    return response.data.data[0].content;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default getArticle;