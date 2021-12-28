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


    //Upload of files through drop zone -->
    dropHandler = ev => {
        console.log('File(s) dropped');
      
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
      
        if (ev.dataTransfer.items) {
          // Use DataTransferItemList interface to access the file(s)
          for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
              var file = ev.dataTransfer.items[i].getAsFile()
              console.log('... file[' + i + '].name = ' + file.name)
              this.appendFileToDropZone(file);
            }
          }
        } else {
          // Use DataTransfer interface to access the file(s)
          for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name)
            this.appendFileToDropZone( ev.dataTransfer.files[i] )
          }
        }
    }

    appendFileToDropZone(file){
        let fileId = this.FilesInDropZone.length
        let dz = document.getElementById('dropZone')
        if(this.FilesInDropZone.length==0) dz.innerText='';
        this.FilesInDropZone.push({Id: fileId, File4Upload: file})
        let fileLine = document.createElement("div")
        fileLine.setAttribute("class","fileTag")
        fileLine.setAttribute("id",`dropFileTag${fileId}`)
        fileLine.innerHTML = file.name + ' (' + (Math.round(file.size/1000 * 100) / 100) + ' Kb)'
        
        let delFile = document.createElement("a")
        delFile.setAttribute("href","#")
        delFile.setAttribute("class","closeFileTag")
        delFile.setAttribute("onclick",`Helper.removeFileFromDropZone(${fileId})`)
        delFile.innerHTML ="X"

        fileLine.appendChild(delFile)
        dz.appendChild(fileLine)
        this.DropZoneComponent.setValue(this.FilesInDropZone.length)
    }
    dragOverHandler = ev => {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault()
    }
    removeFileFromDropZone = id => {
        this.FilesInDropZone = this.FilesInDropZone.filter(f => f.Id != id)
        let elem = document.getElementById(`dropFileTag${id}`)
        elem.parentNode.removeChild(elem)
        if(this.FilesInDropZone.length==0) document.getElementById('dropZone').innerText='Drop file to attach';
    }
    removeAllFilesFromDropZone = () => {
        this.FilesInDropZone.forEach(fl => {
            let elem = document.getElementById(`dropFileTag${fl.Id}`);
            elem.parentNode.removeChild(elem);
        })
        this.FilesInDropZone = []
    }
    uploadFiles = (identifier, docType) => {
        const uploadPromises = []
        let filesUploaded = true
        let result = ''
        this.FilesInDropZone.forEach(file => {
            uploadPromises.push( 
                Helper.postJson('U01',{'pIDENTIFIER': identifier, 'pDOCUMENT_TYPE': docType, 'file': file.File4Upload}).then(value =>{
                    if (value[0].RESULT !== 200) {
                        Helper.notify('Error: ' + value[0].MESSAGE, 'error', 2000)
                        filesUploaded = false
                        return Promise.reject(new Error("Unable to upload file!"))
                    }
                    result += `File ${file.File4Upload.name} uploaded with ID: ${value[0].ID}; `
                    return Promise.resolve(true)
                })
            );
        })

        return Promise.all(uploadPromises).then((values) => {
            if(!filesUploaded) return Promise.reject(new Error("Unable to upload file!"));
            return Promise.resolve([{'RESULT': true, 'MESSAGE': result}])
        })

    }
    FilesInDropZone = []
    DropZoneComponent = null
    deleteFile = (id) =>{
        Helper.postJson('014', {'pID': id})
            .then(data =>{
                if(data.length != 1 || data[0].RESULT != 200){
                    Helper.notify({
                        message: "Unable to delete file!",
                        position: {
                            my: "center bottom",
                            at: "center bottom"
                        }
                    }, "error", 3000)
                    return Promise.reject(new Error("Unable delete file!"))
                }
            
                Helper.notify({
                    message: data[0].MESSAGE,
                    position: {
                        my: "center bottom",
                        at: "center bottom"
                    }
                }, "success", 3000)
                document.getElementById(`existinhFileTag${id}`).outerHTML = "";
                return Promise.resolve(true)
                
            })
    }
    //Upload of files through drop zone <--

}

Helper = new DataHelper()
