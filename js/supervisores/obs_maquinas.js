async function view_obs_maquina(){
    let vista = `    
        <div id="modal" class="absolute inset-0 top-3 overflow-y-auto bg-white p-8 rounded w-full md:w-1/2 mt-8 mx-auto">
            <h2 class="text-xl font-semibold mb-4">Observacion maquinas</h2>
            <form onsubmit="return false" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="mb-4">
                    <label for="idobs_maquina" class="block font-medium">ID</label>
                    <input type="text" id="idobs_maquina" name="idobs_maquina" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                </div>

               <!-- Otros campos aquí (vda, maquina_idmaquina, registro_idregistro, producto_idproducto) -->

                <div class="mb-4">
                    <label for="maquina_idmaquina" class="block font-medium">Máquina</label>
                    <select id="maquina_idmaquina" name="maquina_idmaquina" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                        <!-- Opciones del select de máquina -->
                    </select>
                </div>
                 <div class="mb-4">
                    <label for="peroxido" class="block font-medium">Peroxido</label>
                    <input type="number" step="0.1" id="peroxido" name="peroxido" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                </div> 
                <div class="mb-4">
                        <label for="detalle" class="block font-medium">Detalle</label>
                        <Textarea id="detalle" name="detalle" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
                </div> 
                <!-- Otros campos y selects aquí -->
                
                <button type="submit" onclick="registrar_obs_maquina()" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Guardar</button>
                <button type="submit" onclick="close_window()" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Cancelar</button>
            </form>

            <!-- Tabla -->
            <table class="mt-8 w-full">
                <thead>
                    <tr>
                        <th class="px-4 py-2">Maquina</th>
                        <th class="px-4 py-2">Peroxido</th>
                        <th class="px-4 py-2">Detalle</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Filas de la tabla aquí -->
                </tbody>
            </table>
        </div>
    `;
    if (typeof(localStorage.getItem('supervisores')) == "string"){
        let obj = JSON.parse(localStorage.getItem('supervisores'));
        document.querySelector('#formularios').innerHTML = vista;
        let data =await update_form_list(uriGlobal + "api/search_form_obs_maquina?idregistro=" + obj['idregistro']);
        if (typeof(data) == "object"){
           //levantar maquinas_idmaquinas
            update_maquina(data['maquinas']);
        //obtener la lista y crear la tabla
            update_table_obs_maquina(data['lista'], data['maquinas']);
        }

    }else{
        alert ("Debe crear primero el registro de turno");
    }
}




function update_maquina(lista){
    let opt_list ="";
    for (let index = 0; index < lista.length; index++) {
        opt_list += `<option value=${lista[index]['idmaquina']}>${lista[index]['detalle']}</option>`;
    }
    document.querySelector('#maquina_idmaquina').innerHTML = opt_list;
}


function update_table_obs_maquina(lista, lista_maquina){
    let codigo ="";
    let tabla = "";
    let script_edit ="";
    let script_delete ="";
    for (let index = 0; index < lista.length; index++) {
        $maquina = obtener_detalle(lista[index]['maquina_idmaquina'], lista_maquina,'idmaquina','detalle');
        
        script_edit = `onclick="editar_obs(${lista[index]['idobs_maquina']})"`;
        script_delete = `onclick="obs_delete(${lista[index]['idobs_maquina']})"`;
        tabla += `
            <tr>
            <td  class="text-center">${lista[index]['maquina']}</td>
            <td class="text-center">${lista[index]['peroxido']}</td>
            <td  class="text-center"><p style="width:100px;" class="truncate ...">${lista[index]['detalle']}</p></td>
            <td  class="grid grid-cols-2">
                <a ${script_edit} class="w-8 shadow-md text-center text-white cursor-pointer"><img class="mx-auto" src="img/edit.svg"></a>
                <a ${script_delete} class="w-8 shadow-md text-center text-white cursor-pointer"><img class="mx-auto" src="img/cancel.svg"></a>
            </td>
            <tr>
            `;
    } 
    document.querySelector('tbody').innerHTML = tabla;
}
function editar_obs (idobs_maquina){
    let url = uriGlobal + "api/search_idobs_maquina?idobs_maquina=" + idobs_maquina;
    let opt ={
        method:"get",
        headers:{
            'content-type':"application/json",
            Authorization: "Bearer " + localStorage.getItem('token')
        }
    }
    fetch (url,opt)
        .then(response=>response.json())
        .then(function(data){
            if (data['status'] == 1){
                 document.querySelector('#idobs_maquina').value = data['data']["idobs_maquina"];
                document.querySelector('#peroxido').value = data['data']['peroxido'];
                document.querySelector('#detalle').value = data['data']['detalle'];
                document.querySelector('#maquina_idmaquina').value = data['data']['maquina_idmaquina'];
            }else{
                alert ("Registro no encontrado");
            }
        });
    }
function registrar_obs_maquina(){
    let obj = JSON.parse(localStorage.getItem('supervisores'));
    let url ="";
    url = uriGlobal + "api/insert_obs_maquina";
    

    let valores = {
        'idobs_maquina':document.querySelector('#idobs_maquina').value,
        'maquina_idmaquina':parseInt(document.querySelector('#maquina_idmaquina').value),
        'peroxido':document.querySelector('#peroxido').value,
        'detalle_maquina':document.querySelector('#detalle').value,
        'registro_idregistro':obj['idregistro']
    }; 
    let opt = {
        method:"POST",
        body:JSON.stringify(valores),
        headers:{
            'content-type':'application/json',
            'Accept':'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    }
    let salida ="";
    fetch(url,opt)
        .then(response=>response.json())
        .then(async function (data){
            if (data['status'] == 1) {
                //actualizar vista
                view_obs_maquina();
            }else{
                if (typeof(data['mje']) != "string"){
                    for (key in data['mje']) {
                       salida +=  data['mje'][key] + " ";
                    }
                }else{
                    salida = data['mje'];
                }    
                alert(salida);
            }
        })
}
async function obs_delete(id){
  let parametro = {'idobs_maquina':id};
  let response = await delete_reg(parametro, uriGlobal + 'api/delete_obs_maquina');
  if (response['status'] == 1) {
      view_obs_maquina();
  }else{
      alert (response['mje']);
  }
}
