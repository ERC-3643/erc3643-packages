import { useSigner } from '@usedapp/core'
import { useEligibilityVerification, useToken } from '@erc-3643/react-usedapp'
import { TOKEN_ADDRESS } from '../../constants'
import { useEffect, useState } from 'react'
import { StyledChip } from '../../components/Chip/Chip.styles'

const EligibilityVerificationInfo = () => {
  const signer = useSigner()
  const { getToken } = useToken(signer)
  const { getEligibilityVerification } = useEligibilityVerification(signer)
  const [identityRegistryAddress, setIdentityRegistryAddress] = useState('')
  const [verificationResult, setVerificationResult] = useState<any>(null)

  useEffect(() => {
    if (!signer) {
      return
    }

    ;(async () => {
      const token = await getToken(TOKEN_ADDRESS)

      if (token) {
        setIdentityRegistryAddress((token.identityRegistry) as string)
      }
    })()
  }, [signer])

  useEffect(() => {
    if (!identityRegistryAddress) {
      return
    }

    ;(async () => {
      setVerificationResult(await getEligibilityVerification(identityRegistryAddress, null))
    })()
  }, [identityRegistryAddress])

  return (
    <>
      <h3>Eligibility Verification:</h3>
      <div>
        Identity Is Verified:
        {verificationResult?.identityIsVerified ? (
          <StyledChip label='Yes' color='success' />
        ) : (
          <StyledChip label='No' color='error' />
        )}
      </div>
      <div>
        <p>Missing Claim Topics:</p>
        <div>
          <pre>{JSON.stringify(verificationResult?.missingClaimTopics ?? [], null, 4)}</pre>
        </div>
      </div>
      <div>
        <p>Invalid Claims: </p>
        <div>
          <pre>{JSON.stringify(verificationResult?.invalidClaims ?? [], null, 4)}</pre>
        </div>
      </div>
    </>
  )
}

export default EligibilityVerificationInfo
