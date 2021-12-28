export function getStoreSettings (params = {}) {
    return {
        key: 'ID',
        loadMode: "raw",
        cacheRawData: true,
        //byKey: (key) => Helper.postJson('008', {pID: key}),
        load: () => Helper.postJson('009', {pID: -1})
    }
}