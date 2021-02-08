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

  // Code for dataframes
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

  // Code for topology
  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
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

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
