export function getComponent (id, params = {}) {
    var tabs = [
        {     
            id: 1,
            text: "Dashboard", 
            icon: "home",
            url: "index.php"
        },
        {     
            id: 2,
            text: "Invoices", 
            icon: "export",
            url: "invoices.php"
        },
        { 
            id: 3,
            text: "Bills", 
            icon: "import",
            url: "bills.php"
        },
        { 
            id: 4,
            text: "Accounts", 
            icon: "detailslayout",
            url: "accounts.php"
        },
        { 
            id: 5,
            text: "Сounterparties", 
            icon: "card",
            url: "counterparties.php"
        },
        { 
            id: 6,
            text: "Log out", 
            icon: "close",
            url: "counterparties.php"
        }
    ];
    
    return $(`#${id}`).dxTabs({
            dataSource: tabs,
            selectedIndex: params.SelectedIndex,
            onItemClick: (e) => {
                if(e.itemData.id == 6){
                    User.logOut()
                    return
                }
                window.open(e.itemData.url, '_self')
            }
        }).dxTabs('instance')
    
}
