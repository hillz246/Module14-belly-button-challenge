// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number [0] to get first element in array
    const metadata_filtered = metadata.filter(each => each.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const sample_metadata_element = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    sample_metadata_element.html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    //Object.entries takes an oject and returns array of key value pairs. then
    //foreach iterates and [key,value] deconstructs the 2 elements inside each array in foreach loop
    Object.entries(metadata_filtered).forEach(
      ([key, value]) => {
        sample_metadata_element.append('p').text(`${key.toUpperCase()}: ${value}`);
      }
    );
  });
}


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const samples_filtered = samples.filter(each => parseInt(each.id) === parseInt(sample))[0]; //[0] to access first element in array


    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = samples_filtered.otu_ids;
    const otu_labels = samples_filtered.otu_labels;
    const sample_values = samples_filtered.sample_values;

    // Build a Bubble Chart
    //trace
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,   // Size of bubbles based on sample_values
        color: otu_ids,        // Color of bubbles based on otu_ids
        colorscale: 'Earth'//Color scale for the bubbles
      }
    }

        // Create the layout for the chart
    let layout = {
      title: {
        text: `Bacteria Cultures Per Sample (${sample})`,
        font: {
          size: 24,
          family: 'Arial, sans-serif'
        }
      },
      xaxis: {
        title: {
          text: 'OTU IDs',
          font: {
            size: 16,
            color: 'gray'
          }
        },
        tickfont: {
          size: 14,
          color: 'gray'
        }
      },
      yaxis: {
        title: {
          text: 'Number of Bacteria',
          font: {
            size: 16,
            color: 'gray'
          }
        },
        tickfont: {
          size: 14,
          color: 'gray'
        }
      }
    };


    // Combine trace into a data array
    let plot_data = [trace1];


    let config = { responsive: true };


    // Render the Bubble Chart
    Plotly.newPlot('bubble', plot_data, layout, config);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    const yticks = otu_ids.map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace1_bar = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      hoverinfo: "x+y+text",
      type: "bar",
      orientation: "h",
      marker: {
        color: sample_values.slice(0, 10).reverse(),
        colorscale: "Earth"
      }
    };

    let data_bar = [trace1_bar];

    let layout_bar = {
      title: {
        text: `Top 10 Bacteria Cultures Found in Sample ${sample}`,
        font: {
          size: 24,
          family: 'Arial, sans-serif'
        }
      },
      xaxis: {
        title: {
          text: 'Number of Bacteria',
          font: {
            size: 16,
            color: 'gray'
          }
        },
        tickfont: {
          size: 14,
          color: 'gray'
        }
      },
      yaxis: {
        title: {
          font: {
            size: 16,
            color: 'gray'
          }
        },
        tickfont: {
          size: 14,
          color: 'gray'
        }
      }
    };



    // Render the Bar Chart
    Plotly.newPlot("bar", data_bar, layout_bar, config);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const select_element = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    if (Array.isArray(names)) { //Make sure names is an array before looping through it
      names.forEach(name => {
        select_element.append('option').text(name).property('value', name);
      });
    }

    // Get the first sample from the list
    //dynamically generated elements cant be targeted with .select()
    //use node() on d3 selection object to access native DOM node directly then use .value because first option is selected by default
    const first_sample = select_element.node().value;

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    buildCharts(first_sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  //if positive number - prevents change event that is triggered in init() from returning window object as 'this' in event listener
  if (parseInt(newSample) > 0) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }
}
//event listener
d3.select('#selDataset').on('change', optionChanged(this));

// Initialize the dashboard
init();
