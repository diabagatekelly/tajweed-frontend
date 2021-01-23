import { Injectable } from '@angular/core';

import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class D3Service {
 
  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line; // this is line defination
  


  constructor(private datePipe: DatePipe) {
     // configure margins and width/height of the graph
     this.width = 900 - this.margin.left - this.margin.right;
     this.height = 500 - this.margin.top - this.margin.bottom;
   }


   

   buildSvg(rule) {

  this.svg = d3.select(`svg#${rule}`)
      .append('g')
      .attr("viewBox", [0, 0, this.width, this.height]);
      // .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
      
  }

    
  addXandYAxis(data) {

    // range of data configuring
    // this.x = d3Scale.scaleTime().range([0, this.width]);
    this.x =  d3.scaleUtc().range([this.margin.left, this.width - this.margin.right])
    // this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.y =  d3.scaleLinear().range([this.height - this.margin.bottom, this.margin.top])
    // this.x.domain(d3Array.extent(data, (d) => d.date ));
    this.x.domain(d3.extent(data, d => d.date))
    // this.y.domain(d3Array.extent(data, (d) => d.value ));
    this.y.domain([0, d3.max(data, d => d.value)]).nice()
    
    
    // Configure the X Axis
    this.svg.append('g')
        // .attr('transform', 'translate(0,' + this.height + ')')
        // .call(d3Axis.axisBottom(this.x));
        .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
        .call(d3.axisBottom(this.x).ticks(this.width / 80).tickSizeOuter(0))
    this.svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", this.width - this.width/2)
        .attr("y", this.height + 20)
        .text("Date");
            
        
    // Configure the Y Axis
    this.svg.append('g')
        // .attr('class', 'axis axis--y')
        // .call(d3Axis.axisLeft(this.y));
        .attr("transform", `translate(${this.margin.left},0)`)
        .call(d3.axisLeft(this.y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("font-weight", "bold")
            .attr("transform", "rotate(-90)")
            .attr("font-size", "1rem")
            .attr("y", -45)
            .text('% Mastery'))

  }
   

  drawLineAndPath(data) {
    // this.line = d3Shape.line()
    //     .x( (d: any) => this.x(d.date) )
    //     .y( (d: any) => this.y(d.value) );
    this.line = d3.line()
    .x(d => this.x(d.date))
    .y(d => this.y(d.value))
    // Configuring line path
    this.svg.append('path')
        // .datum(data)
        // .attr('class', 'line')
        // .attr('d', this.line);
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", this.line);


        this.svg.append("g").selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => this.x(d.date))
        .attr("y", d => this.y(d.value))
        .attr("fill", "red")
        .text(d => `${d.value}%`);
  }
}
     