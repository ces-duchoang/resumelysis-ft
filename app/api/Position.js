import APICaller from './APICaller';
import axios from 'axios';
import { getToken } from './Session';
import FileDownload from 'js-file-download';

const prefix = 'positions';

export default {
    get(id) {
        return APICaller(`${prefix}/${id}`, 'GET');
    },
    getResumes(id) {
        return APICaller(`${prefix}/${id}/resumes`, 'GET');
    },
    list(page = 1) {
        return APICaller(`${prefix}/page/${page}`, 'GET');
    },
    search(query, page = 1) {
        return APICaller(`${prefix}/search/${query}/page/${page}`, 'GET');
    },
    create(data) {
        return APICaller(`${prefix}`, 'POST', data);
    },
    delete(id) {
        return APICaller(`${prefix}/${id}`, 'DELETE');
    },
    apply(id, file, note) {
        let formData = new FormData();
        formData.append('file', file);
        formData.append('note', note);
        return axios.post(
            `${API_BASE_DOMAIN}/api/${prefix}/apply/${id}`,
            formData,
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
    },
    update(id, data) {
        return APICaller(`${prefix}/${id}`, 'PUT', data);
    },
    removeResume(id, resumeId) {
        return APICaller(`${prefix}/${id}/resumes/${resumeId}`, 'DELETE');
    },
    ranking(id) {
        return APICaller(`${prefix}/ranking/${id}`, 'GET');
    },
    modifyRanking(id, data) {
        return APICaller(`${prefix}/${id}/ranked`, 'PUT', {
            isModify: true,
            resume: { ...data }
        });
    },
    addListResumes(id, resumes) {
        return APICaller(`${prefix}/${id}/resumes`, 'POST', { resumes });
    },
    exportExcel(id, n = 0) {
        return APICaller(`${prefix}/${id}/export/${n}`, 'GET');
    },
    clearRank(id) {
        return APICaller(`${prefix}/${id}/ranked`, 'PUT', {
            ranked: []
        });
    }
};
