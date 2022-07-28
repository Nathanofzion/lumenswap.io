import { getCollectionStats, getSingleCollection } from 'api/nft';

export async function NFTCollectionNftsPageGetServerSideProps({ params }) {
  try {
    const collectionSlugName = params.collection;
    const collectionData = await getSingleCollection(collectionSlugName);
    const collectionStats = await getCollectionStats(collectionSlugName);

    return {
      props: {
        collectionData,
        collectionStats,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}
