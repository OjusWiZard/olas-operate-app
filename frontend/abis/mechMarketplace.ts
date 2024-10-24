export const MECH_MARKETPLACE_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_stakingFactory', type: 'address' },
      { internalType: 'address', name: '_karmaProxy', type: 'address' },
      { internalType: 'uint256', name: '_minResponseTimeout', type: 'uint256' },
      { internalType: 'uint256', name: '_maxResponseTimeout', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'requestId', type: 'uint256' }],
    name: 'AlreadyDelivered',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'provided', type: 'uint256' },
      { internalType: 'uint256', name: 'min', type: 'uint256' },
      { internalType: 'uint256', name: 'max', type: 'uint256' },
    ],
    name: 'OutOfBounds',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'provided', type: 'uint256' },
      { internalType: 'uint256', name: 'max', type: 'uint256' },
    ],
    name: 'Overflow',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'address', name: 'owner', type: 'address' },
    ],
    name: 'OwnerOnly',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'expected', type: 'uint256' },
      { internalType: 'uint256', name: 'current', type: 'uint256' },
    ],
    name: 'PriorityMechResponseTimeout',
    type: 'error',
  },
  { inputs: [], name: 'ReentrancyGuard', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'stakingInstance', type: 'address' },
      { internalType: 'uint256', name: 'serviceId', type: 'uint256' },
    ],
    name: 'ServiceNotStaked',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'UnauthorizedAccount',
    type: 'error',
  },
  { inputs: [], name: 'ZeroAddress', type: 'error' },
  { inputs: [], name: 'ZeroValue', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'factory',
        type: 'address',
      },
    ],
    name: 'FactoryUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'priorityMech',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'actualMech',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'requester',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'MarketplaceDeliver',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'requester',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'requestedMech',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'MarketplaceRequest',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'mech', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'status', type: 'bool' },
    ],
    name: 'MechRegistrationStatusChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'minResponseTimeout',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'maxResponseTimeout',
        type: 'uint256',
      },
    ],
    name: 'MinMaxResponseTimeoutUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnerUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR_TYPE_HASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VERSION',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'chainId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'mech', type: 'address' },
      { internalType: 'address', name: 'mechStakingInstance', type: 'address' },
      { internalType: 'uint256', name: 'mechServiceId', type: 'uint256' },
    ],
    name: 'checkMech',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'requester', type: 'address' },
      {
        internalType: 'address',
        name: 'requesterStakingInstance',
        type: 'address',
      },
      { internalType: 'uint256', name: 'requesterServiceId', type: 'uint256' },
    ],
    name: 'checkRequester',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'stakingInstance', type: 'address' },
      { internalType: 'uint256', name: 'serviceId', type: 'uint256' },
    ],
    name: 'checkStakingInstance',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'requestId', type: 'uint256' },
      { internalType: 'bytes', name: 'requestData', type: 'bytes' },
      {
        internalType: 'address',
        name: 'deliveryMechStakingInstance',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deliveryMechServiceId',
        type: 'uint256',
      },
    ],
    name: 'deliverMarketplace',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'domainSeparator',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getDeliveriesCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDomainSeparator',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'requestId', type: 'uint256' }],
    name: 'getMechDeliveryInfo',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'priorityMech', type: 'address' },
          { internalType: 'address', name: 'deliveryMech', type: 'address' },
          { internalType: 'address', name: 'requester', type: 'address' },
          { internalType: 'uint32', name: 'responseTimeout', type: 'uint32' },
        ],
        internalType: 'struct MechDelivery',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'mechService', type: 'address' }],
    name: 'getMechServiceDeliveriesCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      { internalType: 'uint256', name: 'nonce', type: 'uint256' },
    ],
    name: 'getRequestId',
    outputs: [{ internalType: 'uint256', name: 'requestId', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'requestId', type: 'uint256' }],
    name: 'getRequestStatus',
    outputs: [
      {
        internalType: 'enum MechMarketplace.RequestStatus',
        name: 'status',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getRequestsCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'karmaProxy',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'mapDeliveryCounts',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'mapMechServiceDeliveryCounts',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'mapNonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'mapRequestCounts',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'mapRequestIdDeliveries',
    outputs: [
      { internalType: 'address', name: 'priorityMech', type: 'address' },
      { internalType: 'address', name: 'deliveryMech', type: 'address' },
      { internalType: 'address', name: 'requester', type: 'address' },
      { internalType: 'uint32', name: 'responseTimeout', type: 'uint32' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxResponseTimeout',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minResponseTimeout',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'numTotalRequests',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'numUndeliveredRequests',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      { internalType: 'address', name: 'priorityMech', type: 'address' },
      {
        internalType: 'address',
        name: 'priorityMechStakingInstance',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'priorityMechServiceId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'requesterStakingInstance',
        type: 'address',
      },
      { internalType: 'uint256', name: 'requesterServiceId', type: 'uint256' },
      { internalType: 'uint256', name: 'responseTimeout', type: 'uint256' },
    ],
    name: 'request',
    outputs: [{ internalType: 'uint256', name: 'requestId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stakingFactory',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];