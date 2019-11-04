import APICaller from './APICaller';

const prefix = 'resumes';

export default {
    get(id) {
        return APICaller(`${prefix}/${id}`, 'GET');
    },
    list(page = 1) {
        return APICaller(`${prefix}/page/${page}`, 'GET');
    },
    search(query, page = 1) {
        return APICaller(`${prefix}/search/${query}/page/${page}`, 'GET');
    },
    post(file) {
        return APICaller(`${prefix}/page/${page}`, 'GET');
    },
    delete(id) {
        return APICaller(`${prefix}/${id}`, 'DELETE');
    },
    reread(id) {
        return APICaller(`${prefix}/${id}`, 'POST');
    },
    update(id, data) {
        return APICaller(`${prefix}/${id}`, 'PUT', { ...data, isUpdate: true });
    }
};
