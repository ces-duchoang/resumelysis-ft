import APICaller from './APICaller';

const prefix = 'degrees';

export default {
    list() {
        return APICaller(`${prefix}`, 'GET');
    }
};
