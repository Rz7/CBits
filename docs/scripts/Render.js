class Render {
    constructor(putMemberBtn, tableMembers) {
        this.putMemberBtn = putMemberBtn;
        this.tableMembers = tableMembers;
        this.init();
    }

    init() {
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
    }

    render(members) {
        this.renderTable(members);
        this.renderCharts(members);
    }

    renderTable(members) {
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

        this.renderTableHtml(members.concat([
            calculator.getTotal(members)
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

    renderCharts(members) {

        let pieChartData = [];
        let barChartData = [];

        for(let i in members) {
            pieChartData.push([
                members[i].name,
                members[i].tshare * 100.0
            ]);

            barChartData.push([
                members[i].name,
                +members[i].value
            ]);
        }

        charts.updateChart('pie', pieChartData);
        charts.updateChart('bar', barChartData);
    }

    updatePutBtn (isNewMember = false) {
        if(isNewMember)
            this.putMemberBtn.html('Add new member');
        else
            this.putMemberBtn.html('Update member');
    }
}