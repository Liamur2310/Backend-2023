//contieen las operaciones de acceso a datos para los carritos

import * as fs from 'fs';

class CartsDao {
    constructor(path) {
        this.path = path;
    }

    async saveFile(carts) {
        try {
            fs.writeFileSync(this.path, JSON.stringify(carts, null, '\t'));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async readFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export default CartsDao;
