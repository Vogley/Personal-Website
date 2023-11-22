/* Data  For my input */
let skillData = {
  'Python': {
    bnymellon: 9
  },
  'APIs': {
    bnymellon: 8
  },
  'Data Automation': {
    bnymellon: 8
  },
  'JavaScript': {
    bnymellon: 7
  },
  'Front-End': {
    bnymellon: 7
  },
  'Machine Learning': {
    bnymellon: 7
  },
  'SQL': {
    bnymellon: 6
  },
  'Back-End': {
    bnymellon: 5
  },
  'Java': {
    bnymellon: 5
  },
  'Data Design': {
    bnymellon: 5
  },
  'Application Deployment': {
    bnymellon: 4
  },
  'Hardware': {
    bnymellon: 3
  },
}

// Setup
const labels = Object.keys(skillData);
const data = {
  labels: labels,
  datasets: [
    {
      label: 'BNY Mellon',
      data: Object.entries(skillData).map(e => e[1].bnymellon),
      borderColor: 'rgb(72,71, 71)',
      backgroundColor: 'rgba(72, 71, 71, 0.85)'
    }
  ]
};

// Config
const small_screen_config = {
  type: 'bar',
  data: data,
  options: {
    indexAxis: 'y',
    responsive: true,
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      }
    },
    responsive: true,
    aspectRatio: 0.75,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Computer Engineering Skills',
        color: '#000'
      },
    },
    scales:{
      x:{
        ticks:{
          color: '#000'
        }
      },
      y:{
        ticks:{
          color: '#000'
        }
      },
    }
  }
}

const large_screen_config = {
  type: 'bar',
  data: data,
  options: {
    responsive: true,
    indexAxis: 'x',
    aspectRatio: 2,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Computer Engineering Skills',
        color: '#000'
      },
    },
    scales:{
      x:{
        ticks:{
          color: '#000'
        }
      },
      y:{
        ticks:{
          color: '#000'
        }
      },
    }
  },
};

let config = {};
if($( window ).width() > 1000)
  Object.assign(config, large_screen_config);
else
 Object.assign(config, small_screen_config);


$(window).resize(function() {
  if($(window).width() < 1000){
    Object.assign(skillChart.config, small_screen_config);
    console.log(skillChart.config.options);
  }
  else{
    Object.assign(skillChart.config, large_screen_config);
    console.log(skillChart.config.options);
  }
  skillChart.update();
});

// Chart Activation
let ctx = document.getElementById("skill-chart").getContext("2d");
let	skillChart = new Chart(ctx, config);