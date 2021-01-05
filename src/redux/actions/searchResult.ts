import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ArticleIndicator } from "@api/local/schema";
import clippedActions from '@redux/actions/clipped';
import { ReduxRootState } from "@redux/schema";
import { getIndicatorIndex, isIndicated } from "@utils/searchResult";
import { mapToArray } from "@utils/array";
import { SearchResult } from "@redux/schema/searchResult";

const set = createAction<SearchResult[]>('searchResult/set');
const push = createAsyncThunk(
  'searchResult/push',
  async (results: SearchResult[], thunkAPI) => {
    const state = thunkAPI.getState() as ReduxRootState;
    const prevResult = state.searchResult.result;
    const filtered = results.filter((article) => !isIndicated(prevResult, article));
    const concat = prevResult.concat(filtered);
    const updated = {result: concat}
    return updated;
  }
);

const unclip = createAsyncThunk(
  'searchResult/unclip',
  async (indicator: ArticleIndicator | ArticleIndicator[], thunkAPI) => {
    await thunkAPI.dispatch(clippedActions.unclip(indicator));
    const indicators = mapToArray(indicator);
    const state = thunkAPI.getState() as ReduxRootState;
    const mappedResult = state.searchResult.result.map((item) => {
      const indicatorIndex = getIndicatorIndex(indicators, item);
      if (indicatorIndex === -1) return item;
      return {...item, clipped: false};
    })
    const updated = {result: mappedResult}
    return updated;
  }
)

const clip = createAsyncThunk(
  'searchResult/clip',
  async (indicator: ArticleIndicator | ArticleIndicator[], thunkAPI) => {
    const indicators = mapToArray(indicator);
    const state = thunkAPI.getState() as ReduxRootState;
    const mappedResult = state.searchResult.result.map((item) => {
      const indicatorIndex = getIndicatorIndex(indicators, item);
      if (indicatorIndex === -1) return item;
      return {...item, clipped: true};
    })
    const clipTargets = state.searchResult.result.filter((item) => isIndicated(indicators, item));
    if (clipTargets.length === 0) return state.searchResult;
    await thunkAPI.dispatch(clippedActions.push(clipTargets));
    const updated = {result: mappedResult}
    return updated;
  }
)

export default {
  set,
  push,
  clip,
  unclip,
}