import axios from 'axios';
import getConfig from 'next/config';
import { FETCH, SAVE_DATA } from './FetchData.actions';
import getAuth from '../../utils/auth';


export default store => next => (action) => {
    const { type } = action;
    const state = store.getState();
    switch (type) {
        case FETCH.type: {
            const { retrievedAt } = state.table;
            if (retrievedAt !== null) {
                return next(action);
            }
            const { publicRuntimeConfig } = getConfig();
            const { getAccessToken } = getAuth();
            const API_URL = publicRuntimeConfig.API_URL;
            const headers = { 'Authorization': `Bearer ${getAccessToken()}` }
            axios.get(`${API_URL}/private`, { headers })
                .then((response) => {
                    store.dispatch(SAVE_DATA.action(response.data));
                })
                .catch((error) => {
                });
            break;
        }
        default: {
            return next(action);
        }
    }
};
