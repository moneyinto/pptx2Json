import JSZip from "jszip";
import X2JS from "x2js";
import { IChart, IGraphicFrame, IPT, IRelationship, ISer } from "./types";
import { IPPTChartElement } from "./types/element";
import { EMU2PIX, createRandomCode } from "./util";

export default class GraphicFrame {
    private _graphicFrames: IGraphicFrame[];
    private _relationships: IRelationship[];
    private _zip: JSZip;
    private _x2js: X2JS;
    constructor(graphicFrame: IGraphicFrame | IGraphicFrame[], relationships: IRelationship[], zip: JSZip, x2js: X2JS) {
        this._relationships = relationships;
        this._zip = zip;
        this._x2js = x2js;
        const isArray = graphicFrame instanceof Array;
        if (!isArray) {
            this._graphicFrames = [graphicFrame];
        } else {
            this._graphicFrames = graphicFrame;
        }
    }

    dealSeries(sers: ISer[]) {
        let labels: string[] = [];
        const legends: string[] = [];
        const series: number[][] = [];
        for (const ser of sers) {
            labels = (ser.cat.strRef.strCache.pt as IPT[]).map(p => p.v.__text);
            legends.push((ser.tx.strRef.strCache.pt as IPT).v.__text);
            series.push(ser.val.numRef.numCache.pt.map(p => +p.v.__text));
        }
        return { labels, legends, series };
    }

    async getGraphicFrames() {
        const elements: IPPTChartElement[] = [];
        for (const graphicFrame of this._graphicFrames) {
            if (graphicFrame.graphic.graphicData.chart) {
                // 图表
                const chart = graphicFrame.graphic.graphicData.chart;
                const chartXMLId = chart["_r:id"];
                const relationship = this._relationships.find(r => r._Id === chartXMLId);
                const xmlSrc = relationship?._Target.replace("..", "ppt") || "";
                const res = await this._zip.file(xmlSrc)!.async("string");
                const json: IChart = this._x2js.xml2js(res);
                const xfrm = graphicFrame.xfrm;

                const chartElement: IPPTChartElement = {
                    id: createRandomCode(),
                    originId: graphicFrame.nvGraphicFramePr.cNvPr._id,
                    fixedRatio: false,
                    left: EMU2PIX(xfrm.off._x),
                    top: EMU2PIX(xfrm.off._y),
                    width: EMU2PIX(xfrm.ext._cx),
                    height: EMU2PIX(xfrm.ext._cy),
                    type: "chart",
                    chartType: "bar",
                    axisTransformation: false,
                    src: "",
                    streach: 0,
                    name: graphicFrame.nvGraphicFramePr.cNvPr._name,
                    rotate: Math.floor(+(xfrm._rot || "0") / 60000),
                    data: {
                        labels: [],
                        legends: [],
                        series: []
                    }
                };

                if (json.chartSpace.chart.plotArea.barChart) {
                    const barChart = json.chartSpace.chart.plotArea.barChart;
                    chartElement.chartType = "bar";
                    const data = this.dealSeries(barChart.ser as ISer[]);
                    chartElement.axisTransformation = barChart.barDir._val === "bar";
                    chartElement.data = data;
                }

                if (json.chartSpace.chart.plotArea.lineChart) {
                    const lineChart = json.chartSpace.chart.plotArea.lineChart;
                    chartElement.chartType = "line";
                    const data = this.dealSeries(lineChart.ser as ISer[]);
                    chartElement.data = data;
                }

                if (json.chartSpace.chart.plotArea.pieChart) {
                    const pieChart = json.chartSpace.chart.plotArea.pieChart;
                    chartElement.chartType = "pie";
                    const data = this.dealSeries([pieChart.ser as ISer]);
                    chartElement.data = data;
                }

                elements.push(chartElement);
            }

            if (graphicFrame.graphic.graphicData.tbl) {
                // 表格
            }
        }

        return elements;
    }
}