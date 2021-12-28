export function getComponent (id, params = {}) {

    let c = $("<div>").attr("id", id)
    c.appendTo(document.getElementById('mainArea'))
    
    
    return $(`#${id}`).dxDataGrid({
        hoverStateEnabled: true,
        //keyExpr: 'Country_Code',
        rowAlternationEnabled: true,
        dataSource: Stores.STORES.counterPartiesGrid,
        sorting: {
            mode: "multiple"
        },
        headerFilter: {
            visible: true
        },
        filterRow: {
            visible: true
        }, 
        searchPanel: {
            visible: true
        },
        allowColumnResizing: true,
        showBorders: true,
        export: {
            enabled: true,
            allowExportSelectedData: true,
            fileName: 'TaonInvoices.xlsx'
        },
        editing: {
            mode: 'popup',
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true,
            useIcons: true,
            popup: {
              title: 'Counterparty Info',
              showTitle: true,
              /*width: 700,
              height: 525,*/
            },
            form:{
                colCount: 4,
                items: [ 
                        
                        {
                            dataField:"NAME", 
                            colSpan: 2,
                            validationRules: [{
                                type: 'required',
                                message: 'NAME is required',
                            }]
                        },
                        {
                            dataField:"ROLE_ID",
                            colSpan:1,
                            validationRules: [{
                                type: 'required',
                                message: 'Counterparty type is required',
                              }],
                        },
                        {
                            dataField:"ID", 
                            colSpan: 1,
                            editorType: 'dxTextBox',
                            editorOptions: {
                                readOnly: true
                            }
                        }, 
                        {   
                            dataField: "CONTACT_PERSON", 
                            colSpan: 2,
                        },
                        {   
                            dataField: "PHONE", 
                            colSpan: 2,
                        },
                        {   
                            dataField: "EMAIL", 
                            colSpan: 2,
                            validationRules: [{
                                type: 'email',
                                message: 'Email is invalid',
                              }]
                        },
                        {   
                            dataField: "URL", 
                            colSpan: 2,
                        },
                        {   
                            dataField: "ADDRESS",
                            editorType: 'dxTextArea',
                            colSpan: 4,
                            editorOptions: {
                                height: 100,
                            },
                        },
                        {   
                            dataField: "COMMENT",
                            editorType: 'dxTextArea',
                            colSpan: 4,
                            editorOptions: {
                                height: 250,
                            },
                        }
                ]
                
            }
        },
        columns: [
            {
                dataField: "ID",
                caption: "ID",
                visible: true,
                width: 50
            },
            {
                dataField: "NAME",
                caption: "NAME"
            },
            {
                dataField: "ROLE_ID",
                caption: 'Type',
                lookup: {
                    dataSource: Stores.STORES.counterPartiesTypes,
                    valueExpr: "ID",
                    displayExpr: "NAME"
                },
            },
            {
                dataField: "CONTACT_PERSON",
                caption: "CONTACT PERSON"
            },
            {
                dataField: "PHONE",
                caption: "PHONE"
            },
            {
                dataField: "EMAIL",
                caption: "EMAIL"
            },
            {
                dataField: "URL",
                caption: "URL"
            },
            {
                dataField: "ADDRESS",
                caption: "ADDRESS"
            },
            {
                dataField: "COMMENT",
                caption: "COMMENT"
            },
        ]
        
    }).dxDataGrid('instance');
}