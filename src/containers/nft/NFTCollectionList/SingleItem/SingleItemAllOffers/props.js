import { getItemDetails } from 'api/nft';

async function NFTSingleItemAllOffersGetServerSideProps({ params }) {
  try {
    const itemId = params.id;
    const itemCollectionSlug = params.collection;
    const itemData = await getItemDetails(itemCollectionSlug, itemId);
    return {
      props: {
        itemData,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

export default NFTSingleItemAllOffersGetServerSideProps;
