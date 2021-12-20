class MD_DataStores {
    //#STORES = {} 
    STORES = {}

     load (listOfStores, preloadData) {
        return new Promise((resolve, reject) => {
            listOfStores.forEach(function (component, i) {
                if (component.skipStore === undefined) {
                    if (typeof component === 'object') {
                        var { name, params } = component
                    } else {
                        name = component
                    }

                    import(`./js_global/datastores/${name}.js?version=${Config.version}`)
                        .then(settings => {
                           

                            const storeSettings = settings.getStoreSettings(params ?? {})

                            if (storeSettings) {
                              let store =  Stores.set(name, storeSettings)

                                if (preloadData) {
                                    store.load();
                                }
                            }

                            if ((i + 1) === listOfStores.length) {
                                return resolve(true);
                            }
                        })
                        .catch(error => {
                            console.log(`Unable to load settings from './datastores/${name}.js'`);
                            console.error(error);
                            return reject(error);
                        });

                } else {
                    if ((i + 1) === listOfStores.length) {
                        return resolve(true);
                    }
                }
            });
        });
    }

    set (name, settings) {
       let store = this.createStore(settings)
       if(settings.hasOwnProperty('getFile')) store.getFile = settings.getFile
       
       this.STORES[name]  = store

        return this.get(name)
    }

    get = (name)  => this.STORES[name]
    createStore = (settings) => new DevExpress.data.CustomStore(settings);
}

Stores = new MD_DataStores()
