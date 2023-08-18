import {
  collection,
  CollectionReference,
  endBefore,
  limit,
  limitToLast,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  startAt,
} from "firebase/firestore";
import {db} from "../firebaseConfig";
import {User} from "../types/user";
import {GridPaginationModel} from "@mui/x-data-grid";

export const userCollection = collection(
  db,
  "users",
) as CollectionReference<User>;
export type UserDocument = QueryDocumentSnapshot<User>;

type Params = {
  newModel: GridPaginationModel;
  oldModel: GridPaginationModel;
  lastDoc?: UserDocument;
  firstDoc?: UserDocument;
};

export const userPaginationQuery = ({
  newModel,
  oldModel,
  lastDoc,
  firstDoc,
}: Params) => {
  if (newModel.page !== 0 && newModel.pageSize !== oldModel.pageSize) {
    console.log("CHANGE SIZE");
    return query(
      userCollection,
      orderBy("firstName", "desc"),
      startAt(firstDoc),
      limit(newModel.pageSize),
    );
  }
  if (newModel.page > oldModel.page) {
    console.log("GO NEXT ===>  ");

    return query(
      userCollection,
      orderBy("firstName", "desc"),
      startAfter(lastDoc),
      limit(oldModel.pageSize),
    );
  }
  if (newModel.page < oldModel.page) {
    console.log("<=== GO PREV  ");
    return query(
      userCollection,
      orderBy("firstName", "desc"),
      endBefore(firstDoc),
      limitToLast(oldModel.pageSize),
    );
  }

  return query(
    userCollection,
    orderBy("firstName", "desc"),
    limit(newModel.pageSize),
  );
};
