import { collectionIdQuery, lastBlockQuery, totalNFTsQuery } from "./graphqlReq";

export type CollectionsType = {
  collectionId: string;
};

export const IndexerEndpoint = (network: string) => {
  if (!network) throw new Error("API_NOT_INITIALIZED: NETWORK NOT AVAILABLE")
  switch (network) {
    case "Betanet":
      return "https://app-89c715a9-b0d1-488e-96ab-602b567b6af2.cleverapps.io/"
    case "Mainnet":
      return "https://indexer-mainnet.ternoa.dev/"
    case "Alphanet":
      return "https://indexer-alphanet.ternoa.dev/"
    default:
      return "https://indexer-alphanet.ternoa.dev/"
  }
}

export const getCollections = async (address: string, network: string) => {
  const query = collectionIdQuery(address);
  const INDEXER_URL = IndexerEndpoint(network)
  return await fetch(INDEXER_URL, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
    }),
  })
    .then((response) => response.json())
    .then(
      (response: {
        data: { collectionEntities: { nodes: CollectionsType[] } };
      }) => response.data.collectionEntities.nodes
    )
    .catch((error) => {
      const errorDescription = `INDEXER_REQUEST - COLLECTION_IDS_NOT_FOUND - ${error instanceof Error ? error.message : JSON.stringify(error)
        }`;
      throw new Error(errorDescription);
    });
};

export const getTotalNFTs = async (address: string, network: string) => {
  const query = totalNFTsQuery(address);
  const INDEXER_URL = IndexerEndpoint(network)
  return await fetch(INDEXER_URL, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
    }),
  })
    .then((response) => response.json())
    .then(
      (response: {
        data: { nftEntities: { totalCount: number} };
      }) => response.data.nftEntities.totalCount
    )
    .catch((error) => {
      const errorDescription = `INDEXER_REQUEST - TOTAL_NFTS_NOT_FOUND - ${error instanceof Error ? error.message : JSON.stringify(error)
        }`;
      throw new Error(errorDescription);
    });
};

export const getIndexerLastBlock = async (network: string) => {
  const query = lastBlockQuery();
  const INDEXER_URL = IndexerEndpoint(network)
  return await fetch(INDEXER_URL, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
    }),
  })
    .then((response) => response.json())
    .then(
      (response: {
        data: { _metadata: { lastProcessedHeight: number, indexerHealthy:boolean} };
      }) => response.data._metadata
    )
    .catch((error) => {
      const errorDescription = `INDEXER_REQUEST - LAST_BLOCK_NOT_FOUND - ${error instanceof Error ? error.message : JSON.stringify(error)
        }`;
      throw new Error(errorDescription);
    });
};
