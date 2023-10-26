async function get_view_repassword(){
  let url = uriGlobal + "api/view_repassword";
  let opt = {
      method:"get",
      headers:{
          'content-type':'application/json'
      }
  }
  let response = await fetch(url,opt);
  if (response.ok){
      let data = await response.text();
      document.querySelector('#container').innerHTML = data;
  }else{
      alert('Error al conectar con el servidor para recuperar la vista');
  }
        
}
async function re_password(){
    let salida_error ="";
    let data = {
        'email':document.querySelector('#email').value,
        'password_actual':document.querySelector('#password_actual').value,
        'password_confirmation':document.querySelector('#password_confirmation').value,
        'password':document.querySelector('#password').value
    }
    let url = uriGlobal + "api/repassword";
    let opt = {
        method:"post",
        body: JSON.stringify(data),
        headers:{
            'content-type':'application/json'
        }
    }
    response = await fetch(url,opt);
    if (response.ok){
        let data = await response.json();
        if (data['status'] == 1){
            alert('El password fue cambiado');
            view_login();
        }else{
            if (typeof(data['error']) == 'object'){
                for (const key in data['error']) {
                    salida_error += data['error'][key];
                }
            }else{
                salida_error = data['error'];
            }
            alert(salida_error);
        }
    }else{
        alert ('Error en el servidor');
    }
}
