export function getStoreSettings (params = {}) {
    return {
        key: 'ID',
        byKey: (key) => Helper.postJson('007', {pID: key}),
        load: () => Helper.postJson('007', {pID: -1})
    }
}