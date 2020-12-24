//Declare VARIABLES
const w = 800
const h = 480
const padding = 60
const minutesFormat = d3.timeFormat("%M:%S")
const link = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

//Declare SVG
const svg = d3.select('body')
            .append('svg')
            .attr('width', w)
            .attr('height', h)
            .attr('preserveAspectRatio', 'xMidYMid meet')

//Declare the TOOLTIP
var tooltip = d3.select("body")
            .append("div")
            .attr('id', 'tooltip')      
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style('background-color', "lightgrey")
            .style('border-radius', '12px')
            .style('padding', '5px 10px')
            .style('font-size', '12px')
             
////////////Declare the Text////////////
//Title
svg.append("text")
  .attr('id', 'title')
  .attr('x', w / 2)
  .attr('y', h / 15)
  .attr("text-anchor", "middle")
  .style("font-size", "20px") 
  .text("Doping in Professional Bicycle Racing")

//Key
svg.append('text')
  .attr('id', 'legend')
  .attr('x', w / 1.33)
  .attr('y', h / 7.5)
  .text('Key')
  .style("font-size", "12px")

//Legend line
svg.append('line')
  .attr('x1', w / 1.33)
  .attr('y1', h / 7.05)
  .attr('x2', w / 1.025)
  .attr('y2', h / 7.05)
  .attr('stroke', 'black')

//Red Square
svg.append('rect')
  .attr('x', w / 1.33)
  .attr('y', h / 6.66)
  .attr('height', 20)
  .attr('width', 25)
  .attr('fill', 'red')

//Red Text
svg.append('text')
  .attr('x', w / 1.26)
  .attr('y', h / 5.71)
  .text('Riders with doping allegations')
  .style("font-size", "10px")

//Blue Square
svg.append('rect')
  .attr('x', w / 1.33)
  .attr('y', h / 5)
  .attr('height', 20)
  .attr('width', 25)
  .attr('fill', 'blue')

//Blue Text
svg.append('text')
  .attr('x', w / 1.26)
  .attr('y', h / 4.44)
  .text('No doping allegations')
  .style("font-size", "10px")

////////////Elaborate the Data////////////
d3.json(link).then(function(d){

  //Format the MINUTES
  d.forEach(function(x){
    var min = x.Time.slice(0,2)
    var sec = x.Time.slice(3, 5)
    x.Time = new Date(Date.UTC(1970, 0, 1, 0, min, sec))
  })
  
  //Declare Scales
  const xScale = d3
                .scaleLinear()
                .domain([
                  d3.min(d, (d) => d.Year - 1), 
                  d3.max(d, (d) => d.Year + 1)])
                .range([padding, w - padding])
                
  const yScale = d3
                .scaleTime()
                .domain([
                  d3.min(d, (d) => d.Time), 
                  d3.max(d, (d) => d.Time)])
                .range([padding, h - padding])
                
  //Create Circles
  svg.selectAll('circle')
      .data(d)
      .enter()
      .append('circle')
      .attr('data-xvalue', (d) => d.Year)
      .attr('data-yvalue', (d) => d.Time)
      .attr('cx', (d) => xScale(d.Year))
      .attr('cy', (d) => yScale(d.Time))
      .attr('r', (d) => 5)
      .attr('class', 'dot')
      .attr('fill', (d) => { return (d.Doping === '') ? 'blue' : 'red' })
      .on("mouseover", function(d){
        return tooltip
          .style("visibility", "visible")
          .html(d.Name + ': ' + d.Nationality + '<br/>' + 'Year: ' + d.Year + ', Time: ' + minutesFormat(d.Time) + '<br/><br/>' + d.Doping )
          .attr('data-year', d.Year)
        })
      .on("mousemove", function(event, d){
        return tooltip
          .style("top", (d3.event.pageY-10) +"px")
          .style("left", (d3.event.pageX+10) +"px")
        })
      .on("mouseout", function(){
        return tooltip
          .style("visibility", "hidden")
        })

  //Create Axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))
  const yAxis = d3.axisLeft(yScale).tickFormat(d => { return minutesFormat(d) })

  svg.append('g')
    .attr('transform', 'translate(0, ' + (h - padding) + ')')
    .attr('id', 'x-axis')
    .call(xAxis)
  
  svg.append('g')
    .attr('transform', 'translate(' + (padding) + ', 0)')
    .attr('id', 'y-axis')
    .call(yAxis)   
})