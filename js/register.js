/**
 * Base de datos con los usuarios ya registrados
 */
let dbUsers;
$(document).ready(function(){
    getDb();
    dataRestore();
    /**
     * Los eventos mousedown y mouseup sirven para que el usuario pueda ver claramente la contraseña que escribio en el primer campo
     */
    $("#show").mousedown(function(){
        $(this).siblings("input").attr("type","text");
        $(this).addClass("showON");
    });
    $("#show").mouseup(function(){
        $(this).siblings("input").attr("type","password");
        $(this).removeClass("showON");
    });

    $(".cancel").click(e=>{
        e.preventDefault();
        let backup = {};
        $("input").each(function(i){
            backup[$(this).attr("id")] = $(this).val();
        });
        localStorage.setItem("registerBackup",JSON.stringify(backup));
        window.location.pathname = "../index.html";
    });

    $(".create").click(function(e){
        e.preventDefault();
        if(checkForm()){
            localStorage.removeItem("registerBackup");
            dbUsers[$("#nickname").val()]={
                name:$("#name").val(),
                lastname:$("#lastname").val(),
                age:$("#age").val(),
                email:$("#email").val(),
                passwd:$("#password").val()
            };
            localStorage.setItem("users",JSON.stringify(dbUsers));
            $("input").val("");
        }
    });
});
/**
 * Obtiene la base de datos de usuarios
 */
const getDb = () =>{
    dbUsers = localStorage.getItem("users");
    dbUsers == null ? dbUsers = {} : dbUsers = JSON.parse(dbUsers);
}
/**
 * Restaura los datos introducidos por el cliente en el caso de cancelacion, por si es un error.
 */
const dataRestore = () =>{
    let data = localStorage.getItem("registerBackup");
    if(data != null){
        data = JSON.parse(data);
        Object.keys(data).map(e=>{
            $(`#${e}`).val(data[e]);
        });
        toastr.info("Continua donde lo dejaste");
    }
};
/**
 * comprueba la inegridad del formulario
 */
const checkForm = () =>{
    $(".failed").removeClass("failed");
    let checkOK = true;
    if(!checkRequired() || !checkEmail() || !checkNumber() || !checkPasswd() || !checkNickName()){
        checkOK = false;
    }
    return checkOK;
};
/**
 * comprueba que los campos requeridos no esten en blanco
 */
const checkRequired = () =>{
    let checkOK = true;
    $("input[required]").each(function(){
        if($(this).val().length < 1){
            checkOK = false;
            $(this).addClass("failed");
            toastr.error(`El campo ${$(this).siblings('span').text()} es obligatorio`);
        }
    });
    return checkOK;
};
/**
 * Comprueba la validez de los email
 */
const checkEmail = () =>{
    let checkOK = true;
    $('input[type="email"]').each(function(){
        if(!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test($(this).val())){
            checkOK = false;
            $(this).addClass("failed");
            toastr.error("El formato del email es incorrecto");
        }
    });
    return checkOK;
}
/**
 * Comprueba que los campos numericos sean numericos
 */
const checkNumber = () =>{
    let checkOK = true;
    $("input[number]").each(function(){
        let n = parseInt($(this).val());
        let min = parseInt($(this).attr("min"));
        let max = parseInt($(this).attr("max"));
        if(typeof(n) == "NaN" || n < min || n > max){
            checkOK = false;
            $(this).addClass("failed");
            toastr.error("En la edad solo se permiten numeros enteros entre 1 y 120");
        }
    });
    return checkOK;
}
/**
 * Comprueba que las contraseñas sean iguales
 */
const checkPasswd = () =>{
    let passwd1,passwd2;
    let checkOK = true;
    $('input[type="password"]').each(function(i){
        i%2 == 0 ? passwd2 = $(this).val() : passwd1 = $(this).val();
    });
    if(passwd1 != passwd2){
        checkOK = false;
        $("#repeatPassword").addClass("failed");
        toastr.error("Las contraseñas no coinciden")
    }
    return checkOK;
}
/**
 * comprueba que el nickname no esta repetido
 */
const checkNickName = () =>{
    const value = $("#nickname").val();
    let checkOK = true;
    let keys = Object.keys(dbUsers);
    if(keys.includes(value)){
        checkOK = false;
        $("#nickname").addClass("failed");
        toastr.error("Lo sentimos, este nickname ya esta cogido");
    }
    return checkOK;
}