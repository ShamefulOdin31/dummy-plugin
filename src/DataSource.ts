//import { QueryResponse } from './types';
import { NodeGraphDataFrameFieldNames } from '@grafana/ui';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldColorModeId,
  FieldType,
  MutableDataFrame,
  ArrayVector
 // toDataFrame,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  // Code for dataframes
  
  /*async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map((query) =>{
      var timeValues :any
      var actualValues :any
      console.log(query)

      if(query["constant"] == 0){
        timeValues = [1611306000000, 1611309600000]
        actualValues = ["true", "false"];

        const frame = new MutableDataFrame({
          refId: query.refId,
          fields: [
            { name: "Time", type: FieldType.time },
            { name: "Values", type: FieldType.string },
          ],
        });
        for(let i = 0; i < timeValues.length; i++){
          frame.appendRow([timeValues[i], actualValues[i]])
        }
        return frame;
      }
      
      else {
        timeValues = [1611306000000, 1611309600000]
        actualValues = ["false", "true"];
        const frame = new MutableDataFrame({
          refId: query.refId,
          fields: [
            { name: "Time", type: FieldType.time },
            { name: "Test", type: FieldType.string },
          ],
        });
        for(let i = 0; i < timeValues.length; i++){
          frame.appendRow([timeValues[i], actualValues[i]])
        }
        return frame;
      }
      
    })
    return Promise.all(promises).then((data) => ({ data }))
  }*/

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map((query) =>{
      const idField = {
        name: NodeGraphDataFrameFieldNames.id,
        type: FieldType.string,
        values: new ArrayVector(),
      };
      const titleField = {
        name: NodeGraphDataFrameFieldNames.title,
        type: FieldType.string,
        values: new ArrayVector(),
        config: { displayName: 'Name' },
      };
    
      const typeField = {
        name: NodeGraphDataFrameFieldNames.subTitle,
        type: FieldType.string,
        values: new ArrayVector(),
        config: { displayName: 'Type' },
      };
    
      const mainStatField = {
        name: NodeGraphDataFrameFieldNames.mainStat,
        type: FieldType.number,
        values: new ArrayVector(),
        config: { unit: 'ms/t', displayName: 'Average response time' },
      };
    
      const secondaryStatField = {
        name: NodeGraphDataFrameFieldNames.secondaryStat,
        type: FieldType.string,
        values: new ArrayVector(),
        config: { displayName: 'Requests count' },
      };
    
      const successField = {
        name: NodeGraphDataFrameFieldNames.arc + 'success',
        type: FieldType.number,
        values: new ArrayVector(),
        config: { color: { fixedColor: 'green', mode: FieldColorModeId.Fixed } },
      };
    
      const errorsField = {
        name: NodeGraphDataFrameFieldNames.arc + 'errors',
        type: FieldType.number,
        values: new ArrayVector(),
        config: { color: { fixedColor: 'semi-dark-yellow', mode: FieldColorModeId.Fixed } },
      };
    
      const faultsField = {
        name: NodeGraphDataFrameFieldNames.arc + 'faults',
        type: FieldType.number,
        values: new ArrayVector(),
        config: { color: { fixedColor: 'red', mode: FieldColorModeId.Fixed } },
      };
    
      const throttledField = {
        name: NodeGraphDataFrameFieldNames.arc + 'throttled',
        type: FieldType.number,
        values: new ArrayVector(),
        config: { color: { fixedColor: 'purple', mode: FieldColorModeId.Fixed } },
      };
    
      const edgeIdField = {
        name: NodeGraphDataFrameFieldNames.id,
        type: FieldType.string,
        values: new ArrayVector(),
      };
      const edgeSourceField = {
        name: NodeGraphDataFrameFieldNames.source,
        type: FieldType.string,
        values: new ArrayVector(),
      };
      const edgeTargetField = {
        name: NodeGraphDataFrameFieldNames.target,
        type: FieldType.string,
        values: new ArrayVector(),
      };
    
      // These are needed for links to work
      const edgeSourceNameField = {
        name: 'sourceName',
        type: FieldType.string,
        values: new ArrayVector(),
      };
      const edgeTargetNameField = {
        name: 'targetName',
        type: FieldType.string,
        values: new ArrayVector(),
      };

      const edgeMainStatField = {
        name: NodeGraphDataFrameFieldNames.mainStat,
        type: FieldType.string,
        values: new ArrayVector(),
        config: { displayName: 'Response percentage' },
      };

      const edgeSecondaryStatField = {
        name: NodeGraphDataFrameFieldNames.secondaryStat,
        type: FieldType.string,
        values: new ArrayVector(),
        config: { displayName: 'Requests count' },
      };
      
      let ids = ["A", "B"];
      let titles = ["test1", "test2"];
      let subtitles = ['sub1', 'sub2'];
      let arcVal = [1, 1];
      let secstat = ["sec stat 1", "sec stat 2"];
      let sucess = [0, 1];
      let throttle = [0, 0]
      let erros = [0, 0];
      let thr = [0, 0]

      let ids2 = ['1', '2'];
      let source = ['A', 'B'];
      let sourceName = ['test1', 'test2'];
      let target = ['B', 'A'];
      let targetName = ['test3', 'test4']
      let mainstat2 = ['edge1', 'edge2'];
      let secstatedge = ['test34', 'test43']


      for(let i = 0; i < ids.length; i++){
        idField.values.add(ids[i]);
        titleField.values.add(titles[i]);
        typeField.values.add(subtitles[i]);
        mainStatField.values.add(arcVal[i]);
        secondaryStatField.values.add(secstat[i]);
        successField.values.add(sucess[i]);
        faultsField.values.add(throttle[i]);
        errorsField.values.add(erros[i]);
        throttledField.values.add(thr[i]);

        edgeIdField.values.add(ids2[i]);
        edgeSourceField.values.add(source[i]);
        edgeSourceNameField.values.add(sourceName[i]);
        edgeTargetField.values.add(target[i]);
        edgeTargetNameField.values.add(targetName[i]);
        edgeMainStatField.values.add(mainstat2[i]);
        edgeSecondaryStatField.values.add(secstatedge[i])
      }

      return [
        new MutableDataFrame({
          name: 'nodes',
          refId: query?.refId,
          fields: [
            idField,
            titleField,
            typeField,
            mainStatField,
            secondaryStatField,
            successField,
            faultsField,
            errorsField,
            throttledField,
          ],
          meta: {
            preferredVisualisationType: 'nodeGraph',
          },
        }),
        new MutableDataFrame({
          name: 'edges',
          refId: query?.refId,
          fields: [
            edgeIdField,
            edgeSourceField,
            edgeSourceNameField,
            edgeTargetField,
            edgeTargetNameField,
            edgeMainStatField,
            edgeSecondaryStatField,
          ],
          meta: {
            preferredVisualisationType: 'nodeGraph',
          },
        }),
      ];

    })
    return Promise.all(promises).then((data) => ({ data }))
  }

  // Code for topology
  /*async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
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
  */

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
