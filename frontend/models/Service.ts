import {
  MiddlewareChainData,
  MiddlewareDeploymentStatus,
  MiddlewareLedgerConfig,
  MiddlewareService,
  MiddlewareServiceKeys,
} from '@/client';
import { ChainId } from '@/enums/ChainId';

export class Service {
  status?: MiddlewareDeploymentStatus;
  chainId: ChainId;

  // middleware service attrs
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

  constructor(
    middlewareService: MiddlewareService,
    options?: {
      status?: MiddlewareDeploymentStatus;
    },
  ) {
    this.name = middlewareService.name;
    this.hash = middlewareService.hash;
    this.keys = middlewareService.keys;
    this.readme = middlewareService.readme;
    this.chain_configs = middlewareService.chain_configs;
    this.chainId = 

    if (options?.status) this.status = status;
  }
}
