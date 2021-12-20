export function getComponent (id, params = {}) {

    let boxItems = [
        {
            ratio: 1,
            baseSize: '2%',
            html: `<div id='mainIdent'>&nbsp;</div>`
        },
        {
            ratio: 20,
            baseSize: '90%',
            box: {
                direction: 'col',
                items: [
                    {
                        baseSize:'auto',
                        html: '<div id="mainMenu"></div>'
                    },
                    {
                        baseSize:'auto',
                        html: '<div id="mainArea"></div>'
                    },
                    {
                        baseSize:'auto',
                        html: '<div id="footer"></div>'
                    },
                ]

            }
        },
        {
            ratio: 1,
            baseSize: '2%',
            html: `<div id='mainIdent'>&nbsp;</div>`
        }
    ]
 
    return $(`#${id}`).dxBox({
        direction: 'row',
        width: '100%',
        items: boxItems,      
    }).dxBox("instance");

}

