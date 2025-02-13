import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const useTeam = () => {
  return useSelector((state: RootState) => state.team);
};

export const useProject = () => {
  return useSelector((state: RootState) => state.project);
};

export const useTab = () => {
  return useSelector((state: RootState) => state.tab);
};
