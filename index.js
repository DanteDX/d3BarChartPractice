const container = d3.select('.mainContainer')
    .append('svg')
    .attr('width',1000)
    .attr('height',1000);

    const graph = container.append('g')
    .attr('width', 500)
    .attr('height', 500)
    .attr('transform',`translate(70,70)`);

    const x = d3.scaleBand()
    .range([0,800])
    .paddingInner(0.2)
    .paddingOuter(0.2);

    const y = d3.scaleLinear()
    .range([270,0]);

    const xAxisGroup = graph.append('g')
            .attr('transform',`translate(0,270)`);
        const yAxisGroup = graph.append('g');
        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y)
            .ticks(10)
            .tickFormat(d => d + ` users`);

            xAxisGroup.selectAll('text')
            .attr('transform','rotate(-40)')
            .attr('text-anchor','end')
            .attr('fill','crimson');


    

const t = d3.transition().duration(400);

const widthTween = d => {
    let i = d3.interpolate(0,x.bandwidth());

    return function(t){
        return i(t);
    }
};

const update = data => {
    y.domain([0, d3.max(data, d=>d.user)]);
    x.domain(data.map(item => item.brand));


    
    const rects = graph.selectAll('rect')
        .data(data);

    rects.exit().remove();

    rects.attr('width',x.bandwidth())
        .attr('fill','crimson')
        .attr('x',function(d){return x(d.brand)});
        // .transition().duration(700)
        //     .attr('y',function(d){return y(d.user)})
        //     .attr('height', d => 270-y(d.user));

    rects.enter()
        .append('rect')
        // .attr('width',x.bandwidth())
        .attr('fill','crimson')
        .attr('x',function(d){return x(d.brand)})
        .attr('height',0)
        .attr('y',270)
        .merge(rects)
        .transition(t)
            .attrTween('width',widthTween)
            .attr('height', d => 270 - y(d.user))
            .attr('y',function(d){return y(d.user)});

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);


}
    
var data = [];
db.collection('brandUser').onSnapshot(res=>{
    res.docChanges().forEach(change => {
        console.log(change.type);
        const doc = {...change.doc.data(), id: change.doc.id};

        switch(change.type){
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }
    });
    update(data);
})

// db.collection('brandUser').get().then(res=>{


//     var data = [];
//     res.docs.forEach(doc => {
//         data.push(doc.data())
//     });
//     console.log(data);


//     update(data);

//     d3.interval(()=>{
//         data.pop();
//         update(data);
//     },1000);
      
// });

