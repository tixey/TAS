export function getStoreSettings (params = {}) {
    return {
        key: 'ID',
        byKey: (key) => Helper.postJson('003', {pID: key}),
        load: () => Helper.postJson('003', {pID: -1}),
        insert: (values) => {
            let d = {
                pNAME: (values.NAME == undefined)?'':values.NAME,
                pCONTACT_PERSON: (values.CONTACT_PERSON  == undefined)?'':values.CONTACT_PERSON,
                pPHONE: (values.PHONE  == undefined)?'':values.PHONE,
                pEMAIL: (values.EMAIL  == undefined)?'':values.EMAIL,
                pCOMMENT: (values.COMMENT  == undefined)?'':values.COMMENT,
                pCPURL: (values.CPURL  == undefined)?'':values.CPURL,
                pADDRESS: (values.ADDRESS  == undefined)?'':values.ADDRESS,
                pROLE_ID: (values.ROLE_ID  == undefined)?'':values.ROLE_ID
            }
            return Helper.postJson('004', d).then(data => {

                if(data.length != 1 || data[0].RESULT != 200){
                    Helper.notify({
                        message: "Unable to add counterparty!",
                        position: {
                            my: "center bottom",
                            at: "center bottom"
                        }
                    }, "error", 3000)
                    return Promise.reject(new Error("Unable to add invoice!"))
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
        },
        update: (key, values) => {
         
            let d = {
                pID: key,
                pNAME: (values.NAME == undefined)?null:values.NAME,
                pCONTACT_PERSON: (values.CONTACT_PERSON  == undefined)?null:values.CONTACT_PERSON,
                pPHONE: (values.PHONE  == undefined)?null:values.PHONE,
                pEMAIL: (values.EMAIL  == undefined)?null:values.EMAIL,
                pCOMMENT: (values.COMMENT  == undefined)?null:values.COMMENT,
                pCPURL: (values.URL  == undefined)?null:values.URL,
                pADDRESS: (values.ADDRESS  == undefined)?null:values.ADDRESS,
                pROLE_ID: (values.ROLE_ID  == undefined)?null:values.ROLE_ID
            }
            return Helper.postJson('006', d).then(data => {

                if(data.length != 1 || data[0].RESULT != 200){
                    Helper.notify({
                        message: "Unable to update counterparty!",
                        position: {
                            my: "center bottom",
                            at: "center bottom"
                        }
                    }, "error", 3000)
                    return Promise.reject(new Error("Unable to add invoice!"))
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
        },
        remove: (key) => {
            console.log
            return Helper.postJson('005', {pID: key}).then(data => {

                if(data.length != 1 || data[0].RESULT != 200){
                    Helper.notify({
                        message: "Unable to delete counterparty!",
                        position: {
                            my: "center bottom",
                            at: "center bottom"
                        }
                    }, "error", 3000)
                    return Promise.reject(new Error("Unable to add invoice!"))
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