import useReduxClipped from '@hooks/useReduxClipped';
import useReduxQuery from '@hooks/useReduxQuery';
import { useNavigation } from '@react-navigation/native';
import { ArticleIndicator } from '@redux/schema/searchResult';
import React from 'react'
import ClippedResultList from './ClippedSearchResult/ClippedResultList';

const ClippedSearchResult = () => {
  const {methods: ClippedMethods, state: ClippedState} = useReduxClipped();
  const {methods: QueryMethods, state: QueryState} = useReduxQuery();
  const onEndReached = () => {
    QueryMethods.fetchNextPage();
  }

  const navigation = useNavigation();
  const onPressEntry = (url: string) => {
    navigation.navigate("ArticleViewer", {url})
  }

  const onPressClip = (indicator: ArticleIndicator) => {
    ClippedMethods.unclip(indicator);
  }

  return (
    <ClippedResultList
      clippedResults={ClippedState.articles}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      onPressEntry={onPressEntry}
      onPressClip={onPressClip}
    />
  )
}

export default ClippedSearchResult