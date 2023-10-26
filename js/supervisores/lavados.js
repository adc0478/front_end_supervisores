async function view_lavados(){
let vista = `    
        <div id="modal" class="absolute inset-0 top-3 overflow-y-auto bg-white p-8 rounded w-full md:w-1/2 mt-8 mx-auto">
            <h2 class="text-xl font-semibold mb-4">Control lavado equipos</h2>
            <form onsubmit="return false" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="mb-4">
                    <label for="idlavado" class="block font-medium">ID lavado</label>
                    <input type="text" id="idlavado" name="idlavado" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                </div>
                <div class="mb-4">
                    <label for="hora" class="block font-medium">Hora</label>
                    <input type="time" id="hora" name="hora" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                </div>
                <div class="mb-4">
                     <label for="tipo" class="block font-medium">Tipo</label>
                     <select id="tipo" name="tipo" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                        <option value="Largo">Largo</option>
                        <option value="Intermedio">Intermedio</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label for="equipo_idequipo" class="block font-medium">Equipo</label>
                    <select id="equipo_idequipo" name="equipo_idequipo" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                        <!-- Opciones del select de máquina -->
                    </select>
                </div>
                <div class="mb-4">
                    <label for="tanque_idtanque" class="block font-medium">Tanque</label>
                    <select id="tanque_idtanque" name="tanque_idtanque" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                        <!-- Opciones del select de máquina -->
                    </select>
                </div>
                
                <div></div>
                                 
                <!-- Otros campos y selects aquí -->
                
                <button type="submit" onclick="registrar_lavado()" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Guardar</button>
                <button type="submit" onclick="close_window()" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Cancelar</button>
            </form>

            <!-- Tabla -->
            <table class="mt-8 w-full">
                <thead>
                    <tr>
                        <th class="px-4 py-2">Hora</th>
                        <th class="px-4 py-2">Tipo</th>
                        <th class="px-4 py-2">Equipo</th>
                        <th class="px-4 py-2">Tanque</th>
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
        let data =await update_form_list(uriGlobal + "api/search_form_lavado?idregistro=" + obj['idregistro']);
        if (typeof(data) == "object"){
           //levantar Equipo_idequipo
            update_equipos(data['equipos']);
        //levantar tanque_idtanque
            update_tanques(data['tanques']);
        //obtener la lista y crear la tabla
            update_table_lavados(data['lavados'],data['equipos'],data['tanques']);
        }

    }else{
        alert ("Debe crear primero el registro de turno");
    }
}
function update_equipos(lista){
    let opt_list ="";
    for (let index = 0; index < lista.length; index++) {
        opt_list += `<option value=${lista[index]['idequipo']}>${lista[index]['nombre_eq']}</option>`;
    }
    document.querySelector('#equipo_idequipo').innerHTML = opt_list;
}
function update_tanques (lista){
    let opt_list ="";
    for (let index = 0; index < lista.length; index++) {
        opt_list += `<option value=${lista[index]['idtanque']}>${lista[index]['nombre_tk']}</option>`;
    }
    document.querySelector('#tanque_idtanque').innerHTML = opt_list;
}
function update_table_lavados (lista,equipos,tanques){
   let filas = "";
   for (let index = 0; index < lista.length; index++) {
    parametros = `
            ${lista[index]['idlavado']},
            '${lista[index]['hora']}',
            '${lista[index]['tipo']}',
            ${lista[index]['equipo_idequipo']},
            ${lista[index]['tanque_idtanque']}
       `;
       script_edit = `onclick="lavadoeditar(${parametros})"`;
       script_delete = `onclick="lavado_delete(${lista[index]['idlavado']})"`;
     filas += `<tr class="text-center">
                <td>${lista[index]['hora']}</td>
                <td>${lista[index]['tipo']}</td>
                <td>${lista[index]['nombre_eq']}</td>
                <td>${lista[index]['nombre_tk']}</td>
                <td class="grid grid-cols-2">
                    <a ${script_edit} class="w-8 shadow-md text-center text-white cursor-pointer"><img class="mx-auto" src="img/edit.svg"></a>
                    <a ${script_delete} class="w-8 shadow-md text-center text-white cursor-pointer"><img class="mx-auto" src="img/cancel.svg"></a>
                </td>
              </tr>
       `;   
   } 
    document.querySelector('tbody').innerHTML = filas;
}
function obtener_detalle(id,lista,campoID,campoDetalle){
    for (let index = 0; index < lista.length; index++) {
       if (id == lista[index][campoID]){
           return lista[index][campoDetalle];
       } 
    }
    return "";
}
function lavadoeditar(id,hora,tipo,equipo,tanque){
   document.querySelector('#idlavado').value = id;
   document.querySelector('#hora').value = hora;
   document.querySelector('#tipo').value = tipo;
   document.querySelector('#equipo_idequipo').value = equipo;
   document.querySelector('#tanque_idtanque').value = tanque;
}
async function lavado_delete(id){
  let parametro = {'idlavado':id};
  let response = await delete_reg(parametro, uriGlobal + 'api/delete_lavado');
  if (response['status'] == 1) {
      view_lavados();
  }else{
      alert (response['mje']);
  }
}
function registrar_lavado(){
    let registro = JSON.parse(localStorage.getItem('supervisores'));
    let values = {
        'idlavado':document.querySelector('#idlavado').value,
        'idregistro':registro['idregistro'],
        'hora': document.querySelector('#hora').value,
        'tipo': document.querySelector('#tipo').value,
        'idequipo':document.querySelector('#equipo_idequipo').value,
        'idtanque': document.querySelector('#tanque_idtanque').value, 
    }
    let url = uriGlobal + 'api/insert_lavado';
    let opt = {
        method:"post",
        body: JSON.stringify(values),
        headers:{
            'content-type':'application/json',
            Authorization : 'Bearer ' +  localStorage.getItem('token')
        }
    };
   fetch (url,opt)
    .then(response=>response.json())
    .then(function(data){
        let salida ="";
        if (data['status'] == 0){
            if (typeof(data['mje']) != "string") {
               for (key in data['mje']) {
                 salida += data['mje'][key]; 
               } 
            }else{
                salida = data['mje'];      
            }
            alert (salida);
        }else{
            view_lavados();
        }
    });
}
