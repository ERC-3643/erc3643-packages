import { useSigner } from '@usedapp/core'
import {
  useToken,
  useIdentityRegistry,
  useClaimTopicsRegistry,
  useClaimIssuer,
} from '@erc-3643/react-usedapp'
import { TOKEN_ADDRESS, ZERO_ADDRESS } from '../../constants'
import { useEffect, useState } from 'react'
import { useOnchainIDIdentity } from '@erc-3643/react-usedapp/src/hooks/useOnchainIDIdentity'

const EligibilityVerificationInfo = () => {
  const signer = useSigner()
  const token = useToken(TOKEN_ADDRESS, signer)
  const [signerAddress, setSignerAddress] = useState('')
  const [identityRegistryAddress, setIdentityRegistryAddress] = useState('')
  const identityRegistry = useIdentityRegistry(identityRegistryAddress, signer)
  const [identityIsVerified, setIdentityIsVerified] = useState(false)
  const [topicsRegistryAddress, setTopicsRegistryAddress] = useState('')
  const [identityAddress, setIdentityAddress] = useState('')
  const claimTopicsRegistry = useClaimTopicsRegistry(topicsRegistryAddress, signer)
  const onChainIdIdentity = useOnchainIDIdentity(identityAddress, signer)
  const [missingClaimTopics, setMissingClaimTopics] = useState<any[]>([])
  const [invalidClaims, setInvalidClaims] = useState<any[]>([])
  const { getClaimIssuer } = useClaimIssuer(signer)

  useEffect(() => {
    if (!signer) {
      return
    }

    ;(async () => {
      setSignerAddress(await signer.getAddress())
    })()
  }, [signer])

  useEffect(() => {
    if (!token) {
      return
    }

    ;(async () => {
      const address = await token.identityRegistry()
      setIdentityRegistryAddress(address)
    })()
  }, [token])

  useEffect(() => {
    if (!identityRegistry || !signerAddress) {
      return
    }

    ;(async () => {
      const identityIsVerified = identityRegistry.isVerified(signerAddress)
      setIdentityIsVerified(identityIsVerified)

      if (identityIsVerified) {
        const identityAddress = await identityRegistry.identity(signerAddress)
        setIdentityAddress(identityAddress)

        if (identityAddress === ZERO_ADDRESS) {
          console.log(`There is no OnChainID associated with address ${signerAddress}`)
        } else {
          setTopicsRegistryAddress(await identityRegistry.topicsRegistry())
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
    <div>
      <h3>Eligibility Verification:</h3>
    </div>
  )
}

export default EligibilityVerificationInfo
