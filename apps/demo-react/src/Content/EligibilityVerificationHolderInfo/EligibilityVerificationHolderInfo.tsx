import { EligibilityVerificationHolder } from '@erc-3643/react-usedapp'
import { useSigner } from '@usedapp/core'
import { Signer } from '@ethersproject/abstract-signer'
import { useEffect, useState } from 'react'
import { TOKEN_ADDRESS } from '../../constants'

const EligibilityVerificationHolderInfo = () => {
  const signer = useSigner()
  const [signerAddress, setSignerAddress] = useState('')

  useEffect(() => {
    if (!signer) {
      return
    }

    ;(async () => {
      setSignerAddress(await signer.getAddress())
    })()
  }, [signer])

  return (
    <>
      <h3>Holder eligibility verification:</h3>
      <div>
        <EligibilityVerificationHolder
          tokenAddress={TOKEN_ADDRESS}
          walletAddress={signerAddress}
          signer={signer as Signer}
        />
      </div>
    </>
  )
}

export default EligibilityVerificationHolderInfo
