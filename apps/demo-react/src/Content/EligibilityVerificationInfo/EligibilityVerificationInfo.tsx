import { useSigner } from '@usedapp/core'
import {
  ClaimTopicsRegistry,
  IdentityRegistry,
  Token,
  useClaimIssuer,
  useClaimTopicsRegistry,
  useIdentityRegistry,
  useToken,
} from '@erc-3643/react-usedapp'
import { TOKEN_ADDRESS, ZERO_ADDRESS } from '../../constants'
import { useEffect, useState } from 'react'
import {
  OnchainIDIdentity,
  useOnchainIDIdentity,
} from '@erc-3643/react-usedapp/src/hooks/useOnchainIDIdentity'

const EligibilityVerificationInfo = () => {
  const signer = useSigner()
  const { getToken } = useToken(signer)
  const [token, setToken] = useState<Token | null>(null)
  const [signerAddress, setSignerAddress] = useState('')
  const { getIdentityRegistry } = useIdentityRegistry(signer)
  const [identityRegistry, setIdentityRegistry] = useState<IdentityRegistry | null>(null)
  const [identityIsVerified, setIdentityIsVerified] = useState(false)
  const [identityAddress, setIdentityAddress] = useState('')
  const { getClaimTopicsRegistry } = useClaimTopicsRegistry(signer)
  const [claimTopicsRegistry, setClaimTopicsRegistry] = useState<ClaimTopicsRegistry | null>(null)
  const { getOnchainIDIdentity } = useOnchainIDIdentity(signer)
  const [onChainIdIdentity, setOnChainIdIdentity] = useState<OnchainIDIdentity | null>(null)
  const [missingClaimTopics, setMissingClaimTopics] = useState<any[]>([])
  const [invalidClaims, setInvalidClaims] = useState<any[]>([])
  const { getClaimIssuer } = useClaimIssuer(signer)

  useEffect(() => {
    if (!signer) {
      return
    }

    ;(async () => {
      setToken(await getToken(TOKEN_ADDRESS))
      setSignerAddress(await signer.getAddress())
    })()
  }, [signer])

  useEffect(() => {
    if (!token) {
      return
    }

    ;(async () => {
      const address = await token.identityRegistry()
      setIdentityRegistry(getIdentityRegistry(address))
    })()
  }, [token])

  useEffect(() => {
    if (!identityRegistry || !signerAddress) {
      return
    }

    ;(async () => {
      const identityIsVerified = await identityRegistry.isVerified(signerAddress)
      setIdentityIsVerified(identityIsVerified)

      if (!identityIsVerified) {
        const identityAddress = await identityRegistry.identity(signerAddress)
        setIdentityAddress(identityAddress)
        setOnChainIdIdentity(getOnchainIDIdentity(identityAddress))

        if (identityAddress === ZERO_ADDRESS) {
          console.log(`There is no OnChainID associated with address ${signerAddress}`)
        } else {
          const topicsRegistryAddress = await identityRegistry.topicsRegistry()
          setClaimTopicsRegistry(getClaimTopicsRegistry(topicsRegistryAddress))
        }
      }
    })()
  }, [identityRegistry, signerAddress])

  useEffect(() => {
    setMissingInvalidClaims()
  }, [claimTopicsRegistry, onChainIdIdentity])

  const setMissingInvalidClaims = async () => {
    if (!claimTopicsRegistry || !onChainIdIdentity) {
      return
    }

    const claimTopics = await claimTopicsRegistry.getClaimTopics()

    for (const topic of claimTopics) {
      const claimIds = await onChainIdIdentity.getClaimIdsByTopic(topic)

      if (!claimIds.length) {
        setMissingClaimTopics([...missingClaimTopics, topic])
      }

      for (const claimId of claimIds) {
        const claim = await onChainIdIdentity.getClaim(claimId)

        const claimIssuer = getClaimIssuer(claim.issuer)

        if (!claimIssuer) {
          continue
        }

        const isValid = await claimIssuer.isClaimValid(
          identityAddress,
          topic,
          claim.signature,
          claim.data,
        )

        if (!isValid) {
          setInvalidClaims([...invalidClaims, claim])
        }
      }
    }
  }

  return (
    <>
      <h3>Eligibility Verification:</h3>
      <div>Identity Is Verified: {identityIsVerified ? 'Yes' : 'No'}</div>
      <div>Missing Claim Topics: {JSON.stringify(missingClaimTopics, null, 4)}</div>
      <div>Invalid Claims: {JSON.stringify(invalidClaims, null, 4)}</div>
    </>
  )
}

export default EligibilityVerificationInfo
