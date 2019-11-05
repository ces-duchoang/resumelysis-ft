import APICaller from './APICaller';

const prefix = 'schools';

export default {
    list() {
        return APICaller(`${prefix}`, 'GET');
    }
};
