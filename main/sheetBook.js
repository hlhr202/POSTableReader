import * as xlsx from 'xlsx'
import moment from 'moment'
import _ from 'lodash'

class SheetBook {
    constructor() {
        this.workbook;
        this.seriesCol = 'A';
        this.saleCol = 'I';
    }

    readFile(path) {
        this.workbook = xlsx.readFile(path)
    }

    getSheets() {
        if (this.workbook) {
            let sheetName = this.workbook.SheetNames[0];
            return this.workbook.Sheets[sheetName];
        }
    }

    getRange() {
        if (this.workbook) {
            return this.getSheets()['!range']['e'];
        }
    }

    getSeriesNo() {
        if (this.workbook) {
            let row = this.getRange()['r'];
            let seriesNo = [];
            for (let i = 2; i < row; i++) {
                let cellNo = this.seriesCol + i;
                let cell = this.getSheets()[cellNo];
                if (cell['v']) {
                    seriesNo.push({ cell: cellNo, row: i, value: cell['v'] });
                }
            }
            return seriesNo;
        }
    }

    getSales() {
        if (this.workbook) {
            let seriesNo = this.getSeriesNo();
            let sales = [];
            for (let i in seriesNo) {
                let cellNo = this.saleCol + seriesNo[i]['row'];
                let cell = this.getSheets()[cellNo];
                let sale = cell['v'];
                let no = seriesNo[i]['value'].slice(-4);
                sales.push({ no: no, sale: sale })
            }
            return sales;
        }
    }

    getSummery() {
        if (this.workbook) {
            let summery = {};
            let sales = this.getSales();
            let total = 0;
            sales.map((sale) => { total += parseFloat(sale.sale) })

            summery.count = sales.length
            summery.head = _.padStart(1, 4, 0)
            summery.tail = _.padStart(sales.length, 4, 0)
            summery.date = moment().format('YYYYMMDD')
            summery.gross = total
            summery.tax = (total / 1.07 * 0.07).toFixed(2)
            summery.net = total - summery.tax
            return summery;
        }
    }
}

export default SheetBook