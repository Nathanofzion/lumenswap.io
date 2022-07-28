import axios from 'axios';

export function checkItemDropped(address) {
  return axios.get(
    `${process.env.REACT_APP_LUMEN_API}/nft/airdrop/${address}`,
  );
}

export function claimItemApi(address) {
  return axios.post(
    `${process.env.REACT_APP_LUMEN_API}/nft/airdrop/${address}/claim`,
  );
}

// export function getAssetHolderApi(asset) {
//   return axios.get(`https://api-holder.lumenswap.io/${asset}`).then((res) => res.data);
// }

export function getAccounts(assetCode, cursor) {
  return axios.get(`${process.env.REACT_APP_HORIZON}/accounts`, {
    params: {
      limit: 200,
      order: 'desc',
      asset: `${assetCode}:${process.env.REACT_APP_LUSI_ISSUER}`,
      cursor,
    },
  });
}

export function fetchNFTActivity() {
  return axios.get(`${process.env.REACT_APP_LUMEN_API}/nft/activity`);
}

export async function getNFTCollections() {
  const response = await axios.get(`${process.env.REACT_APP_LUMEN_API}/nft/collection`);
  return response.data;
}

export async function getCollectionNfts(slug) {
  const response = await axios.get(`${process.env.REACT_APP_LUMEN_API}/nft/collection/${slug}/nfts`);
  return response.data;
}

export async function getCollectionStats(slug) {
  const response = await axios.get(`${process.env.REACT_APP_LUMEN_API}/nft/collection/${slug}/stats`);
  return response.data;
}

export async function getSingleCollection(slug) {
  const response = await axios.get(`${process.env.REACT_APP_LUMEN_API}/nft/collection/${slug}`);
  return response.data;
}

export async function getItemDetails(slug, id) {
  const response = await axios.get(`${process.env.REACT_APP_LUMEN_API}/nft/collection/${slug}/nfts/${id}`);
  return response.data;
}

export async function getMyNfts(userNfts) {
  const response = await axios.post(`${process.env.REACT_APP_LUMEN_API}/nft/my-nfts`, {
    assets: userNfts,
  });
  return response.data;
}

export async function getMyOffersData(userOffers) {
  const response = await axios.post(`${process.env.REACT_APP_LUMEN_API}/nft/my-offers`, {
    assets: userOffers,
  });
  return response.data;
}
