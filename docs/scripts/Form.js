class Form {
    constructor(form, name, fshare, membercash, investorscash, hourlyrate, startdate, vesteddate, hours) {
        this.form = form;

        this.formData = {
            name: name,
            fshare: fshare,
            membercash: membercash,
            investorscash: investorscash,
            hourlyrate: hourlyrate,
            startdate: startdate,
            vesteddate: vesteddate,
            hours:  hours
        };

        this.reset();
    }

    reset() {
        for(let i in this.formData)
            this.formData[i].val("");
    }

    getMemberData() {

        let _get = {};

        for(let i in this.formData)
            _get[i] = this.formData[i].val();

        return _get;
    }

    setMemberData(memberInfo) {
        for(let i in this.formData) {
            this.formData[i].val(memberInfo[i]);
        }
    }

    onAddNewMember() {
        this.reset();
    }
}