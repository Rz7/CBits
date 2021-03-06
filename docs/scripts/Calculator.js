class Calculator {
    constructor() {
        this.total = {};

        this.exclude = {
            'name': true,
            'startdate': false,
            'vesteddate': false
        };
    }

    calculateMembers(members, calculateParams) {
        for(let j in calculateParams) {
            for(let i in members) {
                let member = members[i];

                switch (j) {
                    case "noncash":
                        member[j] = this.getFloat(member["hourlyrate"]) * this.getFloat(member["hours"]);
                        break;

                    case "value":
                        member[j] = this.getFloat(member["noncash"]) + this.getFloat(member["membercash"]) * 4.0;
                        break;

                    case "vshare":
                        this.getTotal(members);

                        let value_d = (this.getFloat(member["value"]) / this.getFloat(this.total["value"])) * 100.0;
                        let fshare_d = (1.0 - this.getFloat(this.total["fshare"]) / 100.0);

                        member[j] = value_d * fshare_d;
                        break;

                    case "tshare":
                        member[j] = this.getFloat(member["vshare"]) + this.getFloat(member["fshare"]);
                        break;

                    case "shares":
                        this.getTotal(members);
                        member[j] = this.getFloat(this.total["shares"]) * (this.getFloat(member["vshare"]) + this.getFloat(member["fshare"])) / 100.0;
                        break;

                    case "days":
                        member[j] = moment().diff(moment(member["startdate"], "MM/DD/YYYY"), 'days')+1;
                        break;
                }

                member[j] = member[j].toFixed(2);
            }
        }
    }

    getTotal(members) {
        this.total = {
            name: 'Total',
            fshare: 0.0,
            membercash: 0.0,
            investorscash: 0.0,
            hourlyrate: 0.0,
            startdate: '',
            vesteddate: '',
            hours: 0,
            noncash: 0.0,
            value: 0.0,
            vshare: 0.0,
            tshare: 0.0,
            shares: 0.0,
            days: 0
        };

        if( ! members || members.length === 0)
            return this.total;

        for(let i in members) {
            for(let j in members[i]) {

                if( this.exclude[j] === false) {
                    this.total[j] = '';
                    continue;
                }

                if( this.exclude[j] === true) {
                    continue;
                }

                if( ! this.total[j])
                    this.total[j] = 0.0;

                this.total[j] += this.getFloat(members[i][j]);
                this.total[j] = +this.total[j].toFixed(2);
            }
        }

        this.total["shares"] = this.getFloat($('#total-shares').val(), 10000);

        return this.total;
    }

    getFloat(n, _def = 0.0) {

        n = parseFloat(n);

        if (isNaN(n))
            n = _def;

        return n;
    }
}