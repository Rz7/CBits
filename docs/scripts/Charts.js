class Charts {
    constructor() {
        google.charts.load('current', {packages: ['corechart', 'bar']});

        this.pieChartData = null;
        this.barChartData = null;
    }

    updateChart(type, data) {
        switch(type)
        {
            case 'pie':
                this.pieChartData = [
                    ['Members', 'Equity split in %'],
                ].concat(data);
                break;
            case 'bar':
                this.barChartData = [
                    ['Member', 'Equity in $',],
                ].concat(data);
                break;
        }

        this.loadCharts();
    }

    loadCharts() {
        google.charts.setOnLoadCallback(this.getBarChart.bind(this));
        google.charts.setOnLoadCallback(this.getPieChart.bind(this));
    }

    getBarChart() {

        let data = google.visualization.arrayToDataTable(this.barChartData);

        let options = {
            title: 'Equity split',
            chartArea: {width: '50%'},
            hAxis: {
                title: '',
                minValue: 0
            },
            vAxis: {
                title: 'Members'
            }
        };

        let chart = new google.visualization.BarChart(document.getElementById('bar-chart'));
        chart.draw(data, options);
    }

    getPieChart() {

        let data = google.visualization.arrayToDataTable(this.pieChartData);

        let options = {
            title: 'Equity split'
        };

        let chart = new google.visualization.PieChart(document.getElementById('pie-chart'));
        chart.draw(data, options);
    }
}