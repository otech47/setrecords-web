import api from './api';

export default {
    // returns a promise that resolves to the user session (artist ID)
    login(user, pass) {
        return new Promise((resolve, reject) => {
            api.post('setrecordsuser/login', {
                username: user,
                password: pass
            })
            .then((res) => {
                resolve(res.payload.setrecordsuser_login.artist_id);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },

    // returns a promise that resolves to nothing if logout is successful
    logout() {
        return api.get('setrecordsuser/logout');
    }
}
