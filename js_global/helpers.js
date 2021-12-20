class DataHelper {
    API_PREFIX = 'php/processor.php?'
    urlParams
    notify

    constructor () {
        this.urlParams = new URLSearchParams(window.location.search)
        this.notify = DevExpress.ui.notify
    }


    makeUrl (named, ending = []) {
        let host = !Config.environment.local ? window.location.host : Config.hosts.development
        let url = `${window.location.protocol}//${host}${window.location.pathname}`
        let namedParams = ''
        let namedKeys = Object.keys(Object.assign(named))

        namedKeys.forEach((item, index) => {
            let key = item;

            if (index > 0) {
                key = `&${key}`
            }

            namedParams += `${key}=${named[item]}`
        })

        return `${this.API_PREFIX}${namedParams}&URL=${url}@@@&SPRPar=${ending.join(',')}`
    }

    async postJson (procedure, formParams = {}) {
        let data = new FormData()

        for (let field in formParams) {
            if(field === 'File_Name' && !!formParams.File_Name) {
                const file = formParams.File_Name

                if(file instanceof File) {
                    data.append('files[]', formParams[field] ?? -1)
                } else {
                    data.append('File_Name', formParams[field] ?? -1)
                }

            } else {
                data.append(field, formParams[field] ?? -1)
            }
        }
        
        return new Promise((resolve, reject) => $.ajax({
            url: `${Helper.API_PREFIX}SP=${procedure}`,
            data: data,
            type: 'post',
            processData: false,
            contentType: false,
            success: resolve,
            error (error) {
                if (error.responseText === "" && error.status === 200) {
                    resolve([])
                }
                return reject(error)
            }
        }))
    }

    async getJson (procedure, endParams = [], R = null) {
        return new Promise((resolve, reject) => $.ajax({
            url: Helper.makeUrl({ R: R ?? 'JSON', 'SPR': procedure }, endParams),
            type: 'get',
            success: resolve,
            error (error) {
                if (error.responseText === "" && error.status === 200) {
                    resolve([])
                }
                return reject(error)
            }
        }))
    }

    setUrlVar = (name, value) => {
        this.urlParams.set(name, value)
        this.setParamsAsPath()
    }

    getUrlVars = name => this.urlParams.get(name)

    removeUrlVars = names => {
        names.forEach(name => this.urlParams.delete(name))
        this.setParamsAsPath();
    }

    setParamsAsPath = () => window.history.pushState({}, null, `${window.location.pathname}?${Helper.urlParams.toString()}`)

    getComponentHeight = () => {
        let a = document.getElementById('Accordion')
        let tf = document.getElementById('topForm')
        return a.clientHeight + tf.clientHeight + 15
    }
}

Helper = new DataHelper()
