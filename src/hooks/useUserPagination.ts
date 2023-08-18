import {useCallback, useEffect, useState} from "react";
import {getDocs, getCountFromServer} from "firebase/firestore";
import {User} from "../types/user";
import {GridPaginationModel} from "@mui/x-data-grid";
import {
  userCollection,
  UserDocument,
  userPaginationQuery,
} from "../queries/userPaginationQuery";

export const INITIAL_PAGINATION_MODEL = {
  pageSize: 5,
  page: 0,
};

export const useUserPagination = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<UserDocument>();
  const [firstDoc, setFirstDoc] = useState<UserDocument>();
  const [totalCount, setTotalCount] = useState(0);

  const [model, setModel] = useState<GridPaginationModel>(
    INITIAL_PAGINATION_MODEL,
  );

  const getUsers = useCallback(
    async (newModel: GridPaginationModel) => {
      try {
        setLoading(true);

        const snapshot = await getDocs(
          userPaginationQuery({
            newModel,
            oldModel: model,
            firstDoc,
            lastDoc,
          }),
        );

        const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || undefined;
        const newFirstDoc = snapshot.docs[0] || undefined;

        setLastDoc(newLastDoc);
        setFirstDoc(newFirstDoc);
        const newUsers = snapshot.docs.map(doc => doc.data());

        setModel(newModel);
        setUsers(newUsers);
      } catch (e) {
        console.log("Failed to get users => ", e);
        setErrors("Failed to get users");
      } finally {
        setLoading(false);
      }
    },
    [model, lastDoc, firstDoc],
  );

  const getTotalCount = async () => {
    const snapshot = await getCountFromServer(userCollection);
    setTotalCount(snapshot.data().count);
  };

  useEffect(() => {
    getUsers(INITIAL_PAGINATION_MODEL);
    getTotalCount();
  }, []);

  return {
    getUsers,
    errors,
    loading,
    users,
    totalCount,
  };
};
