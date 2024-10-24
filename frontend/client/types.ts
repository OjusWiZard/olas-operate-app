import { StakingProgramId } from '@/enums/StakingProgramId';
import { Address } from '@/types/Address';

import {
  MiddlewareChain,
  MiddlewareDeploymentStatus,
  MiddlewareLedger,
} from './enums';

export type ServiceHash = string;

export type MiddlewareLedgerConfig = {
  chain: MiddlewareChain;
  rpc: string;
  type: MiddlewareLedger;
};

export type MiddlewareServiceKeys = {
  address: Address;
  ledger: MiddlewareChain;
  private_key: string;
};

export type MiddlewareChainData = {
  instances?: Address[];
  multisig?: Address;
  on_chain_state: number;
  staked: boolean;
  token?: number;
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
  chain_configs: {
    [chainId: number]: {
      chain_data: MiddlewareChainData;
      ledger_config: MiddlewareLedgerConfig;
    };
  };
  hash: string;
  keys: MiddlewareServiceKeys[];
  name: string;
  // readme?: string;
  status?: MiddlewareDeploymentStatus;
};

export type MiddlewareServiceTemplate = {
  configurations: { [key: string]: MiddlewareConfigurationTemplate };
  deploy?: boolean;
  description: string;
  hash: string;
  home_chain_id: string;
  image: string;
  name: string;
  service_version: string;
};

export type MiddlewareConfigurationTemplate = {
  agent_id: number;
  cost_of_bond: number;
  fund_requirements: MiddlewareFundRequirementsTemplate;
  monthly_gas_estimate: number;
  // added on deployment
  nft: string;
  rpc?: string;
  // added on deployment
  staking_program_id?: StakingProgramId;
  threshold: number;
  use_staking: boolean;
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
  nodes: MiddlewareDeployedNodes;
  status: MiddlewareDeploymentStatus;
};

export type EmptyPayload = Record<string, never>;

export type EmptyResponse = Record<string, never>;

export type HttpResponse = {
  data?: string;
  error?: string;
};

export type ClientResponse<ResponseType> = {
  data?: ResponseType;
  error?: string;
};

export type MiddlewareStopDeployment = {
  delete: boolean /* Delete deployment*/;
};

export type MiddlewareUpdateServicePayload = {
  new: MiddlewareServiceTemplate;
  old: ServiceHash;
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
  ledger_type: MiddlewareLedger;
  safe: Address;
  safe_chains: MiddlewareChain[];
  safe_nonce: number;
};

export type Wallet = MiddlewareWalletResponse & {
  ethBalance?: number;
  olasBalance?: number;
};
