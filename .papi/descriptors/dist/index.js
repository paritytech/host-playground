import { _Enum } from 'polkadot-api';

const table = new Uint8Array(128);
for (let i = 0; i < 64; i++) table[i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i * 4 - 205] = i;
const toBinary = (base64) => {
  const n = base64.length, bytes = new Uint8Array((n - Number(base64[n - 1] === "=") - Number(base64[n - 2] === "=")) * 3 / 4 | 0);
  for (let i2 = 0, j = 0; i2 < n; ) {
    const c0 = table[base64.charCodeAt(i2++)], c1 = table[base64.charCodeAt(i2++)];
    const c2 = table[base64.charCodeAt(i2++)], c3 = table[base64.charCodeAt(i2++)];
    bytes[j++] = c0 << 2 | c1 >> 4;
    bytes[j++] = c1 << 4 | c2 >> 2;
    bytes[j++] = c2 << 6 | c3;
  }
  return bytes;
};

const descriptorValues = import('./descriptors-DWccrBBq.js').then((module) => module["PaseoHub"]);
const metadataTypes = import('./metadataTypes-BB9mDcdX.js').then(
  (module) => toBinary("default" in module ? module.default : module)
);
const asset = {};
const extensions = {};
const getMetadata$1 = () => import('./paseoHub_metadata-s3JkSAaT.js').then(
  (module) => toBinary("default" in module ? module.default : module)
);
const genesis = "0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2";
const _allDescriptors = { descriptors: descriptorValues, metadataTypes, asset, extensions, getMetadata: getMetadata$1, genesis };

const DigestItem = _Enum;
const Phase = _Enum;
const DispatchClass = _Enum;
const TokenError = _Enum;
const ArithmeticError = _Enum;
const TransactionalError = _Enum;
const PreimageEvent = _Enum;
const BalanceStatus = _Enum;
const PreimagePalletHoldReason = _Enum;
const TransactionPaymentEvent = _Enum;
const XcmV5Junctions = _Enum;
const XcmV5Junction = _Enum;
const XcmV5NetworkId = _Enum;
const XcmV3JunctionBodyId = _Enum;
const XcmV2JunctionBodyPart = _Enum;
const CommonClaimsEvent = _Enum;
const XcmV5Instruction = _Enum;
const XcmV3MultiassetFungibility = _Enum;
const XcmV3MultiassetAssetInstance = _Enum;
const XcmV3MaybeErrorCode = _Enum;
const XcmV2OriginKind = _Enum;
const XcmV5AssetFilter = _Enum;
const XcmV5WildAsset = _Enum;
const XcmV2MultiassetWildFungibility = _Enum;
const XcmV3WeightLimit = _Enum;
const XcmVersionedAssets = _Enum;
const XcmV3MultiassetAssetId = _Enum;
const XcmV3Junctions = _Enum;
const XcmV3Junction = _Enum;
const XcmV3JunctionNetworkId = _Enum;
const XcmVersionedLocation = _Enum;
const ConvictionVotingVoteAccountVote = _Enum;
const PreimagesBounded = _Enum;
const ChildBountiesEvent = _Enum;
const NominationPoolsPoolState = _Enum;
const NominationPoolsCommissionClaimPermission = _Enum;
const NominationPoolsClaimPermission = _Enum;
const BagsListEvent = _Enum;
const StakingRewardDestination = _Enum;
const StakingForcing = _Enum;
const UpgradeGoAhead = _Enum;
const UpgradeRestriction = _Enum;
const PreimageOldRequestStatus = _Enum;
const PreimageRequestStatus = _Enum;
const GovernanceOrigin = _Enum;
const BalancesTypesReasons = _Enum;
const WestendRuntimeRuntimeFreezeReason = _Enum;
const NominationPoolsPalletFreezeReason = _Enum;
const TransactionPaymentReleases = _Enum;
const Version = _Enum;
const ClaimsStatementKind = _Enum;
const XcmV3Response = _Enum;
const XcmV3TraitsError = _Enum;
const XcmV4Response = _Enum;
const XcmPalletVersionMigrationStage = _Enum;
const XcmVersionedAssetId = _Enum;
const TreasuryPaymentState = _Enum;
const ConvictionVotingVoteVoting = _Enum;
const VotingConviction = _Enum;
const TraitsScheduleDispatchTime = _Enum;
const ChildBountyStatus = _Enum;
const ReferendaTypesCurve = _Enum;
const MultiAddress = _Enum;
const BalancesAdjustmentDirection = _Enum;
const XcmVersionedXcm = _Enum;
const XcmV3Instruction = _Enum;
const XcmV3MultiassetMultiAssetFilter = _Enum;
const XcmV3MultiassetWildMultiAsset = _Enum;
const XcmV4Instruction = _Enum;
const XcmV4AssetAssetFilter = _Enum;
const XcmV4AssetWildAsset = _Enum;
const NominationPoolsBondExtra = _Enum;
const StakingPalletConfigOpBig = _Enum;
const StakingPalletConfigOp = _Enum;
const NominationPoolsConfigOp = _Enum;
const TransactionValidityUnknownTransaction = _Enum;
const TransactionValidityTransactionSource = _Enum;
const XcmVersionedAsset = _Enum;

const descriptor = { abi: [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "length", "type": "uint256" }], "name": "DataStored", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Deposited", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "oldValue", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newValue", "type": "uint256" }], "name": "ValueStored", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Withdrawn", "type": "event" }, { "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "getBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getStoredData", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getStoredDataLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getStoredValue", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "storeData", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "storeValue", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "storedData", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "storedValue", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalDeposits", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }] };

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  hostApiDemo: descriptor
});

const metadatas = { ["0x8d6a039a69478214c5846f4504e80f3cd3d2374b4c964976b071aececac586fd"]: _allDescriptors };
const getMetadata = async (codeHash) => {
  try {
    return await metadatas[codeHash].getMetadata();
  } catch {
  }
  return null;
};

export { ArithmeticError, BagsListEvent, BalanceStatus, BalancesAdjustmentDirection, BalancesTypesReasons, ChildBountiesEvent, ChildBountyStatus, ClaimsStatementKind, CommonClaimsEvent, ConvictionVotingVoteAccountVote, ConvictionVotingVoteVoting, DigestItem, DispatchClass, GovernanceOrigin, MultiAddress, NominationPoolsBondExtra, NominationPoolsClaimPermission, NominationPoolsCommissionClaimPermission, NominationPoolsConfigOp, NominationPoolsPalletFreezeReason, NominationPoolsPoolState, Phase, PreimageEvent, PreimageOldRequestStatus, PreimagePalletHoldReason, PreimageRequestStatus, PreimagesBounded, ReferendaTypesCurve, StakingForcing, StakingPalletConfigOp, StakingPalletConfigOpBig, StakingRewardDestination, TokenError, TraitsScheduleDispatchTime, TransactionPaymentEvent, TransactionPaymentReleases, TransactionValidityTransactionSource, TransactionValidityUnknownTransaction, TransactionalError, TreasuryPaymentState, UpgradeGoAhead, UpgradeRestriction, Version, VotingConviction, WestendRuntimeRuntimeFreezeReason, XcmPalletVersionMigrationStage, XcmV2JunctionBodyPart, XcmV2MultiassetWildFungibility, XcmV2OriginKind, XcmV3Instruction, XcmV3Junction, XcmV3JunctionBodyId, XcmV3JunctionNetworkId, XcmV3Junctions, XcmV3MaybeErrorCode, XcmV3MultiassetAssetId, XcmV3MultiassetAssetInstance, XcmV3MultiassetFungibility, XcmV3MultiassetMultiAssetFilter, XcmV3MultiassetWildMultiAsset, XcmV3Response, XcmV3TraitsError, XcmV3WeightLimit, XcmV4AssetAssetFilter, XcmV4AssetWildAsset, XcmV4Instruction, XcmV4Response, XcmV5AssetFilter, XcmV5Instruction, XcmV5Junction, XcmV5Junctions, XcmV5NetworkId, XcmV5WildAsset, XcmVersionedAsset, XcmVersionedAssetId, XcmVersionedAssets, XcmVersionedLocation, XcmVersionedXcm, index as contracts, getMetadata, _allDescriptors as paseoHub };
