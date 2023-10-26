async function view_stock(){
let vista = `    
        <div id="modal" class="absolute inset-0 top-3 overflow-y-auto bg-white p-8 rounded w-full md:w-1/2 mt-8 mx-auto">
            <h2 class="text-xl font-semibold mb-4">Control stock de silos</h2>
            <form onsubmit="return false" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="mb-4">
                    <label for="idstock_silo" class="block font-medium">ID Stock</label>
                    <input type="text" id="idstock_silo" name="idstock_silo" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                </div>
                
                <div class="mb-4">
                     <label for="silo_idsilo" class="block font-medium">Silo</label>
                     <select id="silo_idsilo" name="silo_idsilo" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                    </select>
                </div>

                <div class="mb-4">
                    <label for="producto_idproducto" class="block font-medium">Producto</label>
                    <select id="producto_idproducto" name="producto_idproducto" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                        <!-- Opciones del select de máquina -->
                    </select>
                </div>
                
                
                <div></div>
                                 
                <!-- Otros campos y selects aquí -->
                
                <button type="submit" onclick="registrar_stock()" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Guardar</button>
                <button type="submit" onclick="close_window()" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Cancelar</button>
            </form>

            <!-- Tabla -->
            <table class="mt-8 w-full">
                <thead>
                    <tr>
                        <th class="px-4 py-2">Silo</th>
                        <th class="px-4 py-2">Producto</th>
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
        let data =await update_form_list(uriGlobal + "api/search_form_stock?idregistro=" + obj['idregistro']);
           //levantar silos
        if (typeof(data) == "object"){
            update_silos(data['silos']);
        //levantar productos
            update_productos(data['productos']);
        //obtener la lista y crear la tabla
            update_table_stock(data['stock'],data['silos'],data['productos']);
        }

    }else{
        alert ("Debe crear primero el registro de turno");
    }
}
function update_silos(lista){
    let opt_list ="";
    for (let index = 0; index < lista.length; index++) {
        //obtener nombre silos
        silo = obtener_detalle(lista[index]['idsilo'], lista, 'idsilo', 'nombre_silo');
        opt_list += `<option value=${lista[index]['idsilo']}>${silo}</option>`;
    }
    document.querySelector('#silo_idsilo').innerHTML = opt_list;
}

function update_table_stock (lista,silos,productos){
   let filas = "";
   for (let index = 0; index < lista.length; index++) {
    silo = obtener_detalle(lista[index]['silo_idsilo'],silos,"idsilo","nombre_silo");
    producto = obtener_detalle(lista[index]['producto_idproducto'],productos,"idproducto",'detalle');
    parametros = `
            ${lista[index]['idstock_silo']},
            ${lista[index]['silo_idsilo']},
            ${lista[index]['producto_idproducto']}
       `;
       script_edit = `onclick="stockeditar(${parametros})"`;
       script_delete = `onclick="stock_delete(${lista[index]['idstock_silo']})"`;
     filas += `<tr class="text-center">
                <td>${lista[index]['nombre_silo']}</td>
                <td>${lista[index]['detalle']}</td>
                <td class="grid grid-cols-2">
                    <a ${script_edit} class="w-8 shadow-md text-center text-white cursor-pointer"><img class="mx-auto" src="img/edit.svg"></a>
                    <a ${script_delete} class="w-8 shadow-md text-center text-white cursor-pointer"><img class="mx-auto" src="img/cancel.svg"></a>
                </td>
              </tr>
       `;   
   } 
    document.querySelector('tbody').innerHTML = filas;
}

function stockeditar(id,silo,producto ){
   document.querySelector('#idstock_silo').value = id;
   document.querySelector('#silo_idsilo').value = silo;
   document.querySelector('#producto_idproducto').value = producto;
}
async function stock_delete(id){
  let parametro = {'idstock_silo':id};
  let response = await delete_reg(parametro, uriGlobal + 'api/delete_stock_silo');
  if (response['status'] == 1) {
      view_stock();
  }else{
      alert (response['mje']);
  }
}
function registrar_stock(){
    let registro = JSON.parse(localStorage.getItem('supervisores'));
    let values = {
        'idstock_silo':document.querySelector('#idstock_silo').value,
        'idregistro':registro['idregistro'],
        'silo_idsilo':document.querySelector('#silo_idsilo').value,
        'producto_idproducto': document.querySelector('#producto_idproducto').value, 
    }
    let url = uriGlobal + 'api/insert_stock_silo';
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
            view_stock();
        }
    });
}
