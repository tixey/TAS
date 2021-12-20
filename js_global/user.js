class User {
    UserName = null
    UserId = null
    Auth = false
    constructor() {
        
    }

    loadUser = () => {
        return $.post("php/user.php", 
                {}, 
                (data, status) => {
                    if(data.Auth){
                        this.UserName = data.UserName 
                        this.UserId = data.UserId
                        this.Auth = data.Auth
                        return Promise.resolve(true);
                    }
                    if(window.location.pathname.includes('login.php')) return;
                    Helper.notify({
                        message: "Your session has expired!",
                        position: {
                            my: "center bottom",
                            at: "center bottom"
                        }
                    }, "error", 2000)

                    let openMainPage = () => window.location.href = "login.php"
                    setTimeout(openMainPage, 2000)
                    return Promise.resolve(true);
                    

                },
                "json"
            );
    }

    logOut = () => {

        $.post("php/user.php?terminateSession", 
                {}, 
                (data, status) => {
                    console.log('session destroyed')
                });

        Helper.postJson('002', {pUserName: this.UserName })
        .then(data => {

            if(data.length != 1 || data[0].RESULT != 200){
                Helper.notify({
                    message: "Unable to log out! Something went wrong.",
                    position: {
                        my: "center bottom",
                        at: "center bottom"
                    }
                }, "error", 2000)
            }else{
                
                Helper.notify({
                    message: "Logout successful!",
                    position: {
                        my: "center bottom",
                        at: "center bottom"
                    }
                }, "success", 2000)


                let openMainPage = () => window.location.href = "login.php"
                setTimeout(openMainPage, 2000)
                
            }

        })
    }


}
User = new User();