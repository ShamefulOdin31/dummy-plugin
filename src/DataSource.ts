import { QueryResponse } from './types';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
  MutableDataFrame,
  toDataFrame,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  /*
  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
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
   
    
 
    // Return a constant for each query.
    const data: QueryResponse[] = [
    
      {
          columns: [
              { type: "time", text: "Time" },
              { text: "app" },
              { text: "target_app" },
              { text: "req_rate" },
              { text: "resp_time" }
          ],
          refId: undefined,
          meta: undefined,
          rows: [
              [0, "service a java", "service b http", 50, 4000],
              [0, "service a java", "service c java", 75, 13650],
              [0, "service c java", "service d http", 25, 750]
          ]
      }
      ,
      {
        columns: [
          { type: "time", text: "Time"},
          { text: "app" },
          { text: "target_app" },
          { text: "error_rate" }
        ],
        refId: undefined,
        meta: undefined,
        rows: [
          [0, "service a java", "service b http", 5],
          [0, "service a java", "service c java", 0],
          [0, "service c java", "service d http", 1]
        ]
      }
      
      
    ]
    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
