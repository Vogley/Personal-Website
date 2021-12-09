/* Data  For my input */
let skillData = {
  'Java': {
    college: 4,
    career: 5
  }, 'Javascript': {
    college: 4,
    career: 7
  },
  'Python': {
    college: 2,
    career: 9
  },
  'SQL': {
    college: 1,
    career: 5
  },
  'Front-End': {
    college: 5,
    career: 7
  },
  'APIs': {
    college: 1,
    career: 8
  },
  'Back-End': {
    college: 2,
    career: 6
  },
  'Machine Learning': {
    college: 4,
    career: 7
  },
  'Data Design': {
    college: 1,
    career: 5
  },
  'Data Automation': {
    college: 4,
    career: 8
  },
  'Hardware': {
    college: 7,
    career: 3
  },
}

// Setup
const labels = Object.keys(skillData);
const data = {
  labels: labels,
  datasets: [
    {
      label: 'College',
      data: Object.entries(skillData).map(e => e[1].college),
      borderColor: 'rgb(61, 90, 128)',
      backgroundColor: 'rgba(61, 90, 128, 0.85)'
    },
    {
      label: 'Career',
      data: Object.entries(skillData).map(e => e[1].career),
      borderColor: 'rgb(238, 108, 77)',
      backgroundColor: 'rgba(238, 108, 77, 0.85)'
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
        position: 'right',
        labels:{
          color: '#000'
        }
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
        position: 'top',
        labels:{
          color: '#000'
        }
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