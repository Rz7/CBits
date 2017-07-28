window.connect = new Connect(
  'http://localhost:4545'
);

window.charts = new Charts();

window.calculator = new Calculator();

window.newMemberForm = new Form(
    $('#new-member-form'),
    $('#new-member-form').find("#name"),
    $('#new-member-form').find("#f-share"),
    $('#new-member-form').find("#member-cash"),
    $('#new-member-form').find("#investors-cash"),
    $('#new-member-form').find("#hourly-rate-dollar"),
    $('#new-member-form').find("#start-date"),
    $('#new-member-form').find("#vested-date"),
    $('#new-member-form').find("#hours")
);

window.membersManager = new Members(
    $('#new-member-form'),
    $('#add-new-member'),
    '.selectable',
    $('#calculate'),
    $('#save-to-db'),
    $('#table-members')
).getAll();