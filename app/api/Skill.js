import APICaller from './APICaller';

const prefix = 'skills';

export default {
    get(id) {
        return APICaller(`${prefix}/${id}`, 'GET');
    },
    list(page = 1) {
        return APICaller(`${prefix}/page/${page}`, 'GET');
    },
    search(query) {
        return APICaller(`${prefix}/search`, 'GET', { params: { query } });
    },
    post(file) {
        return APICaller(`${prefix}/page/${page}`, 'GET');
    },
    delete(id) {
        return APICaller(`${prefix}/${id}`, 'DELETE');
    }
};
