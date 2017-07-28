class Connect {
    constructor(url) {
        this.url = url;
    }

    getAll() {
        return this.ajax("GET");
    }

    saveAll(data) {
        return this.ajax("POST", data);
    }

    ajax(method, data) {
        return $.ajax({
            url: this.url + '/' + method,
            type: method,
            data: JSON.stringify(data),
            contentType: "application/json"
        });
    }
}