const container = d3.select('.mainContainer')
    .append('svg')
    .attr('width',1000)
    .attr('height',1000);
    

db.collection('brandUser').get().then(res=>{

    var data = [];
    res.docs.forEach(doc => {
        data.push(doc.data())
    });

    console.log(data);

    const x = d3.scaleBand()
        .domain(data.map(item => item.brand))
        .range([0,800])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.user)])
        .range([270,0]);


    const graph = container.append('g')
        .attr('width', 500)
        .attr('height', 500)
        .attr('transform',`translate(70,70)`);

    const rects = graph.selectAll('rect')
        .data(data)
        .attr('width',x.bandwidth())
        .attr('height', d => 270-y(d.user))
        .attr('fill','crimson')
        .attr('y',function(d){return y(d.user)})
        .attr('x',function(d){return x(d.brand)});

    rects.enter()
        .append('rect')
        .attr('width',x.bandwidth())
        .attr('height', d => 270 - y(d.user))
        .attr('fill','crimson')
        .attr('y',function(d){return y(d.user)})
        .attr('x',function(d){return x(d.brand)});

        const xAxisGroup = graph.append('g')
            .attr('transform',`translate(0,270)`);
        const yAxisGroup = graph.append('g');
        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y)
            .ticks(10)
            .tickFormat(d => d + ` users`);
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);
        xAxisGroup.selectAll('text')
            .attr('transform','rotate(-40)')
            .attr('text-anchor','end')
            .attr('fill','crimson');

});

