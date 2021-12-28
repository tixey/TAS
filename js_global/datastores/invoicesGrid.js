export function getStoreSettings (params = {}) {
    return {
        key: 'ID',
        byKey: (key) => Helper.postJson('008', {pID: key}),
        load: () => Helper.postJson('008', {pID: -1}),
        insert: (values) => {
            let d = {
                pCUSTOMER_ID: (values.CUSTOMER_ID == undefined)?'':values.CUSTOMER_ID,
                pNUMBER: (values.NUMBER == undefined)?'':values.NUMBER,
                pDT: (values.DT == undefined)?'':values.DT,
                pAMOUNT: (values.AMOUNT == undefined)?'':values.AMOUNT,
                pCURRENCY_ID: (values.CURRENCY_ID == undefined)?'':values.CURRENCY_ID,
                pSERVICE_PERIOD_FROM: (values.SERVICE_PERIOD_FROM == undefined)?'':values.SERVICE_PERIOD_FROM,
                pSERVICE_PERIOD_TO: (values.SERVICE_PERIOD_TO == undefined)?'':values.SERVICE_PERIOD_TO,
                pSERVICE_DETAILS: (values.SERVICE_DETAILS == undefined)?'':values.SERVICE_DETAILS,
                pCOMMENT: (values.COMMENT == undefined)?'':values.COMMENT

            }
            return Helper.postJson('010', d).then(data => {

                if(data.length != 1 || data[0].RESULT != 200){
                    Helper.notify({
                        message: "Unable to add invoice!",
                        position: {
                            my: "center bottom",
                            at: "center bottom"
                        }
                    }, "error", 3000)
                    return Promise.reject(new Error("Unable to add invoice!"))
                }
                if(Helper.FilesInDropZone.length == 0){
                    Helper.notify({
                        message: data[0].MESSAGE,
                        position: {
                            my: "center bottom",
                            at: "center bottom"
                        }
                    }, "success", 3000)
                    return Promise.resolve(true)
                }
                return Helper.uploadFiles(data[0].ID, 1).then(result => {
                    if(result[0].RESULT){
                        Helper.notify({
                            message: 'Invoice updated.' + result[0].MESSAGE,
                            position: {
                                my: "center bottom",
                                at: "center bottom"
                            }
                        }, "success", 3000)
                        return Promise.resolve(true)
                    }
                    
                    Helper.notify({
                        message: "Unable to upload files!",
                        position: {
                            my: "center bottom",
                            at: "center bottom"
                        }
                    }, "error", 3000)
                    return Promise.reject(new Error("Unable to upload files!"))

                })

            })
        },
        update: (key, values) => {
         console.log(key, values)
            let d = {
                pID: key,
                pCUSTOMER_ID: (values.CUSTOMER_ID == undefined)?'':values.CUSTOMER_ID,
                pNUMBER: (values.NUMBER == undefined)?'':values.NUMBER,
                pDT: (values.DT == undefined)?'':values.DT,
                pAMOUNT: (values.AMOUNT == undefined)?'':values.AMOUNT,
                pCURRENCY_ID: (values.CURRENCY_ID == undefined)?'':values.CURRENCY_ID,
                pSERVICE_PERIOD_FROM: (values.SERVICE_PERIOD_FROM == undefined)?'':values.SERVICE_PERIOD_FROM,
                pSERVICE_PERIOD_TO: (values.SERVICE_PERIOD_TO == undefined)?'':values.SERVICE_PERIOD_TO,
                pSERVICE_DETAILS: (values.SERVICE_DETAILS == undefined)?'':values.SERVICE_DETAILS,
                pCOMMENT: (values.COMMENT == undefined)?'':values.COMMENT
            }
            return Helper.postJson('011', d).then(data => {

                if(data.length != 1 || data[0].RESULT != 200){
                    Helper.notify({
                        message: "Unable to update invoice!",
                        position: {
                            my: "center bottom",
                            at: "center bottom"
                        }
                    }, "error", 3000)
                    return Promise.reject(new Error("Unable to add invoice!"))
                }
                if(Helper.FilesInDropZone.length == 0){
                    Helper.notify({
                        message: data[0].MESSAGE,
                        position: {
                            my: "center bottom",
                            at: "center bottom"
                        }
                    }, "success", 3000)
                    return Promise.resolve(true)
                }

                return Helper.uploadFiles(key, 1).then(result => {
                    if(result[0].RESULT){
                        Helper.notify({
                            message: 'Invoice updated.' + result[0].MESSAGE,
                            position: {
                                my: "center bottom",
                                at: "center bottom"
                            }
                        }, "success", 3000)
                        return Promise.resolve(true)
                    }
                    
                    Helper.notify({
                        message: "Unable to upload files!",
                        position: {
                            my: "center bottom",
                            at: "center bottom"
                        }
                    }, "error", 3000)
                    return Promise.reject(new Error("Unable to upload files!"))

                })
                

            })
        },
        remove: (key) => {
            console.log
            return Helper.postJson('012', {pID: key}).then(data => {

                if(data.length != 1 || data[0].RESULT != 200){
                    Helper.notify({
                        message: "Unable to delete invoice!",
                        position: {
                            my: "center bottom",
                            at: "center bottom"
                        }
                    }, "error", 3000)
                    return Promise.reject(new Error("Unable to delete invoice!"))
                }

                Helper.notify({
                    message: data[0].MESSAGE,
                    position: {
                        my: "center bottom",
                        at: "center bottom"
                    }
                }, "success", 3000)
                return Promise.resolve(true)

            })
        }
    }
}