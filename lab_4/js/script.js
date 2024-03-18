$('#accordionEx').on('shown.bs.collapse', function (e) {
    $(e.target).prev('.card-header').find('.rotate-icon').addClass('fa-rotate-180');
});
  
$('#accordionEx').on('hidden.bs.collapse', function (e) {
    $(e.target).prev('.card-header').find('.rotate-icon').removeClass('fa-rotate-180');
});


// https://economymiddleeast.com/news/most-visited-cities-in-the-world/

function generateColors(dataLength, colors) {
    let resultColors = [];
    for (let i = 0; i < dataLength; i++) {
      resultColors.push(colors[i % colors.length]);
    }
    return resultColors;
}

const dataLength = 10;
const backgroundColors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
];
const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',

];

const dynamicBackgroundColors = generateColors(dataLength, backgroundColors);
const dynamicBorderColors = generateColors(dataLength, borderColors);

const ctx = document.getElementById('travelChart').getContext('2d');
const travelChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [
        'Hong Kong',
        'Bangkoka',
        'Londyn',
        'Singapur',
        'Makau',
        'Dubaj',
        'Paryż',
        'Nowy Jork',
        'Shenzhen',
        'Kuala Lumpur'
    ],
    datasets: [{
      label: 'Liczba turystów w milionach',
      data: [26.6, 21.2, 19.2, 16.6, 15.4, 14.9, 14.4, 12.7, 12.6, 12.3],
      backgroundColor: dynamicBackgroundColors,
      borderColor: dynamicBorderColors,
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});