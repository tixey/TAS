class MD_Components {
    COMPONENTS = {}

    load (listOfComponents) {
        return new Promise((resolve, reject) => {
            listOfComponents.forEach(function (component, i) {
                if (typeof component === 'object') {
                    var { name, params } = component
                } else {
                    name = component
                }

                params = params ?? {}

                import(`./js_global/components/${name}.js?version=${Config.version}`)
                    .then(component => {
                        const id = Components.appendComponentContainer(name, params)
                        let data = Components.mountComponent(component, name, id, params)

                        if ((i + 1) === listOfComponents.length) {
                            return resolve(data)
                        }
                    })
                    .catch(error => {
                        console.log(`Unable to load component from './components/${name}.js'`);
                        console.error(error);
                        return reject(error)
                    });

            });
        })
    }

    appendComponentContainer (name, params) {
        let styles = ''

        if (params.class) {
            styles = `class="${params.class}"`
        }

        /*if (params.children) {
            name = Components.generateId(name, params)
        }*/

        if (name === 'Button') {
            if (params.text) {
                name = `${name}${params.text.replace(/[. ]+/g, '')}`
            }
        }

        if (!params.isChild && (params.mount ?? true)) {
            if (params.title)
                $('body').append(`<h2 class="heading">${params.title}</h2>`)

            if (!document.getElementById(name)) {
                $(`<div id="${name}" ${styles}>`).appendTo($(document.body))
            }
        }

        return name
    }

    generateId (name, params) {
        let id = name

        if (params?.children) {
            id = `${id}_${params.children.map(item => (  item.name ?? item.title ?? item).replace(/[. ]+/g, '')).join('_')}`
        }

        return id
    }

    mountComponent = (component, name, id, params) => this.set(id, component.getComponent(id, params))

    appendAndLoadChildComponent (appenderFn, component, afterLoadCallback = null) {
        appenderFn()

        Stores.load([component], true)
            .then(() => {
                if (component.params) {
                    component.params.isChild = true
                } else {
                    component.params = {
                        isChild: true
                    }
                }

                Components.load([component])
            })

        if (typeof afterLoadCallback === 'function') afterLoadCallback()
    }

    get = id => this.COMPONENTS[id]
         
    
    set (id, component) {

        this.COMPONENTS[id] = component
        return component
    }
}

Components = new MD_Components()