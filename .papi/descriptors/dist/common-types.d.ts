import { Enum, GetEnum, SizedHex, SS58String, FixedSizeArray, ResultPayload, TxCallData } from "polkadot-api";
type AnonymousEnum<T extends {}> = T & {
    __anonymous: true;
};
type MyTuple<T> = [T, ...T[]];
type SeparateUndefined<T> = undefined extends T ? undefined | Exclude<T, undefined> : T;
type Anonymize<T> = SeparateUndefined<T extends string | number | bigint | boolean | void | undefined | null | symbol | Uint8Array | Enum<any> ? T : T extends AnonymousEnum<infer V> ? Enum<V> : T extends MyTuple<any> ? {
    [K in keyof T]: T[K];
} : T extends [] ? [] : T extends FixedSizeArray<infer L, infer T> ? number extends L ? Array<T> : FixedSizeArray<L, T> : {
    [K in keyof T & string]: T[K];
}>;
export type I5sesotjlssv2d = {
    "nonce": number;
    "consumers": number;
    "providers": number;
    "sufficients": number;
    "data": Anonymize<I1q8tnt1cluu5j>;
};
export type I1q8tnt1cluu5j = {
    "free": bigint;
    "reserved": bigint;
    "frozen": bigint;
    "flags": bigint;
};
export type Iffmde3ekjedi9 = {
    "normal": Anonymize<I4q39t5hn830vp>;
    "operational": Anonymize<I4q39t5hn830vp>;
    "mandatory": Anonymize<I4q39t5hn830vp>;
};
export type I4q39t5hn830vp = {
    "ref_time": bigint;
    "proof_size": bigint;
};
export type I4mddgoa69c0a2 = Array<DigestItem>;
export type DigestItem = Enum<{
    "PreRuntime": Anonymize<I82jm9g7pufuel>;
    "Consensus": Anonymize<I82jm9g7pufuel>;
    "Seal": Anonymize<I82jm9g7pufuel>;
    "Other": Uint8Array;
    "RuntimeEnvironmentUpdated": undefined;
}>;
export declare const DigestItem: GetEnum<DigestItem>;
export type I82jm9g7pufuel = [SizedHex<4>, Uint8Array];
export type Ibh270f2dkuvvj = Array<{
    "phase": Phase;
    "event": Anonymize<Ibm5gc614op21t>;
    "topics": Anonymize<Ic5m5lp1oioo8r>;
}>;
export type Phase = Enum<{
    "ApplyExtrinsic": number;
    "Finalization": undefined;
    "Initialization": undefined;
}>;
export declare const Phase: GetEnum<Phase>;
export type Ibm5gc614op21t = AnonymousEnum<{
    "System": Anonymize<I9klmei7s0dn3p>;
    "ParachainSystem": Anonymize<Icbsekf57miplo>;
    "Preimage": PreimageEvent;
    "Scheduler": Anonymize<I9c3qb8qem1uhn>;
    "Parameters": Anonymize<Iehfcpb8hf71dd>;
    "MultiBlockMigrations": Anonymize<I94co7vj7h6bo>;
    "Balances": Anonymize<Id6ehgrdf2t13l>;
    "TransactionPayment": TransactionPaymentEvent;
    "AssetTxPayment": Anonymize<I78bosroad52fa>;
    "Vesting": Anonymize<I7uu9ebnucfti5>;
    "Claims": CommonClaimsEvent;
    "CollatorSelection": Anonymize<I4srakrmf0fspo>;
    "Session": Anonymize<I6ue0ck5fc3u44>;
    "XcmpQueue": Anonymize<Idsqc7mhp6nnle>;
    "PolkadotXcm": Anonymize<If95hivmqmkiku>;
    "CumulusXcm": Anonymize<I5uv57c3fffoi9>;
    "ToKusamaXcmRouter": Anonymize<Ift4p4jnj5bri1>;
    "MessageQueue": Anonymize<I2kosejppk3jon>;
    "SnowbridgeSystemFrontend": Anonymize<I190sdd2js8aqk>;
    "Utility": Anonymize<I8is2marpm65jd>;
    "Multisig": Anonymize<I83698tk7fspdd>;
    "Proxy": Anonymize<I4ppe871u93ft>;
    "Indices": Anonymize<I2pejk6do5vg4t>;
    "Assets": Anonymize<Id8h717i1g4qqv>;
    "Uniques": Anonymize<Ia0j71vjrjqu9p>;
    "Nfts": Anonymize<I6qicn8jn4fftj>;
    "ForeignAssets": Anonymize<I7r4u2ebvv7606>;
    "PoolAssets": Anonymize<Id8h717i1g4qqv>;
    "AssetConversion": Anonymize<Ievo2o32gc42ng>;
    "Treasury": Anonymize<I4jdb4j2c6meuu>;
    "ConvictionVoting": Anonymize<I7pql8a2uf8mlq>;
    "Referenda": Anonymize<Idfraa3b4eu018>;
    "Whitelist": Anonymize<Iaaki59hl2dj6f>;
    "Bounties": Anonymize<Ialf8tlustkp17>;
    "ChildBounties": ChildBountiesEvent;
    "AssetRate": Anonymize<I1dcjapt414ijf>;
    "MultiAssetBounties": Anonymize<Iflv3gsndvcvub>;
    "StateTrieMigration": Anonymize<I61dksvl51aujo>;
    "NominationPools": Anonymize<Id0dkgikq71n9h>;
    "VoterList": BagsListEvent;
    "DelegatedStaking": Anonymize<I1nq1se98idofq>;
    "StakingRcClient": Anonymize<I7djm8pmbv58rp>;
    "MultiBlockElection": Anonymize<Ic9l18clpms17b>;
    "MultiBlockElectionVerifier": Anonymize<Ia3me59518l5g2>;
    "MultiBlockElectionSigned": Anonymize<I5ljekabnc2mck>;
    "Staking": Anonymize<Ieh305lanrumoh>;
    "Revive": Anonymize<I35og6m8n4kpu0>;
    "Sudo": Anonymize<Idg7fvch4qlaqj>;
    "AhOps": Anonymize<I4f830gria90rg>;
    "AhMigrator": Anonymize<I8rrti4a7t38fc>;
}>;
export type I9klmei7s0dn3p = AnonymousEnum<{
    /**
     * An extrinsic completed successfully.
     */
    "ExtrinsicSuccess": Anonymize<Ia82mnkmeo2rhc>;
    /**
     * An extrinsic failed.
     */
    "ExtrinsicFailed": Anonymize<Id01msqoi1vkdp>;
    /**
     * `:code` was updated.
     */
    "CodeUpdated": undefined;
    /**
     * A new account was created.
     */
    "NewAccount": Anonymize<Icbccs0ug47ilf>;
    /**
     * An account was reaped.
     */
    "KilledAccount": Anonymize<Icbccs0ug47ilf>;
    /**
     * On on-chain remark happened.
     */
    "Remarked": Anonymize<I855j4i3kr8ko1>;
    /**
     * A [`Task`] has started executing
     */
    "TaskStarted": Anonymize<I3m5sq54sjdlso>;
    /**
     * A [`Task`] has finished executing.
     */
    "TaskCompleted": Anonymize<I3m5sq54sjdlso>;
    /**
     * A [`Task`] failed during execution.
     */
    "TaskFailed": Anonymize<I2cren9u3sfqmt>;
    /**
     * An upgrade was authorized.
     */
    "UpgradeAuthorized": Anonymize<Ibgl04rn6nbfm6>;
    /**
     * An invalid authorized upgrade was rejected while trying to apply it.
     */
    "RejectedInvalidAuthorizedUpgrade": Anonymize<I6lk22bu76jt63>;
}>;
export type Ia82mnkmeo2rhc = {
    "dispatch_info": Anonymize<Ic9s8f85vjtncc>;
};
export type Ic9s8f85vjtncc = {
    "weight": Anonymize<I4q39t5hn830vp>;
    "class": DispatchClass;
    "pays_fee": Anonymize<Iehg04bj71rkd>;
};
export type DispatchClass = Enum<{
    "Normal": undefined;
    "Operational": undefined;
    "Mandatory": undefined;
}>;
export declare const DispatchClass: GetEnum<DispatchClass>;
export type Iehg04bj71rkd = AnonymousEnum<{
    "Yes": undefined;
    "No": undefined;
}>;
export type Id01msqoi1vkdp = {
    "dispatch_error": Anonymize<I72ju98lulovhp>;
    "dispatch_info": Anonymize<Ic9s8f85vjtncc>;
};
export type I72ju98lulovhp = AnonymousEnum<{
    "Other": undefined;
    "CannotLookup": undefined;
    "BadOrigin": undefined;
    "Module": Enum<{
        "System": Anonymize<Icl8d9d3sgv21g>;
        "ParachainSystem": Anonymize<Icjkr35j4tmg7k>;
        "Timestamp": undefined;
        "ParachainInfo": undefined;
        "Preimage": Anonymize<I4cfhml1prt4lu>;
        "Scheduler": Anonymize<If7oa8fprnilo5>;
        "Parameters": undefined;
        "MultiBlockMigrations": Anonymize<Iaaqq5jevtahm8>;
        "WeightReclaim": undefined;
        "Balances": Anonymize<Idj13i7adlomht>;
        "TransactionPayment": undefined;
        "AssetTxPayment": undefined;
        "Vesting": Anonymize<Icof2acl69lq3c>;
        "Claims": Anonymize<Ijh2jbbqvb176>;
        "Dap": undefined;
        "Authorship": undefined;
        "CollatorSelection": Anonymize<I36bcffk2387dv>;
        "Session": Anonymize<I1e07dgbaqd1sq>;
        "Aura": undefined;
        "AuraExt": undefined;
        "XcmpQueue": Anonymize<Idnnbndsjjeqqs>;
        "PolkadotXcm": Anonymize<I4vcvo9od6afmt>;
        "CumulusXcm": undefined;
        "ToKusamaXcmRouter": undefined;
        "MessageQueue": Anonymize<I5iupade5ag2dp>;
        "SnowbridgeSystemFrontend": Anonymize<Idqkarp7hi55vf>;
        "Utility": Anonymize<I8dt2g2hcrgh36>;
        "Multisig": Anonymize<Ia76qmhhg4jvb9>;
        "Proxy": Anonymize<Iuvt54ei4cehc>;
        "Indices": Anonymize<Icq1825fru3di2>;
        "Assets": Anonymize<I8ktb7n3252jn5>;
        "Uniques": Anonymize<Ie9ou99obd2hgv>;
        "Nfts": Anonymize<I58r1150kmj18u>;
        "ForeignAssets": Anonymize<I8ktb7n3252jn5>;
        "PoolAssets": Anonymize<I8ktb7n3252jn5>;
        "AssetConversion": Anonymize<I4u78hb23uhvi2>;
        "Treasury": Anonymize<I36uss0m9fpcsf>;
        "ConvictionVoting": Anonymize<Idfa8k8ikssbsf>;
        "Referenda": Anonymize<I84u4ul208g742>;
        "Origins": undefined;
        "Whitelist": Anonymize<I15nctscutpbeh>;
        "Bounties": Anonymize<I6cac4658fiknc>;
        "ChildBounties": Anonymize<I4u5ou5u3tthff>;
        "AssetRate": Anonymize<I3qgd61cgli6cp>;
        "MultiAssetBounties": Anonymize<Idkclbbe1igg42>;
        "StateTrieMigration": Anonymize<I96objte63brjr>;
        "NominationPools": Anonymize<Iuudu4kursojc>;
        "VoterList": Anonymize<I2e4fekrkcdej2>;
        "DelegatedStaking": Anonymize<Iaogv3iimefnis>;
        "StakingRcClient": Anonymize<I1ucg3dr90s1tp>;
        "MultiBlockElection": Anonymize<I6gonitoaqpiua>;
        "MultiBlockElectionVerifier": undefined;
        "MultiBlockElectionUnsigned": undefined;
        "MultiBlockElectionSigned": Anonymize<I9i66md365gdq9>;
        "Staking": Anonymize<Icftpn34uf5f21>;
        "Revive": Anonymize<I54rjnlnsa98ib>;
        "Sudo": Anonymize<Iaug04qjhbli00>;
        "AhOps": Anonymize<Ibl4g7bmj805f>;
        "AhMigrator": Anonymize<Icrtfjqr0ect81>;
    }>;
    "ConsumerRemaining": undefined;
    "NoProviders": undefined;
    "TooManyConsumers": undefined;
    "Token": TokenError;
    "Arithmetic": ArithmeticError;
    "Transactional": TransactionalError;
    "Exhausted": undefined;
    "Corruption": undefined;
    "Unavailable": undefined;
    "RootNotAllowed": undefined;
    "Trie": Enum<{
        "InvalidStateRoot": undefined;
        "IncompleteDatabase": undefined;
        "ValueAtIncompleteKey": undefined;
        "DecoderError": undefined;
        "InvalidHash": undefined;
        "DuplicateKey": undefined;
        "ExtraneousNode": undefined;
        "ExtraneousValue": undefined;
        "ExtraneousHashReference": undefined;
        "InvalidChildReference": undefined;
        "ValueMismatch": undefined;
        "IncompleteProof": undefined;
        "RootMismatch": undefined;
        "DecodeError": undefined;
    }>;
}>;
export type Icl8d9d3sgv21g = AnonymousEnum<{
    /**
     * The name of specification does not match between the current runtime
     * and the new runtime.
     */
    "InvalidSpecName": undefined;
    /**
     * The specification version is not allowed to decrease between the current runtime
     * and the new runtime.
     */
    "SpecVersionNeedsToIncrease": undefined;
    /**
     * Failed to extract the runtime version from the new runtime.
     *
     * Either calling `Core_version` or decoding `RuntimeVersion` failed.
     */
    "FailedToExtractRuntimeVersion": undefined;
    /**
     * Suicide called when the account has non-default composite data.
     */
    "NonDefaultComposite": undefined;
    /**
     * There is a non-zero reference count preventing the account from being purged.
     */
    "NonZeroRefCount": undefined;
    /**
     * The origin filter prevent the call to be dispatched.
     */
    "CallFiltered": undefined;
    /**
     * A multi-block migration is ongoing and prevents the current code from being replaced.
     */
    "MultiBlockMigrationsOngoing": undefined;
    /**
     * The specified [`Task`] is not valid.
     */
    "InvalidTask": undefined;
    /**
     * The specified [`Task`] failed during execution.
     */
    "FailedTask": undefined;
    /**
     * No upgrade authorized.
     */
    "NothingAuthorized": undefined;
    /**
     * The submitted code is not authorized.
     */
    "Unauthorized": undefined;
}>;
export type Icjkr35j4tmg7k = AnonymousEnum<{
    /**
     * Attempt to upgrade validation function while existing upgrade pending.
     */
    "OverlappingUpgrades": undefined;
    /**
     * Polkadot currently prohibits this parachain from upgrading its validation function.
     */
    "ProhibitedByPolkadot": undefined;
    /**
     * The supplied validation function has compiled into a blob larger than Polkadot is
     * willing to run.
     */
    "TooBig": undefined;
    /**
     * The inherent which supplies the validation data did not run this block.
     */
    "ValidationDataNotAvailable": undefined;
    /**
     * The inherent which supplies the host configuration did not run this block.
     */
    "HostConfigurationNotAvailable": undefined;
    /**
     * No validation function upgrade is currently scheduled.
     */
    "NotScheduled": undefined;
}>;
export type I4cfhml1prt4lu = AnonymousEnum<{
    /**
     * Preimage is too large to store on-chain.
     */
    "TooBig": undefined;
    /**
     * Preimage has already been noted on-chain.
     */
    "AlreadyNoted": undefined;
    /**
     * The user is not authorized to perform this action.
     */
    "NotAuthorized": undefined;
    /**
     * The preimage cannot be removed since it has not yet been noted.
     */
    "NotNoted": undefined;
    /**
     * A preimage may not be removed when there are outstanding requests.
     */
    "Requested": undefined;
    /**
     * The preimage request cannot be removed since no outstanding requests exist.
     */
    "NotRequested": undefined;
    /**
     * More than `MAX_HASH_UPGRADE_BULK_COUNT` hashes were requested to be upgraded at once.
     */
    "TooMany": undefined;
    /**
     * Too few hashes were requested to be upgraded (i.e. zero).
     */
    "TooFew": undefined;
}>;
export type If7oa8fprnilo5 = AnonymousEnum<{
    /**
     * Failed to schedule a call
     */
    "FailedToSchedule": undefined;
    /**
     * Cannot find the scheduled call.
     */
    "NotFound": undefined;
    /**
     * Given target block number is in the past.
     */
    "TargetBlockNumberInPast": undefined;
    /**
     * Reschedule failed because it does not change scheduled time.
     */
    "RescheduleNoChange": undefined;
    /**
     * Attempt to use a non-named function on a named task.
     */
    "Named": undefined;
}>;
export type Iaaqq5jevtahm8 = AnonymousEnum<{
    /**
     * The operation cannot complete since some MBMs are ongoing.
     */
    "Ongoing": undefined;
}>;
export type Idj13i7adlomht = AnonymousEnum<{
    /**
     * Vesting balance too high to send value.
     */
    "VestingBalance": undefined;
    /**
     * Account liquidity restrictions prevent withdrawal.
     */
    "LiquidityRestrictions": undefined;
    /**
     * Balance too low to send value.
     */
    "InsufficientBalance": undefined;
    /**
     * Value too low to create account due to existential deposit.
     */
    "ExistentialDeposit": undefined;
    /**
     * Transfer/payment would kill account.
     */
    "Expendability": undefined;
    /**
     * A vesting schedule already exists for this account.
     */
    "ExistingVestingSchedule": undefined;
    /**
     * Beneficiary account must pre-exist.
     */
    "DeadAccount": undefined;
    /**
     * Number of named reserves exceed `MaxReserves`.
     */
    "TooManyReserves": undefined;
    /**
     * Number of holds exceed `VariantCountOf<T::RuntimeHoldReason>`.
     */
    "TooManyHolds": undefined;
    /**
     * Number of freezes exceed `MaxFreezes`.
     */
    "TooManyFreezes": undefined;
    /**
     * The issuance cannot be modified since it is already deactivated.
     */
    "IssuanceDeactivated": undefined;
    /**
     * The delta cannot be zero.
     */
    "DeltaZero": undefined;
}>;
export type Icof2acl69lq3c = AnonymousEnum<{
    /**
     * The account given is not vesting.
     */
    "NotVesting": undefined;
    /**
     * The account already has `MaxVestingSchedules` count of schedules and thus
     * cannot add another one. Consider merging existing schedules in order to add another.
     */
    "AtMaxVestingSchedules": undefined;
    /**
     * Amount being transferred is too low to create a vesting schedule.
     */
    "AmountLow": undefined;
    /**
     * An index was out of bounds of the vesting schedules.
     */
    "ScheduleIndexOutOfBounds": undefined;
    /**
     * Failed to create a new schedule because some parameter was invalid.
     */
    "InvalidScheduleParams": undefined;
}>;
export type Ijh2jbbqvb176 = AnonymousEnum<{
    /**
     * Invalid Ethereum signature.
     */
    "InvalidEthereumSignature": undefined;
    /**
     * Ethereum address has no claim.
     */
    "SignerHasNoClaim": undefined;
    /**
     * Account ID sending transaction has no claim.
     */
    "SenderHasNoClaim": undefined;
    /**
     * There's not enough in the pot to pay out some unvested amount. Generally implies a
     * logic error.
     */
    "PotUnderflow": undefined;
    /**
     * A needed statement was not included.
     */
    "InvalidStatement": undefined;
    /**
     * The account already has a vested balance.
     */
    "VestedBalanceExists": undefined;
}>;
export type I36bcffk2387dv = AnonymousEnum<{
    /**
     * The pallet has too many candidates.
     */
    "TooManyCandidates": undefined;
    /**
     * Leaving would result in too few candidates.
     */
    "TooFewEligibleCollators": undefined;
    /**
     * Account is already a candidate.
     */
    "AlreadyCandidate": undefined;
    /**
     * Account is not a candidate.
     */
    "NotCandidate": undefined;
    /**
     * There are too many Invulnerables.
     */
    "TooManyInvulnerables": undefined;
    /**
     * Account is already an Invulnerable.
     */
    "AlreadyInvulnerable": undefined;
    /**
     * Account is not an Invulnerable.
     */
    "NotInvulnerable": undefined;
    /**
     * Account has no associated validator ID.
     */
    "NoAssociatedValidatorId": undefined;
    /**
     * Validator ID is not yet registered.
     */
    "ValidatorNotRegistered": undefined;
    /**
     * Could not insert in the candidate list.
     */
    "InsertToCandidateListFailed": undefined;
    /**
     * Could not remove from the candidate list.
     */
    "RemoveFromCandidateListFailed": undefined;
    /**
     * New deposit amount would be below the minimum candidacy bond.
     */
    "DepositTooLow": undefined;
    /**
     * Could not update the candidate list.
     */
    "UpdateCandidateListFailed": undefined;
    /**
     * Deposit amount is too low to take the target's slot in the candidate list.
     */
    "InsufficientBond": undefined;
    /**
     * The target account to be replaced in the candidate list is not a candidate.
     */
    "TargetIsNotCandidate": undefined;
    /**
     * The updated deposit amount is equal to the amount already reserved.
     */
    "IdenticalDeposit": undefined;
    /**
     * Cannot lower candidacy bond while occupying a future collator slot in the list.
     */
    "InvalidUnreserve": undefined;
}>;
export type I1e07dgbaqd1sq = AnonymousEnum<{
    /**
     * Invalid ownership proof.
     */
    "InvalidProof": undefined;
    /**
     * No associated validator ID for account.
     */
    "NoAssociatedValidatorId": undefined;
    /**
     * Registered duplicate key.
     */
    "DuplicatedKey": undefined;
    /**
     * No keys are associated with this account.
     */
    "NoKeys": undefined;
    /**
     * Key setting account is not live, so it's impossible to associate keys.
     */
    "NoAccount": undefined;
}>;
export type Idnnbndsjjeqqs = AnonymousEnum<{
    /**
     * Setting the queue config failed since one of its values was invalid.
     */
    "BadQueueConfig": undefined;
    /**
     * The execution is already suspended.
     */
    "AlreadySuspended": undefined;
    /**
     * The execution is already resumed.
     */
    "AlreadyResumed": undefined;
    /**
     * There are too many active outbound channels.
     */
    "TooManyActiveOutboundChannels": undefined;
    /**
     * The message is too big.
     */
    "TooBig": undefined;
}>;
export type I4vcvo9od6afmt = AnonymousEnum<{
    /**
     * The desired destination was unreachable, generally because there is a no way of routing
     * to it.
     */
    "Unreachable": undefined;
    /**
     * There was some other issue (i.e. not to do with routing) in sending the message.
     * Perhaps a lack of space for buffering the message.
     */
    "SendFailure": undefined;
    /**
     * The message execution fails the filter.
     */
    "Filtered": undefined;
    /**
     * The message's weight could not be determined.
     */
    "UnweighableMessage": undefined;
    /**
     * The destination `Location` provided cannot be inverted.
     */
    "DestinationNotInvertible": undefined;
    /**
     * The assets to be sent are empty.
     */
    "Empty": undefined;
    /**
     * Could not re-anchor the assets to declare the fees for the destination chain.
     */
    "CannotReanchor": undefined;
    /**
     * Too many assets have been attempted for transfer.
     */
    "TooManyAssets": undefined;
    /**
     * Origin is invalid for sending.
     */
    "InvalidOrigin": undefined;
    /**
     * The version of the `Versioned` value used is not able to be interpreted.
     */
    "BadVersion": undefined;
    /**
     * The given location could not be used (e.g. because it cannot be expressed in the
     * desired version of XCM).
     */
    "BadLocation": undefined;
    /**
     * The referenced subscription could not be found.
     */
    "NoSubscription": undefined;
    /**
     * The location is invalid since it already has a subscription from us.
     */
    "AlreadySubscribed": undefined;
    /**
     * Could not check-out the assets for teleportation to the destination chain.
     */
    "CannotCheckOutTeleport": undefined;
    /**
     * The owner does not own (all) of the asset that they wish to do the operation on.
     */
    "LowBalance": undefined;
    /**
     * The asset owner has too many locks on the asset.
     */
    "TooManyLocks": undefined;
    /**
     * The given account is not an identifiable sovereign account for any location.
     */
    "AccountNotSovereign": undefined;
    /**
     * The operation required fees to be paid which the initiator could not meet.
     */
    "FeesNotMet": undefined;
    /**
     * A remote lock with the corresponding data could not be found.
     */
    "LockNotFound": undefined;
    /**
     * The unlock operation cannot succeed because there are still consumers of the lock.
     */
    "InUse": undefined;
    /**
     * Invalid asset, reserve chain could not be determined for it.
     */
    "InvalidAssetUnknownReserve": undefined;
    /**
     * Invalid asset, do not support remote asset reserves with different fees reserves.
     */
    "InvalidAssetUnsupportedReserve": undefined;
    /**
     * Too many assets with different reserve locations have been attempted for transfer.
     */
    "TooManyReserves": undefined;
    /**
     * Local XCM execution incomplete.
     */
    "LocalExecutionIncomplete": undefined;
    /**
     * Too many locations authorized to alias origin.
     */
    "TooManyAuthorizedAliases": undefined;
    /**
     * Expiry block number is in the past.
     */
    "ExpiresInPast": undefined;
    /**
     * The alias to remove authorization for was not found.
     */
    "AliasNotFound": undefined;
    /**
     * Local XCM execution incomplete with the actual XCM error and the index of the
     * instruction that caused the error.
     */
    "LocalExecutionIncompleteWithError": Anonymize<I5r8t4iaend96p>;
}>;
export type I5r8t4iaend96p = {
    "index": number;
    "error": Enum<{
        "Overflow": undefined;
        "Unimplemented": undefined;
        "UntrustedReserveLocation": undefined;
        "UntrustedTeleportLocation": undefined;
        "LocationFull": undefined;
        "LocationNotInvertible": undefined;
        "BadOrigin": undefined;
        "InvalidLocation": undefined;
        "AssetNotFound": undefined;
        "FailedToTransactAsset": undefined;
        "NotWithdrawable": undefined;
        "LocationCannotHold": undefined;
        "ExceedsMaxMessageSize": undefined;
        "DestinationUnsupported": undefined;
        "Transport": undefined;
        "Unroutable": undefined;
        "UnknownClaim": undefined;
        "FailedToDecode": undefined;
        "MaxWeightInvalid": undefined;
        "NotHoldingFees": undefined;
        "TooExpensive": undefined;
        "Trap": undefined;
        "ExpectationFalse": undefined;
        "PalletNotFound": undefined;
        "NameMismatch": undefined;
        "VersionIncompatible": undefined;
        "HoldingWouldOverflow": undefined;
        "ExportError": undefined;
        "ReanchorFailed": undefined;
        "NoDeal": undefined;
        "FeesNotMet": undefined;
        "LockError": undefined;
        "NoPermission": undefined;
        "Unanchored": undefined;
        "NotDepositable": undefined;
        "TooManyAssets": undefined;
        "UnhandledXcmVersion": undefined;
        "WeightLimitReached": undefined;
        "Barrier": undefined;
        "WeightNotComputable": undefined;
        "ExceedsStackLimit": undefined;
    }>;
};
export type I5iupade5ag2dp = AnonymousEnum<{
    /**
     * Page is not reapable because it has items remaining to be processed and is not old
     * enough.
     */
    "NotReapable": undefined;
    /**
     * Page to be reaped does not exist.
     */
    "NoPage": undefined;
    /**
     * The referenced message could not be found.
     */
    "NoMessage": undefined;
    /**
     * The message was already processed and cannot be processed again.
     */
    "AlreadyProcessed": undefined;
    /**
     * The message is queued for future execution.
     */
    "Queued": undefined;
    /**
     * There is temporarily not enough weight to continue servicing messages.
     */
    "InsufficientWeight": undefined;
    /**
     * This message is temporarily unprocessable.
     *
     * Such errors are expected, but not guaranteed, to resolve themselves eventually through
     * retrying.
     */
    "TemporarilyUnprocessable": undefined;
    /**
     * The queue is paused and no message can be executed from it.
     *
     * This can change at any time and may resolve in the future by re-trying.
     */
    "QueuePaused": undefined;
    /**
     * Another call is in progress and needs to finish before this call can happen.
     */
    "RecursiveDisallowed": undefined;
}>;
export type Idqkarp7hi55vf = AnonymousEnum<{
    /**
     * Convert versioned location failure
     */
    "UnsupportedLocationVersion": undefined;
    /**
     * Check location failure, should start from the dispatch origin as owner
     */
    "InvalidAssetOwner": undefined;
    /**
     * Send xcm message failure
     */
    "SendFailure": undefined;
    /**
     * Withdraw fee asset failure
     */
    "FeesNotMet": undefined;
    /**
     * Convert to reanchored location failure
     */
    "LocationConversionFailed": undefined;
    /**
     * Message export is halted
     */
    "Halted": undefined;
    /**
     * The desired destination was unreachable, generally because there is a no way of routing
     * to it.
     */
    "Unreachable": undefined;
    /**
     * The asset provided for the tip is unsupported.
     */
    "UnsupportedAsset": undefined;
    /**
     * Unable to withdraw asset.
     */
    "WithdrawError": undefined;
    /**
     * Account could not be converted to a location.
     */
    "InvalidAccount": undefined;
    /**
     * Provided tip asset could not be swapped for ether.
     */
    "SwapError": undefined;
    /**
     * Ether could not be burned.
     */
    "BurnError": undefined;
    /**
     * The tip provided is zero.
     */
    "TipAmountZero": undefined;
}>;
export type I8dt2g2hcrgh36 = AnonymousEnum<{
    /**
     * Too many calls batched.
     */
    "TooManyCalls": undefined;
}>;
export type Ia76qmhhg4jvb9 = AnonymousEnum<{
    /**
     * Threshold must be 2 or greater.
     */
    "MinimumThreshold": undefined;
    /**
     * Call is already approved by this signatory.
     */
    "AlreadyApproved": undefined;
    /**
     * Call doesn't need any (more) approvals.
     */
    "NoApprovalsNeeded": undefined;
    /**
     * There are too few signatories in the list.
     */
    "TooFewSignatories": undefined;
    /**
     * There are too many signatories in the list.
     */
    "TooManySignatories": undefined;
    /**
     * The signatories were provided out of order; they should be ordered.
     */
    "SignatoriesOutOfOrder": undefined;
    /**
     * The sender was contained in the other signatories; it shouldn't be.
     */
    "SenderInSignatories": undefined;
    /**
     * Multisig operation not found in storage.
     */
    "NotFound": undefined;
    /**
     * Only the account that originally created the multisig is able to cancel it or update
     * its deposits.
     */
    "NotOwner": undefined;
    /**
     * No timepoint was given, yet the multisig operation is already underway.
     */
    "NoTimepoint": undefined;
    /**
     * A different timepoint was given to the multisig operation that is underway.
     */
    "WrongTimepoint": undefined;
    /**
     * A timepoint was given, yet no multisig operation is underway.
     */
    "UnexpectedTimepoint": undefined;
    /**
     * The maximum weight information provided was too low.
     */
    "MaxWeightTooLow": undefined;
    /**
     * The data to be stored is already stored.
     */
    "AlreadyStored": undefined;
}>;
export type Iuvt54ei4cehc = AnonymousEnum<{
    /**
     * There are too many proxies registered or too many announcements pending.
     */
    "TooMany": undefined;
    /**
     * Proxy registration not found.
     */
    "NotFound": undefined;
    /**
     * Sender is not a proxy of the account to be proxied.
     */
    "NotProxy": undefined;
    /**
     * A call which is incompatible with the proxy type's filter was attempted.
     */
    "Unproxyable": undefined;
    /**
     * Account is already a proxy.
     */
    "Duplicate": undefined;
    /**
     * Call may not be made by proxy because it may escalate its privileges.
     */
    "NoPermission": undefined;
    /**
     * Announcement, if made at all, was made too recently.
     */
    "Unannounced": undefined;
    /**
     * Cannot add self as proxy.
     */
    "NoSelfProxy": undefined;
}>;
export type Icq1825fru3di2 = AnonymousEnum<{
    /**
     * The index was not already assigned.
     */
    "NotAssigned": undefined;
    /**
     * The index is assigned to another account.
     */
    "NotOwner": undefined;
    /**
     * The index was not available.
     */
    "InUse": undefined;
    /**
     * The source and destination accounts are identical.
     */
    "NotTransfer": undefined;
    /**
     * The index is permanent and may not be freed/changed.
     */
    "Permanent": undefined;
}>;
export type I8ktb7n3252jn5 = AnonymousEnum<{
    /**
     * Account balance must be greater than or equal to the transfer amount.
     */
    "BalanceLow": undefined;
    /**
     * The account to alter does not exist.
     */
    "NoAccount": undefined;
    /**
     * The signing account has no permission to do the operation.
     */
    "NoPermission": undefined;
    /**
     * The given asset ID is unknown.
     */
    "Unknown": undefined;
    /**
     * The origin account is frozen.
     */
    "Frozen": undefined;
    /**
     * The asset ID is already taken.
     */
    "InUse": undefined;
    /**
     * Invalid witness data given.
     */
    "BadWitness": undefined;
    /**
     * Minimum balance should be non-zero.
     */
    "MinBalanceZero": undefined;
    /**
     * Unable to increment the consumer reference counters on the account. Either no provider
     * reference exists to allow a non-zero balance of a non-self-sufficient asset, or one
     * fewer then the maximum number of consumers has been reached.
     */
    "UnavailableConsumer": undefined;
    /**
     * Invalid metadata given.
     */
    "BadMetadata": undefined;
    /**
     * No approval exists that would allow the transfer.
     */
    "Unapproved": undefined;
    /**
     * The source account would not survive the transfer and it needs to stay alive.
     */
    "WouldDie": undefined;
    /**
     * The asset-account already exists.
     */
    "AlreadyExists": undefined;
    /**
     * The asset-account doesn't have an associated deposit.
     */
    "NoDeposit": undefined;
    /**
     * The operation would result in funds being burned.
     */
    "WouldBurn": undefined;
    /**
     * The asset is a live asset and is actively being used. Usually emit for operations such
     * as `start_destroy` which require the asset to be in a destroying state.
     */
    "LiveAsset": undefined;
    /**
     * The asset is not live, and likely being destroyed.
     */
    "AssetNotLive": undefined;
    /**
     * The asset status is not the expected status.
     */
    "IncorrectStatus": undefined;
    /**
     * The asset should be frozen before the given operation.
     */
    "NotFrozen": undefined;
    /**
     * Callback action resulted in error
     */
    "CallbackFailed": undefined;
    /**
     * The asset ID must be equal to the [`NextAssetId`].
     */
    "BadAssetId": undefined;
    /**
     * The asset cannot be destroyed because some accounts for this asset contain freezes.
     */
    "ContainsFreezes": undefined;
    /**
     * The asset cannot be destroyed because some accounts for this asset contain holds.
     */
    "ContainsHolds": undefined;
    /**
     * Tried setting too many reserves.
     */
    "TooManyReserves": undefined;
}>;
export type Ie9ou99obd2hgv = AnonymousEnum<{
    /**
     * The signing account has no permission to do the operation.
     */
    "NoPermission": undefined;
    /**
     * The given item ID is unknown.
     */
    "UnknownCollection": undefined;
    /**
     * The item ID has already been used for an item.
     */
    "AlreadyExists": undefined;
    /**
     * The owner turned out to be different to what was expected.
     */
    "WrongOwner": undefined;
    /**
     * Invalid witness data given.
     */
    "BadWitness": undefined;
    /**
     * The item ID is already taken.
     */
    "InUse": undefined;
    /**
     * The item or collection is frozen.
     */
    "Frozen": undefined;
    /**
     * The delegate turned out to be different to what was expected.
     */
    "WrongDelegate": undefined;
    /**
     * There is no delegate approved.
     */
    "NoDelegate": undefined;
    /**
     * No approval exists that would allow the transfer.
     */
    "Unapproved": undefined;
    /**
     * The named owner has not signed ownership of the collection is acceptable.
     */
    "Unaccepted": undefined;
    /**
     * The item is locked.
     */
    "Locked": undefined;
    /**
     * All items have been minted.
     */
    "MaxSupplyReached": undefined;
    /**
     * The max supply has already been set.
     */
    "MaxSupplyAlreadySet": undefined;
    /**
     * The provided max supply is less to the amount of items a collection already has.
     */
    "MaxSupplyTooSmall": undefined;
    /**
     * The given item ID is unknown.
     */
    "UnknownItem": undefined;
    /**
     * Item is not for sale.
     */
    "NotForSale": undefined;
    /**
     * The provided bid is too low.
     */
    "BidTooLow": undefined;
    /**
     * No metadata is found.
     */
    "NoMetadata": undefined;
    /**
     * Wrong metadata key/value bytes supplied.
     */
    "WrongMetadata": undefined;
    /**
     * An attribute is not found.
     */
    "AttributeNotFound": undefined;
    /**
     * Wrong attribute key/value bytes supplied.
     */
    "WrongAttribute": undefined;
}>;
export type I58r1150kmj18u = AnonymousEnum<{
    /**
     * The signing account has no permission to do the operation.
     */
    "NoPermission": undefined;
    /**
     * The given item ID is unknown.
     */
    "UnknownCollection": undefined;
    /**
     * The item ID has already been used for an item.
     */
    "AlreadyExists": undefined;
    /**
     * The approval had a deadline that expired, so the approval isn't valid anymore.
     */
    "ApprovalExpired": undefined;
    /**
     * The owner turned out to be different to what was expected.
     */
    "WrongOwner": undefined;
    /**
     * The witness data given does not match the current state of the chain.
     */
    "BadWitness": undefined;
    /**
     * Collection ID is already taken.
     */
    "CollectionIdInUse": undefined;
    /**
     * Items within that collection are non-transferable.
     */
    "ItemsNonTransferable": undefined;
    /**
     * The provided account is not a delegate.
     */
    "NotDelegate": undefined;
    /**
     * The delegate turned out to be different to what was expected.
     */
    "WrongDelegate": undefined;
    /**
     * No approval exists that would allow the transfer.
     */
    "Unapproved": undefined;
    /**
     * The named owner has not signed ownership acceptance of the collection.
     */
    "Unaccepted": undefined;
    /**
     * The item is locked (non-transferable).
     */
    "ItemLocked": undefined;
    /**
     * Item's attributes are locked.
     */
    "LockedItemAttributes": undefined;
    /**
     * Collection's attributes are locked.
     */
    "LockedCollectionAttributes": undefined;
    /**
     * Item's metadata is locked.
     */
    "LockedItemMetadata": undefined;
    /**
     * Collection's metadata is locked.
     */
    "LockedCollectionMetadata": undefined;
    /**
     * All items have been minted.
     */
    "MaxSupplyReached": undefined;
    /**
     * The max supply is locked and can't be changed.
     */
    "MaxSupplyLocked": undefined;
    /**
     * The provided max supply is less than the number of items a collection already has.
     */
    "MaxSupplyTooSmall": undefined;
    /**
     * The given item ID is unknown.
     */
    "UnknownItem": undefined;
    /**
     * Swap doesn't exist.
     */
    "UnknownSwap": undefined;
    /**
     * The given item has no metadata set.
     */
    "MetadataNotFound": undefined;
    /**
     * The provided attribute can't be found.
     */
    "AttributeNotFound": undefined;
    /**
     * Item is not for sale.
     */
    "NotForSale": undefined;
    /**
     * The provided bid is too low.
     */
    "BidTooLow": undefined;
    /**
     * The item has reached its approval limit.
     */
    "ReachedApprovalLimit": undefined;
    /**
     * The deadline has already expired.
     */
    "DeadlineExpired": undefined;
    /**
     * The duration provided should be less than or equal to `MaxDeadlineDuration`.
     */
    "WrongDuration": undefined;
    /**
     * The method is disabled by system settings.
     */
    "MethodDisabled": undefined;
    /**
     * The provided setting can't be set.
     */
    "WrongSetting": undefined;
    /**
     * Item's config already exists and should be equal to the provided one.
     */
    "InconsistentItemConfig": undefined;
    /**
     * Config for a collection or an item can't be found.
     */
    "NoConfig": undefined;
    /**
     * Some roles were not cleared.
     */
    "RolesNotCleared": undefined;
    /**
     * Mint has not started yet.
     */
    "MintNotStarted": undefined;
    /**
     * Mint has already ended.
     */
    "MintEnded": undefined;
    /**
     * The provided Item was already used for claiming.
     */
    "AlreadyClaimed": undefined;
    /**
     * The provided data is incorrect.
     */
    "IncorrectData": undefined;
    /**
     * The extrinsic was sent by the wrong origin.
     */
    "WrongOrigin": undefined;
    /**
     * The provided signature is incorrect.
     */
    "WrongSignature": undefined;
    /**
     * The provided metadata might be too long.
     */
    "IncorrectMetadata": undefined;
    /**
     * Can't set more attributes per one call.
     */
    "MaxAttributesLimitReached": undefined;
    /**
     * The provided namespace isn't supported in this call.
     */
    "WrongNamespace": undefined;
    /**
     * Can't delete non-empty collections.
     */
    "CollectionNotEmpty": undefined;
    /**
     * The witness data should be provided.
     */
    "WitnessRequired": undefined;
}>;
export type I4u78hb23uhvi2 = AnonymousEnum<{
    /**
     * Provided asset pair is not supported for pool.
     */
    "InvalidAssetPair": undefined;
    /**
     * Pool already exists.
     */
    "PoolExists": undefined;
    /**
     * Desired amount can't be zero.
     */
    "WrongDesiredAmount": undefined;
    /**
     * Provided amount should be greater than or equal to the existential deposit/asset's
     * minimal amount.
     */
    "AmountOneLessThanMinimal": undefined;
    /**
     * Provided amount should be greater than or equal to the existential deposit/asset's
     * minimal amount.
     */
    "AmountTwoLessThanMinimal": undefined;
    /**
     * Reserve needs to always be greater than or equal to the existential deposit/asset's
     * minimal amount.
     */
    "ReserveLeftLessThanMinimal": undefined;
    /**
     * Desired amount can't be equal to the pool reserve.
     */
    "AmountOutTooHigh": undefined;
    /**
     * The pool doesn't exist.
     */
    "PoolNotFound": undefined;
    /**
     * An overflow happened.
     */
    "Overflow": undefined;
    /**
     * The minimal amount requirement for the first token in the pair wasn't met.
     */
    "AssetOneDepositDidNotMeetMinimum": undefined;
    /**
     * The minimal amount requirement for the second token in the pair wasn't met.
     */
    "AssetTwoDepositDidNotMeetMinimum": undefined;
    /**
     * The minimal amount requirement for the first token in the pair wasn't met.
     */
    "AssetOneWithdrawalDidNotMeetMinimum": undefined;
    /**
     * The minimal amount requirement for the second token in the pair wasn't met.
     */
    "AssetTwoWithdrawalDidNotMeetMinimum": undefined;
    /**
     * Optimal calculated amount is less than desired.
     */
    "OptimalAmountLessThanDesired": undefined;
    /**
     * Insufficient liquidity minted.
     */
    "InsufficientLiquidityMinted": undefined;
    /**
     * Requested liquidity can't be zero.
     */
    "ZeroLiquidity": undefined;
    /**
     * Amount can't be zero.
     */
    "ZeroAmount": undefined;
    /**
     * Calculated amount out is less than provided minimum amount.
     */
    "ProvidedMinimumNotSufficientForSwap": undefined;
    /**
     * Provided maximum amount is not sufficient for swap.
     */
    "ProvidedMaximumNotSufficientForSwap": undefined;
    /**
     * The provided path must consists of 2 assets at least.
     */
    "InvalidPath": undefined;
    /**
     * The provided path must consists of unique assets.
     */
    "NonUniquePath": undefined;
    /**
     * It was not possible to get or increment the Id of the pool.
     */
    "IncorrectPoolAssetId": undefined;
    /**
     * The destination account cannot exist with the swapped funds.
     */
    "BelowMinimum": undefined;
}>;
export type I36uss0m9fpcsf = AnonymousEnum<{
    /**
     * No proposal, bounty or spend at that index.
     */
    "InvalidIndex": undefined;
    /**
     * Too many approvals in the queue.
     */
    "TooManyApprovals": undefined;
    /**
     * The spend origin is valid but the amount it is allowed to spend is lower than the
     * amount to be spent.
     */
    "InsufficientPermission": undefined;
    /**
     * Proposal has not been approved.
     */
    "ProposalNotApproved": undefined;
    /**
     * The balance of the asset kind is not convertible to the balance of the native asset.
     */
    "FailedToConvertBalance": undefined;
    /**
     * The spend has expired and cannot be claimed.
     */
    "SpendExpired": undefined;
    /**
     * The spend is not yet eligible for payout.
     */
    "EarlyPayout": undefined;
    /**
     * The payment has already been attempted.
     */
    "AlreadyAttempted": undefined;
    /**
     * There was some issue with the mechanism of payment.
     */
    "PayoutError": undefined;
    /**
     * The payout was not yet attempted/claimed.
     */
    "NotAttempted": undefined;
    /**
     * The payment has neither failed nor succeeded yet.
     */
    "Inconclusive": undefined;
}>;
export type Idfa8k8ikssbsf = AnonymousEnum<{
    /**
     * Poll is not ongoing.
     */
    "NotOngoing": undefined;
    /**
     * The given account did not vote on the poll.
     */
    "NotVoter": undefined;
    /**
     * The actor has no permission to conduct the action.
     */
    "NoPermission": undefined;
    /**
     * The actor has no permission to conduct the action right now but will do in the future.
     */
    "NoPermissionYet": undefined;
    /**
     * The account is already delegating.
     */
    "AlreadyDelegating": undefined;
    /**
     * The account currently has votes attached to it and the operation cannot succeed until
     * these are removed through `remove_vote`.
     */
    "AlreadyVoting": undefined;
    /**
     * Too high a balance was provided that the account cannot afford.
     */
    "InsufficientFunds": undefined;
    /**
     * The account is not currently delegating.
     */
    "NotDelegating": undefined;
    /**
     * Delegation to oneself makes no sense.
     */
    "Nonsense": undefined;
    /**
     * Maximum number of votes reached.
     */
    "MaxVotesReached": undefined;
    /**
     * The class must be supplied since it is not easily determinable from the state.
     */
    "ClassNeeded": undefined;
    /**
     * The class ID supplied is invalid.
     */
    "BadClass": undefined;
}>;
export type I84u4ul208g742 = AnonymousEnum<{
    /**
     * Referendum is not ongoing.
     */
    "NotOngoing": undefined;
    /**
     * Referendum's decision deposit is already paid.
     */
    "HasDeposit": undefined;
    /**
     * The track identifier given was invalid.
     */
    "BadTrack": undefined;
    /**
     * There are already a full complement of referenda in progress for this track.
     */
    "Full": undefined;
    /**
     * The queue of the track is empty.
     */
    "QueueEmpty": undefined;
    /**
     * The referendum index provided is invalid in this context.
     */
    "BadReferendum": undefined;
    /**
     * There was nothing to do in the advancement.
     */
    "NothingToDo": undefined;
    /**
     * No track exists for the proposal origin.
     */
    "NoTrack": undefined;
    /**
     * Any deposit cannot be refunded until after the decision is over.
     */
    "Unfinished": undefined;
    /**
     * The deposit refunder is not the depositor.
     */
    "NoPermission": undefined;
    /**
     * The deposit cannot be refunded since none was made.
     */
    "NoDeposit": undefined;
    /**
     * The referendum status is invalid for this operation.
     */
    "BadStatus": undefined;
    /**
     * The preimage does not exist.
     */
    "PreimageNotExist": undefined;
    /**
     * The preimage is stored with a different length than the one provided.
     */
    "PreimageStoredWithDifferentLength": undefined;
}>;
export type I15nctscutpbeh = AnonymousEnum<{
    /**
     * The preimage of the call hash could not be loaded.
     */
    "UnavailablePreImage": undefined;
    /**
     * The call could not be decoded.
     */
    "UndecodableCall": undefined;
    /**
     * The weight of the decoded call was higher than the witness.
     */
    "InvalidCallWeightWitness": undefined;
    /**
     * The call was not whitelisted.
     */
    "CallIsNotWhitelisted": undefined;
    /**
     * The call was already whitelisted; No-Op.
     */
    "CallAlreadyWhitelisted": undefined;
}>;
export type I6cac4658fiknc = AnonymousEnum<{
    /**
     * Proposer's balance is too low.
     */
    "InsufficientProposersBalance": undefined;
    /**
     * No proposal or bounty at that index.
     */
    "InvalidIndex": undefined;
    /**
     * The reason given is just too big.
     */
    "ReasonTooBig": undefined;
    /**
     * The bounty status is unexpected.
     */
    "UnexpectedStatus": undefined;
    /**
     * Require bounty curator.
     */
    "RequireCurator": undefined;
    /**
     * Invalid bounty value.
     */
    "InvalidValue": undefined;
    /**
     * Invalid bounty fee.
     */
    "InvalidFee": undefined;
    /**
     * A bounty payout is pending.
     * To cancel the bounty, you must unassign and slash the curator.
     */
    "PendingPayout": undefined;
    /**
     * The bounties cannot be claimed/closed because it's still in the countdown period.
     */
    "Premature": undefined;
    /**
     * The bounty cannot be closed because it has active child bounties.
     */
    "HasActiveChildBounty": undefined;
    /**
     * Too many approvals are already queued.
     */
    "TooManyQueued": undefined;
    /**
     * User is not the proposer of the bounty.
     */
    "NotProposer": undefined;
}>;
export type I4u5ou5u3tthff = AnonymousEnum<{
    /**
     * The parent bounty is not in active state.
     */
    "ParentBountyNotActive": undefined;
    /**
     * The bounty balance is not enough to add new child-bounty.
     */
    "InsufficientBountyBalance": undefined;
    /**
     * Number of child bounties exceeds limit `MaxActiveChildBountyCount`.
     */
    "TooManyChildBounties": undefined;
}>;
export type I3qgd61cgli6cp = AnonymousEnum<{
    /**
     * The given asset ID is unknown.
     */
    "UnknownAssetKind": undefined;
    /**
     * The given asset ID already has an assigned conversion rate and cannot be re-created.
     */
    "AlreadyExists": undefined;
    /**
     * Overflow ocurred when calculating the inverse rate.
     */
    "Overflow": undefined;
}>;
export type Idkclbbe1igg42 = AnonymousEnum<{
    /**
     * No child-/bounty at that index.
     */
    "InvalidIndex": undefined;
    /**
     * The reason given is just too big.
     */
    "ReasonTooBig": undefined;
    /**
     * Invalid child-/bounty value.
     */
    "InvalidValue": undefined;
    /**
     * The balance of the asset kind is not convertible to the balance of the native asset for
     * asserting the origin permissions.
     */
    "FailedToConvertBalance": undefined;
    /**
     * The child-/bounty status is unexpected.
     */
    "UnexpectedStatus": undefined;
    /**
     * Require child-/bounty curator.
     */
    "RequireCurator": undefined;
    /**
     * The spend origin is valid but the amount it is allowed to spend is lower than the
     * requested amount.
     */
    "InsufficientPermission": undefined;
    /**
     * There was issue with funding the child-/bounty.
     */
    "FundingError": undefined;
    /**
     * There was issue with refunding the child-/bounty.
     */
    "RefundError": undefined;
    "PayoutError": undefined;
    /**
     * Child-/bounty funding has not concluded yet.
     */
    "FundingInconclusive": undefined;
    /**
     * Child-/bounty refund has not concluded yet.
     */
    "RefundInconclusive": undefined;
    /**
     * Child-/bounty payout has not concluded yet.
     */
    "PayoutInconclusive": undefined;
    /**
     * The child-/bounty or funding source account could not be derived from the indexes and
     * asset kind.
     */
    "FailedToConvertSource": undefined;
    /**
     * The parent bounty cannot be closed because it has active child bounties.
     */
    "HasActiveChildBounty": undefined;
    /**
     * Number of child bounties exceeds limit `MaxActiveChildBountyCount`.
     */
    "TooManyChildBounties": undefined;
    /**
     * The parent bounty value is not enough to add new child-bounty.
     */
    "InsufficientBountyValue": undefined;
    /**
     * The preimage does not exist.
     */
    "PreimageNotExist": undefined;
}>;
export type I96objte63brjr = AnonymousEnum<{
    /**
     * Max signed limits not respected.
     */
    "MaxSignedLimits": undefined;
    /**
     * A key was longer than the configured maximum.
     *
     * This means that the migration halted at the current [`Progress`] and
     * can be resumed with a larger [`crate::Config::MaxKeyLen`] value.
     * Retrying with the same [`crate::Config::MaxKeyLen`] value will not work.
     * The value should only be increased to avoid a storage migration for the currently
     * stored [`crate::Progress::LastKey`].
     */
    "KeyTooLong": undefined;
    /**
     * submitter does not have enough funds.
     */
    "NotEnoughFunds": undefined;
    /**
     * Bad witness data provided.
     */
    "BadWitness": undefined;
    /**
     * Signed migration is not allowed because the maximum limit is not set yet.
     */
    "SignedMigrationNotAllowed": undefined;
    /**
     * Bad child root provided.
     */
    "BadChildRoot": undefined;
}>;
export type Iuudu4kursojc = AnonymousEnum<{
    /**
     * A (bonded) pool id does not exist.
     */
    "PoolNotFound": undefined;
    /**
     * An account is not a member.
     */
    "PoolMemberNotFound": undefined;
    /**
     * A reward pool does not exist. In all cases this is a system logic error.
     */
    "RewardPoolNotFound": undefined;
    /**
     * A sub pool does not exist.
     */
    "SubPoolsNotFound": undefined;
    /**
     * An account is already delegating in another pool. An account may only belong to one
     * pool at a time.
     */
    "AccountBelongsToOtherPool": undefined;
    /**
     * The member is fully unbonded (and thus cannot access the bonded and reward pool
     * anymore to, for example, collect rewards).
     */
    "FullyUnbonding": undefined;
    /**
     * The member cannot unbond further chunks due to reaching the limit.
     */
    "MaxUnbondingLimit": undefined;
    /**
     * None of the funds can be withdrawn yet because the bonding duration has not passed.
     */
    "CannotWithdrawAny": undefined;
    /**
     * The amount does not meet the minimum bond to either join or create a pool.
     *
     * The depositor can never unbond to a value less than `Pallet::depositor_min_bond`. The
     * caller does not have nominating permissions for the pool. Members can never unbond to a
     * value below `MinJoinBond`.
     */
    "MinimumBondNotMet": undefined;
    /**
     * The transaction could not be executed due to overflow risk for the pool.
     */
    "OverflowRisk": undefined;
    /**
     * A pool must be in [`PoolState::Destroying`] in order for the depositor to unbond or for
     * other members to be permissionlessly unbonded.
     */
    "NotDestroying": undefined;
    /**
     * The caller does not have nominating permissions for the pool.
     */
    "NotNominator": undefined;
    /**
     * Either a) the caller cannot make a valid kick or b) the pool is not destroying.
     */
    "NotKickerOrDestroying": undefined;
    /**
     * The pool is not open to join
     */
    "NotOpen": undefined;
    /**
     * The system is maxed out on pools.
     */
    "MaxPools": undefined;
    /**
     * Too many members in the pool or system.
     */
    "MaxPoolMembers": undefined;
    /**
     * The pools state cannot be changed.
     */
    "CanNotChangeState": undefined;
    /**
     * The caller does not have adequate permissions.
     */
    "DoesNotHavePermission": undefined;
    /**
     * Metadata exceeds [`Config::MaxMetadataLen`]
     */
    "MetadataExceedsMaxLen": undefined;
    /**
     * Some error occurred that should never happen. This should be reported to the
     * maintainers.
     */
    "Defensive": Anonymize<Ie2db4l6126rkt>;
    /**
     * Partial unbonding now allowed permissionlessly.
     */
    "PartialUnbondNotAllowedPermissionlessly": undefined;
    /**
     * The pool's max commission cannot be set higher than the existing value.
     */
    "MaxCommissionRestricted": undefined;
    /**
     * The supplied commission exceeds the max allowed commission.
     */
    "CommissionExceedsMaximum": undefined;
    /**
     * The supplied commission exceeds global maximum commission.
     */
    "CommissionExceedsGlobalMaximum": undefined;
    /**
     * Not enough blocks have surpassed since the last commission update.
     */
    "CommissionChangeThrottled": undefined;
    /**
     * The submitted changes to commission change rate are not allowed.
     */
    "CommissionChangeRateNotAllowed": undefined;
    /**
     * There is no pending commission to claim.
     */
    "NoPendingCommission": undefined;
    /**
     * No commission current has been set.
     */
    "NoCommissionCurrentSet": undefined;
    /**
     * Pool id currently in use.
     */
    "PoolIdInUse": undefined;
    /**
     * Pool id provided is not correct/usable.
     */
    "InvalidPoolId": undefined;
    /**
     * Bonding extra is restricted to the exact pending reward amount.
     */
    "BondExtraRestricted": undefined;
    /**
     * No imbalance in the ED deposit for the pool.
     */
    "NothingToAdjust": undefined;
    /**
     * No slash pending that can be applied to the member.
     */
    "NothingToSlash": undefined;
    /**
     * The slash amount is too low to be applied.
     */
    "SlashTooLow": undefined;
    /**
     * The pool or member delegation has already migrated to delegate stake.
     */
    "AlreadyMigrated": undefined;
    /**
     * The pool or member delegation has not migrated yet to delegate stake.
     */
    "NotMigrated": undefined;
    /**
     * This call is not allowed in the current state of the pallet.
     */
    "NotSupported": undefined;
    /**
     * Account is restricted from participation in pools. This may happen if the account is
     * staking in another way already.
     */
    "Restricted": undefined;
}>;
export type Ie2db4l6126rkt = AnonymousEnum<{
    "NotEnoughSpaceInUnbondPool": undefined;
    "PoolNotFound": undefined;
    "RewardPoolNotFound": undefined;
    "SubPoolsNotFound": undefined;
    "BondedStashKilledPrematurely": undefined;
    "DelegationUnsupported": undefined;
    "SlashNotApplied": undefined;
}>;
export type I2e4fekrkcdej2 = AnonymousEnum<{
    /**
     * A error in the list interface implementation.
     */
    "List": Anonymize<Ictkqqlhdjt761>;
    /**
     * Could not update a node, because the pallet is locked.
     */
    "Locked": undefined;
}>;
export type Ictkqqlhdjt761 = AnonymousEnum<{
    "Duplicate": undefined;
    "NotHeavier": undefined;
    "NotInSameBag": undefined;
    "NodeNotFound": undefined;
    "Locked": undefined;
}>;
export type Iaogv3iimefnis = AnonymousEnum<{
    /**
     * The account cannot perform this operation.
     */
    "NotAllowed": undefined;
    /**
     * An existing staker cannot perform this action.
     */
    "AlreadyStaking": undefined;
    /**
     * Reward Destination cannot be same as `Agent` account.
     */
    "InvalidRewardDestination": undefined;
    /**
     * Delegation conditions are not met.
     *
     * Possible issues are
     * 1) Cannot delegate to self,
     * 2) Cannot delegate to multiple delegates.
     */
    "InvalidDelegation": undefined;
    /**
     * The account does not have enough funds to perform the operation.
     */
    "NotEnoughFunds": undefined;
    /**
     * Not an existing `Agent` account.
     */
    "NotAgent": undefined;
    /**
     * Not a Delegator account.
     */
    "NotDelegator": undefined;
    /**
     * Some corruption in internal state.
     */
    "BadState": undefined;
    /**
     * Unapplied pending slash restricts operation on `Agent`.
     */
    "UnappliedSlash": undefined;
    /**
     * `Agent` has no pending slash to be applied.
     */
    "NothingToSlash": undefined;
    /**
     * Failed to withdraw amount from Core Staking.
     */
    "WithdrawFailed": undefined;
    /**
     * Operation not supported by this pallet.
     */
    "NotSupported": undefined;
}>;
export type I1ucg3dr90s1tp = AnonymousEnum<{
    /**
     * Failed to send XCM message to the Relay Chain.
     */
    "XcmSendFailed": undefined;
    /**
     * The origin account is not a registered validator.
     *
     * Only accounts that have called `validate()` can set or purge session keys. When called
     * via a staking proxy, the origin is the delegating account (stash), which must be a
     * registered validator.
     */
    "NotValidator": undefined;
    /**
     * The session keys could not be decoded as the expected RelayChainSessionKeys type.
     */
    "InvalidKeys": undefined;
    /**
     * The ownership proof for the session keys is invalid.
     */
    "InvalidProof": undefined;
    /**
     * Delivery fees exceeded the specified maximum.
     */
    "FeesExceededMax": undefined;
}>;
export type I6gonitoaqpiua = AnonymousEnum<{
    /**
     * Triggering the `Fallback` failed.
     */
    "Fallback": undefined;
    /**
     * Unexpected phase
     */
    "UnexpectedPhase": undefined;
    /**
     * Snapshot was unavailable.
     */
    "Snapshot": undefined;
}>;
export type I9i66md365gdq9 = AnonymousEnum<{
    /**
     * The phase is not signed.
     */
    "PhaseNotSigned": undefined;
    /**
     * The submission is a duplicate.
     */
    "Duplicate": undefined;
    /**
     * The queue is full.
     */
    "QueueFull": undefined;
    /**
     * The page index is out of bounds.
     */
    "BadPageIndex": undefined;
    /**
     * The account is not registered.
     */
    "NotRegistered": undefined;
    /**
     * No submission found.
     */
    "NoSubmission": undefined;
    /**
     * Round is not yet over.
     */
    "RoundNotOver": undefined;
    /**
     * Bad witness data provided.
     */
    "BadWitnessData": undefined;
    /**
     * Too many invulnerable accounts are provided,
     */
    "TooManyInvulnerables": undefined;
}>;
export type Icftpn34uf5f21 = AnonymousEnum<{
    /**
     * Not a controller account.
     */
    "NotController": undefined;
    /**
     * Not a stash account.
     */
    "NotStash": undefined;
    /**
     * Stash is already bonded.
     */
    "AlreadyBonded": undefined;
    /**
     * Controller is already paired.
     */
    "AlreadyPaired": undefined;
    /**
     * Targets cannot be empty.
     */
    "EmptyTargets": undefined;
    /**
     * Duplicate index.
     */
    "DuplicateIndex": undefined;
    /**
     * Slash record not found.
     */
    "InvalidSlashRecord": undefined;
    /**
     * Cannot bond, nominate or validate with value less than the minimum defined by
     * governance (see `MinValidatorBond` and `MinNominatorBond`). If unbonding is the
     * intention, `chill` first to remove one's role as validator/nominator.
     */
    "InsufficientBond": undefined;
    /**
     * Can not schedule more unlock chunks.
     */
    "NoMoreChunks": undefined;
    /**
     * Can not rebond without unlocking chunks.
     */
    "NoUnlockChunk": undefined;
    /**
     * Attempting to target a stash that still has funds.
     */
    "FundedTarget": undefined;
    /**
     * Invalid era to reward.
     */
    "InvalidEraToReward": undefined;
    /**
     * Invalid number of nominations.
     */
    "InvalidNumberOfNominations": undefined;
    /**
     * Rewards for this era have already been claimed for this validator.
     */
    "AlreadyClaimed": undefined;
    /**
     * No nominators exist on this page.
     */
    "InvalidPage": undefined;
    /**
     * Incorrect previous history depth input provided.
     */
    "IncorrectHistoryDepth": undefined;
    /**
     * Internal state has become somehow corrupted and the operation cannot continue.
     */
    "BadState": undefined;
    /**
     * Too many nomination targets supplied.
     */
    "TooManyTargets": undefined;
    /**
     * A nomination target was supplied that was blocked or otherwise not a validator.
     */
    "BadTarget": undefined;
    /**
     * The user has enough bond and thus cannot be chilled forcefully by an external person.
     */
    "CannotChillOther": undefined;
    /**
     * There are too many nominators in the system. Governance needs to adjust the staking
     * settings to keep things safe for the runtime.
     */
    "TooManyNominators": undefined;
    /**
     * There are too many validator candidates in the system. Governance needs to adjust the
     * staking settings to keep things safe for the runtime.
     */
    "TooManyValidators": undefined;
    /**
     * Commission is too low. Must be at least `MinCommission`.
     */
    "CommissionTooLow": undefined;
    /**
     * Some bound is not met.
     */
    "BoundNotMet": undefined;
    /**
     * Used when attempting to use deprecated controller account logic.
     */
    "ControllerDeprecated": undefined;
    /**
     * Cannot reset a ledger.
     */
    "CannotRestoreLedger": undefined;
    /**
     * Provided reward destination is not allowed.
     */
    "RewardDestinationRestricted": undefined;
    /**
     * Not enough funds available to withdraw.
     */
    "NotEnoughFunds": undefined;
    /**
     * Operation not allowed for virtual stakers.
     */
    "VirtualStakerNotAllowed": undefined;
    /**
     * Stash could not be reaped as other pallet might depend on it.
     */
    "CannotReapStash": undefined;
    /**
     * The stake of this account is already migrated to `Fungible` holds.
     */
    "AlreadyMigrated": undefined;
    /**
     * Era not yet started.
     */
    "EraNotStarted": undefined;
    /**
     * Account is restricted from participation in staking. This may happen if the account is
     * staking in another way already, such as via pool.
     */
    "Restricted": undefined;
    /**
     * Unapplied slashes in the recently concluded era is blocking this operation.
     * See `Call::apply_slash` to apply them.
     */
    "UnappliedSlashesInPreviousEra": undefined;
    /**
     * The era is not eligible for pruning.
     */
    "EraNotPrunable": undefined;
    /**
     * The slash has been cancelled and cannot be applied.
     */
    "CancelledSlash": undefined;
}>;
export type I54rjnlnsa98ib = AnonymousEnum<{
    /**
     * Invalid schedule supplied, e.g. with zero weight of a basic operation.
     */
    "InvalidSchedule": undefined;
    /**
     * Invalid combination of flags supplied to `seal_call` or `seal_delegate_call`.
     */
    "InvalidCallFlags": undefined;
    /**
     * The executed contract exhausted its gas limit.
     */
    "OutOfGas": undefined;
    /**
     * Performing the requested transfer failed. Probably because there isn't enough
     * free balance in the sender's account.
     */
    "TransferFailed": undefined;
    /**
     * Performing a call was denied because the calling depth reached the limit
     * of what is specified in the schedule.
     */
    "MaxCallDepthReached": undefined;
    /**
     * No contract was found at the specified address.
     */
    "ContractNotFound": undefined;
    /**
     * No code could be found at the supplied code hash.
     */
    "CodeNotFound": undefined;
    /**
     * No code info could be found at the supplied code hash.
     */
    "CodeInfoNotFound": undefined;
    /**
     * A buffer outside of sandbox memory was passed to a contract API function.
     */
    "OutOfBounds": undefined;
    /**
     * Input passed to a contract API function failed to decode as expected type.
     */
    "DecodingFailed": undefined;
    /**
     * Contract trapped during execution.
     */
    "ContractTrapped": undefined;
    /**
     * Event body or storage item exceeds [`limits::STORAGE_BYTES`].
     */
    "ValueTooLarge": undefined;
    /**
     * Termination of a contract is not allowed while the contract is already
     * on the call stack. Can be triggered by `seal_terminate`.
     */
    "TerminatedWhileReentrant": undefined;
    /**
     * `seal_call` forwarded this contracts input. It therefore is no longer available.
     */
    "InputForwarded": undefined;
    /**
     * The amount of topics passed to `seal_deposit_events` exceeds the limit.
     */
    "TooManyTopics": undefined;
    /**
     * A contract with the same AccountId already exists.
     */
    "DuplicateContract": undefined;
    /**
     * A contract self destructed in its constructor.
     *
     * This can be triggered by a call to `seal_terminate`.
     */
    "TerminatedInConstructor": undefined;
    /**
     * A call tried to invoke a contract that is flagged as non-reentrant.
     */
    "ReentranceDenied": undefined;
    /**
     * A contract called into the runtime which then called back into this pallet.
     */
    "ReenteredPallet": undefined;
    /**
     * A contract attempted to invoke a state modifying API while being in read-only mode.
     */
    "StateChangeDenied": undefined;
    /**
     * Origin doesn't have enough balance to pay the required storage deposits.
     */
    "StorageDepositNotEnoughFunds": undefined;
    /**
     * More storage was created than allowed by the storage deposit limit.
     */
    "StorageDepositLimitExhausted": undefined;
    /**
     * Code removal was denied because the code is still in use by at least one contract.
     */
    "CodeInUse": undefined;
    /**
     * The contract ran to completion but decided to revert its storage changes.
     * Please note that this error is only returned from extrinsics. When called directly
     * or via RPC an `Ok` will be returned. In this case the caller needs to inspect the flags
     * to determine whether a reversion has taken place.
     */
    "ContractReverted": undefined;
    /**
     * The contract failed to compile or is missing the correct entry points.
     *
     * A more detailed error can be found on the node console if debug messages are enabled
     * by supplying `-lruntime::revive=debug`.
     */
    "CodeRejected": undefined;
    /**
     * The code blob supplied is larger than [`limits::code::BLOB_BYTES`].
     */
    "BlobTooLarge": undefined;
    /**
     * The contract declares too much memory (ro + rw + stack).
     */
    "StaticMemoryTooLarge": undefined;
    /**
     * The program contains a basic block that is larger than allowed.
     */
    "BasicBlockTooLarge": undefined;
    /**
     * The program contains an invalid instruction.
     */
    "InvalidInstruction": undefined;
    /**
     * The contract has reached its maximum number of delegate dependencies.
     */
    "MaxDelegateDependenciesReached": undefined;
    /**
     * The dependency was not found in the contract's delegate dependencies.
     */
    "DelegateDependencyNotFound": undefined;
    /**
     * The contract already depends on the given delegate dependency.
     */
    "DelegateDependencyAlreadyExists": undefined;
    /**
     * Can not add a delegate dependency to the code hash of the contract itself.
     */
    "CannotAddSelfAsDelegateDependency": undefined;
    /**
     * Can not add more data to transient storage.
     */
    "OutOfTransientStorage": undefined;
    /**
     * The contract tried to call a syscall which does not exist (at its current api level).
     */
    "InvalidSyscall": undefined;
    /**
     * Invalid storage flags were passed to one of the storage syscalls.
     */
    "InvalidStorageFlags": undefined;
    /**
     * PolkaVM failed during code execution. Probably due to a malformed program.
     */
    "ExecutionFailed": undefined;
    /**
     * Failed to convert a U256 to a Balance.
     */
    "BalanceConversionFailed": undefined;
    /**
     * Immutable data can only be set during deploys and only be read during calls.
     * Additionally, it is only valid to set the data once and it must not be empty.
     */
    "InvalidImmutableAccess": undefined;
    /**
     * An `AccountID32` account tried to interact with the pallet without having a mapping.
     *
     * Call [`Pallet::map_account`] in order to create a mapping for the account.
     */
    "AccountUnmapped": undefined;
    /**
     * Tried to map an account that is already mapped.
     */
    "AccountAlreadyMapped": undefined;
    /**
     * The transaction used to dry-run a contract is invalid.
     */
    "InvalidGenericTransaction": undefined;
    /**
     * The refcount of a code either over or underflowed.
     */
    "RefcountOverOrUnderflow": undefined;
    /**
     * Unsupported precompile address.
     */
    "UnsupportedPrecompileAddress": undefined;
    /**
     * The calldata exceeds [`limits::CALLDATA_BYTES`].
     */
    "CallDataTooLarge": undefined;
    /**
     * The return data exceeds [`limits::CALLDATA_BYTES`].
     */
    "ReturnDataTooLarge": undefined;
    /**
     * Invalid jump destination. Dynamic jumps points to invalid not jumpdest opcode.
     */
    "InvalidJump": undefined;
    /**
     * Attempting to pop a value from an empty stack.
     */
    "StackUnderflow": undefined;
    /**
     * Attempting to push a value onto a full stack.
     */
    "StackOverflow": undefined;
    /**
     * Too much deposit was drawn from the shared txfee and deposit credit.
     *
     * This happens if the passed `gas` inside the ethereum transaction is too low.
     */
    "TxFeeOverdraw": undefined;
    /**
     * When calling an EVM constructor `data` has to be empty.
     *
     * EVM constructors do not accept data. Their input data is part of the code blob itself.
     */
    "EvmConstructorNonEmptyData": undefined;
    /**
     * Tried to construct an EVM contract via code hash.
     *
     * EVM contracts can only be instantiated via code upload as no initcode is
     * stored on-chain.
     */
    "EvmConstructedFromHash": undefined;
    /**
     * The contract does not have enough balance to refund the storage deposit.
     *
     * This is a bug and should never happen. It means the accounting got out of sync.
     */
    "StorageRefundNotEnoughFunds": undefined;
    /**
     * This means there are locks on the contracts storage deposit that prevents refunding it.
     *
     * This would be the case if the contract used its storage deposits for governance
     * or other pallets that allow creating locks over held balance.
     */
    "StorageRefundLocked": undefined;
    /**
     * Called a pre-compile that is not allowed to be delegate called.
     *
     * Some pre-compile functions will trap the caller context if being delegate
     * called or if their caller was being delegate called.
     */
    "PrecompileDelegateDenied": undefined;
    /**
     * ECDSA public key recovery failed. Most probably wrong recovery id or signature.
     */
    "EcdsaRecoveryFailed": undefined;
}>;
export type Iaug04qjhbli00 = AnonymousEnum<{
    /**
     * Sender must be the Sudo account.
     */
    "RequireSudo": undefined;
}>;
export type Ibl4g7bmj805f = AnonymousEnum<{
    /**
     * Either no lease deposit or already unreserved.
     */
    "NoLeaseReserve": undefined;
    /**
     * Either no crowdloan contribution or already withdrawn.
     */
    "NoCrowdloanContribution": undefined;
    /**
     * Either no crowdloan reserve or already unreserved.
     */
    "NoCrowdloanReserve": undefined;
    /**
     * Failed to withdraw crowdloan contribution.
     */
    "FailedToWithdrawCrowdloanContribution": undefined;
    /**
     * Block number is not yet reached.
     */
    "NotYet": undefined;
    /**
     * Not all contributions are withdrawn.
     */
    "ContributionsRemaining": undefined;
    /**
     * The account is not a derived account.
     */
    "WrongDerivedTranslation": undefined;
    /**
     * Account cannot be migrated since it is not a sovereign parachain account.
     */
    "NotSovereign": undefined;
    /**
     * Internal error, please bug report.
     */
    "InternalError": undefined;
    /**
     * The Asset Hub migration is not completed.
     */
    "MigrationNotCompleted": undefined;
    /**
     * The balance is zero.
     */
    "ZeroBalance": undefined;
    /**
     * Failed to transfer balance.
     */
    "FailedToTransfer": undefined;
    /**
     * The account has already been translated.
     */
    "AlreadyTranslated": undefined;
    /**
     * The derivation path is too long.
     */
    "TooLongDerivationPath": undefined;
    /**
     * Failed to force unstake.
     */
    "FailedToForceUnstake": undefined;
}>;
export type Icrtfjqr0ect81 = AnonymousEnum<{
    /**
     * Failed to unreserve deposit.
     */
    "FailedToUnreserveDeposit": undefined;
    /**
     * Failed to process an account data from RC.
     */
    "FailedToProcessAccount": undefined;
    /**
     * Some item could not be inserted because it already exists.
     */
    "InsertConflict": undefined;
    /**
     * Failed to convert RC type to AH type.
     */
    "FailedToConvertType": undefined;
    /**
     * Failed to fetch preimage.
     */
    "PreimageNotFound": undefined;
    /**
     * Failed to convert RC call to AH call.
     */
    "FailedToConvertCall": undefined;
    /**
     * Failed to bound a call.
     */
    "FailedToBoundCall": undefined;
    /**
     * Failed to send XCM message.
     */
    "XcmError": undefined;
    /**
     * Failed to integrate a vesting schedule.
     */
    "FailedToIntegrateVestingSchedule": undefined;
    /**
     * Checking account overflow or underflow.
     */
    "FailedToCalculateCheckingAccount": undefined;
    /**
     * Vector did not fit into its compile-time bound.
     */
    "FailedToBoundVector": undefined;
    /**
     * The DMP queue priority is already set to the same value.
     */
    "DmpQueuePriorityAlreadySet": undefined;
    /**
     * Invalid parameter.
     */
    "InvalidParameter": undefined;
    /**
     * Preimage missing.
     */
    "PreimageMissing": undefined;
    /**
     * Preimage too big.
     */
    "PreimageTooBig": undefined;
    /**
     * Preimage chunk missing.
     */
    "PreimageChunkMissing": undefined;
    /**
     * Preimage status invalid.
     */
    "PreimageStatusInvalid": undefined;
    /**
     * The XCM version is invalid.
     */
    "BadXcmVersion": undefined;
    /**
     * The origin is invalid.
     */
    "InvalidOrigin": undefined;
}>;
export type TokenError = Enum<{
    "FundsUnavailable": undefined;
    "OnlyProvider": undefined;
    "BelowMinimum": undefined;
    "CannotCreate": undefined;
    "UnknownAsset": undefined;
    "Frozen": undefined;
    "Unsupported": undefined;
    "CannotCreateHold": undefined;
    "NotExpendable": undefined;
    "Blocked": undefined;
}>;
export declare const TokenError: GetEnum<TokenError>;
export type ArithmeticError = Enum<{
    "Underflow": undefined;
    "Overflow": undefined;
    "DivisionByZero": undefined;
}>;
export declare const ArithmeticError: GetEnum<ArithmeticError>;
export type TransactionalError = Enum<{
    "LimitReached": undefined;
    "NoLayer": undefined;
}>;
export declare const TransactionalError: GetEnum<TransactionalError>;
export type Icbccs0ug47ilf = {
    "account": SS58String;
};
export type I855j4i3kr8ko1 = {
    "sender": SS58String;
    "hash": SizedHex<32>;
};
export type I3m5sq54sjdlso = {};
export type I2cren9u3sfqmt = {
    "err": Anonymize<I72ju98lulovhp>;
};
export type Ibgl04rn6nbfm6 = {
    "code_hash": SizedHex<32>;
    "check_version": boolean;
};
export type I6lk22bu76jt63 = {
    "code_hash": SizedHex<32>;
    "error": Anonymize<I72ju98lulovhp>;
};
export type Icbsekf57miplo = AnonymousEnum<{
    /**
     * The validation function has been scheduled to apply.
     */
    "ValidationFunctionStored": undefined;
    /**
     * The validation function was applied as of the contained relay chain block number.
     */
    "ValidationFunctionApplied": Anonymize<Idd7hd99u0ho0n>;
    /**
     * The relay-chain aborted the upgrade process.
     */
    "ValidationFunctionDiscarded": undefined;
    /**
     * Some downward messages have been received and will be processed.
     */
    "DownwardMessagesReceived": Anonymize<Iafscmv8tjf0ou>;
    /**
     * Downward messages were processed using the given weight.
     */
    "DownwardMessagesProcessed": Anonymize<I100l07kaehdlp>;
    /**
     * An upward message was sent to the relay chain.
     */
    "UpwardMessageSent": Anonymize<I6gnbnvip5vvdi>;
}>;
export type Idd7hd99u0ho0n = {
    "relay_chain_block_num": number;
};
export type Iafscmv8tjf0ou = {
    "count": number;
};
export type I100l07kaehdlp = {
    "weight_used": Anonymize<I4q39t5hn830vp>;
    "dmq_head": SizedHex<32>;
};
export type I6gnbnvip5vvdi = {
    "message_hash"?: Anonymize<I4s6vifaf8k998>;
};
export type I4s6vifaf8k998 = (SizedHex<32>) | undefined;
export type PreimageEvent = Enum<{
    /**
     * A preimage has been noted.
     */
    "Noted": Anonymize<I1jm8m1rh9e20v>;
    /**
     * A preimage has been requested.
     */
    "Requested": Anonymize<I1jm8m1rh9e20v>;
    /**
     * A preimage has ben cleared.
     */
    "Cleared": Anonymize<I1jm8m1rh9e20v>;
}>;
export declare const PreimageEvent: GetEnum<PreimageEvent>;
export type I1jm8m1rh9e20v = {
    "hash": SizedHex<32>;
};
export type I9c3qb8qem1uhn = AnonymousEnum<{
    /**
     * Scheduled some task.
     */
    "Scheduled": Anonymize<I5n4sebgkfr760>;
    /**
     * Canceled some task.
     */
    "Canceled": Anonymize<I5n4sebgkfr760>;
    /**
     * Dispatched some task.
     */
    "Dispatched": Anonymize<Ib5m2ftafin6cg>;
    /**
     * Set a retry configuration for some task.
     */
    "RetrySet": Anonymize<Ia3c82eadg79bj>;
    /**
     * Cancel a retry configuration for some task.
     */
    "RetryCancelled": Anonymize<Ienusoeb625ftq>;
    /**
     * The call for the provided hash was not found so the task has been aborted.
     */
    "CallUnavailable": Anonymize<Ienusoeb625ftq>;
    /**
     * The given task was unable to be renewed since the agenda is full at that block.
     */
    "PeriodicFailed": Anonymize<Ienusoeb625ftq>;
    /**
     * The given task was unable to be retried since the agenda is full at that block or there
     * was not enough weight to reschedule it.
     */
    "RetryFailed": Anonymize<Ienusoeb625ftq>;
    /**
     * The given task can never be executed since it is overweight.
     */
    "PermanentlyOverweight": Anonymize<Ienusoeb625ftq>;
    /**
     * Agenda is incomplete from `when`.
     */
    "AgendaIncomplete": Anonymize<Ibtsa3docbr9el>;
}>;
export type I5n4sebgkfr760 = {
    "when": number;
    "index": number;
};
export type Ib5m2ftafin6cg = {
    "task": Anonymize<I9jd27rnpm8ttv>;
    "id"?: Anonymize<I4s6vifaf8k998>;
    "result": Anonymize<Idqcgnrsbirg5n>;
};
export type I9jd27rnpm8ttv = FixedSizeArray<2, number>;
export type Idqcgnrsbirg5n = ResultPayload<undefined, Anonymize<I72ju98lulovhp>>;
export type Ia3c82eadg79bj = {
    "task": Anonymize<I9jd27rnpm8ttv>;
    "id"?: Anonymize<I4s6vifaf8k998>;
    "period": number;
    "retries": number;
};
export type Ienusoeb625ftq = {
    "task": Anonymize<I9jd27rnpm8ttv>;
    "id"?: Anonymize<I4s6vifaf8k998>;
};
export type Ibtsa3docbr9el = {
    "when": number;
};
export type Iehfcpb8hf71dd = AnonymousEnum<{
    /**
     * A Parameter was set.
     *
     * Is also emitted when the value was not changed.
     */
    "Updated": Anonymize<Icusb76knakdp5>;
}>;
export type Icusb76knakdp5 = {
    /**
     * The key that was updated.
     */
    "key": Anonymize<I4b3lhc1ach2vm>;
    /**
     * The old value before this call.
     */
    "old_value"?: (Anonymize<I7rt63b9d5k7p8>) | undefined;
    /**
     * The new value after this call.
     */
    "new_value"?: (Anonymize<I7rt63b9d5k7p8>) | undefined;
};
export type I4b3lhc1ach2vm = AnonymousEnum<{
    "StakingElection": Enum<{
        "SignedPhase": undefined;
        "MaxSignedSubmissions": undefined;
        "UnsignedPhase": undefined;
        "MinerPages": undefined;
        "MaxElectingVoters": undefined;
        "TargetSnapshotPerBlock": undefined;
        "MaxEraDuration": undefined;
    }>;
    "Scheduler": Enum<{
        "MaxScheduledPerBlock": undefined;
        "MaximumWeight": undefined;
    }>;
    "MessageQueue": Enum<{
        "MaxOnInitWeight": undefined;
        "MaxOnIdleWeight": undefined;
    }>;
}>;
export type I7rt63b9d5k7p8 = AnonymousEnum<{
    "StakingElection": Enum<{
        "SignedPhase": number;
        "MaxSignedSubmissions": number;
        "UnsignedPhase": number;
        "MinerPages": number;
        "MaxElectingVoters": number;
        "TargetSnapshotPerBlock": number;
        "MaxEraDuration": bigint;
    }>;
    "Scheduler": Enum<{
        "MaxScheduledPerBlock": number;
        "MaximumWeight": Anonymize<I4q39t5hn830vp>;
    }>;
    "MessageQueue": Enum<{
        "MaxOnInitWeight"?: Anonymize<Iasb8k6ash5mjn>;
        "MaxOnIdleWeight"?: Anonymize<Iasb8k6ash5mjn>;
    }>;
}>;
export type Iasb8k6ash5mjn = (Anonymize<I4q39t5hn830vp>) | undefined;
export type I94co7vj7h6bo = AnonymousEnum<{
    /**
     * A Runtime upgrade started.
     *
     * Its end is indicated by `UpgradeCompleted` or `UpgradeFailed`.
     */
    "UpgradeStarted": Anonymize<If1co0pilmi7oq>;
    /**
     * The current runtime upgrade completed.
     *
     * This implies that all of its migrations completed successfully as well.
     */
    "UpgradeCompleted": undefined;
    /**
     * Runtime upgrade failed.
     *
     * This is very bad and will require governance intervention.
     */
    "UpgradeFailed": undefined;
    /**
     * A migration was skipped since it was already executed in the past.
     */
    "MigrationSkipped": Anonymize<I666bl2fqjkejo>;
    /**
     * A migration progressed.
     */
    "MigrationAdvanced": Anonymize<Iae74gjak1qibn>;
    /**
     * A Migration completed.
     */
    "MigrationCompleted": Anonymize<Iae74gjak1qibn>;
    /**
     * A Migration failed.
     *
     * This implies that the whole upgrade failed and governance intervention is required.
     */
    "MigrationFailed": Anonymize<Iae74gjak1qibn>;
    /**
     * The set of historical migrations has been cleared.
     */
    "HistoricCleared": Anonymize<I3escdojpj0551>;
}>;
export type If1co0pilmi7oq = {
    /**
     * The number of migrations that this upgrade contains.
     *
     * This can be used to design a progress indicator in combination with counting the
     * `MigrationCompleted` and `MigrationSkipped` events.
     */
    "migrations": number;
};
export type I666bl2fqjkejo = {
    /**
     * The index of the skipped migration within the [`Config::Migrations`] list.
     */
    "index": number;
};
export type Iae74gjak1qibn = {
    /**
     * The index of the migration within the [`Config::Migrations`] list.
     */
    "index": number;
    /**
     * The number of blocks that this migration took so far.
     */
    "took": number;
};
export type I3escdojpj0551 = {
    /**
     * Should be passed to `clear_historic` in a successive call.
     */
    "next_cursor"?: Anonymize<Iabpgqcjikia83>;
};
export type Iabpgqcjikia83 = (Uint8Array) | undefined;
export type Id6ehgrdf2t13l = AnonymousEnum<{
    /**
     * An account was created with some free balance.
     */
    "Endowed": Anonymize<Icv68aq8841478>;
    /**
     * An account was removed whose balance was non-zero but below ExistentialDeposit,
     * resulting in an outright loss.
     */
    "DustLost": Anonymize<Ic262ibdoec56a>;
    /**
     * Transfer succeeded.
     */
    "Transfer": Anonymize<Iflcfm9b6nlmdd>;
    /**
     * A balance was set by root.
     */
    "BalanceSet": Anonymize<Ijrsf4mnp3eka>;
    /**
     * Some balance was reserved (moved from free to reserved).
     */
    "Reserved": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * Some balance was unreserved (moved from reserved to free).
     */
    "Unreserved": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * Some balance was moved from the reserve of the first account to the second account.
     * Final argument indicates the destination balance type.
     */
    "ReserveRepatriated": Anonymize<I8tjvj9uq4b7hi>;
    /**
     * Some amount was deposited (e.g. for transaction fees).
     */
    "Deposit": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * Some amount was withdrawn from the account (e.g. for transaction fees).
     */
    "Withdraw": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * Some amount was removed from the account (e.g. for misbehavior).
     */
    "Slashed": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * Some amount was minted into an account.
     */
    "Minted": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * Some credit was balanced and added to the TotalIssuance.
     */
    "MintedCredit": Anonymize<I3qt1hgg4djhgb>;
    /**
     * Some amount was burned from an account.
     */
    "Burned": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * Some debt has been dropped from the Total Issuance.
     */
    "BurnedDebt": Anonymize<I3qt1hgg4djhgb>;
    /**
     * Some amount was suspended from an account (it can be restored later).
     */
    "Suspended": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * Some amount was restored into an account.
     */
    "Restored": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * An account was upgraded.
     */
    "Upgraded": Anonymize<I4cbvqmqadhrea>;
    /**
     * Total issuance was increased by `amount`, creating a credit to be balanced.
     */
    "Issued": Anonymize<I3qt1hgg4djhgb>;
    /**
     * Total issuance was decreased by `amount`, creating a debt to be balanced.
     */
    "Rescinded": Anonymize<I3qt1hgg4djhgb>;
    /**
     * Some balance was locked.
     */
    "Locked": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * Some balance was unlocked.
     */
    "Unlocked": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * Some balance was frozen.
     */
    "Frozen": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * Some balance was thawed.
     */
    "Thawed": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * The `TotalIssuance` was forcefully changed.
     */
    "TotalIssuanceForced": Anonymize<I4fooe9dun9o0t>;
    /**
     * Some balance was placed on hold.
     */
    "Held": Anonymize<I8jo5jmsfnhqqg>;
    /**
     * Held balance was burned from an account.
     */
    "BurnedHeld": Anonymize<I8jo5jmsfnhqqg>;
    /**
     * A transfer of `amount` on hold from `source` to `dest` was initiated.
     */
    "TransferOnHold": Anonymize<I21r16r4j2912m>;
    /**
     * The `transferred` balance is placed on hold at the `dest` account.
     */
    "TransferAndHold": Anonymize<I672l1i4ipl36t>;
    /**
     * Some balance was released from hold.
     */
    "Released": Anonymize<I8jo5jmsfnhqqg>;
    /**
     * An unexpected/defensive event was triggered.
     */
    "Unexpected": Anonymize<Iph9c4rn81ub2>;
}>;
export type Icv68aq8841478 = {
    "account": SS58String;
    "free_balance": bigint;
};
export type Ic262ibdoec56a = {
    "account": SS58String;
    "amount": bigint;
};
export type Iflcfm9b6nlmdd = {
    "from": SS58String;
    "to": SS58String;
    "amount": bigint;
};
export type Ijrsf4mnp3eka = {
    "who": SS58String;
    "free": bigint;
};
export type Id5fm4p8lj5qgi = {
    "who": SS58String;
    "amount": bigint;
};
export type I8tjvj9uq4b7hi = {
    "from": SS58String;
    "to": SS58String;
    "amount": bigint;
    "destination_status": BalanceStatus;
};
export type BalanceStatus = Enum<{
    "Free": undefined;
    "Reserved": undefined;
}>;
export declare const BalanceStatus: GetEnum<BalanceStatus>;
export type I3qt1hgg4djhgb = {
    "amount": bigint;
};
export type I4cbvqmqadhrea = {
    "who": SS58String;
};
export type I4fooe9dun9o0t = {
    "old": bigint;
    "new": bigint;
};
export type I8jo5jmsfnhqqg = {
    "reason": Anonymize<Ickdiocl9u813v>;
    "who": SS58String;
    "amount": bigint;
};
export type Ickdiocl9u813v = AnonymousEnum<{
    "Preimage": PreimagePalletHoldReason;
    "Session": Anonymize<I6bkr3dqv753nc>;
    "PolkadotXcm": Anonymize<Ideiof6273rsoe>;
    "MultiAssetBounties": Enum<{
        "CuratorDeposit": undefined;
    }>;
    "StateTrieMigration": Anonymize<I7lf1val3vmpq0>;
    "DelegatedStaking": Anonymize<Ib6ve2drlnapui>;
    "StakingRcClient": Anonymize<I6bkr3dqv753nc>;
    "MultiBlockElectionSigned": Enum<{
        "SignedSubmission": undefined;
    }>;
    "Staking": Anonymize<Icbapambb5rug3>;
    "Revive": Enum<{
        "CodeUploadDepositReserve": undefined;
        "StorageDepositReserve": undefined;
        "AddressMapping": undefined;
    }>;
}>;
export type PreimagePalletHoldReason = Enum<{
    "Preimage": undefined;
}>;
export declare const PreimagePalletHoldReason: GetEnum<PreimagePalletHoldReason>;
export type I6bkr3dqv753nc = AnonymousEnum<{
    "Keys": undefined;
}>;
export type Ideiof6273rsoe = AnonymousEnum<{
    "AuthorizeAlias": undefined;
}>;
export type I7lf1val3vmpq0 = AnonymousEnum<{
    "SlashForMigrate": undefined;
}>;
export type Ib6ve2drlnapui = AnonymousEnum<{
    "StakingDelegation": undefined;
}>;
export type Icbapambb5rug3 = AnonymousEnum<{
    "Staking": undefined;
}>;
export type I21r16r4j2912m = {
    "reason": Anonymize<Ickdiocl9u813v>;
    "source": SS58String;
    "dest": SS58String;
    "amount": bigint;
};
export type I672l1i4ipl36t = {
    "reason": Anonymize<Ickdiocl9u813v>;
    "source": SS58String;
    "dest": SS58String;
    "transferred": bigint;
};
export type Iph9c4rn81ub2 = AnonymousEnum<{
    "BalanceUpdated": undefined;
    "FailedToMutateAccount": undefined;
}>;
export type TransactionPaymentEvent = Enum<{
    /**
     * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
     * has been paid by `who`.
     */
    "TransactionFeePaid": Anonymize<Ier2cke86dqbr2>;
}>;
export declare const TransactionPaymentEvent: GetEnum<TransactionPaymentEvent>;
export type Ier2cke86dqbr2 = {
    "who": SS58String;
    "actual_fee": bigint;
    "tip": bigint;
};
export type I78bosroad52fa = AnonymousEnum<{
    /**
     * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
     * has been paid by `who` in an asset `asset_id`.
     */
    "AssetTxFeePaid": Anonymize<Imhre0s2vm68p>;
    /**
     * A swap of the refund in native currency back to asset failed.
     */
    "AssetRefundFailed": Anonymize<Icjchvrijclvlv>;
}>;
export type Imhre0s2vm68p = {
    "who": SS58String;
    "actual_fee": bigint;
    "tip": bigint;
    "asset_id": Anonymize<If9iqq7i64mur8>;
};
export type If9iqq7i64mur8 = {
    "parents": number;
    "interior": XcmV5Junctions;
};
export type XcmV5Junctions = Enum<{
    "Here": undefined;
    "X1": XcmV5Junction;
    "X2": FixedSizeArray<2, XcmV5Junction>;
    "X3": FixedSizeArray<3, XcmV5Junction>;
    "X4": FixedSizeArray<4, XcmV5Junction>;
    "X5": FixedSizeArray<5, XcmV5Junction>;
    "X6": FixedSizeArray<6, XcmV5Junction>;
    "X7": FixedSizeArray<7, XcmV5Junction>;
    "X8": FixedSizeArray<8, XcmV5Junction>;
}>;
export declare const XcmV5Junctions: GetEnum<XcmV5Junctions>;
export type XcmV5Junction = Enum<{
    "Parachain": number;
    "AccountId32": {
        "network"?: Anonymize<I97pd2rst02a7r>;
        "id": SizedHex<32>;
    };
    "AccountIndex64": {
        "network"?: Anonymize<I97pd2rst02a7r>;
        "index": bigint;
    };
    "AccountKey20": {
        "network"?: Anonymize<I97pd2rst02a7r>;
        "key": SizedHex<20>;
    };
    "PalletInstance": number;
    "GeneralIndex": bigint;
    "GeneralKey": Anonymize<I15lht6t53odo4>;
    "OnlyChild": undefined;
    "Plurality": Anonymize<I518fbtnclg1oc>;
    "GlobalConsensus": XcmV5NetworkId;
}>;
export declare const XcmV5Junction: GetEnum<XcmV5Junction>;
export type I97pd2rst02a7r = (XcmV5NetworkId) | undefined;
export type XcmV5NetworkId = Enum<{
    "ByGenesis": SizedHex<32>;
    "ByFork": Anonymize<I15vf5oinmcgps>;
    "Polkadot": undefined;
    "Kusama": undefined;
    "Ethereum": Anonymize<I623eo8t3jrbeo>;
    "BitcoinCore": undefined;
    "BitcoinCash": undefined;
    "PolkadotBulletin": undefined;
}>;
export declare const XcmV5NetworkId: GetEnum<XcmV5NetworkId>;
export type I15vf5oinmcgps = {
    "block_number": bigint;
    "block_hash": SizedHex<32>;
};
export type I623eo8t3jrbeo = {
    "chain_id": bigint;
};
export type I15lht6t53odo4 = {
    "length": number;
    "data": SizedHex<32>;
};
export type I518fbtnclg1oc = {
    "id": XcmV3JunctionBodyId;
    "part": XcmV2JunctionBodyPart;
};
export type XcmV3JunctionBodyId = Enum<{
    "Unit": undefined;
    "Moniker": SizedHex<4>;
    "Index": number;
    "Executive": undefined;
    "Technical": undefined;
    "Legislative": undefined;
    "Judicial": undefined;
    "Defense": undefined;
    "Administration": undefined;
    "Treasury": undefined;
}>;
export declare const XcmV3JunctionBodyId: GetEnum<XcmV3JunctionBodyId>;
export type XcmV2JunctionBodyPart = Enum<{
    "Voice": undefined;
    "Members": Anonymize<Iafscmv8tjf0ou>;
    "Fraction": {
        "nom": number;
        "denom": number;
    };
    "AtLeastProportion": {
        "nom": number;
        "denom": number;
    };
    "MoreThanProportion": {
        "nom": number;
        "denom": number;
    };
}>;
export declare const XcmV2JunctionBodyPart: GetEnum<XcmV2JunctionBodyPart>;
export type Icjchvrijclvlv = {
    "native_amount_kept": bigint;
};
export type I7uu9ebnucfti5 = AnonymousEnum<{
    /**
     * A vesting schedule has been created.
     */
    "VestingCreated": Anonymize<Ih04jp733tqqa>;
    /**
     * The amount vested has been updated. This could indicate a change in funds available.
     * The balance given is the amount which is left unvested (and thus locked).
     */
    "VestingUpdated": Anonymize<Ievr89968437gm>;
    /**
     * An \[account\] has become fully vested.
     */
    "VestingCompleted": Anonymize<Icbccs0ug47ilf>;
}>;
export type Ih04jp733tqqa = {
    "account": SS58String;
    "schedule_index": number;
};
export type Ievr89968437gm = {
    "account": SS58String;
    "unvested": bigint;
};
export type CommonClaimsEvent = Enum<{
    /**
     * Someone claimed some DOTs.
     */
    "Claimed": Anonymize<Ie3hcrrq6r18fs>;
}>;
export declare const CommonClaimsEvent: GetEnum<CommonClaimsEvent>;
export type Ie3hcrrq6r18fs = {
    "who": SS58String;
    "ethereum_address": SizedHex<20>;
    "amount": bigint;
};
export type I4srakrmf0fspo = AnonymousEnum<{
    /**
     * New Invulnerables were set.
     */
    "NewInvulnerables": Anonymize<I39t01nnod9109>;
    /**
     * A new Invulnerable was added.
     */
    "InvulnerableAdded": Anonymize<I6v8sm60vvkmk7>;
    /**
     * An Invulnerable was removed.
     */
    "InvulnerableRemoved": Anonymize<I6v8sm60vvkmk7>;
    /**
     * The number of desired candidates was set.
     */
    "NewDesiredCandidates": Anonymize<I1qmtmbe5so8r3>;
    /**
     * The candidacy bond was set.
     */
    "NewCandidacyBond": Anonymize<Ih99m6ehpcar7>;
    /**
     * A new candidate joined.
     */
    "CandidateAdded": Anonymize<Idgorhsbgdq2ap>;
    /**
     * Bond of a candidate updated.
     */
    "CandidateBondUpdated": Anonymize<Idgorhsbgdq2ap>;
    /**
     * A candidate was removed.
     */
    "CandidateRemoved": Anonymize<I6v8sm60vvkmk7>;
    /**
     * An account was replaced in the candidate list by another one.
     */
    "CandidateReplaced": Anonymize<I9ubb2kqevnu6t>;
    /**
     * An account was unable to be added to the Invulnerables because they did not have keys
     * registered. Other Invulnerables may have been set.
     */
    "InvalidInvulnerableSkipped": Anonymize<I6v8sm60vvkmk7>;
}>;
export type I39t01nnod9109 = {
    "invulnerables": Anonymize<Ia2lhg7l2hilo3>;
};
export type Ia2lhg7l2hilo3 = Array<SS58String>;
export type I6v8sm60vvkmk7 = {
    "account_id": SS58String;
};
export type I1qmtmbe5so8r3 = {
    "desired_candidates": number;
};
export type Ih99m6ehpcar7 = {
    "bond_amount": bigint;
};
export type Idgorhsbgdq2ap = {
    "account_id": SS58String;
    "deposit": bigint;
};
export type I9ubb2kqevnu6t = {
    "old": SS58String;
    "new": SS58String;
    "deposit": bigint;
};
export type I6ue0ck5fc3u44 = AnonymousEnum<{
    /**
     * New session has happened. Note that the argument is the session index, not the
     * block number as the type might suggest.
     */
    "NewSession": Anonymize<I2hq50pu2kdjpo>;
    /**
     * The `NewSession` event in the current block also implies a new validator set to be
     * queued.
     */
    "NewQueued": undefined;
    /**
     * Validator has been disabled.
     */
    "ValidatorDisabled": Anonymize<I9acqruh7322g2>;
    /**
     * Validator has been re-enabled.
     */
    "ValidatorReenabled": Anonymize<I9acqruh7322g2>;
}>;
export type I2hq50pu2kdjpo = {
    "session_index": number;
};
export type I9acqruh7322g2 = {
    "validator": SS58String;
};
export type Idsqc7mhp6nnle = AnonymousEnum<{
    /**
     * An HRMP message was sent to a sibling parachain.
     */
    "XcmpMessageSent": Anonymize<I137t1cld92pod>;
}>;
export type I137t1cld92pod = {
    "message_hash": SizedHex<32>;
};
export type If95hivmqmkiku = AnonymousEnum<{
    /**
     * Execution of an XCM message was attempted.
     */
    "Attempted": Anonymize<I61d51nv4cou88>;
    /**
     * An XCM message was sent.
     */
    "Sent": Anonymize<If8u5kl4h8070m>;
    /**
     * An XCM message failed to send.
     */
    "SendFailed": Anonymize<Ibmuil6p3vl83l>;
    /**
     * An XCM message failed to process.
     */
    "ProcessXcmError": Anonymize<I7lul91g50ae87>;
    /**
     * Query response received which does not match a registered query. This may be because a
     * matching query was never registered, it may be because it is a duplicate response, or
     * because the query timed out.
     */
    "UnexpectedResponse": Anonymize<Icl7nl1rfeog3i>;
    /**
     * Query response has been received and is ready for taking with `take_response`. There is
     * no registered notification call.
     */
    "ResponseReady": Anonymize<Iasr6pj6shs0fl>;
    /**
     * Query response has been received and query is removed. The registered notification has
     * been dispatched and executed successfully.
     */
    "Notified": Anonymize<I2uqmls7kcdnii>;
    /**
     * Query response has been received and query is removed. The registered notification
     * could not be dispatched because the dispatch weight is greater than the maximum weight
     * originally budgeted by this runtime for the query result.
     */
    "NotifyOverweight": Anonymize<Idg69klialbkb8>;
    /**
     * Query response has been received and query is removed. There was a general error with
     * dispatching the notification call.
     */
    "NotifyDispatchError": Anonymize<I2uqmls7kcdnii>;
    /**
     * Query response has been received and query is removed. The dispatch was unable to be
     * decoded into a `Call`; this might be due to dispatch function having a signature which
     * is not `(origin, QueryId, Response)`.
     */
    "NotifyDecodeFailed": Anonymize<I2uqmls7kcdnii>;
    /**
     * Expected query response has been received but the origin location of the response does
     * not match that expected. The query remains registered for a later, valid, response to
     * be received and acted upon.
     */
    "InvalidResponder": Anonymize<I7r6b7145022pp>;
    /**
     * Expected query response has been received but the expected origin location placed in
     * storage by this runtime previously cannot be decoded. The query remains registered.
     *
     * This is unexpected (since a location placed in storage in a previously executing
     * runtime should be readable prior to query timeout) and dangerous since the possibly
     * valid response will be dropped. Manual governance intervention is probably going to be
     * needed.
     */
    "InvalidResponderVersion": Anonymize<Icl7nl1rfeog3i>;
    /**
     * Received query response has been read and removed.
     */
    "ResponseTaken": Anonymize<I30pg328m00nr3>;
    /**
     * Some assets have been placed in an asset trap.
     */
    "AssetsTrapped": Anonymize<Icmrn7bogp28cs>;
    /**
     * An XCM version change notification message has been attempted to be sent.
     *
     * The cost of sending it (borne by the chain) is included.
     */
    "VersionChangeNotified": Anonymize<I7m9b5plj4h5ot>;
    /**
     * The supported version of a location has been changed. This might be through an
     * automatic notification or a manual intervention.
     */
    "SupportedVersionChanged": Anonymize<I9kt8c221c83ln>;
    /**
     * A given location which had a version change subscription was dropped owing to an error
     * sending the notification to it.
     */
    "NotifyTargetSendFail": Anonymize<I9onhk772nfs4f>;
    /**
     * A given location which had a version change subscription was dropped owing to an error
     * migrating the location to our new XCM format.
     */
    "NotifyTargetMigrationFail": Anonymize<I3l6bnksrmt56r>;
    /**
     * Expected query response has been received but the expected querier location placed in
     * storage by this runtime previously cannot be decoded. The query remains registered.
     *
     * This is unexpected (since a location placed in storage in a previously executing
     * runtime should be readable prior to query timeout) and dangerous since the possibly
     * valid response will be dropped. Manual governance intervention is probably going to be
     * needed.
     */
    "InvalidQuerierVersion": Anonymize<Icl7nl1rfeog3i>;
    /**
     * Expected query response has been received but the querier location of the response does
     * not match the expected. The query remains registered for a later, valid, response to
     * be received and acted upon.
     */
    "InvalidQuerier": Anonymize<Idh09k0l2pmdcg>;
    /**
     * A remote has requested XCM version change notification from us and we have honored it.
     * A version information message is sent to them and its cost is included.
     */
    "VersionNotifyStarted": Anonymize<I7uoiphbm0tj4r>;
    /**
     * We have requested that a remote chain send us XCM version change notifications.
     */
    "VersionNotifyRequested": Anonymize<I7uoiphbm0tj4r>;
    /**
     * We have requested that a remote chain stops sending us XCM version change
     * notifications.
     */
    "VersionNotifyUnrequested": Anonymize<I7uoiphbm0tj4r>;
    /**
     * Fees were paid from a location for an operation (often for using `SendXcm`).
     */
    "FeesPaid": Anonymize<I512p1n7qt24l8>;
    /**
     * Some assets have been claimed from an asset trap
     */
    "AssetsClaimed": Anonymize<Icmrn7bogp28cs>;
    /**
     * A XCM version migration finished.
     */
    "VersionMigrationFinished": Anonymize<I6s1nbislhk619>;
    /**
     * An `aliaser` location was authorized by `target` to alias it, authorization valid until
     * `expiry` block number.
     */
    "AliasAuthorized": Anonymize<I3gghqnh2mj0is>;
    /**
     * `target` removed alias authorization for `aliaser`.
     */
    "AliasAuthorizationRemoved": Anonymize<I6iv852roh6t3h>;
    /**
     * `target` removed all alias authorizations.
     */
    "AliasesAuthorizationsRemoved": Anonymize<I9oc2o6itbiopq>;
}>;
export type I61d51nv4cou88 = {
    "outcome": Anonymize<Ieqhmksji3pmv5>;
};
export type Ieqhmksji3pmv5 = AnonymousEnum<{
    "Complete": {
        "used": Anonymize<I4q39t5hn830vp>;
    };
    "Incomplete": {
        "used": Anonymize<I4q39t5hn830vp>;
        "error": Anonymize<Ieiju48dn66cuh>;
    };
    "Error": Anonymize<Ieiju48dn66cuh>;
}>;
export type Ieiju48dn66cuh = {
    "index": number;
    "error": Anonymize<Id56rgs0bdb7gl>;
};
export type Id56rgs0bdb7gl = AnonymousEnum<{
    "Overflow": undefined;
    "Unimplemented": undefined;
    "UntrustedReserveLocation": undefined;
    "UntrustedTeleportLocation": undefined;
    "LocationFull": undefined;
    "LocationNotInvertible": undefined;
    "BadOrigin": undefined;
    "InvalidLocation": undefined;
    "AssetNotFound": undefined;
    "FailedToTransactAsset": undefined;
    "NotWithdrawable": undefined;
    "LocationCannotHold": undefined;
    "ExceedsMaxMessageSize": undefined;
    "DestinationUnsupported": undefined;
    "Transport": undefined;
    "Unroutable": undefined;
    "UnknownClaim": undefined;
    "FailedToDecode": undefined;
    "MaxWeightInvalid": undefined;
    "NotHoldingFees": undefined;
    "TooExpensive": undefined;
    "Trap": bigint;
    "ExpectationFalse": undefined;
    "PalletNotFound": undefined;
    "NameMismatch": undefined;
    "VersionIncompatible": undefined;
    "HoldingWouldOverflow": undefined;
    "ExportError": undefined;
    "ReanchorFailed": undefined;
    "NoDeal": undefined;
    "FeesNotMet": undefined;
    "LockError": undefined;
    "NoPermission": undefined;
    "Unanchored": undefined;
    "NotDepositable": undefined;
    "TooManyAssets": undefined;
    "UnhandledXcmVersion": undefined;
    "WeightLimitReached": Anonymize<I4q39t5hn830vp>;
    "Barrier": undefined;
    "WeightNotComputable": undefined;
    "ExceedsStackLimit": undefined;
}>;
export type If8u5kl4h8070m = {
    "origin": Anonymize<If9iqq7i64mur8>;
    "destination": Anonymize<If9iqq7i64mur8>;
    "message": Anonymize<Ict03eedr8de9s>;
    "message_id": SizedHex<32>;
};
export type Ict03eedr8de9s = Array<XcmV5Instruction>;
export type XcmV5Instruction = Enum<{
    "WithdrawAsset": Anonymize<I4npjalvhmfuj>;
    "ReserveAssetDeposited": Anonymize<I4npjalvhmfuj>;
    "ReceiveTeleportedAsset": Anonymize<I4npjalvhmfuj>;
    "QueryResponse": {
        "query_id": bigint;
        "response": Anonymize<I7vucpgm2c6959>;
        "max_weight": Anonymize<I4q39t5hn830vp>;
        "querier"?: Anonymize<I4pai6qnfk426l>;
    };
    "TransferAsset": {
        "assets": Anonymize<I4npjalvhmfuj>;
        "beneficiary": Anonymize<If9iqq7i64mur8>;
    };
    "TransferReserveAsset": {
        "assets": Anonymize<I4npjalvhmfuj>;
        "dest": Anonymize<If9iqq7i64mur8>;
        "xcm": Anonymize<Ict03eedr8de9s>;
    };
    "Transact": {
        "origin_kind": XcmV2OriginKind;
        "fallback_max_weight"?: Anonymize<Iasb8k6ash5mjn>;
        "call": Uint8Array;
    };
    "HrmpNewChannelOpenRequest": Anonymize<I5uhhrjqfuo4e5>;
    "HrmpChannelAccepted": Anonymize<Ifij4jam0o7sub>;
    "HrmpChannelClosing": Anonymize<Ieeb4svd9i8fji>;
    "ClearOrigin": undefined;
    "DescendOrigin": XcmV5Junctions;
    "ReportError": Anonymize<I6vsmh07hrp1rc>;
    "DepositAsset": {
        "assets": XcmV5AssetFilter;
        "beneficiary": Anonymize<If9iqq7i64mur8>;
    };
    "DepositReserveAsset": {
        "assets": XcmV5AssetFilter;
        "dest": Anonymize<If9iqq7i64mur8>;
        "xcm": Anonymize<Ict03eedr8de9s>;
    };
    "ExchangeAsset": {
        "give": XcmV5AssetFilter;
        "want": Anonymize<I4npjalvhmfuj>;
        "maximal": boolean;
    };
    "InitiateReserveWithdraw": {
        "assets": XcmV5AssetFilter;
        "reserve": Anonymize<If9iqq7i64mur8>;
        "xcm": Anonymize<Ict03eedr8de9s>;
    };
    "InitiateTeleport": {
        "assets": XcmV5AssetFilter;
        "dest": Anonymize<If9iqq7i64mur8>;
        "xcm": Anonymize<Ict03eedr8de9s>;
    };
    "ReportHolding": {
        "response_info": Anonymize<I6vsmh07hrp1rc>;
        "assets": XcmV5AssetFilter;
    };
    "BuyExecution": {
        "fees": Anonymize<Iffh1nc5e1mod6>;
        "weight_limit": XcmV3WeightLimit;
    };
    "RefundSurplus": undefined;
    "SetErrorHandler": Anonymize<Ict03eedr8de9s>;
    "SetAppendix": Anonymize<Ict03eedr8de9s>;
    "ClearError": undefined;
    "ClaimAsset": {
        "assets": Anonymize<I4npjalvhmfuj>;
        "ticket": Anonymize<If9iqq7i64mur8>;
    };
    "Trap": bigint;
    "SubscribeVersion": Anonymize<Ieprdqqu7ildvr>;
    "UnsubscribeVersion": undefined;
    "BurnAsset": Anonymize<I4npjalvhmfuj>;
    "ExpectAsset": Anonymize<I4npjalvhmfuj>;
    "ExpectOrigin"?: Anonymize<I4pai6qnfk426l>;
    "ExpectError"?: Anonymize<I3l6ejee750fv1>;
    "ExpectTransactStatus": XcmV3MaybeErrorCode;
    "QueryPallet": {
        "module_name": Uint8Array;
        "response_info": Anonymize<I6vsmh07hrp1rc>;
    };
    "ExpectPallet": Anonymize<Id7mf37dkpgfjs>;
    "ReportTransactStatus": Anonymize<I6vsmh07hrp1rc>;
    "ClearTransactStatus": undefined;
    "UniversalOrigin": XcmV5Junction;
    "ExportMessage": {
        "network": XcmV5NetworkId;
        "destination": XcmV5Junctions;
        "xcm": Anonymize<Ict03eedr8de9s>;
    };
    "LockAsset": {
        "asset": Anonymize<Iffh1nc5e1mod6>;
        "unlocker": Anonymize<If9iqq7i64mur8>;
    };
    "UnlockAsset": {
        "asset": Anonymize<Iffh1nc5e1mod6>;
        "target": Anonymize<If9iqq7i64mur8>;
    };
    "NoteUnlockable": {
        "asset": Anonymize<Iffh1nc5e1mod6>;
        "owner": Anonymize<If9iqq7i64mur8>;
    };
    "RequestUnlock": {
        "asset": Anonymize<Iffh1nc5e1mod6>;
        "locker": Anonymize<If9iqq7i64mur8>;
    };
    "SetFeesMode": Anonymize<I4nae9rsql8fa7>;
    "SetTopic": SizedHex<32>;
    "ClearTopic": undefined;
    "AliasOrigin": Anonymize<If9iqq7i64mur8>;
    "UnpaidExecution": {
        "weight_limit": XcmV3WeightLimit;
        "check_origin"?: Anonymize<I4pai6qnfk426l>;
    };
    "PayFees": {
        "asset": Anonymize<Iffh1nc5e1mod6>;
    };
    "InitiateTransfer": {
        "destination": Anonymize<If9iqq7i64mur8>;
        "remote_fees"?: (Anonymize<Ifhmc9e7vpeeig>) | undefined;
        "preserve_origin": boolean;
        "assets": Array<Anonymize<Ifhmc9e7vpeeig>>;
        "remote_xcm": Anonymize<Ict03eedr8de9s>;
    };
    "ExecuteWithOrigin": {
        "descendant_origin"?: (XcmV5Junctions) | undefined;
        "xcm": Anonymize<Ict03eedr8de9s>;
    };
    "SetHints": {
        "hints": Array<Enum<{
            "AssetClaimer": {
                "location": Anonymize<If9iqq7i64mur8>;
            };
        }>>;
    };
}>;
export declare const XcmV5Instruction: GetEnum<XcmV5Instruction>;
export type I4npjalvhmfuj = Array<Anonymize<Iffh1nc5e1mod6>>;
export type Iffh1nc5e1mod6 = {
    "id": Anonymize<If9iqq7i64mur8>;
    "fun": XcmV3MultiassetFungibility;
};
export type XcmV3MultiassetFungibility = Enum<{
    "Fungible": bigint;
    "NonFungible": XcmV3MultiassetAssetInstance;
}>;
export declare const XcmV3MultiassetFungibility: GetEnum<XcmV3MultiassetFungibility>;
export type XcmV3MultiassetAssetInstance = Enum<{
    "Undefined": undefined;
    "Index": bigint;
    "Array4": SizedHex<4>;
    "Array8": SizedHex<8>;
    "Array16": SizedHex<16>;
    "Array32": SizedHex<32>;
}>;
export declare const XcmV3MultiassetAssetInstance: GetEnum<XcmV3MultiassetAssetInstance>;
export type I7vucpgm2c6959 = AnonymousEnum<{
    "Null": undefined;
    "Assets": Anonymize<I4npjalvhmfuj>;
    "ExecutionResult"?: Anonymize<I3l6ejee750fv1>;
    "Version": number;
    "PalletsInfo": Anonymize<I599u7h20b52at>;
    "DispatchResult": XcmV3MaybeErrorCode;
}>;
export type I3l6ejee750fv1 = ([number, Anonymize<Id56rgs0bdb7gl>]) | undefined;
export type I599u7h20b52at = Array<{
    "index": number;
    "name": Uint8Array;
    "module_name": Uint8Array;
    "major": number;
    "minor": number;
    "patch": number;
}>;
export type XcmV3MaybeErrorCode = Enum<{
    "Success": undefined;
    "Error": Uint8Array;
    "TruncatedError": Uint8Array;
}>;
export declare const XcmV3MaybeErrorCode: GetEnum<XcmV3MaybeErrorCode>;
export type I4pai6qnfk426l = (Anonymize<If9iqq7i64mur8>) | undefined;
export type XcmV2OriginKind = Enum<{
    "Native": undefined;
    "SovereignAccount": undefined;
    "Superuser": undefined;
    "Xcm": undefined;
}>;
export declare const XcmV2OriginKind: GetEnum<XcmV2OriginKind>;
export type I5uhhrjqfuo4e5 = {
    "sender": number;
    "max_message_size": number;
    "max_capacity": number;
};
export type Ifij4jam0o7sub = {
    "recipient": number;
};
export type Ieeb4svd9i8fji = {
    "initiator": number;
    "sender": number;
    "recipient": number;
};
export type I6vsmh07hrp1rc = {
    "destination": Anonymize<If9iqq7i64mur8>;
    "query_id": bigint;
    "max_weight": Anonymize<I4q39t5hn830vp>;
};
export type XcmV5AssetFilter = Enum<{
    "Definite": Anonymize<I4npjalvhmfuj>;
    "Wild": XcmV5WildAsset;
}>;
export declare const XcmV5AssetFilter: GetEnum<XcmV5AssetFilter>;
export type XcmV5WildAsset = Enum<{
    "All": undefined;
    "AllOf": {
        "id": Anonymize<If9iqq7i64mur8>;
        "fun": XcmV2MultiassetWildFungibility;
    };
    "AllCounted": number;
    "AllOfCounted": {
        "id": Anonymize<If9iqq7i64mur8>;
        "fun": XcmV2MultiassetWildFungibility;
        "count": number;
    };
}>;
export declare const XcmV5WildAsset: GetEnum<XcmV5WildAsset>;
export type XcmV2MultiassetWildFungibility = Enum<{
    "Fungible": undefined;
    "NonFungible": undefined;
}>;
export declare const XcmV2MultiassetWildFungibility: GetEnum<XcmV2MultiassetWildFungibility>;
export type XcmV3WeightLimit = Enum<{
    "Unlimited": undefined;
    "Limited": Anonymize<I4q39t5hn830vp>;
}>;
export declare const XcmV3WeightLimit: GetEnum<XcmV3WeightLimit>;
export type Ieprdqqu7ildvr = {
    "query_id": bigint;
    "max_response_weight": Anonymize<I4q39t5hn830vp>;
};
export type Id7mf37dkpgfjs = {
    "index": number;
    "name": Uint8Array;
    "module_name": Uint8Array;
    "crate_major": number;
    "min_crate_minor": number;
};
export type I4nae9rsql8fa7 = {
    "jit_withdraw": boolean;
};
export type Ifhmc9e7vpeeig = AnonymousEnum<{
    "Teleport": XcmV5AssetFilter;
    "ReserveDeposit": XcmV5AssetFilter;
    "ReserveWithdraw": XcmV5AssetFilter;
}>;
export type Ibmuil6p3vl83l = {
    "origin": Anonymize<If9iqq7i64mur8>;
    "destination": Anonymize<If9iqq7i64mur8>;
    "error": Enum<{
        "NotApplicable": undefined;
        "Transport": undefined;
        "Unroutable": undefined;
        "DestinationUnsupported": undefined;
        "ExceedsMaxMessageSize": undefined;
        "MissingArgument": undefined;
        "Fees": undefined;
    }>;
    "message_id": SizedHex<32>;
};
export type I7lul91g50ae87 = {
    "origin": Anonymize<If9iqq7i64mur8>;
    "error": Anonymize<Id56rgs0bdb7gl>;
    "message_id": SizedHex<32>;
};
export type Icl7nl1rfeog3i = {
    "origin": Anonymize<If9iqq7i64mur8>;
    "query_id": bigint;
};
export type Iasr6pj6shs0fl = {
    "query_id": bigint;
    "response": Anonymize<I7vucpgm2c6959>;
};
export type I2uqmls7kcdnii = {
    "query_id": bigint;
    "pallet_index": number;
    "call_index": number;
};
export type Idg69klialbkb8 = {
    "query_id": bigint;
    "pallet_index": number;
    "call_index": number;
    "actual_weight": Anonymize<I4q39t5hn830vp>;
    "max_budgeted_weight": Anonymize<I4q39t5hn830vp>;
};
export type I7r6b7145022pp = {
    "origin": Anonymize<If9iqq7i64mur8>;
    "query_id": bigint;
    "expected_location"?: Anonymize<I4pai6qnfk426l>;
};
export type I30pg328m00nr3 = {
    "query_id": bigint;
};
export type Icmrn7bogp28cs = {
    "hash": SizedHex<32>;
    "origin": Anonymize<If9iqq7i64mur8>;
    "assets": XcmVersionedAssets;
};
export type XcmVersionedAssets = Enum<{
    "V3": Anonymize<Iai6dhqiq3bach>;
    "V4": Anonymize<I50mli3hb64f9b>;
    "V5": Anonymize<I4npjalvhmfuj>;
}>;
export declare const XcmVersionedAssets: GetEnum<XcmVersionedAssets>;
export type Iai6dhqiq3bach = Array<Anonymize<Idcm24504c8bkk>>;
export type Idcm24504c8bkk = {
    "id": XcmV3MultiassetAssetId;
    "fun": XcmV3MultiassetFungibility;
};
export type XcmV3MultiassetAssetId = Enum<{
    "Concrete": Anonymize<I4c0s5cioidn76>;
    "Abstract": SizedHex<32>;
}>;
export declare const XcmV3MultiassetAssetId: GetEnum<XcmV3MultiassetAssetId>;
export type I4c0s5cioidn76 = {
    "parents": number;
    "interior": XcmV3Junctions;
};
export type XcmV3Junctions = Enum<{
    "Here": undefined;
    "X1": XcmV3Junction;
    "X2": FixedSizeArray<2, XcmV3Junction>;
    "X3": FixedSizeArray<3, XcmV3Junction>;
    "X4": FixedSizeArray<4, XcmV3Junction>;
    "X5": FixedSizeArray<5, XcmV3Junction>;
    "X6": FixedSizeArray<6, XcmV3Junction>;
    "X7": FixedSizeArray<7, XcmV3Junction>;
    "X8": FixedSizeArray<8, XcmV3Junction>;
}>;
export declare const XcmV3Junctions: GetEnum<XcmV3Junctions>;
export type XcmV3Junction = Enum<{
    "Parachain": number;
    "AccountId32": {
        "network"?: Anonymize<Idcq3vns9tgp5p>;
        "id": SizedHex<32>;
    };
    "AccountIndex64": {
        "network"?: Anonymize<Idcq3vns9tgp5p>;
        "index": bigint;
    };
    "AccountKey20": {
        "network"?: Anonymize<Idcq3vns9tgp5p>;
        "key": SizedHex<20>;
    };
    "PalletInstance": number;
    "GeneralIndex": bigint;
    "GeneralKey": Anonymize<I15lht6t53odo4>;
    "OnlyChild": undefined;
    "Plurality": Anonymize<I518fbtnclg1oc>;
    "GlobalConsensus": XcmV3JunctionNetworkId;
}>;
export declare const XcmV3Junction: GetEnum<XcmV3Junction>;
export type Idcq3vns9tgp5p = (XcmV3JunctionNetworkId) | undefined;
export type XcmV3JunctionNetworkId = Enum<{
    "ByGenesis": SizedHex<32>;
    "ByFork": Anonymize<I15vf5oinmcgps>;
    "Polkadot": undefined;
    "Kusama": undefined;
    "Westend": undefined;
    "Rococo": undefined;
    "Wococo": undefined;
    "Ethereum": Anonymize<I623eo8t3jrbeo>;
    "BitcoinCore": undefined;
    "BitcoinCash": undefined;
    "PolkadotBulletin": undefined;
}>;
export declare const XcmV3JunctionNetworkId: GetEnum<XcmV3JunctionNetworkId>;
export type I50mli3hb64f9b = Array<Anonymize<Ia5l7mu5a6v49o>>;
export type Ia5l7mu5a6v49o = {
    "id": Anonymize<I4c0s5cioidn76>;
    "fun": XcmV3MultiassetFungibility;
};
export type I7m9b5plj4h5ot = {
    "destination": Anonymize<If9iqq7i64mur8>;
    "result": number;
    "cost": Anonymize<I4npjalvhmfuj>;
    "message_id": SizedHex<32>;
};
export type I9kt8c221c83ln = {
    "location": Anonymize<If9iqq7i64mur8>;
    "version": number;
};
export type I9onhk772nfs4f = {
    "location": Anonymize<If9iqq7i64mur8>;
    "query_id": bigint;
    "error": Anonymize<Id56rgs0bdb7gl>;
};
export type I3l6bnksrmt56r = {
    "location": XcmVersionedLocation;
    "query_id": bigint;
};
export type XcmVersionedLocation = Enum<{
    "V3": Anonymize<I4c0s5cioidn76>;
    "V4": Anonymize<I4c0s5cioidn76>;
    "V5": Anonymize<If9iqq7i64mur8>;
}>;
export declare const XcmVersionedLocation: GetEnum<XcmVersionedLocation>;
export type Idh09k0l2pmdcg = {
    "origin": Anonymize<If9iqq7i64mur8>;
    "query_id": bigint;
    "expected_querier": Anonymize<If9iqq7i64mur8>;
    "maybe_actual_querier"?: Anonymize<I4pai6qnfk426l>;
};
export type I7uoiphbm0tj4r = {
    "destination": Anonymize<If9iqq7i64mur8>;
    "cost": Anonymize<I4npjalvhmfuj>;
    "message_id": SizedHex<32>;
};
export type I512p1n7qt24l8 = {
    "paying": Anonymize<If9iqq7i64mur8>;
    "fees": Anonymize<I4npjalvhmfuj>;
};
export type I6s1nbislhk619 = {
    "version": number;
};
export type I3gghqnh2mj0is = {
    "aliaser": Anonymize<If9iqq7i64mur8>;
    "target": Anonymize<If9iqq7i64mur8>;
    "expiry"?: Anonymize<I35p85j063s0il>;
};
export type I35p85j063s0il = (bigint) | undefined;
export type I6iv852roh6t3h = {
    "aliaser": Anonymize<If9iqq7i64mur8>;
    "target": Anonymize<If9iqq7i64mur8>;
};
export type I9oc2o6itbiopq = {
    "target": Anonymize<If9iqq7i64mur8>;
};
export type I5uv57c3fffoi9 = AnonymousEnum<{
    /**
     * Downward message is invalid XCM.
     * \[ id \]
     */
    "InvalidFormat": SizedHex<32>;
    /**
     * Downward message is unsupported version of XCM.
     * \[ id \]
     */
    "UnsupportedVersion": SizedHex<32>;
    /**
     * Downward message executed with the given outcome.
     * \[ id, outcome \]
     */
    "ExecutedDownward": Anonymize<Ibslgga81p36aa>;
}>;
export type Ibslgga81p36aa = [SizedHex<32>, Anonymize<Ieqhmksji3pmv5>];
export type Ift4p4jnj5bri1 = AnonymousEnum<{
    /**
     * Delivery fee factor has been decreased.
     */
    "DeliveryFeeFactorDecreased": Anonymize<Ie8hpsm3jhsvo3>;
    /**
     * Delivery fee factor has been increased.
     */
    "DeliveryFeeFactorIncreased": Anonymize<Ie8hpsm3jhsvo3>;
}>;
export type Ie8hpsm3jhsvo3 = {
    /**
     * New value of the `DeliveryFeeFactor`.
     */
    "new_value": bigint;
};
export type I2kosejppk3jon = AnonymousEnum<{
    /**
     * Message discarded due to an error in the `MessageProcessor` (usually a format error).
     */
    "ProcessingFailed": Anonymize<I1rvj4ubaplho0>;
    /**
     * Message is processed.
     */
    "Processed": Anonymize<Ia3uu7lqcc1q1i>;
    /**
     * Message placed in overweight queue.
     */
    "OverweightEnqueued": Anonymize<I7crucfnonitkn>;
    /**
     * This page was reaped.
     */
    "PageReaped": Anonymize<I7tmrp94r9sq4n>;
}>;
export type I1rvj4ubaplho0 = {
    /**
     * The `blake2_256` hash of the message.
     */
    "id": SizedHex<32>;
    /**
     * The queue of the message.
     */
    "origin": Anonymize<Iejeo53sea6n4q>;
    /**
     * The error that occurred.
     *
     * This error is pretty opaque. More fine-grained errors need to be emitted as events
     * by the `MessageProcessor`.
     */
    "error": Enum<{
        "BadFormat": undefined;
        "Corrupt": undefined;
        "Unsupported": undefined;
        "Overweight": Anonymize<I4q39t5hn830vp>;
        "Yield": undefined;
        "StackLimitReached": undefined;
    }>;
};
export type Iejeo53sea6n4q = AnonymousEnum<{
    "Here": undefined;
    "Parent": undefined;
    "Sibling": number;
}>;
export type Ia3uu7lqcc1q1i = {
    /**
     * The `blake2_256` hash of the message.
     */
    "id": SizedHex<32>;
    /**
     * The queue of the message.
     */
    "origin": Anonymize<Iejeo53sea6n4q>;
    /**
     * How much weight was used to process the message.
     */
    "weight_used": Anonymize<I4q39t5hn830vp>;
    /**
     * Whether the message was processed.
     *
     * Note that this does not mean that the underlying `MessageProcessor` was internally
     * successful. It *solely* means that the MQ pallet will treat this as a success
     * condition and discard the message. Any internal error needs to be emitted as events
     * by the `MessageProcessor`.
     */
    "success": boolean;
};
export type I7crucfnonitkn = {
    /**
     * The `blake2_256` hash of the message.
     */
    "id": SizedHex<32>;
    /**
     * The queue of the message.
     */
    "origin": Anonymize<Iejeo53sea6n4q>;
    /**
     * The page of the message.
     */
    "page_index": number;
    /**
     * The index of the message within the page.
     */
    "message_index": number;
};
export type I7tmrp94r9sq4n = {
    /**
     * The queue of the page.
     */
    "origin": Anonymize<Iejeo53sea6n4q>;
    /**
     * The index of the page.
     */
    "index": number;
};
export type I190sdd2js8aqk = AnonymousEnum<{
    /**
     * An XCM was sent
     */
    "MessageSent": Anonymize<If8u5kl4h8070m>;
    /**
     * Set OperatingMode
     */
    "ExportOperatingModeChanged": Anonymize<I9i6b1362umn1t>;
}>;
export type I9i6b1362umn1t = {
    "mode": Anonymize<Ibqjcgmcid3dll>;
};
export type Ibqjcgmcid3dll = AnonymousEnum<{
    "Normal": undefined;
    "Halted": undefined;
}>;
export type I8is2marpm65jd = AnonymousEnum<{
    /**
     * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
     * well as the error.
     */
    "BatchInterrupted": Anonymize<I2pi79fr5p6fs0>;
    /**
     * Batch of dispatches completed fully with no error.
     */
    "BatchCompleted": undefined;
    /**
     * Batch of dispatches completed but has errors.
     */
    "BatchCompletedWithErrors": undefined;
    /**
     * A single item within a Batch of dispatches has completed with no error.
     */
    "ItemCompleted": undefined;
    /**
     * A single item within a Batch of dispatches has completed with error.
     */
    "ItemFailed": Anonymize<I8n30a7eej7n16>;
    /**
     * A call was dispatched.
     */
    "DispatchedAs": Anonymize<I8gv6h0r7v7hv>;
    /**
     * Main call was dispatched.
     */
    "IfElseMainSuccess": undefined;
    /**
     * The fallback call was dispatched.
     */
    "IfElseFallbackCalled": Anonymize<I58tu5pp7i2tgs>;
}>;
export type I2pi79fr5p6fs0 = {
    "index": number;
    "error": Anonymize<I72ju98lulovhp>;
};
export type I8n30a7eej7n16 = {
    "error": Anonymize<I72ju98lulovhp>;
};
export type I8gv6h0r7v7hv = {
    "result": Anonymize<Idqcgnrsbirg5n>;
};
export type I58tu5pp7i2tgs = {
    "main_error": Anonymize<I72ju98lulovhp>;
};
export type I83698tk7fspdd = AnonymousEnum<{
    /**
     * A new multisig operation has begun.
     */
    "NewMultisig": Anonymize<Iep27ialq4a7o7>;
    /**
     * A multisig operation has been approved by someone.
     */
    "MultisigApproval": Anonymize<Iasu5jvoqr43mv>;
    /**
     * A multisig operation has been executed.
     */
    "MultisigExecuted": Anonymize<I3ot064imihdqv>;
    /**
     * A multisig operation has been cancelled.
     */
    "MultisigCancelled": Anonymize<I5qolde99acmd1>;
    /**
     * The deposit for a multisig operation has been updated/poked.
     */
    "DepositPoked": Anonymize<I8gtde5abn1g9a>;
}>;
export type Iep27ialq4a7o7 = {
    "approving": SS58String;
    "multisig": SS58String;
    "call_hash": SizedHex<32>;
};
export type Iasu5jvoqr43mv = {
    "approving": SS58String;
    "timepoint": Anonymize<Itvprrpb0nm3o>;
    "multisig": SS58String;
    "call_hash": SizedHex<32>;
};
export type Itvprrpb0nm3o = {
    "height": number;
    "index": number;
};
export type I3ot064imihdqv = {
    "approving": SS58String;
    "timepoint": Anonymize<Itvprrpb0nm3o>;
    "multisig": SS58String;
    "call_hash": SizedHex<32>;
    "result": Anonymize<Idqcgnrsbirg5n>;
};
export type I5qolde99acmd1 = {
    "cancelling": SS58String;
    "timepoint": Anonymize<Itvprrpb0nm3o>;
    "multisig": SS58String;
    "call_hash": SizedHex<32>;
};
export type I8gtde5abn1g9a = {
    "who": SS58String;
    "call_hash": SizedHex<32>;
    "old_deposit": bigint;
    "new_deposit": bigint;
};
export type I4ppe871u93ft = AnonymousEnum<{
    /**
     * A proxy was executed correctly, with the given.
     */
    "ProxyExecuted": Anonymize<I8gv6h0r7v7hv>;
    /**
     * A pure account has been created by new proxy with given
     * disambiguation index and proxy type.
     */
    "PureCreated": Anonymize<Icnom4korobbg9>;
    /**
     * A pure proxy was killed by its spawner.
     */
    "PureKilled": Anonymize<I1n8ob4k6240vs>;
    /**
     * An announcement was placed to make a call in the future.
     */
    "Announced": Anonymize<I2ur0oeqg495j8>;
    /**
     * A proxy was added.
     */
    "ProxyAdded": Anonymize<I6m4engkf1gbh2>;
    /**
     * A proxy was removed.
     */
    "ProxyRemoved": Anonymize<I6m4engkf1gbh2>;
    /**
     * A deposit stored for proxies or announcements was poked / updated.
     */
    "DepositPoked": Anonymize<I1bhd210c3phjj>;
}>;
export type Icnom4korobbg9 = {
    "pure": SS58String;
    "who": SS58String;
    "proxy_type": Anonymize<Idugco9k7jdh0f>;
    "disambiguation_index": number;
    "at": number;
    "extrinsic_index": number;
};
export type Idugco9k7jdh0f = AnonymousEnum<{
    "Any": undefined;
    "NonTransfer": undefined;
    "CancelProxy": undefined;
    "Assets": undefined;
    "AssetOwner": undefined;
    "AssetManager": undefined;
    "Collator": undefined;
    "Governance": undefined;
    "Staking": undefined;
    "NominationPools": undefined;
    "Auction": undefined;
    "ParaRegistration": undefined;
    "StakingOperator": undefined;
}>;
export type I1n8ob4k6240vs = {
    "pure": SS58String;
    "spawner": SS58String;
    "proxy_type": Anonymize<Idugco9k7jdh0f>;
    "disambiguation_index": number;
};
export type I2ur0oeqg495j8 = {
    "real": SS58String;
    "proxy": SS58String;
    "call_hash": SizedHex<32>;
};
export type I6m4engkf1gbh2 = {
    "delegator": SS58String;
    "delegatee": SS58String;
    "proxy_type": Anonymize<Idugco9k7jdh0f>;
    "delay": number;
};
export type I1bhd210c3phjj = {
    "who": SS58String;
    "kind": Enum<{
        "Proxies": undefined;
        "Announcements": undefined;
    }>;
    "old_deposit": bigint;
    "new_deposit": bigint;
};
export type I2pejk6do5vg4t = AnonymousEnum<{
    /**
     * A account index was assigned.
     */
    "IndexAssigned": Anonymize<Ia1u3jll6a06ae>;
    /**
     * A account index has been freed up (unassigned).
     */
    "IndexFreed": Anonymize<I666bl2fqjkejo>;
    /**
     * A account index has been frozen to its current account ID.
     */
    "IndexFrozen": Anonymize<Ia1u3jll6a06ae>;
    /**
     * A deposit to reserve an index has been poked/reconsidered.
     */
    "DepositPoked": Anonymize<Ic9g5lvl9iddc5>;
}>;
export type Ia1u3jll6a06ae = {
    "who": SS58String;
    "index": number;
};
export type Ic9g5lvl9iddc5 = {
    "who": SS58String;
    "index": number;
    "old_deposit": bigint;
    "new_deposit": bigint;
};
export type Id8h717i1g4qqv = AnonymousEnum<{
    /**
     * Some asset class was created.
     */
    "Created": Anonymize<I88ff3u4dpivk>;
    /**
     * Some assets were issued.
     */
    "Issued": Anonymize<I33cp947glv1ks>;
    /**
     * Some assets were transferred.
     */
    "Transferred": Anonymize<Ic9om1gmmqu7rq>;
    /**
     * Some assets were destroyed.
     */
    "Burned": Anonymize<I5hfov2b68ppb6>;
    /**
     * The management team changed.
     */
    "TeamChanged": Anonymize<Ibthhb2m9vneds>;
    /**
     * The owner changed.
     */
    "OwnerChanged": Anonymize<Iaitn5bqfacj7k>;
    /**
     * Some account `who` was frozen.
     */
    "Frozen": Anonymize<If4ebvclj2ugvi>;
    /**
     * Some account `who` was thawed.
     */
    "Thawed": Anonymize<If4ebvclj2ugvi>;
    /**
     * Some asset `asset_id` was frozen.
     */
    "AssetFrozen": Anonymize<Ia5le7udkgbaq9>;
    /**
     * Some asset `asset_id` was thawed.
     */
    "AssetThawed": Anonymize<Ia5le7udkgbaq9>;
    /**
     * Accounts were destroyed for given asset.
     */
    "AccountsDestroyed": Anonymize<Ieduc1e6frq8rb>;
    /**
     * Approvals were destroyed for given asset.
     */
    "ApprovalsDestroyed": Anonymize<I9h6gbtabovtm4>;
    /**
     * An asset class is in the process of being destroyed.
     */
    "DestructionStarted": Anonymize<Ia5le7udkgbaq9>;
    /**
     * An asset class was destroyed.
     */
    "Destroyed": Anonymize<Ia5le7udkgbaq9>;
    /**
     * Some asset class was force-created.
     */
    "ForceCreated": Anonymize<Iaitn5bqfacj7k>;
    /**
     * New metadata has been set for an asset.
     */
    "MetadataSet": Anonymize<Ifnsa0dkkpf465>;
    /**
     * Metadata has been cleared for an asset.
     */
    "MetadataCleared": Anonymize<Ia5le7udkgbaq9>;
    /**
     * (Additional) funds have been approved for transfer to a destination account.
     */
    "ApprovedTransfer": Anonymize<I65dtqr2egjbc3>;
    /**
     * An approval for account `delegate` was cancelled by `owner`.
     */
    "ApprovalCancelled": Anonymize<Ibqj3vg5s5lk0c>;
    /**
     * An `amount` was transferred in its entirety from `owner` to `destination` by
     * the approved `delegate`.
     */
    "TransferredApproved": Anonymize<I6l73u513p8rna>;
    /**
     * An asset has had its attributes changed by the `Force` origin.
     */
    "AssetStatusChanged": Anonymize<Ia5le7udkgbaq9>;
    /**
     * The min_balance of an asset has been updated by the asset owner.
     */
    "AssetMinBalanceChanged": Anonymize<Iefqmt2htu1dlu>;
    /**
     * Some account `who` was created with a deposit from `depositor`.
     */
    "Touched": Anonymize<If8bgtgqrchjtu>;
    /**
     * Some account `who` was blocked.
     */
    "Blocked": Anonymize<If4ebvclj2ugvi>;
    /**
     * Some assets were deposited (e.g. for transaction fees).
     */
    "Deposited": Anonymize<Idusmq77988cmt>;
    /**
     * Some assets were withdrawn from the account (e.g. for transaction fees).
     */
    "Withdrawn": Anonymize<Idusmq77988cmt>;
    /**
     * Reserve information was set or updated for `asset_id`.
     */
    "ReservesUpdated": Anonymize<Ifhs6ggbuiec5i>;
    /**
     * Reserve information was removed for `asset_id`.
     */
    "ReservesRemoved": Anonymize<Ia5le7udkgbaq9>;
}>;
export type I88ff3u4dpivk = {
    "asset_id": number;
    "creator": SS58String;
    "owner": SS58String;
};
export type I33cp947glv1ks = {
    "asset_id": number;
    "owner": SS58String;
    "amount": bigint;
};
export type Ic9om1gmmqu7rq = {
    "asset_id": number;
    "from": SS58String;
    "to": SS58String;
    "amount": bigint;
};
export type I5hfov2b68ppb6 = {
    "asset_id": number;
    "owner": SS58String;
    "balance": bigint;
};
export type Ibthhb2m9vneds = {
    "asset_id": number;
    "issuer": SS58String;
    "admin": SS58String;
    "freezer": SS58String;
};
export type Iaitn5bqfacj7k = {
    "asset_id": number;
    "owner": SS58String;
};
export type If4ebvclj2ugvi = {
    "asset_id": number;
    "who": SS58String;
};
export type Ia5le7udkgbaq9 = {
    "asset_id": number;
};
export type Ieduc1e6frq8rb = {
    "asset_id": number;
    "accounts_destroyed": number;
    "accounts_remaining": number;
};
export type I9h6gbtabovtm4 = {
    "asset_id": number;
    "approvals_destroyed": number;
    "approvals_remaining": number;
};
export type Ifnsa0dkkpf465 = {
    "asset_id": number;
    "name": Uint8Array;
    "symbol": Uint8Array;
    "decimals": number;
    "is_frozen": boolean;
};
export type I65dtqr2egjbc3 = {
    "asset_id": number;
    "source": SS58String;
    "delegate": SS58String;
    "amount": bigint;
};
export type Ibqj3vg5s5lk0c = {
    "asset_id": number;
    "owner": SS58String;
    "delegate": SS58String;
};
export type I6l73u513p8rna = {
    "asset_id": number;
    "owner": SS58String;
    "delegate": SS58String;
    "destination": SS58String;
    "amount": bigint;
};
export type Iefqmt2htu1dlu = {
    "asset_id": number;
    "new_min_balance": bigint;
};
export type If8bgtgqrchjtu = {
    "asset_id": number;
    "who": SS58String;
    "depositor": SS58String;
};
export type Idusmq77988cmt = {
    "asset_id": number;
    "who": SS58String;
    "amount": bigint;
};
export type Ifhs6ggbuiec5i = {
    "asset_id": number;
    "reserves": Anonymize<I35l6p7kq19mr0>;
};
export type I35l6p7kq19mr0 = Array<undefined>;
export type Ia0j71vjrjqu9p = AnonymousEnum<{
    /**
     * A `collection` was created.
     */
    "Created": Anonymize<I9gqanbbbe917p>;
    /**
     * A `collection` was force-created.
     */
    "ForceCreated": Anonymize<Id1m1230297f7a>;
    /**
     * A `collection` was destroyed.
     */
    "Destroyed": Anonymize<I6cu7obfo0rr0o>;
    /**
     * An `item` was issued.
     */
    "Issued": Anonymize<Ifvb1p5munhhv4>;
    /**
     * An `item` was transferred.
     */
    "Transferred": Anonymize<I46h83ilqeed3g>;
    /**
     * An `item` was destroyed.
     */
    "Burned": Anonymize<Ifvb1p5munhhv4>;
    /**
     * Some `item` was frozen.
     */
    "Frozen": Anonymize<Iafkqus0ohh6l6>;
    /**
     * Some `item` was thawed.
     */
    "Thawed": Anonymize<Iafkqus0ohh6l6>;
    /**
     * Some `collection` was frozen.
     */
    "CollectionFrozen": Anonymize<I6cu7obfo0rr0o>;
    /**
     * Some `collection` was thawed.
     */
    "CollectionThawed": Anonymize<I6cu7obfo0rr0o>;
    /**
     * The owner changed.
     */
    "OwnerChanged": Anonymize<Icahse3uoi76n7>;
    /**
     * The management team changed.
     */
    "TeamChanged": Anonymize<I75sj3uv7gnemk>;
    /**
     * An `item` of a `collection` has been approved by the `owner` for transfer by
     * a `delegate`.
     */
    "ApprovedTransfer": Anonymize<I5fjkvcb5vr6nb>;
    /**
     * An approval for a `delegate` account to transfer the `item` of an item
     * `collection` was cancelled by its `owner`.
     */
    "ApprovalCancelled": Anonymize<I5fjkvcb5vr6nb>;
    /**
     * A `collection` has had its attributes changed by the `Force` origin.
     */
    "ItemStatusChanged": Anonymize<I6cu7obfo0rr0o>;
    /**
     * New metadata has been set for a `collection`.
     */
    "CollectionMetadataSet": Anonymize<I9viqhmdtuof5e>;
    /**
     * Metadata has been cleared for a `collection`.
     */
    "CollectionMetadataCleared": Anonymize<I6cu7obfo0rr0o>;
    /**
     * New metadata has been set for an item.
     */
    "MetadataSet": Anonymize<Iceq9fmmp9aeqv>;
    /**
     * Metadata has been cleared for an item.
     */
    "MetadataCleared": Anonymize<Iafkqus0ohh6l6>;
    /**
     * Metadata has been cleared for an item.
     */
    "Redeposited": Anonymize<I2gr1toekv86b9>;
    /**
     * New attribute metadata has been set for a `collection` or `item`.
     */
    "AttributeSet": Anonymize<I5tvvgui05tn6e>;
    /**
     * Attribute metadata has been cleared for a `collection` or `item`.
     */
    "AttributeCleared": Anonymize<Ibal0joadvdc2h>;
    /**
     * Ownership acceptance has changed for an account.
     */
    "OwnershipAcceptanceChanged": Anonymize<I2v2ikqt2trp52>;
    /**
     * Max supply has been set for a collection.
     */
    "CollectionMaxSupplySet": Anonymize<I6h88h8vba22v8>;
    /**
     * The price was set for the instance.
     */
    "ItemPriceSet": Anonymize<If3057hi1g5qlo>;
    /**
     * The price for the instance was removed.
     */
    "ItemPriceRemoved": Anonymize<Iafkqus0ohh6l6>;
    /**
     * An item was bought.
     */
    "ItemBought": Anonymize<Iaii5qf41d5n3d>;
}>;
export type I9gqanbbbe917p = {
    "collection": number;
    "creator": SS58String;
    "owner": SS58String;
};
export type Id1m1230297f7a = {
    "collection": number;
    "owner": SS58String;
};
export type I6cu7obfo0rr0o = {
    "collection": number;
};
export type Ifvb1p5munhhv4 = {
    "collection": number;
    "item": number;
    "owner": SS58String;
};
export type I46h83ilqeed3g = {
    "collection": number;
    "item": number;
    "from": SS58String;
    "to": SS58String;
};
export type Iafkqus0ohh6l6 = {
    "collection": number;
    "item": number;
};
export type Icahse3uoi76n7 = {
    "collection": number;
    "new_owner": SS58String;
};
export type I75sj3uv7gnemk = {
    "collection": number;
    "issuer": SS58String;
    "admin": SS58String;
    "freezer": SS58String;
};
export type I5fjkvcb5vr6nb = {
    "collection": number;
    "item": number;
    "owner": SS58String;
    "delegate": SS58String;
};
export type I9viqhmdtuof5e = {
    "collection": number;
    "data": Uint8Array;
    "is_frozen": boolean;
};
export type Iceq9fmmp9aeqv = {
    "collection": number;
    "item": number;
    "data": Uint8Array;
    "is_frozen": boolean;
};
export type I2gr1toekv86b9 = {
    "collection": number;
    "successful_items": Anonymize<Icgljjb6j82uhn>;
};
export type Icgljjb6j82uhn = Array<number>;
export type I5tvvgui05tn6e = {
    "collection": number;
    "maybe_item"?: Anonymize<I4arjljr6dpflb>;
    "key": Uint8Array;
    "value": Uint8Array;
};
export type I4arjljr6dpflb = (number) | undefined;
export type Ibal0joadvdc2h = {
    "collection": number;
    "maybe_item"?: Anonymize<I4arjljr6dpflb>;
    "key": Uint8Array;
};
export type I2v2ikqt2trp52 = {
    "who": SS58String;
    "maybe_collection"?: Anonymize<I4arjljr6dpflb>;
};
export type I6h88h8vba22v8 = {
    "collection": number;
    "max_supply": number;
};
export type If3057hi1g5qlo = {
    "collection": number;
    "item": number;
    "price": bigint;
    "whitelisted_buyer"?: Anonymize<Ihfphjolmsqq1>;
};
export type Ihfphjolmsqq1 = (SS58String) | undefined;
export type Iaii5qf41d5n3d = {
    "collection": number;
    "item": number;
    "price": bigint;
    "seller": SS58String;
    "buyer": SS58String;
};
export type I6qicn8jn4fftj = AnonymousEnum<{
    /**
     * A `collection` was created.
     */
    "Created": Anonymize<I9gqanbbbe917p>;
    /**
     * A `collection` was force-created.
     */
    "ForceCreated": Anonymize<Id1m1230297f7a>;
    /**
     * A `collection` was destroyed.
     */
    "Destroyed": Anonymize<I6cu7obfo0rr0o>;
    /**
     * An `item` was issued.
     */
    "Issued": Anonymize<Ifvb1p5munhhv4>;
    /**
     * An `item` was transferred.
     */
    "Transferred": Anonymize<I46h83ilqeed3g>;
    /**
     * An `item` was destroyed.
     */
    "Burned": Anonymize<Ifvb1p5munhhv4>;
    /**
     * An `item` became non-transferable.
     */
    "ItemTransferLocked": Anonymize<Iafkqus0ohh6l6>;
    /**
     * An `item` became transferable.
     */
    "ItemTransferUnlocked": Anonymize<Iafkqus0ohh6l6>;
    /**
     * `item` metadata or attributes were locked.
     */
    "ItemPropertiesLocked": Anonymize<I1jj31tn29ie3c>;
    /**
     * Some `collection` was locked.
     */
    "CollectionLocked": Anonymize<I6cu7obfo0rr0o>;
    /**
     * The owner changed.
     */
    "OwnerChanged": Anonymize<Icahse3uoi76n7>;
    /**
     * The management team changed.
     */
    "TeamChanged": Anonymize<Ico8bnjc6taa27>;
    /**
     * An `item` of a `collection` has been approved by the `owner` for transfer by
     * a `delegate`.
     */
    "TransferApproved": Anonymize<I78i1bvlonei69>;
    /**
     * An approval for a `delegate` account to transfer the `item` of an item
     * `collection` was cancelled by its `owner`.
     */
    "ApprovalCancelled": Anonymize<I5fjkvcb5vr6nb>;
    /**
     * All approvals of an item got cancelled.
     */
    "AllApprovalsCancelled": Anonymize<Ifvb1p5munhhv4>;
    /**
     * A `collection` has had its config changed by the `Force` origin.
     */
    "CollectionConfigChanged": Anonymize<I6cu7obfo0rr0o>;
    /**
     * New metadata has been set for a `collection`.
     */
    "CollectionMetadataSet": Anonymize<I78u60nqh0etah>;
    /**
     * Metadata has been cleared for a `collection`.
     */
    "CollectionMetadataCleared": Anonymize<I6cu7obfo0rr0o>;
    /**
     * New metadata has been set for an item.
     */
    "ItemMetadataSet": Anonymize<Icrkms46uh8tpb>;
    /**
     * Metadata has been cleared for an item.
     */
    "ItemMetadataCleared": Anonymize<Iafkqus0ohh6l6>;
    /**
     * The deposit for a set of `item`s within a `collection` has been updated.
     */
    "Redeposited": Anonymize<I2gr1toekv86b9>;
    /**
     * New attribute metadata has been set for a `collection` or `item`.
     */
    "AttributeSet": Anonymize<I5llu6o6a0go5i>;
    /**
     * Attribute metadata has been cleared for a `collection` or `item`.
     */
    "AttributeCleared": Anonymize<I93r2effh7od84>;
    /**
     * A new approval to modify item attributes was added.
     */
    "ItemAttributesApprovalAdded": Anonymize<I9i1f9mrso1hmf>;
    /**
     * A new approval to modify item attributes was removed.
     */
    "ItemAttributesApprovalRemoved": Anonymize<I9i1f9mrso1hmf>;
    /**
     * Ownership acceptance has changed for an account.
     */
    "OwnershipAcceptanceChanged": Anonymize<I2v2ikqt2trp52>;
    /**
     * Max supply has been set for a collection.
     */
    "CollectionMaxSupplySet": Anonymize<I6h88h8vba22v8>;
    /**
     * Mint settings for a collection had changed.
     */
    "CollectionMintSettingsUpdated": Anonymize<I6cu7obfo0rr0o>;
    /**
     * Event gets emitted when the `NextCollectionId` gets incremented.
     */
    "NextCollectionIdIncremented": Anonymize<I9ksla2si91s56>;
    /**
     * The price was set for the item.
     */
    "ItemPriceSet": Anonymize<If3057hi1g5qlo>;
    /**
     * The price for the item was removed.
     */
    "ItemPriceRemoved": Anonymize<Iafkqus0ohh6l6>;
    /**
     * An item was bought.
     */
    "ItemBought": Anonymize<Iaii5qf41d5n3d>;
    /**
     * A tip was sent.
     */
    "TipSent": Anonymize<Id9j7b85otvjru>;
    /**
     * An `item` swap intent was created.
     */
    "SwapCreated": Anonymize<Iaihk9pek2ajl9>;
    /**
     * The swap was cancelled.
     */
    "SwapCancelled": Anonymize<Iaihk9pek2ajl9>;
    /**
     * The swap has been claimed.
     */
    "SwapClaimed": Anonymize<Id9av23h47ufb2>;
    /**
     * New attributes have been set for an `item` of the `collection`.
     */
    "PreSignedAttributesSet": Anonymize<Ib4kpnijas4jqp>;
    /**
     * A new attribute in the `Pallet` namespace was set for the `collection` or an `item`
     * within that `collection`.
     */
    "PalletAttributeSet": Anonymize<I2vnu5k0u1i65h>;
}>;
export type I1jj31tn29ie3c = {
    "collection": number;
    "item": number;
    "lock_metadata": boolean;
    "lock_attributes": boolean;
};
export type Ico8bnjc6taa27 = {
    "collection": number;
    "issuer"?: Anonymize<Ihfphjolmsqq1>;
    "admin"?: Anonymize<Ihfphjolmsqq1>;
    "freezer"?: Anonymize<Ihfphjolmsqq1>;
};
export type I78i1bvlonei69 = {
    "collection": number;
    "item": number;
    "owner": SS58String;
    "delegate": SS58String;
    "deadline"?: Anonymize<I4arjljr6dpflb>;
};
export type I78u60nqh0etah = {
    "collection": number;
    "data": Uint8Array;
};
export type Icrkms46uh8tpb = {
    "collection": number;
    "item": number;
    "data": Uint8Array;
};
export type I5llu6o6a0go5i = {
    "collection": number;
    "maybe_item"?: Anonymize<I4arjljr6dpflb>;
    "key": Uint8Array;
    "value": Uint8Array;
    "namespace": Anonymize<If3jjadhmug6qc>;
};
export type If3jjadhmug6qc = AnonymousEnum<{
    "Pallet": undefined;
    "CollectionOwner": undefined;
    "ItemOwner": undefined;
    "Account": SS58String;
}>;
export type I93r2effh7od84 = {
    "collection": number;
    "maybe_item"?: Anonymize<I4arjljr6dpflb>;
    "key": Uint8Array;
    "namespace": Anonymize<If3jjadhmug6qc>;
};
export type I9i1f9mrso1hmf = {
    "collection": number;
    "item": number;
    "delegate": SS58String;
};
export type I9ksla2si91s56 = {
    "next_id"?: Anonymize<I4arjljr6dpflb>;
};
export type Id9j7b85otvjru = {
    "collection": number;
    "item": number;
    "sender": SS58String;
    "receiver": SS58String;
    "amount": bigint;
};
export type Iaihk9pek2ajl9 = {
    "offered_collection": number;
    "offered_item": number;
    "desired_collection": number;
    "desired_item"?: Anonymize<I4arjljr6dpflb>;
    "price"?: Anonymize<I6oogc1jbmmi81>;
    "deadline": number;
};
export type I6oogc1jbmmi81 = ({
    "amount": bigint;
    "direction": Enum<{
        "Send": undefined;
        "Receive": undefined;
    }>;
}) | undefined;
export type Id9av23h47ufb2 = {
    "sent_collection": number;
    "sent_item": number;
    "sent_item_owner": SS58String;
    "received_collection": number;
    "received_item": number;
    "received_item_owner": SS58String;
    "price"?: Anonymize<I6oogc1jbmmi81>;
    "deadline": number;
};
export type Ib4kpnijas4jqp = {
    "collection": number;
    "item": number;
    "namespace": Anonymize<If3jjadhmug6qc>;
};
export type I2vnu5k0u1i65h = {
    "collection": number;
    "item"?: Anonymize<I4arjljr6dpflb>;
    "attribute": Enum<{
        "UsedToClaim": number;
        "TransferDisabled": undefined;
    }>;
    "value": Uint8Array;
};
export type I7r4u2ebvv7606 = AnonymousEnum<{
    /**
     * Some asset class was created.
     */
    "Created": Anonymize<Icqe266pmnr25o>;
    /**
     * Some assets were issued.
     */
    "Issued": Anonymize<I5hoiph0lqphp>;
    /**
     * Some assets were transferred.
     */
    "Transferred": Anonymize<I5k7oropl9ofc7>;
    /**
     * Some assets were destroyed.
     */
    "Burned": Anonymize<I48vagp1omigob>;
    /**
     * The management team changed.
     */
    "TeamChanged": Anonymize<Ib5tst4ppem1g6>;
    /**
     * The owner changed.
     */
    "OwnerChanged": Anonymize<Ibn64edsrg3737>;
    /**
     * Some account `who` was frozen.
     */
    "Frozen": Anonymize<I83r9d02dh47j9>;
    /**
     * Some account `who` was thawed.
     */
    "Thawed": Anonymize<I83r9d02dh47j9>;
    /**
     * Some asset `asset_id` was frozen.
     */
    "AssetFrozen": Anonymize<I22bm4d7re21j9>;
    /**
     * Some asset `asset_id` was thawed.
     */
    "AssetThawed": Anonymize<I22bm4d7re21j9>;
    /**
     * Accounts were destroyed for given asset.
     */
    "AccountsDestroyed": Anonymize<I3jnhifvaeuama>;
    /**
     * Approvals were destroyed for given asset.
     */
    "ApprovalsDestroyed": Anonymize<I8n1gia0lo42ok>;
    /**
     * An asset class is in the process of being destroyed.
     */
    "DestructionStarted": Anonymize<I22bm4d7re21j9>;
    /**
     * An asset class was destroyed.
     */
    "Destroyed": Anonymize<I22bm4d7re21j9>;
    /**
     * Some asset class was force-created.
     */
    "ForceCreated": Anonymize<Ibn64edsrg3737>;
    /**
     * New metadata has been set for an asset.
     */
    "MetadataSet": Anonymize<I6gb0o7lqjfdjq>;
    /**
     * Metadata has been cleared for an asset.
     */
    "MetadataCleared": Anonymize<I22bm4d7re21j9>;
    /**
     * (Additional) funds have been approved for transfer to a destination account.
     */
    "ApprovedTransfer": Anonymize<Idh36v6iegkmpq>;
    /**
     * An approval for account `delegate` was cancelled by `owner`.
     */
    "ApprovalCancelled": Anonymize<I27hnueutmchbe>;
    /**
     * An `amount` was transferred in its entirety from `owner` to `destination` by
     * the approved `delegate`.
     */
    "TransferredApproved": Anonymize<Iectm2em66uhao>;
    /**
     * An asset has had its attributes changed by the `Force` origin.
     */
    "AssetStatusChanged": Anonymize<I22bm4d7re21j9>;
    /**
     * The min_balance of an asset has been updated by the asset owner.
     */
    "AssetMinBalanceChanged": Anonymize<I7q57goff3j72h>;
    /**
     * Some account `who` was created with a deposit from `depositor`.
     */
    "Touched": Anonymize<Ibe49veu9i9nro>;
    /**
     * Some account `who` was blocked.
     */
    "Blocked": Anonymize<I83r9d02dh47j9>;
    /**
     * Some assets were deposited (e.g. for transaction fees).
     */
    "Deposited": Anonymize<I1rnkmiu7usb82>;
    /**
     * Some assets were withdrawn from the account (e.g. for transaction fees).
     */
    "Withdrawn": Anonymize<I1rnkmiu7usb82>;
    /**
     * Reserve information was set or updated for `asset_id`.
     */
    "ReservesUpdated": Anonymize<Iadvnek4gbu68j>;
    /**
     * Reserve information was removed for `asset_id`.
     */
    "ReservesRemoved": Anonymize<I22bm4d7re21j9>;
}>;
export type Icqe266pmnr25o = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "creator": SS58String;
    "owner": SS58String;
};
export type I5hoiph0lqphp = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "owner": SS58String;
    "amount": bigint;
};
export type I5k7oropl9ofc7 = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "from": SS58String;
    "to": SS58String;
    "amount": bigint;
};
export type I48vagp1omigob = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "owner": SS58String;
    "balance": bigint;
};
export type Ib5tst4ppem1g6 = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "issuer": SS58String;
    "admin": SS58String;
    "freezer": SS58String;
};
export type Ibn64edsrg3737 = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "owner": SS58String;
};
export type I83r9d02dh47j9 = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "who": SS58String;
};
export type I22bm4d7re21j9 = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
};
export type I3jnhifvaeuama = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "accounts_destroyed": number;
    "accounts_remaining": number;
};
export type I8n1gia0lo42ok = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "approvals_destroyed": number;
    "approvals_remaining": number;
};
export type I6gb0o7lqjfdjq = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "name": Uint8Array;
    "symbol": Uint8Array;
    "decimals": number;
    "is_frozen": boolean;
};
export type Idh36v6iegkmpq = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "source": SS58String;
    "delegate": SS58String;
    "amount": bigint;
};
export type I27hnueutmchbe = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "owner": SS58String;
    "delegate": SS58String;
};
export type Iectm2em66uhao = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "owner": SS58String;
    "delegate": SS58String;
    "destination": SS58String;
    "amount": bigint;
};
export type I7q57goff3j72h = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "new_min_balance": bigint;
};
export type Ibe49veu9i9nro = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "who": SS58String;
    "depositor": SS58String;
};
export type I1rnkmiu7usb82 = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "who": SS58String;
    "amount": bigint;
};
export type Iadvnek4gbu68j = {
    "asset_id": Anonymize<If9iqq7i64mur8>;
    "reserves": Anonymize<If2801grpltbp8>;
};
export type If2801grpltbp8 = Array<{
    "reserve": Anonymize<If9iqq7i64mur8>;
    "teleportable": boolean;
}>;
export type Ievo2o32gc42ng = AnonymousEnum<{
    /**
     * A successful call of the `CreatePool` extrinsic will create this event.
     */
    "PoolCreated": Anonymize<I1q546n7mmm8nk>;
    /**
     * A successful call of the `AddLiquidity` extrinsic will create this event.
     */
    "LiquidityAdded": Anonymize<If7i5aoh4lk0a1>;
    /**
     * A successful call of the `RemoveLiquidity` extrinsic will create this event.
     */
    "LiquidityRemoved": Anonymize<If9prqbk25189q>;
    /**
     * Assets have been converted from one to another. Both `SwapExactTokenForToken`
     * and `SwapTokenForExactToken` will generate this event.
     */
    "SwapExecuted": Anonymize<Icugn66dlnp8rd>;
    /**
     * Assets have been converted from one to another.
     */
    "SwapCreditExecuted": Anonymize<I1bfrt15apsnp>;
    /**
     * Pool has been touched in order to fulfill operational requirements.
     */
    "Touched": Anonymize<Id3old33tr9erj>;
}>;
export type I1q546n7mmm8nk = {
    /**
     * The account that created the pool.
     */
    "creator": SS58String;
    /**
     * The pool id associated with the pool. Note that the order of the assets may not be
     * the same as the order specified in the create pool extrinsic.
     */
    "pool_id": Anonymize<If21n82i0516em>;
    /**
     * The account ID of the pool.
     */
    "pool_account": SS58String;
    /**
     * The id of the liquidity tokens that will be minted when assets are added to this
     * pool.
     */
    "lp_token": number;
};
export type If21n82i0516em = FixedSizeArray<2, Anonymize<If9iqq7i64mur8>>;
export type If7i5aoh4lk0a1 = {
    /**
     * The account that the liquidity was taken from.
     */
    "who": SS58String;
    /**
     * The account that the liquidity tokens were minted to.
     */
    "mint_to": SS58String;
    /**
     * The pool id of the pool that the liquidity was added to.
     */
    "pool_id": Anonymize<If21n82i0516em>;
    /**
     * The amount of the first asset that was added to the pool.
     */
    "amount1_provided": bigint;
    /**
     * The amount of the second asset that was added to the pool.
     */
    "amount2_provided": bigint;
    /**
     * The id of the lp token that was minted.
     */
    "lp_token": number;
    /**
     * The amount of lp tokens that were minted of that id.
     */
    "lp_token_minted": bigint;
};
export type If9prqbk25189q = {
    /**
     * The account that the liquidity tokens were burned from.
     */
    "who": SS58String;
    /**
     * The account that the assets were transferred to.
     */
    "withdraw_to": SS58String;
    /**
     * The pool id that the liquidity was removed from.
     */
    "pool_id": Anonymize<If21n82i0516em>;
    /**
     * The amount of the first asset that was removed from the pool.
     */
    "amount1": bigint;
    /**
     * The amount of the second asset that was removed from the pool.
     */
    "amount2": bigint;
    /**
     * The id of the lp token that was burned.
     */
    "lp_token": number;
    /**
     * The amount of lp tokens that were burned of that id.
     */
    "lp_token_burned": bigint;
    /**
     * Liquidity withdrawal fee (%).
     */
    "withdrawal_fee": number;
};
export type Icugn66dlnp8rd = {
    /**
     * Which account was the instigator of the swap.
     */
    "who": SS58String;
    /**
     * The account that the assets were transferred to.
     */
    "send_to": SS58String;
    /**
     * The amount of the first asset that was swapped.
     */
    "amount_in": bigint;
    /**
     * The amount of the second asset that was received.
     */
    "amount_out": bigint;
    /**
     * The route of asset IDs with amounts that the swap went through.
     * E.g. (A, amount_in) -> (Dot, amount_out) -> (B, amount_out)
     */
    "path": Anonymize<I7egh93q89718t>;
};
export type I7egh93q89718t = Array<[Anonymize<If9iqq7i64mur8>, bigint]>;
export type I1bfrt15apsnp = {
    /**
     * The amount of the first asset that was swapped.
     */
    "amount_in": bigint;
    /**
     * The amount of the second asset that was received.
     */
    "amount_out": bigint;
    /**
     * The route of asset IDs with amounts that the swap went through.
     * E.g. (A, amount_in) -> (Dot, amount_out) -> (B, amount_out)
     */
    "path": Anonymize<I7egh93q89718t>;
};
export type Id3old33tr9erj = {
    /**
     * The ID of the pool.
     */
    "pool_id": Anonymize<If21n82i0516em>;
    /**
     * The account initiating the touch.
     */
    "who": SS58String;
};
export type I4jdb4j2c6meuu = AnonymousEnum<{
    /**
     * We have ended a spend period and will now allocate funds.
     */
    "Spending": Anonymize<I8iksqi3eani0a>;
    /**
     * Some funds have been allocated.
     */
    "Awarded": Anonymize<I16enopmju1p0q>;
    /**
     * Some of our funds have been burnt.
     */
    "Burnt": Anonymize<I43kq8qudg7pq9>;
    /**
     * Spending has finished; this is the amount that rolls over until next spend.
     */
    "Rollover": Anonymize<I76riseemre533>;
    /**
     * Some funds have been deposited.
     */
    "Deposit": Anonymize<Ie5v6njpckr05b>;
    /**
     * A new spend proposal has been approved.
     */
    "SpendApproved": Anonymize<I38bmcrmh852rk>;
    /**
     * The inactive funds of the pallet have been updated.
     */
    "UpdatedInactive": Anonymize<I4hcillge8de5f>;
    /**
     * A new asset spend proposal has been approved.
     */
    "AssetSpendApproved": Anonymize<I6pl54js63fnua>;
    /**
     * An approved spend was voided.
     */
    "AssetSpendVoided": Anonymize<I666bl2fqjkejo>;
    /**
     * A payment happened.
     */
    "Paid": Anonymize<Iek7v4hrgnq6iv>;
    /**
     * A payment failed and can be retried.
     */
    "PaymentFailed": Anonymize<Iek7v4hrgnq6iv>;
    /**
     * A spend was processed and removed from the storage. It might have been successfully
     * paid or it may have expired.
     */
    "SpendProcessed": Anonymize<I666bl2fqjkejo>;
}>;
export type I8iksqi3eani0a = {
    "budget_remaining": bigint;
};
export type I16enopmju1p0q = {
    "proposal_index": number;
    "award": bigint;
    "account": SS58String;
};
export type I43kq8qudg7pq9 = {
    "burnt_funds": bigint;
};
export type I76riseemre533 = {
    "rollover_balance": bigint;
};
export type Ie5v6njpckr05b = {
    "value": bigint;
};
export type I38bmcrmh852rk = {
    "proposal_index": number;
    "amount": bigint;
    "beneficiary": SS58String;
};
export type I4hcillge8de5f = {
    "reactivated": bigint;
    "deactivated": bigint;
};
export type I6pl54js63fnua = {
    "index": number;
    "asset_kind": Anonymize<I2q3ri6itcjj5u>;
    "amount": bigint;
    "beneficiary": Anonymize<I11rphme8avgla>;
    "valid_from": number;
    "expire_at": number;
};
export type I2q3ri6itcjj5u = AnonymousEnum<{
    "V3": {
        "location": Anonymize<I4c0s5cioidn76>;
        "asset_id": XcmV3MultiassetAssetId;
    };
    "V4": {
        "location": Anonymize<I4c0s5cioidn76>;
        "asset_id": Anonymize<I4c0s5cioidn76>;
    };
    "V5": {
        "location": Anonymize<If9iqq7i64mur8>;
        "asset_id": Anonymize<If9iqq7i64mur8>;
    };
}>;
export type I11rphme8avgla = AnonymousEnum<{
    "V4": {
        "location": Anonymize<I4c0s5cioidn76>;
        "account_id": Anonymize<I4c0s5cioidn76>;
    };
    "V5": {
        "location": Anonymize<If9iqq7i64mur8>;
        "account_id": Anonymize<If9iqq7i64mur8>;
    };
}>;
export type Iek7v4hrgnq6iv = {
    "index": number;
    "payment_id": bigint;
};
export type I7pql8a2uf8mlq = AnonymousEnum<{
    /**
     * An account has delegated their vote to another account. \[who, target\]
     */
    "Delegated": Anonymize<I7svrbkiu01iec>;
    /**
     * An \[account\] has cancelled a previous delegation operation.
     */
    "Undelegated": Anonymize<I6ouflveob4eli>;
    /**
     * An account has voted
     */
    "Voted": Anonymize<I8cbok7qd7ru4t>;
    /**
     * A vote has been removed
     */
    "VoteRemoved": Anonymize<I8cbok7qd7ru4t>;
    /**
     * The lockup period of a conviction vote expired, and the funds have been unlocked.
     */
    "VoteUnlocked": Anonymize<I7kij8p9kchdjo>;
}>;
export type I7svrbkiu01iec = [SS58String, SS58String, number];
export type I6ouflveob4eli = [SS58String, number];
export type I8cbok7qd7ru4t = {
    "who": SS58String;
    "vote": ConvictionVotingVoteAccountVote;
    "poll_index": number;
};
export type ConvictionVotingVoteAccountVote = Enum<{
    "Standard": {
        "vote": number;
        "balance": bigint;
    };
    "Split": {
        "aye": bigint;
        "nay": bigint;
    };
    "SplitAbstain": {
        "aye": bigint;
        "nay": bigint;
        "abstain": bigint;
    };
}>;
export declare const ConvictionVotingVoteAccountVote: GetEnum<ConvictionVotingVoteAccountVote>;
export type I7kij8p9kchdjo = {
    "who": SS58String;
    "class": number;
};
export type Idfraa3b4eu018 = AnonymousEnum<{
    /**
     * A referendum has been submitted.
     */
    "Submitted": Anonymize<I229ijht536qdu>;
    /**
     * The decision deposit has been placed.
     */
    "DecisionDepositPlaced": Anonymize<I62nte77gksm0f>;
    /**
     * The decision deposit has been refunded.
     */
    "DecisionDepositRefunded": Anonymize<I62nte77gksm0f>;
    /**
     * A deposit has been slashed.
     */
    "DepositSlashed": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * A referendum has moved into the deciding phase.
     */
    "DecisionStarted": Anonymize<I9cg2delv92pvq>;
    "ConfirmStarted": Anonymize<I666bl2fqjkejo>;
    "ConfirmAborted": Anonymize<I666bl2fqjkejo>;
    /**
     * A referendum has ended its confirmation phase and is ready for approval.
     */
    "Confirmed": Anonymize<Ilhp45uime5tp>;
    /**
     * A referendum has been approved and its proposal has been scheduled.
     */
    "Approved": Anonymize<I666bl2fqjkejo>;
    /**
     * A proposal has been rejected by referendum.
     */
    "Rejected": Anonymize<Ilhp45uime5tp>;
    /**
     * A referendum has been timed out without being decided.
     */
    "TimedOut": Anonymize<Ilhp45uime5tp>;
    /**
     * A referendum has been cancelled.
     */
    "Cancelled": Anonymize<Ilhp45uime5tp>;
    /**
     * A referendum has been killed.
     */
    "Killed": Anonymize<Ilhp45uime5tp>;
    /**
     * The submission deposit has been refunded.
     */
    "SubmissionDepositRefunded": Anonymize<I62nte77gksm0f>;
    /**
     * Metadata for a referendum has been set.
     */
    "MetadataSet": Anonymize<I4f1hv034jf1dt>;
    /**
     * Metadata for a referendum has been cleared.
     */
    "MetadataCleared": Anonymize<I4f1hv034jf1dt>;
}>;
export type I229ijht536qdu = {
    /**
     * Index of the referendum.
     */
    "index": number;
    /**
     * The track (and by extension proposal dispatch origin) of this referendum.
     */
    "track": number;
    /**
     * The proposal for the referendum.
     */
    "proposal": PreimagesBounded;
};
export type PreimagesBounded = Enum<{
    "Legacy": Anonymize<I1jm8m1rh9e20v>;
    "Inline": Uint8Array;
    "Lookup": {
        "hash": SizedHex<32>;
        "len": number;
    };
}>;
export declare const PreimagesBounded: GetEnum<PreimagesBounded>;
export type I62nte77gksm0f = {
    /**
     * Index of the referendum.
     */
    "index": number;
    /**
     * The account who placed the deposit.
     */
    "who": SS58String;
    /**
     * The amount placed by the account.
     */
    "amount": bigint;
};
export type I9cg2delv92pvq = {
    /**
     * Index of the referendum.
     */
    "index": number;
    /**
     * The track (and by extension proposal dispatch origin) of this referendum.
     */
    "track": number;
    /**
     * The proposal for the referendum.
     */
    "proposal": PreimagesBounded;
    /**
     * The current tally of votes in this referendum.
     */
    "tally": Anonymize<Ifsk7cbmtit1jd>;
};
export type Ifsk7cbmtit1jd = {
    "ayes": bigint;
    "nays": bigint;
    "support": bigint;
};
export type Ilhp45uime5tp = {
    /**
     * Index of the referendum.
     */
    "index": number;
    /**
     * The final tally of votes in this referendum.
     */
    "tally": Anonymize<Ifsk7cbmtit1jd>;
};
export type I4f1hv034jf1dt = {
    /**
     * Index of the referendum.
     */
    "index": number;
    /**
     * Preimage hash.
     */
    "hash": SizedHex<32>;
};
export type Iaaki59hl2dj6f = AnonymousEnum<{
    "CallWhitelisted": Anonymize<I1adbcfi5uc62r>;
    "WhitelistedCallRemoved": Anonymize<I1adbcfi5uc62r>;
    "WhitelistedCallDispatched": Anonymize<Icfla2fq51530d>;
}>;
export type I1adbcfi5uc62r = {
    "call_hash": SizedHex<32>;
};
export type Icfla2fq51530d = {
    "call_hash": SizedHex<32>;
    "result": Anonymize<Iodeus2jc07q6>;
};
export type Iodeus2jc07q6 = ResultPayload<Anonymize<Ia1u1r3n74r13c>, {
    "post_info": Anonymize<Ia1u1r3n74r13c>;
    "error": Anonymize<I72ju98lulovhp>;
}>;
export type Ia1u1r3n74r13c = {
    "actual_weight"?: Anonymize<Iasb8k6ash5mjn>;
    "pays_fee": Anonymize<Iehg04bj71rkd>;
};
export type Ialf8tlustkp17 = AnonymousEnum<{
    /**
     * New bounty proposal.
     */
    "BountyProposed": Anonymize<I666bl2fqjkejo>;
    /**
     * A bounty proposal was rejected; funds were slashed.
     */
    "BountyRejected": Anonymize<Id9idaj83175f9>;
    /**
     * A bounty proposal is funded and became active.
     */
    "BountyBecameActive": Anonymize<I666bl2fqjkejo>;
    /**
     * A bounty is awarded to a beneficiary.
     */
    "BountyAwarded": Anonymize<Ie1semicfuv5uu>;
    /**
     * A bounty is claimed by beneficiary.
     */
    "BountyClaimed": Anonymize<If25fjs9o37co1>;
    /**
     * A bounty is cancelled.
     */
    "BountyCanceled": Anonymize<I666bl2fqjkejo>;
    /**
     * A bounty expiry is extended.
     */
    "BountyExtended": Anonymize<I666bl2fqjkejo>;
    /**
     * A bounty is approved.
     */
    "BountyApproved": Anonymize<I666bl2fqjkejo>;
    /**
     * A bounty curator is proposed.
     */
    "CuratorProposed": Anonymize<I70sc1pdo8vtos>;
    /**
     * A bounty curator is unassigned.
     */
    "CuratorUnassigned": Anonymize<Ia9p5bg6p18r0i>;
    /**
     * A bounty curator is accepted.
     */
    "CuratorAccepted": Anonymize<I70sc1pdo8vtos>;
    /**
     * A bounty deposit has been poked.
     */
    "DepositPoked": Anonymize<Ibck5e4jpm96l8>;
}>;
export type Id9idaj83175f9 = {
    "index": number;
    "bond": bigint;
};
export type Ie1semicfuv5uu = {
    "index": number;
    "beneficiary": SS58String;
};
export type If25fjs9o37co1 = {
    "index": number;
    "payout": bigint;
    "beneficiary": SS58String;
};
export type I70sc1pdo8vtos = {
    "bounty_id": number;
    "curator": SS58String;
};
export type Ia9p5bg6p18r0i = {
    "bounty_id": number;
};
export type Ibck5e4jpm96l8 = {
    "bounty_id": number;
    "proposer": SS58String;
    "old_deposit": bigint;
    "new_deposit": bigint;
};
export type ChildBountiesEvent = Enum<{
    /**
     * A child-bounty is added.
     */
    "Added": Anonymize<I60p8l86a8cm59>;
    /**
     * A child-bounty is awarded to a beneficiary.
     */
    "Awarded": Anonymize<I3m3sk2lgcabvp>;
    /**
     * A child-bounty is claimed by beneficiary.
     */
    "Claimed": Anonymize<I5pf572duh4oeg>;
    /**
     * A child-bounty is cancelled.
     */
    "Canceled": Anonymize<I60p8l86a8cm59>;
}>;
export declare const ChildBountiesEvent: GetEnum<ChildBountiesEvent>;
export type I60p8l86a8cm59 = {
    "index": number;
    "child_index": number;
};
export type I3m3sk2lgcabvp = {
    "index": number;
    "child_index": number;
    "beneficiary": SS58String;
};
export type I5pf572duh4oeg = {
    "index": number;
    "child_index": number;
    "payout": bigint;
    "beneficiary": SS58String;
};
export type I1dcjapt414ijf = AnonymousEnum<{
    "AssetRateCreated": Anonymize<I9c4d50jrp7as1>;
    "AssetRateRemoved": Anonymize<Ifplevr9hp8jo3>;
    "AssetRateUpdated": Anonymize<Idrugh2blv81ia>;
}>;
export type I9c4d50jrp7as1 = {
    "asset_kind": Anonymize<I2q3ri6itcjj5u>;
    "rate": bigint;
};
export type Ifplevr9hp8jo3 = {
    "asset_kind": Anonymize<I2q3ri6itcjj5u>;
};
export type Idrugh2blv81ia = {
    "asset_kind": Anonymize<I2q3ri6itcjj5u>;
    "old": bigint;
    "new": bigint;
};
export type Iflv3gsndvcvub = AnonymousEnum<{
    /**
     * A new bounty was created and funding has been initiated.
     */
    "BountyCreated": Anonymize<I666bl2fqjkejo>;
    /**
     * A new child-bounty was created and funding has been initiated.
     */
    "ChildBountyCreated": Anonymize<I60p8l86a8cm59>;
    /**
     * The curator accepted role and child-/bounty became active.
     */
    "BountyBecameActive": Anonymize<I41bt7lr6c2cqa>;
    /**
     * A child-/bounty was awarded to a beneficiary.
     */
    "BountyAwarded": Anonymize<I200voven22cdm>;
    /**
     * Payout payment to the beneficiary has concluded successfully.
     */
    "BountyPayoutProcessed": Anonymize<I2j7mp9h804tg2>;
    /**
     * Funding payment has concluded successfully.
     */
    "BountyFundingProcessed": Anonymize<I1hl2lumftiuhm>;
    /**
     * Refund payment has concluded successfully.
     */
    "BountyRefundProcessed": Anonymize<I1hl2lumftiuhm>;
    /**
     * A child-/bounty was cancelled.
     */
    "BountyCanceled": Anonymize<I1hl2lumftiuhm>;
    /**
     * A child-/bounty curator was unassigned.
     */
    "CuratorUnassigned": Anonymize<I1hl2lumftiuhm>;
    /**
     * A child-/bounty curator was proposed.
     */
    "CuratorProposed": Anonymize<I41bt7lr6c2cqa>;
    /**
     * A payment failed and can be retried.
     */
    "PaymentFailed": Anonymize<Iccp9ugd60cntc>;
    /**
     * A payment happened and can be checked.
     */
    "Paid": Anonymize<Iccp9ugd60cntc>;
}>;
export type I41bt7lr6c2cqa = {
    "index": number;
    "child_index"?: Anonymize<I4arjljr6dpflb>;
    "curator": SS58String;
};
export type I200voven22cdm = {
    "index": number;
    "child_index"?: Anonymize<I4arjljr6dpflb>;
    "beneficiary": Anonymize<I11rphme8avgla>;
};
export type I2j7mp9h804tg2 = {
    "index": number;
    "child_index"?: Anonymize<I4arjljr6dpflb>;
    "asset_kind": Anonymize<I2q3ri6itcjj5u>;
    "value": bigint;
    "beneficiary": Anonymize<I11rphme8avgla>;
};
export type I1hl2lumftiuhm = {
    "index": number;
    "child_index"?: Anonymize<I4arjljr6dpflb>;
};
export type Iccp9ugd60cntc = {
    "index": number;
    "child_index"?: Anonymize<I4arjljr6dpflb>;
    "payment_id": bigint;
};
export type I61dksvl51aujo = AnonymousEnum<{
    /**
     * Given number of `(top, child)` keys were migrated respectively, with the given
     * `compute`.
     */
    "Migrated": Anonymize<Iagqcb06kbevb1>;
    /**
     * Some account got slashed by the given amount.
     */
    "Slashed": Anonymize<Id5fm4p8lj5qgi>;
    /**
     * The auto migration task finished.
     */
    "AutoMigrationFinished": undefined;
    /**
     * Migration got halted due to an error or miss-configuration.
     */
    "Halted": Anonymize<Iec8defeh924b6>;
}>;
export type Iagqcb06kbevb1 = {
    "top": number;
    "child": number;
    "compute": Enum<{
        "Signed": undefined;
        "Auto": undefined;
    }>;
};
export type Iec8defeh924b6 = {
    "error": Anonymize<I96objte63brjr>;
};
export type Id0dkgikq71n9h = AnonymousEnum<{
    /**
     * A pool has been created.
     */
    "Created": Anonymize<I1ti389kf8t6oi>;
    /**
     * A member has became bonded in a pool.
     */
    "Bonded": Anonymize<If4nnre373amul>;
    /**
     * A payout has been made to a member.
     */
    "PaidOut": Anonymize<I55kbor0ocqk6h>;
    /**
     * A member has unbonded from their pool.
     *
     * - `balance` is the corresponding balance of the number of points that has been
     * requested to be unbonded (the argument of the `unbond` transaction) from the bonded
     * pool.
     * - `points` is the number of points that are issued as a result of `balance` being
     * dissolved into the corresponding unbonding pool.
     * - `era` is the era in which the balance will be unbonded.
     * In the absence of slashing, these values will match. In the presence of slashing, the
     * number of points that are issued in the unbonding pool will be less than the amount
     * requested to be unbonded.
     */
    "Unbonded": Anonymize<Idsj9cg7j96kpc>;
    /**
     * A member has withdrawn from their pool.
     *
     * The given number of `points` have been dissolved in return of `balance`.
     *
     * Similar to `Unbonded` event, in the absence of slashing, the ratio of point to balance
     * will be 1.
     */
    "Withdrawn": Anonymize<Ido4u9drncfaml>;
    /**
     * A pool has been destroyed.
     */
    "Destroyed": Anonymize<I931cottvong90>;
    /**
     * The state of a pool has changed
     */
    "StateChanged": Anonymize<Ie8c7ctks8ur2p>;
    /**
     * A member has been removed from a pool.
     *
     * The removal can be voluntary (withdrawn all unbonded funds) or involuntary (kicked).
     * Any funds that are still delegated (i.e. dangling delegation) are released and are
     * represented by `released_balance`.
     */
    "MemberRemoved": Anonymize<I6c6fpqmnqijqd>;
    /**
     * The roles of a pool have been updated to the given new roles. Note that the depositor
     * can never change.
     */
    "RolesUpdated": Anonymize<I6mik29s5073td>;
    /**
     * The active balance of pool `pool_id` has been slashed to `balance`.
     */
    "PoolSlashed": Anonymize<I2m0sqmb75cnpb>;
    /**
     * The unbond pool at `era` of pool `pool_id` has been slashed to `balance`.
     */
    "UnbondingPoolSlashed": Anonymize<I49agc5b62mehu>;
    /**
     * A pool's commission setting has been changed.
     */
    "PoolCommissionUpdated": Anonymize<Iatq9jda4hq6pg>;
    /**
     * A pool's maximum commission setting has been changed.
     */
    "PoolMaxCommissionUpdated": Anonymize<I8cbluptqo8kbp>;
    /**
     * A pool's commission `change_rate` has been changed.
     */
    "PoolCommissionChangeRateUpdated": Anonymize<I81cc4plffa1dm>;
    /**
     * Pool commission claim permission has been updated.
     */
    "PoolCommissionClaimPermissionUpdated": Anonymize<I3ihan8icf0c5k>;
    /**
     * Pool commission has been claimed.
     */
    "PoolCommissionClaimed": Anonymize<I2g87evcjlgmqi>;
    /**
     * Topped up deficit in frozen ED of the reward pool.
     */
    "MinBalanceDeficitAdjusted": Anonymize<Ieg1oc56mamrl5>;
    /**
     * Claimed excess frozen ED of af the reward pool.
     */
    "MinBalanceExcessAdjusted": Anonymize<Ieg1oc56mamrl5>;
    /**
     * A pool member's claim permission has been updated.
     */
    "MemberClaimPermissionUpdated": Anonymize<I93ajn7brqs8df>;
    /**
     * A pool's metadata was updated.
     */
    "MetadataUpdated": Anonymize<Ib2q8vnsr19t9b>;
    /**
     * A pool's nominating account (or the pool's root account) has nominated a validator set
     * on behalf of the pool.
     */
    "PoolNominationMade": Anonymize<Ib2q8vnsr19t9b>;
    /**
     * The pool is chilled i.e. no longer nominating.
     */
    "PoolNominatorChilled": Anonymize<Ib2q8vnsr19t9b>;
    /**
     * Global parameters regulating nomination pools have been updated.
     */
    "GlobalParamsUpdated": Anonymize<If6q1q7op2gvqf>;
}>;
export type I1ti389kf8t6oi = {
    "depositor": SS58String;
    "pool_id": number;
};
export type If4nnre373amul = {
    "member": SS58String;
    "pool_id": number;
    "bonded": bigint;
    "joined": boolean;
};
export type I55kbor0ocqk6h = {
    "member": SS58String;
    "pool_id": number;
    "payout": bigint;
};
export type Idsj9cg7j96kpc = {
    "member": SS58String;
    "pool_id": number;
    "balance": bigint;
    "points": bigint;
    "era": number;
};
export type Ido4u9drncfaml = {
    "member": SS58String;
    "pool_id": number;
    "balance": bigint;
    "points": bigint;
};
export type I931cottvong90 = {
    "pool_id": number;
};
export type Ie8c7ctks8ur2p = {
    "pool_id": number;
    "new_state": NominationPoolsPoolState;
};
export type NominationPoolsPoolState = Enum<{
    "Open": undefined;
    "Blocked": undefined;
    "Destroying": undefined;
}>;
export declare const NominationPoolsPoolState: GetEnum<NominationPoolsPoolState>;
export type I6c6fpqmnqijqd = {
    "pool_id": number;
    "member": SS58String;
    "released_balance": bigint;
};
export type I6mik29s5073td = {
    "root"?: Anonymize<Ihfphjolmsqq1>;
    "bouncer"?: Anonymize<Ihfphjolmsqq1>;
    "nominator"?: Anonymize<Ihfphjolmsqq1>;
};
export type I2m0sqmb75cnpb = {
    "pool_id": number;
    "balance": bigint;
};
export type I49agc5b62mehu = {
    "pool_id": number;
    "era": number;
    "balance": bigint;
};
export type Iatq9jda4hq6pg = {
    "pool_id": number;
    "current"?: Anonymize<Ie8iutm7u02lmj>;
};
export type Ie8iutm7u02lmj = (Anonymize<I7svnfko10tq2e>) | undefined;
export type I7svnfko10tq2e = [number, SS58String];
export type I8cbluptqo8kbp = {
    "pool_id": number;
    "max_commission": number;
};
export type I81cc4plffa1dm = {
    "pool_id": number;
    "change_rate": Anonymize<Ibqul338t9c1ll>;
};
export type Ibqul338t9c1ll = {
    "max_increase": number;
    "min_delay": number;
};
export type I3ihan8icf0c5k = {
    "pool_id": number;
    "permission"?: Anonymize<I16m1kn78dee7v>;
};
export type I16m1kn78dee7v = (NominationPoolsCommissionClaimPermission) | undefined;
export type NominationPoolsCommissionClaimPermission = Enum<{
    "Permissionless": undefined;
    "Account": SS58String;
}>;
export declare const NominationPoolsCommissionClaimPermission: GetEnum<NominationPoolsCommissionClaimPermission>;
export type I2g87evcjlgmqi = {
    "pool_id": number;
    "commission": bigint;
};
export type Ieg1oc56mamrl5 = {
    "pool_id": number;
    "amount": bigint;
};
export type I93ajn7brqs8df = {
    "member": SS58String;
    "permission": NominationPoolsClaimPermission;
};
export type NominationPoolsClaimPermission = Enum<{
    "Permissioned": undefined;
    "PermissionlessCompound": undefined;
    "PermissionlessWithdraw": undefined;
    "PermissionlessAll": undefined;
}>;
export declare const NominationPoolsClaimPermission: GetEnum<NominationPoolsClaimPermission>;
export type Ib2q8vnsr19t9b = {
    "pool_id": number;
    "caller": SS58String;
};
export type If6q1q7op2gvqf = {
    "min_join_bond": bigint;
    "min_create_bond": bigint;
    "max_pools"?: Anonymize<I4arjljr6dpflb>;
    "max_members"?: Anonymize<I4arjljr6dpflb>;
    "max_members_per_pool"?: Anonymize<I4arjljr6dpflb>;
    "global_max_commission"?: Anonymize<I4arjljr6dpflb>;
};
export type BagsListEvent = Enum<{
    /**
     * Moved an account from one bag to another.
     */
    "Rebagged": Anonymize<I37454vatvmm1l>;
    /**
     * Updated the score of some account to the given amount.
     */
    "ScoreUpdated": Anonymize<Iblau1qa7u7fet>;
}>;
export declare const BagsListEvent: GetEnum<BagsListEvent>;
export type I37454vatvmm1l = {
    "who": SS58String;
    "from": bigint;
    "to": bigint;
};
export type Iblau1qa7u7fet = {
    "who": SS58String;
    "new_score": bigint;
};
export type I1nq1se98idofq = AnonymousEnum<{
    /**
     * Funds delegated by a delegator.
     */
    "Delegated": Anonymize<Id2aanom2jncf1>;
    /**
     * Funds released to a delegator.
     */
    "Released": Anonymize<Id2aanom2jncf1>;
    /**
     * Funds slashed from a delegator.
     */
    "Slashed": Anonymize<Id2aanom2jncf1>;
    /**
     * Unclaimed delegation funds migrated to delegator.
     */
    "MigratedDelegation": Anonymize<Id2aanom2jncf1>;
}>;
export type Id2aanom2jncf1 = {
    "agent": SS58String;
    "delegator": SS58String;
    "amount": bigint;
};
export type I7djm8pmbv58rp = AnonymousEnum<{
    /**
     * A said session report was received.
     */
    "SessionReportReceived": Anonymize<I1b9s29roqhg41>;
    /**
     * A new offence was reported.
     */
    "OffenceReceived": Anonymize<I9kd1anrch3gtm>;
    /**
     * Fees were charged for a user operation (set_keys or purge_keys).
     *
     * The fee includes both XCM delivery fee and relay chain execution cost.
     */
    "FeesPaid": Anonymize<I9i3iv964ch4c9>;
    /**
     * Something occurred that should never happen under normal operation.
     * Logged as an event for fail-safe observability.
     */
    "Unexpected": Anonymize<I87u3l28logste>;
}>;
export type I1b9s29roqhg41 = {
    "end_index": number;
    "activation_timestamp"?: Anonymize<I76de2jfh8ds4a>;
    "validator_points_counts": number;
    "leftover": boolean;
};
export type I76de2jfh8ds4a = (Anonymize<I6cs1itejju2vv>) | undefined;
export type I6cs1itejju2vv = [bigint, number];
export type I9kd1anrch3gtm = {
    "slash_session": number;
    "offences_count": number;
};
export type I9i3iv964ch4c9 = {
    "who": SS58String;
    "fees": bigint;
};
export type I87u3l28logste = AnonymousEnum<{
    "SessionReportIntegrityFailed": undefined;
    "ValidatorSetIntegrityFailed": undefined;
    "SessionSkipped": undefined;
    "SessionAlreadyProcessed": undefined;
    "ValidatorSetSendFailed": undefined;
    "ValidatorSetDropped": undefined;
}>;
export type Ic9l18clpms17b = AnonymousEnum<{
    /**
     * A phase transition happened. Only checks major changes in the variants, not minor inner
     * values.
     */
    "PhaseTransitioned": Anonymize<I44bc4bblti9at>;
    /**
     * Target snapshot creation failed
     */
    "UnexpectedTargetSnapshotFailed": undefined;
    /**
     * Voter snapshot creation failed
     */
    "UnexpectedVoterSnapshotFailed": undefined;
}>;
export type I44bc4bblti9at = {
    /**
     * the source phase
     */
    "from": Anonymize<I7d4qtdlascfk8>;
    /**
     * The target phase
     */
    "to": Anonymize<I7d4qtdlascfk8>;
};
export type I7d4qtdlascfk8 = AnonymousEnum<{
    "Off": undefined;
    "Signed": number;
    "SignedValidation": number;
    "Unsigned": number;
    "Snapshot": number;
    "Done": undefined;
    "Export": number;
    "Emergency": undefined;
}>;
export type Ia3me59518l5g2 = AnonymousEnum<{
    /**
     * A verification failed at the given page.
     *
     * NOTE: if the index is 0, then this could mean either the feasibility of the last page
     * was wrong, or the final checks of `finalize_verification` failed.
     */
    "VerificationFailed": Anonymize<Icr28nsmo3thmu>;
    /**
     * The given page of a solution has been verified, with the given number of winners being
     * found in it.
     */
    "Verified": Anonymize<I9jd27rnpm8ttv>;
    /**
     * A solution with the given score has replaced our current best solution.
     */
    "Queued": Anonymize<I1csu4ejte2mno>;
}>;
export type Icr28nsmo3thmu = [number, Enum<{
    "WrongWinnerCount": undefined;
    "SnapshotUnavailable": undefined;
    "InvalidVote": undefined;
    "InvalidVoter": undefined;
    "InvalidWinner": undefined;
    "InvalidScore": undefined;
    "InvalidRound": undefined;
    "ScoreTooLow": undefined;
    "FailedToBoundSupport": undefined;
    "NposElection": Enum<{
        "SolutionWeightOverflow": undefined;
        "SolutionTargetOverflow": undefined;
        "SolutionInvalidIndex": undefined;
        "SolutionInvalidPageIndex": undefined;
        "ArithmeticError": undefined;
        "InvalidSupportEdge": undefined;
        "TooManyVoters": undefined;
        "BoundsExceeded": undefined;
        "DuplicateVoter": undefined;
        "DuplicateTarget": undefined;
    }>;
    "Incomplete": undefined;
}>];
export type I1csu4ejte2mno = [Anonymize<I8s6n43okuj2b1>, (Anonymize<I8s6n43okuj2b1>) | undefined];
export type I8s6n43okuj2b1 = {
    "minimal_stake": bigint;
    "sum_stake": bigint;
    "sum_stake_squared": bigint;
};
export type I5ljekabnc2mck = AnonymousEnum<{
    /**
     * Upcoming submission has been registered for the given account, with the given score.
     */
    "Registered": Anonymize<I9lrippm0l6t0c>;
    /**
     * A page of solution solution with the given index has been stored for the given account.
     */
    "Stored": Anonymize<Ia8896dq44k9m4>;
    /**
     * The given account has been rewarded with the given amount.
     */
    "Rewarded": Anonymize<Icsknfl0f6r973>;
    /**
     * The given account has been slashed with the given amount.
     */
    "Slashed": Anonymize<Icsknfl0f6r973>;
    /**
     * The given solution, for the given round, was ejected.
     */
    "Ejected": Anonymize<I7svnfko10tq2e>;
    /**
     * The given account has been discarded.
     */
    "Discarded": Anonymize<I7svnfko10tq2e>;
    /**
     * The given account has bailed.
     */
    "Bailed": Anonymize<I7svnfko10tq2e>;
}>;
export type I9lrippm0l6t0c = [number, SS58String, Anonymize<I8s6n43okuj2b1>];
export type Ia8896dq44k9m4 = [number, SS58String, number];
export type Icsknfl0f6r973 = [number, SS58String, bigint];
export type Ieh305lanrumoh = AnonymousEnum<{
    /**
     * The era payout has been set; the first balance is the validator-payout; the second is
     * the remainder from the maximum amount of reward.
     */
    "EraPaid": Anonymize<I1au3fq4n84nv3>;
    /**
     * The nominator has been rewarded by this amount to this destination.
     */
    "Rewarded": Anonymize<Iejaj7m7qka9tr>;
    /**
     * A staker (validator or nominator) has been slashed by the given amount.
     */
    "Slashed": Anonymize<Idnak900lt5lm8>;
    /**
     * An old slashing report from a prior era was discarded because it could
     * not be processed.
     */
    "OldSlashingReportDiscarded": Anonymize<I2hq50pu2kdjpo>;
    /**
     * An account has bonded this amount. \[stash, amount\]
     *
     * NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
     * it will not be emitted for staking rewards when they are added to stake.
     */
    "Bonded": Anonymize<Ifk8eme5o7mukf>;
    /**
     * An account has unbonded this amount.
     */
    "Unbonded": Anonymize<Ifk8eme5o7mukf>;
    /**
     * An account has called `withdraw_unbonded` and removed unbonding chunks worth `Balance`
     * from the unlocking queue.
     */
    "Withdrawn": Anonymize<Ifk8eme5o7mukf>;
    /**
     * A subsequent event of `Withdrawn`, indicating that `stash` was fully removed from the
     * system.
     */
    "StakerRemoved": Anonymize<Idl3umm12u5pa>;
    /**
     * A nominator has been kicked from a validator.
     */
    "Kicked": Anonymize<Iau4cgm6ih61cf>;
    /**
     * An account has stopped participating as either a validator or nominator.
     */
    "Chilled": Anonymize<Idl3umm12u5pa>;
    /**
     * A Page of stakers rewards are getting paid. `next` is `None` if all pages are claimed.
     */
    "PayoutStarted": Anonymize<Ith132hqfb27q>;
    /**
     * A validator has set their preferences.
     */
    "ValidatorPrefsSet": Anonymize<Ic19as7nbst738>;
    /**
     * Voters size limit reached.
     */
    "SnapshotVotersSizeExceeded": Anonymize<I54umskavgc9du>;
    /**
     * Targets size limit reached.
     */
    "SnapshotTargetsSizeExceeded": Anonymize<I54umskavgc9du>;
    "ForceEra": Anonymize<I2ip7o9e2tc5sf>;
    /**
     * Report of a controller batch deprecation.
     */
    "ControllerBatchDeprecated": Anonymize<I5egvk6hadac5h>;
    /**
     * Staking balance migrated from locks to holds, with any balance that could not be held
     * is force withdrawn.
     */
    "CurrencyMigrated": Anonymize<I1td4upnup9gqv>;
    /**
     * A page from a multi-page election was fetched. A number of these are followed by
     * `StakersElected`.
     *
     * `Ok(count)` indicates the give number of stashes were added.
     * `Err(index)` indicates that the stashes after index were dropped.
     * `Err(0)` indicates that an error happened but no stashes were dropped nor added.
     *
     * The error indicates that a number of validators were dropped due to excess size, but
     * the overall election will continue.
     */
    "PagedElectionProceeded": Anonymize<I3m3s3nqk2k59p>;
    /**
     * An offence for the given validator, for the given percentage of their stake, at the
     * given era as been reported.
     */
    "OffenceReported": Anonymize<I4rl33s8t7uju2>;
    /**
     * An offence has been processed and the corresponding slash has been computed.
     */
    "SlashComputed": Anonymize<Icgsl781ka0jnq>;
    /**
     * An unapplied slash has been cancelled.
     */
    "SlashCancelled": Anonymize<I9s54l74mrft0k>;
    /**
     * Session change has been triggered.
     *
     * If planned_era is one era ahead of active_era, it implies new era is being planned and
     * election is ongoing.
     */
    "SessionRotated": Anonymize<Ia5ob51vsq2d0j>;
    /**
     * Something occurred that should never happen under normal operation.
     * Logged as an event for fail-safe observability.
     */
    "Unexpected": Anonymize<Ia082gmtdk04o2>;
    /**
     * An offence was reported that was too old to be processed, and thus was dropped.
     */
    "OffenceTooOld": Anonymize<I4rl33s8t7uju2>;
    /**
     * An old era with the given index was pruned.
     */
    "EraPruned": Anonymize<I666bl2fqjkejo>;
}>;
export type I1au3fq4n84nv3 = {
    "era_index": number;
    "validator_payout": bigint;
    "remainder": bigint;
};
export type Iejaj7m7qka9tr = {
    "stash": SS58String;
    "dest": StakingRewardDestination;
    "amount": bigint;
};
export type StakingRewardDestination = Enum<{
    "Staked": undefined;
    "Stash": undefined;
    "Controller": undefined;
    "Account": SS58String;
    "None": undefined;
}>;
export declare const StakingRewardDestination: GetEnum<StakingRewardDestination>;
export type Idnak900lt5lm8 = {
    "staker": SS58String;
    "amount": bigint;
};
export type Ifk8eme5o7mukf = {
    "stash": SS58String;
    "amount": bigint;
};
export type Idl3umm12u5pa = {
    "stash": SS58String;
};
export type Iau4cgm6ih61cf = {
    "nominator": SS58String;
    "stash": SS58String;
};
export type Ith132hqfb27q = {
    "era_index": number;
    "validator_stash": SS58String;
    "page": number;
    "next"?: Anonymize<I4arjljr6dpflb>;
};
export type Ic19as7nbst738 = {
    "stash": SS58String;
    "prefs": Anonymize<I9o7ssi9vmhmgr>;
};
export type I9o7ssi9vmhmgr = {
    "commission": number;
    "blocked": boolean;
};
export type I54umskavgc9du = {
    "size": number;
};
export type I2ip7o9e2tc5sf = {
    "mode": StakingForcing;
};
export type StakingForcing = Enum<{
    "NotForcing": undefined;
    "ForceNew": undefined;
    "ForceNone": undefined;
    "ForceAlways": undefined;
}>;
export declare const StakingForcing: GetEnum<StakingForcing>;
export type I5egvk6hadac5h = {
    "failures": number;
};
export type I1td4upnup9gqv = {
    "stash": SS58String;
    "force_withdraw": bigint;
};
export type I3m3s3nqk2k59p = {
    "page": number;
    "result": ResultPayload<number, number>;
};
export type I4rl33s8t7uju2 = {
    "offence_era": number;
    "validator": SS58String;
    "fraction": number;
};
export type Icgsl781ka0jnq = {
    "offence_era": number;
    "slash_era": number;
    "offender": SS58String;
    "page": number;
};
export type I9s54l74mrft0k = {
    "slash_era": number;
    "validator": SS58String;
};
export type Ia5ob51vsq2d0j = {
    "starting_session": number;
    "active_era": number;
    "planned_era": number;
};
export type Ia082gmtdk04o2 = AnonymousEnum<{
    "EraDurationBoundExceeded": undefined;
    "UnknownValidatorActivation": undefined;
}>;
export type I35og6m8n4kpu0 = AnonymousEnum<{
    /**
     * A custom event emitted by the contract.
     */
    "ContractEmitted": Anonymize<I7svbvm6hg57aj>;
    /**
     * Contract deployed by deployer at the specified address.
     */
    "Instantiated": Anonymize<I8jhsbaiultviu>;
    /**
     * Emitted when an Ethereum transaction reverts.
     *
     * Ethereum transactions always complete successfully at the extrinsic level,
     * as even reverted calls must store their `ReceiptInfo`.
     * To distinguish reverted calls from successful ones, this event is emitted
     * for failed Ethereum transactions.
     */
    "EthExtrinsicRevert": Anonymize<I6r8cv4qc2gp0i>;
}>;
export type I7svbvm6hg57aj = {
    /**
     * The contract that emitted the event.
     */
    "contract": SizedHex<20>;
    /**
     * Data supplied by the contract. Metadata generated during contract compilation
     * is needed to decode it.
     */
    "data": Uint8Array;
    /**
     * A list of topics used to index the event.
     * Number of topics is capped by [`limits::NUM_EVENT_TOPICS`].
     */
    "topics": Anonymize<Ic5m5lp1oioo8r>;
};
export type Ic5m5lp1oioo8r = Array<SizedHex<32>>;
export type I8jhsbaiultviu = {
    "deployer": SizedHex<20>;
    "contract": SizedHex<20>;
};
export type I6r8cv4qc2gp0i = {
    "dispatch_error": Anonymize<I72ju98lulovhp>;
};
export type Idg7fvch4qlaqj = AnonymousEnum<{
    /**
     * A sudo call just took place.
     */
    "Sudid": Anonymize<Idv2jr6mgamhml>;
    /**
     * The sudo key has been updated.
     */
    "KeyChanged": Anonymize<I5rtkmhm2dng4u>;
    /**
     * The key was permanently removed.
     */
    "KeyRemoved": undefined;
    /**
     * A [sudo_as](Pallet::sudo_as) call just took place.
     */
    "SudoAsDone": Anonymize<Idv2jr6mgamhml>;
}>;
export type Idv2jr6mgamhml = {
    /**
     * The result of the call made by the sudo user.
     */
    "sudo_result": Anonymize<Idqcgnrsbirg5n>;
};
export type I5rtkmhm2dng4u = {
    /**
     * The old sudo key (if one was previously set).
     */
    "old"?: Anonymize<Ihfphjolmsqq1>;
    /**
     * The new sudo key (if one was set).
     */
    "new": SS58String;
};
export type I4f830gria90rg = AnonymousEnum<{
    /**
     * Some lease reserve could not be unreserved and needs manual cleanup.
     */
    "LeaseUnreserveRemaining": Anonymize<I4g1444e4lrvko>;
    /**
     * Some amount for a crowdloan reserve could not be unreserved and needs manual cleanup.
     */
    "CrowdloanUnreserveRemaining": Anonymize<I4g1444e4lrvko>;
    /**
     * A sovereign parachain account has been migrated from its child to sibling
     * representation.
     */
    "SovereignMigrated": Anonymize<I605froskfgu31>;
    /**
     * Failed to re-bond some migrated funds.
     */
    "FailedToBond": Anonymize<Ic262ibdoec56a>;
}>;
export type I4g1444e4lrvko = {
    "depositor": SS58String;
    "para_id": number;
    "remaining": bigint;
};
export type I605froskfgu31 = {
    /**
     * The parachain ID that had its account migrated.
     */
    "para_id": number;
    /**
     * The old account that was migrated out of.
     */
    "from": SS58String;
    /**
     * The new account that was migrated into.
     */
    "to": SS58String;
    /**
     * The derivation path that was used to translate the account.
     */
    "derivation_path": Anonymize<Icgljjb6j82uhn>;
};
export type I8rrti4a7t38fc = AnonymousEnum<{
    /**
     * A stage transition has occurred.
     */
    "StageTransition": Anonymize<I7tgp4mjg0vh3g>;
    /**
     * We received a batch of messages that will be integrated into a pallet.
     */
    "BatchReceived": Anonymize<I6qgvbdj59q82d>;
    /**
     * We processed a batch of messages for this pallet.
     */
    "BatchProcessed": Anonymize<I8a7s0gpbv2c0i>;
    /**
     * The Asset Hub Migration started and is active until `AssetHubMigrationFinished` is
     * emitted.
     *
     * This event is equivalent to `StageTransition { new: DataMigrationOngoing, .. }` but is
     * easier to understand. The activation is immediate and affects all events happening
     * afterwards.
     */
    "AssetHubMigrationStarted": undefined;
    /**
     * The Asset Hub Migration finished.
     *
     * This event is equivalent to `StageTransition { new: MigrationDone, .. }` but is easier
     * to understand. The finishing is immediate and affects all events happening
     * afterwards.
     */
    "AssetHubMigrationFinished": undefined;
    /**
     * Whether the DMP queue was prioritized for the next block.
     */
    "DmpQueuePrioritySet": Anonymize<I4udn5ndu0dko2>;
    /**
     * The DMP queue priority config was set.
     */
    "DmpQueuePriorityConfigSet": Anonymize<Ifpff50mo8ndh6>;
    /**
     * The balances before the migration were recorded.
     */
    "BalancesBeforeRecordSet": Anonymize<I1d6j3815ii0ua>;
    /**
     * The balances before the migration were consumed.
     */
    "BalancesBeforeRecordConsumed": Anonymize<I1d6j3815ii0ua>;
    /**
     * A referendum was cancelled because it could not be mapped.
     */
    "ReferendumCanceled": Anonymize<Ic5b47dj4coa3r>;
    /**
     * The manager account id was set.
     */
    "ManagerSet": Anonymize<I3f9qerj1fhlkp>;
    "AccountTranslatedParachainSovereign": Anonymize<I7j6vt4ra6khhv>;
    "AccountTranslatedParachainSovereignDerived": Anonymize<Iaddpgr0qkt1u0>;
    /**
     * An XCM message was sent.
     */
    "XcmSent": Anonymize<If8u5kl4h8070m>;
    /**
     * Failed to unreserve a multisig deposit.
     */
    "FailedToUnreserveMultisigDeposit": Anonymize<I9mu321muoighj>;
    /**
     * Failed to unreserve a legacy status preimage deposit.
     */
    "FailedToUnreservePreimageDeposit": Anonymize<I9mu321muoighj>;
}>;
export type I7tgp4mjg0vh3g = {
    /**
     * The old stage before the transition.
     */
    "old": Anonymize<I9134mhoe91oet>;
    /**
     * The new stage after the transition.
     */
    "new": Anonymize<I9134mhoe91oet>;
};
export type I9134mhoe91oet = AnonymousEnum<{
    "Pending": undefined;
    "DataMigrationOngoing": undefined;
    "MigrationDone": undefined;
    "CoolOff": {
        "end_at": number;
    };
}>;
export type I6qgvbdj59q82d = {
    "pallet": Anonymize<Ia3mrvoqdlvsog>;
    "count": number;
};
export type Ia3mrvoqdlvsog = AnonymousEnum<{
    "AssetRates": undefined;
    "BagsList": undefined;
    "Balances": undefined;
    "Bounties": undefined;
    "ChildBounties": undefined;
    "Claims": undefined;
    "ConvictionVoting": undefined;
    "Crowdloan": undefined;
    "DelegatedStaking": undefined;
    "Indices": undefined;
    "Multisig": undefined;
    "NomPools": undefined;
    "PreimageChunk": undefined;
    "PreimageLegacyStatus": undefined;
    "PreimageRequestStatus": undefined;
    "ProxyAnnouncements": undefined;
    "ProxyProxies": undefined;
    "Recovery": undefined;
    "ReferendaMetadata": undefined;
    "ReferendaReferendums": undefined;
    "ReferendaValues": undefined;
    "Scheduler": undefined;
    "SchedulerAgenda": undefined;
    "Staking": undefined;
    "Treasury": undefined;
    "Vesting": undefined;
    "Society": undefined;
}>;
export type I8a7s0gpbv2c0i = {
    "pallet": Anonymize<Ia3mrvoqdlvsog>;
    "count_good": number;
    "count_bad": number;
};
export type I4udn5ndu0dko2 = {
    /**
     * Indicates if DMP queue was successfully set as priority.
     * If `false`, it means we're in the round-robin phase of our priority pattern
     * (see [`Config::DmpQueuePriorityPattern`]), where no queue gets priority.
     */
    "prioritized": boolean;
    /**
     * Current block number within the pattern cycle (1 to period).
     */
    "cycle_block": number;
    /**
     * Total number of blocks in the pattern cycle
     */
    "cycle_period": number;
};
export type Ifpff50mo8ndh6 = {
    /**
     * The old priority pattern.
     */
    "old": Anonymize<I2fbmombro6ugg>;
    /**
     * The new priority pattern.
     */
    "new": Anonymize<I2fbmombro6ugg>;
};
export type I2fbmombro6ugg = AnonymousEnum<{
    "Config": undefined;
    "OverrideConfig": Anonymize<I9jd27rnpm8ttv>;
    "Disabled": undefined;
}>;
export type I1d6j3815ii0ua = {
    "checking_account": bigint;
    "total_issuance": bigint;
};
export type Ic5b47dj4coa3r = {
    "id": number;
};
export type I3f9qerj1fhlkp = {
    /**
     * The old manager account id.
     */
    "old"?: Anonymize<Ihfphjolmsqq1>;
    /**
     * The new manager account id.
     */
    "new"?: Anonymize<Ihfphjolmsqq1>;
};
export type I7j6vt4ra6khhv = {
    "from": SS58String;
    "to": SS58String;
};
export type Iaddpgr0qkt1u0 = {
    "from": SS58String;
    "to": SS58String;
    "derivation_index": number;
};
export type I9mu321muoighj = {
    /**
     * The expected amount of the deposit that was expected to be unreserved.
     */
    "expected_amount": bigint;
    /**
     * The missing amount of the deposit.
     */
    "missing_amount": bigint;
    /**
     * The account that the deposit was unreserved from.
     */
    "account": SS58String;
};
export type I95g6i7ilua7lq = Array<Anonymize<I9jd27rnpm8ttv>>;
export type Ieniouoqkq4icf = {
    "spec_version": number;
    "spec_name": string;
};
export type I1v7jbnil3tjns = Array<{
    "used_bandwidth": Anonymize<Ieafp1gui1o4cl>;
    "para_head_hash"?: Anonymize<I4s6vifaf8k998>;
    "consumed_go_ahead_signal"?: Anonymize<Iav8k1edbj86k7>;
}>;
export type Ieafp1gui1o4cl = {
    "ump_msg_count": number;
    "ump_total_bytes": number;
    "hrmp_outgoing": Array<[number, {
        "msg_count": number;
        "total_bytes": number;
    }]>;
};
export type Iav8k1edbj86k7 = (UpgradeGoAhead) | undefined;
export type UpgradeGoAhead = Enum<{
    "Abort": undefined;
    "GoAhead": undefined;
}>;
export declare const UpgradeGoAhead: GetEnum<UpgradeGoAhead>;
export type I8jgj1nhcr2dg8 = {
    "used_bandwidth": Anonymize<Ieafp1gui1o4cl>;
    "hrmp_watermark"?: Anonymize<I4arjljr6dpflb>;
    "consumed_go_ahead_signal"?: Anonymize<Iav8k1edbj86k7>;
};
export type Ifn6q3equiq9qi = {
    "parent_head": Uint8Array;
    "relay_parent_number": number;
    "relay_parent_storage_root": SizedHex<32>;
    "max_pov_size": number;
};
export type Ia3sb0vgvovhtg = (UpgradeRestriction) | undefined;
export type UpgradeRestriction = Enum<{
    "Present": undefined;
}>;
export declare const UpgradeRestriction: GetEnum<UpgradeRestriction>;
export type Itom7fk49o0c9 = Array<Uint8Array>;
export type I4i91h98n3cv1b = {
    "dmq_mqc_head": SizedHex<32>;
    "relay_dispatch_queue_remaining_capacity": {
        "remaining_count": number;
        "remaining_size": number;
    };
    "ingress_channels": Array<[number, {
        "max_capacity": number;
        "max_total_size": number;
        "max_message_size": number;
        "msg_count": number;
        "total_size": number;
        "mqc_head"?: Anonymize<I4s6vifaf8k998>;
    }]>;
    "egress_channels": Array<[number, {
        "max_capacity": number;
        "max_total_size": number;
        "max_message_size": number;
        "msg_count": number;
        "total_size": number;
        "mqc_head"?: Anonymize<I4s6vifaf8k998>;
    }]>;
};
export type I4iumukclgj8ej = {
    "max_code_size": number;
    "max_head_data_size": number;
    "max_upward_queue_count": number;
    "max_upward_queue_size": number;
    "max_upward_message_size": number;
    "max_upward_message_num_per_candidate": number;
    "hrmp_max_message_num_per_candidate": number;
    "validation_upgrade_cooldown": number;
    "validation_upgrade_delay": number;
    "async_backing_params": {
        "max_candidate_depth": number;
        "allowed_ancestry_len": number;
    };
};
export type Iqnbvitf7a7l3 = Array<[number, SizedHex<32>]>;
export type I48i407regf59r = {
    "sent_at": number;
    "reverse_idx": number;
};
export type I6r5cbv8ttrb09 = Array<{
    "recipient": number;
    "data": Uint8Array;
}>;
export type PreimageOldRequestStatus = Enum<{
    "Unrequested": {
        "deposit": Anonymize<I95l2k9b1re95f>;
        "len": number;
    };
    "Requested": {
        "deposit"?: Anonymize<I92hdo1clkbp4g>;
        "count": number;
        "len"?: Anonymize<I4arjljr6dpflb>;
    };
}>;
export declare const PreimageOldRequestStatus: GetEnum<PreimageOldRequestStatus>;
export type I95l2k9b1re95f = [SS58String, bigint];
export type I92hdo1clkbp4g = (Anonymize<I95l2k9b1re95f>) | undefined;
export type PreimageRequestStatus = Enum<{
    "Unrequested": {
        "ticket": Anonymize<I95l2k9b1re95f>;
        "len": number;
    };
    "Requested": {
        "maybe_ticket"?: Anonymize<I92hdo1clkbp4g>;
        "count": number;
        "maybe_len"?: Anonymize<I4arjljr6dpflb>;
    };
}>;
export declare const PreimageRequestStatus: GetEnum<PreimageRequestStatus>;
export type I4pact7n2e9a0i = [SizedHex<32>, number];
export type Idqn63pep0hpog = Array<({
    "maybe_id"?: Anonymize<I4s6vifaf8k998>;
    "priority": number;
    "call": PreimagesBounded;
    "maybe_periodic"?: Anonymize<Iep7au1720bm0e>;
    "origin": Anonymize<I7qpv90droestd>;
}) | undefined>;
export type Iep7au1720bm0e = (Anonymize<I9jd27rnpm8ttv>) | undefined;
export type I7qpv90droestd = AnonymousEnum<{
    "system": Anonymize<I9gqitj4t615g3>;
    "PolkadotXcm": Enum<{
        "Xcm": Anonymize<If9iqq7i64mur8>;
        "Response": Anonymize<If9iqq7i64mur8>;
    }>;
    "CumulusXcm": Enum<{
        "Relay": undefined;
        "SiblingParachain": number;
    }>;
    "Origins": GovernanceOrigin;
    "Revive": Enum<{
        "EthTransaction": SS58String;
    }>;
}>;
export type I9gqitj4t615g3 = AnonymousEnum<{
    "Root": undefined;
    "Signed": SS58String;
    "None": undefined;
    "Authorized": undefined;
}>;
export type GovernanceOrigin = Enum<{
    "StakingAdmin": undefined;
    "Treasurer": undefined;
    "FellowshipAdmin": undefined;
    "GeneralAdmin": undefined;
    "AuctionAdmin": undefined;
    "LeaseAdmin": undefined;
    "ReferendumCanceller": undefined;
    "ReferendumKiller": undefined;
    "SmallTipper": undefined;
    "BigTipper": undefined;
    "SmallSpender": undefined;
    "MediumSpender": undefined;
    "BigSpender": undefined;
    "WhitelistedCaller": undefined;
    "WishForChange": undefined;
}>;
export declare const GovernanceOrigin: GetEnum<GovernanceOrigin>;
export type I56u24ncejr5kt = {
    "total_retries": number;
    "remaining": number;
    "period": number;
};
export type Iepbsvlk3qceij = AnonymousEnum<{
    "Active": {
        "index": number;
        "inner_cursor"?: Anonymize<Iabpgqcjikia83>;
        "started_at": number;
    };
    "Stuck": undefined;
}>;
export type I8ds64oj6581v0 = Array<{
    "id": SizedHex<8>;
    "amount": bigint;
    "reasons": BalancesTypesReasons;
}>;
export type BalancesTypesReasons = Enum<{
    "Fee": undefined;
    "Misc": undefined;
    "All": undefined;
}>;
export declare const BalancesTypesReasons: GetEnum<BalancesTypesReasons>;
export type Ia7pdug7cdsg8g = Array<{
    "id": SizedHex<8>;
    "amount": bigint;
}>;
export type I3a3gt3bf28qh7 = Array<{
    "id": Anonymize<Ickdiocl9u813v>;
    "amount": bigint;
}>;
export type I2l1ctuihi2mfd = Array<{
    "id": WestendRuntimeRuntimeFreezeReason;
    "amount": bigint;
}>;
export type WestendRuntimeRuntimeFreezeReason = Enum<{
    "NominationPools": NominationPoolsPalletFreezeReason;
}>;
export declare const WestendRuntimeRuntimeFreezeReason: GetEnum<WestendRuntimeRuntimeFreezeReason>;
export type NominationPoolsPalletFreezeReason = Enum<{
    "PoolMinBalance": undefined;
}>;
export declare const NominationPoolsPalletFreezeReason: GetEnum<NominationPoolsPalletFreezeReason>;
export type TransactionPaymentReleases = Enum<{
    "V1Ancient": undefined;
    "V2": undefined;
}>;
export declare const TransactionPaymentReleases: GetEnum<TransactionPaymentReleases>;
export type Ifble4juuml5ig = Array<Anonymize<I4aro1m78pdrtt>>;
export type I4aro1m78pdrtt = {
    "locked": bigint;
    "per_block": bigint;
    "starting_block": number;
};
export type Version = Enum<{
    "V0": undefined;
    "V1": undefined;
}>;
export declare const Version: GetEnum<Version>;
export type I2phecamkn3pej = [bigint, bigint, number];
export type ClaimsStatementKind = Enum<{
    "Regular": undefined;
    "Saft": undefined;
}>;
export declare const ClaimsStatementKind: GetEnum<ClaimsStatementKind>;
export type Ifi4da1gej1fri = Array<{
    "who": SS58String;
    "deposit": bigint;
}>;
export type Ifvgo9568rpmqc = Array<Anonymize<I8uo3fpd3bcc6f>>;
export type I8uo3fpd3bcc6f = [SS58String, SizedHex<32>];
export type Ib77b0fp1a6mjr = Array<{
    "recipient": number;
    "state": Enum<{
        "Ok": undefined;
        "Suspended": undefined;
    }>;
    "signals_exist": boolean;
    "first_index": number;
    "last_index": number;
}>;
export type I5g2vv0ckl2m8b = [number, number];
export type Ifup3lg9ro8a0f = {
    "suspend_threshold": number;
    "drop_threshold": number;
    "resume_threshold": number;
};
export type I5qfubnuvrnqn6 = AnonymousEnum<{
    "Pending": {
        "responder": XcmVersionedLocation;
        "maybe_match_querier"?: (XcmVersionedLocation) | undefined;
        "maybe_notify"?: (SizedHex<2>) | undefined;
        "timeout": number;
    };
    "VersionNotifier": {
        "origin": XcmVersionedLocation;
        "is_active": boolean;
    };
    "Ready": {
        "response": Enum<{
            "V3": XcmV3Response;
            "V4": XcmV4Response;
            "V5": Anonymize<I7vucpgm2c6959>;
        }>;
        "at": number;
    };
}>;
export type XcmV3Response = Enum<{
    "Null": undefined;
    "Assets": Anonymize<Iai6dhqiq3bach>;
    "ExecutionResult"?: Anonymize<I7sltvf8v2nure>;
    "Version": number;
    "PalletsInfo": Anonymize<I599u7h20b52at>;
    "DispatchResult": XcmV3MaybeErrorCode;
}>;
export declare const XcmV3Response: GetEnum<XcmV3Response>;
export type I7sltvf8v2nure = ([number, XcmV3TraitsError]) | undefined;
export type XcmV3TraitsError = Enum<{
    "Overflow": undefined;
    "Unimplemented": undefined;
    "UntrustedReserveLocation": undefined;
    "UntrustedTeleportLocation": undefined;
    "LocationFull": undefined;
    "LocationNotInvertible": undefined;
    "BadOrigin": undefined;
    "InvalidLocation": undefined;
    "AssetNotFound": undefined;
    "FailedToTransactAsset": undefined;
    "NotWithdrawable": undefined;
    "LocationCannotHold": undefined;
    "ExceedsMaxMessageSize": undefined;
    "DestinationUnsupported": undefined;
    "Transport": undefined;
    "Unroutable": undefined;
    "UnknownClaim": undefined;
    "FailedToDecode": undefined;
    "MaxWeightInvalid": undefined;
    "NotHoldingFees": undefined;
    "TooExpensive": undefined;
    "Trap": bigint;
    "ExpectationFalse": undefined;
    "PalletNotFound": undefined;
    "NameMismatch": undefined;
    "VersionIncompatible": undefined;
    "HoldingWouldOverflow": undefined;
    "ExportError": undefined;
    "ReanchorFailed": undefined;
    "NoDeal": undefined;
    "FeesNotMet": undefined;
    "LockError": undefined;
    "NoPermission": undefined;
    "Unanchored": undefined;
    "NotDepositable": undefined;
    "UnhandledXcmVersion": undefined;
    "WeightLimitReached": Anonymize<I4q39t5hn830vp>;
    "Barrier": undefined;
    "WeightNotComputable": undefined;
    "ExceedsStackLimit": undefined;
}>;
export declare const XcmV3TraitsError: GetEnum<XcmV3TraitsError>;
export type XcmV4Response = Enum<{
    "Null": undefined;
    "Assets": Anonymize<I50mli3hb64f9b>;
    "ExecutionResult"?: Anonymize<I7sltvf8v2nure>;
    "Version": number;
    "PalletsInfo": Anonymize<I599u7h20b52at>;
    "DispatchResult": XcmV3MaybeErrorCode;
}>;
export declare const XcmV4Response: GetEnum<XcmV4Response>;
export type I8t3u2dv73ahbd = [number, XcmVersionedLocation];
export type I7vlvrrl2pnbgk = [bigint, Anonymize<I4q39t5hn830vp>, number];
export type Ie0rpl5bahldfk = Array<[XcmVersionedLocation, number]>;
export type XcmPalletVersionMigrationStage = Enum<{
    "MigrateSupportedVersion": undefined;
    "MigrateVersionNotifiers": undefined;
    "NotifyCurrentTargets"?: Anonymize<Iabpgqcjikia83>;
    "MigrateAndNotifyOldTargets": undefined;
}>;
export declare const XcmPalletVersionMigrationStage: GetEnum<XcmPalletVersionMigrationStage>;
export type I7e5oaj2qi4kl1 = {
    "amount": bigint;
    "owner": XcmVersionedLocation;
    "locker": XcmVersionedLocation;
    "consumers": Array<[undefined, bigint]>;
};
export type Ie849h3gncgvok = [number, SS58String, XcmVersionedAssetId];
export type XcmVersionedAssetId = Enum<{
    "V3": XcmV3MultiassetAssetId;
    "V4": Anonymize<I4c0s5cioidn76>;
    "V5": Anonymize<If9iqq7i64mur8>;
}>;
export declare const XcmVersionedAssetId: GetEnum<XcmVersionedAssetId>;
export type Iat62vud7hlod2 = Array<[bigint, XcmVersionedLocation]>;
export type Ibkm2gcn4pji30 = {
    "aliasers": Anonymize<I41j3fc5ema929>;
    "ticket": bigint;
};
export type I41j3fc5ema929 = Array<{
    "location": XcmVersionedLocation;
    "expiry"?: Anonymize<I35p85j063s0il>;
}>;
export type I7f4alf2hnuu8s = {
    "delivery_fee_factor": bigint;
    "is_congested": boolean;
};
export type Idh2ug6ou4a8og = {
    "begin": number;
    "end": number;
    "count": number;
    "ready_neighbours"?: ({
        "prev": Anonymize<Iejeo53sea6n4q>;
        "next": Anonymize<Iejeo53sea6n4q>;
    }) | undefined;
    "message_count": bigint;
    "size": bigint;
};
export type I53esa2ms463bk = {
    "remaining": number;
    "remaining_size": number;
    "first_index": number;
    "first": number;
    "last": number;
    "heap": Uint8Array;
};
export type Ib4jhb8tt3uung = [Anonymize<Iejeo53sea6n4q>, number];
export type Iag146hmjgqfgj = {
    "when": Anonymize<Itvprrpb0nm3o>;
    "deposit": bigint;
    "depositor": SS58String;
    "approvals": Anonymize<Ia2lhg7l2hilo3>;
};
export type I1808sk45co89c = [Array<{
    "delegate": SS58String;
    "proxy_type": Anonymize<Idugco9k7jdh0f>;
    "delay": number;
}>, bigint];
export type I9p9lq3rej5bhc = [Array<{
    "real": SS58String;
    "call_hash": SizedHex<32>;
    "height": number;
}>, bigint];
export type Iff9heri56m1mb = [SS58String, bigint, boolean];
export type I3qklfjubrljqh = {
    "owner": SS58String;
    "issuer": SS58String;
    "admin": SS58String;
    "freezer": SS58String;
    "supply": bigint;
    "deposit": bigint;
    "min_balance": bigint;
    "is_sufficient": boolean;
    "accounts": number;
    "sufficients": number;
    "approvals": number;
    "status": Enum<{
        "Live": undefined;
        "Frozen": undefined;
        "Destroying": undefined;
    }>;
};
export type Iag3f1hum3p4c8 = {
    "balance": bigint;
    "status": Enum<{
        "Liquid": undefined;
        "Frozen": undefined;
        "Blocked": undefined;
    }>;
    "reason": Enum<{
        "Consumer": undefined;
        "Sufficient": undefined;
        "DepositHeld": bigint;
        "DepositRefunded": undefined;
        "DepositFrom": Anonymize<I95l2k9b1re95f>;
    }>;
};
export type I4s6jkha20aoh0 = {
    "amount": bigint;
    "deposit": bigint;
};
export type I2brm5b9jij1st = [number, SS58String, SS58String];
export type I78s05f59eoi8b = {
    "deposit": bigint;
    "name": Uint8Array;
    "symbol": Uint8Array;
    "decimals": number;
    "is_frozen": boolean;
};
export type Ianufjuplcj6u4 = {
    "owner": SS58String;
    "issuer": SS58String;
    "admin": SS58String;
    "freezer": SS58String;
    "total_deposit": bigint;
    "free_holding": boolean;
    "items": number;
    "item_metadatas": number;
    "attributes": number;
    "is_frozen": boolean;
};
export type Id32h28hjj1tch = [SS58String, number, number];
export type I2mv9dvsaj3kcr = {
    "owner": SS58String;
    "approved"?: Anonymize<Ihfphjolmsqq1>;
    "is_frozen": boolean;
    "deposit": bigint;
};
export type I7781vnk0rm9eq = {
    "deposit": bigint;
    "data": Uint8Array;
    "is_frozen": boolean;
};
export type Ie2iqtdb0stqo1 = [Uint8Array, bigint];
export type I5irutptk105do = [number, Anonymize<I4arjljr6dpflb>, Uint8Array];
export type Ic9nev69d8grv1 = [bigint, Anonymize<Ihfphjolmsqq1>];
export type I18m6a0sc4k7s9 = {
    "owner": SS58String;
    "owner_deposit": bigint;
    "items": number;
    "item_metadatas": number;
    "item_configs": number;
    "attributes": number;
};
export type Ic9iokm15iigt6 = {
    "owner": SS58String;
    "approvals": Array<[SS58String, Anonymize<I4arjljr6dpflb>]>;
    "deposit": Anonymize<Ic262ibdoec56a>;
};
export type I35m96p3u4vl0p = {
    "deposit": bigint;
    "data": Uint8Array;
};
export type Iapmji0h53pmkn = {
    "deposit": Anonymize<I6e70ge7ubff75>;
    "data": Uint8Array;
};
export type I6e70ge7ubff75 = {
    "account"?: Anonymize<Ihfphjolmsqq1>;
    "amount": bigint;
};
export type Idrr42svup341f = [Uint8Array, Anonymize<I6e70ge7ubff75>];
export type I4ugih6gb4fmug = [number, Anonymize<I4arjljr6dpflb>, Anonymize<If3jjadhmug6qc>, Uint8Array];
export type Idac0t49lnd4ls = {
    "desired_collection": number;
    "desired_item"?: Anonymize<I4arjljr6dpflb>;
    "price"?: Anonymize<I6oogc1jbmmi81>;
    "deadline": number;
};
export type I72ndo6phms8ik = {
    "settings": bigint;
    "max_supply"?: Anonymize<I4arjljr6dpflb>;
    "mint_settings": Anonymize<Ia3s8qquibn97v>;
};
export type Ia3s8qquibn97v = {
    "mint_type": Enum<{
        "Issuer": undefined;
        "Public": undefined;
        "HolderOf": number;
    }>;
    "price"?: Anonymize<I35p85j063s0il>;
    "start_block"?: Anonymize<I4arjljr6dpflb>;
    "end_block"?: Anonymize<I4arjljr6dpflb>;
    "default_item_settings": bigint;
};
export type I4v5g6i7bmt06o = [Anonymize<If9iqq7i64mur8>, SS58String];
export type I84bhscllvv07n = [Anonymize<If9iqq7i64mur8>, SS58String, SS58String];
export type Iegmj7n48sc3am = {
    "proposer": SS58String;
    "value": bigint;
    "beneficiary": SS58String;
    "bond": bigint;
};
export type I2l0beelkqtf0a = {
    "asset_kind": Anonymize<I2q3ri6itcjj5u>;
    "amount": bigint;
    "beneficiary": Anonymize<I11rphme8avgla>;
    "valid_from": number;
    "expire_at": number;
    "status": TreasuryPaymentState;
};
export type TreasuryPaymentState = Enum<{
    "Pending": undefined;
    "Attempted": Anonymize<I4ov6e94l79mbg>;
    "Failed": undefined;
}>;
export declare const TreasuryPaymentState: GetEnum<TreasuryPaymentState>;
export type I4ov6e94l79mbg = {
    "id": bigint;
};
export type ConvictionVotingVoteVoting = Enum<{
    "Casting": {
        "votes": Array<[number, ConvictionVotingVoteAccountVote]>;
        "delegations": Anonymize<I538qha8r4j3ii>;
        "prior": Anonymize<I4ojmnsk1dchql>;
    };
    "Delegating": {
        "balance": bigint;
        "target": SS58String;
        "conviction": VotingConviction;
        "delegations": Anonymize<I538qha8r4j3ii>;
        "prior": Anonymize<I4ojmnsk1dchql>;
    };
}>;
export declare const ConvictionVotingVoteVoting: GetEnum<ConvictionVotingVoteVoting>;
export type I538qha8r4j3ii = {
    "votes": bigint;
    "capital": bigint;
};
export type I4ojmnsk1dchql = [number, bigint];
export type VotingConviction = Enum<{
    "None": undefined;
    "Locked1x": undefined;
    "Locked2x": undefined;
    "Locked3x": undefined;
    "Locked4x": undefined;
    "Locked5x": undefined;
    "Locked6x": undefined;
}>;
export declare const VotingConviction: GetEnum<VotingConviction>;
export type If9jidduiuq7vv = Array<Anonymize<I4ojmnsk1dchql>>;
export type I7ra2omf9acmpl = AnonymousEnum<{
    "Ongoing": {
        "track": number;
        "origin": Anonymize<I7qpv90droestd>;
        "proposal": PreimagesBounded;
        "enactment": TraitsScheduleDispatchTime;
        "submitted": number;
        "submission_deposit": Anonymize<Id5fm4p8lj5qgi>;
        "decision_deposit"?: Anonymize<Ibd24caul84kv2>;
        "deciding"?: Anonymize<Ibcbcndfmk0jd9>;
        "tally": Anonymize<Ifsk7cbmtit1jd>;
        "in_queue": boolean;
        "alarm"?: Anonymize<I3aj03qk2o5mdm>;
    };
    "Approved": Anonymize<Ini94eljn5lj8>;
    "Rejected": Anonymize<Ini94eljn5lj8>;
    "Cancelled": Anonymize<Ini94eljn5lj8>;
    "TimedOut": Anonymize<Ini94eljn5lj8>;
    "Killed": number;
}>;
export type TraitsScheduleDispatchTime = Enum<{
    "At": number;
    "After": number;
}>;
export declare const TraitsScheduleDispatchTime: GetEnum<TraitsScheduleDispatchTime>;
export type Ibd24caul84kv2 = (Anonymize<Id5fm4p8lj5qgi>) | undefined;
export type Ibcbcndfmk0jd9 = ({
    "since": number;
    "confirming"?: Anonymize<I4arjljr6dpflb>;
}) | undefined;
export type I3aj03qk2o5mdm = ([number, Anonymize<I9jd27rnpm8ttv>]) | undefined;
export type Ini94eljn5lj8 = [number, Anonymize<Ibd24caul84kv2>, Anonymize<Ibd24caul84kv2>];
export type Ict0fmb8krq1lk = {
    "proposer": SS58String;
    "value": bigint;
    "fee": bigint;
    "curator_deposit": bigint;
    "bond": bigint;
    "status": Enum<{
        "Proposed": undefined;
        "Approved": undefined;
        "Funded": undefined;
        "CuratorProposed": Anonymize<I846573mdj1pfn>;
        "Active": {
            "curator": SS58String;
            "update_due": number;
        };
        "PendingPayout": Anonymize<I4aulgjqrdphrm>;
        "ApprovedWithCurator": Anonymize<I846573mdj1pfn>;
    }>;
};
export type I846573mdj1pfn = {
    "curator": SS58String;
};
export type I4aulgjqrdphrm = {
    "curator": SS58String;
    "beneficiary": SS58String;
    "unlock_at": number;
};
export type Ibofbvvaehln4e = {
    "parent_bounty": number;
    "value": bigint;
    "fee": bigint;
    "curator_deposit": bigint;
    "status": ChildBountyStatus;
};
export type ChildBountyStatus = Enum<{
    "Added": undefined;
    "CuratorProposed": Anonymize<I846573mdj1pfn>;
    "Active": Anonymize<I846573mdj1pfn>;
    "PendingPayout": Anonymize<I4aulgjqrdphrm>;
}>;
export declare const ChildBountyStatus: GetEnum<ChildBountyStatus>;
export type I64c5iroci157c = {
    "asset_kind": Anonymize<I2q3ri6itcjj5u>;
    "value": bigint;
    "metadata": SizedHex<32>;
    "status": Anonymize<I39au3kk1cjram>;
};
export type I39au3kk1cjram = AnonymousEnum<{
    "FundingAttempted": {
        "curator": SS58String;
        "payment_status": Anonymize<I275cj9s9859k1>;
    };
    "Funded": Anonymize<I846573mdj1pfn>;
    "CuratorUnassigned": undefined;
    "Active": Anonymize<I846573mdj1pfn>;
    "RefundAttempted": {
        "curator"?: Anonymize<Ihfphjolmsqq1>;
        "payment_status": Anonymize<I275cj9s9859k1>;
    };
    "PayoutAttempted": {
        "curator": SS58String;
        "beneficiary": Anonymize<I11rphme8avgla>;
        "payment_status": Anonymize<I275cj9s9859k1>;
    };
}>;
export type I275cj9s9859k1 = AnonymousEnum<{
    "Pending": undefined;
    "Attempted": Anonymize<I4ov6e94l79mbg>;
    "Failed": undefined;
    "Succeeded": undefined;
}>;
export type I72g4e3mnj3e6d = {
    "parent_bounty": number;
    "value": bigint;
    "metadata": SizedHex<32>;
    "status": Anonymize<I39au3kk1cjram>;
};
export type Ifmarq0v77ok = [number, Anonymize<I4arjljr6dpflb>];
export type If354jrdedj0pj = {
    "progress_top": Anonymize<I1ufmh6d8psvik>;
    "progress_child": Anonymize<I1ufmh6d8psvik>;
    "size": number;
    "top_items": number;
    "child_items": number;
};
export type I1ufmh6d8psvik = AnonymousEnum<{
    "ToStart": undefined;
    "LastKey": Uint8Array;
    "Complete": undefined;
}>;
export type Ib17t3992hb64n = (Anonymize<I215mkl885p4da>) | undefined;
export type I215mkl885p4da = {
    "size": number;
    "item": number;
};
export type Idphjddn2h69vc = {
    "pool_id": number;
    "points": bigint;
    "last_recorded_reward_counter": bigint;
    "unbonding_eras": Anonymize<If9jidduiuq7vv>;
};
export type Idhh9vuu2bderg = {
    "commission": {
        "current"?: Anonymize<Ie8iutm7u02lmj>;
        "max"?: Anonymize<I4arjljr6dpflb>;
        "change_rate"?: (Anonymize<Ibqul338t9c1ll>) | undefined;
        "throttle_from"?: Anonymize<I4arjljr6dpflb>;
        "claim_permission"?: Anonymize<I16m1kn78dee7v>;
    };
    "member_counter": number;
    "points": bigint;
    "roles": {
        "depositor": SS58String;
        "root"?: Anonymize<Ihfphjolmsqq1>;
        "nominator"?: Anonymize<Ihfphjolmsqq1>;
        "bouncer"?: Anonymize<Ihfphjolmsqq1>;
    };
    "state": NominationPoolsPoolState;
};
export type If6qa32dj75gu1 = {
    "last_recorded_reward_counter": bigint;
    "last_recorded_total_payouts": bigint;
    "total_rewards_claimed": bigint;
    "total_commission_pending": bigint;
    "total_commission_claimed": bigint;
};
export type I7oo2mprv1qd1s = {
    "no_era": Anonymize<I4h0cfnkiqrna6>;
    "with_era": Array<[number, Anonymize<I4h0cfnkiqrna6>]>;
};
export type I4h0cfnkiqrna6 = {
    "points": bigint;
    "balance": bigint;
};
export type Ic5t26f9cp3tvk = {
    "id": SS58String;
    "prev"?: Anonymize<Ihfphjolmsqq1>;
    "next"?: Anonymize<Ihfphjolmsqq1>;
    "bag_upper": bigint;
    "score": bigint;
};
export type I39k39h6vu4hbq = {
    "head"?: Anonymize<Ihfphjolmsqq1>;
    "tail"?: Anonymize<Ihfphjolmsqq1>;
};
export type I542q009qbgt8k = {
    "agent": SS58String;
    "amount": bigint;
};
export type I4e5ujckjq61g8 = {
    "payee": SS58String;
    "total_delegated": bigint;
    "unclaimed_withdrawals": bigint;
    "pending_slash": bigint;
};
export type I3fgbanmq2lnk2 = {
    "end_index": number;
    "validator_points": Anonymize<I205qrookusi3d>;
    "activation_timestamp"?: Anonymize<I76de2jfh8ds4a>;
    "leftover": boolean;
};
export type I205qrookusi3d = Array<Anonymize<I6ouflveob4eli>>;
export type I6765e2s56217t = [{
    "new_validator_set": Anonymize<Ia2lhg7l2hilo3>;
    "id": number;
    "prune_up_to"?: Anonymize<I4arjljr6dpflb>;
    "leftover": boolean;
}, number];
export type I9cpogojpnsq8h = Array<[SS58String, bigint, Anonymize<Ia2lhg7l2hilo3>]>;
export type I4bboqsv44evel = Array<[SS58String, {
    "total": bigint;
    "voters": Anonymize<Iba9inugg1atvo>;
}]>;
export type Iba9inugg1atvo = Array<Anonymize<I95l2k9b1re95f>>;
export type I8je4hjun1hc3g = AnonymousEnum<{
    "X": undefined;
    "Y": undefined;
}>;
export type I3mj0igdqvh474 = Array<[SS58String, {
    "total": bigint;
    "backers": number;
}]>;
export type I29575k8s6asco = AnonymousEnum<{
    "Ongoing": number;
    "Nothing": undefined;
}>;
export type I3rfe446il0rb7 = Array<[SS58String, Anonymize<I8s6n43okuj2b1>]>;
export type I1nvcsqg39g26j = {
    "votes1": Anonymize<Iep4uo61810hfs>;
    "votes2": Array<[number, Anonymize<I5g2vv0ckl2m8b>, number]>;
    "votes3": Array<[number, FixedSizeArray<2, Anonymize<I5g2vv0ckl2m8b>>, number]>;
    "votes4": Array<[number, FixedSizeArray<3, Anonymize<I5g2vv0ckl2m8b>>, number]>;
    "votes5": Array<[number, FixedSizeArray<4, Anonymize<I5g2vv0ckl2m8b>>, number]>;
    "votes6": Array<[number, FixedSizeArray<5, Anonymize<I5g2vv0ckl2m8b>>, number]>;
    "votes7": Array<[number, FixedSizeArray<6, Anonymize<I5g2vv0ckl2m8b>>, number]>;
    "votes8": Array<[number, FixedSizeArray<7, Anonymize<I5g2vv0ckl2m8b>>, number]>;
    "votes9": Array<[number, FixedSizeArray<8, Anonymize<I5g2vv0ckl2m8b>>, number]>;
    "votes10": Array<[number, FixedSizeArray<9, Anonymize<I5g2vv0ckl2m8b>>, number]>;
    "votes11": Array<[number, FixedSizeArray<10, Anonymize<I5g2vv0ckl2m8b>>, number]>;
    "votes12": Array<[number, FixedSizeArray<11, Anonymize<I5g2vv0ckl2m8b>>, number]>;
    "votes13": Array<[number, FixedSizeArray<12, Anonymize<I5g2vv0ckl2m8b>>, number]>;
    "votes14": Array<[number, FixedSizeArray<13, Anonymize<I5g2vv0ckl2m8b>>, number]>;
    "votes15": Array<[number, FixedSizeArray<14, Anonymize<I5g2vv0ckl2m8b>>, number]>;
    "votes16": Array<[number, FixedSizeArray<15, Anonymize<I5g2vv0ckl2m8b>>, number]>;
};
export type Iep4uo61810hfs = Array<Anonymize<I5g2vv0ckl2m8b>>;
export type Iefkd2klketjfh = {
    "deposit": bigint;
    "fee": bigint;
    "reward": bigint;
    "claimed_score": Anonymize<I8s6n43okuj2b1>;
    "pages": Array<boolean>;
};
export type I69tqqtpr9n8ie = {
    "stash": SS58String;
    "total": bigint;
    "active": bigint;
    "unlocking": Anonymize<I9nc4v1upo2c8e>;
};
export type I9nc4v1upo2c8e = Array<{
    "value": bigint;
    "era": number;
}>;
export type Ic3m9d6tdl6gi2 = {
    "targets": Anonymize<Ia2lhg7l2hilo3>;
    "submitted_in": number;
    "suppressed": boolean;
};
export type Ib3j7gb0jgs38u = {
    "index": number;
    "start"?: Anonymize<I35p85j063s0il>;
};
export type I6flrronqs3l6n = {
    "total": bigint;
    "own": bigint;
    "nominator_count": number;
    "page_count": number;
};
export type I97fulj5h3ik95 = {
    "page_total": bigint;
    "others": Array<{
        "who": SS58String;
        "value": bigint;
    }>;
};
export type Iff9p3c7k6pfoi = {
    "total": number;
    "individual": Anonymize<I205qrookusi3d>;
};
export type I7oqom2n34q7u8 = {
    "reporter"?: Anonymize<Ihfphjolmsqq1>;
    "reported_era": number;
    "exposure_page": number;
    "slash_fraction": number;
    "prior_slash_fraction": number;
};
export type I921dks5d4ov9t = [number, SS58String, Anonymize<I7oqom2n34q7u8>];
export type Idm2c96td6cqkk = {
    "validator": SS58String;
    "own": bigint;
    "others": Anonymize<Iba9inugg1atvo>;
    "reporter"?: Anonymize<Ihfphjolmsqq1>;
    "payout": bigint;
};
export type Iam8h8p165t5uu = [number, Anonymize<Id32h28hjj1tch>];
export type I70u6ma6po0va2 = AnonymousEnum<{
    "Ongoing": SS58String;
    "Consumed": undefined;
    "Waiting": undefined;
}>;
export type I2gkgd7kt1f2bl = AnonymousEnum<{
    "ErasStakersPaged": undefined;
    "ErasStakersOverview": undefined;
    "ErasValidatorPrefs": undefined;
    "ClaimedRewards": undefined;
    "ErasValidatorReward": undefined;
    "ErasRewardPoints": undefined;
    "SingleEntryCleanups": undefined;
    "ValidatorSlashInEra": undefined;
}>;
export type I834nfrf667ag1 = {
    "owner": SS58String;
    "deposit": bigint;
    "refcount": bigint;
    "code_len": number;
    "code_type": Enum<{
        "Pvm": undefined;
        "Evm": undefined;
    }>;
    "behaviour_version": number;
};
export type I14i9pui8lc778 = {
    "account_type": Enum<{
        "Contract": {
            "trie_id": Uint8Array;
            "code_hash": SizedHex<32>;
            "storage_bytes": number;
            "storage_items": number;
            "storage_byte_deposit": bigint;
            "storage_item_deposit": bigint;
            "storage_base_deposit": bigint;
            "immutable_data_len": number;
        };
        "EOA": undefined;
    }>;
    "dust": number;
};
export type I8t4pajubp34g3 = {
    "insert_counter": number;
    "delete_counter": number;
};
export type I10nrsmn0hji4l = {
    "base_fee_per_gas": Anonymize<I4totqt881mlti>;
    "blob_gas_used": Anonymize<I4totqt881mlti>;
    "difficulty": Anonymize<I4totqt881mlti>;
    "excess_blob_gas": Anonymize<I4totqt881mlti>;
    "extra_data": Uint8Array;
    "gas_limit": Anonymize<I4totqt881mlti>;
    "gas_used": Anonymize<I4totqt881mlti>;
    "hash": SizedHex<32>;
    "logs_bloom": SizedHex<256>;
    "miner": SizedHex<20>;
    "mix_hash": SizedHex<32>;
    "nonce": SizedHex<8>;
    "number": Anonymize<I4totqt881mlti>;
    "parent_beacon_block_root"?: Anonymize<I4s6vifaf8k998>;
    "parent_hash": SizedHex<32>;
    "receipts_root": SizedHex<32>;
    "requests_hash"?: Anonymize<I4s6vifaf8k998>;
    "sha_3_uncles": SizedHex<32>;
    "size": Anonymize<I4totqt881mlti>;
    "state_root": SizedHex<32>;
    "timestamp": Anonymize<I4totqt881mlti>;
    "total_difficulty"?: Anonymize<Ic4rgfgksgmm3e>;
    "transactions": Enum<{
        "Hashes": Anonymize<Ic5m5lp1oioo8r>;
        "TransactionInfos": Array<{
            "block_hash": SizedHex<32>;
            "block_number": Anonymize<I4totqt881mlti>;
            "from": SizedHex<20>;
            "hash": SizedHex<32>;
            "transaction_index": Anonymize<I4totqt881mlti>;
            "transaction_signed": Enum<{
                "Transaction7702Signed": {
                    "transaction_7702_unsigned": {
                        "access_list": Anonymize<Ieap15h2pjii9u>;
                        "authorization_list": Anonymize<Ie0had75u5b8qk>;
                        "chain_id": Anonymize<I4totqt881mlti>;
                        "gas": Anonymize<I4totqt881mlti>;
                        "gas_price": Anonymize<I4totqt881mlti>;
                        "input": Uint8Array;
                        "max_fee_per_gas": Anonymize<I4totqt881mlti>;
                        "max_priority_fee_per_gas": Anonymize<I4totqt881mlti>;
                        "nonce": Anonymize<I4totqt881mlti>;
                        "to": SizedHex<20>;
                        "r#type": number;
                        "value": Anonymize<I4totqt881mlti>;
                    };
                    "r": Anonymize<I4totqt881mlti>;
                    "s": Anonymize<I4totqt881mlti>;
                    "v"?: Anonymize<Ic4rgfgksgmm3e>;
                    "y_parity": Anonymize<I4totqt881mlti>;
                };
                "Transaction4844Signed": {
                    "transaction_4844_unsigned": {
                        "access_list": Anonymize<Ieap15h2pjii9u>;
                        "blob_versioned_hashes": Anonymize<Ic5m5lp1oioo8r>;
                        "chain_id": Anonymize<I4totqt881mlti>;
                        "gas": Anonymize<I4totqt881mlti>;
                        "input": Uint8Array;
                        "max_fee_per_blob_gas": Anonymize<I4totqt881mlti>;
                        "max_fee_per_gas": Anonymize<I4totqt881mlti>;
                        "max_priority_fee_per_gas": Anonymize<I4totqt881mlti>;
                        "nonce": Anonymize<I4totqt881mlti>;
                        "to": SizedHex<20>;
                        "r#type": number;
                        "value": Anonymize<I4totqt881mlti>;
                    };
                    "r": Anonymize<I4totqt881mlti>;
                    "s": Anonymize<I4totqt881mlti>;
                    "y_parity": Anonymize<I4totqt881mlti>;
                };
                "Transaction1559Signed": {
                    "transaction_1559_unsigned": {
                        "access_list": Anonymize<Ieap15h2pjii9u>;
                        "chain_id": Anonymize<I4totqt881mlti>;
                        "gas": Anonymize<I4totqt881mlti>;
                        "gas_price": Anonymize<I4totqt881mlti>;
                        "input": Uint8Array;
                        "max_fee_per_gas": Anonymize<I4totqt881mlti>;
                        "max_priority_fee_per_gas": Anonymize<I4totqt881mlti>;
                        "nonce": Anonymize<I4totqt881mlti>;
                        "to"?: Anonymize<If7b8240vgt2q5>;
                        "r#type": number;
                        "value": Anonymize<I4totqt881mlti>;
                    };
                    "r": Anonymize<I4totqt881mlti>;
                    "s": Anonymize<I4totqt881mlti>;
                    "v"?: Anonymize<Ic4rgfgksgmm3e>;
                    "y_parity": Anonymize<I4totqt881mlti>;
                };
                "Transaction2930Signed": {
                    "transaction_2930_unsigned": {
                        "access_list": Anonymize<Ieap15h2pjii9u>;
                        "chain_id": Anonymize<I4totqt881mlti>;
                        "gas": Anonymize<I4totqt881mlti>;
                        "gas_price": Anonymize<I4totqt881mlti>;
                        "input": Uint8Array;
                        "nonce": Anonymize<I4totqt881mlti>;
                        "to"?: Anonymize<If7b8240vgt2q5>;
                        "r#type": number;
                        "value": Anonymize<I4totqt881mlti>;
                    };
                    "r": Anonymize<I4totqt881mlti>;
                    "s": Anonymize<I4totqt881mlti>;
                    "v"?: Anonymize<Ic4rgfgksgmm3e>;
                    "y_parity": Anonymize<I4totqt881mlti>;
                };
                "TransactionLegacySigned": {
                    "transaction_legacy_unsigned": {
                        "chain_id"?: Anonymize<Ic4rgfgksgmm3e>;
                        "gas": Anonymize<I4totqt881mlti>;
                        "gas_price": Anonymize<I4totqt881mlti>;
                        "input": Uint8Array;
                        "nonce": Anonymize<I4totqt881mlti>;
                        "to"?: Anonymize<If7b8240vgt2q5>;
                        "r#type": number;
                        "value": Anonymize<I4totqt881mlti>;
                    };
                    "r": Anonymize<I4totqt881mlti>;
                    "s": Anonymize<I4totqt881mlti>;
                    "v": Anonymize<I4totqt881mlti>;
                };
            }>;
        }>;
    }>;
    "transactions_root": SizedHex<32>;
    "uncles": Anonymize<Ic5m5lp1oioo8r>;
    "withdrawals": Array<{
        "address": SizedHex<20>;
        "amount": Anonymize<I4totqt881mlti>;
        "index": Anonymize<I4totqt881mlti>;
        "validator_index": Anonymize<I4totqt881mlti>;
    }>;
    "withdrawals_root": SizedHex<32>;
};
export type I4totqt881mlti = FixedSizeArray<4, bigint>;
export type Ic4rgfgksgmm3e = (Anonymize<I4totqt881mlti>) | undefined;
export type Ieap15h2pjii9u = Array<{
    "address": SizedHex<20>;
    "storage_keys": Anonymize<Ic5m5lp1oioo8r>;
}>;
export type Ie0had75u5b8qk = Array<{
    "chain_id": Anonymize<I4totqt881mlti>;
    "address": SizedHex<20>;
    "nonce": Anonymize<I4totqt881mlti>;
    "y_parity": Anonymize<I4totqt881mlti>;
    "r": Anonymize<I4totqt881mlti>;
    "s": Anonymize<I4totqt881mlti>;
}>;
export type If7b8240vgt2q5 = (SizedHex<20>) | undefined;
export type I3oiqcurom3m43 = Array<{
    "gas_used": Anonymize<I4totqt881mlti>;
    "effective_gas_price": Anonymize<I4totqt881mlti>;
}>;
export type I20ichc5j0l1u7 = {
    "transaction_root_builder": {
        "key": Uint8Array;
        "value_type": number;
        "builder_value": Uint8Array;
        "stack": Anonymize<Itom7fk49o0c9>;
        "state_masks": Anonymize<Icgljjb6j82uhn>;
        "tree_masks": Anonymize<Icgljjb6j82uhn>;
        "hash_masks": Anonymize<Icgljjb6j82uhn>;
        "stored_in_database": boolean;
        "rlp_buf": Uint8Array;
        "index": bigint;
    };
    "receipts_root_builder": {
        "key": Uint8Array;
        "value_type": number;
        "builder_value": Uint8Array;
        "stack": Anonymize<Itom7fk49o0c9>;
        "state_masks": Anonymize<Icgljjb6j82uhn>;
        "tree_masks": Anonymize<Icgljjb6j82uhn>;
        "hash_masks": Anonymize<Icgljjb6j82uhn>;
        "stored_in_database": boolean;
        "rlp_buf": Uint8Array;
        "index": bigint;
    };
    "base_fee_per_gas": Anonymize<I4totqt881mlti>;
    "block_gas_limit": Anonymize<I4totqt881mlti>;
    "gas_used": Anonymize<I4totqt881mlti>;
    "logs_bloom": SizedHex<256>;
    "tx_hashes": Anonymize<Ic5m5lp1oioo8r>;
    "gas_info": Anonymize<I3oiqcurom3m43>;
};
export type I1p16diuhde12h = (Anonymize<Idkbvh6dahk1v7>) | undefined;
export type Idkbvh6dahk1v7 = FixedSizeArray<2, Uint8Array>;
export type Id4f5q01qh34o3 = {
    "allow_unlimited_contract_size": boolean;
    "bypass_eip_3607": boolean;
    "pvm_logs": boolean;
};
export type I6o6dmud53u1fj = [number, number, SS58String];
export type Ifb0kt7cu5a61c = {
    "who": SS58String;
    "free": bigint;
    "reserved": bigint;
    "frozen": bigint;
    "holds": Array<{
        "id": Enum<{
            "Preimage": PreimagePalletHoldReason;
            "Staking": Anonymize<Icbapambb5rug3>;
            "StateTrieMigration": Anonymize<I7lf1val3vmpq0>;
            "DelegatedStaking": Anonymize<Ib6ve2drlnapui>;
            "Session": Anonymize<I6bkr3dqv753nc>;
            "XcmPallet": Anonymize<Ideiof6273rsoe>;
        }>;
        "amount": bigint;
    }>;
    "freezes": Anonymize<I2l1ctuihi2mfd>;
    "locks": Anonymize<I8ds64oj6581v0>;
    "unnamed_reserve": bigint;
    "consumers": number;
    "providers": number;
};
export type In7a38730s6qs = {
    "base_block": Anonymize<I4q39t5hn830vp>;
    "max_block": Anonymize<I4q39t5hn830vp>;
    "per_class": {
        "normal": {
            "base_extrinsic": Anonymize<I4q39t5hn830vp>;
            "max_extrinsic"?: Anonymize<Iasb8k6ash5mjn>;
            "max_total"?: Anonymize<Iasb8k6ash5mjn>;
            "reserved"?: Anonymize<Iasb8k6ash5mjn>;
        };
        "operational": {
            "base_extrinsic": Anonymize<I4q39t5hn830vp>;
            "max_extrinsic"?: Anonymize<Iasb8k6ash5mjn>;
            "max_total"?: Anonymize<Iasb8k6ash5mjn>;
            "reserved"?: Anonymize<Iasb8k6ash5mjn>;
        };
        "mandatory": {
            "base_extrinsic": Anonymize<I4q39t5hn830vp>;
            "max_extrinsic"?: Anonymize<Iasb8k6ash5mjn>;
            "max_total"?: Anonymize<Iasb8k6ash5mjn>;
            "reserved"?: Anonymize<Iasb8k6ash5mjn>;
        };
    };
};
export type If15el53dd76v9 = {
    "normal": number;
    "operational": number;
    "mandatory": number;
};
export type I9s0ave7t0vnrk = {
    "read": bigint;
    "write": bigint;
};
export type I4fo08joqmcqnm = {
    "spec_name": string;
    "impl_name": string;
    "authoring_version": number;
    "spec_version": number;
    "impl_version": number;
    "apis": Array<[SizedHex<8>, number]>;
    "transaction_version": number;
    "system_version": number;
};
export type Ibafpkl9hhno69 = Array<[number, {
    "name": string;
    "max_deciding": number;
    "decision_deposit": bigint;
    "prepare_period": number;
    "decision_period": number;
    "confirm_period": number;
    "min_enactment_period": number;
    "min_approval": ReferendaTypesCurve;
    "min_support": ReferendaTypesCurve;
}]>;
export type ReferendaTypesCurve = Enum<{
    "LinearDecreasing": {
        "length": number;
        "floor": number;
        "ceil": number;
    };
    "SteppedDecreasing": {
        "begin": number;
        "end": number;
        "step": number;
        "period": number;
    };
    "Reciprocal": {
        "factor": bigint;
        "x_offset": bigint;
        "y_offset": bigint;
    };
}>;
export declare const ReferendaTypesCurve: GetEnum<ReferendaTypesCurve>;
export type Iafqnechp3omqg = Array<bigint>;
export type Ifaoavjs71ibps = AnonymousEnum<{
    /**
     * Make some on-chain remark.
     *
     * Can be executed by every `origin`.
     */
    "remark": Anonymize<I8ofcg5rbj0g2c>;
    /**
     * Set the number of pages in the WebAssembly environment's heap.
     */
    "set_heap_pages": Anonymize<I4adgbll7gku4i>;
    /**
     * Set the new runtime code.
     */
    "set_code": Anonymize<I6pjjpfvhvcfru>;
    /**
     * Set the new runtime code without doing any checks of the given `code`.
     *
     * Note that runtime upgrades will not run if this is called with a not-increasing spec
     * version!
     */
    "set_code_without_checks": Anonymize<I6pjjpfvhvcfru>;
    /**
     * Set some items of storage.
     */
    "set_storage": Anonymize<I9pj91mj79qekl>;
    /**
     * Kill some items from storage.
     */
    "kill_storage": Anonymize<I39uah9nss64h9>;
    /**
     * Kill all storage items with a key that starts with the given prefix.
     *
     * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
     * the prefix we are removing to accurately calculate the weight of this function.
     */
    "kill_prefix": Anonymize<Ik64dknsq7k08>;
    /**
     * Make some on-chain remark and emit event.
     */
    "remark_with_event": Anonymize<I8ofcg5rbj0g2c>;
    "do_task": Anonymize<I3m5sq54sjdlso>;
    /**
     * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
     * later.
     *
     * This call requires Root origin.
     */
    "authorize_upgrade": Anonymize<Ib51vk42m1po4n>;
    /**
     * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
     * later.
     *
     * WARNING: This authorizes an upgrade that will take place without any safety checks, for
     * example that the spec name remains the same and that the version number increases. Not
     * recommended for normal use. Use `authorize_upgrade` instead.
     *
     * This call requires Root origin.
     */
    "authorize_upgrade_without_checks": Anonymize<Ib51vk42m1po4n>;
    /**
     * Provide the preimage (runtime binary) `code` for an upgrade that has been authorized.
     *
     * If the authorization required a version check, this call will ensure the spec name
     * remains unchanged and that the spec version has increased.
     *
     * Depending on the runtime's `OnSetCode` configuration, this function may directly apply
     * the new `code` in the same block or attempt to schedule the upgrade.
     *
     * All origins are allowed.
     */
    "apply_authorized_upgrade": Anonymize<I6pjjpfvhvcfru>;
}>;
export type I8ofcg5rbj0g2c = {
    "remark": Uint8Array;
};
export type I4adgbll7gku4i = {
    "pages": bigint;
};
export type I6pjjpfvhvcfru = {
    "code": Uint8Array;
};
export type I9pj91mj79qekl = {
    "items": Anonymize<I6pi5ou8r1hblk>;
};
export type I6pi5ou8r1hblk = Array<Anonymize<Idkbvh6dahk1v7>>;
export type I39uah9nss64h9 = {
    "keys": Anonymize<Itom7fk49o0c9>;
};
export type Ik64dknsq7k08 = {
    "prefix": Uint8Array;
    "subkeys": number;
};
export type Ib51vk42m1po4n = {
    "code_hash": SizedHex<32>;
};
export type I3u72uvpuo4qrt = AnonymousEnum<{
    /**
     * Set the current validation data.
     *
     * This should be invoked exactly once per block. It will panic at the finalization
     * phase if the call was not invoked.
     *
     * The dispatch origin for this call must be `Inherent`
     *
     * As a side effect, this function upgrades the current validation function
     * if the appropriate time has come.
     */
    "set_validation_data": Anonymize<Ial23jn8hp0aen>;
    "sudo_send_upward_message": Anonymize<Ifpj261e8s63m3>;
}>;
export type Ial23jn8hp0aen = {
    "data": {
        "validation_data": Anonymize<Ifn6q3equiq9qi>;
        "relay_chain_state": Anonymize<Itom7fk49o0c9>;
        "relay_parent_descendants": Array<Anonymize<Ic952bubvq4k7d>>;
        "collator_peer_id"?: Anonymize<Iabpgqcjikia83>;
    };
    "inbound_messages_data": {
        "downward_messages": {
            "full_messages": Array<{
                "sent_at": number;
                "msg": Uint8Array;
            }>;
            "hashed_messages": Array<Anonymize<Icqnh9ino03itn>>;
        };
        "horizontal_messages": {
            "full_messages": Array<[number, {
                "sent_at": number;
                "data": Uint8Array;
            }]>;
            "hashed_messages": Array<[number, Anonymize<Icqnh9ino03itn>]>;
        };
    };
};
export type Ic952bubvq4k7d = {
    "parent_hash": SizedHex<32>;
    "number": number;
    "state_root": SizedHex<32>;
    "extrinsics_root": SizedHex<32>;
    "digest": Anonymize<I4mddgoa69c0a2>;
};
export type Icqnh9ino03itn = {
    "sent_at": number;
    "msg_hash": SizedHex<32>;
};
export type Ifpj261e8s63m3 = {
    "message": Uint8Array;
};
export type I7d75gqfg6jh9c = AnonymousEnum<{
    /**
     * Set the current time.
     *
     * This call should be invoked exactly once per block. It will panic at the finalization
     * phase, if this call hasn't been invoked by that time.
     *
     * The timestamp should be greater than the previous one by the amount specified by
     * [`Config::MinimumPeriod`].
     *
     * The dispatch origin for this call must be _None_.
     *
     * This dispatch class is _Mandatory_ to ensure it gets executed in the block. Be aware
     * that changing the complexity of this call could result exhausting the resources in a
     * block to execute any other calls.
     *
     * ## Complexity
     * - `O(1)` (Note that implementations of `OnTimestampSet` must also be `O(1)`)
     * - 1 storage read and 1 storage mutation (codec `O(1)` because of `DidUpdate::take` in
     * `on_finalize`)
     * - 1 event handler `on_timestamp_set`. Must be `O(1)`.
     */
    "set": Anonymize<Idcr6u6361oad9>;
}>;
export type Idcr6u6361oad9 = {
    "now": bigint;
};
export type If81ks88t5mpk5 = AnonymousEnum<{
    /**
     * Register a preimage on-chain.
     *
     * If the preimage was previously requested, no fees or deposits are taken for providing
     * the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.
     */
    "note_preimage": Anonymize<I82nfqfkd48n10>;
    /**
     * Clear an unrequested preimage from the runtime storage.
     *
     * If `len` is provided, then it will be a much cheaper operation.
     *
     * - `hash`: The hash of the preimage to be removed from the store.
     * - `len`: The length of the preimage of `hash`.
     */
    "unnote_preimage": Anonymize<I1jm8m1rh9e20v>;
    /**
     * Request a preimage be uploaded to the chain without paying any fees or deposits.
     *
     * If the preimage requests has already been provided on-chain, we unreserve any deposit
     * a user may have paid, and take the control of the preimage out of their hands.
     */
    "request_preimage": Anonymize<I1jm8m1rh9e20v>;
    /**
     * Clear a previously made request for a preimage.
     *
     * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
     */
    "unrequest_preimage": Anonymize<I1jm8m1rh9e20v>;
    /**
     * Ensure that the bulk of pre-images is upgraded.
     *
     * The caller pays no fee if at least 90% of pre-images were successfully updated.
     */
    "ensure_updated": Anonymize<I3o5j3bli1pd8e>;
}>;
export type I82nfqfkd48n10 = {
    "bytes": Uint8Array;
};
export type I3o5j3bli1pd8e = {
    "hashes": Anonymize<Ic5m5lp1oioo8r>;
};
export type I4igssil1ghqt1 = AnonymousEnum<{
    /**
     * Anonymously schedule a task.
     */
    "schedule": Anonymize<I304bsj18ipusd>;
    /**
     * Cancel an anonymously scheduled task.
     */
    "cancel": Anonymize<I5n4sebgkfr760>;
    /**
     * Schedule a named task.
     */
    "schedule_named": Anonymize<I70j4tsj4jnnmm>;
    /**
     * Cancel a named scheduled task.
     */
    "cancel_named": Anonymize<Ifs1i5fk9cqvr6>;
    /**
     * Anonymously schedule a task after a delay.
     */
    "schedule_after": Anonymize<Iedanerg9go0jc>;
    /**
     * Schedule a named task after a delay.
     */
    "schedule_named_after": Anonymize<I6ojmhgbsr6bah>;
    /**
     * Set a retry configuration for a task so that, in case its scheduled run fails, it will
     * be retried after `period` blocks, for a total amount of `retries` retries or until it
     * succeeds.
     *
     * Tasks which need to be scheduled for a retry are still subject to weight metering and
     * agenda space, same as a regular task. If a periodic task fails, it will be scheduled
     * normally while the task is retrying.
     *
     * Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic
     * clones of the original task. Their retry configuration will be derived from the
     * original task's configuration, but will have a lower value for `remaining` than the
     * original `total_retries`.
     */
    "set_retry": Anonymize<Ieg3fd8p4pkt10>;
    /**
     * Set a retry configuration for a named task so that, in case its scheduled run fails, it
     * will be retried after `period` blocks, for a total amount of `retries` retries or until
     * it succeeds.
     *
     * Tasks which need to be scheduled for a retry are still subject to weight metering and
     * agenda space, same as a regular task. If a periodic task fails, it will be scheduled
     * normally while the task is retrying.
     *
     * Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic
     * clones of the original task. Their retry configuration will be derived from the
     * original task's configuration, but will have a lower value for `remaining` than the
     * original `total_retries`.
     */
    "set_retry_named": Anonymize<I8kg5ll427kfqq>;
    /**
     * Removes the retry configuration of a task.
     */
    "cancel_retry": Anonymize<I467333262q1l9>;
    /**
     * Cancel the retry configuration of a named task.
     */
    "cancel_retry_named": Anonymize<Ifs1i5fk9cqvr6>;
}>;
export type I304bsj18ipusd = {
    "when": number;
    "maybe_periodic"?: Anonymize<Iep7au1720bm0e>;
    "priority": number;
    "call": TxCallData;
};
export type I70j4tsj4jnnmm = {
    "id": SizedHex<32>;
    "when": number;
    "maybe_periodic"?: Anonymize<Iep7au1720bm0e>;
    "priority": number;
    "call": TxCallData;
};
export type Ifs1i5fk9cqvr6 = {
    "id": SizedHex<32>;
};
export type Iedanerg9go0jc = {
    "after": number;
    "maybe_periodic"?: Anonymize<Iep7au1720bm0e>;
    "priority": number;
    "call": TxCallData;
};
export type I6ojmhgbsr6bah = {
    "id": SizedHex<32>;
    "after": number;
    "maybe_periodic"?: Anonymize<Iep7au1720bm0e>;
    "priority": number;
    "call": TxCallData;
};
export type Ieg3fd8p4pkt10 = {
    "task": Anonymize<I9jd27rnpm8ttv>;
    "retries": number;
    "period": number;
};
export type I8kg5ll427kfqq = {
    "id": SizedHex<32>;
    "retries": number;
    "period": number;
};
export type I467333262q1l9 = {
    "task": Anonymize<I9jd27rnpm8ttv>;
};
export type I6a0l99iu4e4a8 = AnonymousEnum<{
    /**
     * Set the value of a parameter.
     *
     * The dispatch origin of this call must be `AdminOrigin` for the given `key`. Values be
     * deleted by setting them to `None`.
     */
    "set_parameter": Anonymize<I6usrkf9la6hg2>;
}>;
export type I6usrkf9la6hg2 = {
    "key_value": Enum<{
        "StakingElection": Enum<{
            "SignedPhase": Anonymize<Idqsmalvqe2q98>;
            "MaxSignedSubmissions": Anonymize<Idqsmalvqe2q98>;
            "UnsignedPhase": Anonymize<Idqsmalvqe2q98>;
            "MinerPages": Anonymize<Idqsmalvqe2q98>;
            "MaxElectingVoters": Anonymize<Idqsmalvqe2q98>;
            "TargetSnapshotPerBlock": Anonymize<Idqsmalvqe2q98>;
            "MaxEraDuration": FixedSizeArray<1, Anonymize<I35p85j063s0il>>;
        }>;
        "Scheduler": Enum<{
            "MaxScheduledPerBlock": Anonymize<Idqsmalvqe2q98>;
            "MaximumWeight": FixedSizeArray<1, Anonymize<Iasb8k6ash5mjn>>;
        }>;
        "MessageQueue": Enum<{
            "MaxOnInitWeight": FixedSizeArray<1, (Anonymize<Iasb8k6ash5mjn>) | undefined>;
            "MaxOnIdleWeight": FixedSizeArray<1, (Anonymize<Iasb8k6ash5mjn>) | undefined>;
        }>;
    }>;
};
export type Idqsmalvqe2q98 = FixedSizeArray<1, Anonymize<I4arjljr6dpflb>>;
export type I4oqb168b2d4er = AnonymousEnum<{
    /**
     * Allows root to set a cursor to forcefully start, stop or forward the migration process.
     *
     * Should normally not be needed and is only in place as emergency measure. Note that
     * restarting the migration process in this manner will not call the
     * [`MigrationStatusHandler::started`] hook or emit an `UpgradeStarted` event.
     */
    "force_set_cursor": Anonymize<Ibou4u1engb441>;
    /**
     * Allows root to set an active cursor to forcefully start/forward the migration process.
     *
     * This is an edge-case version of [`Self::force_set_cursor`] that allows to set the
     * `started_at` value to the next block number. Otherwise this would not be possible, since
     * `force_set_cursor` takes an absolute block number. Setting `started_at` to `None`
     * indicates that the current block number plus one should be used.
     */
    "force_set_active_cursor": Anonymize<Id6nbvqoqdj4o2>;
    /**
     * Forces the onboarding of the migrations.
     *
     * This process happens automatically on a runtime upgrade. It is in place as an emergency
     * measurement. The cursor needs to be `None` for this to succeed.
     */
    "force_onboard_mbms": undefined;
    /**
     * Clears the `Historic` set.
     *
     * `map_cursor` must be set to the last value that was returned by the
     * `HistoricCleared` event. The first time `None` can be used. `limit` must be chosen in a
     * way that will result in a sensible weight.
     */
    "clear_historic": Anonymize<I95iqep3b8snn9>;
}>;
export type Ibou4u1engb441 = {
    "cursor"?: (Anonymize<Iepbsvlk3qceij>) | undefined;
};
export type Id6nbvqoqdj4o2 = {
    "index": number;
    "inner_cursor"?: Anonymize<Iabpgqcjikia83>;
    "started_at"?: Anonymize<I4arjljr6dpflb>;
};
export type I95iqep3b8snn9 = {
    "selector": Enum<{
        "Specific": Anonymize<Itom7fk49o0c9>;
        "Wildcard": {
            "limit"?: Anonymize<I4arjljr6dpflb>;
            "previous_cursor"?: Anonymize<Iabpgqcjikia83>;
        };
    }>;
};
export type I9svldsp29mh87 = AnonymousEnum<{
    /**
     * Transfer some liquid free balance to another account.
     *
     * `transfer_allow_death` will set the `FreeBalance` of the sender and receiver.
     * If the sender's account is below the existential deposit as a result
     * of the transfer, the account will be reaped.
     *
     * The dispatch origin for this call must be `Signed` by the transactor.
     */
    "transfer_allow_death": Anonymize<I4ktuaksf5i1gk>;
    /**
     * Exactly as `transfer_allow_death`, except the origin must be root and the source account
     * may be specified.
     */
    "force_transfer": Anonymize<I9bqtpv2ii35mp>;
    /**
     * Same as the [`transfer_allow_death`] call, but with a check that the transfer will not
     * kill the origin account.
     *
     * 99% of the time you want [`transfer_allow_death`] instead.
     *
     * [`transfer_allow_death`]: struct.Pallet.html#method.transfer
     */
    "transfer_keep_alive": Anonymize<I4ktuaksf5i1gk>;
    /**
     * Transfer the entire transferable balance from the caller account.
     *
     * NOTE: This function only attempts to transfer _transferable_ balances. This means that
     * any locked, reserved, or existential deposits (when `keep_alive` is `true`), will not be
     * transferred by this function. To ensure that this function results in a killed account,
     * you might need to prepare the account by removing any reference counters, storage
     * deposits, etc...
     *
     * The dispatch origin of this call must be Signed.
     *
     * - `dest`: The recipient of the transfer.
     * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
     * of the funds the account has, causing the sender account to be killed (false), or
     * transfer everything except at least the existential deposit, which will guarantee to
     * keep the sender account alive (true).
     */
    "transfer_all": Anonymize<I9j7pagd6d4bda>;
    /**
     * Unreserve some balance from a user by force.
     *
     * Can only be called by ROOT.
     */
    "force_unreserve": Anonymize<I2h9pmio37r7fb>;
    /**
     * Upgrade a specified account.
     *
     * - `origin`: Must be `Signed`.
     * - `who`: The account to be upgraded.
     *
     * This will waive the transaction fee if at least all but 10% of the accounts needed to
     * be upgraded. (We let some not have to be upgraded just in order to allow for the
     * possibility of churn).
     */
    "upgrade_accounts": Anonymize<Ibmr18suc9ikh9>;
    /**
     * Set the regular balance of a given account.
     *
     * The dispatch origin for this call is `root`.
     */
    "force_set_balance": Anonymize<I9iq22t0burs89>;
    /**
     * Adjust the total issuance in a saturating way.
     *
     * Can only be called by root and always needs a positive `delta`.
     *
     * # Example
     */
    "force_adjust_total_issuance": Anonymize<I5u8olqbbvfnvf>;
    /**
     * Burn the specified liquid free balance from the origin account.
     *
     * If the origin's account ends up below the existential deposit as a result
     * of the burn and `keep_alive` is false, the account will be reaped.
     *
     * Unlike sending funds to a _burn_ address, which merely makes the funds inaccessible,
     * this `burn` operation will reduce total issuance by the amount _burned_.
     */
    "burn": Anonymize<I5utcetro501ir>;
}>;
export type I4ktuaksf5i1gk = {
    "dest": MultiAddress;
    "value": bigint;
};
export type MultiAddress = Enum<{
    "Id": SS58String;
    "Index": undefined;
    "Raw": Uint8Array;
    "Address32": SizedHex<32>;
    "Address20": SizedHex<20>;
}>;
export declare const MultiAddress: GetEnum<MultiAddress>;
export type I9bqtpv2ii35mp = {
    "source": MultiAddress;
    "dest": MultiAddress;
    "value": bigint;
};
export type I9j7pagd6d4bda = {
    "dest": MultiAddress;
    "keep_alive": boolean;
};
export type I2h9pmio37r7fb = {
    "who": MultiAddress;
    "amount": bigint;
};
export type Ibmr18suc9ikh9 = {
    "who": Anonymize<Ia2lhg7l2hilo3>;
};
export type I9iq22t0burs89 = {
    "who": MultiAddress;
    "new_free": bigint;
};
export type I5u8olqbbvfnvf = {
    "direction": BalancesAdjustmentDirection;
    "delta": bigint;
};
export type BalancesAdjustmentDirection = Enum<{
    "Increase": undefined;
    "Decrease": undefined;
}>;
export declare const BalancesAdjustmentDirection: GetEnum<BalancesAdjustmentDirection>;
export type I5utcetro501ir = {
    "value": bigint;
    "keep_alive": boolean;
};
export type Icgf8vmtkbnu4u = AnonymousEnum<{
    /**
     * Unlock any vested funds of the sender account.
     *
     * The dispatch origin for this call must be _Signed_ and the sender must have funds still
     * locked under this pallet.
     *
     * Emits either `VestingCompleted` or `VestingUpdated`.
     *
     * ## Complexity
     * - `O(1)`.
     */
    "vest": undefined;
    /**
     * Unlock any vested funds of a `target` account.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `target`: The account whose vested funds should be unlocked. Must have funds still
     * locked under this pallet.
     *
     * Emits either `VestingCompleted` or `VestingUpdated`.
     *
     * ## Complexity
     * - `O(1)`.
     */
    "vest_other": Anonymize<Id9uqtigc0il3v>;
    /**
     * Create a vested transfer.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `target`: The account receiving the vested funds.
     * - `schedule`: The vesting schedule attached to the transfer.
     *
     * Emits `VestingCreated`.
     *
     * NOTE: This will unlock all schedules through the current block.
     *
     * ## Complexity
     * - `O(1)`.
     */
    "vested_transfer": Anonymize<Iaa2o6cgjdpdn5>;
    /**
     * Force a vested transfer.
     *
     * The dispatch origin for this call must be _Root_.
     *
     * - `source`: The account whose funds should be transferred.
     * - `target`: The account that should be transferred the vested funds.
     * - `schedule`: The vesting schedule attached to the transfer.
     *
     * Emits `VestingCreated`.
     *
     * NOTE: This will unlock all schedules through the current block.
     *
     * ## Complexity
     * - `O(1)`.
     */
    "force_vested_transfer": Anonymize<Iam6hrl7ptd85l>;
    /**
     * Merge two vesting schedules together, creating a new vesting schedule that unlocks over
     * the highest possible start and end blocks. If both schedules have already started the
     * current block will be used as the schedule start; with the caveat that if one schedule
     * is finished by the current block, the other will be treated as the new merged schedule,
     * unmodified.
     *
     * NOTE: If `schedule1_index == schedule2_index` this is a no-op.
     * NOTE: This will unlock all schedules through the current block prior to merging.
     * NOTE: If both schedules have ended by the current block, no new schedule will be created
     * and both will be removed.
     *
     * Merged schedule attributes:
     * - `starting_block`: `MAX(schedule1.starting_block, scheduled2.starting_block,
     * current_block)`.
     * - `ending_block`: `MAX(schedule1.ending_block, schedule2.ending_block)`.
     * - `locked`: `schedule1.locked_at(current_block) + schedule2.locked_at(current_block)`.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `schedule1_index`: index of the first schedule to merge.
     * - `schedule2_index`: index of the second schedule to merge.
     */
    "merge_schedules": Anonymize<Ict9ivhr2c5hv0>;
    /**
     * Force remove a vesting schedule
     *
     * The dispatch origin for this call must be _Root_.
     *
     * - `target`: An account that has a vesting schedule
     * - `schedule_index`: The vesting schedule index that should be removed
     */
    "force_remove_vesting_schedule": Anonymize<I8t4vv03357lk9>;
}>;
export type Id9uqtigc0il3v = {
    "target": MultiAddress;
};
export type Iaa2o6cgjdpdn5 = {
    "target": MultiAddress;
    "schedule": Anonymize<I4aro1m78pdrtt>;
};
export type Iam6hrl7ptd85l = {
    "source": MultiAddress;
    "target": MultiAddress;
    "schedule": Anonymize<I4aro1m78pdrtt>;
};
export type Ict9ivhr2c5hv0 = {
    "schedule1_index": number;
    "schedule2_index": number;
};
export type I8t4vv03357lk9 = {
    "target": MultiAddress;
    "schedule_index": number;
};
export type Id0dj18ct09hlp = AnonymousEnum<{
    /**
     * Make a claim to collect your DOTs.
     *
     * The dispatch origin for this call must be _None_.
     *
     * Unsigned Validation:
     * A call to claim is deemed valid if the signature provided matches
     * the expected signed message of:
     *
     * > Ethereum Signed Message:
     * > (configured prefix string)(address)
     *
     * and `address` matches the `dest` account.
     *
     * Parameters:
     * - `dest`: The destination account to payout the claim.
     * - `ethereum_signature`: The signature of an ethereum signed message matching the format
     * described above.
     *
     * <weight>
     * The weight of this call is invariant over the input parameters.
     * Weight includes logic to validate unsigned `claim` call.
     *
     * Total Complexity: O(1)
     * </weight>
     */
    "claim": Anonymize<I6uag8j5aql8q>;
    /**
     * Mint a new claim to collect DOTs.
     *
     * The dispatch origin for this call must be _Root_.
     *
     * Parameters:
     * - `who`: The Ethereum address allowed to collect this claim.
     * - `value`: The number of DOTs that will be claimed.
     * - `vesting_schedule`: An optional vesting schedule for these DOTs.
     *
     * <weight>
     * The weight of this call is invariant over the input parameters.
     * We assume worst case that both vesting and statement is being inserted.
     *
     * Total Complexity: O(1)
     * </weight>
     */
    "mint_claim": Anonymize<Isq3k9rh2c0l4>;
    /**
     * Make a claim to collect your DOTs by signing a statement.
     *
     * The dispatch origin for this call must be _None_.
     *
     * Unsigned Validation:
     * A call to `claim_attest` is deemed valid if the signature provided matches
     * the expected signed message of:
     *
     * > Ethereum Signed Message:
     * > (configured prefix string)(address)(statement)
     *
     * and `address` matches the `dest` account; the `statement` must match that which is
     * expected according to your purchase arrangement.
     *
     * Parameters:
     * - `dest`: The destination account to payout the claim.
     * - `ethereum_signature`: The signature of an ethereum signed message matching the format
     * described above.
     * - `statement`: The identity of the statement which is being attested to in the
     * signature.
     *
     * <weight>
     * The weight of this call is invariant over the input parameters.
     * Weight includes logic to validate unsigned `claim_attest` call.
     *
     * Total Complexity: O(1)
     * </weight>
     */
    "claim_attest": Anonymize<I1dqiovk0tpoah>;
    /**
     * Attest to a statement, needed to finalize the claims process.
     *
     * WARNING: Insecure unless your chain includes `PrevalidateAttests` as a
     * `TransactionExtension`.
     *
     * Unsigned Validation:
     * A call to attest is deemed valid if the sender has a `Preclaim` registered
     * and provides a `statement` which is expected for the account.
     *
     * Parameters:
     * - `statement`: The identity of the statement which is being attested to in the
     * signature.
     *
     * <weight>
     * The weight of this call is invariant over the input parameters.
     * Weight includes logic to do pre-validation on `attest` call.
     *
     * Total Complexity: O(1)
     * </weight>
     */
    "attest": Anonymize<I1ntko0oih7v1a>;
    "move_claim": Anonymize<I2tf5qmg09624f>;
}>;
export type I6uag8j5aql8q = {
    "dest": SS58String;
    "ethereum_signature": SizedHex<65>;
};
export type Isq3k9rh2c0l4 = {
    "who": SizedHex<20>;
    "value": bigint;
    "vesting_schedule"?: (Anonymize<I2phecamkn3pej>) | undefined;
    "statement"?: (ClaimsStatementKind) | undefined;
};
export type I1dqiovk0tpoah = {
    "dest": SS58String;
    "ethereum_signature": SizedHex<65>;
    "statement": Uint8Array;
};
export type I1ntko0oih7v1a = {
    "statement": Uint8Array;
};
export type I2tf5qmg09624f = {
    "old": SizedHex<20>;
    "new": SizedHex<20>;
    "maybe_preclaim"?: Anonymize<Ihfphjolmsqq1>;
};
export type I9dpq5287dur8b = AnonymousEnum<{
    /**
     * Set the list of invulnerable (fixed) collators. These collators must do some
     * preparation, namely to have registered session keys.
     *
     * The call will remove any accounts that have not registered keys from the set. That is,
     * it is non-atomic; the caller accepts all `AccountId`s passed in `new` _individually_ as
     * acceptable Invulnerables, and is not proposing a _set_ of new Invulnerables.
     *
     * This call does not maintain mutual exclusivity of `Invulnerables` and `Candidates`. It
     * is recommended to use a batch of `add_invulnerable` and `remove_invulnerable` instead. A
     * `batch_all` can also be used to enforce atomicity. If any candidates are included in
     * `new`, they should be removed with `remove_invulnerable_candidate` after execution.
     *
     * Must be called by the `UpdateOrigin`.
     */
    "set_invulnerables": Anonymize<Ifccifqltb5obi>;
    /**
     * Set the ideal number of non-invulnerable collators. If lowering this number, then the
     * number of running collators could be higher than this figure. Aside from that edge case,
     * there should be no other way to have more candidates than the desired number.
     *
     * The origin for this call must be the `UpdateOrigin`.
     */
    "set_desired_candidates": Anonymize<Iadtsfv699cq8b>;
    /**
     * Set the candidacy bond amount.
     *
     * If the candidacy bond is increased by this call, all current candidates which have a
     * deposit lower than the new bond will be kicked from the list and get their deposits
     * back.
     *
     * The origin for this call must be the `UpdateOrigin`.
     */
    "set_candidacy_bond": Anonymize<Ialpmgmhr3gk5r>;
    /**
     * Register this account as a collator candidate. The account must (a) already have
     * registered session keys and (b) be able to reserve the `CandidacyBond`.
     *
     * This call is not available to `Invulnerable` collators.
     */
    "register_as_candidate": undefined;
    /**
     * Deregister `origin` as a collator candidate. Note that the collator can only leave on
     * session change. The `CandidacyBond` will be unreserved immediately.
     *
     * This call will fail if the total number of candidates would drop below
     * `MinEligibleCollators`.
     */
    "leave_intent": undefined;
    /**
     * Add a new account `who` to the list of `Invulnerables` collators. `who` must have
     * registered session keys. If `who` is a candidate, they will be removed.
     *
     * The origin for this call must be the `UpdateOrigin`.
     */
    "add_invulnerable": Anonymize<I4cbvqmqadhrea>;
    /**
     * Remove an account `who` from the list of `Invulnerables` collators. `Invulnerables` must
     * be sorted.
     *
     * The origin for this call must be the `UpdateOrigin`.
     */
    "remove_invulnerable": Anonymize<I4cbvqmqadhrea>;
    /**
     * Update the candidacy bond of collator candidate `origin` to a new amount `new_deposit`.
     *
     * Setting a `new_deposit` that is lower than the current deposit while `origin` is
     * occupying a top-`DesiredCandidates` slot is not allowed.
     *
     * This call will fail if `origin` is not a collator candidate, the updated bond is lower
     * than the minimum candidacy bond, and/or the amount cannot be reserved.
     */
    "update_bond": Anonymize<I3sdol54kg5jaq>;
    /**
     * The caller `origin` replaces a candidate `target` in the collator candidate list by
     * reserving `deposit`. The amount `deposit` reserved by the caller must be greater than
     * the existing bond of the target it is trying to replace.
     *
     * This call will fail if the caller is already a collator candidate or invulnerable, the
     * caller does not have registered session keys, the target is not a collator candidate,
     * and/or the `deposit` amount cannot be reserved.
     */
    "take_candidate_slot": Anonymize<I8fougodaj6di6>;
}>;
export type Ifccifqltb5obi = {
    "new": Anonymize<Ia2lhg7l2hilo3>;
};
export type Iadtsfv699cq8b = {
    "max": number;
};
export type Ialpmgmhr3gk5r = {
    "bond": bigint;
};
export type I3sdol54kg5jaq = {
    "new_deposit": bigint;
};
export type I8fougodaj6di6 = {
    "deposit": bigint;
    "target": SS58String;
};
export type I77dda7hps0u37 = AnonymousEnum<{
    /**
     * Sets the session key(s) of the function caller to `keys`.
     * Allows an account to set its session key prior to becoming a validator.
     * This doesn't take effect until the next session.
     *
     * The dispatch origin of this function must be signed.
     *
     * ## Complexity
     * - `O(1)`. Actual cost depends on the number of length of `T::Keys::key_ids()` which is
     * fixed.
     */
    "set_keys": Anonymize<I81vt5eq60l4b6>;
    /**
     * Removes any session key(s) of the function caller.
     *
     * This doesn't take effect until the next session.
     *
     * The dispatch origin of this function must be Signed and the account must be either be
     * convertible to a validator ID using the chain's typical addressing system (this usually
     * means being a controller account) or directly convertible into a validator ID (which
     * usually means being a stash account).
     *
     * ## Complexity
     * - `O(1)` in number of key types. Actual cost depends on the number of length of
     * `T::Keys::key_ids()` which is fixed.
     */
    "purge_keys": undefined;
}>;
export type I81vt5eq60l4b6 = {
    "keys": SizedHex<32>;
    "proof": Uint8Array;
};
export type Ib7tahn20bvsep = AnonymousEnum<{
    /**
     * Suspends all XCM executions for the XCMP queue, regardless of the sender's origin.
     *
     * - `origin`: Must pass `ControllerOrigin`.
     */
    "suspend_xcm_execution": undefined;
    /**
     * Resumes all XCM executions for the XCMP queue.
     *
     * Note that this function doesn't change the status of the in/out bound channels.
     *
     * - `origin`: Must pass `ControllerOrigin`.
     */
    "resume_xcm_execution": undefined;
    /**
     * Overwrites the number of pages which must be in the queue for the other side to be
     * told to suspend their sending.
     *
     * - `origin`: Must pass `Root`.
     * - `new`: Desired value for `QueueConfigData.suspend_value`
     */
    "update_suspend_threshold": Anonymize<I3vh014cqgmrfd>;
    /**
     * Overwrites the number of pages which must be in the queue after which we drop any
     * further messages from the channel.
     *
     * - `origin`: Must pass `Root`.
     * - `new`: Desired value for `QueueConfigData.drop_threshold`
     */
    "update_drop_threshold": Anonymize<I3vh014cqgmrfd>;
    /**
     * Overwrites the number of pages which the queue must be reduced to before it signals
     * that message sending may recommence after it has been suspended.
     *
     * - `origin`: Must pass `Root`.
     * - `new`: Desired value for `QueueConfigData.resume_threshold`
     */
    "update_resume_threshold": Anonymize<I3vh014cqgmrfd>;
}>;
export type I3vh014cqgmrfd = {
    "new": number;
};
export type I6k1inef986368 = AnonymousEnum<{
    "send": Anonymize<Ia5cotcvi888ln>;
    /**
     * Teleport some assets from the local chain to some destination chain.
     *
     * **This function is deprecated: Use `limited_teleport_assets` instead.**
     *
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
     * with all fees taken as needed from the asset.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     * relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     * generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     * fee on the `dest` chain.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     * fees.
     */
    "teleport_assets": Anonymize<I21jsa919m88fd>;
    /**
     * Transfer some assets from the local chain to the destination chain through their local,
     * destination or remote reserve.
     *
     * `assets` must have same reserve location and may not be teleportable to `dest`.
     * - `assets` have local reserve: transfer assets to sovereign account of destination
     * chain and forward a notification XCM to `dest` to mint and deposit reserve-based
     * assets to `beneficiary`.
     * - `assets` have destination reserve: burn local assets and forward a notification to
     * `dest` chain to withdraw the reserve assets from this chain's sovereign account and
     * deposit them to `beneficiary`.
     * - `assets` have remote reserve: burn local assets, forward XCM to reserve chain to move
     * reserves from this chain's SA to `dest` chain's SA, and forward another XCM to `dest`
     * to mint and deposit reserve-based assets to `beneficiary`.
     *
     * **This function is deprecated: Use `limited_reserve_transfer_assets` instead.**
     *
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
     * with all fees taken as needed from the asset.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     * relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     * generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     * fee on the `dest` (and possibly reserve) chains.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     * fees.
     */
    "reserve_transfer_assets": Anonymize<I21jsa919m88fd>;
    /**
     * Execute an XCM message from a local, signed, origin.
     *
     * An event is deposited indicating whether `msg` could be executed completely or only
     * partially.
     *
     * No more than `max_weight` will be used in its attempted execution. If this is less than
     * the maximum amount of weight that the message could take to be executed, then no
     * execution attempt will be made.
     */
    "execute": Anonymize<Iegif7m3upfe1k>;
    /**
     * Extoll that a particular destination can be communicated with through a particular
     * version of XCM.
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `location`: The destination that is being described.
     * - `xcm_version`: The latest version of XCM that `location` supports.
     */
    "force_xcm_version": Anonymize<I9kt8c221c83ln>;
    /**
     * Set a safe XCM version (the version that XCM should be encoded with if the most recent
     * version a destination can accept is unknown).
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `maybe_xcm_version`: The default XCM encoding version, or `None` to disable.
     */
    "force_default_xcm_version": Anonymize<Ic76kfh5ebqkpl>;
    /**
     * Ask a location to notify us regarding their XCM version and any changes to it.
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `location`: The location to which we should subscribe for XCM version notifications.
     */
    "force_subscribe_version_notify": Anonymize<Icscpmubum33bq>;
    /**
     * Require that a particular destination should no longer notify us regarding any XCM
     * version changes.
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `location`: The location to which we are currently subscribed for XCM version
     * notifications which we no longer desire.
     */
    "force_unsubscribe_version_notify": Anonymize<Icscpmubum33bq>;
    /**
     * Transfer some assets from the local chain to the destination chain through their local,
     * destination or remote reserve.
     *
     * `assets` must have same reserve location and may not be teleportable to `dest`.
     * - `assets` have local reserve: transfer assets to sovereign account of destination
     * chain and forward a notification XCM to `dest` to mint and deposit reserve-based
     * assets to `beneficiary`.
     * - `assets` have destination reserve: burn local assets and forward a notification to
     * `dest` chain to withdraw the reserve assets from this chain's sovereign account and
     * deposit them to `beneficiary`.
     * - `assets` have remote reserve: burn local assets, forward XCM to reserve chain to move
     * reserves from this chain's SA to `dest` chain's SA, and forward another XCM to `dest`
     * to mint and deposit reserve-based assets to `beneficiary`.
     *
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
     * is needed than `weight_limit`, then the operation will fail and the sent assets may be
     * at risk.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     * relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     * generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     * fee on the `dest` (and possibly reserve) chains.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     * fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    "limited_reserve_transfer_assets": Anonymize<I21d2olof7eb60>;
    /**
     * Teleport some assets from the local chain to some destination chain.
     *
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
     * is needed than `weight_limit`, then the operation will fail and the sent assets may be
     * at risk.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     * relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     * generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     * fee on the `dest` chain.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     * fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    "limited_teleport_assets": Anonymize<I21d2olof7eb60>;
    /**
     * Set or unset the global suspension state of the XCM executor.
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `suspended`: `true` to suspend, `false` to resume.
     */
    "force_suspension": Anonymize<Ibgm4rnf22lal1>;
    /**
     * Transfer some assets from the local chain to the destination chain through their local,
     * destination or remote reserve, or through teleports.
     *
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item` (hence referred to as `fees`), up to enough to pay for
     * `weight_limit` of weight. If more weight is needed than `weight_limit`, then the
     * operation will fail and the sent assets may be at risk.
     *
     * `assets` (excluding `fees`) must have same reserve location or otherwise be teleportable
     * to `dest`, no limitations imposed on `fees`.
     * - for local reserve: transfer assets to sovereign account of destination chain and
     * forward a notification XCM to `dest` to mint and deposit reserve-based assets to
     * `beneficiary`.
     * - for destination reserve: burn local assets and forward a notification to `dest` chain
     * to withdraw the reserve assets from this chain's sovereign account and deposit them
     * to `beneficiary`.
     * - for remote reserve: burn local assets, forward XCM to reserve chain to move reserves
     * from this chain's SA to `dest` chain's SA, and forward another XCM to `dest` to mint
     * and deposit reserve-based assets to `beneficiary`.
     * - for teleports: burn local assets and forward XCM to `dest` chain to mint/teleport
     * assets and deposit them to `beneficiary`.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `X2(Parent,
     * Parachain(..))` to send from parachain to parachain, or `X1(Parachain(..))` to send
     * from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     * generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     * fee on the `dest` (and possibly reserve) chains.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     * fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    "transfer_assets": Anonymize<I21d2olof7eb60>;
    /**
     * Claims assets trapped on this pallet because of leftover assets during XCM execution.
     *
     * - `origin`: Anyone can call this extrinsic.
     * - `assets`: The exact assets that were trapped. Use the version to specify what version
     * was the latest when they were trapped.
     * - `beneficiary`: The location/account where the claimed assets will be deposited.
     */
    "claim_assets": Anonymize<Ie68np0vpihith>;
    /**
     * Transfer assets from the local chain to the destination chain using explicit transfer
     * types for assets and fees.
     *
     * `assets` must have same reserve location or may be teleportable to `dest`. Caller must
     * provide the `assets_transfer_type` to be used for `assets`:
     * - `TransferType::LocalReserve`: transfer assets to sovereign account of destination
     * chain and forward a notification XCM to `dest` to mint and deposit reserve-based
     * assets to `beneficiary`.
     * - `TransferType::DestinationReserve`: burn local assets and forward a notification to
     * `dest` chain to withdraw the reserve assets from this chain's sovereign account and
     * deposit them to `beneficiary`.
     * - `TransferType::RemoteReserve(reserve)`: burn local assets, forward XCM to `reserve`
     * chain to move reserves from this chain's SA to `dest` chain's SA, and forward another
     * XCM to `dest` to mint and deposit reserve-based assets to `beneficiary`. Typically
     * the remote `reserve` is Asset Hub.
     * - `TransferType::Teleport`: burn local assets and forward XCM to `dest` chain to
     * mint/teleport assets and deposit them to `beneficiary`.
     *
     * On the destination chain, as well as any intermediary hops, `BuyExecution` is used to
     * buy execution using transferred `assets` identified by `remote_fees_id`.
     * Make sure enough of the specified `remote_fees_id` asset is included in the given list
     * of `assets`. `remote_fees_id` should be enough to pay for `weight_limit`. If more weight
     * is needed than `weight_limit`, then the operation will fail and the sent assets may be
     * at risk.
     *
     * `remote_fees_id` may use different transfer type than rest of `assets` and can be
     * specified through `fees_transfer_type`.
     *
     * The caller needs to specify what should happen to the transferred assets once they reach
     * the `dest` chain. This is done through the `custom_xcm_on_dest` parameter, which
     * contains the instructions to execute on `dest` as a final step.
     * This is usually as simple as:
     * `Xcm(vec![DepositAsset { assets: Wild(AllCounted(assets.len())), beneficiary }])`,
     * but could be something more exotic like sending the `assets` even further.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     * relay to parachain, or `(parents: 2, (GlobalConsensus(..), ..))` to send from
     * parachain across a bridge to another ecosystem destination.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     * fee on the `dest` (and possibly reserve) chains.
     * - `assets_transfer_type`: The XCM `TransferType` used to transfer the `assets`.
     * - `remote_fees_id`: One of the included `assets` to be used to pay fees.
     * - `fees_transfer_type`: The XCM `TransferType` used to transfer the `fees` assets.
     * - `custom_xcm_on_dest`: The XCM to be executed on `dest` chain as the last step of the
     * transfer, which also determines what happens to the assets on the destination chain.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    "transfer_assets_using_type_and_then": Anonymize<I9bnv6lu0crf1q>;
    /**
     * Authorize another `aliaser` location to alias into the local `origin` making this call.
     * The `aliaser` is only authorized until the provided `expiry` block number.
     * The call can also be used for a previously authorized alias in order to update its
     * `expiry` block number.
     *
     * Usually useful to allow your local account to be aliased into from a remote location
     * also under your control (like your account on another chain).
     *
     * WARNING: make sure the caller `origin` (you) trusts the `aliaser` location to act in
     * their/your name. Once authorized using this call, the `aliaser` can freely impersonate
     * `origin` in XCM programs executed on the local chain.
     */
    "add_authorized_alias": Anonymize<Iauhjqifrdklq7>;
    /**
     * Remove a previously authorized `aliaser` from the list of locations that can alias into
     * the local `origin` making this call.
     */
    "remove_authorized_alias": Anonymize<Ie1uso9m8rt5cf>;
    /**
     * Remove all previously authorized `aliaser`s that can alias into the local `origin`
     * making this call.
     */
    "remove_all_authorized_aliases": undefined;
}>;
export type Ia5cotcvi888ln = {
    "dest": XcmVersionedLocation;
    "message": XcmVersionedXcm;
};
export type XcmVersionedXcm = Enum<{
    "V3": Anonymize<Ianvng4e08j9ii>;
    "V4": Anonymize<Iegrepoo0c1jc5>;
    "V5": Anonymize<Ict03eedr8de9s>;
}>;
export declare const XcmVersionedXcm: GetEnum<XcmVersionedXcm>;
export type Ianvng4e08j9ii = Array<XcmV3Instruction>;
export type XcmV3Instruction = Enum<{
    "WithdrawAsset": Anonymize<Iai6dhqiq3bach>;
    "ReserveAssetDeposited": Anonymize<Iai6dhqiq3bach>;
    "ReceiveTeleportedAsset": Anonymize<Iai6dhqiq3bach>;
    "QueryResponse": {
        "query_id": bigint;
        "response": XcmV3Response;
        "max_weight": Anonymize<I4q39t5hn830vp>;
        "querier"?: Anonymize<Ia9cgf4r40b26h>;
    };
    "TransferAsset": {
        "assets": Anonymize<Iai6dhqiq3bach>;
        "beneficiary": Anonymize<I4c0s5cioidn76>;
    };
    "TransferReserveAsset": {
        "assets": Anonymize<Iai6dhqiq3bach>;
        "dest": Anonymize<I4c0s5cioidn76>;
        "xcm": Anonymize<Ianvng4e08j9ii>;
    };
    "Transact": Anonymize<I92p6l5cs3fr50>;
    "HrmpNewChannelOpenRequest": Anonymize<I5uhhrjqfuo4e5>;
    "HrmpChannelAccepted": Anonymize<Ifij4jam0o7sub>;
    "HrmpChannelClosing": Anonymize<Ieeb4svd9i8fji>;
    "ClearOrigin": undefined;
    "DescendOrigin": XcmV3Junctions;
    "ReportError": Anonymize<I4r3v6e91d1qbs>;
    "DepositAsset": {
        "assets": XcmV3MultiassetMultiAssetFilter;
        "beneficiary": Anonymize<I4c0s5cioidn76>;
    };
    "DepositReserveAsset": {
        "assets": XcmV3MultiassetMultiAssetFilter;
        "dest": Anonymize<I4c0s5cioidn76>;
        "xcm": Anonymize<Ianvng4e08j9ii>;
    };
    "ExchangeAsset": {
        "give": XcmV3MultiassetMultiAssetFilter;
        "want": Anonymize<Iai6dhqiq3bach>;
        "maximal": boolean;
    };
    "InitiateReserveWithdraw": {
        "assets": XcmV3MultiassetMultiAssetFilter;
        "reserve": Anonymize<I4c0s5cioidn76>;
        "xcm": Anonymize<Ianvng4e08j9ii>;
    };
    "InitiateTeleport": {
        "assets": XcmV3MultiassetMultiAssetFilter;
        "dest": Anonymize<I4c0s5cioidn76>;
        "xcm": Anonymize<Ianvng4e08j9ii>;
    };
    "ReportHolding": {
        "response_info": Anonymize<I4r3v6e91d1qbs>;
        "assets": XcmV3MultiassetMultiAssetFilter;
    };
    "BuyExecution": {
        "fees": Anonymize<Idcm24504c8bkk>;
        "weight_limit": XcmV3WeightLimit;
    };
    "RefundSurplus": undefined;
    "SetErrorHandler": Anonymize<Ianvng4e08j9ii>;
    "SetAppendix": Anonymize<Ianvng4e08j9ii>;
    "ClearError": undefined;
    "ClaimAsset": {
        "assets": Anonymize<Iai6dhqiq3bach>;
        "ticket": Anonymize<I4c0s5cioidn76>;
    };
    "Trap": bigint;
    "SubscribeVersion": Anonymize<Ieprdqqu7ildvr>;
    "UnsubscribeVersion": undefined;
    "BurnAsset": Anonymize<Iai6dhqiq3bach>;
    "ExpectAsset": Anonymize<Iai6dhqiq3bach>;
    "ExpectOrigin"?: Anonymize<Ia9cgf4r40b26h>;
    "ExpectError"?: Anonymize<I7sltvf8v2nure>;
    "ExpectTransactStatus": XcmV3MaybeErrorCode;
    "QueryPallet": Anonymize<Iba5bdbapp16oo>;
    "ExpectPallet": Anonymize<Id7mf37dkpgfjs>;
    "ReportTransactStatus": Anonymize<I4r3v6e91d1qbs>;
    "ClearTransactStatus": undefined;
    "UniversalOrigin": XcmV3Junction;
    "ExportMessage": {
        "network": XcmV3JunctionNetworkId;
        "destination": XcmV3Junctions;
        "xcm": Anonymize<Ianvng4e08j9ii>;
    };
    "LockAsset": {
        "asset": Anonymize<Idcm24504c8bkk>;
        "unlocker": Anonymize<I4c0s5cioidn76>;
    };
    "UnlockAsset": {
        "asset": Anonymize<Idcm24504c8bkk>;
        "target": Anonymize<I4c0s5cioidn76>;
    };
    "NoteUnlockable": {
        "asset": Anonymize<Idcm24504c8bkk>;
        "owner": Anonymize<I4c0s5cioidn76>;
    };
    "RequestUnlock": {
        "asset": Anonymize<Idcm24504c8bkk>;
        "locker": Anonymize<I4c0s5cioidn76>;
    };
    "SetFeesMode": Anonymize<I4nae9rsql8fa7>;
    "SetTopic": SizedHex<32>;
    "ClearTopic": undefined;
    "AliasOrigin": Anonymize<I4c0s5cioidn76>;
    "UnpaidExecution": Anonymize<I40d50jeai33oq>;
}>;
export declare const XcmV3Instruction: GetEnum<XcmV3Instruction>;
export type Ia9cgf4r40b26h = (Anonymize<I4c0s5cioidn76>) | undefined;
export type I92p6l5cs3fr50 = {
    "origin_kind": XcmV2OriginKind;
    "require_weight_at_most": Anonymize<I4q39t5hn830vp>;
    "call": Uint8Array;
};
export type I4r3v6e91d1qbs = {
    "destination": Anonymize<I4c0s5cioidn76>;
    "query_id": bigint;
    "max_weight": Anonymize<I4q39t5hn830vp>;
};
export type XcmV3MultiassetMultiAssetFilter = Enum<{
    "Definite": Anonymize<Iai6dhqiq3bach>;
    "Wild": XcmV3MultiassetWildMultiAsset;
}>;
export declare const XcmV3MultiassetMultiAssetFilter: GetEnum<XcmV3MultiassetMultiAssetFilter>;
export type XcmV3MultiassetWildMultiAsset = Enum<{
    "All": undefined;
    "AllOf": {
        "id": XcmV3MultiassetAssetId;
        "fun": XcmV2MultiassetWildFungibility;
    };
    "AllCounted": number;
    "AllOfCounted": {
        "id": XcmV3MultiassetAssetId;
        "fun": XcmV2MultiassetWildFungibility;
        "count": number;
    };
}>;
export declare const XcmV3MultiassetWildMultiAsset: GetEnum<XcmV3MultiassetWildMultiAsset>;
export type Iba5bdbapp16oo = {
    "module_name": Uint8Array;
    "response_info": Anonymize<I4r3v6e91d1qbs>;
};
export type I40d50jeai33oq = {
    "weight_limit": XcmV3WeightLimit;
    "check_origin"?: Anonymize<Ia9cgf4r40b26h>;
};
export type Iegrepoo0c1jc5 = Array<XcmV4Instruction>;
export type XcmV4Instruction = Enum<{
    "WithdrawAsset": Anonymize<I50mli3hb64f9b>;
    "ReserveAssetDeposited": Anonymize<I50mli3hb64f9b>;
    "ReceiveTeleportedAsset": Anonymize<I50mli3hb64f9b>;
    "QueryResponse": {
        "query_id": bigint;
        "response": XcmV4Response;
        "max_weight": Anonymize<I4q39t5hn830vp>;
        "querier"?: Anonymize<Ia9cgf4r40b26h>;
    };
    "TransferAsset": {
        "assets": Anonymize<I50mli3hb64f9b>;
        "beneficiary": Anonymize<I4c0s5cioidn76>;
    };
    "TransferReserveAsset": {
        "assets": Anonymize<I50mli3hb64f9b>;
        "dest": Anonymize<I4c0s5cioidn76>;
        "xcm": Anonymize<Iegrepoo0c1jc5>;
    };
    "Transact": Anonymize<I92p6l5cs3fr50>;
    "HrmpNewChannelOpenRequest": Anonymize<I5uhhrjqfuo4e5>;
    "HrmpChannelAccepted": Anonymize<Ifij4jam0o7sub>;
    "HrmpChannelClosing": Anonymize<Ieeb4svd9i8fji>;
    "ClearOrigin": undefined;
    "DescendOrigin": XcmV3Junctions;
    "ReportError": Anonymize<I4r3v6e91d1qbs>;
    "DepositAsset": {
        "assets": XcmV4AssetAssetFilter;
        "beneficiary": Anonymize<I4c0s5cioidn76>;
    };
    "DepositReserveAsset": {
        "assets": XcmV4AssetAssetFilter;
        "dest": Anonymize<I4c0s5cioidn76>;
        "xcm": Anonymize<Iegrepoo0c1jc5>;
    };
    "ExchangeAsset": {
        "give": XcmV4AssetAssetFilter;
        "want": Anonymize<I50mli3hb64f9b>;
        "maximal": boolean;
    };
    "InitiateReserveWithdraw": {
        "assets": XcmV4AssetAssetFilter;
        "reserve": Anonymize<I4c0s5cioidn76>;
        "xcm": Anonymize<Iegrepoo0c1jc5>;
    };
    "InitiateTeleport": {
        "assets": XcmV4AssetAssetFilter;
        "dest": Anonymize<I4c0s5cioidn76>;
        "xcm": Anonymize<Iegrepoo0c1jc5>;
    };
    "ReportHolding": {
        "response_info": Anonymize<I4r3v6e91d1qbs>;
        "assets": XcmV4AssetAssetFilter;
    };
    "BuyExecution": {
        "fees": Anonymize<Ia5l7mu5a6v49o>;
        "weight_limit": XcmV3WeightLimit;
    };
    "RefundSurplus": undefined;
    "SetErrorHandler": Anonymize<Iegrepoo0c1jc5>;
    "SetAppendix": Anonymize<Iegrepoo0c1jc5>;
    "ClearError": undefined;
    "ClaimAsset": {
        "assets": Anonymize<I50mli3hb64f9b>;
        "ticket": Anonymize<I4c0s5cioidn76>;
    };
    "Trap": bigint;
    "SubscribeVersion": Anonymize<Ieprdqqu7ildvr>;
    "UnsubscribeVersion": undefined;
    "BurnAsset": Anonymize<I50mli3hb64f9b>;
    "ExpectAsset": Anonymize<I50mli3hb64f9b>;
    "ExpectOrigin"?: Anonymize<Ia9cgf4r40b26h>;
    "ExpectError"?: Anonymize<I7sltvf8v2nure>;
    "ExpectTransactStatus": XcmV3MaybeErrorCode;
    "QueryPallet": Anonymize<Iba5bdbapp16oo>;
    "ExpectPallet": Anonymize<Id7mf37dkpgfjs>;
    "ReportTransactStatus": Anonymize<I4r3v6e91d1qbs>;
    "ClearTransactStatus": undefined;
    "UniversalOrigin": XcmV3Junction;
    "ExportMessage": {
        "network": XcmV3JunctionNetworkId;
        "destination": XcmV3Junctions;
        "xcm": Anonymize<Iegrepoo0c1jc5>;
    };
    "LockAsset": {
        "asset": Anonymize<Ia5l7mu5a6v49o>;
        "unlocker": Anonymize<I4c0s5cioidn76>;
    };
    "UnlockAsset": {
        "asset": Anonymize<Ia5l7mu5a6v49o>;
        "target": Anonymize<I4c0s5cioidn76>;
    };
    "NoteUnlockable": {
        "asset": Anonymize<Ia5l7mu5a6v49o>;
        "owner": Anonymize<I4c0s5cioidn76>;
    };
    "RequestUnlock": {
        "asset": Anonymize<Ia5l7mu5a6v49o>;
        "locker": Anonymize<I4c0s5cioidn76>;
    };
    "SetFeesMode": Anonymize<I4nae9rsql8fa7>;
    "SetTopic": SizedHex<32>;
    "ClearTopic": undefined;
    "AliasOrigin": Anonymize<I4c0s5cioidn76>;
    "UnpaidExecution": Anonymize<I40d50jeai33oq>;
}>;
export declare const XcmV4Instruction: GetEnum<XcmV4Instruction>;
export type XcmV4AssetAssetFilter = Enum<{
    "Definite": Anonymize<I50mli3hb64f9b>;
    "Wild": XcmV4AssetWildAsset;
}>;
export declare const XcmV4AssetAssetFilter: GetEnum<XcmV4AssetAssetFilter>;
export type XcmV4AssetWildAsset = Enum<{
    "All": undefined;
    "AllOf": {
        "id": Anonymize<I4c0s5cioidn76>;
        "fun": XcmV2MultiassetWildFungibility;
    };
    "AllCounted": number;
    "AllOfCounted": {
        "id": Anonymize<I4c0s5cioidn76>;
        "fun": XcmV2MultiassetWildFungibility;
        "count": number;
    };
}>;
export declare const XcmV4AssetWildAsset: GetEnum<XcmV4AssetWildAsset>;
export type I21jsa919m88fd = {
    "dest": XcmVersionedLocation;
    "beneficiary": XcmVersionedLocation;
    "assets": XcmVersionedAssets;
    "fee_asset_item": number;
};
export type Iegif7m3upfe1k = {
    "message": XcmVersionedXcm;
    "max_weight": Anonymize<I4q39t5hn830vp>;
};
export type Ic76kfh5ebqkpl = {
    "maybe_xcm_version"?: Anonymize<I4arjljr6dpflb>;
};
export type Icscpmubum33bq = {
    "location": XcmVersionedLocation;
};
export type I21d2olof7eb60 = {
    "dest": XcmVersionedLocation;
    "beneficiary": XcmVersionedLocation;
    "assets": XcmVersionedAssets;
    "fee_asset_item": number;
    "weight_limit": XcmV3WeightLimit;
};
export type Ibgm4rnf22lal1 = {
    "suspended": boolean;
};
export type Ie68np0vpihith = {
    "assets": XcmVersionedAssets;
    "beneficiary": XcmVersionedLocation;
};
export type I9bnv6lu0crf1q = {
    "dest": XcmVersionedLocation;
    "assets": XcmVersionedAssets;
    "assets_transfer_type": Enum<{
        "Teleport": undefined;
        "LocalReserve": undefined;
        "DestinationReserve": undefined;
        "RemoteReserve": XcmVersionedLocation;
    }>;
    "remote_fees_id": XcmVersionedAssetId;
    "fees_transfer_type": Enum<{
        "Teleport": undefined;
        "LocalReserve": undefined;
        "DestinationReserve": undefined;
        "RemoteReserve": XcmVersionedLocation;
    }>;
    "custom_xcm_on_dest": XcmVersionedXcm;
    "weight_limit": XcmV3WeightLimit;
};
export type Iauhjqifrdklq7 = {
    "aliaser": XcmVersionedLocation;
    "expires"?: Anonymize<I35p85j063s0il>;
};
export type Ie1uso9m8rt5cf = {
    "aliaser": XcmVersionedLocation;
};
export type I6epb28bkd5aqn = AnonymousEnum<{
    /**
     * Notification about congested bridge queue.
     */
    "report_bridge_status": Anonymize<Idlampfle3vh6q>;
}>;
export type Idlampfle3vh6q = {
    "bridge_id": SizedHex<32>;
    "is_congested": boolean;
};
export type Ic2uoe7jdksosp = AnonymousEnum<{
    /**
     * Remove a page which has no more messages remaining to be processed or is stale.
     */
    "reap_page": Anonymize<I40pqum1mu8qg3>;
    /**
     * Execute an overweight message.
     *
     * Temporary processing errors will be propagated whereas permanent errors are treated
     * as success condition.
     *
     * - `origin`: Must be `Signed`.
     * - `message_origin`: The origin from which the message to be executed arrived.
     * - `page`: The page in the queue in which the message to be executed is sitting.
     * - `index`: The index into the queue of the message to be executed.
     * - `weight_limit`: The maximum amount of weight allowed to be consumed in the execution
     * of the message.
     *
     * Benchmark complexity considerations: O(index + weight_limit).
     */
    "execute_overweight": Anonymize<I1r4c2ghbtvjuc>;
}>;
export type I40pqum1mu8qg3 = {
    "message_origin": Anonymize<Iejeo53sea6n4q>;
    "page_index": number;
};
export type I1r4c2ghbtvjuc = {
    "message_origin": Anonymize<Iejeo53sea6n4q>;
    "page": number;
    "index": number;
    "weight_limit": Anonymize<I4q39t5hn830vp>;
};
export type I15u4pbuusigel = AnonymousEnum<{
    /**
     * Set the operating mode for exporting messages to Ethereum.
     */
    "set_operating_mode": Anonymize<I9i6b1362umn1t>;
    /**
     * Initiates the registration for a Polkadot-native token as a wrapped ERC20 token on
     * Ethereum.
     * - `asset_id`: Location of the asset
     * - `metadata`: Metadata to include in the instantiated ERC20 contract on Ethereum
     *
     * All origins are allowed, however `asset_id` must be a location nested within the origin
     * consensus system.
     */
    "register_token": Anonymize<Iel0ml15497i7b>;
    /**
     * Add an additional relayer tip for a committed message identified by `message_id`.
     * The tip asset will be swapped for ether.
     */
    "add_tip": Anonymize<Icp5j0naoi9qh2>;
}>;
export type Iel0ml15497i7b = {
    "asset_id": XcmVersionedLocation;
    "metadata": {
        "name": Uint8Array;
        "symbol": Uint8Array;
        "decimals": number;
    };
    "fee_asset": Anonymize<Iffh1nc5e1mod6>;
};
export type Icp5j0naoi9qh2 = {
    "message_id": Enum<{
        "Inbound": bigint;
        "Outbound": bigint;
    }>;
    "asset": Anonymize<Iffh1nc5e1mod6>;
};
export type Iah4up83vgshcm = AnonymousEnum<{
    /**
     * Send a batch of dispatch calls.
     *
     * May be called from any origin except `None`.
     *
     * - `calls`: The calls to be dispatched from the same origin. The number of call must not
     * exceed the constant: `batched_calls_limit` (available in constant metadata).
     *
     * If origin is root then the calls are dispatched without checking origin filter. (This
     * includes bypassing `frame_system::Config::BaseCallFilter`).
     *
     * ## Complexity
     * - O(C) where C is the number of calls to be batched.
     *
     * This will return `Ok` in all circumstances. To determine the success of the batch, an
     * event is deposited. If a call failed and the batch was interrupted, then the
     * `BatchInterrupted` event is deposited, along with the number of successful calls made
     * and the error of the failed call. If all were successful, then the `BatchCompleted`
     * event is deposited.
     */
    "batch": Anonymize<I6tmhgfk8n1767>;
    /**
     * Send a call through an indexed pseudonym of the sender.
     *
     * Filter from origin are passed along. The call will be dispatched with an origin which
     * use the same filter as the origin of this call.
     *
     * NOTE: If you need to ensure that any account-based filtering is not honored (i.e.
     * because you expect `proxy` to have been used prior in the call stack and you do not want
     * the call restrictions to apply to any sub-accounts), then use `as_multi_threshold_1`
     * in the Multisig pallet instead.
     *
     * NOTE: Prior to version *12, this was called `as_limited_sub`.
     *
     * The dispatch origin for this call must be _Signed_.
     */
    "as_derivative": Anonymize<Iabqr45kt0ojpg>;
    /**
     * Send a batch of dispatch calls and atomically execute them.
     * The whole transaction will rollback and fail if any of the calls failed.
     *
     * May be called from any origin except `None`.
     *
     * - `calls`: The calls to be dispatched from the same origin. The number of call must not
     * exceed the constant: `batched_calls_limit` (available in constant metadata).
     *
     * If origin is root then the calls are dispatched without checking origin filter. (This
     * includes bypassing `frame_system::Config::BaseCallFilter`).
     *
     * ## Complexity
     * - O(C) where C is the number of calls to be batched.
     */
    "batch_all": Anonymize<I6tmhgfk8n1767>;
    /**
     * Dispatches a function call with a provided origin.
     *
     * The dispatch origin for this call must be _Root_.
     *
     * ## Complexity
     * - O(1).
     */
    "dispatch_as": Anonymize<I9jtl5i42je9s7>;
    /**
     * Send a batch of dispatch calls.
     * Unlike `batch`, it allows errors and won't interrupt.
     *
     * May be called from any origin except `None`.
     *
     * - `calls`: The calls to be dispatched from the same origin. The number of call must not
     * exceed the constant: `batched_calls_limit` (available in constant metadata).
     *
     * If origin is root then the calls are dispatch without checking origin filter. (This
     * includes bypassing `frame_system::Config::BaseCallFilter`).
     *
     * ## Complexity
     * - O(C) where C is the number of calls to be batched.
     */
    "force_batch": Anonymize<I6tmhgfk8n1767>;
    /**
     * Dispatch a function call with a specified weight.
     *
     * This function does not check the weight of the call, and instead allows the
     * Root origin to specify the weight of the call.
     *
     * The dispatch origin for this call must be _Root_.
     */
    "with_weight": Anonymize<I81cj956at2rp6>;
    /**
     * Dispatch a fallback call in the event the main call fails to execute.
     * May be called from any origin except `None`.
     *
     * This function first attempts to dispatch the `main` call.
     * If the `main` call fails, the `fallback` is attemted.
     * if the fallback is successfully dispatched, the weights of both calls
     * are accumulated and an event containing the main call error is deposited.
     *
     * In the event of a fallback failure the whole call fails
     * with the weights returned.
     *
     * - `main`: The main call to be dispatched. This is the primary action to execute.
     * - `fallback`: The fallback call to be dispatched in case the `main` call fails.
     *
     * ## Dispatch Logic
     * - If the origin is `root`, both the main and fallback calls are executed without
     * applying any origin filters.
     * - If the origin is not `root`, the origin filter is applied to both the `main` and
     * `fallback` calls.
     *
     * ## Use Case
     * - Some use cases might involve submitting a `batch` type call in either main, fallback
     * or both.
     */
    "if_else": Anonymize<I14u2uhn33si1m>;
    /**
     * Dispatches a function call with a provided origin.
     *
     * Almost the same as [`Pallet::dispatch_as`] but forwards any error of the inner call.
     *
     * The dispatch origin for this call must be _Root_.
     */
    "dispatch_as_fallible": Anonymize<I9jtl5i42je9s7>;
}>;
export type I6tmhgfk8n1767 = {
    "calls": Array<TxCallData>;
};
export type Iabqr45kt0ojpg = {
    "index": number;
    "call": TxCallData;
};
export type I9jtl5i42je9s7 = {
    "as_origin": Anonymize<I7qpv90droestd>;
    "call": TxCallData;
};
export type I81cj956at2rp6 = {
    "call": TxCallData;
    "weight": Anonymize<I4q39t5hn830vp>;
};
export type I14u2uhn33si1m = {
    "main": TxCallData;
    "fallback": TxCallData;
};
export type I81ia9f09158s0 = AnonymousEnum<{
    /**
     * Immediately dispatch a multi-signature call using a single approval from the caller.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `other_signatories`: The accounts (other than the sender) who are part of the
     * multi-signature, but do not participate in the approval process.
     * - `call`: The call to be executed.
     *
     * Result is equivalent to the dispatched result.
     *
     * ## Complexity
     * O(Z + C) where Z is the length of the call and C its execution weight.
     */
    "as_multi_threshold_1": Anonymize<Ifsm9g1hpgurkb>;
    /**
     * Register approval for a dispatch to be made from a deterministic composite account if
     * approved by a total of `threshold - 1` of `other_signatories`.
     *
     * If there are enough, then dispatch the call.
     *
     * Payment: `DepositBase` will be reserved if this is the first approval, plus
     * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
     * is cancelled.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `threshold`: The total number of approvals for this dispatch before it is executed.
     * - `other_signatories`: The accounts (other than the sender) who can approve this
     * dispatch. May not be empty.
     * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
     * not the first approval, then it must be `Some`, with the timepoint (block number and
     * transaction index) of the first approval transaction.
     * - `call`: The call to be executed.
     *
     * NOTE: Unless this is the final approval, you will generally want to use
     * `approve_as_multi` instead, since it only requires a hash of the call.
     *
     * Result is equivalent to the dispatched result if `threshold` is exactly `1`. Otherwise
     * on success, result is `Ok` and the result from the interior call, if it was executed,
     * may be found in the deposited `MultisigExecuted` event.
     *
     * ## Complexity
     * - `O(S + Z + Call)`.
     * - Up to one balance-reserve or unreserve operation.
     * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
     * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
     * - One call encode & hash, both of complexity `O(Z)` where `Z` is tx-len.
     * - One encode & hash, both of complexity `O(S)`.
     * - Up to one binary search and insert (`O(logS + S)`).
     * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
     * - One event.
     * - The weight of the `call`.
     * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
     * taken for its lifetime of `DepositBase + threshold * DepositFactor`.
     */
    "as_multi": Anonymize<I7haeg59va2bre>;
    /**
     * Register approval for a dispatch to be made from a deterministic composite account if
     * approved by a total of `threshold - 1` of `other_signatories`.
     *
     * Payment: `DepositBase` will be reserved if this is the first approval, plus
     * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
     * is cancelled.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `threshold`: The total number of approvals for this dispatch before it is executed.
     * - `other_signatories`: The accounts (other than the sender) who can approve this
     * dispatch. May not be empty.
     * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
     * not the first approval, then it must be `Some`, with the timepoint (block number and
     * transaction index) of the first approval transaction.
     * - `call_hash`: The hash of the call to be executed.
     *
     * NOTE: If this is the final approval, you will want to use `as_multi` instead.
     *
     * ## Complexity
     * - `O(S)`.
     * - Up to one balance-reserve or unreserve operation.
     * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
     * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
     * - One encode & hash, both of complexity `O(S)`.
     * - Up to one binary search and insert (`O(logS + S)`).
     * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
     * - One event.
     * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
     * taken for its lifetime of `DepositBase + threshold * DepositFactor`.
     */
    "approve_as_multi": Anonymize<Ideaemvoneh309>;
    /**
     * Cancel a pre-existing, on-going multisig transaction. Any deposit reserved previously
     * for this operation will be unreserved on success.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `threshold`: The total number of approvals for this dispatch before it is executed.
     * - `other_signatories`: The accounts (other than the sender) who can approve this
     * dispatch. May not be empty.
     * - `timepoint`: The timepoint (block number and transaction index) of the first approval
     * transaction for this dispatch.
     * - `call_hash`: The hash of the call to be executed.
     *
     * ## Complexity
     * - `O(S)`.
     * - Up to one balance-reserve or unreserve operation.
     * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
     * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
     * - One encode & hash, both of complexity `O(S)`.
     * - One event.
     * - I/O: 1 read `O(S)`, one remove.
     * - Storage: removes one item.
     */
    "cancel_as_multi": Anonymize<I3d9o9d7epp66v>;
    /**
     * Poke the deposit reserved for an existing multisig operation.
     *
     * The dispatch origin for this call must be _Signed_ and must be the original depositor of
     * the multisig operation.
     *
     * The transaction fee is waived if the deposit amount has changed.
     *
     * - `threshold`: The total number of approvals needed for this multisig.
     * - `other_signatories`: The accounts (other than the sender) who are part of the
     * multisig.
     * - `call_hash`: The hash of the call this deposit is reserved for.
     *
     * Emits `DepositPoked` if successful.
     */
    "poke_deposit": Anonymize<I6lqh1vgb4mcja>;
}>;
export type Ifsm9g1hpgurkb = {
    "other_signatories": Anonymize<Ia2lhg7l2hilo3>;
    "call": TxCallData;
};
export type I7haeg59va2bre = {
    "threshold": number;
    "other_signatories": Anonymize<Ia2lhg7l2hilo3>;
    "maybe_timepoint"?: Anonymize<I95jfd8j5cr5eh>;
    "call": TxCallData;
    "max_weight": Anonymize<I4q39t5hn830vp>;
};
export type I95jfd8j5cr5eh = (Anonymize<Itvprrpb0nm3o>) | undefined;
export type Ideaemvoneh309 = {
    "threshold": number;
    "other_signatories": Anonymize<Ia2lhg7l2hilo3>;
    "maybe_timepoint"?: Anonymize<I95jfd8j5cr5eh>;
    "call_hash": SizedHex<32>;
    "max_weight": Anonymize<I4q39t5hn830vp>;
};
export type I3d9o9d7epp66v = {
    "threshold": number;
    "other_signatories": Anonymize<Ia2lhg7l2hilo3>;
    "timepoint": Anonymize<Itvprrpb0nm3o>;
    "call_hash": SizedHex<32>;
};
export type I6lqh1vgb4mcja = {
    "threshold": number;
    "other_signatories": Anonymize<Ia2lhg7l2hilo3>;
    "call_hash": SizedHex<32>;
};
export type I5gdgqoglkja53 = AnonymousEnum<{
    /**
     * Dispatch the given `call` from an account that the sender is authorised for through
     * `add_proxy`.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `real`: The account that the proxy will make a call on behalf of.
     * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
     * - `call`: The call to be made by the `real` account.
     */
    "proxy": Anonymize<Ieob9opmhn5et3>;
    /**
     * Register a proxy account for the sender that is able to make calls on its behalf.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `proxy`: The account that the `caller` would like to make a proxy.
     * - `proxy_type`: The permissions allowed for this proxy account.
     * - `delay`: The announcement period required of the initial proxy. Will generally be
     * zero.
     */
    "add_proxy": Anonymize<I80cht592rotce>;
    /**
     * Unregister a proxy account for the sender.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `proxy`: The account that the `caller` would like to remove as a proxy.
     * - `proxy_type`: The permissions currently enabled for the removed proxy account.
     */
    "remove_proxy": Anonymize<I80cht592rotce>;
    /**
     * Unregister all proxy accounts for the sender.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * WARNING: This may be called on accounts created by `create_pure`, however if done, then
     * the unreserved fees will be inaccessible. **All access to this account will be lost.**
     */
    "remove_proxies": undefined;
    /**
     * Spawn a fresh new account that is guaranteed to be otherwise inaccessible, and
     * initialize it with a proxy of `proxy_type` for `origin` sender.
     *
     * Requires a `Signed` origin.
     *
     * - `proxy_type`: The type of the proxy that the sender will be registered as over the
     * new account. This will almost always be the most permissive `ProxyType` possible to
     * allow for maximum flexibility.
     * - `index`: A disambiguation index, in case this is called multiple times in the same
     * transaction (e.g. with `utility::batch`). Unless you're using `batch` you probably just
     * want to use `0`.
     * - `delay`: The announcement period required of the initial proxy. Will generally be
     * zero.
     *
     * Fails with `Duplicate` if this has already been called in this transaction, from the
     * same sender, with the same parameters.
     *
     * Fails if there are insufficient funds to pay for deposit.
     */
    "create_pure": Anonymize<Ibpc4kthjktuo>;
    /**
     * Removes a previously spawned pure proxy.
     *
     * WARNING: **All access to this account will be lost.** Any funds held in it will be
     * inaccessible.
     *
     * Requires a `Signed` origin, and the sender account must have been created by a call to
     * `create_pure` with corresponding parameters.
     *
     * - `spawner`: The account that originally called `create_pure` to create this account.
     * - `index`: The disambiguation index originally passed to `create_pure`. Probably `0`.
     * - `proxy_type`: The proxy type originally passed to `create_pure`.
     * - `height`: The height of the chain when the call to `create_pure` was processed.
     * - `ext_index`: The extrinsic index in which the call to `create_pure` was processed.
     *
     * Fails with `NoPermission` in case the caller is not a previously created pure
     * account whose `create_pure` call has corresponding parameters.
     */
    "kill_pure": Anonymize<I1i6grf28bv9hm>;
    /**
     * Publish the hash of a proxy-call that will be made in the future.
     *
     * This must be called some number of blocks before the corresponding `proxy` is attempted
     * if the delay associated with the proxy relationship is greater than zero.
     *
     * No more than `MaxPending` announcements may be made at any one time.
     *
     * This will take a deposit of `AnnouncementDepositFactor` as well as
     * `AnnouncementDepositBase` if there are no other pending announcements.
     *
     * The dispatch origin for this call must be _Signed_ and a proxy of `real`.
     *
     * Parameters:
     * - `real`: The account that the proxy will make a call on behalf of.
     * - `call_hash`: The hash of the call to be made by the `real` account.
     */
    "announce": Anonymize<I2eb501t8s6hsq>;
    /**
     * Remove a given announcement.
     *
     * May be called by a proxy account to remove a call they previously announced and return
     * the deposit.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `real`: The account that the proxy will make a call on behalf of.
     * - `call_hash`: The hash of the call to be made by the `real` account.
     */
    "remove_announcement": Anonymize<I2eb501t8s6hsq>;
    /**
     * Remove the given announcement of a delegate.
     *
     * May be called by a target (proxied) account to remove a call that one of their delegates
     * (`delegate`) has announced they want to execute. The deposit is returned.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `delegate`: The account that previously announced the call.
     * - `call_hash`: The hash of the call to be made.
     */
    "reject_announcement": Anonymize<Ianmuoljk2sk1u>;
    /**
     * Dispatch the given `call` from an account that the sender is authorized for through
     * `add_proxy`.
     *
     * Removes any corresponding announcement(s).
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `real`: The account that the proxy will make a call on behalf of.
     * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
     * - `call`: The call to be made by the `real` account.
     */
    "proxy_announced": Anonymize<I3nal4mj09ue7q>;
    /**
     * Poke / Adjust deposits made for proxies and announcements based on current values.
     * This can be used by accounts to possibly lower their locked amount.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * The transaction fee is waived if the deposit amount has changed.
     *
     * Emits `DepositPoked` if successful.
     */
    "poke_deposit": undefined;
}>;
export type Ieob9opmhn5et3 = {
    "real": MultiAddress;
    "force_proxy_type"?: Anonymize<Ivujr393rmtoa>;
    "call": TxCallData;
};
export type Ivujr393rmtoa = (Anonymize<Idugco9k7jdh0f>) | undefined;
export type I80cht592rotce = {
    "delegate": MultiAddress;
    "proxy_type": Anonymize<Idugco9k7jdh0f>;
    "delay": number;
};
export type Ibpc4kthjktuo = {
    "proxy_type": Anonymize<Idugco9k7jdh0f>;
    "delay": number;
    "index": number;
};
export type I1i6grf28bv9hm = {
    "spawner": MultiAddress;
    "proxy_type": Anonymize<Idugco9k7jdh0f>;
    "index": number;
    "height": number;
    "ext_index": number;
};
export type I2eb501t8s6hsq = {
    "real": MultiAddress;
    "call_hash": SizedHex<32>;
};
export type Ianmuoljk2sk1u = {
    "delegate": MultiAddress;
    "call_hash": SizedHex<32>;
};
export type I3nal4mj09ue7q = {
    "delegate": MultiAddress;
    "real": MultiAddress;
    "force_proxy_type"?: Anonymize<Ivujr393rmtoa>;
    "call": TxCallData;
};
export type I67ac6i6ihmvpt = AnonymousEnum<{
    /**
     * Assign an previously unassigned index.
     *
     * Payment: `Deposit` is reserved from the sender account.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `index`: the index to be claimed. This must not be in use.
     *
     * Emits `IndexAssigned` if successful.
     *
     * ## Complexity
     * - `O(1)`.
     */
    "claim": Anonymize<I666bl2fqjkejo>;
    /**
     * Assign an index already owned by the sender to another account. The balance reservation
     * is effectively transferred to the new account.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `index`: the index to be re-assigned. This must be owned by the sender.
     * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
     *
     * Emits `IndexAssigned` if successful.
     *
     * ## Complexity
     * - `O(1)`.
     */
    "transfer": Anonymize<I6o1er683vod1j>;
    /**
     * Free up an index owned by the sender.
     *
     * Payment: Any previous deposit placed for the index is unreserved in the sender account.
     *
     * The dispatch origin for this call must be _Signed_ and the sender must own the index.
     *
     * - `index`: the index to be freed. This must be owned by the sender.
     *
     * Emits `IndexFreed` if successful.
     *
     * ## Complexity
     * - `O(1)`.
     */
    "free": Anonymize<I666bl2fqjkejo>;
    /**
     * Force an index to an account. This doesn't require a deposit. If the index is already
     * held, then any deposit is reimbursed to its current owner.
     *
     * The dispatch origin for this call must be _Root_.
     *
     * - `index`: the index to be (re-)assigned.
     * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
     * - `freeze`: if set to `true`, will freeze the index so it cannot be transferred.
     *
     * Emits `IndexAssigned` if successful.
     *
     * ## Complexity
     * - `O(1)`.
     */
    "force_transfer": Anonymize<I5bq561t4gpfva>;
    /**
     * Freeze an index so it will always point to the sender account. This consumes the
     * deposit.
     *
     * The dispatch origin for this call must be _Signed_ and the signing account must have a
     * non-frozen account `index`.
     *
     * - `index`: the index to be frozen in place.
     *
     * Emits `IndexFrozen` if successful.
     *
     * ## Complexity
     * - `O(1)`.
     */
    "freeze": Anonymize<I666bl2fqjkejo>;
    /**
     * Poke the deposit reserved for an index.
     *
     * The dispatch origin for this call must be _Signed_ and the signing account must have a
     * non-frozen account `index`.
     *
     * The transaction fees is waived if the deposit is changed after poking/reconsideration.
     *
     * - `index`: the index whose deposit is to be poked/reconsidered.
     *
     * Emits `DepositPoked` if successful.
     */
    "poke_deposit": Anonymize<I666bl2fqjkejo>;
}>;
export type I6o1er683vod1j = {
    "new": MultiAddress;
    "index": number;
};
export type I5bq561t4gpfva = {
    "new": MultiAddress;
    "index": number;
    "freeze": boolean;
};
export type I885rd9smlqfti = AnonymousEnum<{
    /**
     * Issue a new class of fungible assets from a public origin.
     *
     * This new asset class has no assets initially and its owner is the origin.
     *
     * The origin must conform to the configured `CreateOrigin` and have sufficient funds free.
     *
     * Funds of sender are reserved by `AssetDeposit`.
     *
     * Parameters:
     * - `id`: The identifier of the new asset. This must not be currently in use to identify
     * an existing asset. If [`NextAssetId`] is set, then this must be equal to it.
     * - `admin`: The admin of this class of assets. The admin is the initial address of each
     * member of the asset class's admin team.
     * - `min_balance`: The minimum balance of this new asset that any single account must
     * have. If an account's balance is reduced below this, then it collapses to zero.
     *
     * Emits `Created` event when successful.
     *
     * Weight: `O(1)`
     */
    "create": Anonymize<Ic357tcepuvo5c>;
    /**
     * Issue a new class of fungible assets from a privileged origin.
     *
     * This new asset class has no assets initially.
     *
     * The origin must conform to `ForceOrigin`.
     *
     * Unlike `create`, no funds are reserved.
     *
     * - `id`: The identifier of the new asset. This must not be currently in use to identify
     * an existing asset. If [`NextAssetId`] is set, then this must be equal to it.
     * - `owner`: The owner of this class of assets. The owner has full superuser permissions
     * over this asset, but may later change and configure the permissions using
     * `transfer_ownership` and `set_team`.
     * - `min_balance`: The minimum balance of this new asset that any single account must
     * have. If an account's balance is reduced below this, then it collapses to zero.
     *
     * Emits `ForceCreated` event when successful.
     *
     * Weight: `O(1)`
     */
    "force_create": Anonymize<I2rnoam876ruhj>;
    /**
     * Start the process of destroying a fungible asset class.
     *
     * `start_destroy` is the first in a series of extrinsics that should be called, to allow
     * destruction of an asset class.
     *
     * The origin must conform to `ForceOrigin` or must be `Signed` by the asset's `owner`.
     *
     * - `id`: The identifier of the asset to be destroyed. This must identify an existing
     * asset.
     *
     * It will fail with either [`Error::ContainsHolds`] or [`Error::ContainsFreezes`] if
     * an account contains holds or freezes in place.
     */
    "start_destroy": Anonymize<Ic5b47dj4coa3r>;
    /**
     * Destroy all accounts associated with a given asset.
     *
     * `destroy_accounts` should only be called after `start_destroy` has been called, and the
     * asset is in a `Destroying` state.
     *
     * Due to weight restrictions, this function may need to be called multiple times to fully
     * destroy all accounts. It will destroy `RemoveItemsLimit` accounts at a time.
     *
     * - `id`: The identifier of the asset to be destroyed. This must identify an existing
     * asset.
     *
     * Each call emits the `Event::DestroyedAccounts` event.
     */
    "destroy_accounts": Anonymize<Ic5b47dj4coa3r>;
    /**
     * Destroy all approvals associated with a given asset up to the max (T::RemoveItemsLimit).
     *
     * `destroy_approvals` should only be called after `start_destroy` has been called, and the
     * asset is in a `Destroying` state.
     *
     * Due to weight restrictions, this function may need to be called multiple times to fully
     * destroy all approvals. It will destroy `RemoveItemsLimit` approvals at a time.
     *
     * - `id`: The identifier of the asset to be destroyed. This must identify an existing
     * asset.
     *
     * Each call emits the `Event::DestroyedApprovals` event.
     */
    "destroy_approvals": Anonymize<Ic5b47dj4coa3r>;
    /**
     * Complete destroying asset and unreserve currency.
     *
     * `finish_destroy` should only be called after `start_destroy` has been called, and the
     * asset is in a `Destroying` state. All accounts or approvals should be destroyed before
     * hand.
     *
     * - `id`: The identifier of the asset to be destroyed. This must identify an existing
     * asset.
     *
     * Each successful call emits the `Event::Destroyed` event.
     */
    "finish_destroy": Anonymize<Ic5b47dj4coa3r>;
    /**
     * Mint assets of a particular class.
     *
     * The origin must be Signed and the sender must be the Issuer of the asset `id`.
     *
     * - `id`: The identifier of the asset to have some amount minted.
     * - `beneficiary`: The account to be credited with the minted assets.
     * - `amount`: The amount of the asset to be minted.
     *
     * Emits `Issued` event when successful.
     *
     * Weight: `O(1)`
     * Modes: Pre-existing balance of `beneficiary`; Account pre-existence of `beneficiary`.
     */
    "mint": Anonymize<Ib3qnc19gu633c>;
    /**
     * Reduce the balance of `who` by as much as possible up to `amount` assets of `id`.
     *
     * Origin must be Signed and the sender should be the Manager of the asset `id`.
     *
     * Bails with `NoAccount` if the `who` is already dead.
     *
     * - `id`: The identifier of the asset to have some amount burned.
     * - `who`: The account to be debited from.
     * - `amount`: The maximum amount by which `who`'s balance should be reduced.
     *
     * Emits `Burned` with the actual amount burned. If this takes the balance to below the
     * minimum for the asset, then the amount burned is increased to take it to zero.
     *
     * Weight: `O(1)`
     * Modes: Post-existence of `who`; Pre & post Zombie-status of `who`.
     */
    "burn": Anonymize<Ifira6u9hi7cu1>;
    /**
     * Move some assets from the sender account to another.
     *
     * Origin must be Signed.
     *
     * - `id`: The identifier of the asset to have some amount transferred.
     * - `target`: The account to be credited.
     * - `amount`: The amount by which the sender's balance of assets should be reduced and
     * `target`'s balance increased. The amount actually transferred may be slightly greater in
     * the case that the transfer would otherwise take the sender balance above zero but below
     * the minimum balance. Must be greater than zero.
     *
     * Emits `Transferred` with the actual amount transferred. If this takes the source balance
     * to below the minimum for the asset, then the amount transferred is increased to take it
     * to zero.
     *
     * Weight: `O(1)`
     * Modes: Pre-existence of `target`; Post-existence of sender; Account pre-existence of
     * `target`.
     */
    "transfer": Anonymize<I72tqocvdoqfff>;
    /**
     * Move some assets from the sender account to another, keeping the sender account alive.
     *
     * Origin must be Signed.
     *
     * - `id`: The identifier of the asset to have some amount transferred.
     * - `target`: The account to be credited.
     * - `amount`: The amount by which the sender's balance of assets should be reduced and
     * `target`'s balance increased. The amount actually transferred may be slightly greater in
     * the case that the transfer would otherwise take the sender balance above zero but below
     * the minimum balance. Must be greater than zero.
     *
     * Emits `Transferred` with the actual amount transferred. If this takes the source balance
     * to below the minimum for the asset, then the amount transferred is increased to take it
     * to zero.
     *
     * Weight: `O(1)`
     * Modes: Pre-existence of `target`; Post-existence of sender; Account pre-existence of
     * `target`.
     */
    "transfer_keep_alive": Anonymize<I72tqocvdoqfff>;
    /**
     * Move some assets from one account to another.
     *
     * Origin must be Signed and the sender should be the Admin of the asset `id`.
     *
     * - `id`: The identifier of the asset to have some amount transferred.
     * - `source`: The account to be debited.
     * - `dest`: The account to be credited.
     * - `amount`: The amount by which the `source`'s balance of assets should be reduced and
     * `dest`'s balance increased. The amount actually transferred may be slightly greater in
     * the case that the transfer would otherwise take the `source` balance above zero but
     * below the minimum balance. Must be greater than zero.
     *
     * Emits `Transferred` with the actual amount transferred. If this takes the source balance
     * to below the minimum for the asset, then the amount transferred is increased to take it
     * to zero.
     *
     * Weight: `O(1)`
     * Modes: Pre-existence of `dest`; Post-existence of `source`; Account pre-existence of
     * `dest`.
     */
    "force_transfer": Anonymize<I2i27f3sfmvc05>;
    /**
     * Disallow further unprivileged transfers of an asset `id` from an account `who`. `who`
     * must already exist as an entry in `Account`s of the asset. If you want to freeze an
     * account that does not have an entry, use `touch_other` first.
     *
     * Origin must be Signed and the sender should be the Freezer of the asset `id`.
     *
     * - `id`: The identifier of the asset to be frozen.
     * - `who`: The account to be frozen.
     *
     * Emits `Frozen`.
     *
     * Weight: `O(1)`
     */
    "freeze": Anonymize<I1nlrtd1epki2d>;
    /**
     * Allow unprivileged transfers to and from an account again.
     *
     * Origin must be Signed and the sender should be the Admin of the asset `id`.
     *
     * - `id`: The identifier of the asset to be frozen.
     * - `who`: The account to be unfrozen.
     *
     * Emits `Thawed`.
     *
     * Weight: `O(1)`
     */
    "thaw": Anonymize<I1nlrtd1epki2d>;
    /**
     * Disallow further unprivileged transfers for the asset class.
     *
     * Origin must be Signed and the sender should be the Freezer of the asset `id`.
     *
     * - `id`: The identifier of the asset to be frozen.
     *
     * Emits `Frozen`.
     *
     * Weight: `O(1)`
     */
    "freeze_asset": Anonymize<Ic5b47dj4coa3r>;
    /**
     * Allow unprivileged transfers for the asset again.
     *
     * Origin must be Signed and the sender should be the Admin of the asset `id`.
     *
     * - `id`: The identifier of the asset to be thawed.
     *
     * Emits `Thawed`.
     *
     * Weight: `O(1)`
     */
    "thaw_asset": Anonymize<Ic5b47dj4coa3r>;
    /**
     * Change the Owner of an asset.
     *
     * Origin must be Signed and the sender should be the Owner of the asset `id`.
     *
     * - `id`: The identifier of the asset.
     * - `owner`: The new Owner of this asset.
     *
     * Emits `OwnerChanged`.
     *
     * Weight: `O(1)`
     */
    "transfer_ownership": Anonymize<I3abtumcmempjs>;
    /**
     * Change the Issuer, Admin and Freezer of an asset.
     *
     * Origin must be Signed and the sender should be the Owner of the asset `id`.
     *
     * - `id`: The identifier of the asset to be frozen.
     * - `issuer`: The new Issuer of this asset.
     * - `admin`: The new Admin of this asset.
     * - `freezer`: The new Freezer of this asset.
     *
     * Emits `TeamChanged`.
     *
     * Weight: `O(1)`
     */
    "set_team": Anonymize<Id81m8flopt8ha>;
    /**
     * Set the metadata for an asset.
     *
     * Origin must be Signed and the sender should be the Owner of the asset `id`.
     *
     * Funds of sender are reserved according to the formula:
     * `MetadataDepositBase + MetadataDepositPerByte * (name.len + symbol.len)` taking into
     * account any already reserved funds.
     *
     * - `id`: The identifier of the asset to update.
     * - `name`: The user friendly name of this asset. Limited in length by `StringLimit`.
     * - `symbol`: The exchange symbol for this asset. Limited in length by `StringLimit`.
     * - `decimals`: The number of decimals this asset uses to represent one unit.
     *
     * Emits `MetadataSet`.
     *
     * Weight: `O(1)`
     */
    "set_metadata": Anonymize<I8hff7chabggkd>;
    /**
     * Clear the metadata for an asset.
     *
     * Origin must be Signed and the sender should be the Owner of the asset `id`.
     *
     * Any deposit is freed for the asset owner.
     *
     * - `id`: The identifier of the asset to clear.
     *
     * Emits `MetadataCleared`.
     *
     * Weight: `O(1)`
     */
    "clear_metadata": Anonymize<Ic5b47dj4coa3r>;
    /**
     * Force the metadata for an asset to some value.
     *
     * Origin must be ForceOrigin.
     *
     * Any deposit is left alone.
     *
     * - `id`: The identifier of the asset to update.
     * - `name`: The user friendly name of this asset. Limited in length by `StringLimit`.
     * - `symbol`: The exchange symbol for this asset. Limited in length by `StringLimit`.
     * - `decimals`: The number of decimals this asset uses to represent one unit.
     *
     * Emits `MetadataSet`.
     *
     * Weight: `O(N + S)` where N and S are the length of the name and symbol respectively.
     */
    "force_set_metadata": Anonymize<I49i39mtj1ivbs>;
    /**
     * Clear the metadata for an asset.
     *
     * Origin must be ForceOrigin.
     *
     * Any deposit is returned.
     *
     * - `id`: The identifier of the asset to clear.
     *
     * Emits `MetadataCleared`.
     *
     * Weight: `O(1)`
     */
    "force_clear_metadata": Anonymize<Ic5b47dj4coa3r>;
    /**
     * Alter the attributes of a given asset.
     *
     * Origin must be `ForceOrigin`.
     *
     * - `id`: The identifier of the asset.
     * - `owner`: The new Owner of this asset.
     * - `issuer`: The new Issuer of this asset.
     * - `admin`: The new Admin of this asset.
     * - `freezer`: The new Freezer of this asset.
     * - `min_balance`: The minimum balance of this new asset that any single account must
     * have. If an account's balance is reduced below this, then it collapses to zero.
     * - `is_sufficient`: Whether a non-zero balance of this asset is deposit of sufficient
     * value to account for the state bloat associated with its balance storage. If set to
     * `true`, then non-zero balances may be stored without a `consumer` reference (and thus
     * an ED in the Balances pallet or whatever else is used to control user-account state
     * growth).
     * - `is_frozen`: Whether this asset class is frozen except for permissioned/admin
     * instructions.
     *
     * Emits `AssetStatusChanged` with the identity of the asset.
     *
     * Weight: `O(1)`
     */
    "force_asset_status": Anonymize<Ifkr2kcak2vto1>;
    /**
     * Approve an amount of asset for transfer by a delegated third-party account.
     *
     * Origin must be Signed.
     *
     * Ensures that `ApprovalDeposit` worth of `Currency` is reserved from signing account
     * for the purpose of holding the approval. If some non-zero amount of assets is already
     * approved from signing account to `delegate`, then it is topped up or unreserved to
     * meet the right value.
     *
     * NOTE: The signing account does not need to own `amount` of assets at the point of
     * making this call.
     *
     * - `id`: The identifier of the asset.
     * - `delegate`: The account to delegate permission to transfer asset.
     * - `amount`: The amount of asset that may be transferred by `delegate`. If there is
     * already an approval in place, then this acts additively.
     *
     * Emits `ApprovedTransfer` on success.
     *
     * Weight: `O(1)`
     */
    "approve_transfer": Anonymize<I1ju6r8q0cs9jt>;
    /**
     * Cancel all of some asset approved for delegated transfer by a third-party account.
     *
     * Origin must be Signed and there must be an approval in place between signer and
     * `delegate`.
     *
     * Unreserves any deposit previously reserved by `approve_transfer` for the approval.
     *
     * - `id`: The identifier of the asset.
     * - `delegate`: The account delegated permission to transfer asset.
     *
     * Emits `ApprovalCancelled` on success.
     *
     * Weight: `O(1)`
     */
    "cancel_approval": Anonymize<I4kpeq6j7cd5bu>;
    /**
     * Cancel all of some asset approved for delegated transfer by a third-party account.
     *
     * Origin must be either ForceOrigin or Signed origin with the signer being the Admin
     * account of the asset `id`.
     *
     * Unreserves any deposit previously reserved by `approve_transfer` for the approval.
     *
     * - `id`: The identifier of the asset.
     * - `delegate`: The account delegated permission to transfer asset.
     *
     * Emits `ApprovalCancelled` on success.
     *
     * Weight: `O(1)`
     */
    "force_cancel_approval": Anonymize<I5na1ka76k6811>;
    /**
     * Transfer some asset balance from a previously delegated account to some third-party
     * account.
     *
     * Origin must be Signed and there must be an approval in place by the `owner` to the
     * signer.
     *
     * If the entire amount approved for transfer is transferred, then any deposit previously
     * reserved by `approve_transfer` is unreserved.
     *
     * - `id`: The identifier of the asset.
     * - `owner`: The account which previously approved for a transfer of at least `amount` and
     * from which the asset balance will be withdrawn.
     * - `destination`: The account to which the asset balance of `amount` will be transferred.
     * - `amount`: The amount of assets to transfer.
     *
     * Emits `TransferredApproved` on success.
     *
     * Weight: `O(1)`
     */
    "transfer_approved": Anonymize<I59mhdb9omdqfa>;
    /**
     * Create an asset account for non-provider assets.
     *
     * A deposit will be taken from the signer account.
     *
     * - `origin`: Must be Signed; the signer account must have sufficient funds for a deposit
     * to be taken.
     * - `id`: The identifier of the asset for the account to be created.
     *
     * Emits `Touched` event when successful.
     */
    "touch": Anonymize<Ic5b47dj4coa3r>;
    /**
     * Return the deposit (if any) of an asset account or a consumer reference (if any) of an
     * account.
     *
     * The origin must be Signed.
     *
     * - `id`: The identifier of the asset for which the caller would like the deposit
     * refunded.
     * - `allow_burn`: If `true` then assets may be destroyed in order to complete the refund.
     *
     * It will fail with either [`Error::ContainsHolds`] or [`Error::ContainsFreezes`] if
     * the asset account contains holds or freezes in place.
     *
     * Emits `Refunded` event when successful.
     */
    "refund": Anonymize<I9vl5kpk0fpakt>;
    /**
     * Sets the minimum balance of an asset.
     *
     * Only works if there aren't any accounts that are holding the asset or if
     * the new value of `min_balance` is less than the old one.
     *
     * Origin must be Signed and the sender has to be the Owner of the
     * asset `id`.
     *
     * - `id`: The identifier of the asset.
     * - `min_balance`: The new value of `min_balance`.
     *
     * Emits `AssetMinBalanceChanged` event when successful.
     */
    "set_min_balance": Anonymize<I717jt61hu19b4>;
    /**
     * Create an asset account for `who`.
     *
     * A deposit will be taken from the signer account.
     *
     * - `origin`: Must be Signed; the signer account must have sufficient funds for a deposit
     * to be taken.
     * - `id`: The identifier of the asset for the account to be created, the asset status must
     * be live.
     * - `who`: The account to be created.
     *
     * Emits `Touched` event when successful.
     */
    "touch_other": Anonymize<I1nlrtd1epki2d>;
    /**
     * Return the deposit (if any) of a target asset account. Useful if you are the depositor.
     *
     * The origin must be Signed and either the account owner, depositor, or asset `Admin`. In
     * order to burn a non-zero balance of the asset, the caller must be the account and should
     * use `refund`.
     *
     * - `id`: The identifier of the asset for the account holding a deposit.
     * - `who`: The account to refund.
     *
     * It will fail with either [`Error::ContainsHolds`] or [`Error::ContainsFreezes`] if
     * the asset account contains holds or freezes in place.
     *
     * Emits `Refunded` event when successful.
     */
    "refund_other": Anonymize<I1nlrtd1epki2d>;
    /**
     * Disallow further unprivileged transfers of an asset `id` to and from an account `who`.
     *
     * Origin must be Signed and the sender should be the Freezer of the asset `id`.
     *
     * - `id`: The identifier of the account's asset.
     * - `who`: The account to be unblocked.
     *
     * Emits `Blocked`.
     *
     * Weight: `O(1)`
     */
    "block": Anonymize<I1nlrtd1epki2d>;
    /**
     * Transfer the entire transferable balance from the caller asset account.
     *
     * NOTE: This function only attempts to transfer _transferable_ balances. This means that
     * any held, frozen, or minimum balance (when `keep_alive` is `true`), will not be
     * transferred by this function. To ensure that this function results in a killed account,
     * you might need to prepare the account by removing any reference counters, storage
     * deposits, etc...
     *
     * The dispatch origin of this call must be Signed.
     *
     * - `id`: The identifier of the asset for the account holding a deposit.
     * - `dest`: The recipient of the transfer.
     * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
     * of the funds the asset account has, causing the sender asset account to be killed
     * (false), or transfer everything except at least the minimum balance, which will
     * guarantee to keep the sender asset account alive (true).
     */
    "transfer_all": Anonymize<I7f7v8192r1lmq>;
    /**
     * Sets the trusted reserve information of an asset.
     *
     * Origin must be the Owner of the asset `id`. The origin must conform to the configured
     * `CreateOrigin` or be the signed `owner` configured during asset creation.
     *
     * - `id`: The identifier of the asset.
     * - `reserves`: The full list of trusted reserves information.
     *
     * Emits `AssetMinBalanceChanged` event when successful.
     */
    "set_reserves": Anonymize<Idjrs24gh0qv5l>;
}>;
export type Ic357tcepuvo5c = {
    "id": number;
    "admin": MultiAddress;
    "min_balance": bigint;
};
export type I2rnoam876ruhj = {
    "id": number;
    "owner": MultiAddress;
    "is_sufficient": boolean;
    "min_balance": bigint;
};
export type Ib3qnc19gu633c = {
    "id": number;
    "beneficiary": MultiAddress;
    "amount": bigint;
};
export type Ifira6u9hi7cu1 = {
    "id": number;
    "who": MultiAddress;
    "amount": bigint;
};
export type I72tqocvdoqfff = {
    "id": number;
    "target": MultiAddress;
    "amount": bigint;
};
export type I2i27f3sfmvc05 = {
    "id": number;
    "source": MultiAddress;
    "dest": MultiAddress;
    "amount": bigint;
};
export type I1nlrtd1epki2d = {
    "id": number;
    "who": MultiAddress;
};
export type I3abtumcmempjs = {
    "id": number;
    "owner": MultiAddress;
};
export type Id81m8flopt8ha = {
    "id": number;
    "issuer": MultiAddress;
    "admin": MultiAddress;
    "freezer": MultiAddress;
};
export type I8hff7chabggkd = {
    "id": number;
    "name": Uint8Array;
    "symbol": Uint8Array;
    "decimals": number;
};
export type I49i39mtj1ivbs = {
    "id": number;
    "name": Uint8Array;
    "symbol": Uint8Array;
    "decimals": number;
    "is_frozen": boolean;
};
export type Ifkr2kcak2vto1 = {
    "id": number;
    "owner": MultiAddress;
    "issuer": MultiAddress;
    "admin": MultiAddress;
    "freezer": MultiAddress;
    "min_balance": bigint;
    "is_sufficient": boolean;
    "is_frozen": boolean;
};
export type I1ju6r8q0cs9jt = {
    "id": number;
    "delegate": MultiAddress;
    "amount": bigint;
};
export type I4kpeq6j7cd5bu = {
    "id": number;
    "delegate": MultiAddress;
};
export type I5na1ka76k6811 = {
    "id": number;
    "owner": MultiAddress;
    "delegate": MultiAddress;
};
export type I59mhdb9omdqfa = {
    "id": number;
    "owner": MultiAddress;
    "destination": MultiAddress;
    "amount": bigint;
};
export type I9vl5kpk0fpakt = {
    "id": number;
    "allow_burn": boolean;
};
export type I717jt61hu19b4 = {
    "id": number;
    "min_balance": bigint;
};
export type I7f7v8192r1lmq = {
    "id": number;
    "dest": MultiAddress;
    "keep_alive": boolean;
};
export type Idjrs24gh0qv5l = {
    "id": number;
    "reserves": Anonymize<I35l6p7kq19mr0>;
};
export type Icu49uv7rfej74 = AnonymousEnum<{
    /**
     * Issue a new collection of non-fungible items from a public origin.
     *
     * This new collection has no items initially and its owner is the origin.
     *
     * The origin must conform to the configured `CreateOrigin` and have sufficient funds free.
     *
     * `ItemDeposit` funds of sender are reserved.
     *
     * Parameters:
     * - `collection`: The identifier of the new collection. This must not be currently in use.
     * - `admin`: The admin of this collection. The admin is the initial address of each
     * member of the collection's admin team.
     *
     * Emits `Created` event when successful.
     *
     * Weight: `O(1)`
     */
    "create": Anonymize<If66ivi02f7256>;
    /**
     * Issue a new collection of non-fungible items from a privileged origin.
     *
     * This new collection has no items initially.
     *
     * The origin must conform to `ForceOrigin`.
     *
     * Unlike `create`, no funds are reserved.
     *
     * - `collection`: The identifier of the new item. This must not be currently in use.
     * - `owner`: The owner of this collection of items. The owner has full superuser
     * permissions
     * over this item, but may later change and configure the permissions using
     * `transfer_ownership` and `set_team`.
     *
     * Emits `ForceCreated` event when successful.
     *
     * Weight: `O(1)`
     */
    "force_create": Anonymize<I223jtcatlfkrc>;
    /**
     * Destroy a collection of fungible items.
     *
     * The origin must conform to `ForceOrigin` or must be `Signed` and the sender must be the
     * owner of the `collection`.
     *
     * - `collection`: The identifier of the collection to be destroyed.
     * - `witness`: Information on the items minted in the collection. This must be
     * correct.
     *
     * Emits `Destroyed` event when successful.
     *
     * Weight: `O(n + m)` where:
     * - `n = witness.items`
     * - `m = witness.item_metadatas`
     * - `a = witness.attributes`
     */
    "destroy": Anonymize<I223jg78mng8hq>;
    /**
     * Mint an item of a particular collection.
     *
     * The origin must be Signed and the sender must be the Issuer of the `collection`.
     *
     * - `collection`: The collection of the item to be minted.
     * - `item`: The item value of the item to be minted.
     * - `beneficiary`: The initial owner of the minted item.
     *
     * Emits `Issued` event when successful.
     *
     * Weight: `O(1)`
     */
    "mint": Anonymize<I4iiuiftkpq3fd>;
    /**
     * Destroy a single item.
     *
     * Origin must be Signed and the signing account must be either:
     * - the Admin of the `collection`;
     * - the Owner of the `item`;
     *
     * - `collection`: The collection of the item to be burned.
     * - `item`: The item of the item to be burned.
     * - `check_owner`: If `Some` then the operation will fail with `WrongOwner` unless the
     * item is owned by this value.
     *
     * Emits `Burned` with the actual amount burned.
     *
     * Weight: `O(1)`
     * Modes: `check_owner.is_some()`.
     */
    "burn": Anonymize<Ibra6533h92c0a>;
    /**
     * Move an item from the sender account to another.
     *
     * This resets the approved account of the item.
     *
     * Origin must be Signed and the signing account must be either:
     * - the Admin of the `collection`;
     * - the Owner of the `item`;
     * - the approved delegate for the `item` (in this case, the approval is reset).
     *
     * Arguments:
     * - `collection`: The collection of the item to be transferred.
     * - `item`: The item of the item to be transferred.
     * - `dest`: The account to receive ownership of the item.
     *
     * Emits `Transferred`.
     *
     * Weight: `O(1)`
     */
    "transfer": Anonymize<Ibgvkh96s68a66>;
    /**
     * Reevaluate the deposits on some items.
     *
     * Origin must be Signed and the sender should be the Owner of the `collection`.
     *
     * - `collection`: The collection to be frozen.
     * - `items`: The items of the collection whose deposits will be reevaluated.
     *
     * NOTE: This exists as a best-effort function. Any items which are unknown or
     * in the case that the owner account does not have reservable funds to pay for a
     * deposit increase are ignored. Generally the owner isn't going to call this on items
     * whose existing deposit is less than the refreshed deposit as it would only cost them,
     * so it's of little consequence.
     *
     * It will still return an error in the case that the collection is unknown of the signer
     * is not permitted to call it.
     *
     * Weight: `O(items.len())`
     */
    "redeposit": Anonymize<If9vko7pv0231m>;
    /**
     * Disallow further unprivileged transfer of an item.
     *
     * Origin must be Signed and the sender should be the Freezer of the `collection`.
     *
     * - `collection`: The collection of the item to be frozen.
     * - `item`: The item of the item to be frozen.
     *
     * Emits `Frozen`.
     *
     * Weight: `O(1)`
     */
    "freeze": Anonymize<Iafkqus0ohh6l6>;
    /**
     * Re-allow unprivileged transfer of an item.
     *
     * Origin must be Signed and the sender should be the Freezer of the `collection`.
     *
     * - `collection`: The collection of the item to be thawed.
     * - `item`: The item of the item to be thawed.
     *
     * Emits `Thawed`.
     *
     * Weight: `O(1)`
     */
    "thaw": Anonymize<Iafkqus0ohh6l6>;
    /**
     * Disallow further unprivileged transfers for a whole collection.
     *
     * Origin must be Signed and the sender should be the Freezer of the `collection`.
     *
     * - `collection`: The collection to be frozen.
     *
     * Emits `CollectionFrozen`.
     *
     * Weight: `O(1)`
     */
    "freeze_collection": Anonymize<I6cu7obfo0rr0o>;
    /**
     * Re-allow unprivileged transfers for a whole collection.
     *
     * Origin must be Signed and the sender should be the Admin of the `collection`.
     *
     * - `collection`: The collection to be thawed.
     *
     * Emits `CollectionThawed`.
     *
     * Weight: `O(1)`
     */
    "thaw_collection": Anonymize<I6cu7obfo0rr0o>;
    /**
     * Change the Owner of a collection.
     *
     * Origin must be Signed and the sender should be the Owner of the `collection`.
     *
     * - `collection`: The collection whose owner should be changed.
     * - `owner`: The new Owner of this collection. They must have called
     * `set_accept_ownership` with `collection` in order for this operation to succeed.
     *
     * Emits `OwnerChanged`.
     *
     * Weight: `O(1)`
     */
    "transfer_ownership": Anonymize<I736lv5q9m5bot>;
    /**
     * Change the Issuer, Admin and Freezer of a collection.
     *
     * Origin must be Signed and the sender should be the Owner of the `collection`.
     *
     * - `collection`: The collection whose team should be changed.
     * - `issuer`: The new Issuer of this collection.
     * - `admin`: The new Admin of this collection.
     * - `freezer`: The new Freezer of this collection.
     *
     * Emits `TeamChanged`.
     *
     * Weight: `O(1)`
     */
    "set_team": Anonymize<I1ap9tlenhr44l>;
    /**
     * Approve an item to be transferred by a delegated third-party account.
     *
     * The origin must conform to `ForceOrigin` or must be `Signed` and the sender must be
     * either the owner of the `item` or the admin of the collection.
     *
     * - `collection`: The collection of the item to be approved for delegated transfer.
     * - `item`: The item of the item to be approved for delegated transfer.
     * - `delegate`: The account to delegate permission to transfer the item.
     *
     * Important NOTE: The `approved` account gets reset after each transfer.
     *
     * Emits `ApprovedTransfer` on success.
     *
     * Weight: `O(1)`
     */
    "approve_transfer": Anonymize<Ib92t90p616grb>;
    /**
     * Cancel the prior approval for the transfer of an item by a delegate.
     *
     * Origin must be either:
     * - the `Force` origin;
     * - `Signed` with the signer being the Admin of the `collection`;
     * - `Signed` with the signer being the Owner of the `item`;
     *
     * Arguments:
     * - `collection`: The collection of the item of whose approval will be cancelled.
     * - `item`: The item of the item of whose approval will be cancelled.
     * - `maybe_check_delegate`: If `Some` will ensure that the given account is the one to
     * which permission of transfer is delegated.
     *
     * Emits `ApprovalCancelled` on success.
     *
     * Weight: `O(1)`
     */
    "cancel_approval": Anonymize<Ieipuujd6879do>;
    /**
     * Alter the attributes of a given item.
     *
     * Origin must be `ForceOrigin`.
     *
     * - `collection`: The identifier of the item.
     * - `owner`: The new Owner of this item.
     * - `issuer`: The new Issuer of this item.
     * - `admin`: The new Admin of this item.
     * - `freezer`: The new Freezer of this item.
     * - `free_holding`: Whether a deposit is taken for holding an item of this collection.
     * - `is_frozen`: Whether this collection is frozen except for permissioned/admin
     * instructions.
     *
     * Emits `ItemStatusChanged` with the identity of the item.
     *
     * Weight: `O(1)`
     */
    "force_item_status": Anonymize<Ie56eq9sg1rsoc>;
    /**
     * Set an attribute for a collection or item.
     *
     * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
     * `collection`.
     *
     * If the origin is Signed, then funds of signer are reserved according to the formula:
     * `MetadataDepositBase + DepositPerByte * (key.len + value.len)` taking into
     * account any already reserved funds.
     *
     * - `collection`: The identifier of the collection whose item's metadata to set.
     * - `maybe_item`: The identifier of the item whose metadata to set.
     * - `key`: The key of the attribute.
     * - `value`: The value to which to set the attribute.
     *
     * Emits `AttributeSet`.
     *
     * Weight: `O(1)`
     */
    "set_attribute": Anonymize<I5tvvgui05tn6e>;
    /**
     * Clear an attribute for a collection or item.
     *
     * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
     * `collection`.
     *
     * Any deposit is freed for the collection's owner.
     *
     * - `collection`: The identifier of the collection whose item's metadata to clear.
     * - `maybe_item`: The identifier of the item whose metadata to clear.
     * - `key`: The key of the attribute.
     *
     * Emits `AttributeCleared`.
     *
     * Weight: `O(1)`
     */
    "clear_attribute": Anonymize<Ibal0joadvdc2h>;
    /**
     * Set the metadata for an item.
     *
     * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
     * `collection`.
     *
     * If the origin is Signed, then funds of signer are reserved according to the formula:
     * `MetadataDepositBase + DepositPerByte * data.len` taking into
     * account any already reserved funds.
     *
     * - `collection`: The identifier of the collection whose item's metadata to set.
     * - `item`: The identifier of the item whose metadata to set.
     * - `data`: The general information of this item. Limited in length by `StringLimit`.
     * - `is_frozen`: Whether the metadata should be frozen against further changes.
     *
     * Emits `MetadataSet`.
     *
     * Weight: `O(1)`
     */
    "set_metadata": Anonymize<Iceq9fmmp9aeqv>;
    /**
     * Clear the metadata for an item.
     *
     * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
     * `item`.
     *
     * Any deposit is freed for the collection's owner.
     *
     * - `collection`: The identifier of the collection whose item's metadata to clear.
     * - `item`: The identifier of the item whose metadata to clear.
     *
     * Emits `MetadataCleared`.
     *
     * Weight: `O(1)`
     */
    "clear_metadata": Anonymize<Iafkqus0ohh6l6>;
    /**
     * Set the metadata for a collection.
     *
     * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Owner of
     * the `collection`.
     *
     * If the origin is `Signed`, then funds of signer are reserved according to the formula:
     * `MetadataDepositBase + DepositPerByte * data.len` taking into
     * account any already reserved funds.
     *
     * - `collection`: The identifier of the item whose metadata to update.
     * - `data`: The general information of this item. Limited in length by `StringLimit`.
     * - `is_frozen`: Whether the metadata should be frozen against further changes.
     *
     * Emits `CollectionMetadataSet`.
     *
     * Weight: `O(1)`
     */
    "set_collection_metadata": Anonymize<I9viqhmdtuof5e>;
    /**
     * Clear the metadata for a collection.
     *
     * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Owner of
     * the `collection`.
     *
     * Any deposit is freed for the collection's owner.
     *
     * - `collection`: The identifier of the collection whose metadata to clear.
     *
     * Emits `CollectionMetadataCleared`.
     *
     * Weight: `O(1)`
     */
    "clear_collection_metadata": Anonymize<I6cu7obfo0rr0o>;
    /**
     * Set (or reset) the acceptance of ownership for a particular account.
     *
     * Origin must be `Signed` and if `maybe_collection` is `Some`, then the signer must have a
     * provider reference.
     *
     * - `maybe_collection`: The identifier of the collection whose ownership the signer is
     * willing to accept, or if `None`, an indication that the signer is willing to accept no
     * ownership transferal.
     *
     * Emits `OwnershipAcceptanceChanged`.
     */
    "set_accept_ownership": Anonymize<Ibqooroq6rr5kr>;
    /**
     * Set the maximum amount of items a collection could have.
     *
     * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Owner of
     * the `collection`.
     *
     * Note: This function can only succeed once per collection.
     *
     * - `collection`: The identifier of the collection to change.
     * - `max_supply`: The maximum amount of items a collection could have.
     *
     * Emits `CollectionMaxSupplySet` event when successful.
     */
    "set_collection_max_supply": Anonymize<I6h88h8vba22v8>;
    /**
     * Set (or reset) the price for an item.
     *
     * Origin must be Signed and must be the owner of the asset `item`.
     *
     * - `collection`: The collection of the item.
     * - `item`: The item to set the price for.
     * - `price`: The price for the item. Pass `None`, to reset the price.
     * - `buyer`: Restricts the buy operation to a specific account.
     *
     * Emits `ItemPriceSet` on success if the price is not `None`.
     * Emits `ItemPriceRemoved` on success if the price is `None`.
     */
    "set_price": Anonymize<Ia9cd4jqb5eecb>;
    /**
     * Allows to buy an item if it's up for sale.
     *
     * Origin must be Signed and must not be the owner of the `item`.
     *
     * - `collection`: The collection of the item.
     * - `item`: The item the sender wants to buy.
     * - `bid_price`: The price the sender is willing to pay.
     *
     * Emits `ItemBought` on success.
     */
    "buy_item": Anonymize<I19jiel1ftbcce>;
}>;
export type If66ivi02f7256 = {
    "collection": number;
    "admin": MultiAddress;
};
export type I223jtcatlfkrc = {
    "collection": number;
    "owner": MultiAddress;
    "free_holding": boolean;
};
export type I223jg78mng8hq = {
    "collection": number;
    "witness": {
        "items": number;
        "item_metadatas": number;
        "attributes": number;
    };
};
export type I4iiuiftkpq3fd = {
    "collection": number;
    "item": number;
    "owner": MultiAddress;
};
export type Ibra6533h92c0a = {
    "collection": number;
    "item": number;
    "check_owner"?: Anonymize<Ia0jlc0rcbskuk>;
};
export type Ia0jlc0rcbskuk = (MultiAddress) | undefined;
export type Ibgvkh96s68a66 = {
    "collection": number;
    "item": number;
    "dest": MultiAddress;
};
export type If9vko7pv0231m = {
    "collection": number;
    "items": Anonymize<Icgljjb6j82uhn>;
};
export type I736lv5q9m5bot = {
    "collection": number;
    "new_owner": MultiAddress;
};
export type I1ap9tlenhr44l = {
    "collection": number;
    "issuer": MultiAddress;
    "admin": MultiAddress;
    "freezer": MultiAddress;
};
export type Ib92t90p616grb = {
    "collection": number;
    "item": number;
    "delegate": MultiAddress;
};
export type Ieipuujd6879do = {
    "collection": number;
    "item": number;
    "maybe_check_delegate"?: Anonymize<Ia0jlc0rcbskuk>;
};
export type Ie56eq9sg1rsoc = {
    "collection": number;
    "owner": MultiAddress;
    "issuer": MultiAddress;
    "admin": MultiAddress;
    "freezer": MultiAddress;
    "free_holding": boolean;
    "is_frozen": boolean;
};
export type Ibqooroq6rr5kr = {
    "maybe_collection"?: Anonymize<I4arjljr6dpflb>;
};
export type Ia9cd4jqb5eecb = {
    "collection": number;
    "item": number;
    "price"?: Anonymize<I35p85j063s0il>;
    "whitelisted_buyer"?: Anonymize<Ia0jlc0rcbskuk>;
};
export type I19jiel1ftbcce = {
    "collection": number;
    "item": number;
    "bid_price": bigint;
};
export type Ibbvnm4ub46ibv = AnonymousEnum<{
    /**
     * Issue a new collection of non-fungible items from a public origin.
     *
     * This new collection has no items initially and its owner is the origin.
     *
     * The origin must be Signed and the sender must have sufficient funds free.
     *
     * `CollectionDeposit` funds of sender are reserved.
     *
     * Parameters:
     * - `admin`: The admin of this collection. The admin is the initial address of each
     * member of the collection's admin team.
     *
     * Emits `Created` event when successful.
     *
     * Weight: `O(1)`
     */
    "create": Anonymize<I43aobns89nbkh>;
    /**
     * Issue a new collection of non-fungible items from a privileged origin.
     *
     * This new collection has no items initially.
     *
     * The origin must conform to `ForceOrigin`.
     *
     * Unlike `create`, no funds are reserved.
     *
     * - `owner`: The owner of this collection of items. The owner has full superuser
     * permissions over this item, but may later change and configure the permissions using
     * `transfer_ownership` and `set_team`.
     *
     * Emits `ForceCreated` event when successful.
     *
     * Weight: `O(1)`
     */
    "force_create": Anonymize<Iamd7rovec1hfb>;
    /**
     * Destroy a collection of fungible items.
     *
     * The origin must conform to `ForceOrigin` or must be `Signed` and the sender must be the
     * owner of the `collection`.
     *
     * NOTE: The collection must have 0 items to be destroyed.
     *
     * - `collection`: The identifier of the collection to be destroyed.
     * - `witness`: Information on the items minted in the collection. This must be
     * correct.
     *
     * Emits `Destroyed` event when successful.
     *
     * Weight: `O(m + c + a)` where:
     * - `m = witness.item_metadatas`
     * - `c = witness.item_configs`
     * - `a = witness.attributes`
     */
    "destroy": Anonymize<I77ie723ncd4co>;
    /**
     * Mint an item of a particular collection.
     *
     * The origin must be Signed and the sender must comply with the `mint_settings` rules.
     *
     * - `collection`: The collection of the item to be minted.
     * - `item`: An identifier of the new item.
     * - `mint_to`: Account into which the item will be minted.
     * - `witness_data`: When the mint type is `HolderOf(collection_id)`, then the owned
     * item_id from that collection needs to be provided within the witness data object. If
     * the mint price is set, then it should be additionally confirmed in the `witness_data`.
     *
     * Note: the deposit will be taken from the `origin` and not the `owner` of the `item`.
     *
     * Emits `Issued` event when successful.
     *
     * Weight: `O(1)`
     */
    "mint": Anonymize<Ieebloeahma3ke>;
    /**
     * Mint an item of a particular collection from a privileged origin.
     *
     * The origin must conform to `ForceOrigin` or must be `Signed` and the sender must be the
     * Issuer of the `collection`.
     *
     * - `collection`: The collection of the item to be minted.
     * - `item`: An identifier of the new item.
     * - `mint_to`: Account into which the item will be minted.
     * - `item_config`: A config of the new item.
     *
     * Emits `Issued` event when successful.
     *
     * Weight: `O(1)`
     */
    "force_mint": Anonymize<I4mbtpf4pu3rec>;
    /**
     * Destroy a single item.
     *
     * The origin must conform to `ForceOrigin` or must be Signed and the signing account must
     * be the owner of the `item`.
     *
     * - `collection`: The collection of the item to be burned.
     * - `item`: The item to be burned.
     *
     * Emits `Burned`.
     *
     * Weight: `O(1)`
     */
    "burn": Anonymize<Iafkqus0ohh6l6>;
    /**
     * Move an item from the sender account to another.
     *
     * Origin must be Signed and the signing account must be either:
     * - the Owner of the `item`;
     * - the approved delegate for the `item` (in this case, the approval is reset).
     *
     * Arguments:
     * - `collection`: The collection of the item to be transferred.
     * - `item`: The item to be transferred.
     * - `dest`: The account to receive ownership of the item.
     *
     * Emits `Transferred`.
     *
     * Weight: `O(1)`
     */
    "transfer": Anonymize<Ibgvkh96s68a66>;
    /**
     * Re-evaluate the deposits on some items.
     *
     * Origin must be Signed and the sender should be the Owner of the `collection`.
     *
     * - `collection`: The collection of the items to be reevaluated.
     * - `items`: The items of the collection whose deposits will be reevaluated.
     *
     * NOTE: This exists as a best-effort function. Any items which are unknown or
     * in the case that the owner account does not have reservable funds to pay for a
     * deposit increase are ignored. Generally the owner isn't going to call this on items
     * whose existing deposit is less than the refreshed deposit as it would only cost them,
     * so it's of little consequence.
     *
     * It will still return an error in the case that the collection is unknown or the signer
     * is not permitted to call it.
     *
     * Weight: `O(items.len())`
     */
    "redeposit": Anonymize<If9vko7pv0231m>;
    /**
     * Disallow further unprivileged transfer of an item.
     *
     * Origin must be Signed and the sender should be the Freezer of the `collection`.
     *
     * - `collection`: The collection of the item to be changed.
     * - `item`: The item to become non-transferable.
     *
     * Emits `ItemTransferLocked`.
     *
     * Weight: `O(1)`
     */
    "lock_item_transfer": Anonymize<Iafkqus0ohh6l6>;
    /**
     * Re-allow unprivileged transfer of an item.
     *
     * Origin must be Signed and the sender should be the Freezer of the `collection`.
     *
     * - `collection`: The collection of the item to be changed.
     * - `item`: The item to become transferable.
     *
     * Emits `ItemTransferUnlocked`.
     *
     * Weight: `O(1)`
     */
    "unlock_item_transfer": Anonymize<Iafkqus0ohh6l6>;
    /**
     * Disallows specified settings for the whole collection.
     *
     * Origin must be Signed and the sender should be the Owner of the `collection`.
     *
     * - `collection`: The collection to be locked.
     * - `lock_settings`: The settings to be locked.
     *
     * Note: it's possible to only lock(set) the setting, but not to unset it.
     *
     * Emits `CollectionLocked`.
     *
     * Weight: `O(1)`
     */
    "lock_collection": Anonymize<I1ahf3pvgsgbu>;
    /**
     * Change the Owner of a collection.
     *
     * Origin must be Signed and the sender should be the Owner of the `collection`.
     *
     * - `collection`: The collection whose owner should be changed.
     * - `owner`: The new Owner of this collection. They must have called
     * `set_accept_ownership` with `collection` in order for this operation to succeed.
     *
     * Emits `OwnerChanged`.
     *
     * Weight: `O(1)`
     */
    "transfer_ownership": Anonymize<I736lv5q9m5bot>;
    /**
     * Change the Issuer, Admin and Freezer of a collection.
     *
     * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
     * `collection`.
     *
     * Note: by setting the role to `None` only the `ForceOrigin` will be able to change it
     * after to `Some(account)`.
     *
     * - `collection`: The collection whose team should be changed.
     * - `issuer`: The new Issuer of this collection.
     * - `admin`: The new Admin of this collection.
     * - `freezer`: The new Freezer of this collection.
     *
     * Emits `TeamChanged`.
     *
     * Weight: `O(1)`
     */
    "set_team": Anonymize<I9uapdn16emsti>;
    /**
     * Change the Owner of a collection.
     *
     * Origin must be `ForceOrigin`.
     *
     * - `collection`: The identifier of the collection.
     * - `owner`: The new Owner of this collection.
     *
     * Emits `OwnerChanged`.
     *
     * Weight: `O(1)`
     */
    "force_collection_owner": Anonymize<Ie5i0q2glmr0md>;
    /**
     * Change the config of a collection.
     *
     * Origin must be `ForceOrigin`.
     *
     * - `collection`: The identifier of the collection.
     * - `config`: The new config of this collection.
     *
     * Emits `CollectionConfigChanged`.
     *
     * Weight: `O(1)`
     */
    "force_collection_config": Anonymize<I97qcg6i3l8gee>;
    /**
     * Approve an item to be transferred by a delegated third-party account.
     *
     * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
     * `item`.
     *
     * - `collection`: The collection of the item to be approved for delegated transfer.
     * - `item`: The item to be approved for delegated transfer.
     * - `delegate`: The account to delegate permission to transfer the item.
     * - `maybe_deadline`: Optional deadline for the approval. Specified by providing the
     * number of blocks after which the approval will expire
     *
     * Emits `TransferApproved` on success.
     *
     * Weight: `O(1)`
     */
    "approve_transfer": Anonymize<Ib5udrahak005b>;
    /**
     * Cancel one of the transfer approvals for a specific item.
     *
     * Origin must be either:
     * - the `Force` origin;
     * - `Signed` with the signer being the Owner of the `item`;
     *
     * Arguments:
     * - `collection`: The collection of the item of whose approval will be cancelled.
     * - `item`: The item of the collection of whose approval will be cancelled.
     * - `delegate`: The account that is going to loose their approval.
     *
     * Emits `ApprovalCancelled` on success.
     *
     * Weight: `O(1)`
     */
    "cancel_approval": Anonymize<Ib92t90p616grb>;
    /**
     * Cancel all the approvals of a specific item.
     *
     * Origin must be either:
     * - the `Force` origin;
     * - `Signed` with the signer being the Owner of the `item`;
     *
     * Arguments:
     * - `collection`: The collection of the item of whose approvals will be cleared.
     * - `item`: The item of the collection of whose approvals will be cleared.
     *
     * Emits `AllApprovalsCancelled` on success.
     *
     * Weight: `O(1)`
     */
    "clear_all_transfer_approvals": Anonymize<Iafkqus0ohh6l6>;
    /**
     * Disallows changing the metadata or attributes of the item.
     *
     * Origin must be either `ForceOrigin` or Signed and the sender should be the Admin
     * of the `collection`.
     *
     * - `collection`: The collection if the `item`.
     * - `item`: An item to be locked.
     * - `lock_metadata`: Specifies whether the metadata should be locked.
     * - `lock_attributes`: Specifies whether the attributes in the `CollectionOwner` namespace
     * should be locked.
     *
     * Note: `lock_attributes` affects the attributes in the `CollectionOwner` namespace only.
     * When the metadata or attributes are locked, it won't be possible the unlock them.
     *
     * Emits `ItemPropertiesLocked`.
     *
     * Weight: `O(1)`
     */
    "lock_item_properties": Anonymize<I1jj31tn29ie3c>;
    /**
     * Set an attribute for a collection or item.
     *
     * Origin must be Signed and must conform to the namespace ruleset:
     * - `CollectionOwner` namespace could be modified by the `collection` Admin only;
     * - `ItemOwner` namespace could be modified by the `maybe_item` owner only. `maybe_item`
     * should be set in that case;
     * - `Account(AccountId)` namespace could be modified only when the `origin` was given a
     * permission to do so;
     *
     * The funds of `origin` are reserved according to the formula:
     * `AttributeDepositBase + DepositPerByte * (key.len + value.len)` taking into
     * account any already reserved funds.
     *
     * - `collection`: The identifier of the collection whose item's metadata to set.
     * - `maybe_item`: The identifier of the item whose metadata to set.
     * - `namespace`: Attribute's namespace.
     * - `key`: The key of the attribute.
     * - `value`: The value to which to set the attribute.
     *
     * Emits `AttributeSet`.
     *
     * Weight: `O(1)`
     */
    "set_attribute": Anonymize<I5llu6o6a0go5i>;
    /**
     * Force-set an attribute for a collection or item.
     *
     * Origin must be `ForceOrigin`.
     *
     * If the attribute already exists and it was set by another account, the deposit
     * will be returned to the previous owner.
     *
     * - `set_as`: An optional owner of the attribute.
     * - `collection`: The identifier of the collection whose item's metadata to set.
     * - `maybe_item`: The identifier of the item whose metadata to set.
     * - `namespace`: Attribute's namespace.
     * - `key`: The key of the attribute.
     * - `value`: The value to which to set the attribute.
     *
     * Emits `AttributeSet`.
     *
     * Weight: `O(1)`
     */
    "force_set_attribute": Anonymize<Ic8b8561e6t9ie>;
    /**
     * Clear an attribute for a collection or item.
     *
     * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
     * attribute.
     *
     * Any deposit is freed for the collection's owner.
     *
     * - `collection`: The identifier of the collection whose item's metadata to clear.
     * - `maybe_item`: The identifier of the item whose metadata to clear.
     * - `namespace`: Attribute's namespace.
     * - `key`: The key of the attribute.
     *
     * Emits `AttributeCleared`.
     *
     * Weight: `O(1)`
     */
    "clear_attribute": Anonymize<I93r2effh7od84>;
    /**
     * Approve item's attributes to be changed by a delegated third-party account.
     *
     * Origin must be Signed and must be an owner of the `item`.
     *
     * - `collection`: A collection of the item.
     * - `item`: The item that holds attributes.
     * - `delegate`: The account to delegate permission to change attributes of the item.
     *
     * Emits `ItemAttributesApprovalAdded` on success.
     */
    "approve_item_attributes": Anonymize<Ib92t90p616grb>;
    /**
     * Cancel the previously provided approval to change item's attributes.
     * All the previously set attributes by the `delegate` will be removed.
     *
     * Origin must be Signed and must be an owner of the `item`.
     *
     * - `collection`: Collection that the item is contained within.
     * - `item`: The item that holds attributes.
     * - `delegate`: The previously approved account to remove.
     *
     * Emits `ItemAttributesApprovalRemoved` on success.
     */
    "cancel_item_attributes_approval": Anonymize<I6afd7fllr8otc>;
    /**
     * Set the metadata for an item.
     *
     * Origin must be either `ForceOrigin` or Signed and the sender should be the Admin of the
     * `collection`.
     *
     * If the origin is Signed, then funds of signer are reserved according to the formula:
     * `MetadataDepositBase + DepositPerByte * data.len` taking into
     * account any already reserved funds.
     *
     * - `collection`: The identifier of the collection whose item's metadata to set.
     * - `item`: The identifier of the item whose metadata to set.
     * - `data`: The general information of this item. Limited in length by `StringLimit`.
     *
     * Emits `ItemMetadataSet`.
     *
     * Weight: `O(1)`
     */
    "set_metadata": Anonymize<Icrkms46uh8tpb>;
    /**
     * Clear the metadata for an item.
     *
     * Origin must be either `ForceOrigin` or Signed and the sender should be the Admin of the
     * `collection`.
     *
     * Any deposit is freed for the collection's owner.
     *
     * - `collection`: The identifier of the collection whose item's metadata to clear.
     * - `item`: The identifier of the item whose metadata to clear.
     *
     * Emits `ItemMetadataCleared`.
     *
     * Weight: `O(1)`
     */
    "clear_metadata": Anonymize<Iafkqus0ohh6l6>;
    /**
     * Set the metadata for a collection.
     *
     * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Admin of
     * the `collection`.
     *
     * If the origin is `Signed`, then funds of signer are reserved according to the formula:
     * `MetadataDepositBase + DepositPerByte * data.len` taking into
     * account any already reserved funds.
     *
     * - `collection`: The identifier of the item whose metadata to update.
     * - `data`: The general information of this item. Limited in length by `StringLimit`.
     *
     * Emits `CollectionMetadataSet`.
     *
     * Weight: `O(1)`
     */
    "set_collection_metadata": Anonymize<I78u60nqh0etah>;
    /**
     * Clear the metadata for a collection.
     *
     * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Admin of
     * the `collection`.
     *
     * Any deposit is freed for the collection's owner.
     *
     * - `collection`: The identifier of the collection whose metadata to clear.
     *
     * Emits `CollectionMetadataCleared`.
     *
     * Weight: `O(1)`
     */
    "clear_collection_metadata": Anonymize<I6cu7obfo0rr0o>;
    /**
     * Set (or reset) the acceptance of ownership for a particular account.
     *
     * Origin must be `Signed` and if `maybe_collection` is `Some`, then the signer must have a
     * provider reference.
     *
     * - `maybe_collection`: The identifier of the collection whose ownership the signer is
     * willing to accept, or if `None`, an indication that the signer is willing to accept no
     * ownership transferal.
     *
     * Emits `OwnershipAcceptanceChanged`.
     */
    "set_accept_ownership": Anonymize<Ibqooroq6rr5kr>;
    /**
     * Set the maximum number of items a collection could have.
     *
     * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Owner of
     * the `collection`.
     *
     * - `collection`: The identifier of the collection to change.
     * - `max_supply`: The maximum number of items a collection could have.
     *
     * Emits `CollectionMaxSupplySet` event when successful.
     */
    "set_collection_max_supply": Anonymize<I6h88h8vba22v8>;
    /**
     * Update mint settings.
     *
     * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Issuer
     * of the `collection`.
     *
     * - `collection`: The identifier of the collection to change.
     * - `mint_settings`: The new mint settings.
     *
     * Emits `CollectionMintSettingsUpdated` event when successful.
     */
    "update_mint_settings": Anonymize<I1lso3vlgherue>;
    /**
     * Set (or reset) the price for an item.
     *
     * Origin must be Signed and must be the owner of the `item`.
     *
     * - `collection`: The collection of the item.
     * - `item`: The item to set the price for.
     * - `price`: The price for the item. Pass `None`, to reset the price.
     * - `buyer`: Restricts the buy operation to a specific account.
     *
     * Emits `ItemPriceSet` on success if the price is not `None`.
     * Emits `ItemPriceRemoved` on success if the price is `None`.
     */
    "set_price": Anonymize<Ia9cd4jqb5eecb>;
    /**
     * Allows to buy an item if it's up for sale.
     *
     * Origin must be Signed and must not be the owner of the `item`.
     *
     * - `collection`: The collection of the item.
     * - `item`: The item the sender wants to buy.
     * - `bid_price`: The price the sender is willing to pay.
     *
     * Emits `ItemBought` on success.
     */
    "buy_item": Anonymize<I19jiel1ftbcce>;
    /**
     * Allows to pay the tips.
     *
     * Origin must be Signed.
     *
     * - `tips`: Tips array.
     *
     * Emits `TipSent` on every tip transfer.
     */
    "pay_tips": Anonymize<I26c8p47106toa>;
    /**
     * Register a new atomic swap, declaring an intention to send an `item` in exchange for
     * `desired_item` from origin to target on the current blockchain.
     * The target can execute the swap during the specified `duration` of blocks (if set).
     * Additionally, the price could be set for the desired `item`.
     *
     * Origin must be Signed and must be an owner of the `item`.
     *
     * - `collection`: The collection of the item.
     * - `item`: The item an owner wants to give.
     * - `desired_collection`: The collection of the desired item.
     * - `desired_item`: The desired item an owner wants to receive.
     * - `maybe_price`: The price an owner is willing to pay or receive for the desired `item`.
     * - `duration`: A deadline for the swap. Specified by providing the number of blocks
     * after which the swap will expire.
     *
     * Emits `SwapCreated` on success.
     */
    "create_swap": Anonymize<Iq82b3qvf20ne>;
    /**
     * Cancel an atomic swap.
     *
     * Origin must be Signed.
     * Origin must be an owner of the `item` if the deadline hasn't expired.
     *
     * - `collection`: The collection of the item.
     * - `item`: The item an owner wants to give.
     *
     * Emits `SwapCancelled` on success.
     */
    "cancel_swap": Anonymize<Ic3j8ku6mbsms4>;
    /**
     * Claim an atomic swap.
     * This method executes a pending swap, that was created by a counterpart before.
     *
     * Origin must be Signed and must be an owner of the `item`.
     *
     * - `send_collection`: The collection of the item to be sent.
     * - `send_item`: The item to be sent.
     * - `receive_collection`: The collection of the item to be received.
     * - `receive_item`: The item to be received.
     * - `witness_price`: A price that was previously agreed on.
     *
     * Emits `SwapClaimed` on success.
     */
    "claim_swap": Anonymize<I3nvoqsi8f05ph>;
    /**
     * Mint an item by providing the pre-signed approval.
     *
     * Origin must be Signed.
     *
     * - `mint_data`: The pre-signed approval that consists of the information about the item,
     * its metadata, attributes, who can mint it (`None` for anyone) and until what block
     * number.
     * - `signature`: The signature of the `data` object.
     * - `signer`: The `data` object's signer. Should be an Issuer of the collection.
     *
     * Emits `Issued` on success.
     * Emits `AttributeSet` if the attributes were provided.
     * Emits `ItemMetadataSet` if the metadata was not empty.
     */
    "mint_pre_signed": Anonymize<I4dr6q8duftm2l>;
    /**
     * Set attributes for an item by providing the pre-signed approval.
     *
     * Origin must be Signed and must be an owner of the `data.item`.
     *
     * - `data`: The pre-signed approval that consists of the information about the item,
     * attributes to update and until what block number.
     * - `signature`: The signature of the `data` object.
     * - `signer`: The `data` object's signer. Should be an Admin of the collection for the
     * `CollectionOwner` namespace.
     *
     * Emits `AttributeSet` for each provided attribute.
     * Emits `ItemAttributesApprovalAdded` if the approval wasn't set before.
     * Emits `PreSignedAttributesSet` on success.
     */
    "set_attributes_pre_signed": Anonymize<I4da75oqso1rqj>;
}>;
export type I43aobns89nbkh = {
    "admin": MultiAddress;
    "config": Anonymize<I72ndo6phms8ik>;
};
export type Iamd7rovec1hfb = {
    "owner": MultiAddress;
    "config": Anonymize<I72ndo6phms8ik>;
};
export type I77ie723ncd4co = {
    "collection": number;
    "witness": {
        "item_metadatas": number;
        "item_configs": number;
        "attributes": number;
    };
};
export type Ieebloeahma3ke = {
    "collection": number;
    "item": number;
    "mint_to": MultiAddress;
    "witness_data"?: ({
        "owned_item"?: Anonymize<I4arjljr6dpflb>;
        "mint_price"?: Anonymize<I35p85j063s0il>;
    }) | undefined;
};
export type I4mbtpf4pu3rec = {
    "collection": number;
    "item": number;
    "mint_to": MultiAddress;
    "item_config": bigint;
};
export type I1ahf3pvgsgbu = {
    "collection": number;
    "lock_settings": bigint;
};
export type I9uapdn16emsti = {
    "collection": number;
    "issuer"?: Anonymize<Ia0jlc0rcbskuk>;
    "admin"?: Anonymize<Ia0jlc0rcbskuk>;
    "freezer"?: Anonymize<Ia0jlc0rcbskuk>;
};
export type Ie5i0q2glmr0md = {
    "collection": number;
    "owner": MultiAddress;
};
export type I97qcg6i3l8gee = {
    "collection": number;
    "config": Anonymize<I72ndo6phms8ik>;
};
export type Ib5udrahak005b = {
    "collection": number;
    "item": number;
    "delegate": MultiAddress;
    "maybe_deadline"?: Anonymize<I4arjljr6dpflb>;
};
export type Ic8b8561e6t9ie = {
    "set_as"?: Anonymize<Ihfphjolmsqq1>;
    "collection": number;
    "maybe_item"?: Anonymize<I4arjljr6dpflb>;
    "namespace": Anonymize<If3jjadhmug6qc>;
    "key": Uint8Array;
    "value": Uint8Array;
};
export type I6afd7fllr8otc = {
    "collection": number;
    "item": number;
    "delegate": MultiAddress;
    "witness": number;
};
export type I1lso3vlgherue = {
    "collection": number;
    "mint_settings": Anonymize<Ia3s8qquibn97v>;
};
export type I26c8p47106toa = {
    "tips": Array<{
        "collection": number;
        "item": number;
        "receiver": SS58String;
        "amount": bigint;
    }>;
};
export type Iq82b3qvf20ne = {
    "offered_collection": number;
    "offered_item": number;
    "desired_collection": number;
    "maybe_desired_item"?: Anonymize<I4arjljr6dpflb>;
    "maybe_price"?: Anonymize<I6oogc1jbmmi81>;
    "duration": number;
};
export type Ic3j8ku6mbsms4 = {
    "offered_collection": number;
    "offered_item": number;
};
export type I3nvoqsi8f05ph = {
    "send_collection": number;
    "send_item": number;
    "receive_collection": number;
    "receive_item": number;
    "witness_price"?: Anonymize<I6oogc1jbmmi81>;
};
export type I4dr6q8duftm2l = {
    "mint_data": {
        "collection": number;
        "item": number;
        "attributes": Anonymize<I6pi5ou8r1hblk>;
        "metadata": Uint8Array;
        "only_account"?: Anonymize<Ihfphjolmsqq1>;
        "deadline": number;
        "mint_price"?: Anonymize<I35p85j063s0il>;
    };
    "signature": Anonymize<I3fo6882e5tjh8>;
    "signer": SS58String;
};
export type I3fo6882e5tjh8 = AnonymousEnum<{
    "Ed25519": SizedHex<64>;
    "Sr25519": SizedHex<64>;
    "Ecdsa": SizedHex<65>;
    "Eth": SizedHex<65>;
}>;
export type I4da75oqso1rqj = {
    "data": {
        "collection": number;
        "item": number;
        "attributes": Anonymize<I6pi5ou8r1hblk>;
        "namespace": Anonymize<If3jjadhmug6qc>;
        "deadline": number;
    };
    "signature": Anonymize<I3fo6882e5tjh8>;
    "signer": SS58String;
};
export type Iu9seb88fh81e = AnonymousEnum<{
    /**
     * Issue a new class of fungible assets from a public origin.
     *
     * This new asset class has no assets initially and its owner is the origin.
     *
     * The origin must conform to the configured `CreateOrigin` and have sufficient funds free.
     *
     * Funds of sender are reserved by `AssetDeposit`.
     *
     * Parameters:
     * - `id`: The identifier of the new asset. This must not be currently in use to identify
     * an existing asset. If [`NextAssetId`] is set, then this must be equal to it.
     * - `admin`: The admin of this class of assets. The admin is the initial address of each
     * member of the asset class's admin team.
     * - `min_balance`: The minimum balance of this new asset that any single account must
     * have. If an account's balance is reduced below this, then it collapses to zero.
     *
     * Emits `Created` event when successful.
     *
     * Weight: `O(1)`
     */
    "create": Anonymize<I7t2thek61ghou>;
    /**
     * Issue a new class of fungible assets from a privileged origin.
     *
     * This new asset class has no assets initially.
     *
     * The origin must conform to `ForceOrigin`.
     *
     * Unlike `create`, no funds are reserved.
     *
     * - `id`: The identifier of the new asset. This must not be currently in use to identify
     * an existing asset. If [`NextAssetId`] is set, then this must be equal to it.
     * - `owner`: The owner of this class of assets. The owner has full superuser permissions
     * over this asset, but may later change and configure the permissions using
     * `transfer_ownership` and `set_team`.
     * - `min_balance`: The minimum balance of this new asset that any single account must
     * have. If an account's balance is reduced below this, then it collapses to zero.
     *
     * Emits `ForceCreated` event when successful.
     *
     * Weight: `O(1)`
     */
    "force_create": Anonymize<I61tdrsafr1vf3>;
    /**
     * Start the process of destroying a fungible asset class.
     *
     * `start_destroy` is the first in a series of extrinsics that should be called, to allow
     * destruction of an asset class.
     *
     * The origin must conform to `ForceOrigin` or must be `Signed` by the asset's `owner`.
     *
     * - `id`: The identifier of the asset to be destroyed. This must identify an existing
     * asset.
     *
     * It will fail with either [`Error::ContainsHolds`] or [`Error::ContainsFreezes`] if
     * an account contains holds or freezes in place.
     */
    "start_destroy": Anonymize<Ibsk5g3rhm45pu>;
    /**
     * Destroy all accounts associated with a given asset.
     *
     * `destroy_accounts` should only be called after `start_destroy` has been called, and the
     * asset is in a `Destroying` state.
     *
     * Due to weight restrictions, this function may need to be called multiple times to fully
     * destroy all accounts. It will destroy `RemoveItemsLimit` accounts at a time.
     *
     * - `id`: The identifier of the asset to be destroyed. This must identify an existing
     * asset.
     *
     * Each call emits the `Event::DestroyedAccounts` event.
     */
    "destroy_accounts": Anonymize<Ibsk5g3rhm45pu>;
    /**
     * Destroy all approvals associated with a given asset up to the max (T::RemoveItemsLimit).
     *
     * `destroy_approvals` should only be called after `start_destroy` has been called, and the
     * asset is in a `Destroying` state.
     *
     * Due to weight restrictions, this function may need to be called multiple times to fully
     * destroy all approvals. It will destroy `RemoveItemsLimit` approvals at a time.
     *
     * - `id`: The identifier of the asset to be destroyed. This must identify an existing
     * asset.
     *
     * Each call emits the `Event::DestroyedApprovals` event.
     */
    "destroy_approvals": Anonymize<Ibsk5g3rhm45pu>;
    /**
     * Complete destroying asset and unreserve currency.
     *
     * `finish_destroy` should only be called after `start_destroy` has been called, and the
     * asset is in a `Destroying` state. All accounts or approvals should be destroyed before
     * hand.
     *
     * - `id`: The identifier of the asset to be destroyed. This must identify an existing
     * asset.
     *
     * Each successful call emits the `Event::Destroyed` event.
     */
    "finish_destroy": Anonymize<Ibsk5g3rhm45pu>;
    /**
     * Mint assets of a particular class.
     *
     * The origin must be Signed and the sender must be the Issuer of the asset `id`.
     *
     * - `id`: The identifier of the asset to have some amount minted.
     * - `beneficiary`: The account to be credited with the minted assets.
     * - `amount`: The amount of the asset to be minted.
     *
     * Emits `Issued` event when successful.
     *
     * Weight: `O(1)`
     * Modes: Pre-existing balance of `beneficiary`; Account pre-existence of `beneficiary`.
     */
    "mint": Anonymize<Icfoe9q8d4vs8f>;
    /**
     * Reduce the balance of `who` by as much as possible up to `amount` assets of `id`.
     *
     * Origin must be Signed and the sender should be the Manager of the asset `id`.
     *
     * Bails with `NoAccount` if the `who` is already dead.
     *
     * - `id`: The identifier of the asset to have some amount burned.
     * - `who`: The account to be debited from.
     * - `amount`: The maximum amount by which `who`'s balance should be reduced.
     *
     * Emits `Burned` with the actual amount burned. If this takes the balance to below the
     * minimum for the asset, then the amount burned is increased to take it to zero.
     *
     * Weight: `O(1)`
     * Modes: Post-existence of `who`; Pre & post Zombie-status of `who`.
     */
    "burn": Anonymize<Ibrfmvjrg4trnb>;
    /**
     * Move some assets from the sender account to another.
     *
     * Origin must be Signed.
     *
     * - `id`: The identifier of the asset to have some amount transferred.
     * - `target`: The account to be credited.
     * - `amount`: The amount by which the sender's balance of assets should be reduced and
     * `target`'s balance increased. The amount actually transferred may be slightly greater in
     * the case that the transfer would otherwise take the sender balance above zero but below
     * the minimum balance. Must be greater than zero.
     *
     * Emits `Transferred` with the actual amount transferred. If this takes the source balance
     * to below the minimum for the asset, then the amount transferred is increased to take it
     * to zero.
     *
     * Weight: `O(1)`
     * Modes: Pre-existence of `target`; Post-existence of sender; Account pre-existence of
     * `target`.
     */
    "transfer": Anonymize<Iedih7t34maii9>;
    /**
     * Move some assets from the sender account to another, keeping the sender account alive.
     *
     * Origin must be Signed.
     *
     * - `id`: The identifier of the asset to have some amount transferred.
     * - `target`: The account to be credited.
     * - `amount`: The amount by which the sender's balance of assets should be reduced and
     * `target`'s balance increased. The amount actually transferred may be slightly greater in
     * the case that the transfer would otherwise take the sender balance above zero but below
     * the minimum balance. Must be greater than zero.
     *
     * Emits `Transferred` with the actual amount transferred. If this takes the source balance
     * to below the minimum for the asset, then the amount transferred is increased to take it
     * to zero.
     *
     * Weight: `O(1)`
     * Modes: Pre-existence of `target`; Post-existence of sender; Account pre-existence of
     * `target`.
     */
    "transfer_keep_alive": Anonymize<Iedih7t34maii9>;
    /**
     * Move some assets from one account to another.
     *
     * Origin must be Signed and the sender should be the Admin of the asset `id`.
     *
     * - `id`: The identifier of the asset to have some amount transferred.
     * - `source`: The account to be debited.
     * - `dest`: The account to be credited.
     * - `amount`: The amount by which the `source`'s balance of assets should be reduced and
     * `dest`'s balance increased. The amount actually transferred may be slightly greater in
     * the case that the transfer would otherwise take the `source` balance above zero but
     * below the minimum balance. Must be greater than zero.
     *
     * Emits `Transferred` with the actual amount transferred. If this takes the source balance
     * to below the minimum for the asset, then the amount transferred is increased to take it
     * to zero.
     *
     * Weight: `O(1)`
     * Modes: Pre-existence of `dest`; Post-existence of `source`; Account pre-existence of
     * `dest`.
     */
    "force_transfer": Anonymize<I4e902qbfel1f1>;
    /**
     * Disallow further unprivileged transfers of an asset `id` from an account `who`. `who`
     * must already exist as an entry in `Account`s of the asset. If you want to freeze an
     * account that does not have an entry, use `touch_other` first.
     *
     * Origin must be Signed and the sender should be the Freezer of the asset `id`.
     *
     * - `id`: The identifier of the asset to be frozen.
     * - `who`: The account to be frozen.
     *
     * Emits `Frozen`.
     *
     * Weight: `O(1)`
     */
    "freeze": Anonymize<Ie4met0joi8sv0>;
    /**
     * Allow unprivileged transfers to and from an account again.
     *
     * Origin must be Signed and the sender should be the Admin of the asset `id`.
     *
     * - `id`: The identifier of the asset to be frozen.
     * - `who`: The account to be unfrozen.
     *
     * Emits `Thawed`.
     *
     * Weight: `O(1)`
     */
    "thaw": Anonymize<Ie4met0joi8sv0>;
    /**
     * Disallow further unprivileged transfers for the asset class.
     *
     * Origin must be Signed and the sender should be the Freezer of the asset `id`.
     *
     * - `id`: The identifier of the asset to be frozen.
     *
     * Emits `Frozen`.
     *
     * Weight: `O(1)`
     */
    "freeze_asset": Anonymize<Ibsk5g3rhm45pu>;
    /**
     * Allow unprivileged transfers for the asset again.
     *
     * Origin must be Signed and the sender should be the Admin of the asset `id`.
     *
     * - `id`: The identifier of the asset to be thawed.
     *
     * Emits `Thawed`.
     *
     * Weight: `O(1)`
     */
    "thaw_asset": Anonymize<Ibsk5g3rhm45pu>;
    /**
     * Change the Owner of an asset.
     *
     * Origin must be Signed and the sender should be the Owner of the asset `id`.
     *
     * - `id`: The identifier of the asset.
     * - `owner`: The new Owner of this asset.
     *
     * Emits `OwnerChanged`.
     *
     * Weight: `O(1)`
     */
    "transfer_ownership": Anonymize<I1t8vq6a06ohhu>;
    /**
     * Change the Issuer, Admin and Freezer of an asset.
     *
     * Origin must be Signed and the sender should be the Owner of the asset `id`.
     *
     * - `id`: The identifier of the asset to be frozen.
     * - `issuer`: The new Issuer of this asset.
     * - `admin`: The new Admin of this asset.
     * - `freezer`: The new Freezer of this asset.
     *
     * Emits `TeamChanged`.
     *
     * Weight: `O(1)`
     */
    "set_team": Anonymize<Icvt3pdunbinm7>;
    /**
     * Set the metadata for an asset.
     *
     * Origin must be Signed and the sender should be the Owner of the asset `id`.
     *
     * Funds of sender are reserved according to the formula:
     * `MetadataDepositBase + MetadataDepositPerByte * (name.len + symbol.len)` taking into
     * account any already reserved funds.
     *
     * - `id`: The identifier of the asset to update.
     * - `name`: The user friendly name of this asset. Limited in length by `StringLimit`.
     * - `symbol`: The exchange symbol for this asset. Limited in length by `StringLimit`.
     * - `decimals`: The number of decimals this asset uses to represent one unit.
     *
     * Emits `MetadataSet`.
     *
     * Weight: `O(1)`
     */
    "set_metadata": Anonymize<I9ui3n41balr2q>;
    /**
     * Clear the metadata for an asset.
     *
     * Origin must be Signed and the sender should be the Owner of the asset `id`.
     *
     * Any deposit is freed for the asset owner.
     *
     * - `id`: The identifier of the asset to clear.
     *
     * Emits `MetadataCleared`.
     *
     * Weight: `O(1)`
     */
    "clear_metadata": Anonymize<Ibsk5g3rhm45pu>;
    /**
     * Force the metadata for an asset to some value.
     *
     * Origin must be ForceOrigin.
     *
     * Any deposit is left alone.
     *
     * - `id`: The identifier of the asset to update.
     * - `name`: The user friendly name of this asset. Limited in length by `StringLimit`.
     * - `symbol`: The exchange symbol for this asset. Limited in length by `StringLimit`.
     * - `decimals`: The number of decimals this asset uses to represent one unit.
     *
     * Emits `MetadataSet`.
     *
     * Weight: `O(N + S)` where N and S are the length of the name and symbol respectively.
     */
    "force_set_metadata": Anonymize<I89sl7btgl24g2>;
    /**
     * Clear the metadata for an asset.
     *
     * Origin must be ForceOrigin.
     *
     * Any deposit is returned.
     *
     * - `id`: The identifier of the asset to clear.
     *
     * Emits `MetadataCleared`.
     *
     * Weight: `O(1)`
     */
    "force_clear_metadata": Anonymize<Ibsk5g3rhm45pu>;
    /**
     * Alter the attributes of a given asset.
     *
     * Origin must be `ForceOrigin`.
     *
     * - `id`: The identifier of the asset.
     * - `owner`: The new Owner of this asset.
     * - `issuer`: The new Issuer of this asset.
     * - `admin`: The new Admin of this asset.
     * - `freezer`: The new Freezer of this asset.
     * - `min_balance`: The minimum balance of this new asset that any single account must
     * have. If an account's balance is reduced below this, then it collapses to zero.
     * - `is_sufficient`: Whether a non-zero balance of this asset is deposit of sufficient
     * value to account for the state bloat associated with its balance storage. If set to
     * `true`, then non-zero balances may be stored without a `consumer` reference (and thus
     * an ED in the Balances pallet or whatever else is used to control user-account state
     * growth).
     * - `is_frozen`: Whether this asset class is frozen except for permissioned/admin
     * instructions.
     *
     * Emits `AssetStatusChanged` with the identity of the asset.
     *
     * Weight: `O(1)`
     */
    "force_asset_status": Anonymize<I3u6g26k9kn96u>;
    /**
     * Approve an amount of asset for transfer by a delegated third-party account.
     *
     * Origin must be Signed.
     *
     * Ensures that `ApprovalDeposit` worth of `Currency` is reserved from signing account
     * for the purpose of holding the approval. If some non-zero amount of assets is already
     * approved from signing account to `delegate`, then it is topped up or unreserved to
     * meet the right value.
     *
     * NOTE: The signing account does not need to own `amount` of assets at the point of
     * making this call.
     *
     * - `id`: The identifier of the asset.
     * - `delegate`: The account to delegate permission to transfer asset.
     * - `amount`: The amount of asset that may be transferred by `delegate`. If there is
     * already an approval in place, then this acts additively.
     *
     * Emits `ApprovedTransfer` on success.
     *
     * Weight: `O(1)`
     */
    "approve_transfer": Anonymize<If1invp94rsjms>;
    /**
     * Cancel all of some asset approved for delegated transfer by a third-party account.
     *
     * Origin must be Signed and there must be an approval in place between signer and
     * `delegate`.
     *
     * Unreserves any deposit previously reserved by `approve_transfer` for the approval.
     *
     * - `id`: The identifier of the asset.
     * - `delegate`: The account delegated permission to transfer asset.
     *
     * Emits `ApprovalCancelled` on success.
     *
     * Weight: `O(1)`
     */
    "cancel_approval": Anonymize<Ie5nc19gtiv5sv>;
    /**
     * Cancel all of some asset approved for delegated transfer by a third-party account.
     *
     * Origin must be either ForceOrigin or Signed origin with the signer being the Admin
     * account of the asset `id`.
     *
     * Unreserves any deposit previously reserved by `approve_transfer` for the approval.
     *
     * - `id`: The identifier of the asset.
     * - `delegate`: The account delegated permission to transfer asset.
     *
     * Emits `ApprovalCancelled` on success.
     *
     * Weight: `O(1)`
     */
    "force_cancel_approval": Anonymize<Iald3dgvt1hjkb>;
    /**
     * Transfer some asset balance from a previously delegated account to some third-party
     * account.
     *
     * Origin must be Signed and there must be an approval in place by the `owner` to the
     * signer.
     *
     * If the entire amount approved for transfer is transferred, then any deposit previously
     * reserved by `approve_transfer` is unreserved.
     *
     * - `id`: The identifier of the asset.
     * - `owner`: The account which previously approved for a transfer of at least `amount` and
     * from which the asset balance will be withdrawn.
     * - `destination`: The account to which the asset balance of `amount` will be transferred.
     * - `amount`: The amount of assets to transfer.
     *
     * Emits `TransferredApproved` on success.
     *
     * Weight: `O(1)`
     */
    "transfer_approved": Anonymize<Iurrhahet4gno>;
    /**
     * Create an asset account for non-provider assets.
     *
     * A deposit will be taken from the signer account.
     *
     * - `origin`: Must be Signed; the signer account must have sufficient funds for a deposit
     * to be taken.
     * - `id`: The identifier of the asset for the account to be created.
     *
     * Emits `Touched` event when successful.
     */
    "touch": Anonymize<Ibsk5g3rhm45pu>;
    /**
     * Return the deposit (if any) of an asset account or a consumer reference (if any) of an
     * account.
     *
     * The origin must be Signed.
     *
     * - `id`: The identifier of the asset for which the caller would like the deposit
     * refunded.
     * - `allow_burn`: If `true` then assets may be destroyed in order to complete the refund.
     *
     * It will fail with either [`Error::ContainsHolds`] or [`Error::ContainsFreezes`] if
     * the asset account contains holds or freezes in place.
     *
     * Emits `Refunded` event when successful.
     */
    "refund": Anonymize<I5tamv2nk8bj8o>;
    /**
     * Sets the minimum balance of an asset.
     *
     * Only works if there aren't any accounts that are holding the asset or if
     * the new value of `min_balance` is less than the old one.
     *
     * Origin must be Signed and the sender has to be the Owner of the
     * asset `id`.
     *
     * - `id`: The identifier of the asset.
     * - `min_balance`: The new value of `min_balance`.
     *
     * Emits `AssetMinBalanceChanged` event when successful.
     */
    "set_min_balance": Anonymize<I8apq8e7c7qcpp>;
    /**
     * Create an asset account for `who`.
     *
     * A deposit will be taken from the signer account.
     *
     * - `origin`: Must be Signed; the signer account must have sufficient funds for a deposit
     * to be taken.
     * - `id`: The identifier of the asset for the account to be created, the asset status must
     * be live.
     * - `who`: The account to be created.
     *
     * Emits `Touched` event when successful.
     */
    "touch_other": Anonymize<Ie4met0joi8sv0>;
    /**
     * Return the deposit (if any) of a target asset account. Useful if you are the depositor.
     *
     * The origin must be Signed and either the account owner, depositor, or asset `Admin`. In
     * order to burn a non-zero balance of the asset, the caller must be the account and should
     * use `refund`.
     *
     * - `id`: The identifier of the asset for the account holding a deposit.
     * - `who`: The account to refund.
     *
     * It will fail with either [`Error::ContainsHolds`] or [`Error::ContainsFreezes`] if
     * the asset account contains holds or freezes in place.
     *
     * Emits `Refunded` event when successful.
     */
    "refund_other": Anonymize<Ie4met0joi8sv0>;
    /**
     * Disallow further unprivileged transfers of an asset `id` to and from an account `who`.
     *
     * Origin must be Signed and the sender should be the Freezer of the asset `id`.
     *
     * - `id`: The identifier of the account's asset.
     * - `who`: The account to be unblocked.
     *
     * Emits `Blocked`.
     *
     * Weight: `O(1)`
     */
    "block": Anonymize<Ie4met0joi8sv0>;
    /**
     * Transfer the entire transferable balance from the caller asset account.
     *
     * NOTE: This function only attempts to transfer _transferable_ balances. This means that
     * any held, frozen, or minimum balance (when `keep_alive` is `true`), will not be
     * transferred by this function. To ensure that this function results in a killed account,
     * you might need to prepare the account by removing any reference counters, storage
     * deposits, etc...
     *
     * The dispatch origin of this call must be Signed.
     *
     * - `id`: The identifier of the asset for the account holding a deposit.
     * - `dest`: The recipient of the transfer.
     * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
     * of the funds the asset account has, causing the sender asset account to be killed
     * (false), or transfer everything except at least the minimum balance, which will
     * guarantee to keep the sender asset account alive (true).
     */
    "transfer_all": Anonymize<Id1e31ij0c35fv>;
    /**
     * Sets the trusted reserve information of an asset.
     *
     * Origin must be the Owner of the asset `id`. The origin must conform to the configured
     * `CreateOrigin` or be the signed `owner` configured during asset creation.
     *
     * - `id`: The identifier of the asset.
     * - `reserves`: The full list of trusted reserves information.
     *
     * Emits `AssetMinBalanceChanged` event when successful.
     */
    "set_reserves": Anonymize<Ic6vatc0h2tbq8>;
}>;
export type I7t2thek61ghou = {
    "id": Anonymize<If9iqq7i64mur8>;
    "admin": MultiAddress;
    "min_balance": bigint;
};
export type I61tdrsafr1vf3 = {
    "id": Anonymize<If9iqq7i64mur8>;
    "owner": MultiAddress;
    "is_sufficient": boolean;
    "min_balance": bigint;
};
export type Ibsk5g3rhm45pu = {
    "id": Anonymize<If9iqq7i64mur8>;
};
export type Icfoe9q8d4vs8f = {
    "id": Anonymize<If9iqq7i64mur8>;
    "beneficiary": MultiAddress;
    "amount": bigint;
};
export type Ibrfmvjrg4trnb = {
    "id": Anonymize<If9iqq7i64mur8>;
    "who": MultiAddress;
    "amount": bigint;
};
export type Iedih7t34maii9 = {
    "id": Anonymize<If9iqq7i64mur8>;
    "target": MultiAddress;
    "amount": bigint;
};
export type I4e902qbfel1f1 = {
    "id": Anonymize<If9iqq7i64mur8>;
    "source": MultiAddress;
    "dest": MultiAddress;
    "amount": bigint;
};
export type Ie4met0joi8sv0 = {
    "id": Anonymize<If9iqq7i64mur8>;
    "who": MultiAddress;
};
export type I1t8vq6a06ohhu = {
    "id": Anonymize<If9iqq7i64mur8>;
    "owner": MultiAddress;
};
export type Icvt3pdunbinm7 = {
    "id": Anonymize<If9iqq7i64mur8>;
    "issuer": MultiAddress;
    "admin": MultiAddress;
    "freezer": MultiAddress;
};
export type I9ui3n41balr2q = {
    "id": Anonymize<If9iqq7i64mur8>;
    "name": Uint8Array;
    "symbol": Uint8Array;
    "decimals": number;
};
export type I89sl7btgl24g2 = {
    "id": Anonymize<If9iqq7i64mur8>;
    "name": Uint8Array;
    "symbol": Uint8Array;
    "decimals": number;
    "is_frozen": boolean;
};
export type I3u6g26k9kn96u = {
    "id": Anonymize<If9iqq7i64mur8>;
    "owner": MultiAddress;
    "issuer": MultiAddress;
    "admin": MultiAddress;
    "freezer": MultiAddress;
    "min_balance": bigint;
    "is_sufficient": boolean;
    "is_frozen": boolean;
};
export type If1invp94rsjms = {
    "id": Anonymize<If9iqq7i64mur8>;
    "delegate": MultiAddress;
    "amount": bigint;
};
export type Ie5nc19gtiv5sv = {
    "id": Anonymize<If9iqq7i64mur8>;
    "delegate": MultiAddress;
};
export type Iald3dgvt1hjkb = {
    "id": Anonymize<If9iqq7i64mur8>;
    "owner": MultiAddress;
    "delegate": MultiAddress;
};
export type Iurrhahet4gno = {
    "id": Anonymize<If9iqq7i64mur8>;
    "owner": MultiAddress;
    "destination": MultiAddress;
    "amount": bigint;
};
export type I5tamv2nk8bj8o = {
    "id": Anonymize<If9iqq7i64mur8>;
    "allow_burn": boolean;
};
export type I8apq8e7c7qcpp = {
    "id": Anonymize<If9iqq7i64mur8>;
    "min_balance": bigint;
};
export type Id1e31ij0c35fv = {
    "id": Anonymize<If9iqq7i64mur8>;
    "dest": MultiAddress;
    "keep_alive": boolean;
};
export type Ic6vatc0h2tbq8 = {
    "id": Anonymize<If9iqq7i64mur8>;
    "reserves": Anonymize<If2801grpltbp8>;
};
export type Ia06pia7pbkurh = AnonymousEnum<{
    /**
     * Creates an empty liquidity pool and an associated new `lp_token` asset
     * (the id of which is returned in the `Event::PoolCreated` event).
     *
     * Once a pool is created, someone may [`Pallet::add_liquidity`] to it.
     */
    "create_pool": Anonymize<I3ip09dj7i1e8n>;
    /**
     * Provide liquidity into the pool of `asset1` and `asset2`.
     * NOTE: an optimal amount of asset1 and asset2 will be calculated and
     * might be different than the provided `amount1_desired`/`amount2_desired`
     * thus you should provide the min amount you're happy to provide.
     * Params `amount1_min`/`amount2_min` represent that.
     * `mint_to` will be sent the liquidity tokens that represent this share of the pool.
     *
     * NOTE: when encountering an incorrect exchange rate and non-withdrawable pool liquidity,
     * batch an atomic call with [`Pallet::add_liquidity`] and
     * [`Pallet::swap_exact_tokens_for_tokens`] or [`Pallet::swap_tokens_for_exact_tokens`]
     * calls to render the liquidity withdrawable and rectify the exchange rate.
     *
     * Once liquidity is added, someone may successfully call
     * [`Pallet::swap_exact_tokens_for_tokens`].
     */
    "add_liquidity": Anonymize<Ide34bfv94bvut>;
    /**
     * Allows you to remove liquidity by providing the `lp_token_burn` tokens that will be
     * burned in the process. With the usage of `amount1_min_receive`/`amount2_min_receive`
     * it's possible to control the min amount of returned tokens you're happy with.
     */
    "remove_liquidity": Anonymize<I6c7mabde89bp>;
    /**
     * Swap the exact amount of `asset1` into `asset2`.
     * `amount_out_min` param allows you to specify the min amount of the `asset2`
     * you're happy to receive.
     *
     * [`AssetConversionApi::quote_price_exact_tokens_for_tokens`] runtime call can be called
     * for a quote.
     */
    "swap_exact_tokens_for_tokens": Anonymize<I9sbpodgd8ilku>;
    /**
     * Swap any amount of `asset1` to get the exact amount of `asset2`.
     * `amount_in_max` param allows to specify the max amount of the `asset1`
     * you're happy to provide.
     *
     * [`AssetConversionApi::quote_price_tokens_for_exact_tokens`] runtime call can be called
     * for a quote.
     */
    "swap_tokens_for_exact_tokens": Anonymize<Ialnqi1f4kpb>;
    /**
     * Touch an existing pool to fulfill prerequisites before providing liquidity, such as
     * ensuring that the pool's accounts are in place. It is typically useful when a pool
     * creator removes the pool's accounts and does not provide a liquidity. This action may
     * involve holding assets from the caller as a deposit for creating the pool's accounts.
     *
     * The origin must be Signed.
     *
     * - `asset1`: The asset ID of an existing pool with a pair (asset1, asset2).
     * - `asset2`: The asset ID of an existing pool with a pair (asset1, asset2).
     *
     * Emits `Touched` event when successful.
     */
    "touch": Anonymize<I3ip09dj7i1e8n>;
}>;
export type I3ip09dj7i1e8n = {
    "asset1": Anonymize<If9iqq7i64mur8>;
    "asset2": Anonymize<If9iqq7i64mur8>;
};
export type Ide34bfv94bvut = {
    "asset1": Anonymize<If9iqq7i64mur8>;
    "asset2": Anonymize<If9iqq7i64mur8>;
    "amount1_desired": bigint;
    "amount2_desired": bigint;
    "amount1_min": bigint;
    "amount2_min": bigint;
    "mint_to": SS58String;
};
export type I6c7mabde89bp = {
    "asset1": Anonymize<If9iqq7i64mur8>;
    "asset2": Anonymize<If9iqq7i64mur8>;
    "lp_token_burn": bigint;
    "amount1_min_receive": bigint;
    "amount2_min_receive": bigint;
    "withdraw_to": SS58String;
};
export type I9sbpodgd8ilku = {
    "path": Anonymize<I40r0k8147eovg>;
    "amount_in": bigint;
    "amount_out_min": bigint;
    "send_to": SS58String;
    "keep_alive": boolean;
};
export type I40r0k8147eovg = Array<Anonymize<If9iqq7i64mur8>>;
export type Ialnqi1f4kpb = {
    "path": Anonymize<I40r0k8147eovg>;
    "amount_out": bigint;
    "amount_in_max": bigint;
    "send_to": SS58String;
    "keep_alive": boolean;
};
export type Iepn86nr1kqtu0 = AnonymousEnum<{
    /**
     * Propose and approve a spend of treasury funds.
     *
     * ## Dispatch Origin
     *
     * Must be [`Config::SpendOrigin`] with the `Success` value being at least `amount`.
     *
     * ### Details
     * NOTE: For record-keeping purposes, the proposer is deemed to be equivalent to the
     * beneficiary.
     *
     * ### Parameters
     * - `amount`: The amount to be transferred from the treasury to the `beneficiary`.
     * - `beneficiary`: The destination account for the transfer.
     *
     * ## Events
     *
     * Emits [`Event::SpendApproved`] if successful.
     */
    "spend_local": Anonymize<Icnrv1mfbd3in1>;
    /**
     * Force a previously approved proposal to be removed from the approval queue.
     *
     * ## Dispatch Origin
     *
     * Must be [`Config::RejectOrigin`].
     *
     * ## Details
     *
     * The original deposit will no longer be returned.
     *
     * ### Parameters
     * - `proposal_id`: The index of a proposal
     *
     * ### Complexity
     * - O(A) where `A` is the number of approvals
     *
     * ### Errors
     * - [`Error::ProposalNotApproved`]: The `proposal_id` supplied was not found in the
     * approval queue, i.e., the proposal has not been approved. This could also mean the
     * proposal does not exist altogether, thus there is no way it would have been approved
     * in the first place.
     */
    "remove_approval": Anonymize<Icm9m0qeemu66d>;
    /**
     * Propose and approve a spend of treasury funds.
     *
     * ## Dispatch Origin
     *
     * Must be [`Config::SpendOrigin`] with the `Success` value being at least
     * `amount` of `asset_kind` in the native asset. The amount of `asset_kind` is converted
     * for assertion using the [`Config::BalanceConverter`].
     *
     * ## Details
     *
     * Create an approved spend for transferring a specific `amount` of `asset_kind` to a
     * designated beneficiary. The spend must be claimed using the `payout` dispatchable within
     * the [`Config::PayoutPeriod`].
     *
     * ### Parameters
     * - `asset_kind`: An indicator of the specific asset class to be spent.
     * - `amount`: The amount to be transferred from the treasury to the `beneficiary`.
     * - `beneficiary`: The beneficiary of the spend.
     * - `valid_from`: The block number from which the spend can be claimed. It can refer to
     * the past if the resulting spend has not yet expired according to the
     * [`Config::PayoutPeriod`]. If `None`, the spend can be claimed immediately after
     * approval.
     *
     * ## Events
     *
     * Emits [`Event::AssetSpendApproved`] if successful.
     */
    "spend": Anonymize<I79dicn2l2lfgs>;
    /**
     * Claim a spend.
     *
     * ## Dispatch Origin
     *
     * Must be signed
     *
     * ## Details
     *
     * Spends must be claimed within some temporal bounds. A spend may be claimed within one
     * [`Config::PayoutPeriod`] from the `valid_from` block.
     * In case of a payout failure, the spend status must be updated with the `check_status`
     * dispatchable before retrying with the current function.
     *
     * ### Parameters
     * - `index`: The spend index.
     *
     * ## Events
     *
     * Emits [`Event::Paid`] if successful.
     */
    "payout": Anonymize<I666bl2fqjkejo>;
    /**
     * Check the status of the spend and remove it from the storage if processed.
     *
     * ## Dispatch Origin
     *
     * Must be signed.
     *
     * ## Details
     *
     * The status check is a prerequisite for retrying a failed payout.
     * If a spend has either succeeded or expired, it is removed from the storage by this
     * function. In such instances, transaction fees are refunded.
     *
     * ### Parameters
     * - `index`: The spend index.
     *
     * ## Events
     *
     * Emits [`Event::PaymentFailed`] if the spend payout has failed.
     * Emits [`Event::SpendProcessed`] if the spend payout has succeed.
     */
    "check_status": Anonymize<I666bl2fqjkejo>;
    /**
     * Void previously approved spend.
     *
     * ## Dispatch Origin
     *
     * Must be [`Config::RejectOrigin`].
     *
     * ## Details
     *
     * A spend void is only possible if the payout has not been attempted yet.
     *
     * ### Parameters
     * - `index`: The spend index.
     *
     * ## Events
     *
     * Emits [`Event::AssetSpendVoided`] if successful.
     */
    "void_spend": Anonymize<I666bl2fqjkejo>;
}>;
export type Icnrv1mfbd3in1 = {
    "amount": bigint;
    "beneficiary": MultiAddress;
};
export type Icm9m0qeemu66d = {
    "proposal_id": number;
};
export type I79dicn2l2lfgs = {
    "asset_kind": Anonymize<I2q3ri6itcjj5u>;
    "amount": bigint;
    "beneficiary": Anonymize<I11rphme8avgla>;
    "valid_from"?: Anonymize<I4arjljr6dpflb>;
};
export type Ie5kd08tutk56t = AnonymousEnum<{
    /**
     * Vote in a poll. If `vote.is_aye()`, the vote is to enact the proposal;
     * otherwise it is a vote to keep the status quo.
     *
     * The dispatch origin of this call must be _Signed_.
     *
     * - `poll_index`: The index of the poll to vote for.
     * - `vote`: The vote configuration.
     *
     * Weight: `O(R)` where R is the number of polls the voter has voted on.
     */
    "vote": Anonymize<Idnsr2pndm36h0>;
    /**
     * Delegate the voting power (with some given conviction) of the sending account for a
     * particular class of polls.
     *
     * The balance delegated is locked for as long as it's delegated, and thereafter for the
     * time appropriate for the conviction's lock period.
     *
     * The dispatch origin of this call must be _Signed_, and the signing account must either:
     * - be delegating already; or
     * - have no voting activity (if there is, then it will need to be removed through
     * `remove_vote`).
     *
     * - `to`: The account whose voting the `target` account's voting power will follow.
     * - `class`: The class of polls to delegate. To delegate multiple classes, multiple calls
     * to this function are required.
     * - `conviction`: The conviction that will be attached to the delegated votes. When the
     * account is undelegated, the funds will be locked for the corresponding period.
     * - `balance`: The amount of the account's balance to be used in delegating. This must not
     * be more than the account's current balance.
     *
     * Emits `Delegated`.
     *
     * Weight: `O(R)` where R is the number of polls the voter delegating to has
     * voted on. Weight is initially charged as if maximum votes, but is refunded later.
     */
    "delegate": Anonymize<Ia1pvdcbhuqf8m>;
    /**
     * Undelegate the voting power of the sending account for a particular class of polls.
     *
     * Tokens may be unlocked following once an amount of time consistent with the lock period
     * of the conviction with which the delegation was issued has passed.
     *
     * The dispatch origin of this call must be _Signed_ and the signing account must be
     * currently delegating.
     *
     * - `class`: The class of polls to remove the delegation from.
     *
     * Emits `Undelegated`.
     *
     * Weight: `O(R)` where R is the number of polls the voter delegating to has
     * voted on. Weight is initially charged as if maximum votes, but is refunded later.
     */
    "undelegate": Anonymize<I8steo882k7qns>;
    /**
     * Remove the lock caused by prior voting/delegating which has expired within a particular
     * class.
     *
     * The dispatch origin of this call must be _Signed_.
     *
     * - `class`: The class of polls to unlock.
     * - `target`: The account to remove the lock on.
     *
     * Weight: `O(R)` with R number of vote of target.
     */
    "unlock": Anonymize<I4pa4q37gj6fua>;
    /**
     * Remove a vote for a poll.
     *
     * If:
     * - the poll was cancelled, or
     * - the poll is ongoing, or
     * - the poll has ended such that
     * - the vote of the account was in opposition to the result; or
     * - there was no conviction to the account's vote; or
     * - the account made a split vote
     * ...then the vote is removed cleanly and a following call to `unlock` may result in more
     * funds being available.
     *
     * If, however, the poll has ended and:
     * - it finished corresponding to the vote of the account, and
     * - the account made a standard vote with conviction, and
     * - the lock period of the conviction is not over
     * ...then the lock will be aggregated into the overall account's lock, which may involve
     * *overlocking* (where the two locks are combined into a single lock that is the maximum
     * of both the amount locked and the time is it locked for).
     *
     * The dispatch origin of this call must be _Signed_, and the signer must have a vote
     * registered for poll `index`.
     *
     * - `index`: The index of poll of the vote to be removed.
     * - `class`: Optional parameter, if given it indicates the class of the poll. For polls
     * which have finished or are cancelled, this must be `Some`.
     *
     * Weight: `O(R + log R)` where R is the number of polls that `target` has voted on.
     * Weight is calculated for the maximum number of vote.
     */
    "remove_vote": Anonymize<I5f178ab6b89t3>;
    /**
     * Remove a vote for a poll.
     *
     * If the `target` is equal to the signer, then this function is exactly equivalent to
     * `remove_vote`. If not equal to the signer, then the vote must have expired,
     * either because the poll was cancelled, because the voter lost the poll or
     * because the conviction period is over.
     *
     * The dispatch origin of this call must be _Signed_.
     *
     * - `target`: The account of the vote to be removed; this account must have voted for poll
     * `index`.
     * - `index`: The index of poll of the vote to be removed.
     * - `class`: The class of the poll.
     *
     * Weight: `O(R + log R)` where R is the number of polls that `target` has voted on.
     * Weight is calculated for the maximum number of vote.
     */
    "remove_other_vote": Anonymize<I4nakhtbsk3c5s>;
}>;
export type Idnsr2pndm36h0 = {
    "poll_index": number;
    "vote": ConvictionVotingVoteAccountVote;
};
export type Ia1pvdcbhuqf8m = {
    "class": number;
    "to": MultiAddress;
    "conviction": VotingConviction;
    "balance": bigint;
};
export type I8steo882k7qns = {
    "class": number;
};
export type I4pa4q37gj6fua = {
    "class": number;
    "target": MultiAddress;
};
export type I5f178ab6b89t3 = {
    "class"?: Anonymize<I4arjljr6dpflb>;
    "index": number;
};
export type I4nakhtbsk3c5s = {
    "target": MultiAddress;
    "class": number;
    "index": number;
};
export type Iceildkgu1083p = AnonymousEnum<{
    /**
     * Propose a referendum on a privileged action.
     *
     * - `origin`: must be `SubmitOrigin` and the account must have `SubmissionDeposit` funds
     * available.
     * - `proposal_origin`: The origin from which the proposal should be executed.
     * - `proposal`: The proposal.
     * - `enactment_moment`: The moment that the proposal should be enacted.
     *
     * Emits `Submitted`.
     */
    "submit": Anonymize<Id2j3bi9rqi3qn>;
    /**
     * Post the Decision Deposit for a referendum.
     *
     * - `origin`: must be `Signed` and the account must have funds available for the
     * referendum's track's Decision Deposit.
     * - `index`: The index of the submitted referendum whose Decision Deposit is yet to be
     * posted.
     *
     * Emits `DecisionDepositPlaced`.
     */
    "place_decision_deposit": Anonymize<I666bl2fqjkejo>;
    /**
     * Refund the Decision Deposit for a closed referendum back to the depositor.
     *
     * - `origin`: must be `Signed` or `Root`.
     * - `index`: The index of a closed referendum whose Decision Deposit has not yet been
     * refunded.
     *
     * Emits `DecisionDepositRefunded`.
     */
    "refund_decision_deposit": Anonymize<I666bl2fqjkejo>;
    /**
     * Cancel an ongoing referendum.
     *
     * - `origin`: must be the `CancelOrigin`.
     * - `index`: The index of the referendum to be cancelled.
     *
     * Emits `Cancelled`.
     */
    "cancel": Anonymize<I666bl2fqjkejo>;
    /**
     * Cancel an ongoing referendum and slash the deposits.
     *
     * - `origin`: must be the `KillOrigin`.
     * - `index`: The index of the referendum to be cancelled.
     *
     * Emits `Killed` and `DepositSlashed`.
     */
    "kill": Anonymize<I666bl2fqjkejo>;
    /**
     * Advance a referendum onto its next logical state. Only used internally.
     *
     * - `origin`: must be `Root`.
     * - `index`: the referendum to be advanced.
     */
    "nudge_referendum": Anonymize<I666bl2fqjkejo>;
    /**
     * Advance a track onto its next logical state. Only used internally.
     *
     * - `origin`: must be `Root`.
     * - `track`: the track to be advanced.
     *
     * Action item for when there is now one fewer referendum in the deciding phase and the
     * `DecidingCount` is not yet updated. This means that we should either:
     * - begin deciding another referendum (and leave `DecidingCount` alone); or
     * - decrement `DecidingCount`.
     */
    "one_fewer_deciding": Anonymize<Icbio0e1f0034b>;
    /**
     * Refund the Submission Deposit for a closed referendum back to the depositor.
     *
     * - `origin`: must be `Signed` or `Root`.
     * - `index`: The index of a closed referendum whose Submission Deposit has not yet been
     * refunded.
     *
     * Emits `SubmissionDepositRefunded`.
     */
    "refund_submission_deposit": Anonymize<I666bl2fqjkejo>;
    /**
     * Set or clear metadata of a referendum.
     *
     * Parameters:
     * - `origin`: Must be `Signed` by a creator of a referendum or by anyone to clear a
     * metadata of a finished referendum.
     * - `index`:  The index of a referendum to set or clear metadata for.
     * - `maybe_hash`: The hash of an on-chain stored preimage. `None` to clear a metadata.
     */
    "set_metadata": Anonymize<I8c0vkqjjipnuj>;
}>;
export type Id2j3bi9rqi3qn = {
    "proposal_origin": Anonymize<I7qpv90droestd>;
    "proposal": PreimagesBounded;
    "enactment_moment": TraitsScheduleDispatchTime;
};
export type Icbio0e1f0034b = {
    "track": number;
};
export type I8c0vkqjjipnuj = {
    "index": number;
    "maybe_hash"?: Anonymize<I4s6vifaf8k998>;
};
export type I5itui6aqi55cc = AnonymousEnum<{
    "whitelist_call": Anonymize<I1adbcfi5uc62r>;
    "remove_whitelisted_call": Anonymize<I1adbcfi5uc62r>;
    "dispatch_whitelisted_call": Anonymize<Ibf6ucefn8fh49>;
    "dispatch_whitelisted_call_with_preimage": Anonymize<I4re2nri9v0i54>;
}>;
export type Ibf6ucefn8fh49 = {
    "call_hash": SizedHex<32>;
    "call_encoded_len": number;
    "call_weight_witness": Anonymize<I4q39t5hn830vp>;
};
export type I4re2nri9v0i54 = {
    "call": TxCallData;
};
export type Idkeds3pi8flqr = AnonymousEnum<{
    /**
     * Propose a new bounty.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Payment: `TipReportDepositBase` will be reserved from the origin account, as well as
     * `DataDepositPerByte` for each byte in `reason`. It will be unreserved upon approval,
     * or slashed when rejected.
     *
     * - `curator`: The curator account whom will manage this bounty.
     * - `fee`: The curator fee.
     * - `value`: The total payment amount of this bounty, curator fee included.
     * - `description`: The description of this bounty.
     */
    "propose_bounty": Anonymize<I2a839vbf5817q>;
    /**
     * Approve a bounty proposal. At a later time, the bounty will be funded and become active
     * and the original deposit will be returned.
     *
     * May only be called from `T::SpendOrigin`.
     *
     * ## Complexity
     * - O(1).
     */
    "approve_bounty": Anonymize<Ia9p5bg6p18r0i>;
    /**
     * Propose a curator to a funded bounty.
     *
     * May only be called from `T::SpendOrigin`.
     *
     * ## Complexity
     * - O(1).
     */
    "propose_curator": Anonymize<I42bqh279uf7oa>;
    /**
     * Unassign curator from a bounty.
     *
     * This function can only be called by the `RejectOrigin` a signed origin.
     *
     * If this function is called by the `RejectOrigin`, we assume that the curator is
     * malicious or inactive. As a result, we will slash the curator when possible.
     *
     * If the origin is the curator, we take this as a sign they are unable to do their job and
     * they willingly give up. We could slash them, but for now we allow them to recover their
     * deposit and exit without issue. (We may want to change this if it is abused.)
     *
     * Finally, the origin can be anyone if and only if the curator is "inactive". This allows
     * anyone in the community to call out that a curator is not doing their due diligence, and
     * we should pick a new curator. In this case the curator should also be slashed.
     *
     * ## Complexity
     * - O(1).
     */
    "unassign_curator": Anonymize<Ia9p5bg6p18r0i>;
    /**
     * Accept the curator role for a bounty.
     * A deposit will be reserved from curator and refund upon successful payout.
     *
     * May only be called from the curator.
     *
     * ## Complexity
     * - O(1).
     */
    "accept_curator": Anonymize<Ia9p5bg6p18r0i>;
    /**
     * Award bounty to a beneficiary account. The beneficiary will be able to claim the funds
     * after a delay.
     *
     * The dispatch origin for this call must be the curator of this bounty.
     *
     * - `bounty_id`: Bounty ID to award.
     * - `beneficiary`: The beneficiary account whom will receive the payout.
     *
     * ## Complexity
     * - O(1).
     */
    "award_bounty": Anonymize<I4p6v96cffstms>;
    /**
     * Claim the payout from an awarded bounty after payout delay.
     *
     * The dispatch origin for this call must be the beneficiary of this bounty.
     *
     * - `bounty_id`: Bounty ID to claim.
     *
     * ## Complexity
     * - O(1).
     */
    "claim_bounty": Anonymize<Ia9p5bg6p18r0i>;
    /**
     * Cancel a proposed or active bounty. All the funds will be sent to treasury and
     * the curator deposit will be unreserved if possible.
     *
     * Only `T::RejectOrigin` is able to cancel a bounty.
     *
     * - `bounty_id`: Bounty ID to cancel.
     *
     * ## Complexity
     * - O(1).
     */
    "close_bounty": Anonymize<Ia9p5bg6p18r0i>;
    /**
     * Extend the expiry time of an active bounty.
     *
     * The dispatch origin for this call must be the curator of this bounty.
     *
     * - `bounty_id`: Bounty ID to extend.
     * - `remark`: additional information.
     *
     * ## Complexity
     * - O(1).
     */
    "extend_bounty_expiry": Anonymize<I90n6nnkpdahrh>;
    /**
     * Approve bountry and propose a curator simultaneously.
     * This call is a shortcut to calling `approve_bounty` and `propose_curator` separately.
     *
     * May only be called from `T::SpendOrigin`.
     *
     * - `bounty_id`: Bounty ID to approve.
     * - `curator`: The curator account whom will manage this bounty.
     * - `fee`: The curator fee.
     *
     * ## Complexity
     * - O(1).
     */
    "approve_bounty_with_curator": Anonymize<I42bqh279uf7oa>;
    /**
     * Poke the deposit reserved for creating a bounty proposal.
     *
     * This can be used by accounts to update their reserved amount.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `bounty_id`: The bounty id for which to adjust the deposit.
     *
     * If the deposit is updated, the difference will be reserved/unreserved from the
     * proposer's account.
     *
     * The transaction is made free if the deposit is updated and paid otherwise.
     *
     * Emits `DepositPoked` if the deposit is updated.
     */
    "poke_deposit": Anonymize<Ia9p5bg6p18r0i>;
}>;
export type I2a839vbf5817q = {
    "value": bigint;
    "description": Uint8Array;
};
export type I42bqh279uf7oa = {
    "bounty_id": number;
    "curator": MultiAddress;
    "fee": bigint;
};
export type I4p6v96cffstms = {
    "bounty_id": number;
    "beneficiary": MultiAddress;
};
export type I90n6nnkpdahrh = {
    "bounty_id": number;
    "remark": Uint8Array;
};
export type I1b6drdhvt5hl9 = AnonymousEnum<{
    /**
     * Add a new child-bounty.
     *
     * The dispatch origin for this call must be the curator of parent
     * bounty and the parent bounty must be in "active" state.
     *
     * Child-bounty gets added successfully & fund gets transferred from
     * parent bounty to child-bounty account, if parent bounty has enough
     * funds, else the call fails.
     *
     * Upper bound to maximum number of active  child bounties that can be
     * added are managed via runtime trait config
     * [`Config::MaxActiveChildBountyCount`].
     *
     * If the call is success, the status of child-bounty is updated to
     * "Added".
     *
     * - `parent_bounty_id`: Index of parent bounty for which child-bounty is being added.
     * - `value`: Value for executing the proposal.
     * - `description`: Text description for the child-bounty.
     */
    "add_child_bounty": Anonymize<I8mk5kjgn02hi8>;
    /**
     * Propose curator for funded child-bounty.
     *
     * The dispatch origin for this call must be curator of parent bounty.
     *
     * Parent bounty must be in active state, for this child-bounty call to
     * work.
     *
     * Child-bounty must be in "Added" state, for processing the call. And
     * state of child-bounty is moved to "CuratorProposed" on successful
     * call completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     * - `curator`: Address of child-bounty curator.
     * - `fee`: payment fee to child-bounty curator for execution.
     */
    "propose_curator": Anonymize<Ieqvq91sbe02ko>;
    /**
     * Accept the curator role for the child-bounty.
     *
     * The dispatch origin for this call must be the curator of this
     * child-bounty.
     *
     * A deposit will be reserved from the curator and refund upon
     * successful payout or cancellation.
     *
     * Fee for curator is deducted from curator fee of parent bounty.
     *
     * Parent bounty must be in active state, for this child-bounty call to
     * work.
     *
     * Child-bounty must be in "CuratorProposed" state, for processing the
     * call. And state of child-bounty is moved to "Active" on successful
     * call completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     */
    "accept_curator": Anonymize<I2gr10p66od9ch>;
    /**
     * Unassign curator from a child-bounty.
     *
     * The dispatch origin for this call can be either `RejectOrigin`, or
     * the curator of the parent bounty, or any signed origin.
     *
     * For the origin other than T::RejectOrigin and the child-bounty
     * curator, parent bounty must be in active state, for this call to
     * work. We allow child-bounty curator and T::RejectOrigin to execute
     * this call irrespective of the parent bounty state.
     *
     * If this function is called by the `RejectOrigin` or the
     * parent bounty curator, we assume that the child-bounty curator is
     * malicious or inactive. As a result, child-bounty curator deposit is
     * slashed.
     *
     * If the origin is the child-bounty curator, we take this as a sign
     * that they are unable to do their job, and are willingly giving up.
     * We could slash the deposit, but for now we allow them to unreserve
     * their deposit and exit without issue. (We may want to change this if
     * it is abused.)
     *
     * Finally, the origin can be anyone iff the child-bounty curator is
     * "inactive". Expiry update due of parent bounty is used to estimate
     * inactive state of child-bounty curator.
     *
     * This allows anyone in the community to call out that a child-bounty
     * curator is not doing their due diligence, and we should pick a new
     * one. In this case the child-bounty curator deposit is slashed.
     *
     * State of child-bounty is moved to Added state on successful call
     * completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     */
    "unassign_curator": Anonymize<I2gr10p66od9ch>;
    /**
     * Award child-bounty to a beneficiary.
     *
     * The beneficiary will be able to claim the funds after a delay.
     *
     * The dispatch origin for this call must be the parent curator or
     * curator of this child-bounty.
     *
     * Parent bounty must be in active state, for this child-bounty call to
     * work.
     *
     * Child-bounty must be in active state, for processing the call. And
     * state of child-bounty is moved to "PendingPayout" on successful call
     * completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     * - `beneficiary`: Beneficiary account.
     */
    "award_child_bounty": Anonymize<I9mcq66cm3gibo>;
    /**
     * Claim the payout from an awarded child-bounty after payout delay.
     *
     * The dispatch origin for this call may be any signed origin.
     *
     * Call works independent of parent bounty state, No need for parent
     * bounty to be in active state.
     *
     * The Beneficiary is paid out with agreed bounty value. Curator fee is
     * paid & curator deposit is unreserved.
     *
     * Child-bounty must be in "PendingPayout" state, for processing the
     * call. And instance of child-bounty is removed from the state on
     * successful call completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     */
    "claim_child_bounty": Anonymize<I2gr10p66od9ch>;
    /**
     * Cancel a proposed or active child-bounty. Child-bounty account funds
     * are transferred to parent bounty account. The child-bounty curator
     * deposit may be unreserved if possible.
     *
     * The dispatch origin for this call must be either parent curator or
     * `T::RejectOrigin`.
     *
     * If the state of child-bounty is `Active`, curator deposit is
     * unreserved.
     *
     * If the state of child-bounty is `PendingPayout`, call fails &
     * returns `PendingPayout` error.
     *
     * For the origin other than T::RejectOrigin, parent bounty must be in
     * active state, for this child-bounty call to work. For origin
     * T::RejectOrigin execution is forced.
     *
     * Instance of child-bounty is removed from the state on successful
     * call completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     */
    "close_child_bounty": Anonymize<I2gr10p66od9ch>;
}>;
export type I8mk5kjgn02hi8 = {
    "parent_bounty_id": number;
    "value": bigint;
    "description": Uint8Array;
};
export type Ieqvq91sbe02ko = {
    "parent_bounty_id": number;
    "child_bounty_id": number;
    "curator": MultiAddress;
    "fee": bigint;
};
export type I2gr10p66od9ch = {
    "parent_bounty_id": number;
    "child_bounty_id": number;
};
export type I9mcq66cm3gibo = {
    "parent_bounty_id": number;
    "child_bounty_id": number;
    "beneficiary": MultiAddress;
};
export type If582h5gr5gh6f = AnonymousEnum<{
    /**
     * Initialize a conversion rate to native balance for the given asset.
     *
     * ## Complexity
     * - O(1)
     */
    "create": Anonymize<I9c4d50jrp7as1>;
    /**
     * Update the conversion rate to native balance for the given asset.
     *
     * ## Complexity
     * - O(1)
     */
    "update": Anonymize<I9c4d50jrp7as1>;
    /**
     * Remove an existing conversion rate to native balance for the given asset.
     *
     * ## Complexity
     * - O(1)
     */
    "remove": Anonymize<Ifplevr9hp8jo3>;
}>;
export type I5t09dnejpfl63 = AnonymousEnum<{
    /**
     * Fund a new bounty with a proposed curator, initiating the payment from the
     * funding source to the bounty account/location.
     *
     * ## Dispatch Origin
     *
     * Must be [`Config::SpendOrigin`] with the `Success` value being at least
     * the bounty value converted to native balance using [`Config::BalanceConverter`].
     * The converted native amount is validated against the maximum spendable amount
     * returned by [`Config::SpendOrigin`].
     *
     * ## Details
     *
     * - The `SpendOrigin` must have sufficient permissions to fund the bounty.
     * - The bounty `value` (in asset balance) is converted to native balance for validation.
     * - In case of a funding failure, the bounty status must be updated with the
     * `check_status` call before retrying with `retry_payment` call.
     *
     * ### Parameters
     * - `asset_kind`: An indicator of the specific asset class to be funded.
     * - `value`: The total payment amount of this bounty.
     * - `curator`: Address of bounty curator.
     * - `metadata`: The hash of an on-chain stored preimage with bounty metadata.
     *
     * ## Events
     *
     * Emits [`Event::BountyCreated`] and [`Event::Paid`] if successful.
     */
    "fund_bounty": Anonymize<Ic7vv426t45o81>;
    /**
     * Fund a new child-bounty with a proposed curator, initiating the payment from the parent
     * bounty to the child-bounty account/location.
     *
     * ## Dispatch Origin
     *
     * Must be signed by the parent curator.
     *
     * ## Details
     *
     * - If `curator` is not provided, the child-bounty will default to using the parent
     * curator, allowing the parent curator to immediately call `check_status` and
     * `award_bounty` to payout the child-bounty.
     * - In case of a funding failure, the child-/bounty status must be updated with the
     * `check_status` call before retrying with `retry_payment` call.
     *
     * ### Parameters
     * - `parent_bounty_id`: Index of parent bounty for which child-bounty is being added.
     * - `value`: The payment amount of this child-bounty.
     * - `metadata`: The hash of an on-chain stored preimage with child-bounty metadata.
     * - `curator`: Address of child-bounty curator.
     *
     * ## Events
     *
     * Emits [`Event::ChildBountyCreated`] and [`Event::Paid`] if successful.
     */
    "fund_child_bounty": Anonymize<Ic5qjcpspmr75n>;
    /**
     * Propose a new curator for a child-/bounty after the previous was unassigned.
     *
     * ## Dispatch Origin
     *
     * Must be signed by `T::SpendOrigin` for a bounty, or by the parent bounty curator
     * for a child-bounty.
     *
     * ## Details
     *
     * - The child-/bounty must be in the `CuratorUnassigned` state.
     * - For a bounty, the `SpendOrigin` must have sufficient permissions to propose the
     * curator.
     *
     * ### Parameters
     * - `parent_bounty_id`: Index of bounty.
     * - `child_bounty_id`: Index of child-bounty.
     * - `curator`: Account to be proposed as the curator.
     *
     * ## Events
     *
     * Emits [`Event::CuratorProposed`] if successful.
     */
    "propose_curator": Anonymize<I9usg3e2ik3sk>;
    /**
     * Accept the curator role for a child-/bounty.
     *
     * ## Dispatch Origin
     *
     * Must be signed by the proposed curator.
     *
     * ## Details
     *
     * - The child-/bounty must be in the `Funded` state.
     * - The curator must accept the role by calling this function.
     * - A deposit will be reserved from the curator and refunded upon successful payout.
     *
     * ### Parameters
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child-bounty.
     *
     * ## Events
     *
     * Emits [`Event::BountyBecameActive`] if successful.
     */
    "accept_curator": Anonymize<I9bg8aubpi9e76>;
    /**
     * Unassign curator from a child-/bounty.
     *
     * ## Dispatch Origin
     *
     * This function can only be called by the `RejectOrigin` or the child-/bounty curator.
     *
     * ## Details
     *
     * - If this function is called by the `RejectOrigin`, or by the parent curator in the case
     * of a child bounty, we assume that the curator is malicious or inactive. As a result,
     * we will slash the curator when possible.
     * - If the origin is the child-/bounty curator, we take this as a sign they are unable to
     * do their job and they willingly give up. We could slash them, but for now we allow
     * them to recover their deposit and exit without issue. (We may want to change this if
     * it is abused).
     * - If successful, the child-/bounty status is updated to `CuratorUnassigned`. To
     * reactivate the bounty, a new curator must be proposed and must accept the role.
     *
     * ### Parameters
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child-bounty.
     *
     * ## Events
     *
     * Emits [`Event::CuratorUnassigned`] if successful.
     */
    "unassign_curator": Anonymize<I9bg8aubpi9e76>;
    /**
     * Awards the child-/bounty to a beneficiary account/location,
     * initiating the payout payments to both the beneficiary and the curator.
     *
     * ## Dispatch Origin
     *
     * This function can only be called by the `RejectOrigin` or the child-/bounty curator.
     *
     * ## Details
     *
     * - The child-/bounty must be in the `Active` state.
     * - if awarding a parent bounty it must not have active or funded child bounties.
     * - Initiates payout payment from the child-/bounty to the beneficiary account/location.
     * - If successful the child-/bounty status is updated to `PayoutAttempted`.
     * - In case of a payout failure, the child-/bounty status must be updated with
     * `check_status` call before retrying with `retry_payment` call.
     *
     * ### Parameters
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child-bounty.
     * - `beneficiary`: Account/location to be awarded the child-/bounty.
     *
     * ## Events
     *
     * Emits [`Event::BountyAwarded`] and [`Event::Paid`] if successful.
     */
    "award_bounty": Anonymize<I6k9enqukp95rq>;
    /**
     * Cancel an active child-/bounty. A payment to send all the funds to the funding source is
     * initialized.
     *
     * ## Dispatch Origin
     *
     * This function can only be called by the `RejectOrigin` or the parent bounty curator.
     *
     * ## Details
     *
     * - If the child-/bounty is in the `Funded` state, a refund payment is initiated.
     * - If the child-/bounty is in the `Active` state, a refund payment is initiated and the
     * child-/bounty status is updated with the curator account/location.
     * - If the child-/bounty is in the funding or payout phase, it cannot be canceled.
     * - In case of a refund failure, the child-/bounty status must be updated with the
     * `check_status` call before retrying with `retry_payment` call.
     *
     * ### Parameters
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child-bounty.
     *
     * ## Events
     *
     * Emits [`Event::BountyCanceled`] and [`Event::Paid`] if successful.
     */
    "close_bounty": Anonymize<I9bg8aubpi9e76>;
    /**
     * Check and update the payment status of a child-/bounty.
     *
     * ## Dispatch Origin
     *
     * Must be signed.
     *
     * ## Details
     *
     * - If the child-/bounty status is `FundingAttempted`, it checks if the funding payment
     * has succeeded. If successful, the bounty status becomes `Funded`.
     * - If the child-/bounty status is `RefundAttempted`, it checks if the refund payment has
     * succeeded. If successful, the child-/bounty is removed from storage.
     * - If the child-/bounty status is `PayoutAttempted`, it checks if the payout payment has
     * succeeded. If successful, the child-/bounty is removed from storage.
     *
     * ### Parameters
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child-bounty.
     *
     * ## Events
     *
     * Emits [`Event::BountyBecameActive`] if the child/bounty status transitions to `Active`.
     * Emits [`Event::BountyRefundProcessed`] if the refund payment has succeed.
     * Emits [`Event::BountyPayoutProcessed`] if the payout payment has succeed.
     * Emits [`Event::PaymentFailed`] if the funding, refund our payment payment has failed.
     */
    "check_status": Anonymize<I9bg8aubpi9e76>;
    /**
     * Retry the funding, refund or payout payments.
     *
     * ## Dispatch Origin
     *
     * Must be signed.
     *
     * ## Details
     *
     * - If the child-/bounty status is `FundingAttempted`, it retries the funding payment from
     * funding source the child-/bounty account/location.
     * - If the child-/bounty status is `RefundAttempted`, it retries the refund payment from
     * the child-/bounty account/location to the funding source.
     * - If the child-/bounty status is `PayoutAttempted`, it retries the payout payment from
     * the child-/bounty account/location to the beneficiary account/location.
     *
     * ### Parameters
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child-bounty.
     *
     * ## Events
     *
     * Emits [`Event::Paid`] if the funding, refund or payout payment has initiated.
     */
    "retry_payment": Anonymize<I9bg8aubpi9e76>;
}>;
export type Ic7vv426t45o81 = {
    "asset_kind": Anonymize<I2q3ri6itcjj5u>;
    "value": bigint;
    "curator": MultiAddress;
    "metadata": SizedHex<32>;
};
export type Ic5qjcpspmr75n = {
    "parent_bounty_id": number;
    "value": bigint;
    "metadata": SizedHex<32>;
    "curator"?: Anonymize<Ia0jlc0rcbskuk>;
};
export type I9usg3e2ik3sk = {
    "parent_bounty_id": number;
    "child_bounty_id"?: Anonymize<I4arjljr6dpflb>;
    "curator": MultiAddress;
};
export type I9bg8aubpi9e76 = {
    "parent_bounty_id": number;
    "child_bounty_id"?: Anonymize<I4arjljr6dpflb>;
};
export type I6k9enqukp95rq = {
    "parent_bounty_id": number;
    "child_bounty_id"?: Anonymize<I4arjljr6dpflb>;
    "beneficiary": Anonymize<I11rphme8avgla>;
};
export type I39l72gdmkk30t = AnonymousEnum<{
    /**
     * Control the automatic migration.
     *
     * The dispatch origin of this call must be [`Config::ControlOrigin`].
     */
    "control_auto_migration": Anonymize<I7psec5e6ghc64>;
    /**
     * Continue the migration for the given `limits`.
     *
     * The dispatch origin of this call can be any signed account.
     *
     * This transaction has NO MONETARY INCENTIVES. calling it will not reward anyone. Albeit,
     * Upon successful execution, the transaction fee is returned.
     *
     * The (potentially over-estimated) of the byte length of all the data read must be
     * provided for up-front fee-payment and weighing. In essence, the caller is guaranteeing
     * that executing the current `MigrationTask` with the given `limits` will not exceed
     * `real_size_upper` bytes of read data.
     *
     * The `witness_task` is merely a helper to prevent the caller from being slashed or
     * generally trigger a migration that they do not intend. This parameter is just a message
     * from caller, saying that they believed `witness_task` was the last state of the
     * migration, and they only wish for their transaction to do anything, if this assumption
     * holds. In case `witness_task` does not match, the transaction fails.
     *
     * Based on the documentation of [`MigrationTask::migrate_until_exhaustion`], the
     * recommended way of doing this is to pass a `limit` that only bounds `count`, as the
     * `size` limit can always be overwritten.
     */
    "continue_migrate": Anonymize<I2psb0sladd863>;
    /**
     * Migrate the list of top keys by iterating each of them one by one.
     *
     * This does not affect the global migration process tracker ([`MigrationProcess`]), and
     * should only be used in case any keys are leftover due to a bug.
     */
    "migrate_custom_top": Anonymize<I585tk8khua0gk>;
    /**
     * Migrate the list of child keys by iterating each of them one by one.
     *
     * All of the given child keys must be present under one `child_root`.
     *
     * This does not affect the global migration process tracker ([`MigrationProcess`]), and
     * should only be used in case any keys are leftover due to a bug.
     */
    "migrate_custom_child": Anonymize<I3ut99di214ru2>;
    /**
     * Set the maximum limit of the signed migration.
     */
    "set_signed_max_limits": Anonymize<Iemkp87d26vsbh>;
    /**
     * Forcefully set the progress the running migration.
     *
     * This is only useful in one case: the next key to migrate is too big to be migrated with
     * a signed account, in a parachain context, and we simply want to skip it. A reasonable
     * example of this would be `:code:`, which is both very expensive to migrate, and commonly
     * used, so probably it is already migrated.
     *
     * In case you mess things up, you can also, in principle, use this to reset the migration
     * process.
     */
    "force_set_progress": Anonymize<I4ahfrt5dscf6q>;
}>;
export type I7psec5e6ghc64 = {
    "maybe_config"?: Anonymize<Ib17t3992hb64n>;
};
export type I2psb0sladd863 = {
    "limits": Anonymize<I215mkl885p4da>;
    "real_size_upper": number;
    "witness_task": Anonymize<If354jrdedj0pj>;
};
export type I585tk8khua0gk = {
    "keys": Anonymize<Itom7fk49o0c9>;
    "witness_size": number;
};
export type I3ut99di214ru2 = {
    "root": Uint8Array;
    "child_keys": Anonymize<Itom7fk49o0c9>;
    "total_size": number;
};
export type Iemkp87d26vsbh = {
    "limits": Anonymize<I215mkl885p4da>;
};
export type I4ahfrt5dscf6q = {
    "progress_top": Anonymize<I1ufmh6d8psvik>;
    "progress_child": Anonymize<I1ufmh6d8psvik>;
};
export type I57mljkkr28m9p = AnonymousEnum<{
    /**
     * Stake funds with a pool. The amount to bond is delegated (or transferred based on
     * [`adapter::StakeStrategyType`]) from the member to the pool account and immediately
     * increases the pool's bond.
     *
     * The method of transferring the amount to the pool account is determined by
     * [`adapter::StakeStrategyType`]. If the pool is configured to use
     * [`adapter::StakeStrategyType::Delegate`], the funds remain in the account of
     * the `origin`, while the pool gains the right to use these funds for staking.
     *
     * # Note
     *
     * * An account can only be a member of a single pool.
     * * An account cannot join the same pool multiple times.
     * * This call will *not* dust the member account, so the member must have at least
     * `existential deposit + amount` in their account.
     * * Only a pool with [`PoolState::Open`] can be joined
     */
    "join": Anonymize<Ieg1oc56mamrl5>;
    /**
     * Bond `extra` more funds from `origin` into the pool to which they already belong.
     *
     * Additional funds can come from either the free balance of the account, of from the
     * accumulated rewards, see [`BondExtra`].
     *
     * Bonding extra funds implies an automatic payout of all pending rewards as well.
     * See `bond_extra_other` to bond pending rewards of `other` members.
     */
    "bond_extra": Anonymize<I2vu5vj7173ik9>;
    /**
     * A bonded member can use this to claim their payout based on the rewards that the pool
     * has accumulated since their last claimed payout (OR since joining if this is their first
     * time claiming rewards). The payout will be transferred to the member's account.
     *
     * The member will earn rewards pro rata based on the members stake vs the sum of the
     * members in the pools stake. Rewards do not "expire".
     *
     * See `claim_payout_other` to claim rewards on behalf of some `other` pool member.
     */
    "claim_payout": undefined;
    /**
     * Unbond up to `unbonding_points` of the `member_account`'s funds from the pool. It
     * implicitly collects the rewards one last time, since not doing so would mean some
     * rewards would be forfeited.
     *
     * Under certain conditions, this call can be dispatched permissionlessly (i.e. by any
     * account).
     *
     * # Conditions for a permissionless dispatch.
     *
     * * The pool is blocked and the caller is either the root or bouncer. This is refereed to
     * as a kick.
     * * The pool is destroying and the member is not the depositor.
     * * The pool is destroying, the member is the depositor and no other members are in the
     * pool.
     *
     * ## Conditions for permissioned dispatch (i.e. the caller is also the
     * `member_account`):
     *
     * * The caller is not the depositor.
     * * The caller is the depositor, the pool is destroying and no other members are in the
     * pool.
     *
     * # Note
     *
     * If there are too many unlocking chunks to unbond with the pool account,
     * [`Call::pool_withdraw_unbonded`] can be called to try and minimize unlocking chunks.
     * The [`StakingInterface::unbond`] will implicitly call [`Call::pool_withdraw_unbonded`]
     * to try to free chunks if necessary (ie. if unbound was called and no unlocking chunks
     * are available). However, it may not be possible to release the current unlocking chunks,
     * in which case, the result of this call will likely be the `NoMoreChunks` error from the
     * staking system.
     */
    "unbond": Anonymize<I6galqkn58q3bl>;
    /**
     * Call `withdraw_unbonded` for the pools account. This call can be made by any account.
     *
     * This is useful if there are too many unlocking chunks to call `unbond`, and some
     * can be cleared by withdrawing. In the case there are too many unlocking chunks, the user
     * would probably see an error like `NoMoreChunks` emitted from the staking system when
     * they attempt to unbond.
     */
    "pool_withdraw_unbonded": Anonymize<I36uoc8t9liv80>;
    /**
     * Withdraw unbonded funds from `member_account`. If no bonded funds can be unbonded, an
     * error is returned.
     *
     * Under certain conditions, this call can be dispatched permissionlessly (i.e. by any
     * account).
     *
     * # Conditions for a permissionless dispatch
     *
     * * The pool is in destroy mode and the target is not the depositor.
     * * The target is the depositor and they are the only member in the sub pools.
     * * The pool is blocked and the caller is either the root or bouncer.
     *
     * # Conditions for permissioned dispatch
     *
     * * The caller is the target and they are not the depositor.
     *
     * # Note
     *
     * - If the target is the depositor, the pool will be destroyed.
     * - If the pool has any pending slash, we also try to slash the member before letting them
     * withdraw. This calculation adds some weight overhead and is only defensive. In reality,
     * pool slashes must have been already applied via permissionless [`Call::apply_slash`].
     */
    "withdraw_unbonded": Anonymize<Ibunghsg9qa7f7>;
    /**
     * Create a new delegation pool.
     *
     * # Arguments
     *
     * * `amount` - The amount of funds to delegate to the pool. This also acts of a sort of
     * deposit since the pools creator cannot fully unbond funds until the pool is being
     * destroyed.
     * * `index` - A disambiguation index for creating the account. Likely only useful when
     * creating multiple pools in the same extrinsic.
     * * `root` - The account to set as [`PoolRoles::root`].
     * * `nominator` - The account to set as the [`PoolRoles::nominator`].
     * * `bouncer` - The account to set as the [`PoolRoles::bouncer`].
     *
     * # Note
     *
     * In addition to `amount`, the caller will transfer the existential deposit; so the caller
     * needs at have at least `amount + existential_deposit` transferable.
     */
    "create": Anonymize<I8qnouj2c0igph>;
    /**
     * Create a new delegation pool with a previously used pool id
     *
     * # Arguments
     *
     * same as `create` with the inclusion of
     * * `pool_id` - `A valid PoolId.
     */
    "create_with_pool_id": Anonymize<Ic30e2k517a3ns>;
    /**
     * Nominate on behalf of the pool.
     *
     * The dispatch origin of this call must be signed by the pool nominator or the pool
     * root role.
     *
     * This directly forwards the call to an implementation of `StakingInterface` (e.g.,
     * `pallet-staking`) through [`Config::StakeAdapter`], on behalf of the bonded pool.
     *
     * # Note
     *
     * In addition to a `root` or `nominator` role of `origin`, the pool's depositor needs to
     * have at least `depositor_min_bond` in the pool to start nominating.
     */
    "nominate": Anonymize<I47a2tsd2o2b1c>;
    /**
     * Set a new state for the pool.
     *
     * If a pool is already in the `Destroying` state, then under no condition can its state
     * change again.
     *
     * The dispatch origin of this call must be either:
     *
     * 1. signed by the bouncer, or the root role of the pool,
     * 2. if the pool conditions to be open are NOT met (as described by `ok_to_be_open`), and
     * then the state of the pool can be permissionlessly changed to `Destroying`.
     */
    "set_state": Anonymize<Ifc9k1s0e9nv8e>;
    /**
     * Set a new metadata for the pool.
     *
     * The dispatch origin of this call must be signed by the bouncer, or the root role of the
     * pool.
     */
    "set_metadata": Anonymize<I4ihj26hl75e5p>;
    /**
     * Update configurations for the nomination pools. The origin for this call must be
     * [`Config::AdminOrigin`].
     *
     * # Arguments
     *
     * * `min_join_bond` - Set [`MinJoinBond`].
     * * `min_create_bond` - Set [`MinCreateBond`].
     * * `max_pools` - Set [`MaxPools`].
     * * `max_members` - Set [`MaxPoolMembers`].
     * * `max_members_per_pool` - Set [`MaxPoolMembersPerPool`].
     * * `global_max_commission` - Set [`GlobalMaxCommission`].
     */
    "set_configs": Anonymize<I2dl8ekhm2t22h>;
    /**
     * Update the roles of the pool.
     *
     * The root is the only entity that can change any of the roles, including itself,
     * excluding the depositor, who can never change.
     *
     * It emits an event, notifying UIs of the role change. This event is quite relevant to
     * most pool members and they should be informed of changes to pool roles.
     */
    "update_roles": Anonymize<I13us5e5h5645o>;
    /**
     * Chill on behalf of the pool.
     *
     * The dispatch origin of this call can be signed by the pool nominator or the pool
     * root role, same as [`Pallet::nominate`].
     *
     * This directly forwards the call to an implementation of `StakingInterface` (e.g.,
     * `pallet-staking`) through [`Config::StakeAdapter`], on behalf of the bonded pool.
     *
     * Under certain conditions, this call can be dispatched permissionlessly (i.e. by any
     * account).
     *
     * # Conditions for a permissionless dispatch:
     * * When pool depositor has less than `MinNominatorBond` staked, otherwise pool members
     * are unable to unbond.
     *
     * # Conditions for permissioned dispatch:
     * * The caller is the pool's nominator or root.
     */
    "chill": Anonymize<I931cottvong90>;
    /**
     * `origin` bonds funds from `extra` for some pool member `member` into their respective
     * pools.
     *
     * `origin` can bond extra funds from free balance or pending rewards when `origin ==
     * other`.
     *
     * In the case of `origin != other`, `origin` can only bond extra pending rewards of
     * `other` members assuming set_claim_permission for the given member is
     * `PermissionlessCompound` or `PermissionlessAll`.
     */
    "bond_extra_other": Anonymize<I7sujb8gfvuo7n>;
    /**
     * Allows a pool member to set a claim permission to allow or disallow permissionless
     * bonding and withdrawing.
     *
     * # Arguments
     *
     * * `origin` - Member of a pool.
     * * `permission` - The permission to be applied.
     */
    "set_claim_permission": Anonymize<I1ors0vru14it3>;
    /**
     * `origin` can claim payouts on some pool member `other`'s behalf.
     *
     * Pool member `other` must have a `PermissionlessWithdraw` or `PermissionlessAll` claim
     * permission for this call to be successful.
     */
    "claim_payout_other": Anonymize<I40s11r8nagn2g>;
    /**
     * Set the commission of a pool.
     * Both a commission percentage and a commission payee must be provided in the `current`
     * tuple. Where a `current` of `None` is provided, any current commission will be removed.
     *
     * - If a `None` is supplied to `new_commission`, existing commission will be removed.
     */
    "set_commission": Anonymize<I6bjj87fr5g9nl>;
    /**
     * Set the maximum commission of a pool.
     *
     * - Initial max can be set to any `Perbill`, and only smaller values thereafter.
     * - Current commission will be lowered in the event it is higher than a new max
     * commission.
     */
    "set_commission_max": Anonymize<I8cbluptqo8kbp>;
    /**
     * Set the commission change rate for a pool.
     *
     * Initial change rate is not bounded, whereas subsequent updates can only be more
     * restrictive than the current.
     */
    "set_commission_change_rate": Anonymize<I81cc4plffa1dm>;
    /**
     * Claim pending commission.
     *
     * The `root` role of the pool is _always_ allowed to claim the pool's commission.
     *
     * If the pool has set `CommissionClaimPermission::Permissionless`, then any account can
     * trigger the process of claiming the pool's commission.
     *
     * If the pool has set its `CommissionClaimPermission` to `Account(acc)`, then only
     * accounts
     * * `acc`, and
     * * the pool's root account
     *
     * may call this extrinsic on behalf of the pool.
     *
     * Pending commissions are paid out and added to the total claimed commission.
     * The total pending commission is reset to zero.
     */
    "claim_commission": Anonymize<I931cottvong90>;
    /**
     * Top up the deficit or withdraw the excess ED from the pool.
     *
     * When a pool is created, the pool depositor transfers ED to the reward account of the
     * pool. ED is subject to change and over time, the deposit in the reward account may be
     * insufficient to cover the ED deficit of the pool or vice-versa where there is excess
     * deposit to the pool. This call allows anyone to adjust the ED deposit of the
     * pool by either topping up the deficit or claiming the excess.
     */
    "adjust_pool_deposit": Anonymize<I931cottvong90>;
    /**
     * Set or remove a pool's commission claim permission.
     *
     * Determines who can claim the pool's pending commission. Only the `Root` role of the pool
     * is able to configure commission claim permissions.
     */
    "set_commission_claim_permission": Anonymize<I3ihan8icf0c5k>;
    /**
     * Apply a pending slash on a member.
     *
     * Fails unless [`crate::pallet::Config::StakeAdapter`] is of strategy type:
     * [`adapter::StakeStrategyType::Delegate`].
     *
     * The pending slash amount of the member must be equal or more than `ExistentialDeposit`.
     * This call can be dispatched permissionlessly (i.e. by any account). If the execution
     * is successful, fee is refunded and caller may be rewarded with a part of the slash
     * based on the [`crate::pallet::Config::StakeAdapter`] configuration.
     */
    "apply_slash": Anonymize<I7ibh0fckqou49>;
    /**
     * Migrates delegated funds from the pool account to the `member_account`.
     *
     * Fails unless [`crate::pallet::Config::StakeAdapter`] is of strategy type:
     * [`adapter::StakeStrategyType::Delegate`].
     *
     * This is a permission-less call and refunds any fee if claim is successful.
     *
     * If the pool has migrated to delegation based staking, the staked tokens of pool members
     * can be moved and held in their own account. See [`adapter::DelegateStake`]
     */
    "migrate_delegation": Anonymize<I7ibh0fckqou49>;
    /**
     * Migrate pool from [`adapter::StakeStrategyType::Transfer`] to
     * [`adapter::StakeStrategyType::Delegate`].
     *
     * Fails unless [`crate::pallet::Config::StakeAdapter`] is of strategy type:
     * [`adapter::StakeStrategyType::Delegate`].
     *
     * This call can be dispatched permissionlessly, and refunds any fee if successful.
     *
     * If the pool has already migrated to delegation based staking, this call will fail.
     */
    "migrate_pool_to_delegate_stake": Anonymize<I931cottvong90>;
}>;
export type I2vu5vj7173ik9 = {
    "extra": NominationPoolsBondExtra;
};
export type NominationPoolsBondExtra = Enum<{
    "FreeBalance": bigint;
    "Rewards": undefined;
}>;
export declare const NominationPoolsBondExtra: GetEnum<NominationPoolsBondExtra>;
export type I6galqkn58q3bl = {
    "member_account": MultiAddress;
    "unbonding_points": bigint;
};
export type I36uoc8t9liv80 = {
    "pool_id": number;
    "num_slashing_spans": number;
};
export type Ibunghsg9qa7f7 = {
    "member_account": MultiAddress;
    "num_slashing_spans": number;
};
export type I8qnouj2c0igph = {
    "amount": bigint;
    "root": MultiAddress;
    "nominator": MultiAddress;
    "bouncer": MultiAddress;
};
export type Ic30e2k517a3ns = {
    "amount": bigint;
    "root": MultiAddress;
    "nominator": MultiAddress;
    "bouncer": MultiAddress;
    "pool_id": number;
};
export type I47a2tsd2o2b1c = {
    "pool_id": number;
    "validators": Anonymize<Ia2lhg7l2hilo3>;
};
export type Ifc9k1s0e9nv8e = {
    "pool_id": number;
    "state": NominationPoolsPoolState;
};
export type I4ihj26hl75e5p = {
    "pool_id": number;
    "metadata": Uint8Array;
};
export type I2dl8ekhm2t22h = {
    "min_join_bond": StakingPalletConfigOpBig;
    "min_create_bond": StakingPalletConfigOpBig;
    "max_pools": StakingPalletConfigOp;
    "max_members": StakingPalletConfigOp;
    "max_members_per_pool": StakingPalletConfigOp;
    "global_max_commission": StakingPalletConfigOp;
};
export type StakingPalletConfigOpBig = Enum<{
    "Noop": undefined;
    "Set": bigint;
    "Remove": undefined;
}>;
export declare const StakingPalletConfigOpBig: GetEnum<StakingPalletConfigOpBig>;
export type StakingPalletConfigOp = Enum<{
    "Noop": undefined;
    "Set": number;
    "Remove": undefined;
}>;
export declare const StakingPalletConfigOp: GetEnum<StakingPalletConfigOp>;
export type I13us5e5h5645o = {
    "pool_id": number;
    "new_root": NominationPoolsConfigOp;
    "new_nominator": NominationPoolsConfigOp;
    "new_bouncer": NominationPoolsConfigOp;
};
export type NominationPoolsConfigOp = Enum<{
    "Noop": undefined;
    "Set": SS58String;
    "Remove": undefined;
}>;
export declare const NominationPoolsConfigOp: GetEnum<NominationPoolsConfigOp>;
export type I7sujb8gfvuo7n = {
    "member": MultiAddress;
    "extra": NominationPoolsBondExtra;
};
export type I1ors0vru14it3 = {
    "permission": NominationPoolsClaimPermission;
};
export type I40s11r8nagn2g = {
    "other": SS58String;
};
export type I6bjj87fr5g9nl = {
    "pool_id": number;
    "new_commission"?: Anonymize<Ie8iutm7u02lmj>;
};
export type I7ibh0fckqou49 = {
    "member_account": MultiAddress;
};
export type Ifvfo1l0vu2o7e = AnonymousEnum<{
    /**
     * Declare that some `dislocated` account has, through rewards or penalties, sufficiently
     * changed its score that it should properly fall into a different bag than its current
     * one.
     *
     * Anyone can call this function about any potentially dislocated account.
     *
     * Will always update the stored score of `dislocated` to the correct score, based on
     * `ScoreProvider`.
     *
     * If `dislocated` does not exists, it returns an error.
     */
    "rebag": Anonymize<Id9js0aucdivjk>;
    /**
     * Move the caller's Id directly in front of `lighter`.
     *
     * The dispatch origin for this call must be _Signed_ and can only be called by the Id of
     * the account going in front of `lighter`. Fee is payed by the origin under all
     * circumstances.
     *
     * Only works if:
     *
     * - both nodes are within the same bag,
     * - and `origin` has a greater `Score` than `lighter`.
     */
    "put_in_front_of": Anonymize<I1vj3e1a62je3o>;
    /**
     * Same as [`Pallet::put_in_front_of`], but it can be called by anyone.
     *
     * Fee is paid by the origin under all circumstances.
     */
    "put_in_front_of_other": Anonymize<I6c1t14l6giceg>;
}>;
export type Id9js0aucdivjk = {
    "dislocated": MultiAddress;
};
export type I1vj3e1a62je3o = {
    "lighter": MultiAddress;
};
export type I6c1t14l6giceg = {
    "heavier": MultiAddress;
    "lighter": MultiAddress;
};
export type I63rog5r4bv585 = AnonymousEnum<{
    /**
     * Called to indicate the start of a new session on the relay chain.
     */
    "relay_session_report": Anonymize<Ibqeqpelookfc7>;
    "relay_new_offence_paged": Anonymize<Idluhda5fs51me>;
    /**
     * Set session keys for a validator. Keys are validated on AssetHub and forwarded to RC.
     *
     * On the first call, a deposit of `KeyDeposit` is held from the stash. Subsequent calls
     * do not charge again. The deposit is released on `purge_keys`.
     *
     * **Validation on AssetHub:**
     * - Keys are decoded as `T::RelayChainSessionKeys` to ensure they match RC's expected
     * format.
     *
     * If validation passes, only the validated keys are sent to RC (with empty proof),
     * since RC trusts AH's validation.
     *
     * Note: Ownership proof validation requires PR #1739 which is not backported to
     * stable2512. The proof parameter will be added when that PR is backported.
     *
     * **Fees:**
     * The actual cost of this call is higher than what the weight-based fee estimate shows.
     * In addition to the local transaction weight fee, the stash account is charged an XCM
     * fee (delivery + RC execution cost) via `XcmExecutor::charge_fees`. The relay chain
     * uses `UnpaidExecution`, so the full remote cost is charged upfront on AssetHub.
     *
     * When called via a staking proxy, the proxy pays the transaction weight fee,
     * while the stash (delegating account) pays the XCM fee.
     *
     * **Max Fee Limit:**
     * Users can optionally specify `max_delivery_and_remote_execution_fee` to limit the
     * delivery + RC execution fee. This does not include the local transaction weight fee. If
     * the fee exceeds this limit, the operation fails with `FeesExceededMax`. Pass `None` for
     * unlimited (no cap).
     *
     * NOTE: unlike the current flow for new validators on RC (bond -> set_keys -> validate),
     * users on Asset Hub MUST call bond and validate BEFORE calling set_keys. Attempting to
     * set keys before declaring intent to validate will fail with NotValidator.
     */
    "set_keys": Anonymize<I5fth63b1m9g33>;
    /**
     * Remove session keys for a validator and release the key deposit.
     *
     * This purges the keys from the Relay Chain.
     *
     * Unlike `set_keys`, this does not require the caller to be a registered validator.
     * This is intentional: a validator who has chilled (stopped validating) should still
     * be able to purge their session keys. This matches the behavior of the original
     * `pallet-session::purge_keys` which allows anyone to call it.
     *
     * The Relay Chain will reject the call with `NoKeys` error if the account has no
     * keys set.
     *
     * **Fees:**
     * The actual cost of this call is higher than what the weight-based fee estimate shows.
     * In addition to the local transaction weight fee, the caller is charged an XCM fee
     * (delivery + RC execution cost) via `XcmExecutor::charge_fees`. The relay chain uses
     * `UnpaidExecution`, so the full remote cost is charged upfront on AssetHub.
     *
     * When called via a staking proxy, the proxy pays the transaction weight fee,
     * while the delegating account pays the XCM fee.
     *
     * **Max Fee Limit:**
     * Users can optionally specify `max_delivery_and_remote_execution_fee` to limit the
     * delivery + RC execution fee. This does not include the local transaction weight fee. If
     * the fee exceeds this limit, the operation fails with `FeesExceededMax`. Pass `None` for
     * unlimited (no cap).
     */
    "purge_keys": Anonymize<Ial45quj87eu6f>;
}>;
export type Ibqeqpelookfc7 = {
    "report": Anonymize<I3fgbanmq2lnk2>;
};
export type Idluhda5fs51me = {
    "offences": Array<[number, {
        "offender": SS58String;
        "reporters": Anonymize<Ia2lhg7l2hilo3>;
        "slash_fraction": number;
    }]>;
};
export type I5fth63b1m9g33 = {
    "keys": Uint8Array;
    "proof": Uint8Array;
    "max_delivery_and_remote_execution_fee"?: Anonymize<I35p85j063s0il>;
};
export type Ial45quj87eu6f = {
    "max_delivery_and_remote_execution_fee"?: Anonymize<I35p85j063s0il>;
};
export type I12nq1ib9qhj82 = AnonymousEnum<{
    /**
     * Manage this pallet.
     *
     * The origin of this call must be [`Config::ManagerOrigin`].
     *
     * See [`ManagerOperation`] for various operations that are possible.
     */
    "manage": Anonymize<I5gjo9p1b18ftr>;
    "admin": Anonymize<I5rijfvcqtmsdc>;
}>;
export type I5gjo9p1b18ftr = {
    "op": Enum<{
        "ForceRotateRound": undefined;
        "ForceSetPhase": Anonymize<I7d4qtdlascfk8>;
        "EmergencyFallback": undefined;
    }>;
};
export type I5rijfvcqtmsdc = {
    "op": Enum<{
        "EmergencySetSolution": [Anonymize<I4bboqsv44evel>, Anonymize<I8s6n43okuj2b1>];
        "SetMinUntrustedScore": Anonymize<I8s6n43okuj2b1>;
    }>;
};
export type I5suq7n956d9bl = AnonymousEnum<{
    /**
     * Submit an unsigned solution.
     *
     * This works very much like an inherent, as only the validators are permitted to submit
     * anything. By default validators will compute this call in their `offchain_worker` hook
     * and try and submit it back.
     *
     * This is different from signed page submission mainly in that the solution page is
     * verified on the fly.
     *
     * The `paged_solution` may contain at most [`Config::MinerPages`] pages. They are
     * interpreted as msp -> lsp, as per [`crate::Pallet::msp_range_for`].
     *
     * For example, if `Pages = 4`, and `MinerPages = 2`, our full snapshot range would be [0,
     * 1, 2, 3], with 3 being msp. But, in this case, then the `paged_raw_solution.pages` is
     * expected to correspond to `[snapshot(2), snapshot(3)]`.
     */
    "submit_unsigned": Anonymize<Ib8qhbmc61qu95>;
}>;
export type Ib8qhbmc61qu95 = {
    "paged_solution": {
        "solution_pages": Array<Anonymize<I1nvcsqg39g26j>>;
        "score": Anonymize<I8s6n43okuj2b1>;
        "round": number;
    };
};
export type Ifnfj3imdjs5t = AnonymousEnum<{
    /**
     * Register oneself for an upcoming signed election.
     */
    "register": Anonymize<I6041egnb3am04>;
    /**
     * Submit a single page of a solution.
     *
     * Must always come after [`Pallet::register`].
     *
     * `maybe_solution` can be set to `None` to erase the page.
     *
     * Collects deposits from the signed origin based on [`Config::DepositBase`] and
     * [`Config::DepositPerPage`].
     */
    "submit_page": Anonymize<I7ej7mean6mih8>;
    /**
     * Retract a submission.
     *
     * A portion of the deposit may be returned, based on the [`Config::EjectGraceRatio`].
     *
     * This will fully remove the solution from storage.
     */
    "bail": undefined;
    /**
     * Clear the data of a submitter form an old round.
     *
     * The dispatch origin of this call must be signed, and the original submitter.
     *
     * This can only be called for submissions that end up being discarded, as in they are not
     * processed and they end up lingering in the queue.
     */
    "clear_old_round_data": Anonymize<Iehi3mdadqmlp5>;
    /**
     * Set the invulnerable list.
     *
     * Dispatch origin must the the same as [`crate::Config::AdminOrigin`].
     */
    "set_invulnerables": Anonymize<Id9gv8k0nmtfsc>;
}>;
export type I6041egnb3am04 = {
    "claimed_score": Anonymize<I8s6n43okuj2b1>;
};
export type I7ej7mean6mih8 = {
    "page": number;
    "maybe_solution"?: (Anonymize<I1nvcsqg39g26j>) | undefined;
};
export type Iehi3mdadqmlp5 = {
    "round": number;
    "witness_pages": number;
};
export type Id9gv8k0nmtfsc = {
    "inv": Anonymize<Ia2lhg7l2hilo3>;
};
export type I9pf6vda7sd0qs = AnonymousEnum<{
    /**
     * Take the origin account as a stash and lock up `value` of its balance. `controller` will
     * be the account that controls it.
     *
     * `value` must be more than the `minimum_balance` specified by `T::Currency`.
     *
     * The dispatch origin for this call must be _Signed_ by the stash account.
     *
     * Emits `Bonded`.
     *
     * NOTE: Two of the storage writes (`Self::bonded`, `Self::payee`) are _never_ cleaned
     * unless the `origin` falls below _existential deposit_ (or equal to 0) and gets removed
     * as dust.
     */
    "bond": Anonymize<I2eip8tc75dpje>;
    /**
     * Add some extra amount that have appeared in the stash `free_balance` into the balance up
     * for staking.
     *
     * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
     *
     * Use this if there are additional funds in your stash account that you wish to bond.
     * Unlike [`bond`](Self::bond) or [`unbond`](Self::unbond) this function does not impose
     * any limitation on the amount that can be added.
     *
     * Emits `Bonded`.
     */
    "bond_extra": Anonymize<I564va64vtidbq>;
    /**
     * Schedule a portion of the stash to be unlocked ready for transfer out after the bond
     * period ends. If this leaves an amount actively bonded less than
     * [`asset::existential_deposit`], then it is increased to the full amount.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     *
     * Once the unlock period is done, you can call `withdraw_unbonded` to actually move
     * the funds out of management ready for transfer.
     *
     * No more than a limited number of unlocking chunks (see `MaxUnlockingChunks`)
     * can co-exists at the same time. If there are no unlocking chunks slots available
     * [`Call::withdraw_unbonded`] is called to remove some of the chunks (if possible).
     *
     * If a user encounters the `InsufficientBond` error when calling this extrinsic,
     * they should call `chill` first in order to free up their bonded funds.
     *
     * Emits `Unbonded`.
     *
     * See also [`Call::withdraw_unbonded`].
     */
    "unbond": Anonymize<Ie5v6njpckr05b>;
    /**
     * Remove any stake that has been fully unbonded and is ready for withdrawal.
     *
     * Stake is considered fully unbonded once [`Config::BondingDuration`] has elapsed since
     * the unbonding was initiated. In rare cases—such as when offences for the unbonded era
     * have been reported but not yet processed—withdrawal is restricted to eras for which
     * all offences have been processed.
     *
     * The unlocked stake will be returned as free balance in the stash account.
     *
     * The dispatch origin for this call must be _Signed_ by the controller.
     *
     * Emits `Withdrawn`.
     *
     * See also [`Call::unbond`].
     *
     * ## Parameters
     *
     * - `num_slashing_spans`: **Deprecated**. Retained only for backward compatibility; this
     * parameter has no effect.
     */
    "withdraw_unbonded": Anonymize<I328av3j0bgmjb>;
    /**
     * Declare the desire to validate for the origin controller.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     */
    "validate": Anonymize<I4tuqm9ato907i>;
    /**
     * Declare the desire to nominate `targets` for the origin controller.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     */
    "nominate": Anonymize<Iagi89qt4h1lqg>;
    /**
     * Declare no desire to either validate or nominate.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     *
     * ## Complexity
     * - Independent of the arguments. Insignificant complexity.
     * - Contains one read.
     * - Writes are limited to the `origin` account key.
     */
    "chill": undefined;
    /**
     * (Re-)set the payment target for a controller.
     *
     * Effects will be felt instantly (as soon as this function is completed successfully).
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     */
    "set_payee": Anonymize<I9dgmcnuamt5p8>;
    /**
     * (Re-)sets the controller of a stash to the stash itself. This function previously
     * accepted a `controller` argument to set the controller to an account other than the
     * stash itself. This functionality has now been removed, now only setting the controller
     * to the stash, if it is not already.
     *
     * Effects will be felt instantly (as soon as this function is completed successfully).
     *
     * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
     */
    "set_controller": undefined;
    /**
     * Sets the ideal number of validators.
     *
     * The dispatch origin must be Root.
     */
    "set_validator_count": Anonymize<I3vh014cqgmrfd>;
    /**
     * Increments the ideal number of validators up to maximum of
     * `T::MaxValidatorSet`.
     *
     * The dispatch origin must be Root.
     */
    "increase_validator_count": Anonymize<Ifhs60omlhvt3>;
    /**
     * Scale up the ideal number of validators by a factor up to maximum of
     * `T::MaxValidatorSet`.
     *
     * The dispatch origin must be Root.
     */
    "scale_validator_count": Anonymize<If34udpd5e57vi>;
    /**
     * Force there to be no new eras indefinitely.
     *
     * The dispatch origin must be Root.
     *
     * # Warning
     *
     * The election process starts multiple blocks before the end of the era.
     * Thus the election process may be ongoing when this is called. In this case the
     * election will continue until the next era is triggered.
     */
    "force_no_eras": undefined;
    /**
     * Force there to be a new era at the end of the next session. After this, it will be
     * reset to normal (non-forced) behaviour.
     *
     * The dispatch origin must be Root.
     *
     * # Warning
     *
     * The election process starts multiple blocks before the end of the era.
     * If this is called just before a new era is triggered, the election process may not
     * have enough blocks to get a result.
     */
    "force_new_era": undefined;
    /**
     * Set the validators who cannot be slashed (if any).
     *
     * The dispatch origin must be Root.
     */
    "set_invulnerables": Anonymize<I39t01nnod9109>;
    /**
     * Force a current staker to become completely unstaked, immediately.
     *
     * The dispatch origin must be Root.
     * ## Parameters
     *
     * - `stash`: The stash account to be unstaked.
     * - `num_slashing_spans`: **Deprecated**. This parameter is retained for backward
     * compatibility. It no longer has any effect.
     */
    "force_unstake": Anonymize<Ie5vbnd9198quk>;
    /**
     * Force there to be a new era at the end of sessions indefinitely.
     *
     * The dispatch origin must be Root.
     *
     * # Warning
     *
     * The election process starts multiple blocks before the end of the era.
     * If this is called just before a new era is triggered, the election process may not
     * have enough blocks to get a result.
     */
    "force_new_era_always": undefined;
    /**
     * Cancels scheduled slashes for a given era before they are applied.
     *
     * This function allows `T::AdminOrigin` to cancel pending slashes for specified validators
     * in a given era. The cancelled slashes are stored and will be checked when applying
     * slashes.
     *
     * ## Parameters
     * - `era`: The staking era for which slashes should be cancelled. This is the era where
     * the slash would be applied, not the era in which the offence was committed.
     * - `validator_slashes`: A list of validator stash accounts and their slash fractions to
     * be cancelled.
     */
    "cancel_deferred_slash": Anonymize<Ib1db5b4tm2bvc>;
    /**
     * Pay out next page of the stakers behind a validator for the given era.
     *
     * - `validator_stash` is the stash account of the validator.
     * - `era` may be any era between `[current_era - history_depth; current_era]`.
     *
     * The origin of this call must be _Signed_. Any account can call this function, even if
     * it is not one of the stakers.
     *
     * The reward payout could be paged in case there are too many nominators backing the
     * `validator_stash`. This call will payout unpaid pages in an ascending order. To claim a
     * specific page, use `payout_stakers_by_page`.`
     *
     * If all pages are claimed, it returns an error `InvalidPage`.
     */
    "payout_stakers": Anonymize<I6k6jf8ncesuu3>;
    /**
     * Rebond a portion of the stash scheduled to be unlocked.
     *
     * The dispatch origin must be signed by the controller.
     */
    "rebond": Anonymize<Ie5v6njpckr05b>;
    /**
     * Remove all data structures concerning a staker/stash once it is at a state where it can
     * be considered `dust` in the staking system. The requirements are:
     *
     * 1. the `total_balance` of the stash is below `min_chilled_bond` or is zero.
     * 2. or, the `ledger.total` of the stash is below `min_chilled_bond` or is zero.
     *
     * The former can happen in cases like a slash; the latter when a fully unbonded account
     * is still receiving staking rewards in `RewardDestination::Staked`.
     *
     * It can be called by anyone, as long as `stash` meets the above requirements.
     *
     * Refunds the transaction fees upon successful execution.
     *
     * ## Parameters
     *
     * - `stash`: The stash account to be reaped.
     * - `num_slashing_spans`: **Deprecated**. This parameter is retained for backward
     * compatibility. It no longer has any effect.
     */
    "reap_stash": Anonymize<Ie5vbnd9198quk>;
    /**
     * Remove the given nominations from the calling validator.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     *
     * - `who`: A list of nominator stash accounts who are nominating this validator which
     * should no longer be nominating this validator.
     *
     * Note: Making this call only makes sense if you first set the validator preferences to
     * block any further nominations.
     */
    "kick": Anonymize<I3qhk481i120pk>;
    /**
     * Update the various staking configurations .
     *
     * * `min_nominator_bond`: The minimum active bond needed to be a nominator.
     * * `min_validator_bond`: The minimum active bond needed to be a validator.
     * * `max_nominator_count`: The max number of users who can be a nominator at once. When
     * set to `None`, no limit is enforced.
     * * `max_validator_count`: The max number of users who can be a validator at once. When
     * set to `None`, no limit is enforced.
     * * `chill_threshold`: The ratio of `max_nominator_count` or `max_validator_count` which
     * should be filled in order for the `chill_other` transaction to work.
     * * `min_commission`: The minimum amount of commission that each validators must maintain.
     * This is checked only upon calling `validate`. Existing validators are not affected.
     *
     * RuntimeOrigin must be Root to call this function.
     *
     * NOTE: Existing nominators and validators will not be affected by this update.
     * to kick people under the new limits, `chill_other` should be called.
     */
    "set_staking_configs": Anonymize<I1640pio56addk>;
    /**
     * Declare a `controller` to stop participating as either a validator or nominator.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_, but can be called by anyone.
     *
     * If the caller is the same as the controller being targeted, then no further checks are
     * enforced, and this function behaves just like `chill`.
     *
     * If the caller is different than the controller being targeted, the following conditions
     * must be met:
     *
     * * `controller` must belong to a nominator who has become non-decodable,
     *
     * Or:
     *
     * * A `ChillThreshold` must be set and checked which defines how close to the max
     * nominators or validators we must reach before users can start chilling one-another.
     * * A `MaxNominatorCount` and `MaxValidatorCount` must be set which is used to determine
     * how close we are to the threshold.
     * * A `MinNominatorBond` and `MinValidatorBond` must be set and checked, which determines
     * if this is a person that should be chilled because they have not met the threshold
     * bond required.
     *
     * This can be helpful if bond requirements are updated, and we need to remove old users
     * who do not satisfy these requirements.
     */
    "chill_other": Anonymize<Idl3umm12u5pa>;
    /**
     * Force a validator to have at least the minimum commission. This will not affect a
     * validator who already has a commission greater than or equal to the minimum. Any account
     * can call this.
     */
    "force_apply_min_commission": Anonymize<I5ont0141q9ss5>;
    /**
     * Sets the minimum amount of commission that each validators must maintain.
     *
     * This call has lower privilege requirements than `set_staking_config` and can be called
     * by the `T::AdminOrigin`. Root can always call this.
     */
    "set_min_commission": Anonymize<I3vh014cqgmrfd>;
    /**
     * Pay out a page of the stakers behind a validator for the given era and page.
     *
     * - `validator_stash` is the stash account of the validator.
     * - `era` may be any era between `[current_era - history_depth; current_era]`.
     * - `page` is the page index of nominators to pay out with value between 0 and
     * `num_nominators / T::MaxExposurePageSize`.
     *
     * The origin of this call must be _Signed_. Any account can call this function, even if
     * it is not one of the stakers.
     *
     * If a validator has more than [`Config::MaxExposurePageSize`] nominators backing
     * them, then the list of nominators is paged, with each page being capped at
     * [`Config::MaxExposurePageSize`.] If a validator has more than one page of nominators,
     * the call needs to be made for each page separately in order for all the nominators
     * backing a validator to receive the reward. The nominators are not sorted across pages
     * and so it should not be assumed the highest staker would be on the topmost page and vice
     * versa. If rewards are not claimed in [`Config::HistoryDepth`] eras, they are lost.
     */
    "payout_stakers_by_page": Anonymize<Ie6j49utvii126>;
    /**
     * Migrates an account's `RewardDestination::Controller` to
     * `RewardDestination::Account(controller)`.
     *
     * Effects will be felt instantly (as soon as this function is completed successfully).
     *
     * This will waive the transaction fee if the `payee` is successfully migrated.
     */
    "update_payee": Anonymize<I3v6ks33uluhnj>;
    /**
     * Updates a batch of controller accounts to their corresponding stash account if they are
     * not the same. Ignores any controller accounts that do not exist, and does not operate if
     * the stash and controller are already the same.
     *
     * Effects will be felt instantly (as soon as this function is completed successfully).
     *
     * The dispatch origin must be `T::AdminOrigin`.
     */
    "deprecate_controller_batch": Anonymize<I3kiiim1cds68i>;
    /**
     * Restores the state of a ledger which is in an inconsistent state.
     *
     * The requirements to restore a ledger are the following:
     * * The stash is bonded; or
     * * The stash is not bonded but it has a staking lock left behind; or
     * * If the stash has an associated ledger and its state is inconsistent; or
     * * If the ledger is not corrupted *but* its staking lock is out of sync.
     *
     * The `maybe_*` input parameters will overwrite the corresponding data and metadata of the
     * ledger associated with the stash. If the input parameters are not set, the ledger will
     * be reset values from on-chain state.
     */
    "restore_ledger": Anonymize<I4k60mkh2r6jjg>;
    /**
     * Migrates permissionlessly a stash from locks to holds.
     *
     * This removes the old lock on the stake and creates a hold on it atomically. If all
     * stake cannot be held, the best effort is made to hold as much as possible. The remaining
     * stake is removed from the ledger.
     *
     * The fee is waived if the migration is successful.
     */
    "migrate_currency": Anonymize<Idl3umm12u5pa>;
    /**
     * Manually and permissionlessly applies a deferred slash for a given era.
     *
     * Normally, slashes are automatically applied shortly after the start of the `slash_era`.
     * The automatic application of slashes is handled by the pallet's internal logic, and it
     * tries to apply one slash page per block of the era.
     * If for some reason, one era is not enough for applying all slash pages, the remaining
     * slashes need to be manually (permissionlessly) applied.
     *
     * For a given era x, if at era x+1, slashes are still unapplied, all withdrawals get
     * blocked, and these need to be manually applied by calling this function.
     * This function exists as a **fallback mechanism** for this extreme situation, but we
     * never expect to encounter this in normal scenarios.
     *
     * The parameters for this call can be queried by looking at the `UnappliedSlashes` storage
     * for eras older than the active era.
     *
     * ## Parameters
     * - `slash_era`: The staking era in which the slash was originally scheduled.
     * - `slash_key`: A unique identifier for the slash, represented as a tuple:
     * - `stash`: The stash account of the validator being slashed.
     * - `slash_fraction`: The fraction of the stake that was slashed.
     * - `page_index`: The index of the exposure page being processed.
     *
     * ## Behavior
     * - The function is **permissionless**—anyone can call it.
     * - The `slash_era` **must be the current era or a past era**.
     * If it is in the future, the
     * call fails with `EraNotStarted`.
     * - The fee is waived if the slash is successfully applied.
     *
     * ## Future Improvement
     * - Implement an **off-chain worker (OCW) task** to automatically apply slashes when there
     * is unused block space, improving efficiency.
     */
    "apply_slash": Anonymize<I70mou2rha6f5o>;
    /**
     * Perform one step of era pruning to prevent PoV size exhaustion from unbounded deletions.
     *
     * This extrinsic enables permissionless lazy pruning of era data by performing
     * incremental deletion of storage items. Each call processes a limited number
     * of items based on available block weight to avoid exceeding block limits.
     *
     * Returns `Pays::No` when work is performed to incentivize regular maintenance.
     * Anyone can call this to help maintain the chain's storage health.
     *
     * The era must be eligible for pruning (older than HistoryDepth + 1).
     * Check `EraPruningState` storage to see if an era needs pruning before calling.
     */
    "prune_era_step": Anonymize<I9bur6p3ovq9mo>;
}>;
export type I2eip8tc75dpje = {
    "value": bigint;
    "payee": StakingRewardDestination;
};
export type I564va64vtidbq = {
    "max_additional": bigint;
};
export type I328av3j0bgmjb = {
    "num_slashing_spans": number;
};
export type I4tuqm9ato907i = {
    "prefs": Anonymize<I9o7ssi9vmhmgr>;
};
export type Iagi89qt4h1lqg = {
    "targets": Anonymize<I28gn91b2ttnbk>;
};
export type I28gn91b2ttnbk = Array<MultiAddress>;
export type I9dgmcnuamt5p8 = {
    "payee": StakingRewardDestination;
};
export type Ifhs60omlhvt3 = {
    "additional": number;
};
export type If34udpd5e57vi = {
    "factor": number;
};
export type Ie5vbnd9198quk = {
    "stash": SS58String;
    "num_slashing_spans": number;
};
export type Ib1db5b4tm2bvc = {
    "era": number;
    "validator_slashes": Anonymize<I205qrookusi3d>;
};
export type I6k6jf8ncesuu3 = {
    "validator_stash": SS58String;
    "era": number;
};
export type I3qhk481i120pk = {
    "who": Anonymize<I28gn91b2ttnbk>;
};
export type I1640pio56addk = {
    "min_nominator_bond": StakingPalletConfigOpBig;
    "min_validator_bond": StakingPalletConfigOpBig;
    "max_nominator_count": StakingPalletConfigOp;
    "max_validator_count": StakingPalletConfigOp;
    "chill_threshold": StakingPalletConfigOp;
    "min_commission": StakingPalletConfigOp;
    "max_staked_rewards": StakingPalletConfigOp;
    "are_nominators_slashable": Enum<{
        "Noop": undefined;
        "Set": boolean;
        "Remove": undefined;
    }>;
};
export type I5ont0141q9ss5 = {
    "validator_stash": SS58String;
};
export type Ie6j49utvii126 = {
    "validator_stash": SS58String;
    "era": number;
    "page": number;
};
export type I3v6ks33uluhnj = {
    "controller": SS58String;
};
export type I3kiiim1cds68i = {
    "controllers": Anonymize<Ia2lhg7l2hilo3>;
};
export type I4k60mkh2r6jjg = {
    "stash": SS58String;
    "maybe_controller"?: Anonymize<Ihfphjolmsqq1>;
    "maybe_total"?: Anonymize<I35p85j063s0il>;
    "maybe_unlocking"?: (Anonymize<I9nc4v1upo2c8e>) | undefined;
};
export type I70mou2rha6f5o = {
    "slash_era": number;
    "slash_key": Anonymize<Id32h28hjj1tch>;
};
export type I9bur6p3ovq9mo = {
    "era": number;
};
export type I4o0omq8ti34ea = AnonymousEnum<{
    /**
     * A raw EVM transaction, typically dispatched by an Ethereum JSON-RPC server.
     *
     * # Parameters
     *
     * * `payload`: The encoded [`crate::evm::TransactionSigned`].
     *
     * # Note
     *
     * This call cannot be dispatched directly; attempting to do so will result in a failed
     * transaction. It serves as a wrapper for an Ethereum transaction. When submitted, the
     * runtime converts it into a [`sp_runtime::generic::CheckedExtrinsic`] by recovering the
     * signer and validating the transaction.
     */
    "eth_transact": Anonymize<Ida37oe44osb06>;
    /**
     * Makes a call to an account, optionally transferring some balance.
     *
     * # Parameters
     *
     * * `dest`: Address of the contract to call.
     * * `value`: The balance to transfer from the `origin` to `dest`.
     * * `weight_limit`: The weight limit enforced when executing the constructor.
     * * `storage_deposit_limit`: The maximum amount of balance that can be charged from the
     * caller to pay for the storage consumed.
     * * `data`: The input data to pass to the contract.
     *
     * * If the account is a smart-contract account, the associated code will be
     * executed and any value will be transferred.
     * * If the account is a regular account, any value will be transferred.
     * * If no account exists and the call value is not less than `existential_deposit`,
     * a regular account will be created and any value will be transferred.
     */
    "call": Anonymize<I6v02o6j4snahe>;
    /**
     * Instantiates a contract from a previously deployed vm binary.
     *
     * This function is identical to [`Self::instantiate_with_code`] but without the
     * code deployment step. Instead, the `code_hash` of an on-chain deployed vm binary
     * must be supplied.
     */
    "instantiate": Anonymize<I27569neuh5t1o>;
    /**
     * Instantiates a new contract from the supplied `code` optionally transferring
     * some balance.
     *
     * This dispatchable has the same effect as calling [`Self::upload_code`] +
     * [`Self::instantiate`]. Bundling them together provides efficiency gains. Please
     * also check the documentation of [`Self::upload_code`].
     *
     * # Parameters
     *
     * * `value`: The balance to transfer from the `origin` to the newly created contract.
     * * `weight_limit`: The weight limit enforced when executing the constructor.
     * * `storage_deposit_limit`: The maximum amount of balance that can be charged/reserved
     * from the caller to pay for the storage consumed.
     * * `code`: The contract code to deploy in raw bytes.
     * * `data`: The input data to pass to the contract constructor.
     * * `salt`: Used for the address derivation. If `Some` is supplied then `CREATE2`
     * semantics are used. If `None` then `CRATE1` is used.
     *
     *
     * Instantiation is executed as follows:
     *
     * - The supplied `code` is deployed, and a `code_hash` is created for that code.
     * - If the `code_hash` already exists on the chain the underlying `code` will be shared.
     * - The destination address is computed based on the sender, code_hash and the salt.
     * - The smart-contract account is created at the computed address.
     * - The `value` is transferred to the new account.
     * - The `deploy` function is executed in the context of the newly-created account.
     */
    "instantiate_with_code": Anonymize<Id92o6smntb9m5>;
    /**
     * Same as [`Self::instantiate_with_code`], but intended to be dispatched **only**
     * by an EVM transaction through the EVM compatibility layer.
     *
     * # Parameters
     *
     * * `value`: The balance to transfer from the `origin` to the newly created contract.
     * * `weight_limit`: The gas limit used to derive the transaction weight for transaction
     * payment
     * * `eth_gas_limit`: The Ethereum gas limit governing the resource usage of the execution
     * * `code`: The contract code to deploy in raw bytes.
     * * `data`: The input data to pass to the contract constructor.
     * * `transaction_encoded`: The RLP encoding of the signed Ethereum transaction,
     * represented as [crate::evm::TransactionSigned], provided by the Ethereum wallet. This
     * is used for building the Ethereum transaction root.
     * * effective_gas_price: the price of a unit of gas
     * * encoded len: the byte code size of the `eth_transact` extrinsic
     *
     * Calling this dispatchable ensures that the origin's nonce is bumped only once,
     * via the `CheckNonce` transaction extension. In contrast, [`Self::instantiate_with_code`]
     * also bumps the nonce after contract instantiation, since it may be invoked multiple
     * times within a batch call transaction.
     */
    "eth_instantiate_with_code": Anonymize<I5nmb2hfkgk9ol>;
    /**
     * Same as [`Self::call`], but intended to be dispatched **only**
     * by an EVM transaction through the EVM compatibility layer.
     *
     * # Parameters
     *
     * * `dest`: The Ethereum address of the account to be called
     * * `value`: The balance to transfer from the `origin` to the newly created contract.
     * * `weight_limit`: The gas limit used to derive the transaction weight for transaction
     * payment
     * * `eth_gas_limit`: The Ethereum gas limit governing the resource usage of the execution
     * * `data`: The input data to pass to the contract constructor.
     * * `transaction_encoded`: The RLP encoding of the signed Ethereum transaction,
     * represented as [crate::evm::TransactionSigned], provided by the Ethereum wallet. This
     * is used for building the Ethereum transaction root.
     * * effective_gas_price: the price of a unit of gas
     * * encoded len: the byte code size of the `eth_transact` extrinsic
     */
    "eth_call": Anonymize<Iav55bcqlrqn51>;
    /**
     * Executes a Substrate runtime call from an Ethereum transaction.
     *
     * This dispatchable is intended to be called **only** through the EVM compatibility
     * layer. The provided call will be dispatched using `RawOrigin::Signed`.
     *
     * # Parameters
     *
     * * `origin`: Must be an [`Origin::EthTransaction`] origin.
     * * `call`: The Substrate runtime call to execute.
     * * `transaction_encoded`: The RLP encoding of the Ethereum transaction,
     */
    "eth_substrate_call": Anonymize<I6epk3rkifmg7p>;
    /**
     * Upload new `code` without instantiating a contract from it.
     *
     * If the code does not already exist a deposit is reserved from the caller
     * The size of the reserve depends on the size of the supplied `code`.
     *
     * # Note
     *
     * Anyone can instantiate a contract from any uploaded code and thus prevent its removal.
     * To avoid this situation a constructor could employ access control so that it can
     * only be instantiated by permissioned entities. The same is true when uploading
     * through [`Self::instantiate_with_code`].
     *
     * If the refcount of the code reaches zero after terminating the last contract that
     * references this code, the code will be removed automatically.
     */
    "upload_code": Anonymize<I10ra4g1rl6k2f>;
    /**
     * Remove the code stored under `code_hash` and refund the deposit to its owner.
     *
     * A code can only be removed by its original uploader (its owner) and only if it is
     * not used by any contract.
     */
    "remove_code": Anonymize<Ib51vk42m1po4n>;
    /**
     * Privileged function that changes the code of an existing contract.
     *
     * This takes care of updating refcounts and all other necessary operations. Returns
     * an error if either the `code_hash` or `dest` do not exist.
     *
     * # Note
     *
     * This does **not** change the address of the contract in question. This means
     * that the contract address is no longer derived from its code hash after calling
     * this dispatchable.
     */
    "set_code": Anonymize<I1uihehkdsggvp>;
    /**
     * Register the callers account id so that it can be used in contract interactions.
     *
     * This will error if the origin is already mapped or is a eth native `Address20`. It will
     * take a deposit that can be released by calling [`Self::unmap_account`].
     */
    "map_account": undefined;
    /**
     * Unregister the callers account id in order to free the deposit.
     *
     * There is no reason to ever call this function other than freeing up the deposit.
     * This is only useful when the account should no longer be used.
     */
    "unmap_account": undefined;
    /**
     * Dispatch an `call` with the origin set to the callers fallback address.
     *
     * Every `AccountId32` can control its corresponding fallback account. The fallback account
     * is the `AccountId20` with the last 12 bytes set to `0xEE`. This is essentially a
     * recovery function in case an `AccountId20` was used without creating a mapping first.
     */
    "dispatch_as_fallback_account": Anonymize<I4re2nri9v0i54>;
}>;
export type Ida37oe44osb06 = {
    "payload": Uint8Array;
};
export type I6v02o6j4snahe = {
    "dest": SizedHex<20>;
    "value": bigint;
    "weight_limit": Anonymize<I4q39t5hn830vp>;
    "storage_deposit_limit": bigint;
    "data": Uint8Array;
};
export type I27569neuh5t1o = {
    "value": bigint;
    "weight_limit": Anonymize<I4q39t5hn830vp>;
    "storage_deposit_limit": bigint;
    "code_hash": SizedHex<32>;
    "data": Uint8Array;
    "salt"?: Anonymize<I4s6vifaf8k998>;
};
export type Id92o6smntb9m5 = {
    "value": bigint;
    "weight_limit": Anonymize<I4q39t5hn830vp>;
    "storage_deposit_limit": bigint;
    "code": Uint8Array;
    "data": Uint8Array;
    "salt"?: Anonymize<I4s6vifaf8k998>;
};
export type I5nmb2hfkgk9ol = {
    "value": Anonymize<I4totqt881mlti>;
    "weight_limit": Anonymize<I4q39t5hn830vp>;
    "eth_gas_limit": Anonymize<I4totqt881mlti>;
    "code": Uint8Array;
    "data": Uint8Array;
    "transaction_encoded": Uint8Array;
    "effective_gas_price": Anonymize<I4totqt881mlti>;
    "encoded_len": number;
};
export type Iav55bcqlrqn51 = {
    "dest": SizedHex<20>;
    "value": Anonymize<I4totqt881mlti>;
    "weight_limit": Anonymize<I4q39t5hn830vp>;
    "eth_gas_limit": Anonymize<I4totqt881mlti>;
    "data": Uint8Array;
    "transaction_encoded": Uint8Array;
    "effective_gas_price": Anonymize<I4totqt881mlti>;
    "encoded_len": number;
};
export type I6epk3rkifmg7p = {
    "call": TxCallData;
    "transaction_encoded": Uint8Array;
};
export type I10ra4g1rl6k2f = {
    "code": Uint8Array;
    "storage_deposit_limit": bigint;
};
export type I1uihehkdsggvp = {
    "dest": SizedHex<20>;
    "code_hash": SizedHex<32>;
};
export type Il4cd6i49cqer = AnonymousEnum<{
    /**
     * Authenticates the sudo key and dispatches a function call with `Root` origin.
     */
    "sudo": Anonymize<I4re2nri9v0i54>;
    /**
     * Authenticates the sudo key and dispatches a function call with `Root` origin.
     * This function does not check the weight of the call, and instead allows the
     * Sudo user to specify the weight of the call.
     *
     * The dispatch origin for this call must be _Signed_.
     */
    "sudo_unchecked_weight": Anonymize<I81cj956at2rp6>;
    /**
     * Authenticates the current sudo key and sets the given AccountId (`new`) as the new sudo
     * key.
     */
    "set_key": Anonymize<I8k3rnvpeeh4hv>;
    /**
     * Authenticates the sudo key and dispatches a function call with `Signed` origin from
     * a given account.
     *
     * The dispatch origin for this call must be _Signed_.
     */
    "sudo_as": Anonymize<Ib96tka8srenvk>;
    /**
     * Permanently removes the sudo key.
     *
     * **This cannot be un-done.**
     */
    "remove_key": undefined;
}>;
export type I8k3rnvpeeh4hv = {
    "new": MultiAddress;
};
export type Ib96tka8srenvk = {
    "who": MultiAddress;
    "call": TxCallData;
};
export type Im5s4mco7v75d = AnonymousEnum<{
    /**
     * Unreserve the deposit that was taken for creating a crowdloan.
     *
     * This can be called by any signed origin. It unreserves the lease deposit on the account
     * that won the lease auction. It can be unreserved once all leases expired. Note that it
     * will be called automatically from `withdraw_crowdloan_contribution` for the matching
     * crowdloan account.
     *
     * Solo bidder accounts that won lease auctions can use this to unreserve their amount.
     */
    "unreserve_lease_deposit": Anonymize<Ikkngcosp7bof>;
    /**
     * Withdraw the contribution of a finished crowdloan.
     *
     * A crowdloan contribution can be withdrawn if either:
     * - The crowdloan failed to in an auction and timed out
     * - Won an auction and all leases expired
     *
     * Can be called by any signed origin.
     */
    "withdraw_crowdloan_contribution": Anonymize<Ikkngcosp7bof>;
    /**
     * Unreserve the deposit that was taken for creating a crowdloan.
     *
     * This can be called once either:
     * - The crowdloan failed to win an auction and timed out
     * - Won an auction, all leases expired and all contributions are withdrawn
     *
     * Can be called by any signed origin. The condition that all contributions are withdrawn
     * is in place since the reserve acts as a storage deposit.
     */
    "unreserve_crowdloan_reserve": Anonymize<Ikkngcosp7bof>;
    /**
     * Transfer the balance from the pre-migration treasury account to the post-migration
     * treasury account.
     *
     * This call can only be called after the migration is completed.
     */
    "transfer_to_post_migration_treasury": Anonymize<I22bm4d7re21j9>;
    /**
     * Translate recursively derived parachain sovereign child account to its sibling.
     *
     * Uses the same derivation path on the sibling. The old and new account arguments are only
     * witness data to ensure correct usage. Can only be called by the `MigrateOrigin`.
     *
     * This migrates:
     * - Native DOT balance
     * - All assets listed in `T::RelevantAssets`
     * - Staked balances
     *
     * Things like non-relevant assets or vested transfers may remain on the old account.
     */
    "translate_para_sovereign_child_to_sibling_derived": Anonymize<Idq94m670fbari>;
}>;
export type Ikkngcosp7bof = {
    "block": number;
    "depositor"?: Anonymize<Ihfphjolmsqq1>;
    "para_id": number;
};
export type Idq94m670fbari = {
    "para_id": number;
    "derivation_path": Anonymize<Icgljjb6j82uhn>;
    "old_account": SS58String;
    "new_account": SS58String;
};
export type Ifr68a89kga40l = AnonymousEnum<{
    /**
     * Receive accounts from the Relay Chain.
     *
     * The accounts sent with `pallet_rc_migrator::Pallet::migrate_accounts` function.
     */
    "receive_accounts": Anonymize<Ifioonc6ic974t>;
    /**
     * Receive multisigs from the Relay Chain.
     *
     * This will be called from an XCM `Transact` inside a DMP from the relay chain. The
     * multisigs were prepared by
     * `pallet_rc_migrator::multisig::MultisigMigrator::migrate_many`.
     */
    "receive_multisigs": Anonymize<I72qfv83rhp4qr>;
    /**
     * Receive proxies from the Relay Chain.
     */
    "receive_proxy_proxies": Anonymize<I1sdjtg0mom46u>;
    /**
     * Receive proxy announcements from the Relay Chain.
     */
    "receive_proxy_announcements": Anonymize<Ibcsrif5qnktv4>;
    "receive_preimage_chunks": Anonymize<Ifsa6pjvc8t5vn>;
    "receive_preimage_request_status": Anonymize<I64udjlb3l43q9>;
    "receive_preimage_legacy_status": Anonymize<Ic0j854aucsgjh>;
    "receive_nom_pools_messages": Anonymize<I2gvrhmhj0moqc>;
    "receive_vesting_schedules": Anonymize<I65qh88839sl2u>;
    /**
     * Receive referendum counts, deciding counts, votes for the track queue.
     */
    "receive_referenda_values": Anonymize<I43641g81fhl82>;
    /**
     * Receive referendums from the Relay Chain.
     */
    "receive_referendums": Anonymize<I9ibr6lih6j2ou>;
    "receive_claims": Anonymize<I935tki4voiobr>;
    "receive_bags_list_messages": Anonymize<I4j0tlbg1g4hnk>;
    "receive_scheduler_messages": Anonymize<Ifqt5asg9c3kl9>;
    "receive_indices": Anonymize<I9ii4hnjt4vc2j>;
    "receive_conviction_voting_messages": Anonymize<Idjvt48j5plqih>;
    "receive_bounties_messages": Anonymize<I1gnvp8b47fj27>;
    "receive_asset_rates": Anonymize<Iavl169paa5dbb>;
    "receive_crowdloan_messages": Anonymize<I835djvt3d32hf>;
    "receive_referenda_metadata": Anonymize<I3ktkk856tqa2t>;
    "receive_treasury_messages": Anonymize<I57cq79pckivve>;
    "receive_scheduler_agenda_messages": Anonymize<I8hv3mpjd5kvbj>;
    "receive_delegated_staking_messages": Anonymize<I2tap0v9vk3h8h>;
    "receive_child_bounties_messages": Anonymize<Id55jp9esfn3s7>;
    "receive_staking_messages": Anonymize<I3jftp5j4o8mk5>;
    /**
     * Set the migration stage.
     *
     * This call is intended for emergency use only and is guarded by the
     * [`Config::AdminOrigin`].
     */
    "force_set_stage": Anonymize<Ics4uc7qr0bv8t>;
    /**
     * Start the data migration.
     *
     * This is typically called by the Relay Chain to start the migration on the Asset Hub and
     * receive a handshake message indicating the Asset Hub's readiness.
     */
    "start_migration": undefined;
    /**
     * Set the DMP queue priority configuration.
     *
     * Can only be called by the `AdminOrigin`.
     */
    "set_dmp_queue_priority": Anonymize<I5sgsmd01vj1nq>;
    /**
     * Set the manager account id.
     *
     * The manager has the similar to [`Config::AdminOrigin`] privileges except that it
     * can not set the manager account id via `set_manager` call.
     */
    "set_manager": Anonymize<I6kmjpgojp035v>;
    /**
     * Finish the migration.
     *
     * This is typically called by the Relay Chain to signal the migration has finished.
     *
     * The `data` parameter might be `None` if we are running the migration for a second time
     * for some pallets and have already performed the checking account balance correction,
     * so we do not need to do it this time.
     */
    "finish_migration": Anonymize<Ibacrca7stumsr>;
    /**
     * XCM send call identical to the [`pallet_xcm::Pallet::send`] call but with the
     * [Config::SendXcm] router which will be able to send messages to the Relay Chain during
     * the migration.
     */
    "send_xcm_message": Anonymize<Ia5cotcvi888ln>;
}>;
export type Ifioonc6ic974t = {
    "accounts": Array<Anonymize<Ifb0kt7cu5a61c>>;
};
export type I72qfv83rhp4qr = {
    "accounts": Array<{
        "creator": SS58String;
        "deposit": bigint;
    }>;
};
export type I1sdjtg0mom46u = {
    "proxies": Array<{
        "delegator": SS58String;
        "deposit": bigint;
        "proxies": Array<{
            "delegate": SS58String;
            "proxy_type": Enum<{
                "Any": undefined;
                "NonTransfer": undefined;
                "Governance": undefined;
                "Staking": undefined;
                "CancelProxy": undefined;
                "Auction": undefined;
                "NominationPools": undefined;
                "ParaRegistration": undefined;
                "StakingOperator": undefined;
            }>;
            "delay": number;
        }>;
    }>;
};
export type Ibcsrif5qnktv4 = {
    "announcements": Array<{
        "depositor": SS58String;
        "deposit": bigint;
    }>;
};
export type Ifsa6pjvc8t5vn = {
    "chunks": Array<{
        "preimage_hash": SizedHex<32>;
        "preimage_len": number;
        "chunk_byte_offset": number;
        "chunk_bytes": Uint8Array;
    }>;
};
export type I64udjlb3l43q9 = {
    "request_status": Array<{
        "hash": SizedHex<32>;
        "request_status": Enum<{
            "Unrequested": {
                "ticket": Anonymize<I92tce08cbhnmn>;
                "len": number;
            };
            "Requested": {
                "maybe_ticket"?: (Anonymize<I92tce08cbhnmn>) | undefined;
                "count": number;
                "maybe_len"?: Anonymize<I4arjljr6dpflb>;
            };
        }>;
    }>;
};
export type I92tce08cbhnmn = [SS58String, Uint8Array];
export type Ic0j854aucsgjh = {
    "legacy_status": Array<{
        "hash": SizedHex<32>;
        "depositor": SS58String;
        "deposit": bigint;
    }>;
};
export type I2gvrhmhj0moqc = {
    "messages": Array<Enum<{
        "StorageValues": {
            "values": {
                "total_value_locked"?: Anonymize<I35p85j063s0il>;
                "min_join_bond"?: Anonymize<I35p85j063s0il>;
                "min_create_bond"?: Anonymize<I35p85j063s0il>;
                "max_pools"?: Anonymize<I4arjljr6dpflb>;
                "max_pool_members"?: Anonymize<I4arjljr6dpflb>;
                "max_pool_members_per_pool"?: Anonymize<I4arjljr6dpflb>;
                "global_max_commission"?: Anonymize<I4arjljr6dpflb>;
                "last_pool_id"?: Anonymize<I4arjljr6dpflb>;
            };
        };
        "PoolMembers": {
            "member": [SS58String, Anonymize<Idphjddn2h69vc>];
        };
        "BondedPools": {
            "pool": [number, Anonymize<Idhh9vuu2bderg>];
        };
        "RewardPools": {
            "rewards": [number, Anonymize<If6qa32dj75gu1>];
        };
        "SubPoolsStorage": {
            "sub_pools": [number, Anonymize<I7oo2mprv1qd1s>];
        };
        "Metadata": {
            "meta": Anonymize<Icp9h5ma02v1rg>;
        };
        "ReversePoolIdLookup": {
            "lookups": Anonymize<I6ouflveob4eli>;
        };
        "ClaimPermissions": {
            "perms": [SS58String, NominationPoolsClaimPermission];
        };
    }>>;
};
export type Icp9h5ma02v1rg = [number, Uint8Array];
export type I65qh88839sl2u = {
    "schedules": Array<{
        "who": SS58String;
        "schedules": Anonymize<Ifble4juuml5ig>;
    }>;
};
export type I43641g81fhl82 = {
    "values": Array<{
        "referendum_count"?: Anonymize<I4arjljr6dpflb>;
        "deciding_count": Anonymize<Iep4uo61810hfs>;
        "track_queue": Array<[number, Anonymize<If9jidduiuq7vv>]>;
    }>;
};
export type I9ibr6lih6j2ou = {
    "referendums": Array<[number, Enum<{
        "Ongoing": {
            "track": number;
            "origin": Anonymize<Ibg47me9hgvdgi>;
            "proposal": PreimagesBounded;
            "enactment": TraitsScheduleDispatchTime;
            "submitted": number;
            "submission_deposit": Anonymize<Id5fm4p8lj5qgi>;
            "decision_deposit"?: Anonymize<Ibd24caul84kv2>;
            "deciding"?: Anonymize<Ibcbcndfmk0jd9>;
            "tally": Anonymize<Ifsk7cbmtit1jd>;
            "in_queue": boolean;
            "alarm"?: Anonymize<I3aj03qk2o5mdm>;
        };
        "Approved": Anonymize<Ini94eljn5lj8>;
        "Rejected": Anonymize<Ini94eljn5lj8>;
        "Cancelled": Anonymize<Ini94eljn5lj8>;
        "TimedOut": Anonymize<Ini94eljn5lj8>;
        "Killed": number;
    }>]>;
};
export type Ibg47me9hgvdgi = AnonymousEnum<{
    "system": Anonymize<I9gqitj4t615g3>;
    "Origins": GovernanceOrigin;
}>;
export type I935tki4voiobr = {
    "messages": Array<Enum<{
        "StorageValues": {
            "total": bigint;
        };
        "Claims": [SizedHex<20>, bigint];
        "Vesting": {
            "who": SizedHex<20>;
            "schedule": Anonymize<I2phecamkn3pej>;
        };
        "Signing": [SizedHex<20>, ClaimsStatementKind];
        "Preclaims": [SS58String, SizedHex<20>];
    }>>;
};
export type I4j0tlbg1g4hnk = {
    "messages": Array<Enum<{
        "Node": {
            "id": SS58String;
            "node": Anonymize<Ic5t26f9cp3tvk>;
        };
        "Bag": {
            "score": bigint;
            "bag": {
                "head"?: Anonymize<Ihfphjolmsqq1>;
                "tail"?: Anonymize<Ihfphjolmsqq1>;
                "bag_upper": bigint;
            };
        };
    }>>;
};
export type Ifqt5asg9c3kl9 = {
    "messages": Array<Enum<{
        "IncompleteSince": number;
        "Retries": [Anonymize<I9jd27rnpm8ttv>, Anonymize<I56u24ncejr5kt>];
        "Lookup": [SizedHex<32>, Anonymize<I9jd27rnpm8ttv>];
    }>>;
};
export type I9ii4hnjt4vc2j = {
    "indices": Array<{
        "index": number;
        "who": SS58String;
        "deposit": bigint;
        "frozen": boolean;
    }>;
};
export type Idjvt48j5plqih = {
    "messages": Array<Enum<{
        "VotingFor": [SS58String, number, ConvictionVotingVoteVoting];
        "ClassLocksFor": [SS58String, Anonymize<If9jidduiuq7vv>];
    }>>;
};
export type I1gnvp8b47fj27 = {
    "messages": Array<Enum<{
        "BountyCount": number;
        "BountyApprovals": Anonymize<Icgljjb6j82uhn>;
        "BountyDescriptions": Anonymize<Icp9h5ma02v1rg>;
        "Bounties": [number, Anonymize<Ict0fmb8krq1lk>];
    }>>;
};
export type Iavl169paa5dbb = {
    "rates": Array<[Anonymize<I2q3ri6itcjj5u>, bigint]>;
};
export type I835djvt3d32hf = {
    "messages": Array<Enum<{
        "LeaseReserve": {
            "unreserve_block": number;
            "account": SS58String;
            "para_id": number;
            "amount": bigint;
        };
        "CrowdloanContribution": {
            "withdraw_block": number;
            "contributor": SS58String;
            "para_id": number;
            "amount": bigint;
            "crowdloan_account": SS58String;
        };
        "CrowdloanReserve": {
            "unreserve_block": number;
            "depositor": SS58String;
            "para_id": number;
            "amount": bigint;
        };
    }>>;
};
export type I3ktkk856tqa2t = {
    "metadata": Anonymize<Iqnbvitf7a7l3>;
};
export type I57cq79pckivve = {
    "messages": Array<Enum<{
        "ProposalCount": number;
        "Proposals": [number, Anonymize<Iegmj7n48sc3am>];
        "Approvals": Anonymize<Icgljjb6j82uhn>;
        "SpendCount": number;
        "Spends": {
            "id": number;
            "status": {
                "asset_kind": Anonymize<I2q3ri6itcjj5u>;
                "amount": bigint;
                "beneficiary": XcmVersionedLocation;
                "valid_from": number;
                "expire_at": number;
                "status": TreasuryPaymentState;
            };
        };
        "LastSpendPeriod"?: Anonymize<I4arjljr6dpflb>;
        "Funds": undefined;
    }>>;
};
export type I8hv3mpjd5kvbj = {
    "messages": Array<{
        "block": number;
        "agenda": Array<({
            "maybe_id"?: Anonymize<I4s6vifaf8k998>;
            "priority": number;
            "call": PreimagesBounded;
            "maybe_periodic"?: Anonymize<Iep7au1720bm0e>;
            "origin": Anonymize<Ibg47me9hgvdgi>;
        }) | undefined>;
    }>;
};
export type I2tap0v9vk3h8h = {
    "messages": Array<Enum<{
        "Delegators": Anonymize<Id2aanom2jncf1>;
        "Agents": {
            "agent": SS58String;
            "payee": SS58String;
            "total_delegated": bigint;
            "unclaimed_withdrawals": bigint;
            "pending_slash": bigint;
        };
    }>>;
};
export type Id55jp9esfn3s7 = {
    "messages": Array<Enum<{
        "ChildBountyCount": number;
        "ParentChildBounties": Anonymize<I9jd27rnpm8ttv>;
        "ParentTotalChildBounties": Anonymize<I9jd27rnpm8ttv>;
        "ChildBounty": {
            "parent_id": number;
            "child_id": number;
            "child_bounty": Anonymize<Ibofbvvaehln4e>;
        };
        "ChildBountyDescriptionsV1": {
            "parent_id": number;
            "child_id": number;
            "description": Uint8Array;
        };
        "V0ToV1ChildBountyIds": {
            "v0_child_id": number;
            "parent_id": number;
            "v1_child_id": number;
        };
        "ChildrenCuratorFees": {
            "child_id": number;
            "amount": bigint;
        };
    }>>;
};
export type I3jftp5j4o8mk5 = {
    "messages": Array<Enum<{
        "Values": {
            "validator_count"?: Anonymize<I4arjljr6dpflb>;
            "min_validator_count"?: Anonymize<I4arjljr6dpflb>;
            "min_nominator_bond"?: Anonymize<I35p85j063s0il>;
            "min_validator_bond"?: Anonymize<I35p85j063s0il>;
            "min_active_stake"?: Anonymize<I35p85j063s0il>;
            "min_commission"?: Anonymize<I4arjljr6dpflb>;
            "max_validators_count"?: Anonymize<I4arjljr6dpflb>;
            "max_nominators_count"?: Anonymize<I4arjljr6dpflb>;
            "current_era"?: Anonymize<I4arjljr6dpflb>;
            "active_era"?: (Anonymize<Ib3j7gb0jgs38u>) | undefined;
            "force_era"?: (StakingForcing) | undefined;
            "max_staked_rewards"?: Anonymize<I4arjljr6dpflb>;
            "slash_reward_fraction"?: Anonymize<I4arjljr6dpflb>;
            "canceled_slash_payout"?: Anonymize<I35p85j063s0il>;
            "current_planned_session"?: Anonymize<I4arjljr6dpflb>;
            "chill_threshold"?: Anonymize<I4arjljr6dpflb>;
        };
        "Invulnerables": Anonymize<Ia2lhg7l2hilo3>;
        "Bonded": {
            "stash": SS58String;
            "controller": SS58String;
        };
        "Ledger": {
            "controller": SS58String;
            "ledger": Anonymize<I69tqqtpr9n8ie>;
        };
        "Payee": {
            "stash": SS58String;
            "payment": StakingRewardDestination;
        };
        "Validators": {
            "stash": SS58String;
            "validators": Anonymize<I9o7ssi9vmhmgr>;
        };
        "Nominators": {
            "stash": SS58String;
            "nominations": Anonymize<Ic3m9d6tdl6gi2>;
        };
        "VirtualStakers": SS58String;
        "ErasStakersOverview": {
            "era": number;
            "validator": SS58String;
            "exposure": Anonymize<I6flrronqs3l6n>;
        };
        "ErasStakersPaged": {
            "era": number;
            "validator": SS58String;
            "page": number;
            "exposure": Anonymize<I97fulj5h3ik95>;
        };
        "ClaimedRewards": {
            "era": number;
            "validator": SS58String;
            "rewards": Anonymize<Icgljjb6j82uhn>;
        };
        "ErasValidatorPrefs": {
            "era": number;
            "validator": SS58String;
            "prefs": Anonymize<I9o7ssi9vmhmgr>;
        };
        "ErasValidatorReward": {
            "era": number;
            "reward": bigint;
        };
        "ErasRewardPoints": {
            "era": number;
            "points": Anonymize<Iff9p3c7k6pfoi>;
        };
        "ErasTotalStake": {
            "era": number;
            "total_stake": bigint;
        };
        "UnappliedSlashes": {
            "era": number;
            "slash": {
                "validator": SS58String;
                "own": bigint;
                "others": Anonymize<Iba9inugg1atvo>;
                "reporters": Anonymize<Ia2lhg7l2hilo3>;
                "payout": bigint;
            };
        };
        "BondedEras": Anonymize<I95g6i7ilua7lq>;
        "ValidatorSlashInEra": {
            "era": number;
            "validator": SS58String;
            "slash": Anonymize<I4ojmnsk1dchql>;
        };
    }>>;
};
export type Ics4uc7qr0bv8t = {
    "stage": Anonymize<I9134mhoe91oet>;
};
export type I5sgsmd01vj1nq = {
    "new": Anonymize<I2fbmombro6ugg>;
};
export type I6kmjpgojp035v = {
    "new"?: Anonymize<Ihfphjolmsqq1>;
};
export type Ibacrca7stumsr = {
    "data"?: Anonymize<I35p85j063s0il>;
    "cool_off_end_at": number;
};
export type I7ghpul17sf1lm = AnonymousEnum<{
    "System": Anonymize<Ifaoavjs71ibps>;
    "ParachainSystem": Anonymize<I3u72uvpuo4qrt>;
    "Timestamp": Anonymize<I7d75gqfg6jh9c>;
    "ParachainInfo": undefined;
    "Preimage": Anonymize<If81ks88t5mpk5>;
    "Scheduler": Anonymize<I4igssil1ghqt1>;
    "Parameters": Anonymize<I6a0l99iu4e4a8>;
    "MultiBlockMigrations": Anonymize<I4oqb168b2d4er>;
    "Balances": Anonymize<I9svldsp29mh87>;
    "Vesting": Anonymize<Icgf8vmtkbnu4u>;
    "Claims": Anonymize<Id0dj18ct09hlp>;
    "CollatorSelection": Anonymize<I9dpq5287dur8b>;
    "Session": Anonymize<I77dda7hps0u37>;
    "XcmpQueue": Anonymize<Ib7tahn20bvsep>;
    "PolkadotXcm": Anonymize<I6k1inef986368>;
    "CumulusXcm": undefined;
    "ToKusamaXcmRouter": Anonymize<I6epb28bkd5aqn>;
    "MessageQueue": Anonymize<Ic2uoe7jdksosp>;
    "SnowbridgeSystemFrontend": Anonymize<I15u4pbuusigel>;
    "Utility": Anonymize<Iah4up83vgshcm>;
    "Multisig": Anonymize<I81ia9f09158s0>;
    "Proxy": Anonymize<I5gdgqoglkja53>;
    "Indices": Anonymize<I67ac6i6ihmvpt>;
    "Assets": Anonymize<I885rd9smlqfti>;
    "Uniques": Anonymize<Icu49uv7rfej74>;
    "Nfts": Anonymize<Ibbvnm4ub46ibv>;
    "ForeignAssets": Anonymize<Iu9seb88fh81e>;
    "PoolAssets": Anonymize<I885rd9smlqfti>;
    "AssetConversion": Anonymize<Ia06pia7pbkurh>;
    "Treasury": Anonymize<Iepn86nr1kqtu0>;
    "ConvictionVoting": Anonymize<Ie5kd08tutk56t>;
    "Referenda": Anonymize<Iceildkgu1083p>;
    "Whitelist": Anonymize<I5itui6aqi55cc>;
    "Bounties": Anonymize<Idkeds3pi8flqr>;
    "ChildBounties": Anonymize<I1b6drdhvt5hl9>;
    "AssetRate": Anonymize<If582h5gr5gh6f>;
    "MultiAssetBounties": Anonymize<I5t09dnejpfl63>;
    "StateTrieMigration": Anonymize<I39l72gdmkk30t>;
    "NominationPools": Anonymize<I57mljkkr28m9p>;
    "VoterList": Anonymize<Ifvfo1l0vu2o7e>;
    "StakingRcClient": Anonymize<I63rog5r4bv585>;
    "MultiBlockElection": Anonymize<I12nq1ib9qhj82>;
    "MultiBlockElectionVerifier": undefined;
    "MultiBlockElectionUnsigned": Anonymize<I5suq7n956d9bl>;
    "MultiBlockElectionSigned": Anonymize<Ifnfj3imdjs5t>;
    "Staking": Anonymize<I9pf6vda7sd0qs>;
    "Revive": Anonymize<I4o0omq8ti34ea>;
    "Sudo": Anonymize<Il4cd6i49cqer>;
    "AhOps": Anonymize<Im5s4mco7v75d>;
    "AhMigrator": Anonymize<Ifr68a89kga40l>;
}>;
export type I6052turo9tavh = (Anonymize<I3qklfjubrljqh>) | undefined;
export type Iemk0s5gdc9ruv = (Anonymize<I78s05f59eoi8b>) | undefined;
export type Ia596n3f2p58pa = ResultPayload<Anonymize<I200n1ov5tbcvr>, Anonymize<I4u78hb23uhvi2>>;
export type I200n1ov5tbcvr = FixedSizeArray<2, bigint>;
export type Iba6ec6u9n2dc1 = FixedSizeArray<2, Anonymize<I35p85j063s0il>>;
export type Iaqet9jc3ihboe = {
    "header": Anonymize<Ic952bubvq4k7d>;
    "extrinsics": Anonymize<Itom7fk49o0c9>;
};
export type I2v50gu3s1aqk6 = AnonymousEnum<{
    "AllExtrinsics": undefined;
    "OnlyInherents": undefined;
}>;
export type I4ip92cejsh8vu = ResultPayload<Anonymize<Idqcgnrsbirg5n>, Anonymize<I5nrjkj9qumobs>>;
export type I5nrjkj9qumobs = AnonymousEnum<{
    "Invalid": Enum<{
        "Call": undefined;
        "Payment": undefined;
        "Future": undefined;
        "Stale": undefined;
        "BadProof": undefined;
        "AncientBirthBlock": undefined;
        "ExhaustsResources": undefined;
        "Custom": number;
        "BadMandatory": undefined;
        "MandatoryValidation": undefined;
        "BadSigner": undefined;
        "IndeterminateImplicit": undefined;
        "UnknownOrigin": undefined;
    }>;
    "Unknown": TransactionValidityUnknownTransaction;
}>;
export type TransactionValidityUnknownTransaction = Enum<{
    "CannotLookup": undefined;
    "NoUnsignedValidator": undefined;
    "Custom": number;
}>;
export declare const TransactionValidityUnknownTransaction: GetEnum<TransactionValidityUnknownTransaction>;
export type If7uv525tdvv7a = Array<[SizedHex<8>, Uint8Array]>;
export type I2an1fs2eiebjp = {
    "okay": boolean;
    "fatal_error": boolean;
    "errors": Anonymize<If7uv525tdvv7a>;
};
export type TransactionValidityTransactionSource = Enum<{
    "InBlock": undefined;
    "Local": undefined;
    "External": undefined;
}>;
export declare const TransactionValidityTransactionSource: GetEnum<TransactionValidityTransactionSource>;
export type I9ask1o4tfvcvs = ResultPayload<{
    "priority": bigint;
    "requires": Anonymize<Itom7fk49o0c9>;
    "provides": Anonymize<Itom7fk49o0c9>;
    "longevity": bigint;
    "propagate": boolean;
}, Anonymize<I5nrjkj9qumobs>>;
export type Icerf8h8pdu8ss = (Array<[Uint8Array, SizedHex<4>]>) | undefined;
export type I4gil44d08grh = {
    "prefix": SizedHex<16>;
    "suffix": SizedHex<16>;
};
export type I7u915mvkdsb08 = ResultPayload<Uint8Array, Enum<{
    "NotImplemented": undefined;
    "NotFound": Anonymize<I4gil44d08grh>;
    "Codec": undefined;
}>>;
export type I6spmpef2c7svf = {
    "weight": Anonymize<I4q39t5hn830vp>;
    "class": DispatchClass;
    "partial_fee": bigint;
};
export type Iei2mvq0mjvt81 = {
    "inclusion_fee"?: ({
        "base_fee": bigint;
        "len_fee": bigint;
        "adjusted_weight_fee": bigint;
    }) | undefined;
    "tip": bigint;
};
export type Iftvbctbo05fu4 = ResultPayload<Array<XcmVersionedAssetId>, Anonymize<Iavct6f844hfju>>;
export type Iavct6f844hfju = AnonymousEnum<{
    "Unimplemented": undefined;
    "VersionedConversionFailed": undefined;
    "WeightNotComputable": undefined;
    "UnhandledXcmVersion": undefined;
    "AssetNotFound": undefined;
    "Unroutable": undefined;
}>;
export type Ic0c3req3mlc1l = ResultPayload<Anonymize<I4q39t5hn830vp>, Anonymize<Iavct6f844hfju>>;
export type I7ocn4njqde3v5 = ResultPayload<bigint, Anonymize<Iavct6f844hfju>>;
export type Iek7ha36da9mf5 = ResultPayload<XcmVersionedAssets, Anonymize<Iavct6f844hfju>>;
export type I5e1f2dmpobegd = ResultPayload<{
    "execution_result": Anonymize<Iodeus2jc07q6>;
    "emitted_events": Anonymize<Ienp898kma3om8>;
    "local_xcm"?: (XcmVersionedXcm) | undefined;
    "forwarded_xcms": Anonymize<Ialhmrpub9sefe>;
}, Anonymize<I55ku9c5gk50hb>>;
export type Ienp898kma3om8 = Array<Anonymize<Ibm5gc614op21t>>;
export type Ialhmrpub9sefe = Array<[XcmVersionedLocation, Array<XcmVersionedXcm>]>;
export type I55ku9c5gk50hb = AnonymousEnum<{
    "Unimplemented": undefined;
    "VersionedConversionFailed": undefined;
}>;
export type Ia2g9rj22vtc71 = ResultPayload<{
    "execution_result": Anonymize<Ieqhmksji3pmv5>;
    "emitted_events": Anonymize<Ienp898kma3om8>;
    "forwarded_xcms": Anonymize<Ialhmrpub9sefe>;
}, Anonymize<I55ku9c5gk50hb>>;
export type Ieh6nis3hdbtgi = ResultPayload<SS58String, Enum<{
    "Unsupported": undefined;
    "VersionedConversionFailed": undefined;
}>>;
export type XcmVersionedAsset = Enum<{
    "V3": Anonymize<Idcm24504c8bkk>;
    "V4": Anonymize<Ia5l7mu5a6v49o>;
    "V5": Anonymize<Iffh1nc5e1mod6>;
}>;
export declare const XcmVersionedAsset: GetEnum<XcmVersionedAsset>;
export type Icujp6hmv35vbn = ResultPayload<boolean, Enum<{
    "VersionedAssetConversionFailed": undefined;
    "VersionedLocationConversionFailed": undefined;
}>>;
export type I4tjame31218k9 = ResultPayload<Anonymize<I41j3fc5ema929>, Anonymize<Iecgqth5sdfqqi>>;
export type Iecgqth5sdfqqi = AnonymousEnum<{
    "LocationVersionConversionFailed": undefined;
}>;
export type I5gif8vomct5i8 = ResultPayload<boolean, Anonymize<Iecgqth5sdfqqi>>;
export type I8fk5filgollou = ResultPayload<XcmVersionedAssets, Enum<{
    "AssetIdConversionFailed": undefined;
    "AmountToBalanceConversionFailed": undefined;
}>>;
export type Ic1d4u2opv3fst = {
    "upward_messages": Anonymize<Itom7fk49o0c9>;
    "horizontal_messages": Anonymize<I6r5cbv8ttrb09>;
    "new_validation_code"?: Anonymize<Iabpgqcjikia83>;
    "processed_downward_messages": number;
    "hrmp_watermark": number;
    "head_data": Uint8Array;
};
export type Ie9sr1iqcg3cgm = ResultPayload<undefined, string>;
export type I1mqgk2tmnn9i2 = (string) | undefined;
export type I6lr8sctk0bi4e = Array<string>;
export type I5vv5n03oo8gas = (Anonymize<I200n1ov5tbcvr>) | undefined;
export type I2na29tt2afp0j = FixedSizeArray<2, SS58String>;
export type Ies018ev98ebq7 = {
    "issuance": bigint;
    "next_mint": Anonymize<I200n1ov5tbcvr>;
};
export type Iel648dq935909 = {
    "weight_consumed": Anonymize<I4q39t5hn830vp>;
    "weight_required": Anonymize<I4q39t5hn830vp>;
    "storage_deposit": Anonymize<If7bmpttbdmqu4>;
    "max_storage_deposit": Anonymize<If7bmpttbdmqu4>;
    "gas_consumed": bigint;
    "result": ResultPayload<Anonymize<I620n7irgfspm4>, Anonymize<I72ju98lulovhp>>;
};
export type If7bmpttbdmqu4 = AnonymousEnum<{
    "Refund": bigint;
    "Charge": bigint;
}>;
export type I620n7irgfspm4 = {
    "flags": number;
    "data": Uint8Array;
};
export type I9sijb8gfrns29 = AnonymousEnum<{
    "Upload": Uint8Array;
    "Existing": SizedHex<32>;
}>;
export type I284b23t92u5po = {
    "weight_consumed": Anonymize<I4q39t5hn830vp>;
    "weight_required": Anonymize<I4q39t5hn830vp>;
    "storage_deposit": Anonymize<If7bmpttbdmqu4>;
    "max_storage_deposit": Anonymize<If7bmpttbdmqu4>;
    "gas_consumed": bigint;
    "result": ResultPayload<{
        "result": Anonymize<I620n7irgfspm4>;
        "addr": SizedHex<20>;
    }, Anonymize<I72ju98lulovhp>>;
};
export type I6f9v7emp7t5ba = {
    "access_list"?: (Anonymize<Ieap15h2pjii9u>) | undefined;
    "authorization_list": Anonymize<Ie0had75u5b8qk>;
    "blob_versioned_hashes": Anonymize<Ic5m5lp1oioo8r>;
    "blobs": Anonymize<Itom7fk49o0c9>;
    "chain_id"?: Anonymize<Ic4rgfgksgmm3e>;
    "from"?: Anonymize<If7b8240vgt2q5>;
    "gas"?: Anonymize<Ic4rgfgksgmm3e>;
    "gas_price"?: Anonymize<Ic4rgfgksgmm3e>;
    "input": {
        "input"?: Anonymize<Iabpgqcjikia83>;
        "data"?: Anonymize<Iabpgqcjikia83>;
    };
    "max_fee_per_blob_gas"?: Anonymize<Ic4rgfgksgmm3e>;
    "max_fee_per_gas"?: Anonymize<Ic4rgfgksgmm3e>;
    "max_priority_fee_per_gas"?: Anonymize<Ic4rgfgksgmm3e>;
    "nonce"?: Anonymize<Ic4rgfgksgmm3e>;
    "to"?: Anonymize<If7b8240vgt2q5>;
    "r#type"?: Anonymize<I4arjljr6dpflb>;
    "value"?: Anonymize<Ic4rgfgksgmm3e>;
};
export type Ida7d8eqrkav55 = ResultPayload<{
    "weight_required": Anonymize<I4q39t5hn830vp>;
    "storage_deposit": bigint;
    "max_storage_deposit": bigint;
    "eth_gas": Anonymize<I4totqt881mlti>;
    "data": Uint8Array;
}, Anonymize<I8mb9f26m2cgi5>>;
export type I8mb9f26m2cgi5 = AnonymousEnum<{
    "Data": Uint8Array;
    "Message": string;
}>;
export type Idmrtv8jbbitnu = {
    "timestamp_override"?: Anonymize<I35p85j063s0il>;
    "reserved": boolean;
};
export type Id20o5u3itehte = ResultPayload<{
    "code_hash": SizedHex<32>;
    "deposit": bigint;
}, Anonymize<I72ju98lulovhp>>;
export type Ieogbgh0dt6bkn = ResultPayload<Anonymize<Iabpgqcjikia83>, Enum<{
    "DoesntExist": undefined;
    "KeyDecodingFailed": undefined;
    "StorageWriteFailed": Anonymize<I72ju98lulovhp>;
}>>;
export type I63nhnkgg114n5 = AnonymousEnum<{
    "CallTracer"?: ({
        "with_logs": boolean;
        "only_top_call": boolean;
    }) | undefined;
    "PrestateTracer"?: ({
        "diff_mode": boolean;
        "disable_storage": boolean;
        "disable_code": boolean;
    }) | undefined;
}>;
export type I1l7ajs6s9ur3a = Array<[number, Anonymize<Id2kt2aov2rlb2>]>;
export type Id2kt2aov2rlb2 = AnonymousEnum<{
    "Call": Anonymize<I186drocjaqecc>;
    "Prestate": Enum<{
        "Prestate": Anonymize<I4ra24jtob05ku>;
        "DiffMode": {
            "pre": Anonymize<I4ra24jtob05ku>;
            "post": Anonymize<I4ra24jtob05ku>;
        };
    }>;
}>;
export type I186drocjaqecc = {
    "from": SizedHex<20>;
    "gas": Anonymize<I4totqt881mlti>;
    "gas_used": Anonymize<I4totqt881mlti>;
    "to": SizedHex<20>;
    "input": Uint8Array;
    "output": Uint8Array;
    "error"?: Anonymize<I1mqgk2tmnn9i2>;
    "revert_reason"?: Anonymize<I1mqgk2tmnn9i2>;
    "calls": Array<Anonymize<I186drocjaqecc>>;
    "logs": Array<{
        "address": SizedHex<20>;
        "topics": Anonymize<Ic5m5lp1oioo8r>;
        "data": Uint8Array;
        "position": number;
    }>;
    "value"?: Anonymize<Ic4rgfgksgmm3e>;
    "call_type": Enum<{
        "Call": undefined;
        "StaticCall": undefined;
        "DelegateCall": undefined;
        "Create": undefined;
        "Create2": undefined;
        "Selfdestruct": undefined;
    }>;
    "child_call_count": number;
};
export type I4ra24jtob05ku = Array<[SizedHex<20>, {
    "balance"?: Anonymize<Ic4rgfgksgmm3e>;
    "nonce"?: Anonymize<I4arjljr6dpflb>;
    "code"?: Anonymize<Iabpgqcjikia83>;
    "storage": Array<[Uint8Array, Anonymize<Iabpgqcjikia83>]>;
}]>;
export type Ice9mpbhevl5b7 = (Anonymize<Id2kt2aov2rlb2>) | undefined;
export type Idt5popft6i714 = ResultPayload<Anonymize<Id2kt2aov2rlb2>, Anonymize<I8mb9f26m2cgi5>>;
export type I512dtcl0pn07c = ResultPayload<Anonymize<I6cs1itejju2vv>, Enum<{
    "Value": undefined;
    "Dust": undefined;
}>>;
export {};
