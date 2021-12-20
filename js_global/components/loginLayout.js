export function getComponent (id, params = {}) {

    let boxItems = [
        {
            ratio: 1,
            html: `<div>&nbsp;</div>`
        },
        {
            baseSize: 400,
            html: `<div><div id='loginForm'></div></div>`
        },
        {
            ratio: 1,
            html: `<div>&nbsp;</div>`
        }
    ]
 
    return $(`#${id}`).dxBox({
        direction: 'row',
        width: '100%',
        items: boxItems,      
    }).dxBox("instance");

}

