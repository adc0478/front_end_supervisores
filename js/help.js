function fecha_obtener_dd_mm_yyyy(fecha_yyyy_mm_dd){
   arreglo = fecha_yyyy_mm_dd.split('-');
   return `${arreglo[2]}-${arreglo[1]}-${arreglo[0]}`; 
}
function fecha_obtener_yyyy_mm_dd(fecha_dd_mm_yyyy){
    arreglo = fecha_dd_mm_yyyy.split('-');
   return `${arreglo[2]}-${arreglo[1]}-${arreglo[0]}`; 
}
function close_window(){
    document.querySelector('#modal').remove();
}
function update_productos(lista){
    let opt_list ="";
    for (let index = 0; index < lista.length; index++) {
       opt_list += `<option value=${lista[index]['idproducto']}>${lista[index]['codigo']} - ${lista[index]['detalle']}</option>` 
    }
    localStorage.setItem('productos', JSON.stringify(lista));
    document.querySelector('#producto_idproducto').innerHTML = opt_list;
}
async function update_form_list(uri_api){
    let url = uri_api;
    let opt = {
        method:"GET",
        headers:{
            'content-type':'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    };
    let response =  await fetch(url,opt)
    if (!response.ok){
        registro_rechazado();
    }else{
        let data = await response.json();  
        return data;
    }
}
async function delete_reg(parametro, urli){
    let opt = {
        method:"post",
        body:JSON.stringify(parametro),
        headers:{
            'content-type':'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    }
    let url = urli;
    let response = await fetch(url,opt);
    let data = await response.json();
    return data;
}
function obtener_detalle(id,lista,campoID,campoDetalle){
    for (let index = 0; index < lista.length; index++) {
       if (id == lista[index][campoID]){
           return lista[index][campoDetalle];
       } 
    }
    return "";
}
function send_mail(idregistro){
    let url = uriGlobal + "api/send_mail?idregistro=" + idregistro;
    let opt = {
        method:"get",
        headers :{
            'content-type':'application/json',
            Authorization: "Bearer " + localStorage.getItem('token')
        }
    }
    fetch(url,opt)
        .then(response=>response.json())
        .then(function(data){
            if (data['status'] == 1){
                alert ("Mail enviado correctamente")
            }else{
                alert ("Error de envio mail")
            }
        });
}
function print_pdf(id){
  let element = document.querySelector(id);
 var opciones = {
    margin: 10,
    filename: 'mi_archivo.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
    html2pdf().from(element).set(opciones).save();
}
