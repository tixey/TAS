class Config {
    hosts = {
        production: 'https://taon.info/TAS',
        development: 'https://taon.info/TAS',
        local: 'http://localhost',
    }

    environment = {
        production: false,
        development: false,
        local: false
    }
    baseUrl = null

    

    engineScripts = [
        'js_global/data.js',
        'js_global/components.js',
        'js_global/helpers.js',
        'js_global/user.js',
        './js/md5.js'
    ]
    version

    constructor() {
        this.setVersion()
        this.setEnvironment()
        this.setBaseUrl()
    }

    setVersion = () => this.version = 1//(new Date()).getTime()

    setEnvironment() {
        for (let host in this.hosts) {
            if (window.location.href.includes(this.hosts[host])) {
                this.environment[host] = true;
                break;
            }
        }
    }

    setBaseUrl() {
        this.baseUrl = window.location.origin;
    }

    loadEngineScripts = async () => {
        await this.load(this.engineScripts)
        await User.loadUser()
        return Promise.resolve(true)
    }


    load(scripts) {
        
        let promises = [];

        scripts.forEach(script => {
            promises.push(
                new Promise((resolve, reject) => $.ajax({
                    url: `${script}?version=${this.version}`,
                    dataType: 'script',
                    success: resolve,
                    error: reject
                }))
            )
        })

        return Promise.all(promises)
    }
}

Config = new Config();
