/**
 * Crea latas de gasolina
 * @class
 * @extends inpediment
 */
class fuelCan extends inpediment{
    /**
     * Constructor
     * @param {ancho de la lata} w 
     * @param {alto de la lata} h 
     * @param {profundidad de la lata} d 
     * @param {litros que contiene la lata} litres 
     */
    constructor(w,h,d,litres){
        super(w,h,d);
        this.mesh.name="oil";
        this.litres =  litres;
    }
}