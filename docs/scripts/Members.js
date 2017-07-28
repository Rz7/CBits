class Members {
    constructor(form, putMemberBtn, selMemberBtn, calculateBtn, saveToDBBtn, tableMembers) {
        this.form = form;
        this.putMemberBtn = putMemberBtn;
        this.selMemberBtn = selMemberBtn;
        this.calculateBtn = calculateBtn;
        this.saveToDBBtn = saveToDBBtn;
        this.tableMembers = tableMembers;
        this.init();
        return this;
    }

    init() {
        this.members = [];
        this.selectedMemberIndex = -1;

        this.orderMemberData = {
            name: true,
            fshare: true,
            membercash: true,
            investorscash: true,
            hourlyrate: true,
            startdate: true,
            vesteddate: true,
            hours: true,
            noncash: true,
            value: true,
            vshare: true,
            tshare: true,
            shares: true,
            days: true
        };

        this.extraMemberData = {
            noncash: "-",
            value: "-",
            vshare: "-",
            tshare: "-",
            shares: "-",
            days: "-"
        };

        this.events();
    }

    events() {
        let self = this;

        this.saveToDBBtn.on('click', this.saveAll.bind(this));
        this.putMemberBtn.on('click', this.onPutMember.bind(this));
        this.calculateBtn.on('click', this.onCalculateMember.bind(this));
        this.tableMembers.on("click", this.selMemberBtn, function() { return self.onSelectMember($(this)); });
    }

    onPutMember() {
        let putMemberData = newMemberForm.getMemberData();

        if(this.selectedMemberIndex === -1) {
            // Add new user
            this.members.push(
                $.extend(
                    {},
                    putMemberData,
                    this.extraMemberData
                )
            );
        }
        else {
            // Update the user
            for(let i in putMemberData) {
                this.members[this.selectedMemberIndex][i] = putMemberData[i];
            }

            for(let i in this.extraMemberData)
                this.members[this.selectedMemberIndex][i] = this.extraMemberData[i];

            // Remove selected index
            this.selectedMemberIndex = -1;
            this.updatePutBtn();
        }

        // Render table
        this.render();

        // Reset form
        newMemberForm.reset();

        return false;
    }

    onSelectMember(obj) {
        let memberId = obj.attr("data-member-id");

        if(this.members[memberId]) {
            this.selectedMemberIndex = memberId;
            this.updatePutBtn();
            newMemberForm.setMemberData(this.members[memberId]);
        }

        return false;
    }

    onCalculateMember() {

        calculator.calculateMembers(this.members, this.extraMemberData);
        this.render();

        return false;
    }

    getAll() {
        connect.getAll().then((members) => {

            members = JSON.parse(members);

            for(let i in members)
                members[i] = JSON.parse(members[i].info);

            if(Array.isArray(members)) {
                this.members = members;
                this.render();
            }
        });
    }

    saveAll() {
        connect.saveAll(this.members).then((resultCode) => {
            if(resultCode === '200')
                alert('Successfully saved');
            else
                alert('There has been an error');
        });
        return false;
    }

    updatePutBtn () {
        if(this.selectedMemberIndex === -1)
            this.putMemberBtn.html('Add new member');
        else
            this.putMemberBtn.html('Update member');
    }

    render() {
        this.renderTable();
        this.renderCharts();
    }

    renderTable() {
        this.tableMembers.html(`
            <tr>
                <th>Name</th>
                <th>Fix. share</th>
                <th>M cash</th>
                <th>I cash</th>
                <th>$ hourly</th>
                <th>Start</th>
                <th>Vested</th>
                <th>Hours</th>
                <th>Non cash</th>
                <th>$value</th>
                <th>Var. share</th>
                <th>% t. share</th>                
                <th>#shares</th>
                <th>Days</th>
            </tr>
        `);

        this.renderTableHtml(this.members.concat([
            calculator.getTotal(this.members)
        ]));
    }

    renderTableHtml(members) {
        for(let i in members) {

            let block = "";
            for(let j in this.orderMemberData)
                if(this.orderMemberData[j])
                    block += `<td>${members[i][j]}</td>`;

            this.tableMembers.append(`<tr class="selectable" data-member-id=${i}>${block}</tr>`);
        }
    }

    renderCharts() {

        let pieChartData = [];
        let barChartData = [];

        console.log(this.members);

        for(let i in this.members) {
            pieChartData.push([
                this.members[i].name,
                this.members[i].tshare * 100.0
            ]);

            barChartData.push([
                this.members[i].name,
                this.members[i].value
            ]);
        }

        charts.updateChart('pie', pieChartData);
        charts.updateChart('bar', barChartData);
    }
}