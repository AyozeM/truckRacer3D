/**
 * Crea los muros
 * @class
 * @extends wall
 */
class wall extends inpedimentModel{
    /**
     * 
     * @param {ancho del muro} w 
     * @param {alto del muro} h 
     * @param {profundidad del muro} d 
     * @param {color del muro} c
     * @param {Velocidad del muro} 
     * @param {daño que causa el muro} damage 
     */
    constructor(w,h,d,c,s,damage){
        super(w,h,d,c,s);
        this.type = "inpediment";
        this.damage = damage;
    }
}