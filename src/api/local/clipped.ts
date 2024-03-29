import { Clipped, ArticleIndicator } from "@redux/schema/searchResult";
import { isIndicated, getIndicatorIndex } from "@utils/searchResult";
import { getLocalData, setLocalData } from "@utils/storage";

const LOCAL_STORAGE_KEY = "CLIPPED";
const defaultValue: Clipped[] = [];

const dummy: Clipped = {
  abstract: "This is an abstract",
  headline: "This is a headline",
  id: "123",
  pub_date: "20201010",
  publisher: "nyTimes",
  web_url: "https://localZzirasi.com",
  pinned: false,
  tag: [],
  photo_url: "",
  clipped: true,
  clipStatus: "idle",
}
const keys = Object.keys(dummy);

const _validateItem = (item: any) => {
  const isObject = typeof item === "object"
  if (!isObject) return false;
  const vaildityMap = keys
    .map((key) => typeof item[key] === typeof dummy[key as keyof Clipped])
    .filter((bool) => !bool)
  const hasRequiredValues = vaildityMap.length === 0
  return hasRequiredValues;
}

const _validateData = <T>(data: any): T | null => {
  if (!Array.isArray(data)) return null;
  const itemValidityMap = data.map(_validateItem);
  const isAllValid = itemValidityMap.filter((bool) => !bool).length === 0;
  return isAllValid ? data as unknown as T : null;
}

const _getValidData = async (): Promise<Clipped[]> => {
  const storedData = await getLocalData(LOCAL_STORAGE_KEY);
  const parsedData = storedData !== null && storedData !== false
    ? JSON.parse(storedData)
    : storedData;
  const validatedData = _validateData<Clipped[]>(parsedData);

  if (validatedData === null) {
    await initialize();
    return _getValidData();
  }

  return validatedData;
}

const initialize = async() => setLocalData(LOCAL_STORAGE_KEY, defaultValue);

const set = async(data: Clipped[]) => setLocalData(LOCAL_STORAGE_KEY, data);

const get = _getValidData;

const push = async(item: Clipped | Clipped[]) => {
  const storedData = await get();
  const filtered = storedData.filter((clipped) => !isIndicated(item, clipped));
  const concatenated = filtered.concat(item);
  return set(concatenated);
}

const remove = async(indicator: ArticleIndicator | ArticleIndicator[]) => {
  const storedData = await get();
  const filtered = storedData.filter((item) => isIndicated(indicator, item) === false);
  return set(filtered);
}

const pin = async(indicator: ArticleIndicator | ArticleIndicator[]) => {
  const storedData = await get();
  const mapped = storedData.map((item) => {
    if (!isIndicated(indicator, item)) return item;
    return {...item, pinned: true};
  });
  return set(mapped);
}

const unpin = async(indicator: ArticleIndicator | ArticleIndicator[]) => {
  const storedData = await get();
  const mapped = storedData.map((item) => {
    if (!isIndicated(indicator, item)) return item;
    return {...item, pinned: false};
  });
  return set(mapped);
}

const addTag = async(indicator: ArticleIndicator | ArticleIndicator[], tag: string) => {
  if (tag === "") return;
  const storedData = await get();
  const mapped = storedData.map((item) => {
    const indicatorIndex = getIndicatorIndex(indicator, item);
    if (indicatorIndex === -1) return item;
    const filteredTag = item.tag
      ? item.tag.filter((str) => str !== tag).concat(tag)
      : [tag];
    return {...item, tag: filteredTag};
  });
  return set(mapped);
}

const removeTag = async(indicator: ArticleIndicator | ArticleIndicator[], tag: string) => {
  if (tag === "") return;
  const storedData = await get();
  const mapped = storedData.map((item) => {
    const indicatorIndex = getIndicatorIndex(indicator, item);
    if (indicatorIndex === -1) return item;
    const filteredTag = item.tag?.filter((str) => str !== tag);
    return {...item, tag: filteredTag};
  });
  return set(mapped);
}

const clearTags = async(indicator: ArticleIndicator | ArticleIndicator[]) => {
  const storedData = await get();
  const mapped = storedData.map((item) => {
    if (isIndicated(indicator, item) === false) return item;
    return {...item, tag: []};
  });
  return set(mapped);
}

export default {
  initialize,
  set,
  get,
  push,
  remove,
  pin,
  unpin,
  addTag,
  removeTag,
  clearTags,
}