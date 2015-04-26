<!-- for the histogram -->

var chart = c3.generate({
	bindto: '#histo',
	size: {
        height: 600,
        width: 650
    },
    data: {
		x: 'Medicare hospital spending per patient',
        columns: [
			['Medicare hospital spending per patient',10000,11000,12000,13000,14000,15000,16000,17000,18000,19000,20000,21000,22000,23000,24000,25000,26000,27000,28000,29000,30000,31000],
            ['low efficiency',0,0,1,3,7,11,47,180,266,225,112,36,13,2,8,0,0,0,0,0,0,0],
			['medium efficiency',1,0,1,1,2,8,24,52,121,84,28,10,1,1,0,1,0,0,0,0,0,0],
			['high efficiency',1,2,7,7,13,46,131,380,647,448,207,49,15,10,4,3,1,2,1,0,0,2]
        ],
        type: 'bar',
		colors: {
            'low efficiency': '#f5a900',
            'medium efficiency': '#c9bc00',
			'high efficiency': '#92D400'
        },
        groups: [
            ['low efficiency', 'medium efficiency','high efficiency']
        ]
    },
	axis: {
		x: {
			max: 35000,
			label: {
       			text: 'Hospital spending / patient ($)',
    		},
		},
		y: {
			max: 1250,
			label: {
       			text: 'Hospital Count',
    		},
		}
	},
    grid: {
		x: {
			lines: [{value: 17988, text: 'Average'},
                {value: 18347, text: 'Highest 1/3', position: 'middle'},
                {value: 17088, text: 'Lowest 1/3', position: 'middle'}]
		}
    }
});

setTimeout(function () {
    chart.groups([['low efficiency', 'medium efficiency','high efficiency']])
}, 100);

<!-- for the scatter plot --> 

var chart = c3.generate({
	bindto: '#scatter',
	size: {
        height: 550,
        width: 650
    },
    data: {
		url: '/data/c3_test.csv',
		type: 'scatter',
        xs: {
            highEffoutcome: 'highEffspending',
            mediumEffoutcome: 'mediumEffspending',
			lowEffoutcome: 'lowEffspending'
        },
        // iris data from R
        /*columns: [
            ["setosa_x", 3.5, 3.0, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3.0, 3.0, 4.0, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3.0, 3.4, 3.5, 3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3.0, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3.0, 3.8, 3.2, 3.7, 3.3],
            ["versicolor_x", 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2.0, 3.0, 2.2, 2.9, 2.9, 3.1, 3.0, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3.0, 2.8, 3.0, 2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3.0, 3.4, 3.1, 2.3, 3.0, 2.5, 2.6, 3.0, 2.6, 2.3, 2.7, 3.0, 2.9, 2.9, 2.5, 2.8],
            ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
            ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
        ],*/
        
		colors: {
            highEffoutcome: '#ff0000',
            mediumEffoutcome: '#00ff00',
            //lowEffoutcome: '#0000ff',
			lowEffoutcome: '#92D400'
        },
    },
    axis: {
        x: {
            label: 'Hospital Spending',
            tick: {
                fit: false
            }
        },
        y: {
            label: 'Medicare Outcome'
        }
    }
});

setTimeout(function () {
    chart.load({
        url: 'scatter.csv'
    });
}, 1000);

