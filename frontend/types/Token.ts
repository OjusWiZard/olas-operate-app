import { Address } from './Address';

type Token = {
  address: Address;
  chainId: number;
};

export type NativeToken = Token & {
  symbol?: string;
};

export type Erc20Token = Token & {
  decimals: number;
  price?: number;
  symbol: string;
};

export type OlasServiceNftToken = Token & {
  tokenId: number;
};
