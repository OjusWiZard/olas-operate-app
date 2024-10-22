export enum MiddlewareAction {
  STATUS = 0,
  BUILD = 1,
  DEPLOY = 2,
  STOP = 3,
}

export enum MiddlewareChain {
  ETHEREUM = 0,
  GOERLI = 1,
  GNOSIS = 2,
  SOLANA = 3,
}

export enum MiddlewareLedger {
  ETHEREUM = 0,
  SOLANA = 1,
}

export enum MiddlewareDeploymentStatus {
  CREATED = 0,
  BUILT = 1,
  DEPLOYING = 2,
  DEPLOYED = 3,
  STOPPING = 4,
  STOPPED = 5,
  DELETED = 6,
}

export enum MiddlewareAccountIsSetup {
  True,
  False,
  Loading,
  Error,
}
