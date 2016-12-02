import { app } from 'electron';
const storage = require('electron-json-storage');

let config = {}

let prepareStorage = () => {
    return new Promise((resolve, reject) => {
        return storage.get('config', function(error, data) {
            if (error) return reject(error)

            if (!data['tenant_id']) {
                data['tenant_id'] = '20044444-2504'
            }
            if (!data['pos_no']) {
                data['pos_no'] = 1
            }
            if (!data['tran_file_no'] || data['tran_file_no'] > 9999) {
                data['tran_file_no'] = 1
            }
            config = data
            storage.set('config', data, function(error) {
                if (error) return reject(error)
                else return resolve(data)
            })
        });
    })
}

let getConfig = () => {
    return config
}

let incrementFileNo = (current) => {
    return new Promise((resolve, reject) => {
        return storage.get('config', function(error, data) {
            if (error) return reject(error)

            if (data['tran_file_no'] >= 9999 || current === 9999) {
                data['tran_file_no'] = 1
            } else {
                data['tran_file_no'] = current + 1
            }
            config = data
            storage.set('config', data, function(error) {
                if (error) return reject(error)
                else return resolve(data)
            })
        });
    })
}

module.exports = {
    prepareStorage: prepareStorage,
    getConfig: getConfig,
    incrementFileNo: incrementFileNo
}