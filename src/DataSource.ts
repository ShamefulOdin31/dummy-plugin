import { QueryResponse } from './types';
import { Observable, merge, of} from 'rxjs';
import { delay } from 'rxjs/operators';
import { NodeGraphDataFrameFieldNames } from '@grafana/ui';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldColorModeId,
  FieldType,
  MutableDataFrame,
  ArrayVector,
  DataFrame
 // toDataFrame,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  query(options: DataQueryRequest<MyQuery>): Observable<DataQueryResponse> {
    const streams: Array<Observable<DataQueryResponse>> = [];

    for(const target of options.targets){
      if(target.hide){
        continue;
      }

      switch(target.constant){
        case 1:
          streams.push(this.nodegraph_test(target, options));
          break;
        case 2:
          streams.push(this.dataframes_test(target, options));
          break;
        case 3:
          streams.push(this.topology_test(target, options));
          break;
      }
    }
    return merge(...streams)
  }

  topology_test(target: MyQuery, options: DataQueryRequest<MyQuery>): any{
    const data: QueryResponse[] = [
      {
        columns: [
            { type: "time", text: "Time" },
            { text: "app" },
            { text: "target_app" },
            { text: "req_rate" },
            { text: "resp_time" },
            { text: "error_rate" }
        ],
        refId: undefined,
        meta: undefined,
        rows: [
            [0, "service a", "service b", 50, 4000, 5],
            [0, "service a", "service c", 75, 13650, 0],
            [0, "service c", "service d", 25, 750, 1]
        ]
      }
    ]
    return { data };
  }

  dataframes_test(target: MyQuery, options: DataQueryRequest<MyQuery>): Observable<DataQueryResponse>{
    var timeValues :any
    var actualValues :any

    timeValues = [1613368800000, 1613412000000, 1613455200000]
    actualValues = ["true", "false", 'true'];

    const frame = new MutableDataFrame({
      refId: options.targets[0].refId,
      fields: [
        { name: "Time", type: FieldType.time },
        { name: "Values", type: FieldType.string },
      ],
    });
    for(let i = 0; i < timeValues.length; i++){
      frame.appendRow([timeValues[i], actualValues[i]])
    }
    console.log(frame)
    return of({ data: [frame] }).pipe(delay(100));
  }

  nodegraph_test(target: MyQuery, options: DataQueryRequest<MyQuery>): Observable<DataQueryResponse> {
    let frames: DataFrame[];
    const count = 10;
    const nodes = [];

    // Creates the root node.
    const root = {
      id: '0',
      title: 'root',
      subTitle: 'client',
      success: 1,
      error: 0,
      stat1: 1,
      stat2: 0,
      edges: [] as any[],
    };

    // Adds the root node to the nodes array.
    nodes.push(root);

    // Used for the randomized edges
    const nodesWithoutMaxEdges = [root];
    const maxEdges = 3;
  
    // Loops 10 times to create nodes
    // This for loop is what would need to change for actual use.
    for (let i = 1; i < count; i++) {
      //Creates node with data.
      const success = Math.random();
      const error = 1 - success;
      const node = {
        id: i.toString(),
        title: `service:${i}`,
        subTitle: 'service',
        success,
        error,
        stat1: success,
        stat2: error,
        edges: [],
      };

      // Adds new node to array.
      nodes.push(node);

      // Randomizes the source for edges. 
      const sourceIndex = Math.floor(Math.random() * Math.floor(nodesWithoutMaxEdges.length - 1));
      const source = nodesWithoutMaxEdges[sourceIndex];
      source.edges.push(node.id);
      if (source.edges.length >= maxEdges) {
        nodesWithoutMaxEdges.splice(sourceIndex, 1);
      }
      nodesWithoutMaxEdges.push(node);
    }
  
    // Creates random edges to random sources and targets
    const additionalEdges = Math.floor(count / 2);
    for (let i = 0; i <= additionalEdges; i++) {
      const sourceIndex = Math.floor(Math.random() * Math.floor(nodes.length - 1));
      const targetIndex = Math.floor(Math.random() * Math.floor(nodes.length - 1));
      if (sourceIndex === targetIndex || nodes[sourceIndex].id === '0' || nodes[sourceIndex].id === '0') {
        continue;
      }
      // This value will later be used as the target of a nodes edge.
      nodes[sourceIndex].edges.push(nodes[sourceIndex].id);
    }
  
    // Creates the fields for the nodes
    const nodeFields: any = {
      [NodeGraphDataFrameFieldNames.id]: {
        values: new ArrayVector(),
        type: FieldType.string,
      },
      [NodeGraphDataFrameFieldNames.title]: {
        values: new ArrayVector(),
        type: FieldType.string,
      },
      [NodeGraphDataFrameFieldNames.subTitle]: {
        values: new ArrayVector(),
        type: FieldType.string,
      },
      [NodeGraphDataFrameFieldNames.mainStat]: {
        values: new ArrayVector(),
        type: FieldType.number,
      },
      [NodeGraphDataFrameFieldNames.secondaryStat]: {
        values: new ArrayVector(),
        type: FieldType.number,
      },
      [NodeGraphDataFrameFieldNames.arc + 'success']: {
        values: new ArrayVector(),
        type: FieldType.number,
        config: { color: { fixedColor: 'green', mode: FieldColorModeId.Fixed } },
      },
      [NodeGraphDataFrameFieldNames.arc + 'errors']: {
        values: new ArrayVector(),
        type: FieldType.number,
        config: { color: { fixedColor: 'red', mode: FieldColorModeId.Fixed } },
      },
    };
  
    // Creates the dataframe for the nodes using the above fields. 
    const nodeFrame = new MutableDataFrame({
      name: 'nodes',
      fields: Object.keys(nodeFields).map((key) => ({
        ...nodeFields[key],
        name: key,
      })),
      // Documentation says this is required for the nodeGraph to work
      meta: { preferredVisualisationType: 'nodeGraph' },
    });
  
    // Creates the fields for the edges.
    const edgeFields: any = {
      [NodeGraphDataFrameFieldNames.id]: {
        values: new ArrayVector(),
        type: FieldType.string,
      },
      [NodeGraphDataFrameFieldNames.source]: {
        values: new ArrayVector(),
        type: FieldType.string,
      },
      [NodeGraphDataFrameFieldNames.target]: {
        values: new ArrayVector(),
        type: FieldType.string,
      },
    };
  
    // Creates the dataframe for the edges with the above fields. 
    const edgesFrame = new MutableDataFrame({
      name: 'edges',
      fields: Object.keys(edgeFields).map((key) => ({
        ...edgeFields[key],
        name: key,
      })),
      // Documentation says this is required for the nodeGraph to work
      meta: { preferredVisualisationType: 'nodeGraph' },
    });
  
    // Adding values to the fields
    for (const node of nodes) {
      nodeFields.id.values.add(node.id);
      nodeFields.title.values.add(node.title);
      nodeFields.subTitle.values.add(node.subTitle);
      nodeFields.mainStat.values.add(node.stat1);
      nodeFields.secondaryStat.values.add(node.stat2);
      nodeFields.arc__success.values.add(node.success);
      nodeFields.arc__errors.values.add(node.error);
      // Adding values to the edges for the nodes. 
      for (const edge of node.edges) {
        edgeFields.id.values.add(`${node.id}--${edge}`);
        edgeFields.source.values.add(node.id);
        edgeFields.target.values.add(edge);
        console.log(edge)
      }
    }
    frames = [nodeFrame, edgesFrame]
    return of({ data: frames }).pipe(delay(100));
  }
  
  async testDatasource() {
    return {
      status: 'success',
      message: 'Success',
    };
  }
}