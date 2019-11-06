import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart } from "chart.js";

type DoughnutChartProps = {
  votesForDoughnut: Array<number>;
};

const DoughnutChart: React.SFC<DoughnutChartProps> = props => {
  const valuesForAverageLegislator = [200, 54, 8, 98];

  const data = {
    labels: ["Afirmativos", "Negativos", "Abstenciones", "Ausencias"],
    datasets: [
      {
        data: props.votesForDoughnut,
        backgroundColor: ["#a3be8c", "#bf616a", "#ebcb8b", "#8fbcbb"],
        hoverBackgroundColor: ["#719353", "#7f343b", "#da9e25", "#b48ead"],
        label: "activeLegislatorVotes"
      },
      {
        data: valuesForAverageLegislator,
        backgroundColor: ["#a3be8c", "#bf616a", "#ebcb8b", "#8fbcbb"],
        hoverBackgroundColor: ["#719353", "#7f343b", "#da9e25", "#b48ead"],
        label: "averageLegislatorVotes"
      }
    ],
    text: "Votos"
  };

  return (
    <div className="doughnut-container">
      <Doughnut
        data={data}
        height={250}
        options={{
          maintainAspectRatio: false,
          plugins: {
            datalabels: {
              display: true,
              color: "black"
            }
          },
          tooltips: {
            yAlign: "top"
          }
        }}
        legend={{ display: false }}
      />
    </div>
  );
};

const originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
  draw: function() {
    originalDoughnutDraw.apply(this, arguments);

    const chart = this.chart.chart;
    const ctx = chart.ctx;
    const width = chart.width;
    const height = chart.height;

    const fontSize = 13;
    ctx.font = fontSize + "px Arial";
    ctx.textBaseline = "middle";

    const text = chart.config.data.text,
      textX = Math.round((width - ctx.measureText(text).width) / 2),
      textY = height / 2;

    ctx.fillText(text, textX, textY);
  }
});

export default DoughnutChart;
