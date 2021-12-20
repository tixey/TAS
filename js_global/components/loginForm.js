export function getComponent (id, params = {}) {
    var formData = {
        "Username": User.UserName
    }
    var items = [{
        itemType: "group",
        caption: User.Auth? "Log out":"Log in",
        items: [{
            dataField: "Username",
            visible: !User.Auth,
            validationRules: [{
                type: "required",
                message: "Username is required"
            }, {
                type: "pattern",
                pattern: "^[a-zA-Z0-9_\.]+$",
                message: "Prohibited characters in username"
            }]
        }, {
            dataField: "Password",
            visible: !User.Auth,
            editorOptions: {
                mode: "password"
            },
            validationRules: [{
                type: "required",
                pattern: "^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{6,}$",
                message: "Password should have at least 6 characters, include upper and lower case letters, digits and special characters."
            }]
            }
        ]
    }, 
    {
        itemType: "button",
        visible: !User.Auth,
        horizontalAlignment: "center",
        buttonOptions: {
            text: "Log in",
            type: "success",
            useSubmitBehavior: false,
            onClick: function(data) { 

                Helper.postJson('001', {pUserName: formData.Username, pHash: MD5(formData.Password) })
                .then(data => {

                    if(data.length != 1 || data[0].RESULT != 200){
                        Helper.notify({
                            message: "Unable to log in! Incorrect login or password.",
                            position: {
                                my: "center bottom",
                                at: "center bottom"
                            }
                        }, "error", 10000)
                    }else{
                        
                        Helper.notify({
                            message: "Login successful!",
                            position: {
                                my: "center bottom",
                                at: "center bottom"
                            }
                        }, "success", 1000)

                        let openMainPage = () => window.location.href = "index.php"
                        setTimeout(openMainPage, 500)
                        
                    }

                })
                


            }
        }
    },
    {
        dataField: "Username",
        visible: User.Auth,
        editorOptions: {
            readOnly: true
        }

    },
    {
        itemType: "button",
        visible: User.Auth,
        horizontalAlignment: "center",
        buttonOptions: {
            text: "Log out",
            type: "success",
            useSubmitBehavior: false,
            onClick: (data) =>{
                 User.logOut()
            }
        }
    }]

    return $(`#${id}`).dxForm({
        formData: formData,
        readOnly: false,
        showColonAfterLabel: true,
        showValidationSummary: true,
        validationGroup: "loginData",
        items
    }).dxForm("instance");
     

}

