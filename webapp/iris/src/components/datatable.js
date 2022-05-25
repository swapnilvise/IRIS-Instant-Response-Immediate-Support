import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

/**
 * Below constant will define the  column fields of the datatable
 */
const columns = [
  { field: "serial", headerName: "Request ID", width: 100 },
  { field: "location", headerName: "Location", width: 300 },
  {
    field: "emergencyLevel",
    headerName: "Emergency Level",
    width: 150
  },
  {
    field: "status",
    headerName: "Request Status",
    width: 300
  }
];

/**
 * Function to populate the rows in the datatable
 * @param {*} props 
 * @returns 
 */
export default function DataTable(props) {
  props.data.forEach((row, index) => { row.serial = index + 1; row.location = row.caller?.callerAddress; });
  return (
    <div className="callHistory">
      <div>
        <h2>Emergency Requests</h2>
      </div>
      <div className="data-grid-container">
        <DataGrid
          rows={props.data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          rowSelection='single'
          onSelectionModelChange={(ids) => props.getSelectedRow(ids)}
        />
      </div>
    </div>
  );
}
