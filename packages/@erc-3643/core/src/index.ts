import Container, { Token } from 'typedi';
import {
  ClaimIssuer,
  ClaimTopicsRegistry,
  Compliance,
  ComplianceModule,
  EligibilityVerification,
  IdentityRegistry,
  OnchainIDIdentity,
  TransferCompliance
} from '..';

export * from './token';
export * from './compliance';
export * from './compliance-module';
export * from './identity-registry';
export * from './claim-issuer';
export * from './claim-topics-registry';
export * from './onchain-id-identity';
export * from './claim-issuer';
export * from './transfer-compliance';
export * from './eligibility-verification';

export const ClaimIssuerContract = Container.get(ClaimIssuer);
export const ClaimTopicsRegistryContract = Container.get(ClaimTopicsRegistry);
export const ComplianceModuleContract = Container.get(ComplianceModule);
export const ComplianceContract = Container.get(Compliance);
export const getEligibilityVerification = Container.get(EligibilityVerification);
export const IdentityRegistryContract = Container.get(IdentityRegistry);
export const OnchainIDIdentityContract = Container.get(OnchainIDIdentity);
export const TokenContract = Container.get(Token);
export const getTransferCompliance = Container.get(TransferCompliance);
