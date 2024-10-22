import { StakingProgramId } from '@/enums/StakingProgram';
import { Address } from '@/types/Address';

import {
  MiddlewareChain,
  MiddlewareDeploymentStatus,
  MiddlewareLedger,
} from './enums';

export type ServiceHash = string;

export type MiddlewareLedgerConfig = {
  rpc: string;
  type: MiddlewareLedger;
  chain: MiddlewareChain;
};

export type MiddlewareServiceKeys = {
  address: Address;
  private_key: string;
  ledger: MiddlewareChain;
};

export type MiddlewareChainData = {
  instances?: Address[];
  token?: number;
  multisig?: Address;
  on_chain_state: number;
  staked: boolean;
  user_params: {
    cost_of_bond: number;
    fund_requirements: {
      agent: number;
      safe: number;
    };
    nft: string;
    staking_program_id: StakingProgramId;
    threshold: number;
    use_staking: true;
  };
};

export type MiddlewareService = {
  name: string;
  hash: string;
  keys: MiddlewareServiceKeys[];
  readme?: string;
  chain_configs: {
    [chainId: number]: {
      ledger_config: MiddlewareLedgerConfig;
      chain_data: MiddlewareChainData;
    };
  };
};

export type MiddlewareServiceTemplate = {
  name: string;
  hash: string;
  image: string;
  description: string;
  service_version: string;
  home_chain_id: string;
  configurations: { [key: string]: MiddlewareConfigurationTemplate };
  deploy?: boolean;
};

export type MiddlewareConfigurationTemplate = {
  rpc?: string; // added on deployment
  staking_program_id?: StakingProgramId; // added on deployment
  nft: string;
  agent_id: number;
  threshold: number;
  use_staking: boolean;
  cost_of_bond: number;
  monthly_gas_estimate: number;
  fund_requirements: MiddlewareFundRequirementsTemplate;
};

export type MiddlewareFundRequirementsTemplate = {
  agent: number;
  safe: number;
};

export type MiddlewareDeployedNodes = {
  agent: string[];
  tendermint: string[];
};

export type MiddlewareDeployment = {
  status: MiddlewareDeploymentStatus;
  nodes: MiddlewareDeployedNodes;
};

export type EmptyPayload = Record<string, never>;

export type EmptyResponse = Record<string, never>;

export type HttpResponse = {
  error?: string;
  data?: string;
};

export type ClientResponse<ResponseType> = {
  error?: string;
  data?: ResponseType;
};

export type MiddlewareStopDeployment = {
  delete: boolean /* Delete deployment*/;
};

export type MiddlewareUpdateServicePayload = {
  old: ServiceHash;
  new: MiddlewareServiceTemplate;
};

export type MiddlewareDeleteServicesPayload = {
  hashes: ServiceHash[];
};

export type MiddlewareDeleteServicesResponse = {
  hashes: ServiceHash[];
};

export type MiddlewareAppInfo = {
  account?: {
    key: Address;
  };
};

export type MiddlewareWalletResponse = {
  address: Address;
  safe_chains: MiddlewareChain[];
  ledger_type: MiddlewareLedger;
  safe: Address;
  safe_nonce: number;
};

export type Wallet = MiddlewareWalletResponse & {
  ethBalance?: number;
  olasBalance?: number;
};
