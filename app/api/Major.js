import APICaller from './APICaller';

const prefix = 'majors';

export default {
    list() {
        return APICaller(`${prefix}`, 'GET');
    }
};
