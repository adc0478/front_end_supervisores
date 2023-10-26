function view_registro_user(){
  let vista = `  <div class="w-full sm:w-1/2 bg-white p-8 shadow-lg rounded-lg">
            <h1 class="text-2xl font-semibold mb-6">Regístrate</h1>
            <form onsubmit="return false">
                <div class="mb-4">
                    <label for="nombre" class="block text-gray-700 font-medium">Nombre</label>
                    <input type="text" id="nombre" name="name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300">
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-gray-700 font-medium">Email</label>
                    <input type="email" id="email" name="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300">
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-gray-700 font-medium">Contraseña</label>
                    <input type="password" id="password" name="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300">
                </div>
                <div class="mb-6">
                    <label for="password_confirmation" class="block text-gray-700 font-medium">Confirmar Contraseña</label>
                    <input type="password" id="password_confirmation" name="password_confirmation" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300">
                </div>
                <div>
                    <button onclick="registrar_usuario()" class="w-full bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50">Registrarse</button>
                </div>
            </form>
        </div>`;
        document.querySelector('#container').innerHTML = vista;
}

function view_login (){
    let formulario = `<div class="w-full sm:w-1/3 bg-white p-8 shadow-lg rounded-lg">
    <h1 class="text-2xl font-semibold mb-6">Iniciar Sesión</h1>
    <form onsubmit="return false">
        <div class="mb-4">
            <label for="email" class="block text-gray-700 font-medium">Email</label>
            <input type="email" id="email" name="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300">
        </div>
        <div class="mb-6">
            <label for="password" class="block text-gray-700 font-medium">Contraseña</label>
            <input type="password" id="password" name="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300">
        </div>
        <div class="mb-4">
            <button type="submit" onclick="login()" class="w-full bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50">Iniciar Sesión</button>
        </div>
    </form>
    <p class="text-sm text-gray-600">¿? <a onclick="get_view_repassword()" class="text-indigo-500 hover:text-indigo-700 cursor-pointer">Cambiar password</a></p>
</div>`;
    if (typeof(localStorage.getItem('user')) != "string") {
        document.querySelector("#container").innerHTML = formulario;
    }else{
        alert ('El usuario ' + localStorage.getItem('user') + ' esta logueado');
    }
}
function registrar_usuario(){
    let formulario = {
       'name': document.querySelector('#nombre').value,
       'email': document.querySelector('#email').value,
       'password': document.querySelector('#password').value,
       'password_confirmation': document.querySelector('#password_confirmation').value
    };
    let url = uriGlobal + 'api/registro';
    let opt = {
        method:'post',
        body:JSON.stringify(formulario),
        headers:{
            'content-type' : 'application/json'
        },
    };
    fetch(url,opt)
        .then(resp => resp.json())
        .then(function(datos) {
            if (datos['status'] == 1){
                alert (datos['data']['email'] + ' se registro correctamente')
            }else{
                alert(datos['data']['error'])
            }
        });

}
function login(){
    let formulario = {
           'email': document.querySelector('#email').value,
           'password': document.querySelector('#password').value
    };
    let url =uriGlobal + "api/login";
    let opt = {
        method:'post',
        body:JSON.stringify(formulario),
        headers:{
            'content-type' : 'application/json'
        },
    };
    fetch(url,opt)
        .then(response => response.json())
        .then(function (data){
            if (data['status'] == 1) {
                let token = data['access_token'];
                let user = document.querySelector('#email').value;
                //registrar en local storange el token y el user
                storange_local_write(user, token);
                //metodo para indicar usuario registrado debe sacar la info de localstorange
                get_user_view(); 
                //quitar formulario de login
                document.querySelector('#container').innerHTML = "";
            }else{
                alert (data['mje']);
            }
        });
}

 async function logout(){
    if (!confirm('Desea cerrar secion?')){
        return false;
    }
    //leer el token
    if (typeof(localStorage.getItem('token')) != "string") {
        return false;
    }
    let token = localStorage.getItem('token');
    //eliminar token en servidor
    let url = uriGlobal + "api/logout";
    let opt = {
        method:"get",
        headers:{
             Authorization: 'Bearer ' + token
        }
    }
    let response = await fetch(url,opt);
     if (response.ok){
            let data = await response.json();
            //eliminar todas las llaves de localstorange
            alert (data['mje']);
     } 
            localStorage.clear();
            //actualizar usuario en menu
            get_user_view();
            //quitar pantalla en uso
            document.querySelector('#container').innerHTML = "";
    }
function storange_local_write (user, token){
    localStorage.setItem('user', user);
    localStorage.setItem('token', token);
}
function get_user_view(){
    if (typeof(localStorage.getItem('user')) == "string"){
        document.querySelector('#menu').innerHTML +=`<li id="usuario" onclick="logout()"><h2>${localStorage.getItem('user')}</h2></li>`;
    }else{
        document.querySelector('#usuario').remove();
    }
}
function registro_rechazado(){
    //localStorage.clear();
    //get_user_view();
    alert ("No tiene permisos para operar");
}
