import * as React from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {
  INITIAL_PAGINATION_MODEL,
  useUserPagination,
} from "./hooks/useUserPagination";

const columns: GridColDef[] = [
  {field: "image", width: 150},
  {field: "firstName", headerName: "First name", width: 150},
  {field: "lastName", headerName: "Last name", width: 150},
  {field: "email", headerName: "email", width: 150},
];

export default function App() {
  const {getUsers, loading, users, totalCount} = useUserPagination();

  return (
    <div style={{minHeight: 300, width: "100%"}}>
      <DataGrid
        disableColumnMenu={true}
        loading={loading}
        columns={columns}
        rowCount={totalCount}
        rows={users}
        initialState={{
          pagination: {
            paginationModel: INITIAL_PAGINATION_MODEL,
          },
        }}
        pageSizeOptions={[5, 10, 15]}
        isRowSelectable={() => false}
        paginationMode={"server"}
        pagination
        autoHeight
        onPaginationModelChange={model => getUsers(model)}
      />
    </div>
  );
}
