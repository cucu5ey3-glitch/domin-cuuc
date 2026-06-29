import api from "./api";

export const domainService = {
    search: async (domain: string) => {
        const res = await api.get(`/domains/search?name=${domain}`);
        return res.data;
    },

    getExtensions: async () => {
        const res = await api.get("/extensions");
        return res.data;
    },
};