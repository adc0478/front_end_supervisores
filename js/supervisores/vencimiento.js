async function view_vencimiento(){
    let vista = `    
        <div id="modal" class="absolute inset-0 top-3 overflow-y-auto bg-white p-8 rounded w-full md:w-1/2 mt-8 mx-auto">
            <h2 class="text-xl font-semibold mb-4">Control vencimiento</h2>
            <form onsubmit="return false" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="mb-4">
                    <label for="idvencimiento" class="block font-medium">ID Vencimiento</label>
                    <input type="text" id="idvencimiento" name="idvencimientos" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                </div>

                <div class="mb-4">
                    <label for="producto_idproducto" class="block font-medium">Codigo</label>
                    <select onchange="actualizar_vto()" id="producto_idproducto" name="productos_idproductos" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                        <!-- Opciones del select de máquina -->
                    </select>
                </div>
                <div class="mb-4">
                    <label for="vencimiento" class="block font-medium">Vencimiento</label>
                    <input type="date" id="vencimiento" name="vencimiento" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                </div>
                <div class="mb-4">
                    <label class="block font-medium">Control</label>
                    <input type="checkbox" id="control" name="control" class="mr-2" value="false">
                    <label for="control">Control</label>
                </div>
                <!-- Otros campos aquí (vda, maquina_idmaquina, registro_idregistro, producto_idproducto) -->

                <div class="mb-4">
                    <label for="maquina_idmaquina" class="block font-medium">Máquina</label>
                    <select id="maquina_idmaquina" name="maquinas_idmaquinas" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                        <!-- Opciones del select de máquina -->
                    </select>
                </div>
                 
                <!-- Otros campos y selects aquí -->
                <div class="mb-4">
                    <label for="vda" class="block font-medium">VDA</label>
                    <input type="text" id="vda" name="vda" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                </div>

                <button type="submit" onclick="registrar_vto()" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Guardar</button>
                <button type="submit" onclick="close_window()" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Cancelar</button>
            </form>

            <!-- Tabla -->
            <table class="mt-8 w-full">
                <thead>
                    <tr>
                        <th class="px-4 py-2">Código</th>
                        <th class="px-4 py-2">Máquina</th>
                        <th class="px-4 py-2">Vencimiento</th>
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
        let data =await update_form_list(uriGlobal + "api/search_form_vencimiento?idregistro=" + obj['idregistro']);
        if (typeof(data) == "object"){
        //levantar maquinas_idmaquinas
            update_maquina(data['maquinas']);
        //levantar productos_idproductos
            update_productos(data['productos']);
        //obtener la lista y crear la tabla
            update_table(data['lista']);
        }

    }else{
        alert ("Debe crear primero el registro de turno");
    }
}


function actualizar_vto(){
    
    if (document.querySelector('#idvencimiento').value == ""){
        idproducto = document.querySelector("#producto_idproducto").value;
        tiempo = Date.now();
        vida_util = obtener_vida_util(idproducto);
        //tiempo + miliseg(de un dia 86400000) * numero de dias
        tiempo = tiempo + (86400000 * vida_util);

        fecha = new Date(tiempo);
        ano = fecha.getFullYear();
        mes = (fecha.getMonth() + 1).toString().padStart(2,"0");
        dia = fecha.getDate().toString().padStart(2,"0");
        fecha_vto = ano + "-" + mes + "-" + dia;
        document.querySelector("#vencimiento").value = fecha_vto;
    }
}
function obtener_vida_util(idproducto){
    lista = JSON.parse(localStorage.getItem('productos'));
    for (let index = 0; index < lista.length; index++) {
        if (lista[index]['idproducto'] == idproducto) {
            return lista[index]['vida_util'];
        }
    }
    return 0;
}
function update_maquina(lista){
    let opt_list ="";
    for (let index = 0; index < lista.length; index++) {
        opt_list += `<option value=${lista[index]['idmaquina']}>${lista[index]['detalle']}</option>`;
    }
    document.querySelector('#maquina_idmaquina').innerHTML = opt_list;
}

function buscar_codigo(id_producto){
    let obj = JSON.parse(localStorage.getItem('productos'));
    for (let index = 0; index < obj.length; index++) {
       if (obj[index]['idproducto'] == id_producto) {
           return obj[index]['codigo'];
       }
    }
       return "";
}
function update_table(lista){
    let tabla = "";
    let script_edit ="";
    let script_delete ="";
    for (let index = 0; index < lista.length; index++) {
        parametro = `
            ${lista[index]['idvencimiento']},
            ${lista[index]['vda']},
            ${lista[index]['producto_idproducto']},
            '${lista[index]['vencimiento']}',
            ${lista[index]['control']},
            ${lista[index]['maquinas_idmaquina']}
        `;
        script_edit = `onclick="editar(${parametro})"`;
        script_delete = `onclick="vencimiento_delete(${lista[index]['idvencimiento']})"`;
        tabla += `
            <tr>
            <td  class="text-center">${lista[index]['codigo']}</td>
            <td class="text-center">${lista[index]['maquina']}</td>
            <td class="text-center">${lista[index]['vencimiento']}</td>
            <td class="grid grid-cols-2">
                <a ${script_edit} class="w-8 shadow-md text-center text-white cursor-pointer"><img class="mx-auto" src="img/edit.svg"></a>
                <a ${script_delete} class="w-8 shadow-md text-center text-white cursor-pointer"><img class="mx-auto" src="img/cancel.svg"></a>
            </td>
            <tr>
            `;
    } 
    document.querySelector('tbody').innerHTML = tabla;
}
function editar (idvencimiento,vda,producto_idproducto,vencimiento,control,maquinas_idmaquina){
    document.querySelector('#idvencimiento').value = idvencimiento;
    document.querySelector('#producto_idproducto').value = producto_idproducto;
    document.querySelector('#vencimiento').value = vencimiento;
    document.querySelector('#vda').value = vda;
    if (control != 0){
        document.querySelector('#control').value = true;
        document.querySelector('#control').checked = true;
    }else{
        document.querySelector('#control').value = false;
        document.querySelector('#control').checked = false;
    }
    document.querySelector("#maquina_idmaquina").value = maquinas_idmaquina;
}
function registrar_vto(){
    let obj = JSON.parse(localStorage.getItem('supervisores'));
    let url ="";
    if (document.querySelector('#idvencimiento').value != "") {
        //url edicion
        url = uriGlobal + "api/edit_vencimiento";
    }else{
        //url de registro
        url = uriGlobal + "api/insert_vencimiento";
    }
    if (document.querySelector('#control').checked == true){
        control = 1;
    }else{
        control = 0;
    }

    let valores = {
        'idvencimiento':document.querySelector('#idvencimiento').value,
        'producto_idproducto':parseInt(document.querySelector('#producto_idproducto').value),
        'maquinas_idmaquina':parseInt(document.querySelector('#maquina_idmaquina').value),
        'vencimiento':document.querySelector('#vencimiento').value,
        'vda':document.querySelector('#vda').value,
        'control':control,
        'registros_idregistro':obj['idregistro']
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
                view_vencimiento();
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
async function vencimiento_delete(idvencimiento){
    let parametro = {'idvencimiento':idvencimiento}
    response = await delete_reg(parametro, uriGlobal + 'api/delete_vencimiento');
    if (response['status'] == 1) {
              view_vencimiento();  
            }else{
                alert (response['mje']);
            }
}
