export async function getComponent (id, params = {}) {

    let c = $("<div>").attr("id", id)
    c.appendTo(document.getElementById('mainArea'))
    
    await Stores.STORES.counterPartiesGrid.load().done(data => {
            window.counterPartiesGrid = data.filter(r => r.ROLE_ID == 1).map(  e => { return {ID: e.ID, NAME: e.NAME} })
        })




    let grid = $(`#${id}`).dxDataGrid({
        hoverStateEnabled: true,
        //keyExpr: 'Country_Code',
        rowAlternationEnabled: true,
        dataSource: Stores.STORES.invoicesGrid,
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
        export: {
            enabled: true,
            allowExportSelectedData: true,
            fileName: 'TaonInvoices.xlsx'
        },
        allowColumnResizing: true,
        showBorders: true,
        editing: {
            mode: 'popup',
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true,
            useIcons: true,
            popup: {
              title: 'Invoice Details',
              showTitle: true,
              /*width: 700,
              height: 525,*/
            },
            form:{
                colCount: 4,
                items: [ 
                    {
                        dataField:"CUSTOMER_ID", 
                        colSpan: 3,
                        validationRules: [{
                            type: 'required',
                            message: 'Customer must be indicated',
                        }]
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
                        dataField:"NUMBER", 
                        colSpan: 1,
                        validationRules: [{
                            type: 'required',
                            message: 'Cannot be blank',
                        }]
                    },
                    {
                        dataField:"DT", 
                        colSpan: 1,
                        validationRules: [{
                            type: 'required',
                            message: 'Cannot be blank',
                        }]
                    },
                    {
                        dataField:"AMOUNT", 
                        colSpan: 1,
                        validationRules: [{
                            type: 'required',
                            message: 'Cannot be blank',
                        }]
                    },
                    {
                        dataField:"CURRENCY_ID", 
                        colSpan: 1,
                        validationRules: [{
                            type: 'required',
                            message: 'Cannot be blank',
                        }]
                    },
                    {
                        dataField:"SERVICE_PERIOD_FROM", 
                        colSpan: 1, 
                    },
                    {
                        dataField:"SERVICE_PERIOD_TO", 
                        colSpan: 1, 
                    },
                    {
                        dataField: "SERVICE_DETAILS",
                        colSpan: 2, 
                    },
                    {
                        label: {
                            text: 'Files'
                        },
                        
                        template: (editor, itemElement) => { 
                            //doc type = 1 - invoices
                            if(Components.COMPONENTS.invoicesGrid.CurrentId == null) return;
                            Helper.postJson('013', {'pID': Components.COMPONENTS.invoicesGrid.CurrentId, 'pDOC_TYPE_ID':1})
                                .then(result =>{
                                    let eFiles = document.getElementById('existingFiles')
                                    result.forEach(file => {
                                        let fileLine = document.createElement("div")
                                        fileLine.setAttribute("class","existinhFileTag")
                                        fileLine.setAttribute("id",`existinhFileTag${file.ID}`)
                                        fileLine.innerHTML = '<a href="php/processor.php?SP=D01&ID='+file.ID+'" target="_blank">'+file.FILE_NAME + '</a> (' + (Math.round(file.SIZE/1000 * 100) / 100) + ' Kb; Added by ' + file.CREATED_BY + ' on ' + file.CREATED.substr(0,16) + ')'
                                        
                                        let delFile = document.createElement("a")
                                        delFile.setAttribute("href","#")
                                        delFile.setAttribute("class","closeFileTag")
                                        delFile.setAttribute("onclick",`Helper.deleteFile(${file.ID})`)
                                        delFile.innerHTML ="X"

                                        fileLine.appendChild(delFile)
                                        eFiles.appendChild(fileLine)
                                    });
                                })
                            
                                $("<div>", {
                                    id: 'existingFiles'
                            }).appendTo(itemElement)
                        },
                        
                        colSpan: 4 
                    },
                    {
                        name: "FILES",
                        dataField: "FILES",
                        label: {
                            text: 'Upload Files'
                        } ,
                        colSpan: 4 
                    },
                    {
                        dataField: "COMMENT",
                        editorType: 'dxTextArea',
                        colSpan: 4,
                        editorOptions: {
                            height: 250,
                        },

                    },
                ]
            }
             
        },
        onInitNewRow: e => {
            Components.COMPONENTS.invoicesGrid.CurrentId = null
            e.data.CUSTOMER_ID = 1
            e.data.CURRENCY_ID = 1
            let dt = new Date()
            e.data.DT = dt.toISOString().substr(0, 10)
           
            
            let firstDay = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), 1))
            let lastDay = new Date(Date.UTC(dt.getFullYear(), dt.getMonth()+1, 0))
            
            e.data.SERVICE_PERIOD_FROM = firstDay.toISOString().substr(0, 10)
            e.data.SERVICE_PERIOD_TO = lastDay.toISOString().substr(0, 10)
        },
        onEditingStart: e => {
            console.log(e)
            Components.COMPONENTS.invoicesGrid.CurrentId = e.data.ID
            Helper.FilesInDropZone = []
        },
        columns: [
            {
                dataField: "ID",
                caption: "ID",
                visible: true,
                width: 50
            },
            {
                dataField: "CUSTOMER_ID",
                caption: "Issued to",
                lookup: {
                    dataSource: window.counterPartiesGrid,
                    valueExpr: "ID",
                    displayExpr: "NAME"
                },
            },
            {
                dataField: "NUMBER",
                caption: 'Inv. Number',
                width: 120
            },
            {
                dataField: "DT",
                caption: "Inv. Date",
                dataType: 'date',  
                format: 'yyyy.MM.dd',
                width: 100
            },
            {
                dataField: "SERVICE_PERIOD_FROM",
                caption: "Srv. Period From",
                dataType: 'date',  
                format: 'yyyy.MM.dd',
                width: 150
            },
            {
                dataField: "SERVICE_PERIOD_TO",
                caption: "Srv. Period To",
                dataType: 'date',  
                format: 'yyyy.MM.dd',
                width: 150
            },
            {
                dataField: "SERVICE_DETAILS",
                caption: "Service Details"
            },
            {
                dataField: "COMMENT",
                visible: false
            },
            {
                dataField: "AMOUNT",
                caption: "Amount",
                dataType: "number",
                format: '##0.00',
            },
            {
                dataField: "CURRENCY_ID",
                lookup: {
                    dataSource: Stores.STORES.currencies,
                    valueExpr: 'ID',
                    displayExpr: 'ISO3'
                },
                caption: "Currency",
                width: 100
            },
            {
                dataField: "FILES",
                visible: false,
                editCellTemplate: (cellElement, cellInfo)=>{
                    Helper.FilesInDropZone = []
                    Helper.DropZoneComponent = cellInfo
                    return  $("<div>", {
                            id: 'dropZone', 
                            html: 'Drop file to upload<br>',
                            ondrop: 'Helper.dropHandler(event)', 
                            ondragover: 'Helper.dragOverHandler(event)'
                    })
                }
            }
        ],
        summary: {
            totalItems: [{
              column: 'NUMBER',
              summaryType: 'count',
            },  {
              column: 'AMOUNT',
              summaryType: 'sum',
              displayFormat: 'Sum: {0}',
              valueFormat: { style: "currency", currency: "EUR", useGrouping: true },
            }],
          },

    }).dxDataGrid('instance')

    Components.COMPONENTS[id] = grid

    return grid
}