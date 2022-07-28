import { getItemDetails } from 'api/nft';

export const nftDetailsPageGetServerSideProps = async ({ params }) => {
  try {
    const itemId = params.id;
    const collectionSlugName = params.collection;
    const itemData = await getItemDetails(collectionSlugName, itemId);

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
};
