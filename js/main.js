$(document).ready(function(){
    $("section").hide();
    $("#play").click(function(e){
        e.preventDefault();
        $("section").fadeIn();
    });
    $("#login").click(function(e){
        e.preventDefault();
        if(checkLogin($("#username").val(),$("#passwd").val())){
            window.location.pathname = "html/game.html";
            localStorage.setItem("actualUser",$("#username").val());
        }
    });
    $("#close").click(function(){
        $(this).parent().fadeOut();
    })
});
/**
 * comprueba la validez del login
 * @param {nombre de usuario} user 
 * @param {contraseña} passwd 
 */
const checkLogin = (user,passwd) =>{
    let checkOK = false;
    let dbUsers = localStorage.getItem("users");
    if(dbUsers != null){
        dbUsers = JSON.parse(dbUsers);
        if(Object.keys(dbUsers).includes(user)){
            dbUsers[user].passwd == passwd ? checkOK = true : toastr.error("Contraseña incorrecta")
        }else{
            toastr.error("Este usuario no está registrado")
        }
    }
    return checkOK;
}