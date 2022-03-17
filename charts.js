function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
        });
        buildMetadata(sampleNames[0]);
        buildCharts(sampleNames[0]);
  })
}
  
  init();
  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID: "+result.id);
      PANEL.append("h6").text("ETHNICITY: "+result.ethnicity);
      PANEL.append("h6").text("GENDER: "+result.gender);
      PANEL.append("h6").text("LOCATION: "+result.location);
      PANEL.append("h6").text("AGE: "+result.age);
      PANEL.append("h6").text("BBTYPE: "+result.bbtype);
      PANEL.append("h6").text("WFREQ: "+result.wfreq);
    });
  }
  // 1. Create the buildCharts function.
function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var samplesResultArray = samples.filter(sampleObj => sampleObj.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      var sample_values = samplesResultArray[0];
      console.log(sample_values )
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIds=sample_values.otu_ids;
      var otuLabels=sample_values.otu_labels;
      var sampleValues=sample_values.sample_values;
      console.log(otuIds);
      console.log(otuLabels);
      console.log(sampleValues);
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
       let topTenotuids = otuIds.slice(0, 10).reverse();
       let topTensampleValues=sampleValues.slice(0,10).reverse();
       let topTenotuLabels=otuLabels.slice(0,10).reverse();
       console.log(topTenotuids);
       console.log(topTenotuLabels);
       console.log(topTensampleValues);
       var trace1 = {
        x:topTensampleValues,
        y: topTenotuids.map(object => `OTU ${object}`),
        text:topTenotuLabels,
        type: "bar",
        orientation: "h"
      };
      
  
       
  
      // 8. Create the trace for the bar chart. 
      var barData = [trace1];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title:"Top 10 Bacteria cultures",
        xaxis: { title: "Bacteria Sample Values" },
        yaxis: { title: "OTU IDs" },
        autosize: false,
		width: 600,
		height: 800,
        paper_bgcolor:'ghostwhite',
        plot_bgcolor:"rgb(242, 247, 249)"
        };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var trace2 = {
        x:otuIds,
        y:sampleValues,
        text:otuLabels,
        mode: 'markers',
        marker: {
            colorscale: [[0,'mediumblue'],[.25,'greenyellow'],[.5,'saddlebrown'],[1,'tan']],
            color: otuIds,
            size: sampleValues
        }
        };
    var bubbleData = [trace2];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
    title: 'Bacteria Cultures per Sample',
    xaxis:{ title: "OTU IDs" },
    showlegend: false,
    height: 600,
    width: 1000,
    paper_bgcolor:'ghostwhite',
    plot_bgcolor:"rgb(242, 247, 249)"
   };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout);

    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var WFREQ =result.wfreq
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: WFREQ,
            title: {text: "Scrubs per Week"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                bar: {color: 'black'},
                axis: { range: [null, 10] },
                
                steps: [
                    { range: [0, 2], color: 'red' },
                    { range: [2, 4], color: 'darkorange' },
                    { range: [4, 6], color: 'yellow' },
                    { range: [6, 8], color: 'yellowgreen' },
                    { range: [8,10], color: 'green' }
                ]}
        }
    ];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } , paper_bgcolor:"rgb(242, 247, 249)"};
    Plotly.newPlot('gauge', data, layout);
  });
}

  
  