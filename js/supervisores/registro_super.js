function view_registro(){
  let vista =` <div id="formulario_supervisores" class="absolute max-h-96 max-w-md mx-auto bg-white p-8 rounded shadow fixed inset-0 top-5 overflow-y-auto">

    <h2 class="text-xl font-semibold mb-4">Registro</h2>

    <form onsubmit="return false" class="grid grid-cols-1 md:grid-cols-2 gap-x-0.5">

      <div class="mb-4">
        <label for="idregistro" class="block text-sm font-medium text-gray-700">ID de Registro</label>
        <input type="text" id="idregistro" name="idregistro" class="mt-1 p-2 block w-full border rounded-md">
      </div>

      <div class="mb-4">
        <label for="fecha" class="block text-sm font-medium text-gray-700">Fecha</label>
        <input type="date" id="fecha" name="fecha" class="mt-1 p-2 block w-full border rounded-md">
      </div>

      <div class="mb-4">
        <label for="turno" class="block text-sm font-medium text-gray-700">Turno</label>
        <select id="turno" name="turno" class="mt-1 p-2 block w-full border rounded-md">
          <option value="manana">Mañana</option>
          <option value="tarde">Tarde</option>
          <option value="noche">Noche</option>
        </select>
      </div>

      <div class="mb-4">
        <label for="fechafin" class="block text-sm font-medium text-gray-700">Fecha Fin</label>
        <input type="date" id="fechafin" name="fechafin" class="mt-1 p-2 block w-full border rounded-md">
      </div>

        <button type="submit" onclick="create_registro()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Guardar</button>
        <button onclick="close_formulario()" class="md:mt-0 mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cancelar</button>

    </form>
   <a onclick="cerrar_registro()" class="absolute cursor-pointer top-1 right-1 bg-red-500 rounded-full w-5 h-5 grid text-center content-center hover:shadow-md hover:bg-red-600">X</a>
  </div>`;
    if (typeof(localStorage.getItem('user')) == "string"){
        document.querySelector('#formularios').innerHTML = vista;
        //Consultar en el servidor si hay un registro abierto para el usuario  en curso o bien pasar como parametro el ID del registro a trabajar
         if (typeof(localStorage.getItem('supervisores') )== "string") {
             let obj = JSON.parse(localStorage.getItem('supervisores'));
             document.querySelector('#idregistro').value = obj['idregistro'];
             document.querySelector('#fecha').value = obj['fecha'];
             document.querySelector('#turno').value = obj['turno'];
             document.querySelector('#fechafin').value = obj['fecha_fin'];
         }
    }else{
        alert ("Debe ingresar como un usuario valido");
    }
}
function cerrar_registro(){
    localStorage.removeItem("supervisores");
    view_multilink();
}
function close_formulario(){
    document.querySelector("#formularios").innerHTML = "";
}
async function search_registro(){
    document.querySelector('#dato_registro').innerHTML ="";
    localStorage.removeItem('supervisores');
    let url =uriGlobal + "api/search_registro_pendiente";
    let opt ={
        method:"get",
        headers:{
            'content-type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    }
    let response = await fetch(url,opt);
    if (!response.ok){
        registro_rechazado();
    }
    let data = await response.json();
            if (data.length > 0){
                if (typeof(data[0]['idregistro']) == "number") {
                    update_local_registro(data[0]);              
                    refresh_registro();
                } 
            }
}
function refresh_registro(){
    let obj = JSON.parse(localStorage.getItem('supervisores'));
    document.querySelector("#dato_registro").innerHTML = "IDregistro: " + obj['idregistro'] + "<strong> " + obj['fecha'] + "</strong>";
}
function update_local_registro(data){
    let obj = {
                   'idregistro':data['idregistro'],
                   'fecha':data['fecha'],
                   'turno':data['turno'],
                   'fecha_fin':data['fecha_fin']
               } 
    localStorage.setItem('supervisores', JSON.stringify(obj));
}
async function create_registro(){
    let salida ="";
    let url="";
    let inputs = {
        'idregistro':document.querySelector('#idregistro').value,
        'fecha':document.querySelector('#fecha').value,
        'turno':document.querySelector('#turno').value,
        'fecha_fin':document.querySelector('#fechafin').value
    };
    if (document.querySelector('#idregistro').value == ""){
         url = uriGlobal + "api/insert_registro" //alta
    }else{
         url = uriGlobal + "api/edit_registro" //modificacion
    }
    let opt ={
        method:"post",
        body:JSON.stringify(inputs),
        headers:{
            'content-type':'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    };
    let response = await fetch(url,opt);
    if (!response.ok){
        registro_rechazado();
    }else{
        let data = await response.json();
           if(data['status'] == 1){
               search_registro(); //aqui cargo en localstorange 
                //cerrar formulario
                close_formulario();
                alert(data['mje']);
           } else{
               if (typeof(data['mje']) != "string") {
                   for (key in data['mje']) {
                      salida += data['mje'][key] + " "; 
                   }
               }else{
                   salida = data['mje'];
               }
               alert (salida);
           }
    }
}
async function search_registro_by_id(id){
    let url = uriGlobal + "api/search_registro_by_id?idregistro=" + id;
    let opt = {
        method:"get",
        headers:{
            "content-type":"application/json",
            Authorization: "Bearer " + localStorage.getItem('token')
        }
    }
    let response = await fetch(url,opt);
    let data = await response.json();
    return data;
}
