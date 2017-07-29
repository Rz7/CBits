class Members {
    constructor(putMemberBtn, selMemberBtn, calculateBtn, saveToDBBtn, tableMembers) {
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
            render.updatePutBtn(true);
        }

        // Render table
        render.render(this.members);

        // Reset form
        newMemberForm.reset();

        return false;
    }

    onSelectMember(obj) {
        let memberId = obj.attr("data-member-id");

        if(this.members[memberId]) {
            this.selectedMemberIndex = memberId;
            render.updatePutBtn();
            newMemberForm.setMemberData(this.members[memberId]);
        }

        return false;
    }

    onCalculateMember() {

        calculator.calculateMembers(this.members, this.extraMemberData);
        render.render(this.members);

        return false;
    }

    getAll() {
        connect.getAll().then((members) => {

            members = JSON.parse(members);

            for(let i in members)
                members[i] = JSON.parse(members[i].info);

            if(Array.isArray(members)) {
                this.members = members;
                render.render(this.members);
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
}